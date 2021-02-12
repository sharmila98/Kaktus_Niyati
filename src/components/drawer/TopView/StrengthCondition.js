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
  Slider,
  FlatList,
} from 'react-native';
import * as Progress from 'react-native-progress';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import moment from 'moment';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getLibraryAction,
  onHistoryAction,
} from '../../../action/DashBoard_Action';
import {onHomeAction} from '../../../action/Home_Action';
import {onBannerImageAction} from '../../../action/Login_Action';
import {onProgramDetailAction} from '../../../action/DashBoard_Action';
import {onNotificationAction} from '../../../action/Header_Action';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import DocumentPicker from 'react-native-document-picker';

var head;
class StrengthCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weight_kgs: 0,
      weight_lbs: 0,
      SliderValue: 0,
      currentImage: 0,
      bmi: 0,
      images: [constant.ICONSTART, constant.ICONDOWN, constant.ICONPUSH],
    };
  }

  componentDidMount() {
    // head = {
    //   accept: 'application/json',
    //   Authorization: this.props.signIn.token,
    // };
    // url = Url.baseUrl + Url.history + this.props.signIn.member_id;
    // this.props.onHistoryAction(head, url, methods.get);
  }
  dietProgress(color, percent, type) {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: constant.HEIGHT * -2,
        }}>
        <Progress.Bar
          progress={percent == undefined ? 0 / 100 : percent / 100}
          height={constant.HEIGHT * 0.9}
          width={constant.HEIGHT * 28}
          style={{
            alignSelf: 'center',
            marginTop: constant.HEIGHT * 0.5,
          }}
          borderColor="#D5C5B1"
          unfilledColor="#D5C5B1"
          color={color}
        />
        <Text
          style={{
            color: '#5D5C5C',
            fontSize: constant.responsiveFontSize(1.8),
            fontWeight: 'bold',
            marginLeft: constant.HEIGHT * 1,
            fontFamily: constant.SUIFONT,
          }}>
          {percent == undefined ? '0%' : percent + '%'}
        </Text>
        <Text
          style={{
            color: '#5D5C5C',
            fontSize: constant.responsiveFontSize(1.8),
            marginLeft: constant.HEIGHT * 0.5,
            fontFamily: constant.SUIFONT,
          }}>
          {type}
        </Text>
      </View>
    );
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

        // this.onProfileUpdate('user_files', docx);

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
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0}}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                    marginBottom: constant.HEIGHT * 12,
                  }}>
                  <BackButtonwithTitle
                    title={'Strength & Conditioning'}
                    underLine={false}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={true}
                    rightIcon={constant.ICONSHARE}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.goBack()}
                  />
                  {/* <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginRight: constant.HEIGHT * 2,
                        width: '86%',
                      }}>
                      <Image
                        source={constant.ICONARROWORANGE}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          alignSelf: 'center',
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
                          borderColor: '#707070',
                          fontFamily: constant.SUIFONT,
                        }}>
                        {'Strength & Conditioning'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'flex-start',
                        marginRight: constant.HEIGHT * 0,
                        width: '10%',
                      }}>
                      <Image
                        source={constant.ICONSHARE}
                        style={{
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          alignSelf: 'flex-start',
                          // marginLeft: constant.HEIGHT *0
                        }}
                      />
                    </TouchableOpacity>
                  </View> */}
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.5),
                      opacity: 0.6,
                      fontWeight: 'bold',
                      borderColor: '#707070',
                      fontFamily: constant.SUIFONT,
                      marginLeft: constant.HEIGHT * 4.5,
                    }}>
                    {'SAT JULY 4 | 35 MIN '}
                  </Text>

                  <View
                    style={{
                      height: constant.HEIGHT * 80,
                      marginHorizontal: constant.HEIGHT * 3,
                      backgroundColor: constant.WHITE,
                      elevation:
                        Platform.OS === 'ios' ? null : constant.HEIGHT * 1,
                      marginTop: constant.HEIGHT * 4,
                      borderBottomRightRadius: constant.HEIGHT * 3,
                      borderBottomLeftRadius: constant.HEIGHT * 3,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          height: constant.HEIGHT * 50,
                          width: constant.HEIGHT * 22,
                          alignSelf: 'flex-start',
                          backgroundColor: constant.WHITE,
                        }}>
                        <View style={{marginTop: constant.HEIGHT * 6}}>
                          <TouchableOpacity
                            onPress={() => this.selectDocument()}>
                            <Image
                              source={constant.ICONCAMERAPLUS}
                              style={{
                                width: constant.HEIGHT * 7,
                                height: constant.HEIGHT * 7,
                                alignSelf: 'center',
                                // marginLeft: constant.HEIGHT *0
                              }}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.6),
                              opacity: 0.6,
                              fontWeight: '600',
                              color: 'grey',
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 2,
                              textAlign: 'center',
                              // marginLeft: constant.HEIGHT * 2,
                            }}>
                            {'Dude, add your selfie!'}
                          </Text>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.3),
                              opacity: 0.6,
                              fontWeight: '600',
                              color: 'grey',
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 28,
                              marginLeft: constant.HEIGHT * 2,
                            }}>
                            {'You are awesome today! '}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          height: constant.HEIGHT * 50,
                          width: constant.HEIGHT * 25.5,
                          alignSelf: 'flex-end',
                          backgroundColor: '#F87217',
                        }}>
                        <View>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.6),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 4,
                              marginLeft: constant.HEIGHT * 2,
                            }}>
                            {'WORKOUT DURATION'}
                          </Text>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(2),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              marginLeft: constant.HEIGHT * 2.5,
                            }}>
                            {this.props.workout.daySummaryDetails.durations}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.6),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 4,
                              marginLeft: constant.HEIGHT * 2,
                            }}>
                            {'CLASS RANK'}
                          </Text>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(2),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              marginLeft: constant.HEIGHT * 2.5,
                            }}>
                            {'288/1288'}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.6),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 4,
                              marginLeft: constant.HEIGHT * 2,
                            }}>
                            {'ENERGY SCORE'}
                          </Text>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(2),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              marginLeft: constant.HEIGHT * 2.5,
                            }}>
                            {'8432'}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.6),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 4,
                              marginLeft: constant.HEIGHT * 2,
                            }}>
                            {'CALORIES'}
                          </Text>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(2),
                              opacity: 0.6,
                              fontWeight: 'bold',
                              color: constant.WHITE,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              marginLeft: constant.HEIGHT * 2.5,
                            }}>
                            {'280'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        height: constant.HEIGHT * 30,
                        backgroundColor: '#FFF5EE',
                        borderBottomRightRadius: constant.HEIGHT * 3,
                        borderBottomLeftRadius: constant.HEIGHT * 3,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'ios'
                              ? constant.REBOTOREGULAR
                              : constant.REBOTOREGULAR,
                          fontSize: constant.responsiveFontSize(2),
                          opacity: 0.6,
                          fontWeight: 'bold',
                          fontFamily: constant.REBOTOREGULAR,
                          marginTop: constant.HEIGHT * 1,
                          marginLeft: constant.HEIGHT * 2.5,
                        }}>
                        {'MY TEAM'}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: constant.HEIGHT * 2,
                        }}>
                        <View
                          style={{
                            alignSelf: 'center',
                            marginLeft: constant.HEIGHT * 2,
                          }}>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.3),
                              opacity: 0.6,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              textAlign: 'center',
                            }}>
                            {'#65'}
                          </Text>
                          <View>
                            <TouchableOpacity
                              activeOpacity={0.6}
                              style={{
                                marginLeft: constant.HEIGHT * 0,
                                padding: constant.HEIGHT * 0.2,
                                borderRadius: constant.HEIGHT * 5,
                                borderColor: constant.THEME,
                                borderWidth: constant.HEIGHT * 0.3,
                              }}>
                              <Image
                                style={{
                                  alignSelf: 'flex-end',
                                  width: constant.HEIGHT * 5,
                                  height: constant.HEIGHT * 5,
                                  tintColor: constant.GREY,
                                }}
                                source={constant.ICONPROFILEIMG}
                              />
                            </TouchableOpacity>
                          </View>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.3),
                              opacity: 0.6,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              textAlign: 'center',
                            }}>
                            {'Sai'}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignSelf: 'center',
                            marginLeft: constant.HEIGHT * 2,
                          }}>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.3),
                              opacity: 0.6,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              textAlign: 'center',
                            }}>
                            {'#80'}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                              marginLeft: constant.HEIGHT * 0,
                              padding: constant.HEIGHT * 0.2,
                              borderRadius: constant.HEIGHT * 5,
                              borderColor: constant.THEME,
                              borderWidth: constant.HEIGHT * 0.3,
                            }}>
                            <Image
                              style={{
                                alignSelf: 'flex-end',
                                width: constant.HEIGHT * 5,
                                height: constant.HEIGHT * 5,
                                tintColor: constant.GREY,
                              }}
                              source={constant.ICONPROFILEIMG}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.3),
                              opacity: 0.6,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              textAlign: 'center',
                            }}>
                            {'Naresh'}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignSelf: 'center',
                            marginLeft: constant.HEIGHT * 2,
                          }}>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.3),
                              opacity: 0.6,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              textAlign: 'center',
                            }}>
                            {'#90'}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                              marginLeft: constant.HEIGHT * 0,
                              padding: constant.HEIGHT * 0.2,
                              borderRadius: constant.HEIGHT * 5,
                              borderColor: constant.THEME,
                              borderWidth: constant.HEIGHT * 0.3,
                              alignSelf: 'center',
                            }}>
                            <Image
                              style={{
                                alignSelf: 'flex-end',
                                width: constant.HEIGHT * 5,
                                height: constant.HEIGHT * 5,
                                tintColor: constant.GREY,
                              }}
                              source={constant.ICONPROFILEIMG}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.3),
                              opacity: 0.6,
                              fontFamily: constant.REBOTOREGULAR,
                              marginTop: constant.HEIGHT * 1,
                              textAlign: 'center',
                            }}>
                            {'Ramya'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: constant.THEME,
                          padding: constant.HEIGHT * 1.3,
                          borderRadius: constant.HEIGHT * 1,
                          borderWidth: constant.HEIGHT * 0.2,
                          borderColor: constant.THEME,
                          marginTop: constant.HEIGHT * 3.5,
                          marginLeft: constant.HEIGHT * 2.5,
                        }}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2),
                            fontWeight: '600',
                            fontFamily: constant.SUIFONT,
                            color: constant.WHITE,
                          }}>
                          Share Your Achievement
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                      padding: constant.HEIGHT * 4,
                      color: 'grey',
                    }}>
                    Your Progress
                  </Text>
                  <View
                    style={{
                      elevation:
                        Platform.OS === 'ios' ? null : constant.HEIGHT * 2,
                      marginTop: constant.HEIGHT * 1,
                      marginBottom: constant.HEIGHT * 2,
                      backgroundColor: constant.WHITE,
                      borderRadius: constant.HEIGHT * 1.5,
                      marginHorizontal: constant.HEIGHT * 2.5,
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
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: constant.HEIGHT * 2,
                        alignSelf: 'center',
                      }}>
                      <View
                        style={{
                          marginVertical: constant.HEIGHT * 2,
                          width: '70%',
                          marginLeft: constant.HEIGHT * 1,
                        }}>
                        {this.dietProgress(
                          '#6D6A6A',
                          this.props.home != undefined &&
                            this.props.home.diet != undefined
                            ? this.props.home.diet.carbs
                            : 0,
                          'carbs',
                        )}

                        {this.dietProgress(
                          '#9BC449',
                          this.props.home != undefined &&
                            this.props.home.diet.protein != undefined
                            ? this.props.home.diet.protein
                            : 0,
                          'protein',
                        )}

                        {this.dietProgress(
                          '#F18282',
                          this.props.home != undefined &&
                            this.props.home.diet.fat != undefined
                            ? this.props.home.diet.fat
                            : 0,
                          'fat',
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        marginBottom: constant.HEIGHT * 4,
                        marginTop: constant.HEIGHT * -7,
                      }}>
                      <View
                        style={{
                          marginTop: constant.HEIGHT * 3,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: constant.HEIGHT * 5,
                          marginRight: constant.HEIGHT * 6,
                        }}>
                        <Image
                          source={constant.ICONSTART}
                          style={{
                            flex: 0.1,
                            width: constant.HEIGHT * 2.5,
                            height: constant.HEIGHT * 6,
                            marginTop: constant.HEIGHT * 1.5,
                          }}
                        />
                        <Image
                          source={constant.ICONFINISHGOAL}
                          style={{
                            flex: 0.1,
                            width: constant.HEIGHT * 2.5,
                            height: constant.HEIGHT * 6,
                            marginTop: constant.HEIGHT * 1.5,
                          }}
                        />
                      </View>

                      <Progress.Bar
                        progress={0.1}
                        height={constant.HEIGHT * 0.8}
                        width={constant.HEIGHT * 40}
                        style={{
                          alignSelf: 'center',
                        }}
                        borderColor="#ECECEC"
                        unfilledColor="#ECECEC"
                        color="#FF67A4"
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: constant.HEIGHT * 6,
                          marginRight: constant.HEIGHT * 6,
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'ios'
                                ? constant.REBOTOREGULAR
                                : constant.REBOTOREGULAR,
                            fontSize: constant.responsiveFontSize(1.4),
                            fontFamily: constant.SUIFONT,
                          }}>
                          71kg
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'ios'
                                ? constant.REBOTOREGULAR
                                : constant.REBOTOREGULAR,
                            fontSize: constant.responsiveFontSize(1.4),
                            fontFamily: constant.SUIFONT,
                          }}>
                          68kg
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
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
    workout: state.dashBoardReducer,
    home: state.homeReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onChangePlanAction,
      onProgramDDAction,
      getLibraryAction,
      onHistoryAction,
      onHomeAction,
      onBannerImageAction,
      onProgramDetailAction,
      onNotificationAction,
      // onProfileAction,
      // onCategoriesAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(StrengthCondition);
