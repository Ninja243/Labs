import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View, Image, SafeAreaView, } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import Footer from '../components/footer.js';
import { s5, s4 } from '../components/translations';
export default class tipJar extends Component {
    static navigationOptions = {};
    render() {
        const { navigate } = this.props.navigation;
        if (Platform.OS === 'web') {
            // I guess I could set up an API for this too
            return (

                <SafeAreaView style={{ flex: 1 }}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContents: 'center' }}>
                        <Button title={"Tap here to go to PayPal"} onPress={() => { window.location.href = "https://www.paypal.me/mweya" }}></Button>
                    </View>
                </SafeAreaView>
            );
        }
        return (<View style={{ flex: 1 }}>
            <WebView
                //originWhitelist={['*']}
                originWhitelist={["https://*", "http://*", "file://*", "sms://*", "mailto:*", "tel:*"]}
                source={{ uri: 'https://www.paypal.me/mweya' }}
                
                
            />
        </View>);

    }

}

/**
 * 
 */