import React, {Component} from 'react';
// import { View, Text,Image } from 'react-native';
import {
  View,
  Easing,
  Platform,
  Image,
  Text,
  SafeAreaView,
  Animated,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import * as constant from '../utils/constants';
import StatusBars from './commons/StatusBar';

class CommonBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <StatusBars
            backgroundColor={constant.WHITE}
            overRelay={true}
            hidden={false}
          />
          <View style={{flex: 1, alignSelf: 'center'}}>
            <TouchableOpacity onPress={this.props.backButton}>
              <Image
                resizeMode={'cover'}
                style={{
                  height: constant.HEIGHT * 2,
                  width: constant.HEIGHT * 2,
                  marginTop: constant.HEIGHT * 4,
                  marginLeft: constant.HEIGHT * 5,
                }}
                source={constant.ICONARROW}
              />
            </TouchableOpacity>
            <Image
              resizeMode={'cover'}
              style={{
                height: constant.HEIGHT * 22,
                width: constant.HEIGHT * 22,
                marginTop: constant.HEIGHT * -13,
                marginLeft: constant.HEIGHT * 37,
              }}
              source={constant.ICONWATERMARK}
            />
            <View style={{flex: 1}}>{this.props.insideView}</View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default CommonBackground;
