import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';

import * as constant from '../../../utils/constants';


class ReferFriend extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
  }

  renderCoupon = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          marginBottom: constant.HEIGHT * 3,
          flex: 1,
          marginHorizontal: constant.HEIGHT * 3,
          flexDirection: 'row',
          backgroundColor: constant.THEME,
          borderRadius: constant.HEIGHT * 2,
        }}>
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1]}
          style={{flex: 0.05}}
          listKey={(item, index) => index + ''}
          extraData={this.props}
          renderItem={this.renderStripView}
          keyExtractor={(item, index) => index + ''}
        />
        <View
          style={{
            flex: 0.9,
            flexDirection: 'row',
            paddingHorizontal: constant.HEIGHT * 2,
            marginHorizontal: constant.HEIGHT * 2,
            alignItems: 'center',
          }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                style={{
                  width: constant.HEIGHT * 13,
                  height: constant.HEIGHT * 13,
                  borderRadius: constant.HEIGHT * 10,
                  backgroundColor: '#fff',
                  marginRight: constant.HEIGHT * 5,
                }}></ImageBackground>
            </View>

            <View
              style={{
                flex: 0.6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: constant.WHITE,
                  fontSize: constant.responsiveFontSize(1.8),
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {'DO IT TOGETHER'}
              </Text>
              <Text
                style={{
                  color: constant.WHITE,
                  fontSize: constant.responsiveFontSize(1.2),
                  textAlign: 'center',
                }}>
                {'More Fun + Burn More Calories'}
              </Text>
              <View
                style={{
                  height: 0.5,
                  marginVertical: constant.HEIGHT * 1.5,
                  width: '100%',
                  borderRadius: 1,
                  borderWidth: 1,
                  borderColor: '#fff',
                  borderStyle: 'dashed',
                }}
              />
              <Text
                style={{
                  color: constant.WHITE,
                  fontSize: constant.responsiveFontSize(2.2),
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {'15 Days'}
              </Text>
              <View
                style={{
                  height: 0.5,
                  marginVertical: constant.HEIGHT * 1.5,
                  width: '100%',
                  borderRadius: 1,
                  borderWidth: 1,
                  borderColor: '#fff',
                  borderStyle: 'dashed',
                }}
              />
            </View>
          </View>
        </View>

        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1]}
          style={{
            flex: 0.05,
          }}
          listKey={(item, index) => index + ''}
          extraData={this.props}
          keyExtractor={(item, index) => index + ''}
          renderItem={this.renderStripeRight}
        />
      </View>
    );
  };

  renderStripView = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.05, borderTopLeftRadius: constant.HEIGHT * 2}}>
          {index != 0 && index != 6 ? (
            <View
              style={{
                width: constant.HEIGHT * 2,
                height: constant.HEIGHT * 3,
                backgroundColor: '#fff',
                marginBottom: index == 5 ? 0 : constant.HEIGHT * 1,
                borderTopRightRadius: constant.HEIGHT * 8,
                borderBottomRightRadius: constant.HEIGHT * 8,
              }}></View>
          ) : (
            <View style={{height: constant.HEIGHT * 2}} />
          )}
        </View>

        {/* <View style={{flex: 0.9}}>
         
        </View> */}
        {/* <View style={{flex: 0.05, marginLeft: constant.HEIGHT * 8}}>
          {index != 0 && index != 6 ? (
            <View
              style={{
                width: constant.HEIGHT * 2,
                height: constant.HEIGHT * 3,
                backgroundColor: '#fff',
                marginBottom: index == 5 ? 0 : constant.HEIGHT * 1,
                borderTopLeftRadius: constant.HEIGHT * 8,
                borderBottomLeftRadius: constant.HEIGHT * 8,
              }}></View>
          ) : (
            <View style={{height: constant.HEIGHT * 3}} />
          )}
        </View> */}
      </TouchableOpacity>
    );
  };

  renderStripeRight = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.05}}>
          {index != 0 && index != 6 ? (
            <View
              style={{
                width: constant.HEIGHT * 2,
                height: constant.HEIGHT * 3,
                backgroundColor: '#fff',
                marginBottom: index == 5 ? 0 : constant.HEIGHT * 1,
                borderTopLeftRadius: constant.HEIGHT * 8,
                borderBottomLeftRadius: constant.HEIGHT * 8,
              }}></View>
          ) : (
            <View style={{height: constant.HEIGHT * 2}} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation}  onPress={false} />
            <View style={{flex: 0.94}}>
              <View
                style={{
                  backgroundColor: constant.WHITE,
                  marginVertical: constant.HEIGHT * 1.5,
                  marginBottom: constant.HEIGHT * 12,
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginRight: constant.HEIGHT * 2,
                  }}>
                  <Image
                    source={constant.ICONARROWORANGE}
                    style={{
                      marginHorizontal: constant.HEIGHT * 1,
                      width: constant.HEIGHT * 2,
                      height: constant.HEIGHT * 2,
                      alignSelf: 'center',
                      tintColor: constant.THEME,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(2),
                      opacity: 0.6,
                      flex: 1,
                      fontWeight: 'bold',
                      borderBottomWidth: constant.HEIGHT * 0.1,
                      borderColor: '#707070',
                      fontFamily: constant.SUIFONT,
                    }}>
                    Refer a friend
                  </Text>
                </TouchableOpacity>
                <View>
                  <FlatList
                    data={[1, 1, 1, 1, 1, 1, 1]}
                    style={{marginTop: constant.HEIGHT * 3}}
                    extraData={this.props}
                    keyExtractor={(item, index) => index + ''}
                    renderItem={this.renderCoupon}
                  />
                </View>
                {/* <View
                  elevation={5}
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: constant.WHITE,
                    borderRadius: constant.HEIGHT * 1,
                    padding: constant.HEIGHT * 2,
                    marginTop: constant.HEIGHT * 4,
                    paddingHorizontal: constant.HEIGHT * 6,
                    paddingVertical: constant.HEIGHT * 5,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(2),
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT
                    }}>
                    Enter coupon code here
                  </Text>
                  <TextInput
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.6),
                      color: constant.BLACK,
                      borderColor: '#707070',
                      marginTop: constant.HEIGHT * 2,
                      textAlign: 'center',
                      borderWidth: constant.HEIGHT * 0.1,
                      letterSpacing: constant.HEIGHT * 0.1,
                      fontFamily: constant.SUIFONT
                    }}
                    placeholder={'COUPON CODE'}
                    returnKeyType={'next'}
                    numberOfLines={1}
                    renderToHardwareTextureAndroid
                    ref="name"
                    enablesReturnKeyAutomatically={true}
                    // autoFocus={true}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    autoCompleteType={'name'}
                    underlineColorAndroid="transparent"
                    onSubmitEditing={() => this.refs.phone.focus()}
                  />
                  <View
                    style={{
                      marginTop: constant.HEIGHT * 4,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#959191',
                        paddingHorizontal: constant.HEIGHT * 4,
                        paddingVertical: constant.HEIGHT * 1,
                        borderRadius: constant.HEIGHT * 0.5,
                      }}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(1.8),
                          color: constant.WHITE,
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT
                        }}>
                        Validate
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: constant.THEME,
                        marginLeft: constant.HEIGHT * 1.5,
                        paddingHorizontal: constant.HEIGHT * 2,
                        paddingVertical: constant.HEIGHT * 1,
                        borderRadius: constant.HEIGHT * 0.5,
                      }}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(1.8),
                          fontWeight: 'bold',
                          color: constant.WHITE,
                          fontFamily: constant.SUIFONT
                        }}>
                        Activate Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View> */}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default ReferFriend;
