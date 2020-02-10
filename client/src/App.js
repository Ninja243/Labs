

// OLD
import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import jwtDecode from 'jwt-decode';

import Footer from './components/footer.js';
import CodeScreen from './screens/Code.js';
import HomeScreen from './screens/Home.js';
import OptionScreen from './screens/Options.js';
import PortfolioGate from './screens/HireMe.js';
import Me from './screens/AboutMe.js';
import SplashScreen from './screens/splash.js';
import settings from './screens/Settings.js';
import appSource from './screens/AppSource.js';
import tipJar from './screens/TipJar.js';
import legalPortal from './screens/LegalPortal'
import uploadForm from './screens/Upload'
import downloadForm from './screens/Download'
import LabViewer from './screens/Lab'
import ProfilePage from './screens/Profile'

import { FaCode } from "react-icons/fa/index";
import PolicyViewer from './screens/PolicyView.js';
import NavigationService from './components/navService';
import profileReducer from './components/reducer';
import endpointTestClass from './tests/Endpoints'


import Feather from '@expo/vector-icons'

// Screen navigation is declared here
const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Code: { screen: CodeScreen },
  Options: { screen: OptionScreen },
  HiringQuestion: { screen: PortfolioGate },
  AboutMe: { screen: Me },
  Policy: { screen: PolicyViewer },
  Splash: { screen: SplashScreen },
  Settings: { screen: settings },
  AppSource: { screen: appSource },
  TipJar: { screen: tipJar },
  LegalPortal: { screen: legalPortal },
  UploadForm: { screen: uploadForm },
  DownloadForm: { screen: downloadForm },
  Lab: { screen: LabViewer },
  Profile: {screen: ProfilePage},
  // Tests  
  EndpointTest: { screen: endpointTestClass }
},
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerLayoutPreset: 'center',
      headerBackground: () =>
        <View></View>,
      headerStyle: {
        //backgroundColor: 'rgba(100,175,255,0.7)',
        //fontWeight: 'italic',
        backgroundColor: 'white',

      },
      // Deprecated soon
      // headerForceInset will be deprecated soon <>
      safeAreaInsets: { vertical: 'middle' },
      headerMode: 'float',
      headerTitleAlign: "center",
      headerTintColor: 'rgba(0,122,255,1)',
      headerTitle: () => <View style={{ flexDirection: 'column', flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
        <Text style={{ padding: 5, alignSelf: "center", color: 'rgba(0, 122, 255, 1)', fontSize: 40, alignItems: 'center', justifyContent: 'center', flex: 1 }}>{"</> Labs"}</Text>
      </View>,
      // Disable to see page names
      headerTitleStyle: {
        display: 'none'
      },
    },
  });

const AppContainer = createAppContainer(MainNavigator);

//https://reactnavigation.org/docs/en/app-containers.html
//export default App;
export default class App extends React.Component {
  // Logged in not really needed, can just check name for null
  /*state = {
    name: null,
    loggedIn: false
  };*/
  //const { name } = this.state;





  render() {

    //, marginTop: StatusBar.currentHeight
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={true} />

        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
        <Footer style={{ alignSelf: 'flex-end' }} />

      </View>
    );
  }
}
