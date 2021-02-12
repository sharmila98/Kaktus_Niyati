import React, {Component} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';

import * as constant from './../utils/constants';

export default class Analog extends Component {
  constructor(props) {
    super(props);

    let d = new Date();

    this.state = {
      sec: d.getSeconds() * 6,
      min: d.getMinutes() * 6 + (d.getSeconds() * 6) / 60,
      hour:
        ((d.getHours() % 12) / 12) * 360 +
        90 +
        (d.getMinutes() * 6 + (d.getSeconds() * 6) / 60) / 12,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      let d = new Date();
      this.setState({sec: d.getSeconds() * 6});
      this.setState({min: d.getMinutes() * 6 + (d.getSeconds() * 6) / 60});
      this.setState({
        hour:
          ((d.getHours() % 12) / 12) * 360 +
          90 +
          (d.getMinutes() * 6 + (d.getSeconds() * 6) / 60) / 12,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  clockFrame() {
    return {
      width: this.props.clockSize,
      height: this.props.clockSize,
      position: 'relative',
      borderColor: this.props.clockBorderColor,
      borderWidth: this.props.clockBorderWidth,
      borderRadius: this.props.clockSize / 2,
      backgroundColor: constant.WHITE,
    };
  }

  clockHolder() {
    return {
      width: this.props.clockSize,
      height: this.props.clockSize,
      position: 'absolute',
      right: -this.props.clockBorderWidth,
      bottom: -this.props.clockBorderWidth,
    };
  }

  clockFace() {
    return {
      width: this.props.clockCentreSize,
      height: this.props.clockCentreSize,
      backgroundColor: this.props.clockCentreColor,
      borderRadius: this.props.clockCentreSize / 2,
      top: (this.props.clockSize - this.props.clockCentreSize) / 2,
      left: (this.props.clockSize - this.props.clockCentreSize) / 2,
    };
  }

  hourHandStyles() {
    return {
      width: 0,
      height: 0,
      position: 'absolute',
      backgroundColor: this.props.hourHandColor,
      top: this.props.clockSize / 2,
      left: this.props.clockSize / 2,
      marginVertical: -this.props.hourHandWidth,
      marginLeft: -this.props.hourHandLength / 2,
      paddingVertical: this.props.hourHandWidth,
      paddingLeft: this.props.hourHandLength,
      borderTopLeftRadius: this.props.hourHandCurved
        ? this.props.hourHandWidth
        : 0,
      borderBottomLeftRadius: this.props.hourHandCurved
        ? this.props.hourHandWidth
        : 0,
    };
  }

  minuteHandStyles() {
    return {
      width: 0,
      height: 0,
      position: 'absolute',
      backgroundColor: this.props.minuteHandColor,
      top: this.props.clockSize / 2,
      left: this.props.clockSize / 2,
      marginTop: -(this.props.minuteHandLength / 2),
      marginHorizontal: -this.props.minuteHandWidth,
      paddingTop: this.props.minuteHandLength,
      paddingHorizontal: this.props.minuteHandWidth,
      borderTopLeftRadius: this.props.minuteHandCurved
        ? this.props.minuteHandWidth
        : 0,
      borderTopRightRadius: this.props.minuteHandCurved
        ? this.props.minuteHandWidth
        : 0,
    };
  }

  secondHandStyles() {
    return {
      width: 0,
      height: 0,
      position: 'absolute',
      backgroundColor: this.props.secondHandColor,
      top: this.props.clockSize / 2,
      left: this.props.clockSize / 2,
      marginTop: -(this.props.secondHandLength / 2),
      marginHorizontal: -this.props.secondHandWidth,
      paddingTop: this.props.secondHandLength,
      paddingHorizontal: this.props.secondHandWidth,
      borderTopLeftRadius: this.props.secondHandCurved
        ? this.props.secondHandWidth
        : 0,
      borderTopRightRadius: this.props.secondHandCurved
        ? this.props.secondHandWidth
        : 0,
    };
  }

  

  render() {
    return (
      <TouchableOpacity activeOpacity={1} style={this.clockFrame()}>
        {/* Uncomment for background image
        <Image
          style={{width: this.props.clockSize - this.props.clockBorderWidth*2,
            height: this.props.clockSize - this.props.clockBorderWidth*2}}
          resizeMode='stretch'
          source={require('./img/clockBack.png')}
        />
        */}

        <View style={this.clockHolder()}>
          <View
            style={[
              this.hourHandStyles(),
              {
                transform: [
                  {rotate: this.state.hour + 'deg'},
                  {
                    translateX: -(
                      this.props.hourHandOffset +
                      this.props.hourHandLength / 2
                    ),
                  },
                ],
              },
            ]}
          />

          <View
            style={[
              this.minuteHandStyles(),
              {
                transform: [
                  {rotate: this.state.min + 'deg'},
                  {
                    translateY: -(
                      this.props.minuteHandOffset +
                      this.props.minuteHandLength / 2
                    ),
                  },
                ],
              },
            ]}
          />

          <View
            style={[
              this.secondHandStyles(),
              {
                transform: [
                  {rotate: this.state.sec + 'deg'},
                  {
                    translateY: -(
                      this.props.secondHandOffset +
                      this.props.secondHandLength / 2
                    ),
                  },
                ],
              },
            ]}
          />

          <View style={this.clockFace()} />

          {/* {[...Array(12).keys()].map((i) => {
            let a = -60 + 30 * i;
            let b = 60 - 30 * i;
            return (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  backgroundColor: 'red',
                  top: 230 / 2,
                  left: 250 / 2,
                  transform: [{rotate: a + 'deg'}, {translateX: 250 / 2 - 15}],
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: this.props.clockSize / 9,
                    fontWeight: 'bold',
                    transform: [{rotate: b + 'deg'}],
                  }}>
                  {i + 1}
                </Text>
              </TouchableOpacity>
            );
          })} */}

          {/* {[...Array(4).keys()].map((i) => {
            let a = -90 + 90 * i;
            let b = 90 - 90 * i;
            return (
              //   <View style={{backgroundColor: 'yellow'}}>
              <View
                key={i}
                hitSlop={{left: 20, top: 20, right: 20, bottom: 20}}
                // underlayColor="transparent"
                // activeOpacity={0.2}
                // onPress
                style={{
                  position: 'absolute',
                  backgroundColor: 'red',
                  justifyContent:'center',
                  width: 80,
                  height: 120,
                  marginTop: 200 / 2,
                  marginLeft: 225 / 2,
                  transform: [{rotate: a + 'deg'}, {translateX: 280 / 2 - 15}],
                }}>
                <TouchableNativeFeedback 
                //   hitSlop={{left: 40, top: 40, right: 40, bottom: 40}}
                  style={{backgroundColor: 'pink'}}
                  onPress={() => alert(i + 1)}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: this.props.clockSize / 9,
                      fontWeight: 'bold',
                        transform: [{rotate: b + 'deg'}],
                    }}>
                    {i + 1}
                  </Text>
                </TouchableNativeFeedback >
              </View>
              //   </View>
            );
          })} */}

          {/* {[...Array(12).keys()].map((i) => {
            let a = -60 + 30 * i;
            let b = 60 - 30 * i;
            return (
              <TouchableOpacity
                key={i}
                style={{
                  position: 'absolute',
                  backgroundColor: "black",
                  width: 25,
                  height: 50,
                  top: 140 / 2,
                  left: 140 / 2,
                  transform: [{rotate: a + 'deg'}, {translateX: 200 / 2 - 15}],
                }}
              />
            );
          })} */}
        </View>
      </TouchableOpacity>
    );
  }
}

Analog.defaultProps = {
  //   backgroundImage: './img/clockBack.png',
  clockSize: 155,
  clockBorderWidth: 7,
  clockCentreSize: 15,
  clockCentreColor: constant.THEME,
  hourHandColor: constant.THEME,
  hourHandCurved: true,
  hourHandLength: 30,
  hourHandWidth: 4,
  hourHandOffset: 0,
  minuteHandColor: constant.THEME,
  minuteHandCurved: true,
  minuteHandLength: 50,
  minuteHandWidth: 3,
  minuteHandOffset: 0,
  secondHandColor: constant.THEME,
  secondHandCurved: true,
  secondHandLength: 60,
  secondHandWidth: 2,
  secondHandOffset: 0,
};
