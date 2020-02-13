//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, TouchableOpacity, ScrollView, BackHandler, Linking, } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign, Octicons, Feather } from '@expo/vector-icons'
import { connect } from 'react-redux';
import { logOut, logIn } from '../actions';

export class hugeError extends Component {
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    render() {
        const profile = this.props.profile;
        const logOut = this.props.logOut;
        const { navigate } = this.props.navigation;
        var message = "\n\nPlease log out by tapping the blue text below. You could also send an email to "
        var find = '\n';
        var re = new RegExp(find, 'g');
        if (this.props.navigation.state.params != null) { 
            message = this.props.navigation.state.params.message.replace(re, '') + message;
        }
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, width: '90%', alignSelf: 'center', paddingTop: '20%', maxWidth: '90%' }}>

                    <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Feather name="alert-triangle" size={150} color='rgba(255, 30, 0, 1)' style={{ alignSelf: 'flex-end' }} />
                        </View>
                        <Text style={{ alignContent: "center", justifyContent: "center", fontSize: 22, width: '100%' }}>Something went <Text style={{fontSize:30, fontWeight: 'bold'}}>*very*</Text> wrong.</Text>
                    </View>

                    <View style={{ marginTop: '10%' }}>
                        <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                            
                            <Text>
                            
                            <Text>{message}</Text>
                            <Text onPress={() => Linking.openURL('mailto:mweyaruider@gmail.com?subject=[Labs Crash]&body=Big yikes')} style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline', width:"100%" }}>mweyaruider@gmail.com</Text>
                            <Text> so I can help you out or answer any questions you might have. </Text>
                                <Text style={{ marginTop: '5%' }}>Thank you for your patience.</Text>
                            </Text>
                        </View>
                    </View>


                    <TouchableOpacity onPress={() => { logOut(); navigate('Home'); BackHandler.exitApp() }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center', marginTop: '30%' }}>
                            <AntDesign name='closecircleo' color="rgba(0, 122, 255, 1)" size={40} />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 30 }}> LOG OUT</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(hugeError);