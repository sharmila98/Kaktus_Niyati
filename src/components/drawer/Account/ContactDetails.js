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
  CheckBox,
  Modal,
  Keyboard,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {DatePickerDialog} from 'react-native-datepicker-dialog';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
// import Slider from '@react-native-community/slider';
import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import OTPTextInput from 'react-native-otp-textinput';
import DocumentPicker from 'react-native-document-picker';
import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import {
  onProfileUpdateAction,
  sendVerificationAction,
  onProfileAction,
} from '../../../action/Profile_Action.js';

import {onOtpVerification} from '../../../action/Login_Action';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';


var head, url;
let pushData;
let inputs;
var arrayString;

class ContactDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      workout: [
        {name: 'Weight training'},
        {name: 'Dance'},
        {name: 'Calesthenics'},
        {name: 'Zumba'},
        {name: 'Yoga '},
        {name: 'Pilates'},
      ],
      diet: [{name: 'Veg'}, {name: 'Non veg'}, {name: 'Egg'}],
      profileDetails: {
        name: '',
        gender: '',
        dob: '',
        phone: '',
        email: '',
        isSelected: false,
      },
      workout_preference: {
        weight_training: '',
        dance: '',
        zumba: '',
        calesthenics: '',
        yoga: '',
        pilates: '',
      },

      modalVisible: false,
      isOtp: false,
      type: '',
      modalName: '',
      modalButton: '',
      modalVisible: '',
      text: '',
      gender: '',
      ismale: false,
      isfemale: false,
      image: constant.ICONUSERIMG,
      openDate: false,
      birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      maxDate: '',
      preference_workout: [],
      preference_diet: '',
    };
  }

  onRefresh() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.myProfile + this.props.signIn.member_id;

    this.props.onProfileAction(head, url, methods.get, false);
  }

  renderItem = ({item, index}) => {
    // console.error(this.state.preference_workout.includes(item.name));
    return (
      <View
        style={{
          marginTop: constant.HEIGHT * 2,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => this.workoutPreference(item.name)}>
          {this.state.preference_workout[index] != undefined &&
          this.state.preference_workout[index] == item.name ? (
            <Image
              source={constant.ICON_CHECK}
              style={{
                width: constant.HEIGHT * 2.1,
                height: constant.HEIGHT * 2,
              }}
            />
          ) : (
            <Image
              source={constant.ICON_UNCHECK}
              style={{
                width: constant.HEIGHT * 2.1,
                height: constant.HEIGHT * 2,
              }}
            />
          )}

          <Text
            style={{
              fontSize: constant.responsiveFontSize(2),
              marginHorizontal: constant.HEIGHT * 0.5,
              color: '#5D5C5C',
              // alignSelf: 'center',
              marginTop: constant.HEIGHT * -0.5,

              fontFamily: constant.SUIFONT,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  workoutPreference(value) {
    if (this.state.preference_workout.includes(value) == true) {
      this.setState(
        {
          preference_workout: this.state.preference_workout.filter(
            (i) => i != value,
          ),
        },
        () => {
          this.onProfileUpdate(
            'preference_workout',
            this.state.preference_workout.toString(),
          );
        },
      );
    } else {
      this.setState(
        {
          preference_workout: [...this.state.preference_workout, value],
        },
        () => {
          this.onProfileUpdate(
            'preference_workout',
            this.state.preference_workout.toString(),
          );
        },
      );
    }
  }

  dietPreference(value) {
    if (value == 'veg') {
      this.setState({
        preference_diet: 'veg',
      });
    } else if (value == 'non_veg') {
      this.setState({
        preference_diet: 'non_veg',
      });
    } else if (value == 'egg') {
      this.setState({
        preference_diet: 'egg',
      });
    }
    this.onProfileUpdate('preference_diet', value);
  }

  onProfileUpdate(type, value) {
    Keyboard.dismiss();

    head = {
      'Content-Type': 'multipart/form-data',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.profileUpdate;

    if (type == 'name') {
      inputs = new FormData();
      inputs.append('member_id', this.props.signIn.member_id);
      inputs.append('name', value);

      this.setState({
        profileDetails: {
          ...this.state.profileDetails,
          name: value,
          modalVisible: false,
        },
      });
    } else if (type == 'user_files') {
      let imageData = new FormData();
      var newFile = {
        uri: value.uri,
        type: value.type,
        name: value.name,
      };
      imageData.append('user_files', newFile);
      imageData.append('member_id', this.props.signIn.member_id);

      inputs = imageData;
    } else if (type == 'dob') {
      inputs = new FormData();

      inputs.append('member_id', this.props.signIn.member_id);
      inputs.append('dob', value);
    } else if (type == 'email') {
      inputs = new FormData();

      inputs.append('member_id', this.props.signIn.member_id);
      inputs.append('email', value);
    } else if (type == 'phone') {
      inputs = new FormData();

      inputs.append('member_id', this.props.signIn.member_id);
      inputs.append('mobile', value);
    } else if (type == 'preference_workout') {
      inputs = new FormData();

      inputs.append('member_id', this.props.signIn.member_id);
      inputs.append('preference_workout', value);
    } else if (type == 'preference_diet') {
      inputs = new FormData();

      inputs.append('member_id', this.props.signIn.member_id);
      inputs.append('preference_diet', value);
    }

    this.props
      .onProfileUpdateAction(head, url, methods.post, inputs)
      .then((response) => {
        if (response.status == 200) {
          this.setState({modalVisible: false});
          this.onRefresh();
        }
      });
  }

  openModal(type) {
    if (type == 'name') {
      this.setState({
        modalName: 'UPDATE NAME',
        modalButton: 'Submit',
        modalVisible: true,
        type: type,
      });
    } else if (type == 'phone') {
      this.setState({
        modalName: 'UPDATE PHONE NO.',
        modalButton: 'Get OTP',
        modalVisible: true,
        type: type,
      });
    } else if (type == 'email') {
      this.setState({
        modalName: 'CHANGE EMAIL',
        modalButton: 'Verify',
        modalVisible: true,
        type: type,
      });
    } else if (type == 'dob') {
      this.setState({openDate: true});
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

  onDOBDatePicked = async (date) => {
    var date = new Date(moment(date).format('YYYY-MM-DD'));
    date.setDate(date.getDate());

    this.setState({
      date: moment(date).format('DD'),
      month: moment(date).format('MM'),
      year: moment(date).format('YY'),
      profileDetails: {
        ...this.state.profileDetails,
        dob: moment(date).format('DD MMM, YYYY'),
      },
      birthday: date,
      //EEEE MMMM dd,yyyy hh:mm a //DD MMM YYYY
    });

    var dated = new Date(date);
  };

  onSuccessScreen() {
    if (this.state.otp != 0 && this.state.otp.length == 4) {
      this.setState({showProgress: true});
      head = {
        'Content-Type': 'application/json',
      };

      url = Url.baseUrl + Url.verification;

      var input = {
        name: this.props.signIn.userDetails.name,
        device_id: this.props.signIn.userDetails.device_id,
        member_id: this.props.signIn.member_id,
        otp_number: this.state.otp,
      };

      this.props
        .onOtpVerification(head, url, methods.post, input)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.status == false) {
              constant.toastAlert(res.data.message, ToastAndroid.LONG);
            } else {
              this.setState({
                // showProgress: false,
                modalVisible: false,
                status: res.data.profile_status,
              });
              this.onProfileUpdate(this.state.type, this.state.text);
            }
          } else {
            constant.toastAlert('Please Enter Valid OTP', ToastAndroid.LONG);
          }
        });
    } else {
      constant.toastAlert('Please Enter Valid OTP', ToastAndroid.LONG);
    }
  }

  sendVerification(type, value) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    if (type == 'mobile') {
      this.setState({
        profileDetails: {
          ...this.state.profileDetails,
          phone: '+91-' + value,
        },
      });
    } else {
      this.setState({
        profileDetails: {
          ...this.state.profileDetails,
          email: value,
        },
      });
    }

    url = Url.baseUrl + Url.sendVerification;

    var inputs = {
      member_id: this.props.signIn.member_id,
      verify_type: type,
      data: value,
    };

    this.props
      .sendVerificationAction(head, url, methods.post, inputs)
      .then((res) => {
        if (res.status == 200) {
          // this.otpInput.setValue(res.data.otp);

          this.setState({isOtp: true, modalVisible: true});
        }
      });
  }

  updateProfile() {
    if (this.state.text != '') {
      if (this.state.type == 'name') {
        this.onProfileUpdate('name', this.state.text);
      } else if (this.state.type == 'phone') {
        this.sendVerification('mobile', this.state.text);
      } else if (this.state.type == 'email') {
        this.sendVerification('email', this.state.text);
      }
    } else {
      if (this.state.type == 'phone') {
        constant.toastAlert(
          'Please Enter ' + this.state.type,
          ToastAndroid.LONG,
        );
      } else {
        constant.toastAlert(
          'Please Enter ' + this.state.type + ' no',
          ToastAndroid.LONG,
        );
      }
    }
  }

  handleUserName(text) {
    this.setState({text: text}, () => {});
  }

  getValue(value, edit, type) {
    // this.setState({modalNa})
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: constant.HEIGHT * 2,
          paddingBottom: constant.HEIGHT * 1,
          borderBottomWidth: constant.HEIGHT * 0.1,
        }}>
        <Text
          style={{
            flex: 1,
            fontSize: constant.responsiveFontSize(2),
            color: constant.BLACK,
            // height: constant.HEIGHT * 6,
            marginLeft: constant.HEIGHT * 3,
            letterSpacing: constant.HEIGHT * 0.1,
            fontFamily: constant.SUIFONT,
          }}>
          {value}
        </Text>
        <TouchableOpacity onPress={() => this.openModal(type)}>
          <Text
            style={{
              color: '#5D5C5C',
              color: constant.THEME,
              alignSelf: 'flex-end',
              marginRight: constant.HEIGHT * 3,
              fontSize: constant.responsiveFontSize(1.6),
              fontFamily: constant.SUIFONT,
            }}>
            {edit}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  componentDidMount() {
    const preference_workout = this.props.profile.profileDetails
      .preference_workout[0];

    if (this.props.profile.profileDetails != undefined) {
      var dob =
        this.props.profile.profileDetails.dob != undefined
          ? moment(this.props.profile.profileDetails.dob).format('DD MMM, YYYY')
          : '';
      var image = '';
      if (this.props.profile.profileDetails.image != undefined) {
        image =
          Url.baseUrl +
          Url.images +
          this.props.profile.profileDetails.image.filename;
      }

      this.setState(
        {
          profileDetails: {
            name:
              this.props.profile.profileDetails.name != undefined
                ? this.props.profile.profileDetails.name
                : '',
            gender:
              this.props.profile.profileDetails.gender != undefined
                ? this.props.profile.profileDetails.gender
                : '',
            dob: dob,
            phone:
              this.props.profile.profileDetails.mobile != undefined
                ? '+91-' + this.props.profile.profileDetails.mobile
                : '',
            email:
              this.props.profile.profileDetails.email != undefined
                ? this.props.profile.profileDetails.email
                : '',
            profile_image: image,
          },
          birthday: new Date(this.props.profile.profileDetails.dob),
          ismale:
            this.props.profile.profileDetails.gender != undefined &&
            this.props.profile.profileDetails.gender == 'male'
              ? true
              : false,
          isfemale:
            this.props.profile.profileDetails.gender != undefined &&
            this.props.profile.profileDetails.gender == 'female'
              ? true
              : false,
          preference_diet: this.props.profile.profileDetails.preference_diet,
          preference_workout:
            preference_workout != undefined
              ? preference_workout.split(',')
              : [],
        },
        () => {},
      );
    }
  }

  switchImage() {
    if (this.state.currentImage < this.state.images.length - 1) {
      this.setState({
        currentImage: this.state.currentImage + 1,
      });
    } else {
      this.setState({
        currentImage: 0,
      });
    }
    return this.currentImage;
  }

  async checkPermission() {
    check(
      Platform.OS == 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY,
    ).then((result) => {
      if (result == RESULTS.DENIED) {
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((res) => {
          if (result == RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        });
      } else if (result == RESULTS.GRANTED) {
        return true;
      }
    });
  }

  async selectDocument() {
    try {
      if (this.checkPermission()) {
        const docx = await DocumentPicker.pick({
          type: [DocumentPicker.types.images],
        });

        // this.setState({image: docx.name});

        var size = 0;
        var mb = docx.size / 1024 / 1024;
        size = size + mb;

        this.onProfileUpdate('user_files', docx);

        // docx.map((item, index) => {
        //   var mb = item.size / 1024 / 1024;
        //   size = size + mb;
        //   console.log('&^&^&', size);
        // });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false}  />
            <ScrollView>
              <View style={{flex: 0}}>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    flex: 1,
                    marginVertical:constant.HEIGHT*2
                  }}>
                    <BackButtonwithTitle
                  title={null}
                  underLine={false}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.goBack()}
                  
                  />
                  {/* <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <Image
                      source={constant.ICONARROWORANGE}
                      style={{
                        width: constant.HEIGHT * 3,
                        height: constant.HEIGHT * 2.5,
                        marginLeft: constant.HEIGHT * 1.5,
                        marginTop: constant.HEIGHT * 2,
                        tintColor: constant.THEME,
                      }}
                    />
                  </TouchableOpacity> */}

                  <TouchableOpacity
                    style={{
                      width: constant.HEIGHT * 12,
                      height: constant.HEIGHT * 12,
                      borderRadius: constant.HEIGHT * 10,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 1.5,
                    }}
                    onPress={() => this.selectDocument()}>
                    {this.props.profile.profileDetails.image != undefined ? (
                      <Image
                        source={{uri: this.state.profileDetails.profile_image}}
                        style={{
                          width: constant.HEIGHT * 12,
                          height: constant.HEIGHT * 12,
                          borderRadius: constant.HEIGHT * 10,
                          alignSelf: 'center',
                          marginTop: constant.HEIGHT * 1.5,
                        }}
                      />
                    ) : (
                      <Image
                        source={this.state.image}
                        style={{
                          width: constant.HEIGHT * 12,
                          height: constant.HEIGHT * 12,
                          borderRadius: constant.HEIGHT * 10,
                          alignSelf: 'center',
                          marginTop: constant.HEIGHT * 1.5,
                        }}
                      />
                    )}

                    <Text
                      style={{
                        alignSelf: 'center',
                        marginTop: constant.HEIGHT * 8,
                        color: constant.WHITE,
                        justifyContent: 'center',
                        position: 'absolute',
                        fontFamily: constant.SUIFONT,
                        // backgroundColor: constant.BLACK,
                        // width: constant.HEIGHT * 12,
                        // borderRadius: constant.HEIGHT * 10,
                      }}>
                      EDIT
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: constant.HEIGHT * 3,
                      alignContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <Image
                      source={constant.ICONLINKGOOGLE}
                      style={{
                        width: constant.HEIGHT * 15,
                        height: constant.HEIGHT * 4,
                        borderRadius: constant.HEIGHT * 1,
                      }}
                    />
                    <Image
                      source={constant.ICONLINKFACEBOOK}
                      style={{
                        width: constant.HEIGHT * 15,
                        height: constant.HEIGHT * 4,
                        borderRadius: constant.HEIGHT * 1,

                        marginLeft: constant.HEIGHT * 3.5,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginHorizontal: constant.HEIGHT * 3,
                      marginVertical: constant.HEIGHT * 2,
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          color: '#5D5C5C',
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(1.6),
                          marginHorizontal: constant.HEIGHT * 3,
                          fontFamily: constant.SUIFONT,
                        }}>
                        NAME
                      </Text>
                      {this.getValue(
                        this.state.profileDetails.name,
                        'EDIT',
                        'name',
                      )}
                    </View>
                    <View
                      style={{
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      <Text
                        style={{
                          color: '#5D5C5C',
                          fontFamily: constant.SUIFONT,
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(1.6),
                          marginHorizontal: constant.HEIGHT * 3,
                        }}>
                        GENDER
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          borderBottomWidth: constant.HEIGHT * 0.1,
                          alignSelf: 'center',
                          // marginTop: constant.HEIGHT * 2,
                          // marginBottom: constant.HEIGHT * 1,
                        }}>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: constant.responsiveFontSize(2),
                            color: constant.BLACK,
                            // height: constant.HEIGHT * 6,
                            marginLeft: constant.HEIGHT * 3,
                            letterSpacing: constant.HEIGHT * 0.1,
                            fontFamily: constant.SUIFONT,
                            marginTop: constant.HEIGHT * 2,
                          }}>
                          {this.state.profileDetails.gender != ''
                            ? this.state.profileDetails.gender
                            : 'Female'}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            marginRight: constant.HEIGHT * 3,
                            marginBottom: constant.HEIGHT * 1,
                          }}>
                          <Image
                            source={constant.ICONFEMALEAVATAR}
                            style={{
                              width: constant.HEIGHT * 2.4,
                              height: constant.HEIGHT * 5.2,
                              tintColor: constant.THEME,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={{marginTop: constant.HEIGHT * 2}}>
                      <Text
                        style={{
                          color: '#5D5C5C',
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(1.6),
                          marginHorizontal: constant.HEIGHT * 3,
                          fontFamily: constant.SUIFONT,
                        }}>
                        DATE OF BIRTH
                      </Text>
                      {this.getValue(
                        this.state.profileDetails.dob,
                        'EDIT',
                        'dob',
                      )}
                    </View>
                    <View
                      style={{
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      <Text
                        style={{
                          color: '#5D5C5C',
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(1.6),
                          marginHorizontal: constant.HEIGHT * 3,
                          fontFamily: constant.SUIFONT,
                        }}>
                        PHONE NUMBER
                      </Text>
                      {this.getValue(
                        this.state.profileDetails.phone,
                        'CHANGE',
                        'phone',
                      )}
                    </View>
                    <View
                      style={{
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      <Text
                        style={{
                          color: '#5D5C5C',
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(1.6),
                          marginHorizontal: constant.HEIGHT * 3,
                          fontFamily: constant.SUIFONT,
                        }}>
                        EMAIL
                      </Text>
                      {this.getValue(
                        this.state.profileDetails.email,
                        'CHANGE',
                        'email',
                      )}
                    </View>
                    <View
                      style={{
                        marginHorizontal: constant.HEIGHT * 3,
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          fontFamily: constant.SUIFONT,
                          color: '#5D5C5C',
                        }}>
                        PREFERENCE
                      </Text>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          fontFamily: constant.SUIFONT,
                          marginTop: constant.HEIGHT * 1.6,
                          fontWeight: 'bold',
                        }}>
                        WORKOUT
                      </Text>
                      <View style={{marginVertical: constant.HEIGHT * 2}}>
                        {/* <FlatList
                          data={this.state.workout}
                          numColumns={2}
                          keyExtractor={(item, index) => String(index)}
                          renderItem={this.renderItem}
                          columnWrapperStyle={{justifyContent: 'space-between'}}
                        /> */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() =>
                              this.workoutPreference('weight training')
                            }>
                            {this.state.preference_workout.includes(
                              'weight training',
                            ) == true ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}

                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                // alignSelf: 'center',
                                marginTop: constant.HEIGHT * -0.5,

                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Weight Training'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() => this.workoutPreference('dance')}>
                            {this.state.preference_workout.includes('dance') ==
                            true ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                marginTop: constant.HEIGHT * -0.5,
                                // alignSelf: 'center',
                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Dance'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: constant.HEIGHT * 2,
                          }}>
                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() =>
                              this.workoutPreference('calesthenics')
                            }>
                            {this.state.preference_workout.includes(
                              'calesthenics',
                            ) == true ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                // alignSelf: 'center',
                                marginTop: constant.HEIGHT * -0.5,

                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Calesthenics'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              marginLeft: constant.HEIGHT * 1.5,
                            }}
                            onPress={() => this.workoutPreference('zumba')}>
                            {this.state.preference_workout.includes('zumba') ==
                            true ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                color: '#5D5C5C',
                                marginLeft: constant.HEIGHT * 0.5,
                                marginTop: constant.HEIGHT * -0.5,

                                // alignSelf: 'center',
                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Zumba'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: constant.HEIGHT * 2,
                          }}>
                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() => this.workoutPreference('yoga')}>
                            {this.state.preference_workout.includes('yoga') ==
                            true ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                // alignSelf: 'center',
                                marginTop: constant.HEIGHT * -0.5,

                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Yoga'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() => this.workoutPreference('pilates')}>
                            {this.state.preference_workout.includes(
                              'pilates',
                            ) == true ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                marginTop: constant.HEIGHT * -0.5,
                                // alignSelf: 'center',
                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Pilates'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2),
                            fontFamily: constant.SUIFONT,
                            marginTop: constant.HEIGHT * 1.6,
                            fontWeight: 'bold',
                          }}>
                          DIET
                        </Text>
                        <View
                          style={{
                            marginTop: constant.HEIGHT * 2,
                          }}>
                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() => this.dietPreference('veg')}>
                            {this.state.preference_diet == 'veg' ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                // alignSelf: 'center',
                                marginTop: constant.HEIGHT * -0.5,

                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Veg'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              marginTop: constant.HEIGHT * 2,
                            }}
                            onPress={() => this.dietPreference('non_veg')}>
                            {this.state.preference_diet == 'non_veg' ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                marginTop: constant.HEIGHT * -0.5,
                                // alignSelf: 'center',
                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Non veg '}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              marginTop: constant.HEIGHT * 2,
                            }}
                            onPress={() => this.dietPreference('egg')}>
                            {this.state.preference_diet == 'egg' ? (
                              <Image
                                source={constant.ICON_CHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={constant.ICON_UNCHECK}
                                style={{
                                  width: constant.HEIGHT * 2.1,
                                  height: constant.HEIGHT * 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                marginHorizontal: constant.HEIGHT * 0.5,
                                color: '#5D5C5C',
                                marginTop: constant.HEIGHT * -0.5,
                                // alignSelf: 'center',
                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Egg '}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.58)',
                  }}>
                  {this.state.isOtp == false ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: constant.HEIGHT * 45,

                        alignItems: 'center',
                        backgroundColor: constant.WHITE,
                        fontFamily: constant.SUIFONT,
                        fontWeight: 'bold',
                        fontSize: constant.responsiveFontSize(2.1),
                        borderWidth: constant.HEIGHT * 0.2,
                        // padding: constant.HEIGHT * 3,
                        // paddingHorizontal: constant.HEIGHT * 2,
                        paddingTop: constant.HEIGHT * 5,
                        paddingBottom: constant.HEIGHT * 3,
                        elevation:
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
                          fontSize: constant.responsiveFontSize(2),
                          color: '#656565',
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,

                          alignSelf: 'center',
                        }}>
                        {this.state.modalName}
                      </Text>
                      <TextInput
                        style={[
                          {
                            fontFamily: constant.SUIFONT,
                            fontSize: constant.responsiveFontSize(2.2),
                            color: '#888888',
                            letterSpacing: constant.HEIGHT * 0.1,
                            fontWeight: 'bold',
                            borderBottomWidth: constant.HEIGHT * 0.1,
                            marginHorizontal: constant.HEIGHT * 3,
                            marginTop: constant.HEIGHT * 5,
                            textAlign: 'center',
                            width: constant.HEIGHT * 30,
                            alignSelf: 'center',
                          },
                        ]}
                        placeholder={'Enter ' + this.state.type}
                        returnKeyType={'done'}
                        numberOfLines={1}
                        renderToHardwareTextureAndroid
                        ref="name"
                        enablesReturnKeyAutomatically={true}
                        // autoFocus={true}
                        keyboardType={
                          this.state.type == 'phone' ? 'numeric' : 'default'
                        }
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        autoCompleteType={'name'}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#888888"
                        onChangeText={(text) => this.handleUserName(text)}
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />

                      <TouchableOpacity
                        style={{
                          marginTop: constant.HEIGHT * 5,
                          backgroundColor: constant.THEME,
                          width: constant.HEIGHT * 25,
                          padding: constant.HEIGHT * 1,
                          borderRadius: constant.HEIGHT * 1,
                          borderWidth: constant.HEIGHT * 0.1,
                          borderColor: constant.THEME,
                          alignSelf: 'center',
                        }}
                        onPress={() => this.updateProfile()}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2.1),
                            fontWeight: 'bold',
                            color: constant.WHITE,
                            alignSelf: 'center',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {this.state.modalButton}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          marginTop: constant.HEIGHT * 5,
                          borderTopWidth: constant.HEIGHT * 0.1,
                          width: '100%',
                        }}
                        onPress={() => this.setState({modalVisible: false})}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2),
                            color: '#656565',
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: constant.HEIGHT * 3,
                          }}>
                          {'Cancel'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: constant.HEIGHT * 45,

                        alignItems: 'center',
                        backgroundColor: constant.WHITE,
                        fontFamily: constant.SUIFONT,
                        fontWeight: 'bold',
                        fontSize: constant.responsiveFontSize(2.1),
                        borderWidth: constant.HEIGHT * 0.2,
                        // padding: constant.HEIGHT * 3,
                        // paddingHorizontal: constant.HEIGHT * 2,
                        paddingTop: constant.HEIGHT * 5,
                        paddingBottom: constant.HEIGHT * 3,
                        elevation:
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                        shadowColor: '#000000',
                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                        shadowRadius: 5,
                        shadowOpacity: 1.0,
                      }}>
                      <View
                        style={{
                          opacity: 0.5,
                          marginTop: constant.HEIGHT * 3,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            color: '#000000',
                            fontFamily: constant.SUIFONT,
                            fontSize: constant.responsiveFontSize(2),
                          }}>
                          {'Enter OTP sent to '}
                        </Text>
                        {this.props.signIn.loginDetails.mobile != undefined ? (
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              color: constant.BLACK,
                              fontWeight: 'bold',
                              fontFamily: constant.SUIFONT,
                            }}>
                            {this.state.type == 'email'
                              ? this.state.text
                              : '+91-' + this.state.text}
                          </Text>
                        ) : null}
                      </View>

                      <OTPTextInput
                        ref={(e) => (this.otpInput = e)}
                        textInputStyle={{
                          fontSize: constant.responsiveFontSize(2),
                          color: constant.BLACK,
                          fontFamily: constant.SUIFONT,
                          marginTop: constant.HEIGHT * 2,
                          fontWeight: 'bold',
                          borderBottomWidth: constant.HEIGHT * 0.1,
                        }}
                        tintColor="#B1B1B1"
                        offTintColor="#B1B1B1"
                        handleTextChange={(e) => {
                          this.setState({otp: e});
                        }}
                      />
                      <View
                        style={{
                          marginTop: constant.HEIGHT * 2,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(1.6),
                            color: '#000000',
                            opacity: 0.5,
                            fontFamily: constant.SUIFONT,
                          }}>
                          {"Didn't receive the OTP ? "}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.sendVerification(
                              this.state.type,
                              this.state.text,
                            )
                          }>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(1.6),
                              color: constant.THEME,
                              borderBottomColor: constant.THEME,
                              fontWeight: 'bold',
                              borderBottomWidth: constant.HEIGHT * 0.1,
                              fontFamily: constant.SUIFONT,
                            }}>
                            {'RESEND OTP'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: constant.HEIGHT * 5,
                          backgroundColor: constant.THEME,
                          padding: constant.HEIGHT * 1,
                          paddingHorizontal: constant.HEIGHT * 5,
                          borderRadius: constant.HEIGHT * 1,
                          borderWidth: constant.HEIGHT * 0.1,
                          borderColor: constant.THEME,
                        }}
                        onPress={() => this.onSuccessScreen()}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2.1),
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            color: constant.WHITE,
                          }}>
                          {'SUBMIT'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          marginTop: constant.HEIGHT * 5,
                          borderTopWidth: constant.HEIGHT * 0.1,
                          width: '100%',
                        }}
                        onPress={() => this.setState({modalVisible: false})}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2),
                            color: '#656565',
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: constant.HEIGHT * 3,
                          }}>
                          {'Cancel'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </Modal>
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
                      date={this.state.birthday}
                      mode={'date'}
                      onDateChange={this.onDOBDatePicked}
                      maximumDate={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 16),
                        )
                      }
                    />
                    <TouchableOpacity
                      onPress={() => {
                        this.state.date == 'DD'
                          ? constant.toastAlert(
                              'Select a Date',
                              ToastAndroid.LONG,
                            )
                          : this.openDate();
                        this.onProfileUpdate(
                          'dob',
                          moment(this.state.birthday).format('YYYY-MM-DD') + '',
                        );
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
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    live: state.liveReducer,
    profile: state.profileReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onProfileUpdateAction,
      sendVerificationAction,
      onOtpVerification,
      onProfileAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);
