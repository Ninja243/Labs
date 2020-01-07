//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

export default class PortfolioGate extends Component {
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView>
                <Text style={{ alignSelf: 'center', fontSize: 32, paddingTop: 170, paddingBottom: 20 }}>Bist du auf der Suche nach einem neuen Entwickler?</Text>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={{ padding: 10, paddingRight: 20, paddingLeft: 20 }}>
                            <Button
                                title="Ja!"
                                onPress={() => navigate('AboutMe')}
                                style={{ width: 50 }}
                            />
                        </View>

                        <View style={{ padding: 10 }}>
                            <Button
                                title="Nein"
                                onPress={() => navigate('Options')}
                                style={{ width: 50 }}
                            />
                        </View>

                    </View>
                </View>

            </SafeAreaView>
        );
    }
}