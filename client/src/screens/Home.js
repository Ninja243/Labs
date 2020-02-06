import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ActivityIndicator } from 'react-native'
import { createAppContainer, ThemeColors } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { AuthSession, Linking } from 'expo';
import jwtDecode from 'jwt-decode';

import Footer from '../components/footer';
import { s1, s2 } from '../components/translations';

import { increment } from '../actions/index.js';
import { logIn } from '../actions/index.js';
import { setReady } from '../actions/index.js'

import { bindActionCreators } from 'redux';
import { GenIcon } from 'react-icons/lib/cjs';
import { enableExpoCliLogging } from 'expo/build/logs/Logs';

import endpointTestClass from '../tests/Endpoints.js'

// Black magic
// https://stackoverflow.com/questions/59589158/expo-authsession-immediately-resolves-as-dismissed
function pray() {
    if (AppState.currentState === "") { }
}

// Random string generator for nonce
function randomString(length) {
    var result = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return result;
}
// Auth0 constants -> 7GnUDOPZ1mUSsxq2OFKQph1tPD36di7B
const auth0ClientId = '7GnUDOPZ1mUSsxq2OFKQph1tPD36di7B';
const auth0Domain = 'https://mweya-labs.eu.auth0.com';
// Converts an object to a query string.
function toQueryString(params) {
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

export class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    state = {
        accepted: false,
        pEndpointTest: "Not updated",
        psEndpointTest: "Not updated",
        eEndpointTest: "Not updated",
        lastSilentCheck: Date.now(),
        debugMode: true
    }

    toString = s => {
        var i = 0;
        var string = "";
        while (i < s.length) {
            if (i == s.length - 1) {
                string = string + "\n JWT: " + s[i] + "\n";
            } else {
                string = string + s[i] + ",\n";
            }

            i = i + 1
        }

        return string;
    }

    init = async () => {
        // Create account if none exists
        // TEST
        // Load account details if not cached
        // Nav to splash screen
        const { navigate } = this.props.navigation;

        // TEST
        /*var i = 0;
        while (i < 1000) {
            console.log(i);
            i = i + 1;
        }*/
        const setReady = this.props.setReady;
        const readyState = this.props.ready;
        //console.log("Ready ->", readyState);
        //console.log(setReady);
        setReady(true);

        //console.log("Ready ->",readyState);
        //console.log("ready ->", this.state.ready)
        //navigate("Splash");
        this.privEndpointTest();
        this.privScopedEndpointTest();
    }


    // NEEDS REWRITE
    logout = () => {

        const deauthURL = "https://mweya-labs.eu.auth0.com/v2/logout?returnTo=";
        //AuthSession.dismiss();
        /*const response = await AuthSession.startAsync({deauthURL});
        console.log('Deauth response', response);
        if (response.type === 'success') {
          this.handleResponse(response.params);
        }*/
        /*await Linking.openURL(
          //config.logoutUrl +
          deauthURL +
            encodeURIComponent(
              ""
            ) 
            +"&client_id="+
            encodeURIComponent(auth0ClientId)// __DEV__ ? "exp://localhost:19000" : "app:/callback"
        );*/
        // TODO WARNING AuthOut has been replaced by LogOut which takes an empty array
        fetch(deauthURL + encodeURIComponent("") + "&client_id=" + encodeURIComponent(auth0ClientId))
            .then((response) => response.text())
            .then((code) => {
                // I kinda hate myself for this one
                if (code === "OK") {

                    const logIn = this.props.logIn;
                    var p = [];
                    logIn(p);
                    return true;
                }

            })
            .catch((error) => {
                console.error(error, ", logging out anyway");
            });
        const logIn = this.props.logIn;
        var p = [];
        logIn(p);
    }

    // Silent auth for refreshing
    silentLogin = async () => {
        pray();
        //console.log("v");
        const setReady = this.props.setReady;
        setReady(false);
        const redirectUrl = "https://auth.expo.io/@mweya/labsclient";
        const queryParams = toQueryString({
            response_type: "id_token token",
            client_id: auth0ClientId,
            redirect_uri: redirectUrl,
            state: "wot",
            scope: "openid profile name email",
            audience: "LabsGolangAPI",
            response_mode: "wot",
            prompt: "none"
        });
        const authUrl = `${auth0Domain}/authorize` + queryParams;
        //console.log(authUrl);
        // Perform the authentication
        //const response = await AuthSession.startAsync({ authUrl });
        try {
            await fetch(authUrl).then((response) => (response.text())
                .then((code) => {
                    //console.log("Silent Auth ->", code);
                    if (response.type === 'success') {
                        //console.log(response);
                        console.log(code);
                        if (this.handleResponse(response.params)) {
                            return true;
                        }
                    } else {
                        // Silent auth failed, log in normally
                        this.logout();
                    }
                }))
        } catch (e) {
            // Silent auth failed, log in normally
            this.logout();
        }
        //console.log('Authentication response', response);

    }

    // Not silent
    login = async () => {
        pray();
        const setReady = this.props.setReady;
        setReady(false);
        // Retrieve the redirect URL, add this to the callback URL list
        // of your Auth0 application.
        const redirectUrl = "https://auth.expo.io/@mweya/labsclient";//"exp://tz-ytd.mweya.client.exp.direct:80";//"exp://auth.expo.io/@mweya/Labs";//= AuthSession.getRedirectUrl();
        //console.log(`Redirect URL: ${retdirectUrl}`);

        // Structure the auth parameters and URL //LabsGolangAPI
        const queryParams = toQueryString({
            audience: "LabsGolangAPI",
            client_id: auth0ClientId,
            connection: "google-oauth2",
            redirect_uri: redirectUrl,
            response_type: 'token id_token', // token -> Auth token (jwt), id_token -> Info about the person
            scope: 'openid profile name email', // retrieve the user's profile
            nonce: randomString(5),//'nonce', // ideally, this will be a random value, TODO actually check the nonce to see if it matches
        });
        const authUrl = `${auth0Domain}/authorize` + queryParams;
        //console.log(authUrl);
        // Perform the authentication
        const response = await AuthSession.startAsync({ authUrl });
        //console.log('Authentication response', response);
        if (response.type === 'success') {
            //console.log(response);
            if (this.handleResponse(response.params)) {
                return true;
            }
        }
    };

    handleResponse = (response) => {
        if (response.errorCode) {
            Alert('Authentication error', response.error_description || 'something went wrong');
            return false;
        }

        // Retrieve the JWT token and decode it
        const jwtToken = response.id_token;
        const access_token = response.access_token;
        const decoded = jwtDecode(jwtToken);
        const { name, given_name, family_name, nickname, email } = decoded;
        //var profile = {
        //    name: name,
        //    given_name: given_name,
        //    family_name: family_name,
        //    nickname: nickname,
        //    email: email,
        //};
        //console.log(profile);
        var p = [];
        p.push(name);
        p.push(given_name);
        p.push(family_name);
        p.push(nickname);
        p.push(email);
        // Should probably save the token tbh
        p.push(access_token);
        //console.log("Before redux -> ", p);
        const logIn = this.props.logIn;
        logIn(p);
        return true;
        //console.log("Handled ->", );

    };


    render() {

        const { navigate } = this.props.navigation;
        const i = this.props.i;
        var profile = this.props.profile;
        const readyState = this.props.ready;
        console.log(this.props.profile);
        // Do NOT put API calls in the render method
        //if (profile.length != 0) {
        //    this.privEndpointTest();
        //epResult  = this.getEndpointText();
        //    this.privScopedEndpointTest();
        //}

        //console.log(readyState);
        //console.log(profile);
        //const setReady = this.props.setReady;
        //setReady(true);

        // TODO
        // If the app is ready or undefined, we should have a JWT saved.
        // The saved JWT should be able to be used to pull the splash labs from the server.
        return (
            (profile.length == 0) ?
                this.state.accepted ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <Button style={{ alignSelf: 'center' }} title="Log in with a google account" onPress={
                            () => {
                                if (this.login()) {
                                    this.init();

                                }
                            }
                        } />
                        <View style={{ width: '50%', paddingTop: 40, paddingBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                            <Text style={{ fontSize: 15 }}>"I have read and agree with the Privacy Policy and Terms of Service"</Text>
                            <Text style={{ alignSelf: 'flex-end' }}>-You</Text>
                            <View style={{ paddingTop: 10, alignSelf: 'flex-start' }}>
                                <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/privacy' })}>
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/terms' })}>
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 10, }}>
                                <Text style={{ paddingRight: 100 }}>Agreed</Text>
                                <Switch onValueChange={() => { this.setState({ accepted: false }) }} value={this.state.accepted} thumbColor="rgba(0, 122, 255, 1)" />
                            </View>
                        </View>

                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <Button style={{ alignSelf: 'center' }} title="Log in with a google account" disabled />
                        <View style={{ width: '50%', paddingTop: 40, paddingBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                            <Text>You need to have read and agreed with the Privacy Policy and the Terms of Service to use this app. Tap the links below to read them.</Text>
                            <View style={{ paddingTop: 10, alignSelf: 'flex-start' }}>
                                <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/privacy' })}>
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/terms' })}>
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                                </TouchableOpacity >
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 10, }}>
                                <Text style={{ paddingRight: 100 }}>Agreed</Text>
                                <Switch onValueChange={() => { this.setState({ accepted: true }) }} value={this.state.accepted} />
                            </View>
                        </View>

                    </View>
                :
                // Undefined if the app didn't have time to set it when starting
                (readyState == true || readyState == undefined) ?
                    (this.state.debugMode == true) ?
                        <ScrollView>
                            <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"User Profile"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>

                                <Text>{profile[0].toString()}</Text>

                            </View>

                            <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Private Endpoint Test"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>

                                <Text>{this.state.pEndpointTest.toString()}</Text>

                            </View>
                            <Button style={{ alignSelf: 'center' }} title="Update" onPress={
                                () => {
                                    let obj = new endpointTestClass(i, profile, readyState);
                                    var x = obj.privEndpointTest();
                                    //console.log(x);
                                    this.setState({ pEndpointTest: x });
                                    //console.log(this.state.pEndpointTest);
                                }
                            } />
                            <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Priv Scoped Endpoint Test"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>

                                <Text>{this.state.psEndpointTest}</Text>

                            </View>
                            <Button style={{ alignSelf: 'center' }} title="Update" onPress={
                                () => {
                                    let obj = new endpointTestClass(i, profile, readyState);
                                    var x = obj.scopedEndpointTest();
                                    this.setState({ psEndpointTest: x });
                                }
                            } />
                            <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Echo Endpoint Test"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>

                                <Text>{this.state.eEndpointTest}</Text>

                            </View>
                            <Button style={{ alignSelf: 'center' }} title="Update" onPress={
                                () => {
                                    let obj = new endpointTestClass(i, profile, readyState);
                                    var x = obj.echoEndpointTest();
                                    this.setState({ eEndpointTest: x });
                                }
                            } />
                        </ScrollView>
                        :
                        <ScrollView>
                            <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Splash Screen"}</Text>
                        </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ width: '50%', paddingTop: 40, paddingBottom: 10, flexDirection: 'column', }}>

                            <View style={{ paddingBottom: 70, alignSelf: "center" }}>
                                <Text style={{ color: 'rgba(144,144,146,1)', fontSize: 20 }}>Hey {profile[0][1]}, we're setting things up for you.</Text>
                                <Text style={{ color: 'rgba(164,164,166,1)', paddingLeft: 40 }}>This won't take long.</Text>
                            </View>
                            <ActivityIndicator size="large" color={"rgba(0, 122, 255, 1)"} />

                        </View>

                    </View>
        );
    }
}

// Redux

/*const mapStateToProps = (state) => {
    const { profile } = state.blank.profile
    return { profile }
};*/
const mapStateToProps = (state) => {
    return {
        i: state.blank.i,
        profile: state.blank.profile,
        readyState: state.blank.ready
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        increment: () => dispatch(increment()),
        logIn: p => dispatch(logIn(p)),
        setReady: b => dispatch(setReady(b))
    };
};
/*const mapDispatchToProps = dispatch => (
    bindActionCreators({
        authIn,
    }, dispatch)
);*/

//export default connect(mapStateToProps)(HomeScreen);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
/*

*/
/*
/*eturn (
      <View style={styles.container}>
        {
          name ?
            <View><Text style={styles.title}>Hello {name}!</Text><Button title="Log out" onPress={this.logout} /></View> :

        }
      </View>
       <SafeAreaView>

                <ScrollView>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingTop: 170 }}>

                        <View style={{ alignSelf: 'center', paddingLeft: 20, paddingRight: 20 }}><Button
                            title={s1}
                            onPress={() => navigate('Code')}
                        /></View>

                        <View style={{ alignSelf: 'center', paddingLeft: 20, paddingRight: 20 }}><Button
                            title={s2}
                            onPress={() => navigate('Options')}
                        /></View>

                    </View>

                </ScrollView>
                <Footer style={{position: "absolute", bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',}}/>
            </SafeAreaView>
    );*/