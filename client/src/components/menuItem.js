import React, { Component } from 'react'
import { Platform, Text, Button, View, TouchableOpacity } from 'react-native'
//import { createAppContainer } from 'react-navigation';
//import { createStackNavigator } from 'react-navigation-stack';
import { Highlight } from 'react-fast-highlight';
import { AntDesign, Octicons, Entypo, Feather, MaterialCommunityIcons, Foundation } from '@expo/vector-icons'
import NavigationService from '../components/navService'

const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';

export default class MenuItem extends Component {
    render() {
        return (
            (this.props.type == "lab") ?
                <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => { NavigationService.navigate("Lab", { link: "https://jl.x-mweya.duckdns.org/lab/" + this.props.name }) }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <Feather name="file-text" size={40} color="rgba(0, 122, 255, 1)" />
                            <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 30 }}> {this.props.name}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                :
                (this.props.type == "user") ?
                    <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => { NavigationService.navigate('Profile'), { username: this.props.name } }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                                <Feather name="user" size={40} color="rgba(0, 122, 255, 1)" />
                                <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 30 }}> {this.props.name}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row', borderColor: 'rgba(0, 122, 255, 1)', borderWidth: 0, margin: 10, justifyContent: 'center' }}>
                            <AntDesign name="question" size={40} color="rgba(0, 122, 255, 1)" />
                                <Text style={{ color: "rgba(0, 122, 255, 1)", fontSize: 30 }}> {this.props.name}</Text>
                            </View>
                    </View>

        );
    }
}

/*<Text style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>
                        {this.props.code}
                    </Text>
                    <Highlight style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>


                    <View>
                <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 10, alignSelf: 'flex-start', fontSize: 30 }}>{this.props.filename}</Text>
                <View style={{ padding: 5 }}>

                    <Text>{this.props.code}</Text>

                </View>
                <Text>Last update: <Text>{this.props.updated}</Text></Text>
            </View>
                    */