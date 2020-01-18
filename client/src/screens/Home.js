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
// Auth0 constants
const auth0ClientId = 'KLciWpxigi9TW81egFgImpCx5bEFTNgq';
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
        endpointTest: "Not updated",

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
    }

    privEndpointTest = () => {
        const profile = this.props.profile;
        var x;
        if (profile.length != 0) {
            x = profile[0].length - 1;
        } else { 
            console.log("Profile", profile)
        }
        const hdrs = {
            'Authorization': 'Bearer ' + profile[0][x],
            
        };
        console.log(hdrs)
        fetch("https://jl.x-mweya.duckdns.org/api/private" + toQueryString({
            audience: "LabsGolangAPI",
        }), {
            method: "GET",
            headers: hdrs
            
        })
            .then((response) => response.text())
            .then((quote) => {
                this.setState({
                    endpointTest: quote
                })
            })
            .done();
    }


    // NEEDS REWRITE
    logout = async () => {
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
        await fetch(deauthURL + encodeURIComponent("") + "&client_id=" + encodeURIComponent(auth0ClientId))
            .then((response) => response.text())
            .then((code) => {
                console.log(code);
                var profile = {
                    name: null,
                    given_name: null,
                    family_name: null,
                    nickname: null,
                    email: null,
                };
                if (code === "OK") {
                    this.props.authOut(profile)
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }



    login = async () => {
        pray();
        const setReady = this.props.setReady;
        setReady(false);
        // Retrieve the redirect URL, add this to the callback URL list
        // of your Auth0 application.
        const redirectUrl = "https://auth.expo.io/@mweya/labsclient";//"exp://tz-ytd.mweya.client.exp.direct:80";//"exp://auth.expo.io/@mweya/Labs";//= AuthSession.getRedirectUrl();
        //console.log(`Redirect URL: ${retdirectUrl}`);

        // Structure the auth parameters and URL
        const queryParams = toQueryString({
            audience: "LabsGolangAPI",
            client_id: auth0ClientId,
            redirect_uri: redirectUrl,
            response_type: 'id_token', // id_token will return a JWT token
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
        const decoded = jwtDecode(jwtToken);
        //console.log(decoded);
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
        p.push(jwtToken);
        //console.log("Before redux -> ", p);
        const logIn = this.props.logIn;
        logIn(p);
        return true;
        //console.log("Handled ->", );

    };



    render() {
        const { navigate } = this.props.navigation;
        const i = this.props.i;
        const profile = this.props.profile;
        const readyState = this.props.ready;
        if (profile.length != 0) {
            this.privEndpointTest();
            
        }
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
                    <ScrollView>
                        <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"User Profile"}</Text>
                        <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>

                            <Text>{profile[0].toString()}</Text>

                        </View>
                        <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Private Endpoint Test"}</Text>
                        <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>

                            <Text>{this.state.endpointTest}</Text>

                        </View>
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