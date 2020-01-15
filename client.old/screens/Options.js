import React, { Component } from 'react'
import { Text, Button, View, ScrollView, SafeAreaView } from 'react-native'
import { TouchableHighlight, TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import Footer from '../components/footer';
import { s10, s11, s12, s13 } from '../components/translations'

export default class OptionScreen extends Component {
    //title: "Options"
    static navigationOptions = {};
    render() {
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                    <View style={{ alignSelf: 'center', paddingTop: 10 }}><Button title={s10} onPress={() => alert('reee')}></Button></View>
                    <View style={{ alignSelf: 'center', paddingTop: 10 }}><Button title={s11} onPress={() => alert('reee')}></Button></View>
                    <View style={{ alignSelf: 'center', paddingTop: 10 }}><Button title={s12} onPress={() => alert('reee')}></Button></View>
                    <View style={{ alignSelf: 'center', paddingTop: 10 }}><Button title={s13} onPress={() => alert('reee')}></Button></View>
                </ScrollView>
                <Footer></Footer>

            </SafeAreaView>
        );
    }

}