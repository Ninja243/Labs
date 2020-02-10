import React, { Component } from 'react'
import { Platform, Text, Button, View, TouchableOpacity } from 'react-native'
//import { createAppContainer } from 'react-navigation';
//import { createStackNavigator } from 'react-navigation-stack';
import { Highlight } from 'react-fast-highlight';
import { ScrollView } from 'react-native-gesture-handler';

const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';

export default class CodeBlock extends Component {
    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1, width: '90%', alignSelf: 'center', paddingTop: '10%' }}>
                    <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30, flexWrap: 'wrap' }}>{this.props.filename}</Text>
                    <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5, marginTop: '10%', flexWrap: 'wrap' }}>

                        <Text>{this.props.code}</Text>

                    </View>
                    <View style={{ flexDirection: "row", paddingTop: '20%', width: '100%', flexWrap: 'wrap' }}>
                        <Text>This lab has {this.props.views} views and has been </Text>
                        <Text>written in {this.props.language} by </Text>
                        <TouchableOpacity>
                            <Text style={{ color: 'rgba(0, 122, 255, 1)', textDecorationLine: 'underline' }}>
                                @{this.props.author}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

/*<Text style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>
                        {this.props.code}
                    </Text>
                    <Highlight style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>
                    */