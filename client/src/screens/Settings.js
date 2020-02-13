//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Feather, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { logOut, logIn } from '../actions';

export class settings extends Component {
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    render() {
        const { navigate } = this.props.navigation;
        const { setReady } = this.props.setReady;
        const readyState = this.props.ready;
        const profile = this.props.profile;
        const  logOut  = this.props.logOut;
        return (
            <ScrollView>
                <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: '20%' }}>


                    <TouchableOpacity onPress={() => { navigate("FatalError") }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Feather name="trending-up" size={40} color='rgba(0, 122, 255, 1)' style={{alignSelf:'flex-end'}}/>
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> GO PRO</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigate('AppSource') }} style={{ marginTop:10 }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Feather name="github" size={40} color='rgba(0, 122, 255, 1)' />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> VIEW SOURCE</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigate('LegalPortal') }} style={{ marginTop: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Feather name="book" size={40} color='rgba(0, 122, 255, 1)' />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> LEGAL</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigate('TipJar')}} style={{ marginTop: 10,  }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Entypo name="paypal" size={40} color='rgba(0, 122, 255, 1)' />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> TIP ME</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigate('Profile'), {username: false} }} style={{ marginTop: 10, }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <AntDesign name="idcard" size={40} color='rgba(0, 122, 255, 1)' />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> MY PROFILE</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { 
                        // Delete arr
                        //setReady(false);
                        var p = [];
                        logOut();
                        navigate('Home')
                     }} style={{ marginTop: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Feather name="user-minus" size={40} color='rgba(0, 122, 255, 1)' />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> LOG OUT</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { 
                        // Send del request
                        fetch("https://jl.x-mweya.duckdns.org/account", {
                            method: "DELETE",
                            headers: {
                                "Authorization": "Bearer " + profile[0][profile[0].length - 1]
                            }
                        });
                        logOut();
                        navigate('Home');
                     }} style={{ marginTop: '40%', }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(255, 30, 0, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Feather name="user-x" size={40} color='rgba(255, 30, 0, 1)' />
                            <Text style={{ color: 'rgba(255, 30, 0, 1)', fontSize: 35 }}> DELETE ACCOUNT</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(settings);