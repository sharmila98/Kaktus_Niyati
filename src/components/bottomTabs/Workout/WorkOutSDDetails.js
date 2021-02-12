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
  RefreshControl,
} from 'react-native';

// import Slider from '@react-native-community/slider';
import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';
import Loader from './../../commons/Loader';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  onSingleLibraryAction,
  onHistoryAction,
  onProgramDetailAction,
  onDaySummaryAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import Orientation from 'react-native-orientation';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

var head,
  url,
  item = '',
  index = '';

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

var days = [
  {
    text: 'HIIT Express',
    image: constant.ICONWORKOUTHUMB,
    level: 'Level 1',
  },
  {
    text: 'Cardio blast',
    image: constant.ICONWORKOUT3,
    level: 'Level 1',
  },
  {
    text: 'Bike Charge',
    image: constant.ICONWORKOUT2,
    level: 'Level 1',
  },
  {
    text: 'HIIT Express',
    image: constant.ICONWORKOUTHUMB,
    level: 'Level 1',
  },
];

class WorkOutSDDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: constant.IMGWORKOUT,
      item: {},
      index: '',
      loader: false,
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this.setState({
      loader: false,
    });
    // Orientation.lockToPortrait();
    // // this.setState({
    //   item: this.props.navigation.getParam('item'),
    //   index: this.props.navigation.getParam('index'),
    // });
    // console.error(this.props.navigation.getParam('item'));
  }

  _renderItem = ({item, index}) => {
    if (item.librarydata != undefined) {
      if (item.librarydata.length > 0) {
        var image =
          item.librarydata[0].ref_image != undefined
            ? Url.baseUrl + Url.images + item.librarydata[0].ref_image.filename
            : '';
        return (
          <TouchableOpacity onPress={() => this.onSingleLibrary(item, index)}>
            <View
              style={{
                marginBottom:
                  this.props.workout.workoutSingleDayDetails.length == index + 1
                    ? constant.HEIGHT * 15
                    : constant.HEIGHT * 1.5,
                padding: constant.HEIGHT * 1,
                height: constant.HEIGHT * 13,
                backgroundColor: constant.WHITE,
                borderColor: '#CECBCB',
                borderWidth: constant.HEIGHT * 0.1,
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
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginHorizontal: constant.HEIGHT * 1,
                }}>
                <View style={{flex: 0.6, flexDirection: 'column'}}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.8),
                      color: '#4f4f4f',
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.librarydata[0].library_name}
                  </Text>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.4),
                      color: '#cc4671',
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                      marginTop: constant.HEIGHT * 0.5,
                    }}>
                    {parseInt(item.librarydata[0].ref_video.duration) *
                      parseInt(item.library_data.count) +
                      ' ' +
                      item.library_data.type +
                      ' ' +
                      ' X ' +
                      item.library_data.times_to_repeat}
                  </Text>
                </View>
                {item.librarydata[0] != undefined &&
                item.librarydata[0].ref_image != undefined ? (
                  <View
                    style={{
                      flex: 0.4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        width: constant.HEIGHT * 17,
                        height: constant.HEIGHT * 12,
                      }}
                      source={{uri: image}}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    }
  };

  onSingleLibrary(item, index) {
    var day = index + 1;

    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.daySummary +
      this.props.signIn.member_id +
      '/' +
      item._id +
      '/' +
      day;

    // console.error(url);

    this.props.onDaySummaryAction(head, url, methods.get).then((res) => {
      if (res.status == 200) {
        this.props.navigation.navigate('StrengthCondition');
      }
    });

    // url = Url.baseUrl + Url.singleLibraryDetails;

    // var inputs = {
    //   id: item.library_id,
    // };
    // this.propslibrary_id/
    //   .onSingleLibraryAction(head, url, methods.post, inputs)
    //   .then((resp) => {
    //     if (resp.status == 200) {
    //       this.props.navigation.navigate('SingleLibraryDetail');
    //     }
    //   });
  }

  onHistoryClick() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.history + this.props.signIn.member_id;

    this.props.onHistoryAction(head, url, methods.get).then((res) => {
      if (res.status == 200) {
        this.props.navigation.navigate('History');
      }
    });
  }

  beginVideo() {
    if (this.props.workout.workoutSingleDayDetails.length != 0) {
      if (
        this.props.workout.workoutSingleDayDetails[0].video_url != undefined
      ) {
        this.setState({
          loader: true,
        });
        this.props.navigation.navigate('WorkoutVideo', {
          onGoBack: () => this.refresh(),
        });
      }
    } else {
      constant.toastAlert('Video not available', ToastAndroid.LONG);
    }
  }

   refresh() {
    try {
      setTimeout(() => {
        this.setState({
          loader: false,
        });
      }, 1500);
      // var head = {
      //   accept: 'application/json',
      //   Authorization: this.props.signIn.token,
      // };

      // var url =
      //   Url.baseUrl +
      //   Url.programDetails +
      //   '/' +
      //   this.props.signIn.member_id +
      //   '/' +
      //   this.props.workout.workoutTopPrograms[0]._id;

      // var inpt = {
      //   program_id: this.props.workout.singleDayProgram.program_id,
      //   member_id: this.props.signIn.member_id,
      // };
      // this.props
      //   .onProgramDetailAction(head, url, methods.get, inpt)
      //   .then((resp) => {
      //     if (resp.status == 200) {
      //       var urls =
      //         Url.baseUrl +
      //         Url.dayDetails +
      //         '/' +
      //         this.props.signIn.member_id +
      //         '/' +
      //         this.props.workout.workoutProgramDetails.plan.program._id +
      //         '/' +
      //         this.props.workout.workoutDay;

      //       var inputs = {
      //         program_id: this.props.workout.workoutProgramDetails.plan.days[0]
      //           ._id,
      //         member_id: this.props.signIn.member_id,
      //         plan_type: 'workout',
      //       };
      //       this.props
      //         .onProgramDDAction(
      //           head,
      //           urls,
      //           methods.get,
      //           inputs,
      //           this.props.workout.workoutDay,
      //         )
      //         .then((res) => {
      //           if (res.status == 200) {
      //             this.setState({
      //               loader: false,
      //             });
      //           }
      //         });
      //     }
      // });
    } catch (error) {}
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {this.state.loader == false ? (
            <View style={{flex: 1}}>
              <Header navigation={this.props.navigation} onPress={false} />
              <View style={{flex: 0}}>
                <ScrollView
                  style={{}}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.props.workout.workoutLoad}
                    />
                  }>
                  <View
                    style={{
                      backgroundColor: constant.WHITE,
                      marginVertical: constant.HEIGHT * 1.5,
                    }}>
                    <BackButtonwithTitle
                      title={'Day ' + this.props.workout.workoutDay}
                      underLine={true}
                      icon={constant.ICONARROWORANGE}
                      rightIconEnable={true}
                      rightTextEnable={true}
                      onPressRightText={() => this.onHistoryClick()}
                      rightText={'History'}
                      notificationIcon={false}
                      backButton={() => {
                        this.props.route.params.onGoBack();
                        this.props.navigation.goBack();
                      }}
                    />

                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: constant.HEIGHT * 2,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          marginTop: constant.HEIGHT * 1,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}>
                        <ImageBackground
                          resizeMode={'contain'}
                          source={constant.ICONSINGLEDAY}
                          style={{
                            borderRadius: constant.HEIGHT * 1,
                            width: constant.WIDTH * 93,
                            height: constant.HEIGHT * 20,
                            borderBottomLeftRadius: constant.HEIGHT * 1,
                            borderBottomRightRadius: constant.HEIGHT * 1,
                            borderTopRightRadius: constant.HEIGHT * 1,
                            borderTopLeftRadius: constant.HEIGHT * 1,
                            overflow: 'hidden',
                          }}>
                          <TouchableOpacity
                            onPress={() => this.beginVideo()}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end',
                              alignSelf: 'flex-end',
                              marginTop: constant.HEIGHT * 11,
                              marginRight: constant.HEIGHT * 3,
                              backgroundColor: constant.THEME,
                              borderRadius: constant.HEIGHT * 1.5,
                              padding: constant.HEIGHT * 1,
                              paddingHorizontal: constant.HEIGHT * 2,
                            }}>
                            <Image
                              source={constant.ICONPLAY}
                              resizeMode={'contain'}
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
                                textAlign: 'center',
                                marginRight: constant.HEIGHT * 1,
                                fontFamily: constant.SUIFONT,
                                fontWeight: 'bold',
                                fontSize: constant.responsiveFontSize(2),
                              }}>
                              Begin
                            </Text>
                          </TouchableOpacity>
                        </ImageBackground>
                      </View>
                    </TouchableOpacity>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: constant.HEIGHT * 3,
                        marginTop: constant.HEIGHT * 2,
                        borderBottomWidth: constant.HEIGHT * 0.1,
                        flex: 1,
                        borderColor: '#707070',
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
                          fontFamily: constant.SUIFONT,
                        }}>
                        Workouts
                      </Text>
                      <TouchableOpacity style={{flexDirection: 'row'}}>
                        <Image
                          source={constant.ICONGYM}
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
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {this.props.workout.workoutSingleDayDetails.length +
                            ' Exercises'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        marginTop: constant.HEIGHT * 1,
                        marginHorizontal: constant.HEIGHT * 3,
                      }}>
                      <FlatList
                        data={this.props.workout.workoutSingleDayDetails}
                        extraData={this.state}
                        keyExtractor={(item, index) => index + ''}
                        renderItem={this._renderItem}
                        ListEmptyComponent={this.showEmptyListView}
                      />
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          ) : (
            <Loader />
          )}
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
      onSingleLibraryAction,
      onHistoryAction,
      onProgramDetailAction,
      onDaySummaryAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(WorkOutSDDetails);
