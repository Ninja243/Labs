import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ActivityIndicator } from 'react-native'
import { createAppContainer, ThemeColors } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { AuthSession, Linking } from 'expo';
import jwtDecode from 'jwt-decode';

import { bindActionCreators } from 'redux';
import { GenIcon } from 'react-icons/lib/cjs';
import { enableExpoCliLogging } from 'expo/build/logs/Logs';
import { CodeBlock } from '../components/codeBlock';

export class SplashScreen extends Component {
    constructor(props) {
        super(props);
    }

    

    toString = s => { 
        var i = 0;
        var string = "";
        while (i < s.length) {
            if (i == s.length - 1) {
                string = string + "\n JWT: "+ s[i]+"\n";
            } else { 
                string = string + s[i] + ",\n";
            }
            
            i = i+1
         }
       
        return string;
    }

    render() {
        const { navigate } = this.props.navigation;
        const profile = this.props.profile;
        const s = this.toString(profile[0]);
        //alert(s);
        return (<View>
            <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{"User Profile"}</Text>
            <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>

                <Text>{s}</Text>

            </View>
        </View>);
    }
}

const mapStateToProps = (state) => {
    return {
        i: state.blank.i,
        profile: state.blank.profile
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        increment: () => dispatch(increment()),
        logIn: p => dispatch(logIn(p)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);