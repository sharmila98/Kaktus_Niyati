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

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getLibraryAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

var head,
  url = '';

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

class CustomWorkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: constant.IMGWORKOUT,
      libarary: {},
    };
  }

  componentDidMount() {
    // head = {
    //   accept: 'application/json',
    //   Authorization: this.props.signIn.token,
    // };
    // url = Url.baseUrl + Url.getLibrary;
    // var inputs = {
    //   type: 'workout',
    // };
    // this.props.getLibraryAction(head, url, methods.post, inputs);
  }

  renderItem = ({item, index}) => {
    var image =
      item.ref_image != undefined
        ? Url.baseUrl + Url.images + item.ref_image.filename
        : '';
    return (
      <TouchableOpacity onPress={() => this.onSingleLibrary(item)}>
        <View
          style={{
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            marginVertical: constant.HEIGHT * 0.5,
            padding: constant.HEIGHT * 1.5,
            height: constant.HEIGHT * 12,
            marginHorizontal: constant.HEIGHT * 2.5,
            marginVertical: constant.HEIGHT * 1,
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
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: constant.HEIGHT * 1.5,
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(2.2),
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                {item.library_name}
              </Text>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.8),
                  color: '#cc4671',
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                {item.cal_per_rep + ' Reps X1'}
              </Text>
            </View>
            {item.ref_image != undefined ? (
              <Image
                resizeMode="contain"
                style={{
                  width: constant.HEIGHT * 6.1,
                  height: constant.HEIGHT * 8,
                  marginRight: constant.HEIGHT * 2,
                  alignSelf: 'center',
                  marginTop: constant.HEIGHT * 1,
                }}
                source={{uri: image}}
              />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  <TouchableOpacity
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
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {'Workout 01'}
                    </Text>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'column'}}>
                    <FlatList
                      data={this.props.workout.workoutLibraryDetails}
                      extraData={this.state}
                      // keyExtractor={this._keyExtractor}
                      renderItem={this.renderItem}
                      ListEmptyC00omponent={this.showEmptyListView}
                    />
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginTop: constant.HEIGHT * 3,
                        marginBottom: constant.HEIGHT * 10,
                        elevation:
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                        padding: constant.HEIGHT * 1,
                        backgroundColor: constant.WHITE,
                        borderRadius: constant.HEIGHT * 1,
                        shadowOffset:
                          Platform.OS === 'ios'
                            ? {
                                width: 0,
                                height: constant.HEIGHT * 2,
                              }
                            : null,
                      }}>
                      <Image
                        source={constant.ICONADDBUTTON}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2.11,
                          height: constant.HEIGHT * 2.1,
                          marginTop: constant.HEIGHT * 0.2,
                        }}
                      />
                      <Text
                        style={{
                          marginRight: constant.HEIGHT * 1,

                          fontSize: constant.responsiveFontSize(1.6),
                          opacity: 0.6,
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                        }}>
                        {'Add'}
                      </Text>
                    </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomWorkout);
