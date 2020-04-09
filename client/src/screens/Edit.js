//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign, Octicons, Entypo, Feather, MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons'
import { connect } from 'react-redux';

const h = Dimensions.get('window').height;

export class editForm extends Component {

    //title: 'JavaLabs',
    // TODO state
    state = {
        dataSource: "",
        filename: "",
        language: "",
        code: "",
        filenameReady: false,
        // Debugging
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

    postCode = () => {
        if (this.state.code == "") {
            return
        }
        var obj = {
            "name": this.state.filename,
            "language": this.state.language,
            "code": this.state.code
        }
        var profile = this.props.profile
        var load = JSON.stringify(obj)
        fetch("https://jl.x-mweya.duckdns.org/publish", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + profile[0][profile[0].length - 1]
            },
            body: load
        }).then((response) => {
            if (response.status == 200 || response.status == 409) {
                const { navigate } = this.props.navigation;
                var profile = this.props.profile;
                var uname = profile[0][profile[0].length - 2].substring(0, profile[0][profile[0].length - 2].indexOf('@'));
                navigate("Lab", { link: "https://jl.x-mweya.duckdns.org/lab/" + uname + "-" + this.state.filename })
            } else {
                const { navigate } = this.props.navigation;
                navigate("FatalError", {
                    message: "While trying to update your lab, our server threw a temper tantrum and screamed \"" + response.status + " - " + response.statusText + "\" at us, which was not only rude but kinda hurtful. We're sorry about that."
                });
            }
        })
    }



    componentDidMount() {
        // Download Lab
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

                if (!this.state.dataSource.hasOwnProperty("message")) {
                    // Everything *should* be fine
                    this.setState({
                        filename: this.state.dataSource.name,
                        language: this.state.dataSource.language,
                        code: this.state.dataSource.code,
                    })
                }
            })
            .catch((error) => {
                const { navigate } = this.props.navigation;
                navigate("FatalError", {
                    message: "While trying to fetch your lab, our server said '" + response.error_description + "' which is really rude and quite frankly, uncalled for. We're sorry for it's behaviour."
                });
            });
    }



    render() {
        const { navigate } = this.props.navigation;
        // TODO Render
        if (this.state.isLoading) {
            return (
                <SafeAreaView>
                    <ScrollView style={{ flex: 1, padding: 20 }}>
                        <ActivityIndicator />
                    </ScrollView>

                </SafeAreaView>
            )
        }
        if (this.state.dataSource.hasOwnProperty("message")) {
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
        } else {
            return ((this.state.filenameReady) ?
                (this.state.languageReady) ?
                    (this.state.code.length > 0) ?
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                                    <View style={{ alignSelf: "center", marginTop: 50, flex: 1 }}>
                                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center', }}>
                                            <TextInput
                                                style={{ marginRight: '5%', color: 'rgba(0,122,255,1)', fontSize: 35, borderColor: 'rgba(0, 122,255,1)', borderWidth: 0, borderBottomWidth: 2, maxHeight: h * .4, paddingBottom: 2, }}
                                                autoCapitalize="none"
                                                autoCompleteType="off"
                                                multiline={true}
                                                autoCorrect={false}
                                                autoFocus={true}
                                                blurOnSubmit={true}
                                                caretHidden={true}
                                                clearTextOnFocus={true}
                                                disableFullscreenUI={true}
                                                enablesReturnKeyAutomatically={true}
                                                keyboardAppearance="light"
                                                placeholder="print('Hello World!')"
                                                returnKeyType="next"
                                                spellCheck={false}
                                                onChangeText={text => this.setState({ code: text })}
                                                value={this.state.code}
                                                onSubmitEditing={() => {
                                                    this.postCode()
                                                }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.postCode()
                                            }}><Text style={{ color: 'rgba(0,122,255,1)', fontSize: 35, marginTop: 70 }}>Post <Feather name="send" size={40} color='rgba(0, 122, 255, 1)' /></Text></TouchableOpacity>
                                        </View>
                                    </View>


                                </ScrollView>
                            </View>
                        </ScrollView>
                        :
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                                    <View style={{ alignSelf: "center", marginTop: 50, flex: 1 }}>
                                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center', }}>
                                            <TextInput
                                                style={{ marginRight: '5%', color: 'rgba(0,122,255,1)', fontSize: 35, borderColor: 'rgba(0, 122,255,1)', borderWidth: 0, borderBottomWidth: 2, maxHeight: h * .4, paddingBottom: 2, }}
                                                autoCapitalize="none"
                                                autoCompleteType="off"
                                                multiline={true}
                                                autoCorrect={false}
                                                autoFocus={true}
                                                blurOnSubmit={true}
                                                caretHidden={true}
                                                clearTextOnFocus={true}
                                                disableFullscreenUI={true}
                                                enablesReturnKeyAutomatically={true}
                                                keyboardAppearance="light"
                                                placeholder="print('Hello World!')"
                                                returnKeyType="next"
                                                spellCheck={false}
                                                onChangeText={text => this.setState({ code: text })}
                                                value={this.state.code}
                                                onSubmitEditing={() => {
                                                    this.postCode()
                                                }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => {

                                            }}><Text style={{ color: 'rgba(199,199,204,1)', fontSize: 35, marginTop: 70 }}>Post <Feather name="send" size={40} color='rgba(199,199,204,1)' /></Text></TouchableOpacity>
                                        </View>
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
                                            <TouchableOpacity onPress={() => {
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
                    </ScrollView>);
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(editForm);