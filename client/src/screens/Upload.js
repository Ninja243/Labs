//
import React, { Component } from 'react'
import { Text, Button, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign, Octicons, Entypo, Feather } from '@expo/vector-icons'

export default class uploadForm extends Component {
    //title: 'JavaLabs',
    // TODO state
    static navigationOptio
    render() {
        const { navigate } = this.props.navigation;
        return (
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
                            ></TextInput>
                        </View>
                    </View>

                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                            <Octicons name='file-code' color="rgba(0, 122, 255, 1)" size={40} />
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35 }}> </Text>
                            <TextInput
                                style={{ color: 'rgba(0, 122, 255, 1)', fontSize: 35, borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 2, padding: 10, width:'90%' }}
                                autoCompleteType="off"
                                autoCorrect={false}
                                keyboardAppearance="light"
                                multiline={true}
                                selectionColor="rgba(0, 122, 255, 0.3)"
                                placeholder="CODE"
                                returnKeyType="next"
                                blurOnSubmit={true}
                            ></TextInput>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => { 
                        // Send to API
                        // Check if OK
                        // If OK go to ViewCode of lab
                     }} style={{paddingTop: '40%'}}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, padding: 10, justifyContent: 'center' }}>
                            <Feather name="upload-cloud" size={40} color="rgba(0, 122, 255, 1)" />
                            <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 40 }}> UPLOAD</Text>
                        </View>
                    </TouchableOpacity>
                    

                </View>

            </ScrollView>
        );
    }
}