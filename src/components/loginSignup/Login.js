import React, {Component, useState, useEffect} from 'react';
import {SafeAreaView, View, Text, Image, TouchableOpacity} from 'react-native';
import {Platform} from 'react-native';
import StatusBars from '../commons/StatusBar';
import * as constant from '../../utils/constants';
import Ripple from './../../libs/Ripple/Ripple';
import {TextInput} from 'react-native-paper';
var num = '';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
    };
  }

  handleUserName(text) {
    this.setState({userName: text});
  }

  handlePassword(text) {
    num = text;
    if (num.length <= 10) {
      this.setState({password: text}, () => {
        // console.error(this.state.phone);
      });
    }
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
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              marginTop: constant.HEIGHT * 3,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SignIn')}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(1.9),
                  fontWeight: 'normal',
                  fontFamily: constant.SUIIBOLD,
                  color: constant.SPLASHTEXT,
                  textAlign: 'right',
                }}>
                {'Join Now'}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                alignSelf: 'center',
                marginTop: constant.HEIGHT * 5,
              }}>
              <Image
                resizeMode={'contain'}
                style={{
                  height: constant.HEIGHT * 10,
                  width: constant.HEIGHT * 30,
                }}
                source={constant.ICONMAINLOGO}
              />
              <Image
                resizeMode={'contain'}
                style={{
                  height: constant.HEIGHT * 5,
                  width: constant.HEIGHT * 17,
                  alignSelf: 'center',
                  marginTop: constant.HEIGHT * 1.3,
                }}
                source={constant.ICONPOWERDEDLOGO}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginTop: constant.HEIGHT * 2,
              }}>
              <TextInput
                label="Email Address"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 40,
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
                onChangeText={(value) => this.handleUserName(value)}
              />
              <TextInput
                label="Password"
                mode="flat"
                style={[
                  {
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(2.2),
                    color: '#888888',
                    height: constant.HEIGHT * 10,
                    width: constant.HEIGHT * 40,
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
                value={this.state.password}
                onChangeText={(value) => this.handlePassword(value)}
              />
            </View>
            <Text
              style={{
                fontSize: constant.responsiveFontSize(1.9),
                fontWeight: '900',
                fontFamily: constant.SUIFONT,
                color: constant.SPLASHTEXT,
                textAlign: 'right',
                marginTop: constant.HEIGHT * 1.5,
              }}>
              {'Forgot Password?'}
            </Text>

            <Ripple
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: constant.HEIGHT * 5.5,
                marginHorizontal: constant.HEIGHT * 5,
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
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(2.0),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                  color: constant.WHITE,
                }}>
                {'Login'}
              </Text>
            </Ripple>

            <View
              style={{
                alignSelf: 'center',
                marginVertical: constant.HEIGHT * 8,
              }}>
              <Image
                resizeMode={'contain'}
                style={{
                  height: constant.HEIGHT * 7,
                  width: constant.HEIGHT * 15,
                  alignSelf: 'center',
                }}
                source={constant.ICONFINGERPRINT}
              />
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(1.7),
                  fontWeight: '900',
                  fontFamily: constant.SUIIFONT,
                  color: constant.SPLASHTEXT,
                  textAlign: 'center',
                  marginTop: constant.HEIGHT * 2,
                }}>
                {'Login with Tough ID'}
              </Text>
            </View>

            {/* <View style={{marginHorizontal: constant.HEIGHT * 5}}></View> */}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default Login;
