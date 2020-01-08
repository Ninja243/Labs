import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { s3 } from './translations';

export default class Footer extends Component {
    
    render() {
        
        return (
            <View style={{backgroundColor: 'rgba(241,242,242,1)'}}>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => navigate('HiringQuestion')}>
                    <Text style={{ fontSize: 10, color: 'rgba(0,122,255,1)', }}>{s3}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}