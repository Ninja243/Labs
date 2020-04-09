// For interpreting the policy JSON to be retrieved by the client
// Three fields in the expected JSON
// - Type of policy (header)
// - Time of modification
// - Content

import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ScrollView, ActivityIndicator } from 'react-native'
import CodeBlock from '../components/codeBlock'
import { connect } from 'react-redux';

import { AntDesign, Octicons, Feather, EvilIcons } from '@expo/vector-icons'

export class LabViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    state = {
        owned: false
    }

    // Check to see if you are the author of this lab or not
    // The API verifies this so more thorough checking should not be needed
    areAuthor = (username) => {
        // Get username from redux
        var profile = this.props.profile[0][3];
        // Return result of comparison
        //console.log(username+" = "+profile)
        if (username === profile) {
            return true;
        }
        return false;
    };

    componentDidMount() {
        // Link from props
        //console.log(this.props.navigation.state.params.link);
        var profile = this.props.profile;
        return fetch(this.props.navigation.state.params.link, {
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
                //console.log(code)
                if (this.areAuthor(code.author)) {
                    this.setState({ owned: true });
                }

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

    deleteLab = () => {
        var profile = this.props.profile;
        return fetch(this.props.navigation.state.params.link, {
            method: "DELETE",
            headers: {
                "User-Agent": "Labs v1",
                'Authorization': 'Bearer ' + profile[0][profile[0].length - 1]
            }
        }).then(() => {
            // Good job many thanks
            const { navigate } = this.props.navigation;
            this.props.navigation.goBack();
        }).catch((error) => {
            if (response.status == 404) {
                // Didn't exist in the first place so whatever
            } else {
                const { navigate } = this.props.navigation;
                navigate("FatalError", {
                    message: "While trying to delete your lab, our server said '" + response.error_description + "' which is really rude and quite frankly, uncalled for. We're sorry for it's behaviour."
                })
            }
        })
    }

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
            return (<ScrollView>
                <View style={{ flex: 1, width: '90%', alignSelf: 'center', paddingTop: 150 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Feather name="alert-triangle" size={150} color='rgba(255, 30, 0, 1)' style={{ alignSelf: 'flex-end' }} />
                            </View>
                            <Text style={{ alignContent: "center", alignSelf: "center", fontSize: 22, }}>{this.state.dataSource.message}</Text>
                        </View>

                    </View>
                </View>

            </ScrollView>);
        }
        if (this.state.owned) {
            return (
                <SafeAreaView>
                    <ScrollView >
                        <CodeBlock code={this.state.dataSource.code} filename={this.state.dataSource.name} updated={this.state.dataSource.uploaded} language={this.state.dataSource.language} author={this.state.dataSource.author} views={this.state.dataSource.views}></CodeBlock>

                        <View>
                            <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: "column", paddingTop: 150 }}>
                                <TouchableOpacity onPress={() => { navigate("Edit", { link: this.props.navigation.state.params.link }) }}>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                        <AntDesign name="edit" size={40} color="rgba(0, 122, 255, 1)" />
                                        <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 30 }}> Edit</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: "column", paddingTop: 10 }}>
                                <TouchableOpacity onPress={() => { this.deleteLab()}}>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(255, 30, 0, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                        <AntDesign name="delete" size={40} color="rgba(255, 30, 0, 1)" />
                                        <Text style={{ color: "rgba(255, 30, 0, 1)", fontSize: 30 }}> Delete</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                </SafeAreaView>
            );
        }
        return (
            <SafeAreaView>
                <ScrollView >
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