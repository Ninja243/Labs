//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign, Octicons, Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import {connect} from 'react-redux'


export class downloadForm extends Component {
    //title: 'JavaLabs',
    state = {
        adv: false,
        labs: [],
        searchString: "",
        found: ""
    }
    static navigationOptions = {

    };

    search = () => {
        // ID search only
        // TESTING ID ONLY
        const { navigate } = this.props.navigation;
        const profile = this.props.profile;
        fetch("https://jl.x-mweya.duckdns.org/lab/" + this.state.searchString, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + profile[0][profile[0].length - 1]
            }
        }).then((response) => {
            if (response.status == 200 || response.status == 404) { 
                // Parse here
                // TODO
                response.json().then((res) => { 
                    this.setState({
                        found: this.state.labs.length + " labs found"
                    })
                })
            } else {
                response.text().then((response) => {
                    navigate("FatalError", {
                        message: "While trying to search for a lab, our server said '" + response + "' which is not only totally uncalled for, but kinda rude and for that, we apologise."
                    })
                });
            }
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        //console.log(this.state.labs.length)
        return (
            // TODO
            (this.state.adv) ?
                //(false) ?
                (this.state.labs.length > 0) ?
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <Octicons name='file' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="LAB ID"
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                    ></TextInput>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <AntDesign name='idcard' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="AUTHOR"
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                    ></TextInput>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <Entypo name='brush' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="LANGUAGE"
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                    ></TextInput>
                                </View>


                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            adv: false,
                                        })
                                    }}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Hide advanced search</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    :
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', paddingTop: '20%' }}>
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <Octicons name='file' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="LAB ID"
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                    ></TextInput>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <AntDesign name='idcard' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="AUTHOR"
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                    ></TextInput>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <Entypo name='brush' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="LANGUAGE"
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                    ></TextInput>
                                </View>


                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            adv: false,
                                        })
                                    }}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Hide advanced search</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                :
                (this.state.labs.length > 0) ?
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', }}>
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <Feather name='search' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35, borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, borderBottomWidth: 2, padding: 10, width: '90%' }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="SEARCH"
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ searchString: text }); this.search() }}
                                        value={this.state.searchString}
                                    ></TextInput>

                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            adv: true,
                                        })
                                    }}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Show advanced search</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    :
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: '90%', alignSelf: 'center', paddingTop: '20%' }}>
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <Feather name='search' color="rgba(0, 122, 255, 1)" size={40} />
                                    <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                    <TextInput
                                        style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35, textDecorationLine: 'underline' }}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardAppearance="light"
                                        multiline={true}
                                        selectionColor="rgba(0, 122, 255, 0.3)"
                                        placeholder="SEARCH"
                                        returnKeyType="search"
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ searchString: text }); this.search() }}
                                        value={this.state.searchString}
                                    ></TextInput>

                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <Text>{this.state.found}</Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            adv: true,
                                        })
                                    }}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Show advanced search</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                        navigate("Lab", { link: 'https://jl.x-mweya.duckdns.org/lab/test-01' })
                                    }}>
                                        <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>Test Lab Viewer</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(downloadForm);