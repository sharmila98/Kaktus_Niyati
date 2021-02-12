import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Keyboard,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {postCouponAction} from '../../../action/SideDrawer_action.js';

import * as constant from '../../../utils/constants';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';


class AvailCoupon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      couponText: '',
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
  }

  postCoupon(type) {
    try {
      Keyboard.dismiss();
      var head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      var inputs = {
        member_id: this.props.signIn.member_id,
        type: type == 1 ? 'validate ' : 'activate',
        coupon_code: this.state.couponText,
      };

      var url = Url.baseUrl + Url.coupon;

      this.props
        .postCouponAction(head, url, methods.post, inputs)
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data)
          }
        });
    } catch (error) {}
  }

  handelCoupon(text) {
    this.setState({couponText: text}, () => {});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0}}>
              <View
                style={{
                  backgroundColor: constant.WHITE,
                  marginVertical: constant.HEIGHT * 1.5,
                }}>
                   <BackButtonwithTitle
                  title={'Avail coupon'}
                  underLine={true}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.goBack()}
                  
                  />
                {/* <TouchableOpacity
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
                    Avail coupon
                  </Text>
                </TouchableOpacity> */}
                <View
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
                      fontFamily: constant.SUIFONT,
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
                      fontFamily: constant.SUIFONT,
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
                    onChangeText={(text) => this.handelCoupon(text)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <View
                    style={{
                      marginTop: constant.HEIGHT * 4,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.postCoupon(1)}
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
                          fontFamily: constant.SUIFONT,
                        }}>
                        Validate
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.postCoupon(2)}
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
                          fontFamily: constant.SUIFONT,
                        }}>
                        Activate Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      postCouponAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AvailCoupon);
