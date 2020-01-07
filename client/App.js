import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AuthSession, Linking } from 'expo';
import jwtDecode from 'jwt-decode';

import CodeScreen from './screens/Code.js';
import HomeScreen from './screens/Home.js';
import OptionScreen from './screens/Options.js';
import PortfolioGate from './screens/HireMe.js';
import Me from './screens/AboutMe.js';

import { FaCode } from "react-icons/fa/index";

// Auth0 constants
const auth0ClientId = 'KLciWpxigi9TW81egFgImpCx5bEFTNgq';
const auth0Domain = 'https://mweya-labs.eu.auth0.com';

/**
 * Converts an object to a query string.
 */
function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

// Screen navigation is declared here
const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Code: { screen: CodeScreen },
  Options: { screen: OptionScreen },
  HiringQuestion: { screen: PortfolioGate },
  AboutMe: { screen: Me },

},
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerLayoutPreset: 'center',
      headerBackground: (<View style={{ flexDirection: 'column', flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
        <Text style={{ padding: 5, alignSelf: "center", color: 'rgba(0, 122, 255, 1)', fontSize: 32, alignItems: 'center', justifyContent: 'center', flex: 1 }}><FaCode size={32} color="rgba(0,122,255,1)" style={{ alignSelf: 'center' }}></FaCode> Labs</Text>
      </View>),
      headerStyle: {
        //backgroundColor: 'rgba(100,175,255,0.7)',
        //fontWeight: 'italic',
        backgroundColor: 'white',
      },
      headerForceInset: { vertical: 'middle' },
      headerMode: 'float',
      headerTintColor: 'rgba(0,122,255,1)',
      headerTitleStyle: {

      },
    },
  });

const AppContainer = createAppContainer(MainNavigator);

//https://reactnavigation.org/docs/en/app-containers.html
//export default App;
export default class App extends React.Component {
  state = {
    name: null,

  };

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
        if (code === "OK") {
          this.setState({ name: null });
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  login = async () => {
    // Retrieve the redirect URL, add this to the callback URL list
    // of your Auth0 application.
    const redirectUrl = "https://auth.expo.io/@mweya/labsclient";//= AuthSession.getRedirectUrl();
    console.log(`Redirect URL: ${redirectUrl}`);

    // Structure the auth parameters and URL
    const queryParams = toQueryString({
      client_id: auth0ClientId,
      redirect_uri: redirectUrl,
      response_type: 'id_token', // id_token will return a JWT token
      scope: 'openid profile name', // retrieve the user's profile
      nonce: 'nonce', // ideally, this will be a random value
    });
    const authUrl = `${auth0Domain}/authorize` + queryParams;

    // Perform the authentication
    const response = await AuthSession.startAsync({ authUrl });
    console.log('Authentication response', response);

    if (response.type === 'success') {
      this.handleResponse(response.params);
    }
  };

  handleResponse = (response) => {
    if (response.error) {
      Alert('Authentication error', response.error_description || 'something went wrong');
      return;
    }

    // Retrieve the JWT token and decode it
    const jwtToken = response.id_token;
    const decoded = jwtDecode(jwtToken);

    const { name } = decoded;
    this.setState({ name });
  };

  render() {
    const { name } = this.state;
    return (
      <AppContainer ref={nav => {
        this.navigator = nav;
      }} />);
    /*eturn (
      <View style={styles.container}>
        {
          name ?
            <View><Text style={styles.title}>Hello {name}!</Text><Button title="Log out" onPress={this.logout} /></View> :
            <Button title="Log in with Auth0" onPress={this.login} />
        }
      </View>
    );*/
  }
 }
