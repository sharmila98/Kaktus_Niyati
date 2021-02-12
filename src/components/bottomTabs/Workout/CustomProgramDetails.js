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
import moment from 'moment';

// import Slider from '@react-native-community/slider';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getLibraryAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

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

class CustomProgramDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    // Url.baseUrl +
    //   Url.images +
    //   this.props.workout.workoutProgramDetails.plan.program.banner_image
    //     .filename;
    // this.setState({images: images});

    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.getLibrary;

    var inputs = {
      type: 'workout',
    };
    this.props.getLibraryAction(head, url, methods.post, inputs).then((res) => {
      // if (res.status == 200) {
      //   var library_name = res.data.data;
      //   library_name.filter((item, index) => {
      //     this.setState({
      //       library_name: [
      //         ...this.state.library_name,
      //         {label: item.library_name, value: item.library_name},
      //       ],
      //     });
      //   });
      // }
    });
  }

  onChangePlan(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.changePlan;

    var inputs = {
      program_id: item,
      member_id: this.props.signIn.member_id,
      plan_type: 'workout',
    };
    this.props
      .onChangePlanAction(head, url, methods.post, inputs)
      .then((resp) => {
        if (resp.status == 200) {
          this.workoutDashBoard();
        }
      });
  }

  workoutDashBoard() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.dietDashboard +
      '/workout/' +
      this.props.signIn.member_id;

    var inputs = {
      program_type: 'workout',
      member_id: this.props.signIn.member_id,
    };

    this.props
      .onWorkoutDashBoard(head, url, methods.get, inputs)
      .then((res) => {
        this.props.navigation.navigate('Workout');
      });
  }

  _renderItem = ({item, index}) => {
    // var image = Url.baseUrl + Url.images + item.banner_image.filename;
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
      <TouchableOpacity onPress={() => this.onDayDetails(item, day)}>
        <View
          style={{
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            marginVertical: constant.HEIGHT * 1,
            padding: constant.HEIGHT * 1,
            marginHorizontal: constant.HEIGHT * 1,
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
          }}>
          <View
            style={{width: constant.HEIGHT * 12, height: constant.HEIGHT * 6}}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
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
              {/* <Image
                style={{
                  width: constant.HEIGHT * 1.51,
                  height: constant.HEIGHT * 1.6,
                }}
                source={
                  item.status == 'open' ? constant.ICONOPEN : constant.ICONLOCK
                }
              /> */}
            </View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(1.4),
                flex: 1,
                color: '#b8b6b6',
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
              }}>
              {day > 3
                ? 'Scheduled on ' + moment(item.date).format('DD MMM')
                : moment(item.date).format('DD MMM')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
      .onProgramDDAction(head, url, methods.get, inputs, index)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('CustomSingleDay', {
            item: item,
            index: index,
          });
        }
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0.94}}>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('CustomPlan')
                      }
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
                          fontWeight: 'bold',

                          fontFamily: constant.SUIFONT,
                        }}>
                        {
                          this.props.workout.workoutProgramDetails.plan.program
                            .program_name
                        }
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.onChangePlan(
                          this.props.workout.workoutProgramDetails.plan.program
                            ._id,
                        )
                      }
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginRight: constant.HEIGHT * 4,
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
                          borderBottomWidth: constant.HEIGHT * 0.1,
                          borderColor: '#707070',
                          fontFamily: constant.SUIFONT,
                        }}>
                        {'Make it current Plan'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity>
                    <View
                      style={{
                        marginTop: constant.HEIGHT * 3,
                        marginLeft: constant.HEIGHT * 3,
                        marginBottom: constant.HEIGHT * 1,
                      }}>
                      <ImageBackground
                        source={constant.ICONCUSTOMPLAN}
                        style={{
                          width: constant.WIDTH * 85,
                          height: constant.HEIGHT * 23,
                          borderBottomLeftRadius: constant.HEIGHT * 1,
            borderBottomRightRadius: constant.HEIGHT * 1,
            borderTopRightRadius: constant.HEIGHT * 1,
            borderTopLeftRadius: constant.HEIGHT * 1,
            overflow: 'hidden',
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
                                  fontSize: constant.responsiveFontSize(1.5),
                                  fontWeight: 'bold',
                                  backgroundColor: '#8FC427',
                                  fontFamily: constant.SUIFONT,
                                }}>
                                {
                                  this.props.workout.workoutProgramDetails.plan
                                    .program.level
                                }
                              </Text>
                            ) : null}
                          </View>
                          {/* <TouchableOpacity
                            onPress={() => console.log('f')}
                            style={{
                              alignSelf: 'center',
                              alignItems: 'center',
                              padding: constant.HEIGHT * 0.5,
                            }}>
                            <Image
                              style={{
                                width: constant.HEIGHT * 2,
                                height: constant.HEIGHT * 2,
                              }}
                              source={constant.ICONBOOKMARKSELECT}
                            />
                          </TouchableOpacity> */}
                        </View>
                        {/* <View
                          style={{
                            marginHorizontal: constant.HEIGHT * 1.5,
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={constant.ICONRANK}
                            style={{
                              width: constant.HEIGHT * 2,
                              height: constant.HEIGHT * 2,
                              alignSelf: 'center',
                              tintColor: '#fff',
                            }}
                          />
                        </View> */}
                        <View
                          style={{
                            marginTop: constant.HEIGHT * 10,
                            marginHorizontal: constant.HEIGHT * 1.5,
                            justifyContent: 'flex-end',
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
                              this.props.workout.workoutProgramDetails.plan
                                .program.program_name
                            }
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginRight: constant.HEIGHT * 2,
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
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      marginTop: constant.HEIGHT * 1,
                      marginLeft: constant.HEIGHT * 1.5,
                    }}>
                    <FlatList
                      data={this.props.workout.workoutProgramDetails.plan.days}
                      extraData={this.state}
                      // keyExtractor={this._keyExtractor}
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
                              marginTop: constant.HEIGHT * 1,
                            }}
                            source={constant.ICONLOCK}
                          />
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
                            onPress={() =>
                              this.setState({modalVisible: false})
                            }>
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
      getLibraryAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomProgramDetails);
