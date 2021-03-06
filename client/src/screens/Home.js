import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ActivityIndicator } from 'react-native'
import { createAppContainer, ThemeColors } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { AuthSession, Linking } from 'expo';
import jwtDecode from 'jwt-decode';

import { Feather } from '@expo/vector-icons'

import Footer from '../components/footer';
import { s1, s2 } from '../components/translations';

import { increment, logOut } from '../actions/index.js';
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
        debugMode: true,
        loginFailed: false
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
            //console.log(i);
            i = i + 1;
        }*/
        const setReady = this.props.setReady;
        const readyState = this.props.ready;
        //console.log("Ready ->", readyState);
        //console.log(setReady);
        // TODO testing
        setReady(true);

        //console.log("Ready ->",readyState);
        //console.log("ready ->", this.state.ready)
        //navigate("Splash");
        //this.privEndpointTest();
        //this.privScopedEndpointTest();
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
                        //console.log(code);
                        if (this.handleResponse(response.params)) {
                            return true;
                        }
                    } else {
                        // Silent auth failed, log in normally
                        const logOut = this.props.logOut;
                        logOut()
                    }
                }))
        } catch (e) {
            // Silent auth failed, log in normally
            return e
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
            const { navigate } = this.props.navigation;
            navigate("FatalError", {
                message: "While trying to log you in, the API said " + response.error_description.replace("\n", "") + " which is really rude and quite frankly, uncalled for. We're sorry for it's behaviour."
            });
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

        // Account serverside plz
        var accserverurl = 'https://jl.x-mweya.duckdns.org/account';

        fetch(accserverurl, {
            method: "PUT",
            headers: {
                'User-Agent': 'Labs v1',
                'Authorization': 'Bearer ' + p[p.length - 1]
            }
        })
            .then((response) => {
                if (response.status == 200 || response.status == 409) {
                    const logIn = this.props.logIn;
                    logIn(p);
                    return true;
                } else {
                    const { navigate } = this.props.navigation;
                    navigate("FatalError", { message: "While trying to create your account on our awesome servers, we got a " + response.status + " response, which is really weird." })
                }
            })

            ;



        //console.log("Handled ->", );

    };


    render() {

        const { navigate } = this.props.navigation;
        const i = this.props.i;
        var profile = this.props.profile;
        const readyState = this.props.ready;
        // TESTING
        return (
            (profile.length == 0) ?
                this.state.accepted ?
                    this.state.loginFailed ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <Button style={{ alignSelf: 'center' }} title="Log in with a google account" onPress={
                                () => {
                                    if (this.login()) {
                                        this.init();

                                    }
                                }
                            }
                                color='rgba(0, 122, 255, 1)' />
                            <View style={{ width: '50%', marginTop: 40, marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                                <Text style={{ fontSize: 15 }}>"I have read and agree with the Privacy Policy and Terms of Service"</Text>
                                <Text style={{ alignSelf: 'flex-end' }}>-You</Text>
                                <View style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/privacy' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/terms' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, }}>
                                    <Text style={{ marginRight: 100 }}>Agreed</Text>
                                    <Switch onValueChange={() => { this.setState({ accepted: false }) }} value={this.state.accepted} thumbColor="rgba(0, 122, 255, 1)" />
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, }}>
                                    <Text style={{ fontSize: 15 }}>Having issues logging in? Make sure Google Chrome is your default browser!</Text>
                                </View>
                            </View>

                        </View>
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <Button style={{ alignSelf: 'center' }} title="Log in with a google account" onPress={
                                () => {
                                    if (this.login()) {
                                        this.init();

                                    }
                                    this.setState({
                                        loginFailed: true
                                    })
                                }
                            }
                                color='rgba(0, 122, 255, 1)' />
                            <View style={{ width: '50%', marginTop: 40, marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                                <Text style={{ fontSize: 15 }}>"I have read and agree with the Privacy Policy and Terms of Service"</Text>
                                <Text style={{ alignSelf: 'flex-end' }}>-You</Text>
                                <View style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/privacy' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/terms' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, }}>
                                    <Text style={{ marginRight: 100 }}>Agreed</Text>
                                    <Switch onValueChange={() => { this.setState({ accepted: false }) }} value={this.state.accepted} thumbColor="rgba(0, 122, 255, 1)" />
                                </View>
                            </View>

                        </View>
                    :
                    this.state.loginFailed ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <Button style={{ alignSelf: 'center' }} title="Log in with a google account" disabled />
                            <View style={{ width: '50%', marginTop: 40, marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                                <Text>You need to have read and agreed with the Privacy Policy and the Terms of Service to use this app. Tap the links below to read them.</Text>
                                <View style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/privacy' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/terms' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                                    </TouchableOpacity >
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, }}>
                                    <Text style={{ marginRight: 100 }}>Agreed</Text>
                                    <Switch onValueChange={() => { this.setState({ accepted: true }) }} value={this.state.accepted} />
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, }}>
                                    <Text style={{ fontSize: 15 }}>Having issues logging in? Make sure Google Chrome is your default browser!</Text>
                                </View>
                            </View>

                        </View>
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <Button style={{ alignSelf: 'center' }} title="Log in with a google account" disabled />
                            <View style={{ width: '50%', marginTop: 40, marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                                <Text>You need to have read and agreed with the Privacy Policy and the Terms of Service to use this app. Tap the links below to read them.</Text>
                                <View style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/privacy' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/terms' })}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                                    </TouchableOpacity >
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, }}>
                                    <Text style={{ marginRight: 100 }}>Agreed</Text>
                                    <Switch onValueChange={() => { this.setState({ accepted: true }) }} value={this.state.accepted} />
                                </View>

                            </View>

                        </View>
                :
                // Undefined if the app didn't have time to set it when starting
                (readyState == true || readyState == undefined) ?
                    (this.state.debugMode == false) ?
                        <ScrollView>
                            <Text style={{ color: 'rgba(44,44,46,1)', marginBottom: 10, marginTop: 20, marginLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"User Profile"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', margin: 5 }}>

                                <Text>{profile[0].toString()}</Text>

                            </View>

                            <Text style={{ color: 'rgba(44,44,46,1)', marginBottom: 10, marginTop: 20, marginLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Private Endpoint Test"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', margin: 5 }}>

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
                            <Text style={{ color: 'rgba(44,44,46,1)', marginBottom: 10, marginTop: 20, marginLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Priv Scoped Endpoint Test"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', margin: 5 }}>

                                <Text>{this.state.psEndpointTest}</Text>

                            </View>
                            <Button style={{ alignSelf: 'center' }} title="Update" onPress={
                                () => {
                                    let obj = new endpointTestClass(i, profile, readyState);
                                    var x = obj.scopedEndpointTest();
                                    this.setState({ psEndpointTest: x });
                                }
                            } />
                            <Text style={{ color: 'rgba(44,44,46,1)', marginBottom: 10, marginTop: 20, marginLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"Echo Endpoint Test"}</Text>
                            <View style={{ backgroundColor: 'rgba(199,199,204,1)', margin: 5 }}>

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
                            <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: '60%' }}>

                                <TouchableOpacity onPress={() => { navigate('UploadForm') }} style={{}}>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                        <Feather name="upload-cloud" size={40} color="rgba(0, 122, 255, 1)" />
                                        <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 30 }}> UPLOAD</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { navigate('DownloadForm') }} style={{ marginTop: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                        <Feather name="download-cloud" size={40} color="rgba(0, 122, 255, 1)" />
                                        <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 30 }}> BROWSE</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { navigate('Settings'), { userName: 'Lucy' } }} style={{ marginTop: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                        <Feather name="settings" size={40} color="rgba(0, 122, 255, 1)" />
                                        <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 30 }}> SETTINGS</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ width: '50%', marginTop: 40, marginBottom: 10, flexDirection: 'column', }}>

                            <View style={{ marginBottom: 70, alignSelf: "center" }}>
                                <Text style={{ color: 'rgba(144,144,146,1)', fontSize: 20 }}>Hey {profile[0][1]}, we're setting things up for you.</Text>
                                <Text style={{ color: 'rgba(164,164,166,1)', marginLeft: 40 }}>This won't take long.</Text>
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
        setReady: b => dispatch(setReady(b)),
        logOut: () => dispatch(logOut())
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 170 }}>

                        <View style={{ alignSelf: 'center', marginLeft: 20, marginRight: 20 }}><Button
                            title={s1}
                            onPress={() => navigate('Code')}
                        /></View>

                        <View style={{ alignSelf: 'center', marginLeft: 20, marginRight: 20 }}><Button
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