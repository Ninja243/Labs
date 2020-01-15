import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Footer from './footer'

export default class Wrapper extends Component { 
    // How do I pass objects for rendering here?
    // Does the app state go here?
    render() {
        return (
            <SafeAreaView>
                <Footer></Footer>
            </SafeAreaView>
        );
    }
}