import React, { Component } from 'react'
import { Text, ActivityIndicator, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'

import CodeBlock from '../components/codeBlock.js';
import Footer from '../components/footer.js';



export default class CodeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        return fetch('https://facebook.github.io/react-native/movies.json')
            .then((response) => response.text())
            .then((code) => {

                this.setState({
                    isLoading: false,
                    dataSource: code,
                }, function () {

                });

            })
            .catch((error) => {
                const { navigate } = this.props.navigation;
                navigate("FatalError", {
                    message: "While trying to fetch the code for this block, our server said '" + response.error_description.replace("\n", "") + "' which is really rude and quite frankly, uncalled for. We're sorry for it's behaviour."
                });
            });
    }

    static navigationOptions = {

    };

    render() {
        const { navigate } = this.props.navigation;

        if (this.state.isLoading) {
            return (
                <SafeAreaView>
                    <ScrollView style={{ flex: 1, padding: 20 }}>
                        <ActivityIndicator />
                    </ScrollView>

                </SafeAreaView>
            )
        }

        return (
            <SafeAreaView>
                <ScrollView>
                    <CodeBlock code={this.state.dataSource} filename={"test-movies.json"}></CodeBlock>
                </ScrollView>

            </SafeAreaView>
        );
    }
}
