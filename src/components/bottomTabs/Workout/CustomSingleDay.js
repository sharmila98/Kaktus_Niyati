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
  Modal,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';

// import Slider from '@react-native-community/slider';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';
import RNPickerSelect from 'react-native-picker-select';
import DropDown from '../../commons/DropDown';
// import Swipeout from 'react-native-swipeout';

import Swipeout from '../../SwipeButton/index';

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  onSingleLibraryAction,
  onHistoryAction,
  getLibraryAction,
  onProgramDetailAction,
} from '../../../action/DashBoard_Action';

import {addWorkoutAction} from '../../../action/CustomPlan_Action';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

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

var items = [
  {
    id: 1,
    name: 'JavaScript',
  },
  {
    id: 2,
    name: 'Java',
  },
  {
    id: 3,
    name: 'Ruby',
  },
  {
    id: 4,
    name: 'React Native',
  },
  {
    id: 5,
    name: 'PHP',
  },
  {
    id: 6,
    name: 'Python',
  },
  {
    id: 7,
    name: 'Go',
  },
  {
    id: 8,
    name: 'Swift',
  },
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

class CustomSingleDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: constant.IMGWORKOUT,
      item: {},
      index: '',
      days: '',
      library_name: [],
      count: 0,
      rest: 0,
      searchText: '',
      name: '',
      plus: '',
      minus: '',
      isOne: false,
      isTwo: false,
      isThree: false,
      isAdd: false,
      type: 'Sec',
      repeat: '',
      library_data: [],
      itemPressed: '',
      item_id: 0,
      modalVisible: false,
      library_item: '',
      workoutLibraryName: '',
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

    this.setState({workoutLibraryName: this.props.workout.workoutLibraryName});

    if (
      this.props.workout.workoutSingleDayDetails != undefined &&
      this.props.workout.workoutSingleDayDetails.length > 0
    ) {
      // this.props.workout.workoutSingleDayDetails.filter((item, index) => {
      //   // this.setState(
      //   //   {
      //   //     library_name: [
      //   //       ...this.state.library_name,
      //   //       {label: item.library_name, value: item.library_name},
      //   //     ],
      //   //   },
      //   //   () => console.error(this.state.library_name),
      //   // );
      // });
      this.onAddLibraryData();
    }
  }

  searchFilter(text) {
    this.setState({searchText: text});
    const newData = this.props.workout.workoutLibraryName.filter((item) => {
      const itemData = item.value.toUpperCase();
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({workoutLibraryName: newData});

    // console.error(newData);
  }

  onAddLibraryData() {
    var data = [];
    this.props.workout.workoutSingleDayDetails.filter((item, index) => {
      data.push(item.library_data);
      this.setState(
        {
          library_data: data,
        },
        () => {
          // console.error(
          //   this.state.library_data.length,
          //   this.props.workout.workoutSingleDayDetails.length,
          // );
        },
      );
    });
  }

  onEditProgram(item_data) {
    // this.setState({
    //   itemPressed: item,
    //   name: item.librarydata[0].library_name,
    //   type: item.library_data.type,
    //   count: item.library_data.count,
    //   repeat: item.library_data.times_to_repeat,
    // });

    var library_data = this.state.library_data.filter((item, index) => {
      return item != item_data.library_data;
    });

    // console.error(library_data);

    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.addEveryDayProgram;
    var library_id = '';
    this.props.workout.workoutLibraryDetails.filter((item, index) => {
      if (item.library_name == this.state.name) {
        library_id = item._id;
      }
    });

    var inputs = {
      member_id: this.props.signIn.member_id,
      program_id: this.props.workout.singleDayProgram._id,
      day: this.props.workout.workoutDay,
      library_data: library_data.concat({
        library_id: library_id,
        type: this.state.type,
        count: parseInt(this.state.count),
        rest: parseInt(this.state.rest),
        times_to_repeat: this.state.repeat,
      }),
      cloned_from: 0,
      type: 'workout',
    };

    this.props
      .addWorkoutAction(head, url, methods.post, inputs)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            count: 0,
            name: '',
            plus: '',
            minus: '',
            isOne: false,
            isTwo: false,
            isThree: false,
            isAdd: false,
            type: '',
            repeat: '',
          });
          this.onDayDetails();
        }
      });
  }

  onDeleteProgram(item_data) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.addEveryDayProgram;

    var library_data = this.state.library_data.filter((item, index) => {
      return item != item_data.library_data;
      // console.error(item.library_data != item_data)
    });

    // console.error(library_data);

    var inputs = {
      member_id: this.props.signIn.member_id,
      program_id: this.props.workout.singleDayProgram._id,
      day: this.props.workout.workoutDay,
      library_data: library_data,
      cloned_from: 0,
      type: 'workout',
    };

    this.props
      .addWorkoutAction(head, url, methods.post, inputs)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            count: 0,
            name: '',
            plus: '',
            minus: '',
            isOne: false,
            isTwo: false,
            isThree: false,
            isAdd: false,
            type: '',
            repeat: '',
          });
          this.onDayDetails();
        }
      });
  }

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

  _renderName = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginVertical: constant.HEIGHT * 1,
          backgroundColor: constant.WHITE,
        }}
        onPress={() => this.setState({modalVisible: false, name: item.value})}>
        <Text
          style={{
            fontFamily: constant.SUIFONT,
            fontSize: constant.respFontSize(1),
          }}>
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };

  _renderItem = ({item, index}) => {
    if (item.librarydata.length > 0) {
      var image =
        item.librarydata[0].ref_image != undefined
          ? Url.baseUrl + Url.images + item.librarydata[0].ref_image.filename
          : '';

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

      let swipeLeftButton = [
        {
          text: 'Delete',
          src: constant.ICON_EDIT,
          underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
          onPress: () => {
            this.setState({
              itemPressed: item,
              type: item.library_data.type,
              count: parseInt(item.library_data.count),
              rest: item.library_data.rest,
              repeat: item.library_data.times_to_repeat,
              name: item.librarydata[0].library_name,
            });
          },
          type: 'primary',
        },
      ];

      return this.state.itemPressed != item ? (
        <Swipeout
          right={swipeRightButton}
          left={swipeLeftButton}
          autoClose="true"
          backgroundColor="transparent">
          <TouchableOpacity onPress={() => this.onSingleLibrary(item)}>
            <View
              style={{
                elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                marginVertical: constant.HEIGHT * 0.5,
                padding: constant.HEIGHT * 1,
                height: constant.HEIGHT * 13,
                marginHorizontal: constant.HEIGHT * 1.5,
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
        </Swipeout>
      ) : (
        <View
          style={{
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            marginVertical: constant.HEIGHT * 0.5,
            padding: constant.HEIGHT * 1,
            marginHorizontal: constant.HEIGHT * 1.5,
            backgroundColor: constant.WHITE,
            borderColor: constant.BLACK,
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
              marginHorizontal: constant.HEIGHT * 1.5,
            }}>
            <TouchableOpacity
              style={{
                borderColor: '#707070',
                borderWidth: constant.HEIGHT * 0.1,
                borderRadius: constant.HEIGHT * 0.5,
                paddingLeft: constant.HEIGHT * 1,
                marginTop: constant.HEIGHT * 2,
                height: constant.HEIGHT * 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => this.setState({modalVisible: true})}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(1.8),
                  color: '#6D6A6A',
                  fontFamily: constant.SUIFONT,
                  alignSelf: 'center',
                }}>
                {this.state.name}
              </Text>
              <Image
                source={constant.ICONDOWNARROW}
                style={{
                  marginHorizontal: constant.HEIGHT * 1,
                  width: constant.HEIGHT * 1.5,
                  height: constant.HEIGHT * 1.5,
                  alignSelf: 'center',
                  tintColor: '#6D6A6A',
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  borderColor: '#707070',
                  // borderWidth: constant.HEIGHT * 0.1,
                  borderRadius: constant.HEIGHT * 0.5,
                  padding: constant.HEIGHT * 0.5,
                  marginTop: constant.HEIGHT * 2,
                }}>
                <Text>Sec</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                    marginTop: constant.HEIGHT * 2,

                    backgroundColor: constant.WHITE,
                    borderColor: constant.WHITE,
                    borderWidth: constant.HEIGHT * 0.1,
                    width: constant.HEIGHT * 4,
                    height: constant.HEIGHT * 3,
                    borderRadius: constant.HEIGHT * 0.4,
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
                  }}
                  onPress={() => {
                    if (this.state.count > 0) {
                      var count = parseInt(this.state.count) - 1;
                      this.setState({
                        count: count + '',
                      });
                    }
                  }}>
                  <Image
                    source={constant.ICONMINUS}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 2.5,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 0.2,
                    }}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[
                    {
                      fontFamily: constant.SUIFONT,
                      fontSize: constant.responsiveFontSize(1.8),
                      color: constant.THEME,
                      letterSpacing: constant.HEIGHT * 0.1,
                      marginLeft: constant.HEIGHT * 1,
                      fontWeight: 'bold',
                      alignItems: 'center',
                    },
                  ]}
                  placeholder={'0'}
                  value={this.state.count}
                  returnKeyType={'done'}
                  numberOfLines={1}
                  renderToHardwareTextureAndroid
                  enablesReturnKeyAutomatically={true}
                  // autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#888888"
                  onChangeText={(text) => {
                    var count = parseInt(text);
                    this.setState({
                      count: count,
                    });
                  }}
                  onSubmitEditing={() => {}}
                />
                <TouchableOpacity
                  style={{
                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                    marginTop: constant.HEIGHT * 2,

                    backgroundColor: constant.WHITE,
                    borderColor: constant.WHITE,
                    borderWidth: constant.HEIGHT * 0.1,
                    width: constant.HEIGHT * 4,
                    height: constant.HEIGHT * 3,
                    borderRadius: constant.HEIGHT * 0.4,
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
                  }}
                  onPress={() => {
                    // console.error(
                    //   parseInt(this.state.count) + 1,
                    // );
                    if (this.state.count <= 60) {
                      var count = parseInt(this.state.count) + 1;
                      this.setState({
                        count: count + '',
                      });
                    }
                  }}>
                  <Image
                    source={constant.ICONPLUS}
                    style={{
                      width: constant.HEIGHT * 1.7,
                      height: constant.HEIGHT * 1.5,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 0.5,
                    }}
                  />
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
                      this.state.repeat == 1 ? constant.THEME : constant.BLACK,
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
                      this.state.repeat == 2 ? constant.THEME : constant.BLACK,
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
                      this.state.repeat == 3 ? constant.THEME : constant.BLACK,
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
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  borderColor: '#707070',
                  // borderWidth: constant.HEIGHT * 0.1,
                  borderRadius: constant.HEIGHT * 0.5,
                  padding: constant.HEIGHT * 0.5,
                  marginTop: constant.HEIGHT * 2,
                }}>
                <Text>Rest Time</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginLeft: constant.HEIGHT * 2,
                }}>
                <TouchableOpacity
                  style={{
                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                    marginTop: constant.HEIGHT * 2,

                    backgroundColor: constant.WHITE,
                    borderColor: constant.WHITE,
                    borderWidth: constant.HEIGHT * 0.1,
                    width: constant.HEIGHT * 4,
                    height: constant.HEIGHT * 3,
                    borderRadius: constant.HEIGHT * 0.4,
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
                  }}
                  onPress={() => {
                    if (this.state.rest > 0) {
                      var rest = parseInt(this.state.rest) - 1;
                      this.setState({
                        rest: rest + '',
                      });
                    }
                  }}>
                  <Image
                    source={constant.ICONMINUS}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 2.5,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 0.2,
                    }}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[
                    {
                      fontFamily: constant.SUIFONT,
                      fontSize: constant.responsiveFontSize(1.8),
                      color: constant.THEME,
                      letterSpacing: constant.HEIGHT * 0.1,
                      marginLeft: constant.HEIGHT * 1,
                      fontWeight: 'bold',
                      alignItems: 'center',
                    },
                  ]}
                  placeholder={'0'}
                  value={this.state.rest}
                  maxLength={3}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  numberOfLines={1}
                  renderToHardwareTextureAndroid
                  enablesReturnKeyAutomatically={true}
                  // autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#888888"
                  onChangeText={(text) => {
                    var rest = parseInt(text);
                    this.setState({
                      rest: rest,
                    });
                  }}
                  onSubmitEditing={() => {}}
                />
                <TouchableOpacity
                  style={{
                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                    marginTop: constant.HEIGHT * 2,

                    backgroundColor: constant.WHITE,
                    borderColor: constant.WHITE,
                    borderWidth: constant.HEIGHT * 0.1,
                    width: constant.HEIGHT * 4,
                    height: constant.HEIGHT * 3,
                    borderRadius: constant.HEIGHT * 0.4,
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
                  }}
                  onPress={() => {
                    // console.error(
                    //   parseInt(this.state.count) + 1,
                    // );
                    if (this.state.rest <= 60) {
                      var rest = parseInt(this.state.rest) + 1;
                      this.setState({
                        rest: rest + '',
                      });
                    }
                  }}>
                  <Image
                    source={constant.ICONPLUS}
                    style={{
                      width: constant.HEIGHT * 1.7,
                      height: constant.HEIGHT * 1.5,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 0.5,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                  marginTop: constant.HEIGHT * 1,
                  backgroundColor: constant.THEME,
                  borderRadius: constant.HEIGHT * 0.5,
                  padding: constant.HEIGHT * 1,
                }}
                onPress={() => {
                  this.setState({
                    itemPressed: '',
                    name: '',
                    type: '',
                    count: '',
                    repeat: '',
                  });
                }}>
                <Text
                  style={{
                    color: constant.WHITE,
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(1.8),
                    textAlign: 'center',
                    paddingHorizontal: constant.HEIGHT * 2,
                    fontWeight: 'bold',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                  marginTop: constant.HEIGHT * 1,
                  backgroundColor: constant.THEME,
                  borderRadius: constant.HEIGHT * 0.5,
                  padding: constant.HEIGHT * 1,
                  marginLeft: constant.HEIGHT * 2,
                }}
                onPress={() => this.onEditProgram(item)}>
                <Text
                  style={{
                    color: constant.WHITE,
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(1.8),
                    textAlign: 'center',
                    paddingHorizontal: constant.HEIGHT * 2,
                    fontWeight: 'bold',
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
                marginTop: constant.HEIGHT * 1,
                backgroundColor: constant.THEME,
                borderRadius: constant.HEIGHT * 0.5,
                padding: constant.HEIGHT * 1,
              }}
              onPress={() => this.onEditProgram(item)}>
              <Text
                style={{
                  color: constant.WHITE,
                  fontFamily: constant.SUIFONT,
                  fontSize: constant.responsiveFontSize(1.8),
                  textAlign: 'center',
                  paddingHorizontal: constant.HEIGHT * 2,
                  fontWeight: 'bold',
                }}>
                Done
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    }
  };

  onSingleLibrary(item, index) {
    var day = index + '';
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.singleLibraryDetails;

    var inputs = {
      id: item.library_id,
    };
    this.props
      .onSingleLibraryAction(head, url, methods.post, inputs)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('SingleLibraryDetail');
        }
      });
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

  onAddProgram() {
    // this.setState({
    //   library_data: this.state.library_data.concat({
    //     library_id: library_id,
    //     type: this.state.type,
    //     count: this.state.count,
    //     times_to_repeat: this.state.repeat,
    //   }),
    // });
    var library_id,
      library_data = this.state.library_data;
    if (this.state.name != '') {
      if (this.state.type != '') {
        if (this.state.count != 0) {
          if (this.state.rest != 0) {
            if (this.state.repeat != '') {
              head = {
                accept: 'application/json',
                Authorization: this.props.signIn.token,
              };

              url = Url.baseUrl + Url.addEveryDayProgram;

              this.props.workout.workoutLibraryDetails.filter((item, index) => {
                if (item.library_name == this.state.name) {
                  library_id = item._id;
                }
              });

              var inputs = {
                member_id: this.props.signIn.member_id,
                program_id: this.props.workout.singleDayProgram._id,
                day: this.props.workout.workoutDay,
                library_data: library_data.concat({
                  library_id: library_id,
                  type: this.state.type,
                  count: parseInt(this.state.count),
                  rest: parseInt(this.state.rest),
                  times_to_repeat: this.state.repeat,
                }),
                cloned_from: 0,
                type: 'workout',
              };

              this.props
                .addWorkoutAction(head, url, methods.post, inputs)
                .then((response) => {
                  if (response.status == 200) {
                    this.setState({
                      count: 0,
                      name: '',
                      plus: '',
                      minus: '',
                      isOne: false,
                      isTwo: false,
                      isThree: false,
                      isAdd: false,
                      type: '',
                      repeat: '',
                    });
                    this.onDayDetails();
                  }
                });

              // var inputs = {
              //   member_id: this.props.signIn.member_id,
              //   program_id: this.props.workout.singleDayProgram._id,
              //   day: this.props.workout.workoutDay,
              //   library_data: [
              //     {
              //       library_id: library_id,
              //       type: this.state.type,
              //       count: this.state.count,
              //       times_to_repeat: this.state.repeat,
              //     },
              //   ],
              //   diet_data: '',
              //   cloned_from: 0,
              //   type: 'workout',
              // };
            } else {
              constant.toastAlert(
                'Please Select num of time',
                ToastAndroid.LONG,
              );
            }
          } else {
            constant.toastAlert('Please Select num of rest', ToastAndroid.LONG);
          }
        } else {
          constant.toastAlert('Please Select num of count', ToastAndroid.LONG);
        }
      } else {
        constant.toastAlert('Please Select Reps/Sec', ToastAndroid.LONG);
      }
    } else {
      constant.toastAlert('Please Select Workout name', ToastAndroid.LONG);
    }
  }

  onDayDetails() {
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
      this.props.workout.workoutDay;

    var inputs = {
      program_id: this.props.workout.singleDayProgram._id,
      member_id: this.props.signIn.member_id,
      plan_type: 'workout',
    };
    this.props
      .onProgramDDAction(
        head,
        url,
        methods.get,
        inputs,
        this.props.workout.workoutDay,
      )
      .then((res) => {
        var data = [];
        res.data.data.filter((item, index) => {
          data.push(item.library_data);
          this.setState(
            {
              library_data: data,
              itemPressed: '',
            },
            () => {
              // console.error(this.state.library_data);
            },
          );
        });
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />

        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <ScrollView>
            {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}
            <View style={{flex: 1}}>
              <Header navigation={this.props.navigation} onPress={false} />
              <View style={{flex: 0}}>
                <ScrollView
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
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.replace('CustomProgramDetails')
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
                          {'Day ' + this.props.workout.workoutDay}
                        </Text>
                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() => this.onHistoryClick()}>
                          <Image
                            source={constant.ICONHISTORY}
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
                            History
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <View
                        style={{
                          marginTop: constant.HEIGHT * 3,
                          marginLeft: constant.HEIGHT * 4,
                          marginBottom: constant.HEIGHT * 1,
                          width: '100%',
                        }}>
                        <ImageBackground
                          source={constant.ICONSINGLEDAY}
                          style={{
                            width: constant.WIDTH * 90,
                            height: constant.HEIGHT * 20,
                             borderBottomLeftRadius: constant.HEIGHT * 1,
            borderBottomRightRadius: constant.HEIGHT * 1,
            borderTopRightRadius: constant.HEIGHT * 1,
            borderTopLeftRadius: constant.HEIGHT * 1,
            overflow: 'hidden',
                            // backgroundColor:'red'/
                          }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end',
                              alignSelf: 'flex-end',
                              marginTop: constant.HEIGHT * 12,
                              marginRight: constant.HEIGHT * 2,
                              backgroundColor: constant.THEME,
                              borderRadius: constant.HEIGHT * 1.5,
                              padding: constant.HEIGHT * 1,
                            }}>
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
                        marginRight: constant.HEIGHT * 1.5,
                        marginTop: constant.HEIGHT * 2,
                        marginLeft: constant.HEIGHT * 4,
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
                        marginLeft: constant.HEIGHT * 1.5,
                      }}>
                      <FlatList
                        data={this.props.workout.workoutSingleDayDetails}
                        extraData={this.state}
                        // keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        // ListEmptyComponent={this.showEmptyListView}
                      />
                      {this.state.isAdd == true ? (
                        <View
                          style={{
                            elevation:
                              Platform.OS === 'ios'
                                ? null
                                : constant.HEIGHT * 0.5,
                            marginVertical: constant.HEIGHT * 0.5,
                            padding: constant.HEIGHT * 1,
                            marginHorizontal: constant.HEIGHT * 1.5,
                            backgroundColor: constant.WHITE,
                            borderColor: constant.BLACK,
                            borderWidth: constant.HEIGHT * 0.1,
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
                              marginHorizontal: constant.HEIGHT * 1.5,
                            }}>
                            <TouchableOpacity
                              style={{
                                borderColor: '#707070',
                                borderWidth: constant.HEIGHT * 0.1,
                                borderRadius: constant.HEIGHT * 0.5,
                                paddingLeft: constant.HEIGHT * 1,
                                marginTop: constant.HEIGHT * 2,
                                height: constant.HEIGHT * 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                              onPress={() =>
                                this.setState({modalVisible: true})
                              }>
                              <Text
                                style={{
                                  fontSize: constant.responsiveFontSize(1.8),
                                  fontFamily: constant.SUIFONT,
                                  opacity: 0.7,
                                  alignSelf: 'center',
                                }}>
                                {this.state.name == ''
                                  ? 'Please Select'
                                  : this.state.name}
                              </Text>
                              <Image
                                source={constant.ICONDOWNARROW}
                                style={{
                                  marginHorizontal: constant.HEIGHT * 1,
                                  width: constant.HEIGHT * 1.5,
                                  height: constant.HEIGHT * 1.5,
                                  alignSelf: 'center',
                                  tintColor: '#6D6A6A',
                                }}
                              />
                            </TouchableOpacity>

                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  flex: 0.35,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    elevation:
                                      Platform.OS === 'ios'
                                        ? null
                                        : constant.HEIGHT * 0.5,
                                    marginTop: constant.HEIGHT * 2,

                                    backgroundColor: constant.WHITE,
                                    borderColor: constant.WHITE,
                                    borderWidth: constant.HEIGHT * 0.1,
                                    width: constant.HEIGHT * 4,
                                    height: constant.HEIGHT * 3,
                                    borderRadius: constant.HEIGHT * 0.4,
                                    shadowOffset:
                                      Platform.OS === 'ios'
                                        ? {
                                            width: 0,
                                            height: constant.HEIGHT * 2,
                                          }
                                        : null,
                                    shadowRadius:
                                      Platform.OS === 'ios'
                                        ? constant.HEIGHT * 2
                                        : 0,
                                    shadowOpacity:
                                      Platform.OS === 'ios' ? 0.24 : 0,
                                  }}
                                  onPress={() => {
                                    if (this.state.count > 0) {
                                      var count =
                                        parseInt(this.state.count) - 1;
                                      this.setState({
                                        count: count + '',
                                      });
                                    }
                                  }}>
                                  <Image
                                    source={constant.ICONMINUS}
                                    style={{
                                      width: constant.HEIGHT * 1.5,
                                      height: constant.HEIGHT * 2.5,
                                      alignSelf: 'center',
                                      marginTop: constant.HEIGHT * 0.2,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TextInput
                                  style={[
                                    {
                                      fontFamily: constant.SUIFONT,
                                      fontSize: constant.responsiveFontSize(
                                        1.8,
                                      ),
                                      color: constant.THEME,
                                      letterSpacing: constant.HEIGHT * 0.1,
                                      marginLeft: constant.HEIGHT * 1,
                                      fontWeight: 'bold',
                                      alignItems: 'center',
                                    },
                                  ]}
                                  placeholder={'0'}
                                  value={this.state.count.toString()}
                                  returnKeyType={'done'}
                                  numberOfLines={1}
                                  keyboardType={'numeric'}
                                  renderToHardwareTextureAndroid
                                  enablesReturnKeyAutomatically={true}
                                  // autoFocus={true}
                                  autoCorrect={false}
                                  autoCapitalize={'none'}
                                  underlineColorAndroid="transparent"
                                  placeholderTextColor="#888888"
                                  onChangeText={(text) => {
                                    var count = parseInt(text);
                                    this.setState({
                                      count: count,
                                    });
                                  }}
                                  onSubmitEditing={() => {}}
                                />
                                <TouchableOpacity
                                  style={{
                                    elevation:
                                      Platform.OS === 'ios'
                                        ? null
                                        : constant.HEIGHT * 0.5,
                                    marginTop: constant.HEIGHT * 2,

                                    backgroundColor: constant.WHITE,
                                    borderColor: constant.WHITE,
                                    borderWidth: constant.HEIGHT * 0.1,
                                    width: constant.HEIGHT * 4,
                                    height: constant.HEIGHT * 3,
                                    borderRadius: constant.HEIGHT * 0.4,
                                    shadowOffset:
                                      Platform.OS === 'ios'
                                        ? {
                                            width: 0,
                                            height: constant.HEIGHT * 2,
                                          }
                                        : null,
                                    shadowRadius:
                                      Platform.OS === 'ios'
                                        ? constant.HEIGHT * 2
                                        : 0,
                                    shadowOpacity:
                                      Platform.OS === 'ios' ? 0.24 : 0,
                                  }}
                                  onPress={() => {
                                    // console.error(
                                    //   parseInt(this.state.count) + 1,
                                    // );
                                    if (this.state.count <= 60) {
                                      var count =
                                        parseInt(this.state.count) + 1;
                                      this.setState({
                                        count: count + '',
                                      });
                                    }
                                  }}>
                                  <Image
                                    source={constant.ICONPLUS}
                                    style={{
                                      width: constant.HEIGHT * 1.7,
                                      height: constant.HEIGHT * 1.5,
                                      alignSelf: 'center',
                                      marginTop: constant.HEIGHT * 0.5,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  padding: constant.HEIGHT * 0.5,
                                  flex: 0.15,
                                  justifyContent: 'center',
                                }}>
                                <Text>Sec</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'flex-end',
                                  flex: 0.5,
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
                                      color:
                                        this.state.isOne == true
                                          ? constant.THEME
                                          : constant.BLACK,
                                      fontSize: constant.responsiveFontSize(
                                        1.8,
                                      ),
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
                                      color:
                                        this.state.isOne == true
                                          ? constant.THEME
                                          : constant.BLACK,
                                      fontSize: constant.responsiveFontSize(
                                        1.8,
                                      ),
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
                                      color:
                                        this.state.isOne == true
                                          ? constant.THEME
                                          : constant.BLACK,
                                      fontSize: constant.responsiveFontSize(
                                        1.8,
                                      ),
                                    }}>
                                    X3
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  flex: 0.35,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    elevation:
                                      Platform.OS === 'ios'
                                        ? null
                                        : constant.HEIGHT * 0.5,
                                    marginTop: constant.HEIGHT * 2,

                                    backgroundColor: constant.WHITE,
                                    borderColor: constant.WHITE,
                                    borderWidth: constant.HEIGHT * 0.1,
                                    width: constant.HEIGHT * 4,
                                    height: constant.HEIGHT * 3,
                                    borderRadius: constant.HEIGHT * 0.4,
                                    shadowOffset:
                                      Platform.OS === 'ios'
                                        ? {
                                            width: 0,
                                            height: constant.HEIGHT * 2,
                                          }
                                        : null,
                                    shadowRadius:
                                      Platform.OS === 'ios'
                                        ? constant.HEIGHT * 2
                                        : 0,
                                    shadowOpacity:
                                      Platform.OS === 'ios' ? 0.24 : 0,
                                  }}
                                  onPress={() => {
                                    if (this.state.rest > 0) {
                                      var rest = parseInt(this.state.rest) - 1;
                                      this.setState({
                                        rest: rest + '',
                                      });
                                    }
                                  }}>
                                  <Image
                                    source={constant.ICONMINUS}
                                    style={{
                                      width: constant.HEIGHT * 1.5,
                                      height: constant.HEIGHT * 2.5,
                                      alignSelf: 'center',
                                      marginTop: constant.HEIGHT * 0.2,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TextInput
                                  style={[
                                    {
                                      fontFamily: constant.SUIFONT,
                                      fontSize: constant.responsiveFontSize(
                                        1.8,
                                      ),
                                      color: constant.THEME,
                                      letterSpacing: constant.HEIGHT * 0.1,
                                      marginLeft: constant.HEIGHT * 1,
                                      fontWeight: 'bold',
                                      alignItems: 'center',
                                    },
                                  ]}
                                  placeholder={'0'}
                                  value={this.state.rest}
                                  maxLength={3}
                                  keyboardType={'numeric'}
                                  returnKeyType={'done'}
                                  numberOfLines={1}
                                  renderToHardwareTextureAndroid
                                  enablesReturnKeyAutomatically={true}
                                  // autoFocus={true}
                                  autoCorrect={false}
                                  autoCapitalize={'none'}
                                  underlineColorAndroid="transparent"
                                  placeholderTextColor="#888888"
                                  onChangeText={(text) => {
                                    var rest = parseInt(text);
                                    this.setState({
                                      rest: rest,
                                    });
                                  }}
                                  onSubmitEditing={() => {}}
                                />
                                <TouchableOpacity
                                  style={{
                                    elevation:
                                      Platform.OS === 'ios'
                                        ? null
                                        : constant.HEIGHT * 0.5,
                                    marginTop: constant.HEIGHT * 2,

                                    backgroundColor: constant.WHITE,
                                    borderColor: constant.WHITE,
                                    borderWidth: constant.HEIGHT * 0.1,
                                    width: constant.HEIGHT * 4,
                                    height: constant.HEIGHT * 3,
                                    borderRadius: constant.HEIGHT * 0.4,
                                    shadowOffset:
                                      Platform.OS === 'ios'
                                        ? {
                                            width: 0,
                                            height: constant.HEIGHT * 2,
                                          }
                                        : null,
                                    shadowRadius:
                                      Platform.OS === 'ios'
                                        ? constant.HEIGHT * 2
                                        : 0,
                                    shadowOpacity:
                                      Platform.OS === 'ios' ? 0.24 : 0,
                                  }}
                                  onPress={() => {
                                    // console.error(
                                    //   parseInt(this.state.count) + 1,
                                    // );
                                    if (this.state.rest <= 60) {
                                      var rest = parseInt(this.state.rest) + 1;
                                      this.setState({
                                        rest: rest + '',
                                      });
                                    }
                                  }}>
                                  <Image
                                    source={constant.ICONPLUS}
                                    style={{
                                      width: constant.HEIGHT * 1.7,
                                      height: constant.HEIGHT * 1.5,
                                      alignSelf: 'center',
                                      marginTop: constant.HEIGHT * 0.5,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  flex: 0.15,
                                  padding: constant.HEIGHT * 0.5,
                                  marginTop: constant.HEIGHT * 2,
                                }}>
                                <Text>Rest</Text>
                              </View>
                              <TouchableOpacity
                                style={{
                                  alignSelf: 'flex-end',
                                  marginTop: constant.HEIGHT * 1,
                                  borderRadius: constant.HEIGHT * 0.5,
                                  flex: 0.5,
                                }}
                                onPress={() => this.onAddProgram()}>
                                <Text
                                  style={{
                                    color: constant.WHITE,
                                    fontFamily: constant.SUIFONT,
                                    fontSize: constant.responsiveFontSize(1.8),
                                    textAlign: 'center',
                                    marginLeft: constant.HEIGHT * 6,
                                    backgroundColor: constant.THEME,
                                    borderRadius: constant.HEIGHT * 0.5,
                                    paddingVertical: constant.HEIGHT * 1,
                                    paddingHorizontal: constant.HEIGHT * 1,
                                    fontWeight: 'bold',
                                  }}>
                                  Done
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ) : null}
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: constant.HEIGHT * 3,
                          flexDirection: 'row',
                          elevation:
                            Platform.OS === 'ios'
                              ? null
                              : constant.HEIGHT * 0.5,
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
                        onPress={() => this.setState({isAdd: true})}>
                        <Image
                          source={constant.ICONADDBUTTON}
                          resizeMode={'contain'}
                          style={{
                            marginHorizontal: constant.HEIGHT * 1,
                            width: constant.HEIGHT * 2.5,
                            height: constant.HEIGHT * 2.5,
                            tintColor: constant.GREY,
                          }}
                        />
                        <Text
                          style={{
                            marginRight: constant.HEIGHT * 1,
                            color: constant.GREY,
                            fontSize: constant.responsiveFontSize(1.8),
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {'ADD'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              onRequestClose={() => this.setState({modalVisible: false})}
              visible={this.state.modalVisible}>
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: false})}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.58)',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    height: '50%',
                    borderRadius: constant.HEIGHT * 0.5,
                    backgroundColor: constant.WHITE,
                    borderColor: constant.WHITECOLOR,
                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
                    padding: constant.HEIGHT * 2,
                  }}>
                  <View
                    style={{
                      borderColor: '#707070',
                      borderWidth: constant.HEIGHT * 0.1,
                      borderRadius: constant.HEIGHT * 0.5,
                      paddingLeft: constant.HEIGHT * 1,
                      flexDirection: 'row',
                      height: constant.HEIGHT * 6,
                    }}>
                    <Image
                      source={constant.ICONSEARCH}
                      style={{
                        width: constant.HEIGHT * 2.5,
                        height: constant.HEIGHT * 2.5,
                        alignSelf: 'center',
                        tintColor: '#6D6A6A',
                      }}
                    />
                    <TextInput
                      style={[
                        {
                          fontFamily: constant.SUIFONT,
                          fontSize: constant.responsiveFontSize(1.8),
                          color: constant.BLACK,
                          letterSpacing: constant.HEIGHT * 0.1,
                          alignItems: 'center',
                          marginTop: constant.HEIGHT * 0.2,
                          flex: 1,
                        },
                      ]}
                      placeholder={'Search Text'}
                      value={this.state.searchText}
                      returnKeyType={'done'}
                      numberOfLines={1}
                      renderToHardwareTextureAndroid
                      enablesReturnKeyAutomatically={true}
                      // autoFocus={true}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#888888"
                      onChangeText={(text) => this.searchFilter(text)}
                      onSubmitEditing={() => {}}
                    />
                  </View>
                  <FlatList
                    data={this.state.workoutLibraryName}
                    extraData={this.state}
                    // keyExtractor={this._keyExtractor}
                    renderItem={this._renderName}
                    ListEmptyComponent={this.showEmptyListView}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
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
      getLibraryAction,
      addWorkoutAction,
      onProgramDetailAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(CustomSingleDay);
