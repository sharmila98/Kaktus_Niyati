import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

import * as constant from '../../utils/constants';
import Ripple from './../../libs/Ripple/Ripple';
import OTPTextInput from 'react-native-otp-textinput';
import CountDown from 'react-native-countdown-component';
import CommonBackground from '../CommonBackground';

var head, url;
var i = 1;

class OtpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTime: true,
      countPress: 0,
      count: 0,
    };
  }

  toggletime = () => {
    this.setState({showTime: !this.state.showTime});
  };
  ResendOption = () => {
    for (i = 1; i <= 3; i++) {
      if (i <= 3) {
        Alert.alert('more then 3 time');
        this.props.navigation.navigate('SignIn');
      } else {
        console.warn(i);
        this.toggletime();
      }
    }
  };

  InsideView = () => {
    return (
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2.4),
            fontWeight: 'bold',
            fontFamily: constant.PROXIMANOVABOLDFONT,
            color: constant.SPLASHTEXT,
            textAlign: 'center',
          }}>
          {'OTP Verification'}
        </Text>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2),
            fontWeight: 'normal',
            fontFamily: constant.SUIFONT,
            color: constant.SPLASHTEXT,
            textAlign: 'center',
            marginTop: constant.HEIGHT * 2,
          }}>
          {'Enter the OTP sent to Email Address'}
        </Text>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2),
            fontWeight: 'normal',
            fontFamily: constant.SUIFONT,
            color: constant.SPLASHTEXT,
            textAlign: 'center',
          }}>
          {'and Mobile Number'}
        </Text>
        <OTPTextInput
          ref={(e) => (this.otpInput = e)}
          textInputStyle={{
            fontSize: constant.responsiveFontSize(2),
            color: constant.BLACK,
            fontFamily: constant.SUIFONT,
            marginTop: constant.HEIGHT * 3,
            fontWeight: 'bold',
            borderWidth: constant.HEIGHT * 0.2,
            borderBottomWidth: constant.HEIGHT * 0.3,

            borderRadius: constant.HEIGHT * 0.5,
            height: constant.HEIGHT * 6,
            width: constant.HEIGHT * 5.5,
          }}
          containerStyle={{
            justifyContent: 'center',
            marginTop: constant.HEIGHT * 5,
          }}
          inputCount={6}
          tintColor="#B1B1B1"
          offTintColor="#B1B1B1"
          keyboardType="numeric"
          handleTextChange={(e) => {
            this.setState({otp: e});
          }}
        />
        {this.state.showTime == true ? (
          <View>
            <View
              style={{
                alignSelf: 'flex-end',
                marginRight: 55,
                marginTop: constant.HEIGHT * 1.5,
              }}>
              <CountDown
                until={60}
                size={15}
                separatorStyle={{color: constant.THEME}}
                onFinish={() => this.toggletime()}
                digitStyle={{backgroundColor: '#FFF'}}
                digitTxtStyle={{color: constant.THEME}}
                timeToShow={['M', ':', 'S']}
                timeLabels={{m: null, s: null}}
                showSeparator
              />
            </View>
            <Ripple
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: constant.HEIGHT * 7,
                marginHorizontal: constant.HEIGHT * 10,
                backgroundColor: constant.THEME,
                padding: constant.HEIGHT * 1.5,
                paddingHorizontal: constant.HEIGHT * 5,
                borderRadius: constant.HEIGHT * 0.5,
                borderWidth: constant.HEIGHT * 0.1,
                borderColor: constant.THEME,
                elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                shadowOffset:
                  Platform.OS === 'ios'
                    ? {
                        width: 0,
                        height: constant.HEIGHT * 2,
                      }
                    : null,
                shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
                shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
              }}
              onPress={() => this.props.navigation.navigate('Success')}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(2.0),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                  color: constant.WHITE,
                }}>
                {'Verify & Continue'}
              </Text>
            </Ripple>
          </View>
        ) : (
          <View>
            <Ripple
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: constant.HEIGHT * 7,
                marginHorizontal: constant.HEIGHT * 10,
                backgroundColor: constant.THEME,
                padding: constant.HEIGHT * 1.5,
                paddingHorizontal: constant.HEIGHT * 5,
                borderRadius: constant.HEIGHT * 0.5,
                borderWidth: constant.HEIGHT * 0.1,
                borderColor: constant.THEME,
                elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                shadowOffset:
                  Platform.OS === 'ios'
                    ? {
                        width: 0,
                        height: constant.HEIGHT * 2,
                      }
                    : null,
                shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
                shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
              }}
              onPress={() => this.props.navigation.navigate('OtpScreen')}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(2.0),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                  color: constant.WHITE,
                }}>
                {'Verify & Continue'}
              </Text>
            </Ripple>
            <TouchableOpacity onPress={() => this.ResendOption()}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(1.7),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                  color: constant.SPLASHTEXT,
                  textAlign: 'center',
                  marginTop: constant.HEIGHT * 5,
                }}>
                {'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <CommonBackground
          backButton={() => this.props.navigation.goBack()}
          insideView={this.InsideView()}
        />
      </View>
    );
  }
}

export default OtpScreen;
