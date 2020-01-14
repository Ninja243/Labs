import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect } from 'react-native'
import { createAppContainer, ThemeColors } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { AuthSession, Linking } from 'expo';
import jwtDecode from 'jwt-decode';

import Footer from '../components/footer';
import { s1, s2 } from '../components/translations';
import QuoteBlock from '../components/quoteBlock';

import { bindActionCreators } from 'redux';
import { authIn } from '../components/actions';
import { GenIcon } from 'react-icons/lib/cjs';

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
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    state = {
        accepted: false
    }



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
        // Retrieve the redirect URL, add this to the callback URL list
        // of your Auth0 application.
        const redirectUrl = "exp://tz-ytd.mweya.client.exp.direct:80";//"exp://auth.expo.io/@mweya/Labs";//= AuthSession.getRedirectUrl();
        //console.log(`Redirect URL: ${retdirectUrl}`);

        // Structure the auth parameters and URL
        const queryParams = toQueryString({
            client_id: auth0ClientId,
            redirect_uri: redirectUrl,
            response_type: 'id_token', // id_token will return a JWT token
            scope: 'openid profile name email', // retrieve the user's profile
            nonce: randomString(5),//'nonce', // ideally, this will be a random value
        });
        const authUrl = `${auth0Domain}/authorize` + queryParams;
        //console.log(authUrl);
        // Perform the authentication
        const response = await AuthSession.startAsync({ authUrl });
        console.log('Authentication response', response);

        if (response.type === 'success') {
            this.handleResponse(response.params);
        }
    };

    handleResponse = (response) => {
        if (response.errorCode) {
            Alert('Authentication error', response.error_description || 'something went wrong');
            return;
        }

        // Retrieve the JWT token and decode it
        const jwtToken = response.id_token;
        const decoded = jwtDecode(jwtToken);

        const { name, given_name, family_name, nickname, email } = decoded;
        var profile = {
            name: name,
            given_name: given_name,
            family_name: family_name,
            nickname: nickname,
            email: email,
        };
        this.props.authIn(profile);
    };

    render() {
        const { navigate } = this.props.navigation;

        return (
            this.props.profile.name !== null ?

                this.state.accepted ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <QuoteBlock />
                        <Button style={{ alignSelf: 'center' }} title="Log in with Auth0 or Google" onPress={() => { this.login() }} />
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
                        <QuoteBlock />
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <QuoteBlock />
                        <Button style={{ alignSelf: 'center' }} title="Log in with Auth0 or Google" onPress={() => { this.login() }} disabled />
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
                        <QuoteBlock />
                    </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <QuoteBlock />
                    <View style={{ width: '50%', paddingTop: 40, paddingBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                        <Text>Hello {this.props.profile}!</Text>
                    </View>
                    <QuoteBlock />
                </View>
        );
    }
}

// Redux

const mapStateToProps = (state) => {
    const { profile } = state
    return { profile }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        authIn,
    }, dispatch)
);

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