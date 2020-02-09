//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {AntDesign, Octicons} from '@expo/vector-icons'

export default class legalPortal extends Component {
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, width: '90%', alignSelf: 'center', paddingTop: '20%' }}>

                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/privacy' })}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                            <AntDesign name='idcard' color="rgba(0, 122, 255, 1)" size={40}/>
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> PRIVACY POLICY</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigate('Policy', { link: 'https://jl.x-mweya.duckdns.org/legal/terms' })}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                            <Octicons name='law' color="rgba(0, 122, 255, 1)" size={40} />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> TERMS OF SERVICE</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        );
    }
}