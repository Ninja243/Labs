import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect } from 'react-native'
import { createAppContainer, ThemeColors } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';

import Footer from '../components/footer';
import { s1, s2 } from '../components/translations';
import QuoteBlock from '../components/quoteBlock';

export default class HomeScreen extends Component {
    //title: 'JavaLabs',
    static navigationOptions = {

    };
    state = {
        accepted: false
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            this.state.accepted ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <QuoteBlock />
                    <Button style={{ alignSelf: 'center' }} title="Log in with Auth0 or Google" onPress={this.login} />
                    <View style={{ width: '50%', paddingTop: 40, paddingBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                        <Text style={{ fontSize: 15 }}>"I have read and agree with the Privacy Policy and Terms of Service"</Text>
                        <Text style={{ alignSelf: 'flex-end' }}>-You</Text>
                        <View style={{ paddingTop: 10, alignSelf: 'flex-start' }}>
                            <TouchableOpacity>
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 10, }}>
                            <Text style={{ paddingRight: 100 }}>Agreed</Text>
                            <Switch onValueChange={() => { this.setState({ accepted: false }) }} value={this.state.accepted} thumbColor="rgba(0, 122, 255, 1)" />
                        </View>
                    </View>
                    <QuoteBlock />
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <QuoteBlock />
                    <Button style={{ alignSelf: 'center' }} title="Log in with Auth0 or Google" onPress={this.login} disabled />
                    <View style={{ width: '50%', paddingTop: 40, paddingBottom: 10, flexDirection: 'column', justifyContent: 'center', alignContent: "flex-end" }}>
                        <Text>You need to have read and agreed with the Privacy Policy and the Terms of Service to use this app. Tap the links below to read them.</Text>
                        <View style={{ paddingTop: 10, alignSelf: 'flex-start' }}>
                            <TouchableOpacity>
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Terms of Service</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 10, }}>
                            <Text style={{ paddingRight: 100 }}>Agreed</Text>
                            <Switch onValueChange={() => { this.setState({ accepted: true }) }} value={this.state.accepted} />
                        </View>
                    </View>


                    <QuoteBlock />
                </View>
        );
    }
}

/*
/*eturn (
      <View style={styles.container}>
        {
          name ?
            <View><Text style={styles.title}>Hello {name}!</Text><Button title="Log out" onPress={this.logout} /></View> :

        }
      </View>
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
                <Footer style={{position: "absolute", bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',}}/>
            </SafeAreaView>
    );*/