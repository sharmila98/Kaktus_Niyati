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
} from 'react-native';
import moment from 'moment';
import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getDietLibraryAction,
  onProgramDetailAction,
  onDietDashboard,
  customItemCountSession,
  DietCustomPlanDayWise,
} from '../../../action/DashBoard_Action';
import Loader from './../../commons/Loader';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {addCustomDayDiet} from '../../../action/CustomPlan_Action';
var head, url;

class CustomDiet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      program_name: '',
      program_id: '',
      Early_morning_edit: false,
      Breakfast_edit: false,
      Mid_morning_edit: false,
      Lunch_edit: false,
      Snacks_edit: false,
      Dinner_edit: false,
      Late_night_edit: false,
      water_edit: false,
      program_day_count: 1,
      programDayList: [],
      selectedDay: 1,
      loader: false,
    };
  }

  componentDidMount() {
    
    if(this.props.workout.waterDietItem != undefined || this.props.workout.waterDietItem != null){
      if(this.props.workout.waterDietItem.length != 0){
        delete this.props.workout.waterDietItem[0].taken;
      }
    }
    
    this.setState(
      {program_day_count: this.props.route.params.program_day},
      () => {
        for (let i = 0; i < this.state.program_day_count; i++) {
          this.state.programDayList.push(i + 1);
        }
      },
    );

    this.setState({program_name: this.props.route.params.program_name});
    this.setState({program_id: this.props.route.params.program_id}, () => {
      this.getDayProgram('1');
    });
  }

  getDayProgram(day) {
    this.setState({loader: true});
    this.setState({selectedDay: day});
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
      this.state.program_id +
      '/' +
      day;

    this.props.DietCustomPlanDayWise(head, url, methods.get).then((resp) => {
      if (resp.status == 200) {
        this.setState({loader: false});
      }
    });
  }

  changeEdit(session) {
    if (session == 'Early Morning') {
      if (this.state.Early_morning_edit) {
        this.setState({Early_morning_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: true});
        this.setState({Breakfast_edit: false});
        this.setState({Mid_morning_edit: false});
        this.setState({Lunch_edit: false});
        this.setState({Snacks_edit: false});
        this.setState({Dinner_edit: false});
        this.setState({Late_night_edit: false});
        this.setState({water_edit: false});
      }
    } else if (session == 'Breakfast') {
      if (this.state.Breakfast_edit) {
        this.setState({Breakfast_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: false});
        this.setState({Breakfast_edit: true});
        this.setState({Mid_morning_edit: false});
        this.setState({Lunch_edit: false});
        this.setState({Snacks_edit: false});
        this.setState({Dinner_edit: false});
        this.setState({Late_night_edit: false});
        this.setState({water_edit: false});
      }
    } else if (session == 'Mid morning') {
      if (this.state.Mid_morning_edit) {
        this.setState({Mid_morning_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: false});
        this.setState({Breakfast_edit: false});
        this.setState({Mid_morning_edit: true});
        this.setState({Lunch_edit: false});
        this.setState({Snacks_edit: false});
        this.setState({Dinner_edit: false});
        this.setState({Late_night_edit: false});
        this.setState({water_edit: false});
      }
    } else if (session == 'Lunch') {
      if (this.state.Lunch_edit) {
        this.setState({Lunch_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: false});
        this.setState({Breakfast_edit: false});
        this.setState({Mid_morning_edit: false});
        this.setState({Lunch_edit: true});
        this.setState({Snacks_edit: false});
        this.setState({Dinner_edit: false});
        this.setState({Late_night_edit: false});
        this.setState({water_edit: false});
      }
    } else if (session == 'Snacks') {
      if (this.state.Snacks_edit) {
        this.setState({Snacks_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: false});
        this.setState({Breakfast_edit: false});
        this.setState({Mid_morning_edit: false});
        this.setState({Lunch_edit: false});
        this.setState({Snacks_edit: true});
        this.setState({Dinner_edit: false});
        this.setState({Late_night_edit: false});
        this.setState({water_edit: false});
      }
    } else if (session == 'Dinner') {
      if (this.state.Dinner_edit) {
        this.setState({Dinner_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: false});
        this.setState({Breakfast_edit: false});
        this.setState({Mid_morning_edit: false});
        this.setState({Lunch_edit: false});
        this.setState({Snacks_edit: false});
        this.setState({Dinner_edit: true});
        this.setState({Late_night_edit: false});
        this.setState({water_edit: false});
      }
    } else if (session == 'Late night') {
      if (this.state.Late_night_edit) {
        this.setState({Late_night_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: false});
        this.setState({Breakfast_edit: false});
        this.setState({Mid_morning_edit: false});
        this.setState({Lunch_edit: false});
        this.setState({Snacks_edit: false});
        this.setState({Dinner_edit: false});
        this.setState({Late_night_edit: true});
        this.setState({water_edit: false});
      }
    } else if (session == 'Water') {
      if (this.state.water_edit) {
        this.setState({water_edit: false});
        this.addDayProgram();
      } else {
        this.setState({Early_morning_edit: false});
        this.setState({Breakfast_edit: false});
        this.setState({Mid_morning_edit: false});
        this.setState({Lunch_edit: false});
        this.setState({Snacks_edit: false});
        this.setState({Dinner_edit: false});
        this.setState({Late_night_edit: false});
        this.setState({water_edit: true});
      }
    }
  }

  MakeCurrentPlan() {
    this.setState({loader: true});
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.changePlan;

    var inputs = {
      program_id: this.state.program_id,
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
                this.setState({loader: false});
                this.props.navigation.navigate('Diet');
              }
            });
        }
      });
  }

  addDayProgram() {
    var waterLibrary = [];
    if(this.props.workout.waterDietItem != undefined || this.props.workout.waterDietItem != null){
      if(this.props.workout.waterDietItem.length != 0){
        waterLibrary = this.props.workout.waterDietItem;
      }}
    this.setState({loader: true});
    var dietData = [
      {
        'Early morning': {
          library: this.props.workout.earlyMorDietItemList,
          timing: '6 AM to 6.30 AM',
        },
        Breakfast: {
          library: this.props.workout.breakFastDietItemList,
          timing: '7.30 AM to 8.30 AM',
        },
        'Mid morning': {
          library: this.props.workout.midMorDietItemList,
          timing: '11 AM to 11.30 AM',
        },
        Lunch: {
          library: this.props.workout.lunchDietItemList,
          timing: '12.30 PM to 2 PM',
        },
        Snacks: {
          library: this.props.workout.snacksDietItemList,
          timing: '4 PM to 4.30 PM',
        },
        Dinner: {
          library: this.props.workout.dinnerDietItemList,
          timing: '7 PM to 7.30 PM',
        },
        'Late night': {
          library: this.props.workout.lateNightDietItemList,
          timing: '9.30 PM to 10.30 PM',
        },
        Water: {
          library: waterLibrary,
          timing: '',
        },
      },
    ];
    // console.error(JSON.stringify(diet_data))

    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.addEveryDayProgram;

    var inputs = {
      program_id: this.state.program_id,
      member_id: this.props.signIn.member_id,
      day: this.state.selectedDay,
      diet_data: dietData,
      cloned_from: 0,
      type: 'diet',
    };

    this.props
      .addCustomDayDiet(head, url, methods.post, inputs)
      .then((response) => {
        if (response.status == 200) {
          this.setState({loader: false});
        }
      });
  }

  changeInput(symbol, count, session, item, index) {
    var newcount = 0;
    if (symbol == 'plus') {
      newcount = count + 1;
      this.props.customItemCountSession(newcount, session, item, index);
    } else {
      if (count != 0) {
        newcount = count - 1;
        this.props.customItemCountSession(newcount, session, item, index);
      }
    }
  }

  _renderItem(list, value, type) {
    return list.map((item, index) => {
      var image = Url.baseUrl + Url.images + item.ref_image.filename;
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: constant.HEIGHT * 0.5,
            marginHorizontal: constant.HEIGHT * 1,
          }}>
          <TouchableOpacity
            // onPress={() =>
            //   this.props.navigation.navigate('DietItemView', {
            //      item: item,
            //      image: image,
            //   })}
            style={{
              flex: 0.15,

              marginRight: constant.HEIGHT * 2,
            }}>
            <Image
              style={{
                width: constant.HEIGHT * 9,
                height: constant.HEIGHT * 9,
                alignSelf: 'center',
                borderRadius:10,
                borderWidth: 1,
                borderColor: '#fff'
              }}
              // resizeMode="contain"
              source={{uri: image}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() =>
            //   this.props.navigation.navigate('DietItemView', {
            //      item: item,
            //      image: image,
            //   })}
            style={{
              // marginVertical: constant.HEIGHT * 2,
              flex: 0.65,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(2),
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
              }}>
              {item.library_name}
            </Text>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(1.5),
                fontFamily: constant.SUIFONT,
              }}>
              {item.quantity * item.count + '' + item.quantity_type}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 0.25,
              justifyContent: 'center',
              marginHorizontal: constant.HEIGHT * 1,
            }}>
            {value ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: constant.HEIGHT * 2,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingHorizontal: constant.HEIGHT * 1.5,
                    marginTop: constant.HEIGHT * 0.5,
                  }}
                  onPress={() => {
                    this.changeInput('minus', item.count, type, item, index);
                  }}>
                  <Image
                    source={constant.ICONMINUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      paddingHorizontal: constant.HEIGHT * 1,
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        color: '#000000',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {item.count}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingHorizontal: constant.HEIGHT * 1.5,
                    marginTop: constant.HEIGHT * 0.5,
                  }}
                  onPress={() => {
                    this.changeInput('plus', item.count, type, item, index);
                  }}>
                  <Image
                    source={constant.ICONPLUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: constant.HEIGHT * 2,
                }}>
                <Text
                  style={{
                    color: '#5D5C5C',
                    textAlign: 'center',
                    fontSize: constant.responsiveFontSize(1.6),
                    //   marginRight: constant.HEIGHT * 1.5,
                    fontFamily: constant.SUIFONT,
                  }}>
                  {item.cal_per_rep * item.count + ' Cals'}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    });
  }

  renderWater(count) {
    if (count <= 7) {
      var imgCount = [];

      for (let i = 0; i < count; i++) {

        imgCount.push(
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
        )
      }

      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

          {imgCount}

        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />

          <Text
            style={{
              fontSize: constant.responsiveFontSize(1.6),
              alignSelf: 'flex-end',
              // fontWeight: 'bold',
              color: '#000000',
              fontFamily: constant.SUIFONT,
            }}>
            {' +'+ (count-5) + ' glass'}
                    </Text>

        </View>
      )
    }


  }

  renderWaterObj(list, value, type) {
    
    return list.map((i, j) => {
     
      return (
        <View style={{ flexDirection: 'row', flex: 1 }}>

          <TouchableOpacity
            style={{ flex: 0.7, justifyContent: 'center' }}>

            {this.renderWater(i.count)}

          </TouchableOpacity>

          <View
            style={{
              marginVertical: constant.HEIGHT * 1,
              flex: 0.3,
              alignContent: 'flex-end',
              justifyContent: 'flex-end',
              marginHorizontal: constant.HEIGHT * 1,
            }}>
            {value ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: constant.HEIGHT * 2,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingVertical: constant.HEIGHT * 2,
                    paddingHorizontal: constant.HEIGHT * 1,
                  }}
                  onPress={() => {
                    this.changeInput('minus', i.count, type, i, j);
                  }}
                  >
                  <Image
                    source={constant.ICONMINUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      paddingVertical: constant.HEIGHT * 1.5,
                      paddingHorizontal: constant.HEIGHT * 1,
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        color: '#000000',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {i.count}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingVertical: constant.HEIGHT * 2,
                    paddingHorizontal: constant.HEIGHT * 1,
                  }}
                  onPress={() => {
                    this.changeInput('plus', i.count, type, i, j);
                  }}
                  >
                  <Image
                    source={constant.ICONPLUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingVertical: constant.HEIGHT * 2,
                  }}>
                  <Text
                    style={{
                      color: '#5D5C5C',
                      textAlign: 'right',
                      fontSize: constant.responsiveFontSize(1.6),
                      // marginRight: constant.HEIGHT * 1.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {i.count + ' glass'}
                  </Text>

                </View>
              )}
          </View>
        </View>
      );
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}
          {this.state.loader == false ? (
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />
            <View style={{flex: 0}}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginTop: constant.HEIGHT * 2,
                    marginBottom: constant.HEIGHT * 1,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('DietCustomPlan')
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
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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
                        {this.state.program_name}
                      </Text>

                      <TouchableOpacity onPress={() => this.MakeCurrentPlan()}>
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
                          {'Make it Current Plan'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginHorizontal: constant.HEIGHT * 1,
                      paddingBottom: constant.HEIGHT * 10,
                    }}>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={this.state.programDayList}
                      extraData={this.props}
                      renderItem={this._renderItem1}
                      ListEmptyComponent={this.showEmptyListView}
                    />
                      {this.props.workout.waterDietItem != undefined || this.props.workout.waterDietItem != null ?
                        this.props.workout.waterDietItem.length != 0 ?
                          this.renderSession(
                            'Water',
                            '',
                            this.props.workout.waterDietItem,
                            this.state.water_edit,
                          )
                          : null
                        : null}                    
                    {this.renderSession(
                      'Early Morning',
                      '6 AM to 6.30 AM',
                      this.props.workout.earlyMorDietItemList,
                      this.state.Early_morning_edit,
                    )}
                    {this.renderSession(
                      'Breakfast',
                      '7.30 AM to 8.30 AM',
                      this.props.workout.breakFastDietItemList,
                      this.state.Breakfast_edit,
                    )}
                    {this.renderSession(
                      'Mid morning',
                      '11 AM to 11.30 AM',
                      this.props.workout.midMorDietItemList,
                      this.state.Mid_morning_edit,
                    )}
                    {this.renderSession(
                      'Lunch',
                      '12.30 PM to 2 PM',
                      this.props.workout.lunchDietItemList,
                      this.state.Lunch_edit,
                    )}
                    {this.renderSession(
                      'Snacks',
                      '4 PM to 4.30 PM',
                      this.props.workout.snacksDietItemList,
                      this.state.Snacks_edit,
                    )}
                    {this.renderSession(
                      'Dinner',
                      '7 PM to 7.30 PM',
                      this.props.workout.dinnerDietItemList,
                      this.state.Dinner_edit,
                    )}
                    {this.renderSession(
                      'Late night',
                      '9.30 PM to 10.30 PM',
                      this.props.workout.lateNightDietItemList,
                      this.state.Late_night_edit,
                    )}
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

  _renderItem1 = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginVertical: constant.HEIGHT * 2,
          height: constant.HEIGHT * 7,
        }}>
        <TouchableOpacity
          style={{
            paddingVertical: constant.HEIGHT * 1,
            paddingHorizontal: constant.HEIGHT * 1.5,
            marginRight: constant.HEIGHT * 0.5,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDay == item ? '#FFB6C1' : constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          onPress={() => {
            this.getDayProgram(item);
          }}>
          <Text
            style={{
              color:
                this.state.selectedDay == item ? '#6830D0' : constant.BLACK,
              alignSelf: 'center',
              fontFamily: constant.SUIFONT,
            }}>
            {'Day'}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              color:
                this.state.selectedDay == item ? '#6830D0' : constant.BLACK,
              fontFamily: constant.SUIFONT,
            }}>
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderSession(session, timing, list, value) {
    var listvalue = list == undefined ? [] : list;
    return (
      <TouchableOpacity
        style={{
          elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
          marginVertical: constant.HEIGHT * 1,
          marginHorizontal: constant.HEIGHT * 1,
          paddingLeft: constant.HEIGHT * 0.6,
          backgroundColor: constant.WHITE,
          borderRadius: constant.HEIGHT * 1.5,
          borderWidth: constant.HEIGHT * 0.1,
          borderColor: constant.GREYLIGHT,
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
            flex: 1,
            flexDirection: 'row',
            borderBottomWidth: constant.HEIGHT * 0.1,
            borderColor: constant.GREYLIGHT,
            paddingVertical: constant.HEIGHT * 1,
          }}>
          <View
            style={{
              marginHorizontal: constant.HEIGHT * 1,
              flex: 0.3,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: constant.responsiveFontSize(1.4),
                opacity: 0.6,
              }}>
              {session}
            </Text>
          </View>
          <View style={{flex: 0.4, justifyContent: 'center'}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: constant.responsiveFontSize(1.4),
                marginTop: constant.HEIGHT * 0.5,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: constant.SUIFONT,
                opacity: 0.6,
              }}>
              {timing}
            </Text>
          </View>
          {listvalue.length != 0 ? (
            <TouchableOpacity
              onPress={() => this.changeEdit(session)}
              style={{
                flex: 0.3,
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingRight: constant.HEIGHT * 2.5,
              }}>
              {value ? (
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(1.6),
                    fontWeight: 'bold',
                    opacity: 0.6,
                    fontFamily: constant.SUIFONT,
                  }}>
                  Done
                </Text>
              ) : (
                <Image
                  resizeMode={'contain'}
                  style={{
                    width: constant.HEIGHT * 2,
                    height: constant.HEIGHT * 2,
                    tintColor: constant.GREY,
                  }}
                  source={constant.ICONEDIT}
                />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
        {session != 'Water' ?
        <View>
        <TouchableOpacity
          style={{marginHorizontal: constant.HEIGHT * 1}}
          onPress={() =>
            this.props.navigation.navigate('CustomDietSingleDay', {
              session: session,
              program_id: this.state.program_id,
              selectedDay: this.state.selectedDay,
            })
          }>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode={'contain'}
              source={constant.ICONADDBUTTON}
              style={{
                width: constant.HEIGHT * 2.2,
                height: constant.HEIGHT * 2.15,
                marginTop: constant.HEIGHT * 2,
              }}
            />
            <Text
              style={{
                marginTop: constant.HEIGHT * 1.6,
                marginLeft: constant.HEIGHT * 1,
                marginBottom: constant.HEIGHT * 1,
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(2),
                opacity: 0.6,
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
              }}>
              {'Add Item'}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            marginBottom: constant.HEIGHT * 1,
          }}>
          {this._renderItem(listvalue, value, session)}
        </View>
        </View>
        : this.renderWaterObj(listvalue, value, session)}
      </TouchableOpacity>
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
      getDietLibraryAction,
      onProgramDetailAction,
      onDietDashboard,
      customItemCountSession,
      addCustomDayDiet,
      DietCustomPlanDayWise,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(CustomDiet);
