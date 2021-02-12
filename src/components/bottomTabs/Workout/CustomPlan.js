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
  Keyboard,
  RefreshControl,
} from 'react-native';

// import Slider from '@react-native-community/slider';
import RNPickerSelect from 'react-native-picker-select';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';
import Swipeout from '../../SwipeButton/index';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getLibraryAction,
  onProgramDetailAction,
} from '../../../action/DashBoard_Action';

import {
  createProgramAction,
  onCustomPlanListAction,
  deleteProgramAction,
} from '../../../action/CustomPlan_Action';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

var head,
  url = '';

var items = [
  {label: '1 Day', value: 1},
  {label: '2 Days', value: 2},
  {label: '3 Days', value: 3},
  {label: '4 Days', value: 4},
  {label: '5 Days', value: 5},
  {label: '6 Days', value: 6},
  {label: '7 Days', value: 7},
  {label: '8 Days', value: 8},
  {label: '9 Days', value: 9},
  {label: '10 Days', value: 10},
  {label: '11 Days', value: 11},
  {label: '12 Days', value: 12},
  {label: '13 Days', value: 13},
  {label: '14 Days', value: 14},
  {label: '15 Days', value: 15},
  {label: '16 Days', value: 16},
  {label: '17 Days', value: 17},
  {label: '18 Days', value: 18},
  {label: '19 Days', value: 19},
  {label: '20 Days', value: 20},
  {label: '21 Days', value: 21},
  {label: '22 Days', value: 22},
  {label: '23 Days', value: 23},
  {label: '24 Days', value: 24},
  {label: '25 Days', value: 25},
  {label: '26 Days', value: 26},
  {label: '27 Days', value: 27},
  {label: '28 Days', value: 28},
  {label: '29 Days', value: 29},
  {label: '30 Days', value: 30},
];
class CustomPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: constant.IMGWORKOUT,
      libarary: {},
      modalVisible: false,
      dayModalVisible: false,
      value: 1,
      days: '',
      program_name: '',
    };
  }

  componentDidMount() {}

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
      .onProgramDetailAction(head, url, methods.get, item)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('CustomProgramDetails', {
            screenName: 'Custom',
          });
        }
      });
  }

  onDeleteProgram(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.deleteProgram;

    var inputs = {
      id: item._id,
      member_id: this.props.signIn.member_id,
    };

    this.props
      .deleteProgramAction(head, url, methods.post, inputs)
      .then((res) => {
        if (res.status == 200) {
          head = {
            accept: 'application/json',
            Authorization: this.props.signIn.token,
          };

          url =
            Url.baseUrl +
            Url.customList +
            this.props.signIn.member_id +
            '/workout';

          this.props.onCustomPlanListAction(head, url, methods.get);
        }
      });
  }

  renderItem = ({item, index}) => {
    let swipeRightButton = [
      {
        text: 'Delete',
        src: constant.ICONDELETE,

        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          this.onDeleteProgram(item);
        },
        type: 'delete',
      },
    ];
    return (
      <Swipeout
        right={swipeRightButton}
        autoClose="true"
        backgroundColor="transparent">
        <TouchableOpacity onPress={() => this.onProgramDetails(item)}>
          <View
            style={{
              elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
              margin: constant.HEIGHT * 2,
              backgroundColor: '#ffeef8',
              // height: constant.HEIGHT * 25,
              // width: constant.HEIGHT * 47,
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
            <Image
              style={{
                width: constant.HEIGHT * 42,
                height: constant.HEIGHT * 20,
                marginTop: constant.HEIGHT * 2.5,
                alignSelf: 'center',
              }}
              source={constant.ICONCUSTOMPLAN}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: constant.HEIGHT * 2,
              }}>
              <Text
                style={{
                  marginRight: constant.HEIGHT * 1,
                  color: '#6D6A6A',
                  fontSize: constant.responsiveFontSize(2.4),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                  marginLeft: constant.HEIGHT * 3,
                  alignSelf: 'center',
                }}>
                {item.program_name}
              </Text>
              <View style={{marginRight: constant.HEIGHT * 2}}>
                <Text
                  style={{
                    marginRight: constant.HEIGHT * 1,
                    color: '#6D6A6A',
                    fontSize: constant.responsiveFontSize(1.8),
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                    marginTop: constant.HEIGHT * 1,
                    alignSelf: 'flex-end',
                  }}>
                  {item.durations + ' Days'}
                </Text>
                <Text
                  style={{
                    marginRight: constant.HEIGHT * 1,
                    color: '#6D6A6A',
                    fontSize: constant.responsiveFontSize(1.8),
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  {item.created_by != '' && item.created_by != undefined
                    ? 'Created by ' + item.created_by
                    : 'Created by you'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  onCreateProgram() {
    this.setState({modalVisible: false});
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.createProgram;

    var inputs = {
      name: this.state.program_name,
      member_id: this.props.signIn.member_id,
      days: this.state.days,
      type: 'workout',
    };

    if ((this.state.program_nam != '') & (this.state.days != '')) {
      this.props
        .createProgramAction(head, url, methods.post, inputs)
        .then((res) => {
          if (res.status == 200) {
            head = {
              accept: 'application/json',
              Authorization: this.props.signIn.token,
            };

            url =
              Url.baseUrl +
              Url.customList +
              this.props.signIn.member_id +
              '/workout';

            this.props.onCustomPlanListAction(head, url, methods.get);
          }
        });
    } else {
      constant.toastAlert('Please fill all Details', ToastAndroid.LONG);
    }
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
                  <RefreshControl refreshing={this.props.customPlan.homeLoad} />
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
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {'My Schedule'}
                    </Text>
                  </TouchableOpacity> */}
                  <BackButtonwithTitle
                    title={'My Schedule'}
                    underLine={false}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.navigate('Workout')}
                  />

                  <FlatList
                    data={this.props.customPlan.customPlanList}
                    extraData={this.state}
                    // keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.showEmptyListView}
                  />

                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 3,
                      flexDirection: 'row',
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
                    }}
                    onPress={() => this.setState({modalVisible: true})}>
                    <Image
                      source={constant.ICONADDBUTTON}
                      style={{
                        marginHorizontal: constant.HEIGHT * 1,
                        width: constant.HEIGHT * 2.2,
                        height: constant.HEIGHT * 2.15,
                        marginTop: constant.HEIGHT * 0.2,
                        tintColor: '#6D6A6A',
                      }}
                    />
                    <Text
                      style={{
                        marginRight: constant.HEIGHT * 1,
                        color: '#6D6A6A',
                        fontSize: constant.responsiveFontSize(1.8),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {'New Program'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                width: '85%',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  backgroundColor: constant.WHITE,
                  borderColor: '#6D6A6A',
                  borderWidth: constant.HEIGHT * 0.1,
                  borderRadius: constant.HEIGHT * 1,
                }}>
                <Text
                  style={{
                    padding: constant.HEIGHT * 3,
                    borderBottomWidth: constant.HEIGHT * 0.1,
                    color: constant.THEME,
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(1.8),
                    fontWeight: 'bold',
                  }}>
                  NEW PROGRAM
                </Text>
                <View
                  style={{flexDirection: 'row', margin: constant.HEIGHT * 2}}>
                  <TextInput
                    style={[
                      {
                        fontFamily: constant.SUIFONT,
                        fontSize: constant.responsiveFontSize(2.2),
                        color: '#888888',
                        letterSpacing: constant.HEIGHT * 0.1,
                        borderBottomWidth: constant.HEIGHT * 0.1,
                        flex: 0.6,
                      },
                    ]}
                    placeholder={'Program Name'}
                    returnKeyType={'next'}
                    numberOfLines={1}
                    renderToHardwareTextureAndroid
                    ref="name"
                    enablesReturnKeyAutomatically={true}
                    // autoFocus={true}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    autoCompleteType={'name'}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#888888"
                    onChangeText={(text) => this.setState({program_name: text})}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <View
                    style={{
                      borderColor: constant.THEME,
                      borderWidth: constant.HEIGHT * 0.2,
                      borderRadius: constant.HEIGHT * 0.5,
                      paddingLeft: constant.HEIGHT * 1,
                      marginLeft: constant.HEIGHT * 6,
                      marginTop: constant.HEIGHT * 2,
                      height: constant.HEIGHT * 6,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 0.45,
                    }}>
                    <RNPickerSelect
                      onValueChange={(value) => this.setState({days: value})}
                      items={items}
                      placeholder={{
                        label: 'Days',
                        value: null,
                        opacity: 0.5,
                        color: 'black',
                      }}
                      value={this.state.days}
                      style={{
                        inputAndroid: {
                          fontSize: 16,
                          // borderWidth: constant.HEIGHT * 0.1,
                          // borderColor: constant.THEME,
                          color: 'black',
                          width: constant.HEIGHT * 15,
                        },
                      }}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: constant.HEIGHT * 3,
                    borderTopWidth: constant.HEIGHT * 0.1,
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: constant.HEIGHT * 2,
                      paddingVertical: constant.HEIGHT * 2,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      flex: 0.5,
                    }}
                    onPress={() => this.setState({modalVisible: false})}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),

                        color: '#6D6A6A',
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                        textAlign: 'center',
                      }}>
                      CANCEL
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      paddingHorizontal: constant.HEIGHT * 2,
                      paddingVertical: constant.HEIGHT * 2,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      flex: 0.5,
                      backgroundColor: constant.THEME,
                      borderBottomRightRadius: constant.HEIGHT * 1,
                    }}
                    onPress={() => this.onCreateProgram()}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.8),
                        textAlign: 'center',
                        color: constant.WHITE,
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    workout: state.dashBoardReducer,
    customPlan: state.customPlanReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onChangePlanAction,
      onProgramDDAction,
      getLibraryAction,
      createProgramAction,
      onProgramDetailAction,
      onCustomPlanListAction,
      deleteProgramAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(CustomPlan);
