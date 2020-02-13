//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign, Octicons, Entypo, Feather } from '@expo/vector-icons'
import { connect } from 'react-redux';

export class uploadForm extends Component {
    //title: 'JavaLabs',
    // TODO state
    state = {
        filename: "",
        language: "",
        code: "",
        ready: false
    }

    checkReadiness = () => {
        if (this.state.filename == "" || this.state.language == "" || this.state.code == "") {
            this.setState({ ready: false })
        } else {
            this.setState({ ready: true })
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            (this.state.ready) ?
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
                                    placeholder="LAB NAME"
                                    returnKeyType="next"
                                    blurOnSubmit={true}
                                    onChangeText={(text) => { this.setState({ filename: text }); this.checkReadiness() }}
                                    value={this.state.filename}
                                ></TextInput>
                            </View>
                        </View>

                        <View>
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
                                    onChangeText={(text) => { this.setState({ language: text }); this.checkReadiness() }}
                                    value={this.state.language}
                                ></TextInput>
                            </View>
                        </View>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                <Octicons name='file-code' color="rgba(0, 122, 255, 1)" size={40} />
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                <TextInput
                                    style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35, borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 2, padding: 10, width: '90%' }}
                                    autoCompleteType="off"
                                    autoCorrect={false}
                                    keyboardAppearance="light"
                                    multiline={true}
                                    selectionColor="rgba(0, 122, 255, 0.3)"
                                    placeholder="CODE"
                                    returnKeyType="next"
                                    blurOnSubmit={true}
                                    onChangeText={(text) => { this.setState({ code: text }); this.checkReadiness() }}
                                    value={this.state.code}
                                ></TextInput>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => {
                            // Send to API
                            var find = '\n';
                            var re = new RegExp(find, 'g');
                            var obj = {
                                "name": this.state.filename.replace(re, '').trim(),
                                "code": this.state.code.replace(re, '').trim(),
                                "language": this.state.language.replace(re, '').trim()
                            }
                            var payload = JSON.stringify(obj)

                            var profile = this.props.profile;
                            fetch("https://jl.x-mweya.duckdns.org/publish", {
                                method: "PUT",
                                headers: {
                                    "Authorization": "Bearer " + profile[0][profile[0].length - 1]
                                },
                                body: payload
                            }).then((response) => {
                                // Check if OK
                                if (response.status == 200 || response.status == 409) {
                                    // If OK go to ViewCode of lab
                                    var profile = this.props.profile;
                                    var uname = profile[0][profile[0].length - 2].substring(0, profile[0][profile[0].length - 2].indexOf('@'));
                                    navigate("Lab", { link: "https://jl.x-mweya.duckdns.org/lab/" + uname + "-" + this.state.filename })
                                } else {
                                    // Panic
                                    response.text().then((response) => {
                                        navigate("FatalError", {
                                            message: "While trying to post your lab, our server said '" + response + "' which is not only totally uncalled for, but kinda rude and for that, we apologise."
                                        })
                                    });
                                    //console.log(payload)
                                    //console.log(response)
                                }
                            })


                        }} style={{ paddingTop: '40%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                <Feather name="upload-cloud" size={40} color="rgba(0, 122, 255, 1)" />
                                <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 40 }}> UPLOAD</Text>
                            </View>
                        </TouchableOpacity>


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
                                    placeholder="LAB NAME"
                                    returnKeyType="next"
                                    blurOnSubmit={true}
                                    onChangeText={(text) => { this.setState({ filename: text }); this.checkReadiness() }}
                                    value={this.state.filename}
                                ></TextInput>
                            </View>
                        </View>

                        <View>
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
                                    onChangeText={(text) => { this.setState({ language: text }); this.checkReadiness() }}
                                    value={this.state.language}
                                ></TextInput>
                            </View>
                        </View>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'flex-end' }}>
                                <Octicons name='file-code' color="rgba(0, 122, 255, 1)" size={40} />
                                <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                                <TextInput
                                    style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35, borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, borderBottomWidth: 2, padding: 10, width: '90%' }}
                                    autoCompleteType="off"
                                    autoCorrect={false}
                                    keyboardAppearance="light"
                                    multiline={true}
                                    selectionColor="rgba(0, 122, 255, 0.3)"
                                    placeholder="CODE"
                                    returnKeyType="next"
                                    blurOnSubmit={true}
                                    onChangeText={(text) => { this.setState({ code: text }); this.checkReadiness() }}
                                    value={this.state.code}
                                ></TextInput>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => { }} style={{ paddingTop: '40%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                                <Feather name="upload-cloud" size={40} color="rgba(199,199,204,1)" />
                                <Text style={{ color: "rgba(199,199,204,1)", fontSize: 40 }}> UPLOAD</Text>
                            </View>
                        </TouchableOpacity>


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

export default connect(mapStateToProps, mapDispatchToProps)(uploadForm);