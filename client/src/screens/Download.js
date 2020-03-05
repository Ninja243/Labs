//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign, Octicons, Entypo, Feather, MaterialCommunityIcons, Foundation } from '@expo/vector-icons'
import { connect } from 'react-redux'


export class downloadForm extends Component {
    //title: 'JavaLabs',
    state = {
        adv: false,
        labs: [],
        searchString: "",
        searched: false
    }
    static navigationOptions = {

    };

    search = (text) => {
        //alert(text)
        // ID search only
        // TESTING ID ONLY
        //this.setState({ searchString: text });
        const { navigate } = this.props.navigation;
        const profile = this.props.profile;
        //console.log("https://jl.x-mweya.duckdns.org/lab/"+this.state.searchString)
        fetch("https://jl.x-mweya.duckdns.org/lab/" + text, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + profile[0][profile[0].length - 1]
            }
        }).then((response) => {
            if (response.status == 200 || response.status == 404) {
                // Parse here
                // TODO
                if (response.status == 200) {
                    response.json().then((res) => {
                        console.log(res);
                        var x = []
                        x[x.length] = res
                        this.setState({
                            labs: x
                        });
                        this.setState({ searchString: text });
                        this.setState({
                            found: this.state.labs.length + " labs found"
                        })
                    })
                }

            } else {
                response.text().then((response) => {
                    navigate("FatalError", {
                        message: "While trying to search for a lab, our server said '" + response + "' which is not only totally uncalled for, but kinda rude and for that, we apologise."
                    })
                });
            }
        })
        this.setState({
            searched: true
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        //console.log(this.state.labs.length)
        return ((this.state.labs.length > 0) ?
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                    <View style={{ alignSelf: "center" }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
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
                                placeholder="SEARCH"
                                returnKeyType="search"
                                spellCheck={false}
                                onChangeText={text => this.setState({ searchString: text })}
                                value={this.state.searchString}
                                onSubmitEditing={() => this.search(this.state.searchString)}
                            />
                            <TouchableOpacity onPress={() => this.search(this.state.searchString)}><Feather name="search" size={40} color='rgba(0, 122, 255, 1)' /></TouchableOpacity>

                        </View>
                    </View>
                </ScrollView>
            </View>
            :
            this.state.searched ?
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                        <View style={{ alignSelf: "center", marginTop: 50 }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center', }}>
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
                                    placeholder="SEARCH"
                                    returnKeyType="search"
                                    spellCheck={false}
                                    onChangeText={text => this.setState({ searchString: text })}
                                    value={this.state.searchString}
                                    onSubmitEditing={() => this.search(this.state.searchString)}
                                />
                                <TouchableOpacity onPress={() => this.search(this.state.searchString)}><Feather name="search" size={40} color='rgba(0, 122, 255, 1)' /></TouchableOpacity>

                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center', marginTop: 250 }}>
                                <Feather name="loader" size={40} color='rgba(144, 144, 146, 1)' style={{ alignSelf: 'flex-end' }} />
                                <Text style={{ color: 'rgba(144, 144, 146, 1)', fontSize: 35 }}> Nothing's here</Text>
                            </View>
                        </View>
                        <View>

                        </View>
                    </ScrollView>
                </View>
                :
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, width: '90%', flexDirection: 'column', alignSelf: 'center', }}>
                        <View style={{ alignSelf: "center", marginTop: 50 }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center', }}>
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
                                    placeholder="SEARCH"
                                    returnKeyType="search"
                                    spellCheck={false}
                                    onChangeText={text => this.setState({ searchString: text })}
                                    value={this.state.searchString}
                                    onSubmitEditing={() => this.search(this.state.searchString)}
                                />
                                <TouchableOpacity onPress={() => this.search(this.state.searchString)}><Feather name="search" size={40} color='rgba(0, 122, 255, 1)' /></TouchableOpacity>

                            </View>
                        </View>
                    </ScrollView>
                </View>
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