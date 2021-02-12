import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  Modal,
  FlatList,
  ScrollView,
  LayoutAnimation,
  SafeAreaView,
  Animated,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import Ripple from './../../../libs/Ripple/Ripple';
import * as constant from '../../../utils/constants';
import StatusBar from '../../commons/StatusBar';
import Header from '../../commons/Header';
import * as Progress from 'react-native-progress';
import {
  pricingAction,
  transcationsAction,
  renewPricingAction,
  payemntDetails,
} from './../../../action/Payement_action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {onRegisterAction} from './../../../action/Login_Action';

import {
  getCouponAction,
  postCouponAction,
} from './../../../action/SideDrawer_action';

import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import RazorpayCheckout from 'react-native-razorpay';
var head,
  url = '';

class CouponApply extends Component {
  static navigationOptions = {
    title: 'Dashboard',
  };
  constructor(props) {
    super(props);
    this.state = {
      progress: 0.4,
      image: '',
      selectedPrice: '',
      selectedMode: '',
      couponText: '',
      selectedMode: '',
      selectedPrice: '',
      selctedSalePrice: '',
      selectedMrpPrice: '',
      selectedDuration: '',
      discountedAmt: '0',
      totalAmount: '0',
      type: 0,
    };
  }

  componentDidMount() {
    this.setState(
      {
        selectedMode: this.props.route.params.selectedMode,
        selectedPrice: this.props.route.params.selectedPrice,
        selctedSalePrice: this.props.route.params.selctedSalePrice,
        selectedMrpPrice: this.props.route.params.selectedMrpPrice,
        selectedDuration: this.props.route.params.selectedDuration,
        totalAmount: this.props.route.params.selctedSalePrice,
        type: this.props.route.params.type,
      },
      function () {},
    );
    var head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    var url = Url.baseUrl + Url.getCoupon;

    var input = {
      member_id: this.props.signIn.member_id,
      type: 'registration',
    };

    this.props
      .getCouponAction(head, url, methods.post, input)
      .then((response) => {
        if (response.status == 200) {
        } else {
        }
      });
  }

  savePerDay(type, mrp, sale) {
    var mrp = parseInt(mrp);
    var sale = parseInt(sale);

    var value =
      type == '1y' ? sale / 365 : type == '6m' ? sale / 180 : sale / 90;
    return value.toFixed(2);
  }

  savePercent(mrp, sale) {
    var mrp = parseInt(mrp);
    var sale = parseInt(sale);
    var save = mrp - sale;
    return Math.round((save / mrp) * 100);
  }

  youSave(mrp, sale) {
    var mrp = parseInt(mrp);
    var sale = parseInt(sale);

    return mrp - sale;
  }

  selectedPrice(mode, type) {
    try {
      this.setState({selectedPrice: type, selectedMode: mode}, function () {
        setTimeout(() => {
          this.scroll.scrollToEnd({animated: true});
        }, 500);
      });
    } catch (e) {}
  }

  checkoutPay() {
    try {
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.transcations;

      var input = {
        member_id: this.props.signIn.member_id,
        amount: this.state.selctedSalePrice,
        currency: 'INR',
      };

      this.props
        .transcationsAction(head, url, methods.post, input)
        .then((response) => {
          if (response.status == 200) {
            var order_id = response.data.order_id;

            var options = {
              description: 'Standard P360 Plan',
              image: 'https://i.ibb.co/3B167XQ/Splash-Logo.png',
              currency: 'INR',
              key: 'rzp_test_nVJVZNUEfHsSvF',
              amount: this.state.totalAmount + '00',
              name: 'P360',
              // order_id: response.data.order_id, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
              prefill: {
                email: '',
                contact: '+91' + this.props.signIn.loginDetails.mobile,
                name: this.props.signIn.loginDetails.name,
              },
              theme: {color: constant.THEME},
            };
            RazorpayCheckout.open(options)
              .then((data) => {
                console.log('data', JSON.stringify(data), data);
                // handle success

                this.afterPayemnt(data, order_id, 'SUCCESS', '', 1);
                // alert(`Success: ${data.razorpay_payment_id}`);
              })
              .catch((error) => {
                // handle failure
                this.afterPayemnt(
                  '',
                  order_id,
                  'FAILED',
                  JSON.parse(error.description).error.description,
                  0,
                );
                // alert(`Error: ${error.code} | ${error.description}`);
                constant.toastAlert('Payment failed', ToastAndroid.LONG);
              });
          } else {
          }
        });
    } catch (e) {}
  }

  afterPayemnt(data, order_id, payStatus, error, type) {
    try {
      var inputs = {
        member_id: this.props.signIn.member_id,
        razorpay_payment_id: type == 1 ? data.razorpay_payment_id : '',
        razorpay_order_id: type == 1 ? order_id : '',
        razorpay_signature: type == 1 ? order_id : '',
        order_id: type == 1 ? order_id : '',
        trans_type: 'test',
        payment_status: payStatus,
        error: error,
      };

      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.transcations;

      this.props
        .transcationsAction(head, url, methods.post, inputs)
        .then((response) => {
          if (response.status == 200) {
            if (this.state.type == 1) {
              this.onRegister('paid', order_id);
            } else if (this.state.type == 2) {
              this.onRenew(order_id);
            }
          }
        });
    } catch (error) {}
  }

  onRenew(order_id) {
    try {
      var head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };
      var input = {
        member_id: this.props.signIn.member_id,
        order_id: order_id,
        subscription_details: {
          package_details: {
            type:
              this.state.selectedMode == 'standard' ? 'Standard' : 'Standard',
            MRP: this.props.pricingData.pricing[this.state.selectedMode][
              this.state.selectedPrice
            ].mrp,
            sale: this.props.pricingData.pricing[this.state.selectedMode][
              this.state.selectedPrice
            ].sale,
            duration: this.state.selectedDuration,
          },
          coupon: this.state.couponText,
        },
      };

      var url = Url.baseUrl + Url.renewPricing;

      this.props
        .renewPricingAction(head, url, methods.post, input)
        .then((response) => {
          if (response.status == 200) {
            constant.toastAlert(response.data.message,ToastAndroid.LONG)
            this.paymentSuccessDetails(order_id);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  paymentSuccessDetails(order_id) {
    try {
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };
      var urls =
        Url.baseUrl +
        '/api/bookings/' +
        this.props.signIn.member_id +
        '/' +
        order_id;

      this.props.payemntDetails(head, urls, methods.get, 1).then((response) => {
        if (response.status == 200) {
          setTimeout(() => {
            this.props.navigation.replace('BookingDetails',{
              fromPay: true
            });
          }, 500);
        } else {
        }
      });
    } catch (error) {}
  }

  onRegister(userType, order_id) {
    try {
      var head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };
      var inputs = {
        name: this.props.signIn.loginDetails.name,
        mobile: this.props.signIn.loginDetails.mobile,
        device_id: this.props.signIn.userDetails.device_id,
        dob: this.props.signIn.registration.dob,
        goal_type: this.props.signIn.registration.goal_type,
        weight: this.props.signIn.registration.weight,
        height: this.props.signIn.registration.height,
        bmi: this.props.signIn.registration.bmi,
        push_ups: this.props.signIn.registration.push_ups,
        subscription_details:
          userType == 'free'
            ? {
                package_details: {type: 'Free'},
              }
            : {
                package_details: {
                  type:
                    this.state.selectedMode == 'standard'
                      ? 'Standard'
                      : 'Standard',
                  MRP: this.state.selectedMrpPrice,
                  sale: this.state.selctedSalePrice,
                  duration: this.state.selectedDuration,
                },
                coupon: this.state.couponText,
                order_id: order_id,
              },
      };
      var url = Url.baseUrl + Url.registration;

      this.props
        .onRegisterAction(head, url, methods.post, inputs, true)
        .then((response) => {
          if (response.status == 200) {
            this.paymentSuccessDetails(order_id);
          }
        });
    } catch (e) {}
  }

  applyCoupon(item) {
    try {
      if (item.coupon_value.amount != 0) {
        var disAmount = parseInt(item.coupon_value.amount);
        this.setState({
          totalAmount: this.state.selctedSalePrice - disAmount,
          discountedAmt: item.coupon_value.amount,
        });
      } else if (item.coupon_value.percentage != 0) {
        var amtDis = Math.round(
          (this.state.selctedSalePrice / 100) * item.coupon_value.percentage,
        );

        this.setState({
          totalAmount: this.state.selctedSalePrice - amtDis,
          discountedAmt: amtDis,
        });
      }

      this.setState(
        {
          couponText: item.coupon_code,
        },
        function () {
          if (this.state.couponText.length != 0) {
            var head = {
              accept: 'application/json',
              Authorization: this.props.signIn.token,
            };

            var url = Url.baseUrl + Url.getCoupon;

            var inputs = {
              member_id: this.props.signIn.member_id,
              type: 'validate',
              coupon_code: this.state.couponText,
            };

            var url = Url.baseUrl + Url.coupon;

            this.props
              .postCouponAction(head, url, methods.post, inputs)
              .then((res) => {
                if (res.status == 200) {
                  console.error(res.data);
                }
              });
          } else {
          }
        },
      );
    } catch (error) {}
  }

  _renderItem = ({item, index}) => {
    var coupon = item.coupon_code;

    return (
      <View style={{paddingBottom: constant.HEIGHT * 2}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.8, justifyContent: 'flex-start'}}>
            <View
              style={{
                borderRadius: constant.HEIGHT * 0.5,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: constant.HEIGHT * 1.5,
                  borderRadius: constant.HEIGHT * 0.5,
                  alignItems: 'center',
                  backgroundColor: item.color_code,
                }}>
                <Image
                  resizeMode={'contain'}
                  source={{uri: Url.baseUrl + '/' + item.image[0].path}}
                  style={{
                    width: constant.HEIGHT * 3,
                    height: constant.HEIGHT * 3,
                    opacity: 0.7,
                    marginLeft: constant.HEIGHT * 1.5,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    flexWrap: 'wrap',
                    color: constant.WHITE,
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(1.8),
                    paddingHorizontal: constant.HEIGHT * 1.5,
                    maxWidth: constant.HEIGHT * 35,
                  }}>
                  {coupon}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => this.applyCoupon(item)}
            style={{
              flex: 0.2,
              justifyContent: 'center',
              alignContent: 'flex-end',
            }}>
            <Text
              style={{
                textAlign: 'right',
                fontWeight: 'bold',
                color: constant.THEME,
                fontFamily: constant.SUIFONT,
                fontSize: constant.responsiveFontSize(1.8),
              }}>
              {'APPLY'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', paddingTop: constant.HEIGHT * 1}}>
          <Text
            style={{
              textAlign: 'left',
              fontSize: constant.responsiveFontSize(1.4),
              fontFamily: constant.SUIFONT,
            }}>
            {item.caption}
          </Text>
        </View>
      </View>
    );
  };

  handelCoupon = (text) => {
    this.setState({
      couponText: text,
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <Header
              navigation={this.props.navigation}
              onPress={false}
              showIcons={false}
            />

            <ScrollView ref={(ref) => (this.scroll = ref)}>
              {this.props.pricing.loadPrice == false &&
              this.props.pricing.pricingData != '' ? (
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    paddingTop: constant.HEIGHT * 2,
                  }}>
                  <BackButtonwithTitle
                    title={'Subscribe'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.goBack()}
                  />
                  <TouchableOpacity
                    onPress={() => Keyboard.dismiss()}
                    activeOpacity={1}
                    style={{padding: constant.HEIGHT * 2}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}>
                      <View style={{flex: 0.4, justifyContent: 'center'}}>
                        <Text
                          style={{
                            textAlign: 'left',
                            opacity: 0.6,
                            fontFamily: constant.SUIFONT,
                            fontSize: constant.responsiveFontSize(1.6),
                          }}>
                          Amount Payable
                        </Text>
                      </View>
                      <View style={{flex: 0.6, justifyContent: 'center'}}>
                        <Text
                          style={{
                            textAlign: 'right',
                            fontWeight: 'bold',
                            fontSize: constant.responsiveFontSize(2),
                          }}>
                          {'Rs.'}
                          {this.state.selctedSalePrice != ''
                            ? this.state.selctedSalePrice
                            : '00'}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}>
                      <View style={{flex: 0.4, justifyContent: 'center'}}>
                        <Text
                          style={{
                            textAlign: 'left',
                            opacity: 0.6,
                            fontFamily: constant.SUIFONT,
                            fontSize: constant.responsiveFontSize(1.6),
                          }}>
                          {'Coupon'}
                        </Text>
                      </View>
                      <View style={{flex: 0.6, justifyContent: 'center'}}>
                        <Text
                          style={{
                            textAlign: 'right',
                            fontWeight: 'bold',
                            fontSize: constant.responsiveFontSize(2),
                          }}>
                          {'-Rs.' + this.state.discountedAmt}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingTop: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}>
                      <Text
                        style={{
                          color: constant.THEME,
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                        }}
                        ellipsizeMode="clip"
                        numberOfLines={1}>
                        - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        - - - - - - - - - - - - - - - -
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}>
                      <View style={{flex: 0.4, justifyContent: 'center'}}>
                        <Text
                          style={{
                            textAlign: 'left',
                            opacity: 0.8,
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            fontSize: constant.responsiveFontSize(1.8),
                          }}>
                          {'Total'}
                        </Text>
                      </View>
                      <View style={{flex: 0.6, justifyContent: 'center'}}>
                        <Text
                          style={{
                            textAlign: 'right',
                            fontWeight: 'bold',
                            fontSize: constant.responsiveFontSize(2.2),
                            fontFamily: constant.SUIFONT,
                          }}>
                          {'Rs.'}
                          {this.state.totalAmount != ''
                            ? this.state.totalAmount
                            : '00'}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          flex: 0.8,
                          justifyContent: 'center',
                          borderColor: constant.GREYLIGHT,
                          borderBottomWidth: constant.HEIGHT * 0.1,
                          flexDirection: 'row',
                        }}>
                        <Image
                          resizeMode={'contain'}
                          source={constant.ICONCOUPON}
                          style={{
                            width: constant.HEIGHT * 2,
                            height: constant.HEIGHT * 2,
                            alignSelf: 'center',
                            tintColor: constant.THEME,
                          }}
                        />
                        <TextInput
                          style={{
                            fontFamily:
                              Platform.OS === 'ios'
                                ? constant.REBOTOREGULAR
                                : constant.REBOTOREGULAR,
                            fontSize: constant.responsiveFontSize(2),
                            color: constant.BLACK,
                            textAlign: 'left',
                            marginLeft: constant.HEIGHT * 1,
                            maxWidth: constant.HEIGHT * 35,
                            justifyContent: 'flex-start',
                            letterSpacing: constant.HEIGHT * 0.1,
                            fontFamily: constant.SUIFONT,
                            flex: 1,
                          }}
                          maxLength={25}
                          placeholder={'Enter Coupon Code'}
                          returnKeyType={'done'}
                          numberOfLines={1}
                          renderToHardwareTextureAndroid
                          ref="coupon"
                          enablesReturnKeyAutomatically={true}
                          autoFocus={false}
                          value={this.state.couponText}
                          autoCorrect={false}
                          autoCapitalize={'none'}
                          underlineColorAndroid={'transparent'}
                          onChangeText={(text) => this.handelCoupon(text)}
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          this.state.couponText.length != 0
                            ? this.applyCoupon()
                            : null
                        }
                        style={{
                          flex: 0.2,
                          borderColor: constant.GREYLIGHT,
                          borderBottomWidth: constant.HEIGHT * 0.1,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'right',
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            color:
                              this.state.couponText.length != 0
                                ? constant.THEME
                                : constant.GREYLIGHT,
                            fontSize: constant.responsiveFontSize(1.8),
                          }}>
                          {'APPLY'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        paddingTop: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                        justifyContent: 'flex-start',
                      }}>
                      <View style={{justifyContent: 'flex-start'}}>
                        <Text
                          style={{
                            textAlign: 'left',
                            opacity: 0.6,
                            fontFamily: constant.SUIFONT,
                            fontSize: constant.responsiveFontSize(1.6),
                          }}>
                          {'Available Coupons'}
                        </Text>
                      </View>
                      <View>
                        <FlatList
                          data={this.props.pricing.couponsList}
                          style={{paddingTop: constant.HEIGHT * 2}}
                          extraData={this.props}
                          renderItem={this._renderItem}
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item, index) => index + ''}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        paddingTop: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                        justifyContent: 'flex-start',
                      }}>
                      <TouchableOpacity
                        onPress={() => this.checkoutPay()}
                        style={{
                          backgroundColor: constant.THEME,
                          paddingVertical: constant.HEIGHT * 1,
                          paddingHorizontal: constant.HEIGHT * 2,
                          borderRadius: constant.HEIGHT * 0.5,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: constant.WHITE,
                            fontFamily: constant.SUIFONT,
                            fontWeight: 'bold',
                            fontSize: constant.responsiveFontSize(2.2),
                          }}>
                          {'PROCEED'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <Progress.Circle
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    flex: 1,
                    marginTop: constant.HEIGHT * 35,
                  }}
                  size={50}
                  // progress={this.state.progress}
                  indeterminate={true}
                  color={'#FF67A4'}
                />
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    pricing: state.pricingReducer,
    pricingData: state.pricingReducer.pricingData,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      pricingAction,
      transcationsAction,
      onRegisterAction,
      getCouponAction,
      postCouponAction,
      payemntDetails,
      renewPricingAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(CouponApply);
