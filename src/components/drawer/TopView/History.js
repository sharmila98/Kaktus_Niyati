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
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getLibraryAction,
  onHistoryAction,
  onDaySummaryAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

class History extends Component {
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
    var head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    var url = Url.baseUrl + Url.history + this.props.signIn.member_id;

    this.props.onHistoryAction(head, url, methods.get);
  }

  onViewMore(item) {
    var day = Number(item.day);

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
  }

  showEmptyListView = () => {
    return <View />;
  };

  _renderItem = ({item, index}) => {
    var image = Url.baseUrl + Url.images + item.image;

    return (
      <View>
        {/* <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: constant.HEIGHT * 0.1,
            marginLeft: constant.HEIGHT * 4,
            marginRight: constant.HEIGHT * 2,
            marginTop: constant.HEIGHT * 2,
            borderColor: '#707070',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily:
                Platform.OS === 'ios'
                  ? constant.REBOTOREGULAR
                  : constant.REBOTOREGULAR,
              fontSize: constant.responsiveFontSize(2),
              fontWeight: 'bold',
              opacity: 0.6,
              fontFamily: constant.SUIFONT,
            }}>
            24th May, 2020
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={constant.ICONCLOCK}
              style={{
                width: constant.HEIGHT * 1.6,
                height: constant.HEIGHT * 1.6,
                marginBottom: constant.HEIGHT * 0.1,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(1.4),
                alignSelf: 'center',
                marginLeft: constant.HEIGHT * 0.5,
                marginRight: constant.HEIGHT * 0.1,
                color: '#959191',
                fontFamily: constant.SUIFONT,
              }}>
              6:15 PM
            </Text>
          </View>
        </View> */}
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
                justifyContent: 'space-between',
                margin: constant.HEIGHT * 1.5,
              }}>
              <Text
                style={{
                  backgroundColor: '#BAB741',
                  borderRadius: constant.HEIGHT * 0.5,
                  paddingHorizontal: constant.HEIGHT * 0.5,
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.4),
                  color: constant.WHITE,
                  alignSelf: 'center',
                  fontFamily: constant.SUIFONT,
                }}>
                {item.level}
              </Text>
              <Image
                source={constant.IMGBOOKMARK}
                style={{
                  width: constant.HEIGHT * 2,
                  height: constant.HEIGHT * 2,
                  marginBottom: constant.HEIGHT * 0.1,
                }}
              />
            </View>
            <View
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
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(2),
                  color: constant.WHITE,
                  marginLeft: constant.HEIGHT * 0.5,
                  fontFamily: constant.SUIFONT,
                }}>
                356
              </Text>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.4),
                  color: constant.WHITE,
                  alignSelf: 'center',
                  marginTop: constant.HEIGHT * 0.5,
                  fontFamily: constant.SUIFONT,
                }}>
                /4512
              </Text>
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
                  {item.durations + ' m'}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                height: constant.HEIGHT * 0.5,
                marginTop: constant.HEIGHT * 0.5,
                marginLeft: constant.HEIGHT * 6.5,
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
            </View> */}
          </ImageBackground>
          <TouchableOpacity>
            <Text
              onPress={() => this.onViewMore(item)}
              style={{
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(1.8),
                color: constant.BLACK,
                alignSelf: 'flex-end',
                fontWeight: '900',
                fontFamily: constant.SUIFONT,
                textDecorationLine: 'underline',
              }}>
              {'View more'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
                  {/* <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
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
                      History
                    </Text>
                  </TouchableOpacity> */}

                  <BackButtonwithTitle
                    title={'History'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.goBack()}
                  />

                  <View style={{}}>
                    <FlatList
                      data={this.props.workout.historyDetails}
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
      onProgramDDAction,
      getLibraryAction,
      onHistoryAction,
      onDaySummaryAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(History);
