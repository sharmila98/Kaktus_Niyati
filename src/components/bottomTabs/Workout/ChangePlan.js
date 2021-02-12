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
  RefreshControl,
} from 'react-native';

// import Slider from '@react-native-community/slider';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

var head, url;

var array = [
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

class ChangePlan extends Component {
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

  componentDidMount() {}

  _renderItem = ({item, index}) => {
    var image = Url.baseUrl + Url.images + item.banner_image.filename;

    // console.error(item);

    return (
      <TouchableOpacity onPress={() => this.onChangePlan(item)}>
        <View
          style={{
            marginTop: constant.HEIGHT * 3,
            marginLeft: constant.HEIGHT * 4,
            marginRight: constant.HEIGHT * 4,
            marginBottom: constant.HEIGHT * 1,
          }}>
          <ImageBackground
            source={{uri: image}}
            style={{
              width: constant.WIDTH * 85,
              height: constant.HEIGHT * 23,
              borderBottomLeftRadius: constant.HEIGHT * 1,
            borderBottomRightRadius: constant.HEIGHT * 1,
            borderTopRightRadius: constant.HEIGHT * 1,
            borderTopLeftRadius: constant.HEIGHT * 1,
            overflow: 'hidden',
              // backgroundColor:'red'/
            }}>
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
                marginHorizontal: constant.HEIGHT * 1.5,
                flexDirection: 'row',
              }}>
              <Image
                resizeMode={'contain'}
                source={constant.ICONRANK}
                style={{
                  width: constant.HEIGHT * 2,
                  height: constant.HEIGHT * 2,
                  alignSelf: 'center',
                  tintColor: '#fff',
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: constant.HEIGHT * 11,
                marginHorizontal: constant.HEIGHT * 1.5,
              }}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(2),
                  color: constant.WHITE,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                {item.program_name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={constant.ICONCLOCK}
                  resizeMode={'contain'}
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
                    color: constant.WHITE,
                    marginLeft: constant.HEIGHT * 0.5,
                    fontFamily: constant.SUIFONT,
                    alignSelf: 'center',
                  }}>
                  {item.durations + ' Days'}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: constant.HEIGHT * 0.5,
                marginLeft: constant.HEIGHT * 7,
                borderRadius: constant.HEIGHT * 0.5,
              }}>
              <Progress.Bar
                progress={0.7}
                height={constant.HEIGHT * 0.5}
                width={constant.HEIGHT * 51}
                style={{
                  alignSelf: 'center',
                  borderRadius: constant.HEIGHT * 1,
                }}
                borderColor="transparent"
                unfilledColor="#FFF"
                color={constant.THEME}
              />
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };

  onChangePlan(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.changePlan;

    var inputs = {
      program_id: item._id,
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

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0}}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={this.props.workout.workoutLoad} />
                }>
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
                      Top picks for you
                    </Text>
                  </TouchableOpacity> */}
                  <BackButtonwithTitle
                    title={'Top picks for you'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.navigate('Workout')}
                  />

                  <View style={{}}>
                    <FlatList
                      data={this.props.workout.workoutTopPrograms}
                      extraData={this.state}
                      // keyExtractor={this._keyExtractor}
                      renderItem={this._renderItem}
                      ListEmptyComponent={this.showEmptyListView}
                    />
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
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ChangePlan);
