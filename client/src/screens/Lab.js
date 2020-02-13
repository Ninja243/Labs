// For interpreting the policy JSON to be retrieved by the client
// Three fields in the expected JSON
// - Type of policy (header)
// - Time of modification
// - Content

import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ScrollView, ActivityIndicator } from 'react-native'
import CodeBlock from '../components/codeBlock'
import { connect } from 'react-redux';

export class LabViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        // Link from props
        //console.log(this.props.navigation.state.params.link);
        var profile = this.props.profile;
        return fetch(this.props.navigation.state.params.link, {
            method: "GET",
            headers: {
                'User-Agent':'Labs v1',
                'Authorization': 'Bearer ' + profile[0][profile[0].length - 1]
            }
        })
            .then((response) => response.json() )

            .then((code) => {

                this.setState({
                    isLoading: false,
                    dataSource: code,
                }, function () {

                });

            })
            .catch((error) => {
                const { navigate } = this.props.navigation;
                navigate("FatalError", {
                    message: "While trying to fetch your lab, our server said '" + response.error_description + "' which is really rude and quite frankly, uncalled for. We're sorry for it's behaviour."
                });
            });
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
                    <Text style={{ flexWrap: 'wrap'}}>{this.state.dataSource.message}</Text>
                </ScrollView>
            </SafeAreaView>);
        } 
        return (
            <SafeAreaView>
                <ScrollView>
                    <CodeBlock code={this.state.dataSource.code} filename={this.state.dataSource.name} updated={this.state.dataSource.uploaded} language={this.state.dataSource.language} author={this.state.dataSource.author} views={this.state.dataSource.views}></CodeBlock>
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

export default connect(mapStateToProps, mapDispatchToProps)(LabViewer);