// For interpreting the policy JSON to be retrieved by the client
// Three fields in the expected JSON
// - Type of policy (header)
// - Time of modification
// - Content

import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ScrollView, ActivityIndicator } from 'react-native'
import LegalBlock from '../components/legalBlock'

export default class PolicyViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        // Link from props
        //console.log(this.props.navigation.state.params.link);
        return fetch(this.props.navigation.state.params.link)
            .then((response) => response.json())

            .then((code) => {
                
                this.setState({
                    isLoading: false,
                    dataSource: code,
                }, function () {

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }
    static navigationOptions = {

    };

    render() {
        const { navigate } = this.props.navigation;

        if (this.state.isLoading) {
            return (
                <SafeAreaView>
                    <ScrollView style={{ flex: 1, padding: 20 }}>
                        <ActivityIndicator />
                    </ScrollView>
                   
                </SafeAreaView>
            )
        }

        return (
            <SafeAreaView>
                <ScrollView>
                    <LegalBlock code={this.state.dataSource.content} filename={this.state.dataSource.type} updated={this.state.dataSource.modified}></LegalBlock>
                </ScrollView>
                
            </SafeAreaView>
        );
    }
}