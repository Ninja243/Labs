import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';

import Footer from '../components/footer';
import { s1, s2 } from '../components/translations';

export default class HomeScreen extends Component {
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingTop: 170 }}>

                        <View style={{ alignSelf: 'center', paddingLeft: 20, paddingRight: 20 }}><Button
                            title={s1}
                            onPress={() => navigate('Code')}
                        /></View>

                        <View style={{ alignSelf: 'center', paddingLeft: 20, paddingRight: 20 }}><Button
                            title={s2}
                            onPress={() => navigate('Options')}
                        /></View>

                    </View>

                </ScrollView>
                <Footer></Footer>
            </SafeAreaView>

        );
    }
}