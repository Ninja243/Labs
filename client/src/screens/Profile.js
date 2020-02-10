// For interpreting the policy JSON to be retrieved by the client
// Three fields in the expected JSON
// - Type of policy (header)
// - Time of modification
// - Content

import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ScrollView, ActivityIndicator } from 'react-native'
import CodeBlock from '../components/codeBlock'
import { connect } from 'react-redux';

export class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }



    componentDidMount() {
        // Username from props
        //console.log(this.props.navigation.state.params.username);
        var profile = this.props.profile;
        //var uname = this.props.navigation.state.params.link.username;
        if (this.props.navigation.state.params != null) {
            return fetch("https://jl.x-mweya.duckdns.org/user/" + uname, {
                method: "GET",
                headers: {
                    'User-Agent': 'Labs v1',
                    'Authorization': 'Bearer ' + profile[0][profile[0].length - 1]
                }
            })
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
        } else {
            // Fetch own profile
            var uname = profile[0][profile[0].length - 2].substring(0, profile[0][profile[0].length - 2].indexOf('@'));
            return fetch("https://jl.x-mweya.duckdns.org/user/" + uname, {
                method: "GET",
                headers: {
                    'User-Agent': 'Labs v1',
                    'Authorization': 'Bearer ' + profile[0][profile[0].length - 1]
                }
            })
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
    }
    static navigationOptions = {

    };

    render() {
        const { navigate } = this.props.navigation;
        //console.log(this.state.dataSource)
        if (this.state.isLoading) {
            return (
                <SafeAreaView>
                    <ScrollView style={{ flex: 1, padding: 20 }}>
                        <ActivityIndicator />
                    </ScrollView>

                </SafeAreaView>
            )
        }
        if (this.state.dataSource.message) {
            return (<SafeAreaView>
                <ScrollView>
                    <Text style={{ flexWrap: 'wrap' }}>{this.state.dataSource.message}</Text>
                </ScrollView>
            </SafeAreaView>);
        }
        return (
            <SafeAreaView>
                <ScrollView>
                    <Text>@{this.state.dataSource.id}</Text>
                    <Text>Labs: {this.state.dataSource.labs}</Text>
                    <Text>Created: {this.state.dataSource.datecreated}</Text>
                </ScrollView>

            </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);