// For interpreting the policy JSON to be retrieved by the client
// Three fields in the expected JSON
// - Type of policy (header)
// - Time of modification
// - Content

import React, { Component } from 'react'
import { TouchableOpacity, Text, Button, View, SafeAreaView, StatusBar, AppState, Switch, ScreenRect, ScrollView, ActivityIndicator } from 'react-native'
import CodeBlock from '../components/codeBlock'
import { connect } from 'react-redux';
import { Feather, Entypo, AntDesign, Iconicons, Octicons } from '@expo/vector-icons';
//import NavigationService from '../components/navService'

import MenuItem from '../components/menuItem'

export class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }



    componentDidMount() {
        // Username from props
        //console.log(this.props.navigation.state.params.link);
        //console.log(this.props.navigation.state.params.username)
        
        //
        //console.log(this.props.navigation.getParams('username'))
        if (this.props.navigation.state.params != null) {
            var uname = this.props.navigation.state.params.username;
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
                    navigate("FatalError", {
                        message: "While trying to fetch a profile for you, our server said '" + error + "' which is really rude and quite frankly, uncalled for. We're sorry for it's behaviour."
                    });
                });
        } else {
            // Fetch own profile
            var profile = this.props.profile;
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
                    console.log(code)
                    this.setState({
                        isLoading: false,
                        dataSource: code,
                    }, function () {

                    });

                })
                .catch((error) => {
                    const { navigate } = this.props.navigation;
                    navigate("FatalError", {
                        message: "While trying to fetch a profile for you, our server said '" + error + "' which is really rude and quite frankly, uncalled for. We're sorry for it's behaviour."
                    });
                });
        }
    }
    static navigationOptions = {

    };

    unpackLabs = (labs) => {
        const { navigate } = this.props.navigation;
        var elements = []
        //var i = 0
        //console.log(this.state.dataStore)
        var j = 0;
        while (j < labs.length) {
            labs[j] = <MenuItem name={labs[j]} type={"lab"} key={j}/>
            j = j + 1;
        }
        /*while (i < labs.length) {
            var lab = labs[i]
            elements.push( <Text key={i} style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 15, textDecorationLine: "underline" }} onPress={() => {
                //console.log('https://jl.x-mweya.duckdns.org/lab/' + lab);
                navigate("Lab", { link: 'https://jl.x-mweya.duckdns.org/lab/' + lab })
            }}>/{labs[i]}</Text>)
            i = i + 1
        }*/
        return labs
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
            return (<SafeAreaView>
                <ScrollView>
                    <Text style={{ flexWrap: 'wrap', alignSelf: "center" }}>{this.state.dataSource.message}</Text>
                </ScrollView>
            </SafeAreaView>);
        }
        return (
            (this.state.dataSource.labs != null) ?
                <SafeAreaView>
                    <ScrollView>

                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: '30%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Octicons name="person" size={90} color='rgba(0, 122, 255, 1)' style={{ alignSelf: 'flex-end' }} />
                            </View>
                        </View>

                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: '0%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35, textDecorationLine: "underline" }}>@{this.state.dataSource.id}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'rgba(44,44,46,1)', fontSize: 25 }}>Created: {this.state.dataSource.datecreated.substring(0, 10)}</Text>
                            </View>
                        </View>


                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: '5%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}>Labs: </Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <ScrollView>
                                    <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection:"column" }}>{this.unpackLabs(this.state.dataSource.labs)}</View>
                                </ScrollView >
                            </View>
                        </View>



                    </ScrollView>

                </SafeAreaView>
                :
                <SafeAreaView>
                    <ScrollView>

                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: '30%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Octicons name="person" size={90} color='rgba(0, 122, 255, 1)' style={{ alignSelf: 'flex-end' }} />
                            </View>
                        </View>

                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: '10%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35, textDecorationLine: "underline" }}>@{this.state.dataSource.id}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'rgba(44,44,46,1)', fontSize: 25 }}>Created: {this.state.dataSource.datecreated.substring(0, 10)}</Text>
                            </View>
                        </View>
                        <Text></Text>
                        <Text></Text>
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