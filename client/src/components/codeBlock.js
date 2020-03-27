import React, { Component } from 'react'
import { Platform, Text, Button, View, TouchableOpacity } from 'react-native'
//import { createAppContainer } from 'react-navigation';
//import { createStackNavigator } from 'react-navigation-stack';
import { Highlight } from 'react-fast-highlight';
import { ScrollView } from 'react-native-gesture-handler';
import NavigationService from '../components/navService';
import { Feather, Entypo, AntDesign } from '@expo/vector-icons';

import { connect } from 'react-redux';

const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';

export class CodeBlock extends Component {
    state = {
        allowedToEdit: false
    }

    // TODO
    componentDidMount() {
        // Check if we are allowed to edit this thing
        var profile = this.props.profile;
    }

    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1, width: '90%', alignSelf: 'center', paddingTop: '10%' }}>
                    <Text style={{ color: 'rgba(0,122,255,1)', paddingTop: 0, alignSelf: 'center', fontSize: 50, flexWrap: 'wrap', borderColor: 'rgba(0,122,255,1)', borderWidth: 0, borderBottomWidth: 2 }}>{this.props.filename}</Text>
                    <View style={{ backgroundColor: 'rgba(199,199,204,1)', padding: 5, marginTop: '10%', flexWrap: 'wrap' }}>

                        <Text style={{ flexWrap: 'wrap', width: "100%" }}>{this.props.code}</Text>

                    </View>
                    <View style={{ flexDirection: "row", marginTop: '10%', width: '100%', flexWrap: 'wrap' }}>
                        <Text>This lab has {this.props.views} views and has been </Text>
                        <Text>written in {this.props.language} by </Text>
                        <TouchableOpacity onPress={() => { NavigationService.navigate('Profile', { username: this.props.author }) }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CodeBlock);
/*<Text style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>
                        {this.props.code}
                    </Text>
                    <Highlight style={{ fontFamily, color: 'rgba(44,44,46,1)' }}>
                    */