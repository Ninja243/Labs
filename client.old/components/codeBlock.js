import React, { Component } from 'react'
import { Platform, Text, Button, View } from 'react-native'
//import { createAppContainer } from 'react-navigation';
//import { createStackNavigator } from 'react-navigation-stack';
import { Highlight } from 'react-fast-highlight';

const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';

export default class CodeBlock extends Component {
    render() {
        return (
            <View>
                <Text style={{ color: 'rgba(44,44,46,1)', paddingBottom: 10, paddingTop: 20, paddingLeft: 40, alignSelf: 'flex-start', fontSize: 30 }}>{this.props.filename}</Text>
                <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5 }}>
                    
                        <Text>{this.props.code}</Text>
                    
                </View>
            </View>
        );
    }
}

/*<Text style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>
                        {this.props.code}
                    </Text>
                    <Highlight style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>
                    */