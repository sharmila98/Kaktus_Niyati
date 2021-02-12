import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

import * as constant from '../../utils/constants';

class Success extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
            }}>
              <View>
           
              <Image
                source={constant.ICONCONFLICT}
                style={{
                  alignSelf: 'center',
                   marginTop:constant.HEIGHT*0,
                  width: constant.HEIGHT * 35,
                  marginLeft:constant.HEIGHT*-3,

                  height: constant.HEIGHT * 30,

                }}
              />
               <Image
                source={constant.ICONTICK}
                style={{
                  alignSelf: 'center',
                  width: constant.HEIGHT * 10,
                  marginTop:constant.HEIGHT * 10,
                  height: constant.HEIGHT * 10,
                  position:'absolute',


                }}
              />
              </View>
              <View style={{marginTop:constant.HEIGHT*15}}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(2.3),
                  color: constant.THEME,
                  // fontWeight: 'bold',
                  fontFamily: constant.PROXIMANOVABOLDFONT,
                  alignSelf: 'center',
                }}>
                {'Congratulations Jeo!'}
              </Text>
              <Text
                style={{
                  marginTop: constant.HEIGHT * 2,
                  fontFamily: constant.PROXIMANOVAREGULARFONT,
                  fontSize: constant.responsiveFontSize(1.8),
                  color: '#656565',
                  opacity: 0.5,
                  alignSelf: 'center',
                }}>
                {'Your account is active now.'}
              </Text>
              </View>
            
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default(Success);
