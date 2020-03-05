//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign, Octicons, Entypo, Feather, MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons'
import { connect } from 'react-redux';

export class uploadForm extends Component {
    //title: 'JavaLabs',
    // TODO state
    state = {
        filename: "",
        language: "",
        code: "",
        filenameReady: false,
        languageReady: false,
        codeReady: false,
        notOK: false
    }

    checkReadiness = () => {
        if (this.state.filename == "" || this.state.language == "" || this.state.code == "") {
            this.setState({ ready: false })
        } else {
            this.setState({ ready: true })
        }
    }

    inputOK = (input) => {
        var notOK = ["#", "@", "!", "$", "/", "\\", " ", "(", ")", "`", "~", ",", ".", "?", ":", ";", "'", "\"", "{", "}", "|"]
        if (input == "") {
            return false
        }
        var j = 0
        while (j < notOK.length) {
            if (input.includes(notOK[j])) {
                return false
            }
            j = j + 1
        }
        this.setState({ notOK: false })
        return true
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            (this.state.filenameReady) ?
                (this.state.languageReady) ?
                    <ScrollView>

                    </ScrollView>
                    :
                    this.state.notOK ?
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                                    <View style={{ alignSelf: "center", marginTop: 50 }}>
                                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, marginTop: 200, justifyContent: 'center', }}>
                                            <TextInput
                                                style={{ maxWidth: '80%', marginRight: '5%', color: 'rgba(0,122,255,1)', fontSize: 35, borderColor: 'rgba(0, 122,255,1)', borderWidth: 0, borderBottomWidth: 2, }}
                                                autoCapitalize="none"
                                                autoCompleteType="off"
                                                autoCorrect={false}
                                                autoFocus={true}
                                                blurOnSubmit={true}
                                                caretHidden={true}
                                                clearTextOnFocus={true}
                                                disableFullscreenUI={true}
                                                enablesReturnKeyAutomatically={true}
                                                keyboardAppearance="light"
                                                placeholder="LANGUAGE"
                                                returnKeyType="next"
                                                spellCheck={false}
                                                onChangeText={text => this.setState({ language: text })}
                                                value={this.state.language}
                                                onSubmitEditing={() => {
                                                    if (this.inputOK(this.state.language)) {
                                                        this.setState({ languageReady: true })
                                                    } else {
                                                        this.setState({ notOK: true })
                                                    }
                                                }}
                                            />
                                            <TouchableOpacity onPress={() => {
                                                if (this.inputOK(this.state.language)) {
                                                    this.setState({ languageReady: true })
                                                } else {
                                                    this.setState({ notOK: true })
                                                }
                                            }}><MaterialCommunityIcons name="toolbox-outline" size={40} color='rgba(0, 122, 255, 1)' /></TouchableOpacity>

                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center', marginTop: 70 }}>
                                            <Text style={{ color: 'rgba(255, 30, 0, 1)', fontSize: 30 }}>Something's not right <Entypo name="emoji-neutral" size={35} color='rgba(255, 30, 0, 1)' style={{ alignSelf: 'flex-end' }} /></Text>
                                        </View>
                                    </View>
                                    <View>

                                    </View>
                                </ScrollView>
                            </View>
                        </ScrollView>
                        :
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                                    <View style={{ alignSelf: "center", marginTop: 50 }}>
                                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, marginTop: 200, justifyContent: 'center', }}>
                                            <TextInput
                                                style={{ maxWidth: '80%', marginRight: '5%', color: 'rgba(0,122,255,1)', fontSize: 35, borderColor: 'rgba(0, 122,255,1)', borderWidth: 0, borderBottomWidth: 2, }}
                                                autoCapitalize="none"
                                                autoCompleteType="off"
                                                autoCorrect={false}
                                                autoFocus={true}
                                                blurOnSubmit={true}
                                                caretHidden={true}
                                                clearTextOnFocus={true}
                                                disableFullscreenUI={true}
                                                enablesReturnKeyAutomatically={true}
                                                keyboardAppearance="light"
                                                placeholder="LANGUAGE"
                                                returnKeyType="next"
                                                spellCheck={false}
                                                onChangeText={text => this.setState({ language: text })}
                                                value={this.state.language}
                                                onSubmitEditing={() => {
                                                    if (this.inputOK(this.state.language)) {
                                                        this.setState({ languageReady: true })
                                                    } else {
                                                        this.setState({ notOK: true })
                                                    }
                                                }}
                                            />
                                            <TouchableOpacity onPress={ () => {
                                                if (this.inputOK(this.state.language)) {
                                                    this.setState({ languageReady: true })
                                                } else {
                                                    this.setState({ notOK: true })
                                                }
                                            }}><MaterialCommunityIcons name="toolbox-outline" size={40} color='rgba(0, 122, 255, 1)' /></TouchableOpacity>

                                        </View>
                                    </View>
                                    <View>

                                    </View>
                                </ScrollView>
                            </View>
                        </ScrollView>
                :
                this.state.notOK ?
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                                <View style={{ alignSelf: "center", marginTop: 50 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, marginTop: 200, justifyContent: 'center', }}>
                                        <TextInput
                                            style={{ maxWidth: '80%', marginRight: '5%', color: 'rgba(0,122,255,1)', fontSize: 35, borderColor: 'rgba(0, 122,255,1)', borderWidth: 0, borderBottomWidth: 2, }}
                                            autoCapitalize="none"
                                            autoCompleteType="off"
                                            autoCorrect={false}
                                            autoFocus={true}
                                            blurOnSubmit={true}
                                            caretHidden={true}
                                            clearTextOnFocus={true}
                                            disableFullscreenUI={true}
                                            enablesReturnKeyAutomatically={true}
                                            keyboardAppearance="light"
                                            placeholder="FILENAME"
                                            returnKeyType="next"
                                            spellCheck={false}
                                            onChangeText={text => this.setState({ filename: text })}
                                            value={this.state.filename}
                                            onSubmitEditing={() => {
                                                if (this.inputOK(this.state.filename)) {
                                                    this.setState({ filenameReady: true })
                                                } else {
                                                    this.setState({ notOK: true })
                                                }
                                            }}
                                        />
                                        <TouchableOpacity onPress={() => {
                                            if (this.inputOK(this.state.filename)) {
                                                this.setState({ filenameReady: true })
                                            } else {
                                                this.setState({ notOK: true })
                                            }
                                        }}><MaterialCommunityIcons name="rename-box" size={40} color='rgba(0, 122, 255, 1)' /></TouchableOpacity>

                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center', marginTop: 70 }}>
                                        <Text style={{ color: 'rgba(255, 30, 0, 1)', fontSize: 30 }}>Something's not right <Entypo name="emoji-neutral" size={35} color='rgba(255, 30, 0, 1)' style={{ alignSelf: 'flex-end' }} /></Text>
                                    </View>
                                </View>
                                <View>

                                </View>
                            </ScrollView>
                        </View>
                    </ScrollView>
                    :

                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                                <View style={{ alignSelf: "center", marginTop: 50 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, marginTop: 200, justifyContent: 'center', }}>
                                        <TextInput
                                            style={{ maxWidth: '80%', marginRight: '5%', color: 'rgba(0,122,255,1)', fontSize: 35, borderColor: 'rgba(0, 122,255,1)', borderWidth: 0, borderBottomWidth: 2, }}
                                            autoCapitalize="none"
                                            autoCompleteType="off"
                                            autoCorrect={false}
                                            autoFocus={true}
                                            blurOnSubmit={true}
                                            caretHidden={true}
                                            clearTextOnFocus={true}
                                            disableFullscreenUI={true}
                                            enablesReturnKeyAutomatically={true}
                                            keyboardAppearance="light"
                                            placeholder="FILENAME"
                                            returnKeyType="next"
                                            spellCheck={false}
                                            onChangeText={text => this.setState({ filename: text })}
                                            value={this.state.filename}
                                            onSubmitEditing={() => {
                                                if (this.inputOK(this.state.filename)) {
                                                    this.setState({ filenameReady: true })
                                                } else {
                                                    this.setState({ notOK: true })
                                                }
                                            }}
                                        />
                                        <TouchableOpacity onPress={() => {
                                            if (this.inputOK(this.state.filename)) {
                                                this.setState({ filenameReady: true })
                                            } else {
                                                this.setState({ notOK: true })
                                            }
                                        }}><MaterialCommunityIcons name="rename-box" size={40} color='rgba(0, 122, 255, 1)' /></TouchableOpacity>

                                    </View>
                                </View>
                                <View>

                                </View>
                            </ScrollView>
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