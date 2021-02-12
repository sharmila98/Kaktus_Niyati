import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
  Image
} from "react-native";

import * as constants from "../../constants";

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class IconRipple extends PureComponent {
  constructor(props, context) {
    super(props, context);

    const maxOpacity = 0.12;

    this.state = {
      maxOpacity,
      scaleValue: new Animated.Value(0.01),
      opacityValue: new Animated.Value(maxOpacity)
    };

    this.renderRippleView = this.renderRippleView.bind(this);
    this.onPressedIn = this.onPressedIn.bind(this);
    this.onPressedOut = this.onPressedOut.bind(this);
  }
  onPressedIn() {
    Animated.timing(this.state.scaleValue, {
      toValue: 1,
      duration: 225,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      useNativeDriver: Platform.OS === "android"
    }).start();
  }
  onPressedOut() {
    Animated.timing(this.state.opacityValue, {
      toValue: 0,
      useNativeDriver: Platform.OS === "android"
    }).start(() => {
      this.state.scaleValue.setValue(0.01);
      this.state.opacityValue.setValue(this.state.maxOpacity);
    });
  }
  renderRippleView() {
    const { scaleValue, opacityValue } = this.state;

    const rippleSize = 20 * 2;

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: rippleSize,
          height: rippleSize,
          borderRadius: rippleSize / 2,
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
          backgroundColor: "black"
        }}
      />
    );
  }
  render() {
    const { width, height, src, tintColor } = this.props;

    return (
      <TouchableWithoutFeedback
        onPressIn={this.onPressedIn}
        onPressOut={this.onPressedOut}
      >
        <View style={[styles.iconContainer]}>
          {this.renderRippleView()}
          <View>
            <Image
              style={{
                width: this.props.width,
                alignSelf: "center",
                height: this.props.height,
                tintColor: this.props.tintColor
              }}
              source={this.props.src}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
