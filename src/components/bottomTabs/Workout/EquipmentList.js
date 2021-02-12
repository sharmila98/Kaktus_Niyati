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
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';

import {ScrollableTabView, ScrollableTabBar} from '../../ScrollTabBar/index.js';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getLibraryAction,
  onProgramDetailAction,
  addEquipmentAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

var head,
  url = '';
var length = 0;
class EquipmentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: constant.IMGWORKOUT,
      libarary: {},
      page: 0,
      selectedName: '',
    };
  }

  componentDidMount() {
    var data = [];
    if (
      this.props.workout.workoutEquipment != undefined &&
      this.props.workout.workoutEquipment.length > 0
    ) {
      this.props.workout.workoutEquipment.filter((item, index) => {
        data.push(item.equipment_name);
        this.setState(
          {
            selectedName: data,
          },
          // () => console.error(this.state.selectedName),
        );
      });
    }
  }

  renderItem = ({item, index}) => {
    var image = Url.baseUrl + Url.images + item.equipment_image.filename;

    return (
      <View style={{margin: constant.HEIGHT * 1}}>
        <TouchableOpacity
          style={{
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            marginTop: constant.HEIGHT * 2,

            backgroundColor: constant.WHITE,
            borderRadius: constant.HEIGHT * 1,
            borderWidth: constant.HEIGHT * 0.1,
            borderColor:
              this.state.selectedName.includes(item.equipment_name) == true
                ? constant.THEME
                : constant.WHITE,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() =>
            this.state.selectedName.includes(item.equipment_name) == true
              ? constant.toastAlert(
                  'Please Select some other equipment, Selected Equipment is already in list ',
                  ToastAndroid.LONG,
                )
              : this.addEquipment(item)
          }>
          <Image
            source={{uri: image}}
            style={{
              marginHorizontal: constant.HEIGHT * 0.8,
              width: constant.HEIGHT * 18,
              height: constant.HEIGHT * 20,
              alignSelf: 'center',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginTop: constant.HEIGHT * 1,
            color: '#5D5C5C',
            width: constant.HEIGHT * 18,

            fontFamily: constant.SUIFONT,
            fontSize: constant.responsiveFontSize(1.8),
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          {item.equipment_name}
        </Text>
      </View>
    );
  };

  showEmptyListView = () => {
    return (
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2),
            alignSelf: 'center',
            fontWeight: 'bold',
            justifyContent: 'center',
            marginTop: constant.HEIGHT * 5,
            fontFamily: constant.SUIFONT,
          }}>
          No data to display
        </Text>
      </View>
    );
  };

  renderVideo = ({item, index}) => {
    var image = '';
    var banner_image =
      item.banner_image != undefined ? item.banner_image.filename : '';

    image = Url.baseUrl + Url.images + banner_image;
    if (index < 2) {
      return (
        <TouchableOpacity
          onPress={() => this.onProgramDetails(item)}
          style={{
            marginTop: constant.HEIGHT * 3,
            width: constant.WIDTH * 85,
            height: constant.HEIGHT * 23,
            alignSelf: 'center',
          }}>
          <ImageBackground
            resizeMode={'cover'}
            style={{
              width: constant.WIDTH * 85,
              height: constant.HEIGHT * 23,
              borderBottomLeftRadius: constant.HEIGHT * 1,
              borderBottomRightRadius: constant.HEIGHT * 1,
              borderTopRightRadius: constant.HEIGHT * 1,
              borderTopLeftRadius: constant.HEIGHT * 1,
              overflow: 'hidden',
            }}
            source={{uri: image}}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  padding: constant.HEIGHT * 2,
                  justifyContent: 'space-between',
                }}>
                <View>
                  {item.level != null ? (
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
                      {item.level}
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
                  flexDirection: 'row',
                  marginTop: constant.HEIGHT * 10.5,
                }}>
                <View style={{alignSelf: 'flex-end', flex: 0.7}}>
                  <Text
                    style={{
                      borderRadius: constant.HEIGHT * 0.5,
                      paddingHorizontal: constant.HEIGHT * 1.5,
                      color: constant.WHITE,
                      opacity: 0.8,
                      textAlign: 'left',
                      fontSize: constant.responsiveFontSize(2.2),
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.program_name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => console.log('fd')}
                  style={{
                    flexDirection: 'row',
                    flex: 0.3,
                    paddingHorizontal: constant.HEIGHT * 1,
                    alignSelf: 'flex-end',
                    justifyContent: 'flex-end',
                  }}>
                  <Image
                    style={{
                      width: constant.HEIGHT * 2,
                      height: constant.HEIGHT * 2,
                    }}
                    source={constant.ICONDIET}
                  />
                  <Text
                    style={{
                      borderRadius: constant.HEIGHT * 0.5,
                      paddingHorizontal: constant.HEIGHT * 1,
                      color: constant.WHITE,
                      opacity: 0.8,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.durations + ' Days'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      );
    }
  };

  onProgramDetails(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.programDetails +
      '/' +
      this.props.signIn.member_id +
      '/' +
      item._id;

    var inputs = {
      program_id: item._id,
      member_id: this.props.signIn.member_id,
    };
    this.props
      .onProgramDetailAction(head, url, methods.get, inputs)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('ProgramDetails');
        }
      });
  }

  addEquipment(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.addEquipments;

    var inputs = {
      equipment_id: item._id,
      member_id: this.props.signIn.member_id,
      action_type: 'add',
    };

    this.props
      .addEquipmentAction(head, url, methods.post, inputs)
      .then((response) => {
        if (response.status == 200) {
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
              if ((res.status = 200)) {
                this.props.navigation.navigate('Workout');
              }
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
            <View style={{flex: 0, marginBottom: constant.HEIGHT * 5}}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={this.props.workout.workoutLoad} />
                }>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginRight: constant.HEIGHT * 2,
                      justifyContent: 'space-between',
                    }}>
                    {/* <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Workout')}
                      style={{
                        alignItems: 'center',
                        marginVertical: constant.HEIGHT * 0.7,
                      }}>
                      <Image
                        source={constant.ICONARROWORANGE}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                           width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          alignSelf: 'center',
                          alignItems: 'center',
                          tintColor: constant.THEME,
                        }}
                      />
                    </TouchableOpacity> */}
                    <BackButtonwithTitle
                      title={null}
                      underLine={false}
                      icon={constant.ICONARROWORANGE}
                      rightIconEnable={false}
                      rightTextEnable={false}
                      notificationIcon={false}
                      backButton={() =>
                        this.props.navigation.navigate('Workout')
                      }
                    />
                    <ScrollableTabView
                      ref={'tab'}
                      onChangeTab={(data) => {
                        this.setState({page: data.i});
                        // console.error(data.i);
                      }}
                      onScroll={(data) => {
                        // console.error(data);
                      }}
                      renderTabBar={() => (
                        <ScrollableTabBar
                          style={{
                            // backgroundColor: constant.THEME,
                            paddingLeft: constant.HEIGHT * 0.1,
                            paddingRight: constant.HEIGHT * 0.1,
                          }}
                          tabBarBackgroundColor={'transparent'}
                          tabBarTextStyle={{
                            fontSize: constant.responsiveFontSize(1.7),
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                          }}
                          // page={this.state.page}
                          //   initialPage={1}
                          onScroll={this.state.page}
                          tabBarInactiveTextColor={constant.THEME}
                          tabBarActiveTextColor={constant.BLACK}
                          tabBarUnderlineStyle={{
                            backgroundColor: constant.THEME,
                          }}
                        />
                      )}>
                      <View tabLabel="Equipments" style={{flex: 1}}>
                        <View
                          style={{
                            marginTop: constant.HEIGHT * 1,
                            marginTop: constant.HEIGHT * 2,
                          }}>
                          <FlatList
                            data={this.props.workout.equipmentList}
                            extraData={this.state}
                            numColumns={2}
                            // keyExtractor={this._keyExtractor}
                            renderItem={this.renderItem}
                            ListEmptyComponent={this.showEmptyListView}
                          />
                        </View>
                      </View>
                      <View tabLabel="Programs" style={{flex: 1}}>
                        <View
                          style={{
                            marginBottom: constant.HEIGHT * 12,
                            marginTop: constant.HEIGHT * 3,
                          }}>
                          <Text
                            style={{
                              textAlign: 'left',
                              color: constant.BLACK,
                              opacity: 0.6,
                              fontWeight: 'bold',
                              fontSize: constant.responsiveFontSize(2),
                              fontFamily: constant.SUIFONT,
                              borderBottomWidth: constant.HEIGHT * 0.1,
                            }}>
                            Top picks for cross trainer programs
                          </Text>

                          <FlatList
                            data={this.props.workout.workoutTopPrograms}
                            extraData={this.state}
                            // keyExtractor={this._keyExtractor}
                            renderItem={this.renderVideo}
                            ListEmptyComponent={this.showEmptyListView}
                          />
                          {this.props.workout.workoutTopPrograms != undefined &&
                          this.props.workout.workoutTopPrograms.length > 0 ? (
                            <TouchableOpacity
                              style={{
                                marginTop: constant.HEIGHT * 1,
                                alignSelf: 'flex-end',
                                marginRight: constant.HEIGHT * 1,
                                padding: constant.HEIGHT * 1,
                              }}
                              onPress={() =>
                                this.props.navigation.replace('ChangePlan')
                              }>
                              <Text
                                style={{
                                  fontSize: constant.responsiveFontSize(1.8),
                                  fontFamily: constant.SUIFONT,
                                  borderBottomWidth: constant.HEIGHT * 0.1,
                                }}>
                                View All
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>

                        <View style={{marginTop: constant.HEIGHT * 10}}></View>
                      </View>
                    </ScrollableTabView>
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
      onProgramDetailAction,
      addEquipmentAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentList);
