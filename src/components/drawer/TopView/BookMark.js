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
} from 'react-native';

// import Slider from '@react-native-community/slider';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {onBookMarkAction} from '../../../action/DashBoard_Action';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

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

class BookMark extends Component {
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
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.bookMark;

    var inputs = {
      type: 'list',
      member_id: this.props.signIn.member_id,
    };
    // console.warn(inputs);
    this.props
      .onBookMarkAction(head, url, methods.post, inputs)
      .then((response) => {
        // console.warn(response);

        if (response.status == 200) {
          // console.warn(response);
          // this.props.navigation.navigate('EquipmentList');
        }
      });
  }

  showEmptyListView = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: constant.HEIGHT * 25,
        }}>
        <Text style={{opacity: 0.5, fontSize: constant.responsiveFontSize(2)}}>
          No Records Found
        </Text>
      </View>
    );
  };

  _renderItem = ({item, index}) => {
    var image = '';
    var banner_image = item.image_name != undefined ? item.image_name : '';

    image = Url.baseUrl + Url.images + banner_image;
    return (
      <View>
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
              borderRadius: constant.HEIGHT * 2,
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
                source={constant.ICONBOOKMARKSELECT}
                style={{
                  width: constant.HEIGHT * 3,
                  height: constant.HEIGHT * 3,
                  marginBottom: constant.HEIGHT * 0.1,
                }}
              />
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
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: constant.HEIGHT * 13,
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
                  20m
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                height: constant.HEIGHT * 0.5,
                marginTop: constant.HEIGHT * 0.5,
                marginLeft: constant.HEIGHT * 6.5,
                borderRadius: constant.HEIGHT * 0.5,
                justifyContent: 'flex-end',
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
                      Bookmark
                    </Text>
                  </TouchableOpacity> */}
                  <BackButtonwithTitle
                    title={'Bookmark'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.goBack()}
                  />

                  <View style={{}}>
                    <FlatList
                      data={this.props.workout.bookMarkDetails}
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
      onBookMarkAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BookMark);
