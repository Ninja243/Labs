import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Footer from '../components/footer.js';
import { s5, s4 } from '../components/translations';
export default class Me extends Component {
    static navigationOptions = {};
    render() {
        const { navigate } = this.props.navigation;
        if (Platform.OS === 'web') {
            // I guess I could set up an API for this too
            return (

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Image source={require("../assets/circle-cropped.png")}></Image>
                        <Text style={{ fontSize: 64, paddingRight: 10 }}>Mweya Ruider</Text>
                    </View>
                    <View>
                        <Text>{s5}</Text>
                    </View>

                    <View style={{ flex: 4, alignItems: 'center', justifyContents: 'center' }}>
                        <Button title={s4} onPress={() => { window.location.href = "https://mweya.duckdns.org/cv" }}></Button>
                    </View>
                </SafeAreaView>
            );
        }
        return (<View style={{ flex: 1 }}><WebView
            originWhitelist={['*']}
            source={{ uri: 'https://mweya.duckdns.org' }}
            style={{ marginTop: 20, flex: 1, alignSelf: 'center' }}
            onError={() => function () {
                alert({s6});
                navigate('Options');
            }}
        /></View>);

    }

}