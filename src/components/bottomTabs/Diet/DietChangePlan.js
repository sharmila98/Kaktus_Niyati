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

import {
  onDietDashboard,
  onChangePlanDiet,
  onChangePlanAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import moment from 'moment';
var head, url;
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

class DietChangePlan extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl + Url.dietPlanList + '/diet/' + this.props.signIn.member_id;

    this.props.onChangePlanDiet(head, url, methods.get).then((res) => {
      if (res.status == 200) {
      }
    });
  }

  _renderItem = ({item, index}) => {
    if (index == 0) {
      var image = Url.baseUrl + Url.images + item.banner_image.filename;

      return (
        <TouchableOpacity
        // onPress={() => this.onChangePlan(item)}
        >
          <View
            style={{
              marginTop: constant.HEIGHT * 3,
              marginLeft: constant.HEIGHT * 4,
              marginRight: constant.HEIGHT * 4,
              marginBottom: constant.HEIGHT * 1,
            }}>
            <View
              style={{
                elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                marginTop: constant.HEIGHT * 1,

                backgroundColor: '#ffeef8',
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
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={{
                    width: '20%',
                    height: constant.HEIGHT * 19,
                    marginVertical: constant.HEIGHT * 1,
                    alignSelf: 'center',
                    // tintColor: constant.THEME,
                  }}
                  resizeMode="cover"
                  source={{uri: image}}
                />
                <View
                  style={{
                    marginVertical: constant.HEIGHT * 2,
                    width: '70%',
                    marginHorizontal: constant.HEIGHT * 2,
                  }}>
                  <Text
                    style={{
                      color: '#5D5C5C',
                      fontSize: constant.responsiveFontSize(2),
                      marginTop: constant.HEIGHT * 0.5,
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.program_name}
                  </Text>
                  <Text
                    style={{
                      color: '#5D5C5C',
                      fontSize: constant.responsiveFontSize(1.5),
                      marginTop: constant.HEIGHT * 1,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.desc}
                  </Text>

                  <TouchableOpacity
                    onPress={() => this.onChangePlan(item)}
                    style={{
                      backgroundColor: '#F88565',
                      borderRadius: constant.HEIGHT * 1.5,
                      alignSelf: 'flex-end',
                      justifyContent: 'flex-end',
                      marginTop: constant.HEIGHT * 2,
                    }}>
                    <Text
                      style={{
                        color: constant.WHITE,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontFamily: constant.SUIFONT,

                        textAlign: 'center',
                        fontWeight: 'bold',
                        paddingVertical: constant.HEIGHT * 0.5,
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}>
                      Take it
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      marginTop: constant.HEIGHT * 1,
                      borderColor:
                        this.state.isOne == true
                          ? constant.THEME
                          : constant.BLACK,
                      backgroundColor: constant.WHITE,
                      borderWidth: constant.HEIGHT * 0.1,
                      width: constant.HEIGHT * 4,
                      height: constant.HEIGHT * 3,
                      borderRadius: constant.HEIGHT * 0.4,
                    }}
                    onPress={() => {
                      this.setState({
                        isOne: true,
                        isTwo: false,
                        isThree: false,
                        repeat: 1,
                      });
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontFamily: constant.SUIFONT,
                        fontSize: constant.responsiveFontSize(1.8),
                      }}>
                      X1
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginTop: constant.HEIGHT * 1,
                      borderColor:
                        this.state.isTwo == true
                          ? constant.THEME
                          : constant.BLACK,
                      marginLeft: constant.HEIGHT * 1,
                      backgroundColor: constant.WHITE,
                      borderWidth: constant.HEIGHT * 0.1,
                      width: constant.HEIGHT * 4,
                      height: constant.HEIGHT * 3,
                      borderRadius: constant.HEIGHT * 0.4,
                    }}
                    onPress={() => {
                      this.setState({
                        isOne: false,
                        isTwo: true,
                        isThree: false,
                        repeat: 2,
                      });
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontFamily: constant.SUIFONT,
                        fontSize: constant.responsiveFontSize(1.8),
                      }}>
                      X2
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginTop: constant.HEIGHT * 1,
                      marginLeft: constant.HEIGHT * 1,

                      backgroundColor: constant.WHITE,
                      borderColor:
                        this.state.isThree == true
                          ? constant.THEME
                          : constant.BLACK,
                      borderWidth: constant.HEIGHT * 0.1,
                      width: constant.HEIGHT * 4,
                      height: constant.HEIGHT * 3,
                      borderRadius: constant.HEIGHT * 0.4,
                    }}
                    onPress={() => {
                      this.setState({
                        isOne: false,
                        isTwo: false,
                        isThree: true,
                        repeat: 3,
                      });
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontFamily: constant.SUIFONT,
                        fontSize: constant.responsiveFontSize(1.8),
                      }}>
                      X3
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  showEmptyListView = () => {
    return (
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2),
            alignSelf: 'center',
            fontWeight: 'bold',
            marginTop: constant.HEIGHT * 15,
            fontFamily: constant.SUIFONT,
          }}>
          No data to display
        </Text>
      </View>
    );
  };

  showEmptyView() {
    return (
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2),
            alignSelf: 'center',
            fontWeight: 'bold',
            marginVertical: constant.HEIGHT * 15,
            opacity: 0.6,
            fontFamily: constant.SUIFONT,
          }}>
          No data to display
        </Text>
      </View>
    );
  }

  _renderItem1 = ({item, index}) => {
    if (index > 0) {
      var image = Url.baseUrl + Url.images + item.banner_image.filename;

      return (
        <TouchableOpacity
        // onPress={() => this.onChangePlan(item)}
        >
          <View
            style={{
              marginTop: constant.HEIGHT * 3,
              marginLeft: constant.HEIGHT * 1,
              marginRight: constant.HEIGHT * 1,
              marginBottom: constant.HEIGHT * 1,
            }}>
            <View
              style={{
                elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                marginTop: constant.HEIGHT * 1,

                backgroundColor: '#ffeef8',
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
              <View style={{flexDirection: 'column'}}>
                <Image
                  style={{
                    height: '20%',
                    width: constant.HEIGHT * 25,
                    marginVertical: constant.HEIGHT * 1,
                    alignSelf: 'center',
                    // tintColor: constant.THEME,
                  }}
                  resizeMode="cover"
                  source={{uri: image}}
                />
                <View
                  style={{
                    marginVertical: constant.HEIGHT * 2,
                    width: '70%',
                    marginHorizontal: constant.HEIGHT * 2,
                  }}>
                  <Text
                    style={{
                      color: '#5D5C5C',
                      fontSize: constant.responsiveFontSize(2),
                      marginTop: constant.HEIGHT * 0.5,
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                      width: constant.HEIGHT * 25,
                    }}>
                    {item.program_name}
                  </Text>
                  <Text
                    style={{
                      color: '#5D5C5C',
                      fontSize: constant.responsiveFontSize(1.5),
                      marginTop: constant.HEIGHT * 1,
                      fontFamily: constant.SUIFONT,
                      width: constant.HEIGHT * 25,
                      height: constant.HEIGHT * 27,
                    }}>
                    {item.desc}
                  </Text>

                  <TouchableOpacity
                    onPress={() => this.onChangePlan(item)}
                    style={{
                      backgroundColor: '#F88565',
                      borderRadius: constant.HEIGHT * 1.5,
                      alignSelf: 'flex-end',
                      justifyContent: 'flex-end',
                      marginTop: constant.HEIGHT * 2,
                    }}>
                    <Text
                      style={{
                        color: constant.WHITE,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontFamily: constant.SUIFONT,

                        textAlign: 'center',
                        fontWeight: 'bold',
                        paddingVertical: constant.HEIGHT * 0.5,
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}>
                      Take it
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
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
      plan_type: 'diet',
    };
    this.props
      .onChangePlanAction(head, url, methods.post, inputs)
      .then((resp) => {
        if (resp.status == 200) {
          head = {
            accept: 'application/json',
            Authorization: this.props.signIn.token,
          };

          var current_date = moment(new Date()).format('YYYY-MM-DD');

          url = Url.baseUrl + Url.dietDashboard + '/dashboard';

          var inputs = {
            data: {
              program_type: 'diet',
              date: current_date,
              // "weekstart": "string",
              // "weekend": "string",
              // "month": "string"
            },
            member_id: this.props.signIn.member_id,
            type: 'day',
          };

          this.props
            .onDietDashboard(head, url, methods.post, inputs)
            .then((res) => {
              if (res.status == 200) {
                this.props.navigation.navigate('Diet');
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
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />
            <View style={{flex: 0.94}}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  {/* <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Diet')}
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
                                            Recommended
                    </Text>
                                    </TouchableOpacity> */}
                  <BackButtonwithTitle
                    title={'Recommended'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.navigate('Diet')}
                  />

                  <View style={{}}>
                    {Object.keys(this.props.diet.dietPlanDetails).length !=
                    0 ? (
                      <View style={{}}>
                        <FlatList
                          data={this.props.diet.dietPlanDetails}
                          extraData={this.props}
                          // keyExtractor={this._keyExtractor}
                          renderItem={this._renderItem}
                          ListEmptyComponent={this.showEmptyListView}
                        />
                        <View
                          style={{
                            marginHorizontal: constant.HEIGHT * 3,
                          }}>
                          {Object.keys(this.props.diet.dietPlanDetails).length >
                          1 ? (
                            <Text
                              style={{
                                textAlign: 'left',
                                color: constant.BLACK,
                                opacity: 0.6,
                                fontWeight: 'bold',
                                fontSize: constant.responsiveFontSize(2),
                                fontFamily: constant.SUIFONT,
                              }}>
                              Popular Picks
                            </Text>
                          ) : null}

                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={this.props.diet.dietPlanDetails}
                            extraData={this.state}
                            // keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem1}
                            ListEmptyComponent={this.showEmptyListView}
                          />
                        </View>
                      </View>
                    ) : (
                      this.showEmptyView()
                    )}

                    <View
                      style={{
                        marginHorizontal: constant.HEIGHT * 3,
                        marginBottom: constant.HEIGHT * 5,
                      }}>
                      <Text
                        style={{
                          textAlign: 'left',
                          color: constant.BLACK,
                          opacity: 0.6,
                          fontWeight: 'bold',
                          fontSize: constant.responsiveFontSize(2),
                          fontFamily: constant.SUIFONT,
                        }}>
                        With the experts
                      </Text>

                      <View
                        style={{
                          elevation:
                            Platform.OS === 'ios'
                              ? null
                              : constant.HEIGHT * 0.5,
                          marginTop: constant.HEIGHT * 3,
                          backgroundColor: constant.WHITE,
                          borderRadius: constant.HEIGHT * 1.5,
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
                          }}>
                          <View style={{flex: 0.4}}>
                            <Image
                              resizeMode={'cover'}
                              style={{
                                width: constant.HEIGHT * 18,
                                height: constant.HEIGHT * 24,
                                borderTopLeftRadius: constant.HEIGHT * 1.5,
                                borderBottomLeftRadius: constant.HEIGHT * 1.5,
                              }}
                              source={constant.ICONDIETCOUCH}
                            />
                          </View>

                          <View
                            style={{
                              margin: constant.HEIGHT * 3,
                              flex: 0.6,
                              paddingLeft: constant.HEIGHT * 2,
                            }}>
                            <Text
                              style={{
                                color: '#5D5C5C',
                                fontSize: constant.responsiveFontSize(1.8),
                                fontFamily: constant.SUIFONT,

                                fontWeight: 'bold',
                              }}>
                              Want faster results?
                            </Text>
                            <Text
                              style={{
                                color: '#5D5C5C',
                                fontSize: constant.responsiveFontSize(1.6),
                                marginTop: constant.HEIGHT * 2,
                                fontFamily: constant.SUIFONT,
                              }}>
                              {
                                'Get Customised diet plan that helps your reach your goal quicker'
                              }
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('BookNowDiet')
                              }
                              style={{
                                backgroundColor: constant.THEME,
                                borderRadius: constant.HEIGHT * 1,
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                                marginTop: constant.HEIGHT * 2,
                              }}>
                              <Text
                                style={{
                                  color: constant.WHITE,
                                  fontSize: constant.responsiveFontSize(1.8),
                                  fontFamily: constant.SUIFONT,
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  paddingVertical: constant.HEIGHT * 0.5,
                                  paddingHorizontal: constant.HEIGHT * 2,
                                }}>
                                Book now
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
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
    diet: state.dashBoardReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onDietDashboard,
      onChangePlanDiet,
      onChangePlanAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DietChangePlan);
