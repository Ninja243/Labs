import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import {Feather} from '@expo/vector-icons'

import NavigationService from '../components/navService'

export default class AdModal extends Component {
    state = {
        visible: true
    }

    render() {

        return (
            (this.state.visible) ?
            <View style={{ backgroundColor: 'rgba(241,242,242,1)', maxHeight: '6%', width: '100%', maxWidth:"100%" }}>
                <View style={{ flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visible: false
                    })}}>
                        <Feather name="x" size={20} color='rgba(0, 122, 255, 1)' style={{ alignSelf: 'flex-end' }} ></Feather>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { NavigationService.navigate('AdViewer'), { AdID: '' } }}>
                        <Image source={{ uri: 'https://facebook.github.io/react-native/img/tiny_logo.png' }} style={{ width: 410, height: 32, resizeMode: 'stretch' }} />
                    </TouchableOpacity>
                    
                </View>
                </View>
                :
                <View></View>
        );
    }
}