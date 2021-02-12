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
} from 'react-native';

// import Slider from '@react-native-community/slider';

import moment from 'moment';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onBookingAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';


var head, url;

const setDate = new Date();
const date = new Date();

class BookNow extends Component {
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
    };
  }

  componentDidMount() {}

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
    if (this.state.time != '' && this.state.date != '') {
      if (this.state.isAudio == true || this.state.isVideo == true) {
        head = {
          accept: 'application/json',
          Authorization: this.props.signIn.token,
        };

        url = Url.baseUrl + Url.bookingRequest;

        var inputs = {
          member_id: this.props.signIn.member_id,
          booking_type: 'workout',
          date: this.state.bookingDate,
          time: this.state.bookingTime,
          booking_request: this.state.isVideo == true ? 'video' : 'audio',
          reminder: this.state.isReminder,
        };

        this.props
          .onBookingAction(head, url, methods.post, inputs)
          .then((res) => {
            if (res.status == 200) {
              constant.toastAlert(res.data.message, ToastAndroid.LONG);
            }
          });
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

  onDOBDatePicked = async (date) => {
    var date = new Date(moment(date).format('YYYY-MM-DD'));
    date.setDate(date.getDate());

    console.log(moment(date).format('DD-MM-YYYY'));

    this.setState({
      date: moment(date).format('DD-MM-YYYY'),
      dob: date,
      maxDate: date,
      bookingDate: moment(date).format('YYYY-MM-DD'), //EEEE MMMM dd,yyyy hh:mm a //DD MMM YYYY
    });
  };

  onTimePicked = async (time) => {
    var tme = new Date(time);
    console.log(moment(time).format('hh:mm a'));
    this.setState({
      time: moment(time).format('hh:mm a'),
      tme: tme,
      bookingTime: moment(time).format('HH:mm'),
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0}}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  {/* <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Workout')}
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
                      Diet Booking
                    </Text>
                  </TouchableOpacity> */}
                   <BackButtonwithTitle
                  title={'Diet Booking'}
                  underLine={true}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.navigate('Workout')}
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
                      Dietry Counseling provides individualized nutritional care
                      for encouraging the modification of eating habits. It may
                      also assist in prevention or treatment of
                      nutrition-related illnesses.
                    </Text>
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
                    <TouchableOpacity
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
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
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
                          }}
                        />
                      </View>
                    </TouchableOpacity>
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
                      Add to reminder calendar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: constant.THEME,
                      marginTop: constant.HEIGHT * 2,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      borderRadius: constant.HEIGHT * 1.5,
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
              </ScrollView>
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
                {/* <DatePicker
                  date={this.state.dob}
                  mode={'date'}
                  onDateChange={this.onDOBDatePicked}
                  minimumDate={
                    new Date(new Date().setFullYear(new Date().getFullYear()))
                  }
                /> */}
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
                {/* <DatePicker
                  date={this.state.tme}
                  mode={'time'}
                  onDateChange={this.onTimePicked}
                  // minimumDate={
                  //   new Date(new Date().setFullYear(new Date().getFullYear()))
                  // }
                /> */}
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
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    workout: state.dashBoardReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onChangePlanAction,
      onBookingAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BookNow);
