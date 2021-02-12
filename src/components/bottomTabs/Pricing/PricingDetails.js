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
} from 'react-native';
import Ripple from './../../../libs/Ripple/Ripple';
import * as constant from '../../../utils/constants';
import StatusBar from '../../commons/StatusBar';
import Header from '../../commons/Header';
import * as Progress from 'react-native-progress';
import {
  pricingAction,
  transcationsAction,
} from './../../../action/Payement_action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {onRegisterAction} from './../../../action/Login_Action';

import RazorpayCheckout from 'react-native-razorpay';
var head,
  url = '';

class PricingDetails extends Component {
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
    };
  }

  componentDidMount() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.pricing;

    var input = {
      type: 'get',
    };

    this.props
      .pricingAction(head, url, methods.post, input)
      .then((response) => {
        if (response.status == 200) {
        } else {
        }
      });
  }

  activate() {
    try {
      this.onRegister('free');
    } catch (e) {}
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

  selectedPrice(mode, type, duration) {
    try {
      this.setState(
        {selectedPrice: type, selectedMode: mode, selectedDuration: duration},
        function () {
          setTimeout(() => {
            this.scroll.scrollToEnd({animated: true});
          }, 500);
        },
      );
    } catch (e) {}
  }

  renderPrcing(mode, type, duration) {
    return (
      <Ripple
        onPress={() => this.selectedPrice(mode, type, duration)}
        style={{paddingTop: constant.HEIGHT * 3}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              flex: 0.3,
              justifyContent: 'center',
              paddingVertical: constant.HEIGHT * 2,
              paddingHorizontal: constant.HEIGHT * 3,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                opacity: 0.7,
                fontSize: constant.responsiveFontSize(2.2),
              }}>
              {type == '1y' ? '1 Year' : type == '6m' ? '6 Months' : '3 Months'}
            </Text>
          </View>
          <View style={{flex: 0.5, alignItems: 'flex-end'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(2.2),
                  opacity: 0.5,
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}>
                {'Rs.' + this.props.pricingData.pricing[mode][type].mrp}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: constant.responsiveFontSize(2.2),
                  opacity: 0.7,
                }}>
                {'   Rs.' + this.props.pricingData.pricing[mode][type].sale}
              </Text>
            </View>
            <Text
              style={{
                color: constant.THEME,
                fontSize: constant.responsiveFontSize(1.8),
                paddingVertical: constant.HEIGHT * 1,
              }}>
              {'You save: Rs.' +
                this.youSave(
                  this.props.pricingData.pricing[mode][type].mrp,
                  this.props.pricingData.pricing[mode][type].sale,
                ) +
                ' (' +
                this.savePercent(
                  this.props.pricingData.pricing[mode][type].mrp,
                  this.props.pricingData.pricing[mode][type].sale,
                ) +
                '%)'}
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                opacity: 0.5,
                fontSize: constant.responsiveFontSize(1.4),
              }}>
              {'Just Rs.' +
                this.savePerDay(
                  type,
                  this.props.pricingData.pricing[mode][type].mrp,
                  this.props.pricingData.pricing[mode][type].sale,
                ) +
                ' Per Day'}
            </Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <View
              style={{
                width: constant.HEIGHT * 3,
                height: constant.HEIGHT * 3,
                borderWidth: constant.HEIGHT * 0.05,
                borderRadius: constant.HEIGHT * 2,
                justifyContent: 'center',
                backgroundColor:
                  this.state.selectedPrice == type
                    ? constant.THEME
                    : 'transparent',
                alignItems: 'center',
                borderColor: constant.GREY,
              }}>
              <Text
                style={{
                  color: constant.WHITE,
                  textAlign: 'center',
                  justifyContent: 'center',
                  borderRadius: constant.HEIGHT * 2,
                  fontSize: constant.responsiveFontSize(1.4),
                }}>
                ✔
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: constant.HEIGHT * 0.1,
            marginTop: constant.HEIGHT * 3,
            backgroundColor: constant.GREY,
            opacity: 0.5,
          }}
        />
      </Ripple>
    );
  }

  getText(text) {
    return (
      <Text
        style={{
          color: constant.WHITE,
          textAlign: 'left',
          opacity: 0.6,
          paddingVertical: constant.HEIGHT * 1,
          fontSize: constant.responsiveFontSize(1.8),
        }}>
        {text}
      </Text>
    );
  }

  getTrailText(text) {
    return (
      <Text
        style={{
          color: constant.WHITE,
          textAlign: 'left',
          opacity: 0.6,
          paddingVertical: constant.HEIGHT * 1,
          fontSize: constant.responsiveFontSize(1.8),
        }}>
        {text}
      </Text>
    );
  }

  checkoutPay() {
    try {
      this.props.navigation.navigate('CouponApply', {
        selectedMode: this.state.selectedMode,
        selectedPrice: this.state.selectedPrice,
        selctedSalePrice: this.props.pricingData.pricing[
          this.state.selectedMode
        ][this.state.selectedPrice].sale,
        selectedMrpPrice: this.props.pricingData.pricing[
          this.state.selectedMode
        ][this.state.selectedPrice].mrp,
        selectedDuration: this.state.selectedDuration,
        type:1
      });
      // head = {
      //   accept: 'application/json',
      //   Authorization: this.props.signIn.token,
      // };

      // url = Url.baseUrl + Url.transcations;

      // var input = {
      //   member_id: this.props.signIn.member_id,
      //   amount: this.props.pricingData.pricing[this.state.selectedMode][
      //     this.state.selectedPrice
      //   ].sale,
      //   currency: 'INR',
      // };

      // this.props
      //   .transcationsAction(head, url, methods.post, input)
      //   .then((response) => {
      //     if (response.status == 200) {
      //       var order_id = response.data.order_id;

      //       var options = {
      //         description: 'Standard Pinkfitness Plan',
      //         image: 'https://i.imgur.com/3g7nmJC.png',
      //         currency: 'INR',
      //         key: 'rzp_test_nVJVZNUEfHsSvF',
      //         amount:
      //           this.props.pricingData.pricing[this.state.selectedMode][
      //             this.state.selectedPrice
      //           ].sale + '00',
      //         name: 'P360',
      //         // order_id: response.data.order_id, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
      //         prefill: {
      //           email: '',
      //           contact: this.props.signIn.loginDetails.mobile,
      //           name: this.props.signIn.loginDetails.name,
      //         },
      //         theme: {color: constant.THEME},
      //       };
      //       RazorpayCheckout.open(options)
      //         .then((data) => {
      //           // handle success

      //           this.afterPayemnt(data, order_id);
      //           // alert(`Success: ${data.razorpay_payment_id}`);
      //         })
      //         .catch((error) => {
      //           // handle failure
      //           // alert(`Error: ${error.code} | ${error.description}`);
      //           constant.toastAlert('Payment failed', ToastAndroid.LONG);
      //         });
      //     } else {
      //     }
      //   });
    } catch (e) {}
  }

  afterPayemnt(data, order_id) {
    console.log('order_id', order_id);
    try {
      var inputs = {
        member_id: this.props.signIn.member_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_order_id: order_id,
        razorpay_signature: order_id,
        order_id: order_id,
      };

      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.transcations;

      this.props
        .transcationsAction(head, url, methods.post, inputs)
        .then((response) => {
          console.error(response);
          if (response.status == 200) {
            this.onRegister('paid', order_id);
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
                  type: 'Standard',
                  MRP: 1299,
                  sale: 1499,
                  duration: '3 Month',
                },
                coupon: {},
                order_id: order_id,
              },
      };
      var url = Url.baseUrl + Url.registration;

      this.props
        .onRegisterAction(head, url, methods.post, inputs, true)
        .then((response) => {
          if (response.status == 200) {
            // this.onDashBoard();
            this.props.navigation.navigate('BottomTabs');
          }
        });
    } catch (e) {}
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <Header
              navigation={this.props.navigation}
              onPress={null}
              showIcons={false}
            />

            <ScrollView ref={(ref) => (this.scroll = ref)}>
              {this.props.pricing.loadPrice == false &&
              this.props.pricing.pricingData != '' ? (
                <View>
                  <View
                    style={{
                      elevation:
                        Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                      backgroundColor: constant.THEME,
                      borderRadius: constant.HEIGHT * 3,
                      marginTop: constant.HEIGHT * 1,
                      marginHorizontal: constant.HEIGHT * 1,
                      paddingBottom: constant.HEIGHT * 5,
                      padding: constant.HEIGHT * 2,
                      shadowOffset:
                        Platform.OS === 'ios'
                          ? {
                              width: 0,
                              height: constant.HEIGHT * 2,
                            }
                          : null,
                      shadowRadius:
                        Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
                      shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: constant.responsiveFontSize(3),
                        fontWeight: 'bold',
                        color: constant.WHITE,
                      }}>
                      {'Activate your ' +
                        this.props.pricingData.pricing.free['days'] +
                        ' Days Trial'}
                    </Text>
                    <View style={{marginVertical: constant.HEIGHT * 1}}>
                      <Text
                        style={{
                          textAlign: 'left',
                          fontSize: constant.responsiveFontSize(2),
                          color: constant.WHITE,
                          paddingVertical: constant.HEIGHT * 2,
                          fontWeight: 'bold',
                        }}>
                        {'UNLIMITED ACCESS TO'}
                      </Text>
                      {this.getText('✔  Schedule Workout')}
                      {this.getText('✔  Diet Plan & Consultation')}
                      {this.getText('✔  Live Workout')}
                      {this.getText('✔  Fitness Challenges')}
                      {this.getText('✔  Group Workout & More')}
                    </View>

                    <TouchableOpacity
                      onPress={() => this.activate()}
                      style={{
                        backgroundColor: constant.WHITE,
                        borderRadius: constant.HEIGHT * 3,
                        paddingHorizontal: constant.HEIGHT * 1.5,
                        marginHorizontal: constant.HEIGHT * 8,
                        marginTop: constant.HEIGHT * 2,
                        paddingVertical: constant.HEIGHT * 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: constant.THEME,
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: constant.responsiveFontSize(3),
                        }}>
                        {'Activate Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginBottom: constant.HEIGHT * 2,
                      paddingHorizontal: constant.HEIGHT * 2,
                    }}>
                    {this.renderPrcing('standard', '1y', '1 Year')}
                    {this.renderPrcing('standard', '6m', '6 Month')}
                    {this.renderPrcing('standard', '3m', '3 Month')}

                    {this.state.selectedMode != '' ? (
                      <TouchableOpacity
                        onPress={() => this.checkoutPay()}
                        style={{
                          backgroundColor: constant.THEME,
                          borderRadius: constant.HEIGHT * 4,
                          paddingHorizontal: constant.HEIGHT * 1.5,
                          marginHorizontal: constant.HEIGHT * 8,
                          marginVertical: constant.HEIGHT * 4,
                          paddingVertical: constant.HEIGHT * 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: constant.WHITE,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: constant.responsiveFontSize(2.2),
                          }}>
                          {'PAY Rs.' +
                            this.props.pricingData.pricing[
                              this.state.selectedMode
                            ][this.state.selectedPrice].sale +
                            '/- '}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
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
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(PricingDetails);
