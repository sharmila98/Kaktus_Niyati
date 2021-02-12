import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  BackHandler,
  Alert,
  Dimensions,
} from 'react-native';
import {Platform} from 'react-native';
import * as constant from '../../utils/constants';
import Ripple from './../../libs/Ripple/Ripple';
import CommonBackground from '../CommonBackground';
import {TextInput} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastName: '',
      firstName: '',
      email: '',
      mobile: '',
      location: '',
      DOb: '',
    };
  }
  componentDidMount = () => {
    Geolocation.getCurrentPosition((info) => console.warn(info));
  };

  handleFirstName(text) {
    this.setState({firstName: text});
  }

  handleLastName(text) {
    this.setState({lastName: text});
  }
  handleEmail(text) {
    this.setState({email: text});
  }
  handleMobile(text) {
    this.setState({mobile: text});
  }
  handleLocation(text) {
    this.setState({location: text});
  }
  handleDoB(text) {
    this.setState({DOb: text});
  }

  InsideView = () => {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{flex: 1, marginLeft: constant.HEIGHT * 10,marginTop:constant.HEIGHT*5}}>
            <Text
              style={{
                fontSize: constant.responsiveFontSize(2.4),
                fontFamily: constant.PROXIMANOVABOLDFONT,
                color: constant.SPLASHTEXT,
              
              }}>
              {'Sign-up'}
            </Text>
            <View style={{marginTop: constant.HEIGHT * 2}}>
              <TextInput
                label="First Name"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 35,
                    letterSpacing: constant.HEIGHT * 0.1,
                    backgroundColor: 'transparent',
                  },
                ]}
                theme={{
                  colors: {
                    text: constant.SPLASHTEXT,
                    primary: constant.SPLASHTEXT,
                    placeholder: constant.SPLASHTEXT,
                  },
                  fonts: {fontFamily: constant.SUIFONT},
                }}
                value={this.state.firstName}
                onChangeText={(value) => this.handleFirstName(value)}
              />
            </View>
            <View style={{marginTop: constant.HEIGHT * 1.5}}>
              <TextInput
                label="Last Name"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 35,
                    letterSpacing: constant.HEIGHT * 0.1,
                    backgroundColor: 'transparent',
                  },
                ]}
                theme={{
                  colors: {
                    text: constant.SPLASHTEXT,
                    primary: constant.SPLASHTEXT,
                    placeholder: constant.SPLASHTEXT,
                  },
                  fonts: {fontFamily: constant.SUIFONT},
                }}
                value={this.state.lastName}
                onChangeText={(value) => this.handleLastName(value)}
              />
            </View>
            <View style={{marginTop: constant.HEIGHT * 1.5}}>
              <TextInput
                label="Email Address"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 35,
                    letterSpacing: constant.HEIGHT * 0.1,
                    backgroundColor: 'transparent',
                  },
                ]}
                theme={{
                  colors: {
                    text: constant.SPLASHTEXT,
                    primary: constant.SPLASHTEXT,
                    placeholder: constant.SPLASHTEXT,
                  },
                  fonts: {fontFamily: constant.SUIFONT},
                }}
                value={this.state.email}
                onChangeText={(value) => this.handleEmail(value)}
              />
            </View>
            <View style={{marginTop: constant.HEIGHT * 1.5}}>
              <TextInput
                label="Mobile Number"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 35,
                    letterSpacing: constant.HEIGHT * 0.1,
                    backgroundColor: 'transparent',
                  },
                ]}
                theme={{
                  colors: {
                    text: constant.SPLASHTEXT,
                    primary: constant.SPLASHTEXT,
                    placeholder: constant.SPLASHTEXT,
                  },
                  fonts: {fontFamily: constant.SUIFONT},
                }}
                value={this.state.mobile}
                onChangeText={(value) => this.handleMobile(value)}
              />
            </View>
            <View style={{marginTop: constant.HEIGHT * 1.5}}>
              <TextInput
                label="Location Zip Code"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 35,
                    letterSpacing: constant.HEIGHT * 0.1,
                    backgroundColor: 'transparent',
                  },
                ]}
                theme={{
                  colors: {
                    text: constant.SPLASHTEXT,
                    primary: constant.SPLASHTEXT,
                    placeholder: constant.SPLASHTEXT,
                  },
                  fonts: {fontFamily: constant.SUIFONT},
                }}
                value={this.state.location}
                onChangeText={(value) => this.handleLocation(value)}
              />
            </View>
            <View
              style={{marginTop: constant.HEIGHT * 1.5, flexDirection: 'row'}}>
              <TextInput
                label="Date Of Birth"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 35,
                    letterSpacing: constant.HEIGHT * 0.1,
                    backgroundColor: 'transparent',
                  },
                ]}
                theme={{
                  colors: {
                    text: constant.SPLASHTEXT,
                    primary: constant.SPLASHTEXT,
                    placeholder: constant.SPLASHTEXT,
                  },
                  fonts: {fontFamily: constant.SUIFONT},
                }}
                value={this.state.DOb}
                onChangeText={(value) => this.handleDoB(value)}
              />
              <View>
                <Image
                  resizeMode={'cover'}
                  style={{
                    height: constant.HEIGHT * 2.5,
                    width: constant.HEIGHT * 2.5,
                    marginTop: constant.HEIGHT * 4,
                    marginLeft: constant.HEIGHT * -4,
                  }}
                  source={constant.ICONCALENDER}
                />
              </View>
            </View>
            <View
              style={{flexDirection: 'row', marginTop: constant.HEIGHT * 5}}>
              <Image
                resizeMode={'cover'}
                style={{
                  height: constant.HEIGHT * 2,
                  width: constant.HEIGHT * 2,
                  marginTop: constant.HEIGHT * 0.4,
                }}
                source={constant.ICONUNCHECK}
              />
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(1.8),
                  fontWeight: 'normal',
                  fontFamily: constant.SUIFONT,
                  color: constant.SPLASHTEXT,
                  marginLeft: constant.HEIGHT * 1,
                }}>
                {'I agree to the Terms of Service'}
              </Text>
            </View>
          </View>
          <Ripple
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: constant.HEIGHT * 3.5,
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
              {'Continue'}
            </Text>
          </Ripple>
          <View
            style={{
              flexDirection: 'row',
              marginTop: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: constant.responsiveFontSize(1.8),
                fontWeight: 'normal',
                fontFamily: constant.SUIFONT,
                color: constant.SPLASHTEXT,
              }}>
              {'Already have an account?'}
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(1.8),
                  fontWeight: 'normal',
                  fontFamily: constant.SUIFONT,
                  color: constant.THEME,
                  marginLeft: constant.HEIGHT * 1,
                  textDecorationLine: 'underline',
                  textDecorationColor: constant.THEME,
                }}>
                {'Login'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 20}} />
        </ScrollView>
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

export default SignIn;
