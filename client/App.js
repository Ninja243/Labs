import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { AuthSession, Linking, AppState } from 'expo';
import jwtDecode from 'jwt-decode';

import Footer from './components/footer.js';
import CodeScreen from './screens/Code.js';
import HomeScreen from './screens/Home.js';
import OptionScreen from './screens/Options.js';
import PortfolioGate from './screens/HireMe.js';
import Me from './screens/AboutMe.js';

import { FaCode } from "react-icons/fa/index";
import PolicyViewer from './screens/PolicyView.js';
import NavigationService from './components/navService';
import profileReducer from './components/reducer';

// Redux state management
const store = createStore(profileReducer);



// Screen navigation is declared here
const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Code: { screen: CodeScreen },
  Options: { screen: OptionScreen },
  HiringQuestion: { screen: PortfolioGate },
  AboutMe: { screen: Me },
  Policy: { screen: PolicyViewer }

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
        <Text style={{ padding: 5, alignSelf: "center", color: 'rgba(0, 122, 255, 1)', fontSize: 32, alignItems: 'center', justifyContent: 'center', flex: 1 }}>{"</> Labs"}</Text>
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
        <Provider store={store}>
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
          <Footer style={{ alignSelf: 'flex-end' }} />
        </Provider>
      </View>
    );

  }
}
