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
  ToastAndroid,
  TextInput,
  FlatList,
  Modal,
  RefreshControl,
} from 'react-native';

// import Slider from '@react-native-community/slider';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import Orientation from 'react-native-orientation';

var head, url;

var monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

class ProgramDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    if (
      this.props.workout.workoutProgramDetails.plan.program.banner_image !=
        undefined &&
      this.props.workout.workoutProgramDetails.plan.program.banner_image
        .filename != undefined
    ) {
      var images =
        Url.baseUrl +
        Url.images +
        this.props.workout.workoutProgramDetails.plan.program.banner_image
          .filename;

      this.setState({images: images});
    }
    //
  }

  _renderItem = ({item, index}) => {
    // var image = Url.baseUrl + Url.images + item.banner_image.filename;
    // console.error(moment(item.date).format('DD MMM'));
    var day = index + 1;
    var d = new Date(item.date);
    var date = d.getDate();
    var month = monthNames[d.getMonth()];
    var scheduledDate =
      date == 1
        ? date + 'st ' + month
        : date == 2
        ? date + 'nd ' + month
        : date == 3
        ? date + 'rd ' + month
        : date + 'th ' + month;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() =>
          item.status == 'open' ||
          item.status == 'progress' ||
          item.status == 'completed'
            ? this.onDayDetails(item, day)
            : this.setState({modalVisible: true})
        }>
        <View
          style={{
            marginVertical: constant.HEIGHT * 1.5,
            padding: constant.HEIGHT * 1,
            marginHorizontal: constant.HEIGHT * 1,
            marginBottom:
              this.props.workout.workoutProgramDetails.plan.days.length ==
              index + 1
                ? constant.HEIGHT * 12
                : 0,
            backgroundColor: constant.WHITE,
            borderRadius: constant.HEIGHT * 1.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
          }}>
          <View
            style={{
              width: constant.HEIGHT * 12.5,
              height: constant.HEIGHT * 7,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  flex: 0.8,
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.8),
                  color: '#7f7c7c',
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                {'Day ' + day}
              </Text>
              <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                <Image
                  resizeMode={'contain'}
                  style={
                    item.status == 'open' ||
                    item.status == 'progress' ||
                    item.status == 'completed'
                      ? {
                          width: constant.HEIGHT * 3,
                          height: constant.HEIGHT * 3,
                          tintColor:
                            item.status == 'progress' || item.status == 'open'
                              ? constant.THEME
                              : item.status == 'completed'
                              ? constant.GREENCOLOR
                              : 'transparent',
                        }
                      : {
                          width: constant.HEIGHT * 1.5,
                          height: constant.HEIGHT * 1.5,
                        }
                  }
                  source={
                    item.status == 'open' ||
                    item.status == 'progress' ||
                    item.status == 'completed'
                      ? constant.ICONOPEN
                      : constant.ICONLOCK
                  }
                />
              </View>
            </View>
            <Text
              numberOfLines={2}
              style={{
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(1.2),
                marginTop: constant.HEIGHT * 0.5,
                flex: 1,
                color: '#000',
                opacity: 0.5,
                fontFamily: constant.SUIFONT,
              }}>
              {item.status != 'open' && item.status != 'progress'
                ? 'Scheduled on ' + moment(item.date).format('DD MMM')
                : moment(item.date).format('DD MMM')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  beginVideo() {
    var day = '1';
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    this.setState({modalVisible: false});

    url =
      Url.baseUrl +
      Url.dayDetails +
      '/' +
      this.props.signIn.member_id +
      '/' +
      this.props.workout.workoutProgramDetails.plan.program._id +
      '/' +
      day;

    var inputs = {
      program_id: this.props.workout.workoutProgramDetails.plan.days[0]._id,
      member_id: this.props.signIn.member_id,
      plan_type: 'workout',
    };

    this.props
      .onProgramDDAction(head, url, methods.get, inputs, day)
      .then((resp) => {
        if (resp.status == 200) {
          if (resp.data.data.length != 0) {
            if (resp.data.data[0].video_url != undefined) {
              this.props.navigation.navigate('WorkoutVideo');
            }
          } else {
            constant.toastAlert('Video not available', ToastAndroid.LONG);
          }
        }
      });
  }

  onDayDetails(item, index) {
    var day = index + '';
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.dayDetails +
      '/' +
      this.props.signIn.member_id +
      '/' +
      this.props.workout.workoutProgramDetails.plan.program._id +
      '/' +
      day;

    var inputs = {
      program_id: item._id,
      member_id: this.props.signIn.member_id,
      plan_type: 'workout',
    };
    this.props
      .onProgramDDAction(head, url, methods.get, inputs, day)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('WorkOutSDDetails', {
            item: item,
            index: index,
            onGoBack: () => this.refresh(),
          });
        }
      });
  }

  refresh() {
    try {
      // setTimeout(() => {
      console.log('sdfdfdfd');
      this.setState({
        loader: false,
      });
      // }, 1500);
    } catch (e) {}
  }

  bannerPress() {
    try {
      this.props.workout.workoutProgramDetails.plan.days.find((item, index) => {
        if (item.status == 'open') {
          this.onDayDetails(item, index + 1);
        }
      });
    } catch (error) {}
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation}  onPress={false}/>
            <View style={{flex: 0}}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={this.props.workout.workoutLoad} />
                }>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                    flex: 1,
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
                      My Program
                    </Text>
                  </TouchableOpacity> */}
                  <BackButtonwithTitle
                    title={'My Program'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => {
                      this.props.route.params.onGoBack();
                      this.props.navigation.goBack();
                    }}
                  />

                  <TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                        marginTop: constant.HEIGHT * 2,
                        width: constant.WIDTH * 90,
                        height: constant.HEIGHT * 23,
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      {this.state.images != '' ? (
                        <ImageBackground
                          source={{uri: this.state.images}}
                          style={{
                            borderRadius: constant.HEIGHT * 1,
                            width: constant.WIDTH * 90,
                            height: constant.HEIGHT * 23,
                            borderBottomLeftRadius: constant.HEIGHT * 1,
                            borderBottomRightRadius: constant.HEIGHT * 1,
                            borderTopRightRadius: constant.HEIGHT * 1,
                            borderTopLeftRadius: constant.HEIGHT * 1,
                            overflow: 'hidden',
                          }}>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.bannerPress()}
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.10)',
                              flex: 1,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                padding: constant.HEIGHT * 2,
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                {this.props.workout.workoutProgramDetails.plan
                                  .program.level != '' &&
                                this.props.workout.workoutProgramDetails.plan
                                  .program.level != undefined ? (
                                  <Text
                                    style={{
                                      borderRadius: constant.HEIGHT * 0.5,
                                      paddingHorizontal: constant.HEIGHT * 0.5,
                                      color: constant.WHITE,
                                      textAlign: 'center',
                                      fontSize: constant.responsiveFontSize(
                                        1.5,
                                      ),
                                      fontWeight: 'bold',
                                      backgroundColor: '#8FC427',
                                      fontFamily: constant.SUIFONT,
                                    }}>
                                    {
                                      this.props.workout.workoutProgramDetails
                                        .plan.program.level
                                    }
                                  </Text>
                                ) : null}
                              </View>
                              <TouchableOpacity
                                onPress={() => console.log('f')}
                                style={{
                                  alignSelf: 'center',
                                  alignItems: 'center',
                                  padding: constant.HEIGHT * 0.5,
                                }}>
                                <Image
                                  resizeMode={'contain'}
                                  style={{
                                    width: constant.HEIGHT * 2,
                                    height: constant.HEIGHT * 2,
                                  }}
                                  source={constant.ICONBOOKMARK}
                                />
                              </TouchableOpacity>
                            </View>

                            <View
                              style={{
                                marginTop: constant.HEIGHT * 7,
                                marginHorizontal: constant.HEIGHT * 1.5,
                              }}>
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                }}>
                                <Text
                                  style={{
                                    fontFamily:
                                      Platform.OS === 'ios'
                                        ? constant.REBOTOREGULAR
                                        : constant.REBOTOREGULAR,
                                    fontSize: constant.responsiveFontSize(2),
                                    color: constant.WHITE,
                                    fontWeight: 'bold',
                                    fontFamily: constant.SUIFONT,
                                  }}>
                                  {
                                    this.props.workout.workoutProgramDetails
                                      .plan.program.program_name
                                  }
                                </Text>
                                <Text
                                  style={{
                                    fontFamily:
                                      Platform.OS === 'ios'
                                        ? constant.REBOTOREGULAR
                                        : constant.REBOTOREGULAR,
                                    fontSize: constant.responsiveFontSize(1.8),
                                    color: constant.WHITE,
                                    fontFamily: constant.SUIFONT,
                                    opacity: 0.8,
                                  }}>
                                  {
                                    this.props.workout.workoutProgramDetails
                                      .plan.program.desc
                                  }
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                marginTop: constant.HEIGHT * 1,
                                marginHorizontal: constant.HEIGHT * 1.5,
                                flexDirection: 'row',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                  alignItems: 'flex-start',
                                  flex: 1,
                                }}>
                                <Image
                                  source={constant.ICONCLOCK}
                                  style={{
                                    width: constant.HEIGHT * 1.5,
                                    height: constant.HEIGHT * 1.5,
                                    alignSelf: 'center',
                                    tintColor: constant.WHITE,
                                  }}
                                />
                                <Text
                                  style={{
                                    fontFamily:
                                      Platform.OS === 'ios'
                                        ? constant.REBOTOREGULAR
                                        : constant.REBOTOREGULAR,
                                    fontSize: constant.responsiveFontSize(1.4),
                                    marginLeft: constant.HEIGHT * 0.5,
                                    fontFamily: constant.SUIFONT,
                                    color: constant.WHITE,

                                    alignSelf: 'center',
                                  }}>
                                  {this.props.workout.workoutProgramDetails.plan
                                    .program.durations + ' Days'}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </ImageBackground>
                      ) : (
                        <ImageBackground
                          source={constant.ICONCUSTOMPLAN}
                          style={{
                            borderRadius: constant.HEIGHT * 1,
                            width: constant.WIDTH * 90,
                            height: constant.HEIGHT * 23,
                            borderBottomLeftRadius: constant.HEIGHT * 1,
                            borderBottomRightRadius: constant.HEIGHT * 1,
                            borderTopRightRadius: constant.HEIGHT * 1,
                            borderTopLeftRadius: constant.HEIGHT * 1,
                            overflow: 'hidden',
                          }}>
                          <View
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.18)',
                              flex: 1,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                padding: constant.HEIGHT * 2,
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                {this.props.workout.workoutProgramDetails.plan
                                  .program.level != '' &&
                                this.props.workout.workoutProgramDetails.plan
                                  .program.level != undefined ? (
                                  <Text
                                    style={{
                                      borderRadius: constant.HEIGHT * 0.5,
                                      paddingHorizontal: constant.HEIGHT * 0.5,
                                      color: constant.WHITE,
                                      textAlign: 'center',
                                      fontSize: constant.responsiveFontSize(
                                        1.5,
                                      ),
                                      fontWeight: 'bold',
                                      backgroundColor: '#8FC427',
                                      fontFamily: constant.SUIFONT,
                                    }}>
                                    {
                                      this.props.workout.workoutProgramDetails
                                        .plan.program.level
                                    }
                                  </Text>
                                ) : null}
                              </View>
                              <TouchableOpacity
                                onPress={() => console.log('f')}
                                style={{
                                  alignSelf: 'center',
                                  alignItems: 'center',
                                  padding: constant.HEIGHT * 0.5,
                                }}>
                                <Image
                                  resizeMode={'contain'}
                                  style={{
                                    width: constant.HEIGHT * 2,
                                    height: constant.HEIGHT * 2,
                                  }}
                                  source={constant.ICONBOOKMARK}
                                />
                              </TouchableOpacity>
                            </View>

                            <View
                              style={{
                                marginTop: constant.HEIGHT * 7,
                                marginHorizontal: constant.HEIGHT * 1.5,
                              }}>
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                }}>
                                <Text
                                  style={{
                                    fontFamily:
                                      Platform.OS === 'ios'
                                        ? constant.REBOTOREGULAR
                                        : constant.REBOTOREGULAR,
                                    fontSize: constant.responsiveFontSize(2),
                                    color: constant.WHITE,
                                    fontWeight: 'bold',
                                    fontFamily: constant.SUIFONT,
                                  }}>
                                  {
                                    this.props.workout.workoutProgramDetails
                                      .plan.program.program_name
                                  }
                                </Text>
                                <Text
                                  style={{
                                    fontFamily:
                                      Platform.OS === 'ios'
                                        ? constant.REBOTOREGULAR
                                        : constant.REBOTOREGULAR,
                                    fontSize: constant.responsiveFontSize(1.8),
                                    color: constant.WHITE,
                                    fontFamily: constant.SUIFONT,
                                    opacity: 0.8,
                                  }}>
                                  {
                                    this.props.workout.workoutProgramDetails
                                      .plan.program.desc
                                  }
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                marginTop: constant.HEIGHT * 1,
                                marginHorizontal: constant.HEIGHT * 1.5,
                                flexDirection: 'row',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                  alignItems: 'flex-start',
                                  flex: 1,
                                }}>
                                <Image
                                  source={constant.ICONCLOCK}
                                  style={{
                                    width: constant.HEIGHT * 1.5,
                                    height: constant.HEIGHT * 1.5,
                                    alignSelf: 'center',
                                    tintColor: constant.WHITE,
                                  }}
                                />
                                <Text
                                  style={{
                                    fontFamily:
                                      Platform.OS === 'ios'
                                        ? constant.REBOTOREGULAR
                                        : constant.REBOTOREGULAR,
                                    fontSize: constant.responsiveFontSize(1.4),
                                    marginLeft: constant.HEIGHT * 0.5,
                                    fontFamily: constant.SUIFONT,
                                    color: constant.WHITE,

                                    alignSelf: 'center',
                                  }}>
                                  {this.props.workout.workoutProgramDetails.plan
                                    .program.durations + ' Days'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </ImageBackground>
                      )}
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      marginVertical: constant.HEIGHT * 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FlatList
                      data={this.props.workout.workoutProgramDetails.plan.days}
                      extraData={this.state}
                      keyExtractor={(item, index) => index + ''}
                      renderItem={this._renderItem}
                      numColumns={3}
                      ListEmptyComponent={this.showEmptyListView}
                    />
                  </View>

                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Modal
                      animationType="fade"
                      transparent={true}
                      visible={this.state.modalVisible}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          width: '90%',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: constant.WHITE,
                            margin: constant.HEIGHT * 2,
                            borderColor: '#6D6A6A',
                            borderWidth: constant.HEIGHT * 0.1,
                            borderRadius: constant.HEIGHT * 1,
                            padding: constant.HEIGHT * 2,
                          }}>
                          <Image
                            style={{
                              width: constant.HEIGHT * 2.51,
                              height: constant.HEIGHT * 2.6,
                              justifyContent: 'center',
                              alignSelf: 'center',
                              alignItems: 'center',
                              marginTop: constant.HEIGHT * 1,
                            }}
                            source={constant.ICONLOCK}
                          />
                          <TouchableOpacity
                            style={{
                              justifyContent: 'flex-end',
                              alignSelf: 'flex-end',
                              padding: constant.HEIGHT * 2,
                              marginTop: constant.HEIGHT * -4,
                            }}
                            onPress={() =>
                              this.setState({modalVisible: false})
                            }>
                            <Image
                              style={{
                                width: constant.HEIGHT * 2.2,
                                height: constant.HEIGHT * 2.2,
                              }}
                              source={constant.ICONCLOSE}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.8),
                              marginTop: constant.HEIGHT * 0.5,
                              alignSelf: 'center',
                              fontFamily: constant.SUIFONT,
                            }}>
                            {'Complete the previous'}
                          </Text>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.8),
                              marginTop: constant.HEIGHT * 0.5,
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                            }}>
                            {'workout to unlock this'}
                          </Text>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.8),
                              marginTop: constant.HEIGHT * 8,
                              color: '#6D6A6A',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                            }}>
                            {'Unlock now'}
                          </Text>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                              marginTop: constant.HEIGHT * 1,
                              marginRight: constant.HEIGHT * 2,
                              backgroundColor: constant.THEME,
                              borderRadius: constant.HEIGHT * 1.5,
                              padding: constant.HEIGHT * 1,
                            }}
                            onPress={() => this.beginVideo()}>
                            <Image
                              source={constant.ICONPLAY}
                              style={{
                                marginHorizontal: constant.HEIGHT * 1,
                                width: constant.HEIGHT * 1.5,
                                height: constant.HEIGHT * 1.5,
                                alignSelf: 'center',
                              }}
                            />
                            <Text
                              style={{
                                color: constant.WHITE,
                                marginRight: constant.HEIGHT * 1,
                                fontFamily: constant.SUIFONT,
                              }}>
                              Begin Workout
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
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
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onChangePlanAction,
      onProgramDDAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProgramDetails);
