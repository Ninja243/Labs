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
            <SafeAreaView style={{flex: 1}}>
                <Text style={{ alignSelf: 'center', fontSize: 32, padding: 20, paddingTop: 170,  }}>Are you looking for a new developer?</Text>
                <View style={{ padding: 10, paddingRight: 20, paddingLeft: 20 }}>
                    <Button
                        title="Yeah!"
                        onPress={() => navigate('AboutMe')}
                        style={{ width: 50 }}
                    />
                </View>

            </SafeAreaView>
        );
    }
}