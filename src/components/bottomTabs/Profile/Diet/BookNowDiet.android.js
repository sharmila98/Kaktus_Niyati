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
  Modal,
  ToastAndroid,
  RadioBox,
  RefreshControl,
  Alert,
} from 'react-native';
import {RadioButton} from 'react-native-paper';

// import Slider from '@react-native-community/slider';

import {DatePickerDialog} from 'react-native-datepicker-dialog';
import DatePicker from 'react-native-date-picker';

import moment from 'moment';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';
// import DatePicker from 'react-native-date-picker';
import RazorpayCheckout from 'react-native-razorpay';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onBookingAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';
import {
  pricingAction,
  payemntDetails,
  transcationsAction,
} from './../../../action/Payement_action';
import Ripple from '../../../libs/Ripple/Ripple';

var head, url;

const setDate = new Date();
const date = new Date();

class BookNowDiet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weight_kgs: 0,
      weight_lbs: 0,
      SliderValue: 0,
      currentImage: 0,
      bmi: 0,
      images: [constant.ICONSTART, constant.ICONDOWN, constant.ICONPUSH],
      openDate: false,
      openTime: false,
      dob: new Date(),
      time: '',
      tme: new Date(),
      date: '',
      isVideo: false,
      isAudio: false,
      isReminder: false,
      bookingDate: {},
      value: {},
      bookingTime: {},
      userItem: -1,
      isproceed: false,
    };
  }

  componentDidMount() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.bookingRequest;

    var inputs = {
      member_id: this.props.signIn.member_id,
      booking_type: 'diet',
      date: moment(new Date()).format('YYYY-MM-DD'),
      time: new Date().getTime(),
      booking_request: '',
      reminder: false,
      req_type: 'list',
    };

    this.props.onBookingAction(head, url, methods.post, inputs).then((res) => {
      if (res.status == 200) {
      }
    });
  }

  showEmptyListView = () => {
    return this.state.isProceed == true ? (
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2),
            alignSelf: 'center',
            fontWeight: 'bold',
            marginTop: constant.HEIGHT * 1,
            fontFamily: constant.SUIFONT,
          }}>
          No data to display
        </Text>
      </View>
    ) : null;
  };

  openClose(index, item) {
    if (index == this.state.userItem) {
      this.setState({
        userItem: -1,
      });
    } else {
      this.setState({
        userItem: index,
        tme: new Date(item.booking_time),
        dob: new Date(item.booking_date),
        modalVisible: true,
        time: item.booking_time,
        date: moment(item.booking_date).format('DD-MM-YYYY'),
      });
    }
  }

  openDate() {
    if (this.state.openDate == true) {
      this.setState({
        openDate: false,
      });
    } else {
      this.setState({
        openDate: true,
      });
    }
  }

  openTime() {
    if (this.state.openTime == true) {
      this.setState({
        openTime: false,
      });
    } else {
      this.setState({
        openTime: true,
      });
    }
  }

  isVideoCall() {
    if (this.state.isVideo == true) {
      this.setState({
        isVideo: false,
        isAudio: false,
      });
    } else {
      this.setState({
        isVideo: true,
        isAudio: false,
      });
    }
  }

  isAudioCall() {
    if (this.state.isAudio == true) {
      this.setState({
        isVideo: false,
        isAudio: false,
      });
    } else {
      this.setState({
        isVideo: false,
        isAudio: true,
      });
    }
  }

  onBookingRequest() {
    this.setState({isProceed: true});
    if (this.state.time != '' && this.state.date != '') {
      if (this.state.isAudio == true || this.state.isVideo == true) {
        this.booknow('locked')
      } else {
        constant.toastAlert(
          'Please Enter Call Type Audio or Video',
          ToastAndroid.LONG,
        );
      }
    } else {
      constant.toastAlert('Please Enter Date and Time ', ToastAndroid.LONG);
    }
  }

  booknow(status, resp) {
    try {
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.bookingRequest;

      var inputs = {
        member_id: this.props.signIn.member_id,
        booking_type: 'diet',
        date: moment(this.state.dob).format('YYYY-MM-DD'),
        time: this.state.time,
        booking_request: this.state.isVideo == true ? 'video' : 'audio',
        reminder: this.state.isReminder,
        req_type: status,
        booking_id: resp != undefined ? resp.booking_id : '',
      };

      this.props
        .onBookingAction(head, url, methods.post, inputs)
        .then((res) => {
          if (res.status == 200) {
            constant.toastAlert(res.data.message, ToastAndroid.LONG);
            if (status == 'confirmed') {
              this.paymentSuccessDetails(resp);
            } else {
              this.checkoutPay(res.data.data);
            }

          }
        });
    } catch (error) {}
  }
  checkoutPay(resp) {
    try {
      var options = {
        description: 'Dietitian  Booking',
        image: 'https://i.ibb.co/3B167XQ/Splash-Logo.png',
        currency: 'INR',
        key: 'rzp_test_nVJVZNUEfHsSvF',
        amount: resp.amount + '00',
        name: 'P360',
        // order_id: data.order_id, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
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
          this.afterPayemnt(data, resp, 'SUCCESS', '', 1); // 1 - Success 0 - Failure
          // alert(`Success: ${data.razorpay_payment_id}`);
        })
        .catch((error) => {
          // handle failure
          alert(`Error: ${error.code} | ${error.description}`);
          // var err = JSON.stringify(error);
          this.afterPayemnt(
            '',
            resp,
            'FAILED',
            JSON.parse(error.description).error.description,
            0,
          );
          constant.toastAlert('Payment failed', ToastAndroid.LONG);
        });
    } catch (e) {
      console.log(e);
    }
  }

  afterPayemnt(data, resp, payStatus, error, type) {
    console.log('order_id', resp.order_id);
    try {
      var inputs = {
        member_id: this.props.signIn.member_id,
        razorpay_payment_id: type == 1 ? data.razorpay_payment_id : '',
        razorpay_order_id: type == 1 ? resp.order_id : '',
        razorpay_signature: type == 1 ? resp.order_id : '',
        order_id: type == 1 ? resp.order_id : '',
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
          //   console.error(response);
          if (response.status == 200) {
            if (response.data.status == true) {
              type == 1 ? this.booknow('confirmed', resp) : null;

              //
            }
          }
        });
    } catch (error) {}
  }

  paymentSuccessDetails(resp) {
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
        resp.order_id;

      this.props.payemntDetails(head, urls, methods.get,2).then((response) => {
        if (response.status == 200) {
          setTimeout(() => {
            this.props.navigation.replace('PaymentSuccess');
          }, 500);
        } else {
          
        }
      });
    } catch (error) {}
  }


  onDOBDatePicked = async (date) => {
    var date = new Date(moment(date).format('YYYY-MM-DD'));
    date.setDate(date.getDate());

    this.setState(
      {
        bookingDate: moment(date).format('YYYY-MM-DD'),
        date: moment(date).format('DD-MM-YYYY'),
        dob: date,
      },
      () => {
        console.error(this.state.date);
      },
    );
  };

  onTimePicked = async (time) => {
    var tme = new Date(time);
    this.setState(
      {
        bookingTime: moment(time).format('HH:mm'),
        time: moment(time).format('hh:mm A'),
        tme: tme,
      },
      () => {
        console.log(this.state.bookingTime);
      },
    );
  };

  renderItem = ({item, index}) => {
    return (
      <Ripple
      style={{
        marginTop: constant.HEIGHT * 2,
        borderWidth: constant.HEIGHT * 0.1,
        borderRadius: constant.HEIGHT * 1,
        borderColor:
          this.state.userItem == index ? constant.THEME : constant.GREYLIGHT,
        paddingVertical: constant.HEIGHT * 1,
        paddingHorizontal: constant.HEIGHT * 2,
        marginRight: constant.HEIGHT * 3,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => {
        this.openClose(index, item);
      }}>
      {/* {this.state.userItem == index ? (
        <Image
          source={constant.ICONRADIOCHECK}
          style={{
            width: constant.HEIGHT * 2.74,
            height: constant.HEIGHT * 2.76,
            tintColor: constant.THEME,
            marginLeft: constant.HEIGHT * 1,
          }}
        />
      ) : (
        <Image
          source={constant.ICONRADIOUNCHECK}
          style={{
            width: constant.HEIGHT * 2.74,
            height: constant.HEIGHT * 2.76,
            marginLeft: constant.HEIGHT * 1,
            tintColor: constant.GREY,
          }}
        />
      )} */}

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          {/* <Text
            style={{
              fontSize: constant.responsiveFontSize(1.6),
              fontFamily: constant.SUIFONT,
              color: '#707070',
            }}>
            Available Date :{' '}
          </Text> */}
          <Text
            style={{
              fontSize: constant.responsiveFontSize(1.5),
              fontFamily: constant.SUIFONT,
              textAlign: 'center',
              // fontWeight: 'bold',
              opacity: this.state.userItem == index ? 1 : 0.8,
              color:
                this.state.userItem == index
                  ? constant.THEME
                  : constant.BLACK,
            }}>
            {moment(item.booking_date).format('DD MMM, YYYY')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: constant.HEIGHT * 0.5,
          }}>
          {/* <Text
            style={{
              fontSize: constant.responsiveFontSize(1.6),
              fontFamily: constant.SUIFONT,
              color: '#707070',
            }}>
            Available Time :{' '}
          </Text> */}
          <Text
            style={{
              fontSize: constant.responsiveFontSize(1.5),
              fontFamily: constant.SUIFONT,
              textAlign: 'center',
              // fontWeight: 'bold',
              opacity: this.state.userItem == index ? 1 : 0.8,
              color:
                this.state.userItem == index
                  ? constant.THEME
                  : constant.BLACK,
            }}>
            {item.booking_time}
          </Text>
        </View>
      </View>
    </Ripple>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                style={{alignSelf: 'center', justifyContent: 'center'}}
              />
            }>
            <View style={{flex: 1}}>
              <Header navigation={this.props.navigation} onPress={false} />
              <View style={{flex: 0}}>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  <BackButtonwithTitle
                    title={'Book a Counselling with a Dietitian'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.navigate('Diet')}
                  />

                  <View
                    style={{
                      marginTop: constant.HEIGHT * 3,
                      marginLeft: constant.HEIGHT * 4,
                      marginBottom: constant.HEIGHT * 1,
                      marginRight: constant.HEIGHT * 1,
                    }}>
                    <Image
                      source={constant.ICONWORKOUTHUMB}
                      style={{
                        width: constant.WIDTH * 87,
                        height: constant.HEIGHT * 20,
                        borderRadius: constant.HEIGHT * 2,
                        // backgroundColor:'red'/
                      }}
                    />
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        flex: 1,
                        fontWeight: 'bold',
                        borderBottomWidth: constant.HEIGHT * 0.1,
                        borderColor: '#707070',
                        fontFamily: constant.SUIFONT,
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      Diet Counseling with the experts
                    </Text>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        opacity: 0.6,
                        flex: 1,
                        marginTop: constant.HEIGHT * 1,
                      }}>
                      Get personalized Counselling and advice from our certified
                      dietitians to meet your fitness goals. Our dietitians can
                      design a Diet plan and a regimen best suited to your
                      needs.
                    </Text>
                    {this.props.pricing.availableSlots != undefined &&
                    this.props.pricing.availableSlots.length > 0 ? (
                      <View style={{marginTop: constant.HEIGHT * 2}}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2),
                            opacity: 0.6,
                            flex: 1,
                            fontWeight: 'bold',
                            borderBottomWidth: constant.HEIGHT * 0.1,
                            borderColor: '#707070',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {'Available Date & time'}
                        </Text>
                        <FlatList
                          data={this.props.pricing.availableSlots}
                          keyExtractor={(item, index) => String(index)  }
                          renderItem={this.renderItem}
                          numColumns={3}
                          ListHeaderComponent={<View />}
                          ListFooterComponent={<View />}
                          ListEmptyComponent={this.showEmptyListView}
                        />
                      </View>
                    ) : this.state.isProceed == true ? (
                      <View
                        style={{justifyContent: 'center', alignSelf: 'center'}}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2),
                            alignSelf: 'center',
                            fontWeight: 'bold',
                            marginTop: constant.HEIGHT * 1,
                            fontFamily: constant.SUIFONT,
                          }}>
                          No slots avaiable
                        </Text>
                      </View>
                    ) : null}

                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        flex: 1,
                        fontWeight: 'bold',
                        borderBottomWidth: constant.HEIGHT * 0.1,
                        borderColor: '#707070',
                        fontFamily: constant.SUIFONT,
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      Appointment details
                    </Text>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                        }}>
                        Date
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          this.openDate();
                          // var maxDate = new Date('2003-12-31T10:00:00');
                          // maxDate.setDate(maxDate.getDate());

                          // this.refs.dobDialog.open({
                          //   date: maxDate,
                          //   maxDate: new Date('2003-12-31'),
                          // });
                          // DatePickerDialog.mode;
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            borderWidth: constant.HEIGHT * 0.1,
                            marginLeft: constant.HEIGHT * 2,
                            borderColor: '#707070',
                            borderRadius: constant.HEIGHT * 0.5,
                            width: constant.HEIGHT * 18,
                          }}>
                          <Text
                            style={{
                              width: constant.HEIGHT * 14,
                              fontSize: constant.responsiveFontSize(2),
                              fontFamily: constant.SUIFONT,
                              padding: constant.HEIGHT * 0.5,
                            }}>
                            {this.state.date}
                          </Text>
                          <Image
                            source={constant.ICONCALENDAR}
                            style={{
                              marginHorizontal: constant.HEIGHT * 1,
                              width: constant.HEIGHT * 2,
                              height: constant.HEIGHT * 2,
                              alignSelf: 'center',
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end',
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                        }}>
                        Time
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          this.openTime();
                          // var maxDate = new Date('2003-12-31T10:00:00');
                          // maxDate.setDate(maxDate.getDate());

                          // this.refs.dobDialog.open({
                          //   date: maxDate,
                          //   maxDate: new Date('2003-12-31'),
                          // });
                          // DatePickerDialog.mode;
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            borderWidth: constant.HEIGHT * 0.1,
                            marginLeft: constant.HEIGHT * 2,
                            borderColor: '#707070',
                            borderRadius: constant.HEIGHT * 0.5,
                            width: constant.HEIGHT * 18,
                          }}>
                          <Text
                            style={{
                              width: constant.HEIGHT * 14,
                              fontSize: constant.responsiveFontSize(2),
                              fontFamily: constant.SUIFONT,
                              padding: constant.HEIGHT * 0.5,
                            }}>
                            {this.state.time}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 2,
                    }}>
                    <Ripple
                      style={{marginLeft: constant.HEIGHT * 6}}
                      onPress={() => this.isVideoCall()}>
                      <View
                        style={{
                          borderColor:
                            this.state.isVideo == true
                              ? constant.THEME
                              : '#707070',
                          borderWidth: constant.HEIGHT * 0.1,
                          opacity: 0.9,
                          borderRadius: constant.HEIGHT * 0.7,
                          paddingVertical: constant.HEIGHT * 1,
                        }}>
                        <Image
                          source={constant.ICONVIDEOCALL}
                          style={{
                            marginHorizontal: constant.HEIGHT * 1,
                            width: constant.HEIGHT * 2.5,
                            height: constant.HEIGHT * 2,
                            alignSelf: 'center',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            tintColor:
                              this.state.isVideo == true
                                ? constant.THEME
                                : constant.GREY,
                          }}
                        />
                      </View>
                    </Ripple>
                    <Ripple
                      style={{marginLeft: constant.HEIGHT * 2}}
                      onPress={() => this.isAudioCall()}>
                      <View
                        style={{
                          borderColor:
                            this.state.isAudio == true
                              ? constant.THEME
                              : '#707070',
                          borderWidth: constant.HEIGHT * 0.1,
                          opacity: 0.9,
                          borderRadius: constant.HEIGHT * 0.7,
                          paddingVertical: constant.HEIGHT * 1,
                        }}>
                        <Image
                          source={constant.ICONAUDIOCALL}
                          style={{
                            marginHorizontal: constant.HEIGHT * 1,
                            width: constant.HEIGHT * 2,
                            height: constant.HEIGHT * 2,
                            alignSelf: 'center',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            tintColor:
                              this.state.isAudio == true
                                ? constant.THEME
                                : constant.GREY,
                          }}
                        />
                      </View>
                    </Ripple>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 1,
                      marginLeft: constant.HEIGHT * 6,
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.4),
                        fontFamily: constant.SUIFONT,
                        color:
                          this.state.isVideo == true
                            ? constant.THEME
                            : constant.BLACK,
                      }}>
                      Video Call
                    </Text>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.4),
                        fontFamily: constant.SUIFONT,
                        marginLeft: constant.HEIGHT * 1,
                        color:
                          this.state.isAudio == true
                            ? constant.THEME
                            : constant.BLACK,
                      }}>
                      Audio Call
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      marginTop: constant.HEIGHT * 2,
                      marginLeft: constant.HEIGHT * 2,
                    }}
                    onPress={() => {
                      if (this.state.isReminder == true) {
                        this.setState({
                          isReminder: false,
                        });
                      } else {
                        this.setState({
                          isReminder: true,
                        });
                      }
                    }}>
                    <Image
                      source={
                        this.state.isReminder == true
                          ? constant.ICONCHECKED
                          : constant.ICONUNCHECKED
                      }
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        alignSelf: 'center',
                        tintColor: '#707070',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        fontFamily: constant.SUIFONT,
                        marginLeft: constant.HEIGHT * 1,
                      }}>
                      Add reminder to calendar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: constant.THEME,
                      marginTop: constant.HEIGHT * 2,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      borderRadius: constant.HEIGHT * 1.5,
                      marginBottom: constant.HEIGHT * 2,
                    }}
                    onPress={() => this.onBookingRequest()}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        fontFamily: constant.SUIFONT,
                        color: constant.WHITE,
                        paddingVertical: constant.HEIGHT * 1,
                        paddingHorizontal: constant.HEIGHT * 3,
                      }}>
                      Proceed
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.openDate}>
              <TouchableOpacity
                onPress={() => this.openDate()}
                style={{
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.58)',
                  flex: 1,
                }}>
                <View
                  elevation={5}
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: constant.WHITE,
                    borderRadius: constant.HEIGHT * 1,
                    paddingVertical: constant.HEIGHT * 3,
                    // paddingHorizontal: constant.HEIGHT * 8,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                  }}>
                  <DatePicker
                    date={this.state.dob}
                    mode={'date'}
                    onDateChange={this.onDOBDatePicked}
                    minimumDate={
                      new Date(new Date().setFullYear(new Date().getFullYear()))
                    }
                  />
                  <TouchableOpacity
                    onPress={() => {
                      var date = new Date();
                      if (this.state.date == '') {
                        this.setState(
                          {
                            date: moment(date).format('DD-MM-YYYY'),
                            dob: date,
                          },
                          () => this.openDate(),
                        );
                      } else {
                        this.openDate();
                      }
                      // console.error(moment(date).format('DD-MM-YYYY'));
                      // this.state.date == 'DD'
                      //   ? constant.toastAlert('Select a Date', ToastAndroid.LONG)
                      //   : this.openDate();
                    }}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: constant.THEME,
                      padding: constant.HEIGHT * 0.5,
                      paddingHorizontal: constant.HEIGHT * 2,
                      marginTop: constant.HEIGHT * 3,
                      borderRadius: constant.HEIGHT * 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: constant.SUIFONT,
                        color: constant.WHITE,
                        fontSize: constant.responsiveFontSize(2),
                      }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.openTime}>
              <TouchableOpacity
                onPress={() => this.openTime()}
                style={{
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.58)',
                  flex: 1,
                }}>
                <View
                  elevation={5}
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: constant.WHITE,
                    borderRadius: constant.HEIGHT * 1,
                    paddingVertical: constant.HEIGHT * 3,
                    // paddingHorizontal: constant.HEIGHT * 8,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                  }}>
                  <DatePicker
                    date={this.state.tme}
                    mode={'time'}
                    onDateChange={this.onTimePicked}
                    // minimumDate={
                    //   new Date(new Date().setFullYear(new Date().getFullYear()))
                    // }
                  />
                  <TouchableOpacity
                    onPress={() => {
                      var date = new Date();
                      if (this.state.time == '') {
                        this.setState(
                          {
                            time: moment(date).format('hh:mm a'),
                            tme: date,
                          },
                          () => {
                            this.openTime();
                          },
                        );
                      } else {
                        this.openTime();
                      }
                    }}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: constant.THEME,
                      padding: constant.HEIGHT * 0.5,
                      paddingHorizontal: constant.HEIGHT * 2,
                      marginTop: constant.HEIGHT * 3,
                      borderRadius: constant.HEIGHT * 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: constant.SUIFONT,
                        color: constant.WHITE,
                        fontSize: constant.responsiveFontSize(2),
                      }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    workout: state.dashBoardReducer,
    pricing: state.pricingReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onChangePlanAction,
      onBookingAction,
      pricingAction,
      payemntDetails,
      transcationsAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BookNowDiet);
