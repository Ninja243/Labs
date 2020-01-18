import * as Expo from "expo";
import React, { Component } from "react";
import { Provider } from "react-redux";
import App from "../App";
import configureStore from "./configureStore";

export default class Setup extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      store: configureStore(() => this.setState({ isLoading: false })),
      isReady: false
    };
  }
  async componentWillMount() {


    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady || this.state.isLoading) {
      return <Expo.AppLoading />;
    }
    return (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    );
  }
}
