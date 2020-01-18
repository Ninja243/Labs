// This block cycles between comments made about this app. 
// Should show up over/under the login button on the homescreen

import React, { Component } from 'react'
import { Platform, Text, Button, View, Animated } from 'react-native'

const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0))  // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 10000,
      }
    ).start();
  }, [])

  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default class QuoteBlock extends Component {
  genRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
  state = {
    timer: 30,
    quotes: ["What a great app", "Man this is so cool", "If you don't sign up you're a sucka", "I learned soooo much!"],
    renda: false
  }

  incTimer() {


    var x = this.genRandomNumber(0, 150);
    if (x < 80) {
      this.setState({ renda: true })
    } else {
      this.setState({ renda: false })
    }


  }
  render() {

    return (
      this.state.renda ?
        <Animated.View>
          <Text style={{ color: 'rgba(144,144,146,1)', fontSize: 20 }}>{this.state.quotes[this.genRandomNumber(0, this.state.quotes.length)]}</Text>
          <Text style={{ color: 'rgba(164,164,166,1)', paddingLeft: 40 }}>-Anon</Text>
        </Animated.View>
        :
        <View></View>

    );
  }
}