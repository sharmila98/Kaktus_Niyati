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

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import {addCustomDayDiet} from '../../../action/CustomPlan_Action';
import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
  getDietLibraryAction,
  onProgramDetailAction,
  addDietItemToSession,
  addODietItemSelectedList,
  removeDietItemSelectedList,
  assignDietItemSelectedList,
  emptyDietItemSelectedList,
  emptyDietItemList,
  filterLibrary,
  changeCustomCount,
} from '../../../action/DashBoard_Action';
import Loader from './../../commons/Loader';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

var head, url;

class CustomDietSingleDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      loader: false,
      session: '',
    };
  }

  componentDidMount() {
    this.props.emptyDietItemList();
    this.setState({session: this.props.route.params.session}, () => {
      this.onloadMore(1, '');
    });
  }

  onloadMore(pageno, keyword) {
    if (pageno <= this.props.workout.customDietEndPageno + 1) {
      this.props.emptyDietItemSelectedList();
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };
      url = Url.baseUrl + Url.getPageLibrary;

      var inputs = {
        type: 'diet',
        member_id: this.props.signIn.member_id,
        keywords: keyword,
        page: pageno,
      };

      this.props
        .getDietLibraryAction(head, url, methods.post, inputs)
        .then((res) => {
          if (res.status == 200) {
            this.props.changeCustomCount(pageno + 1);
            this.setState({loader: false});
            // this.setState(
            //   {dietList: this.props.workout.dietLibraryDetails},
            //   () => {
            if (this.props.route.params.session == 'Early Morning') {
              this.props.assignDietItemSelectedList(
                this.props.workout.earlyMorDietItemList,
              );
            } else if (this.props.route.params.session == 'Breakfast') {
              this.props.assignDietItemSelectedList(
                this.props.workout.breakFastDietItemList,
              );
            } else if (this.props.route.params.session == 'Mid morning') {
              this.props.assignDietItemSelectedList(
                this.props.workout.midMorDietItemList,
              );
            } else if (this.props.route.params.session == 'Lunch') {
              this.props.assignDietItemSelectedList(
                this.props.workout.lunchDietItemList,
              );
            } else if (this.props.route.params.session == 'Snacks') {
              this.props.assignDietItemSelectedList(
                this.props.workout.snacksDietItemList,
              );
            } else if (this.props.route.params.session == 'Dinner') {
              this.props.assignDietItemSelectedList(
                this.props.workout.dinnerDietItemList,
              );
            } else if (this.props.route.params.session == 'Late night') {
              this.props.assignDietItemSelectedList(
                this.props.workout.lateNightDietItemList,
              );
            }

            // },
            // );
          }
        });
    }
  }

  isSelected(i) {
    var arr = this.props.workout.customDietSelectedList.filter(
      (item, index) => {
        return i._id == item._id;
      },
    );

    if (arr != undefined && arr.length != 0 && arr[0]._id != undefined) {
      return arr[0]._id;
    } else {
      return null;
    }
  }

  AddOrRemoveItem(item) {
    if (this.isSelected(item)) {
      this.props.removeDietItemSelectedList(item);
    } else {
      item.count = 1;
      this.props.addODietItemSelectedList(item);
    }
  }

  doneItem() {
    this.setState({loader: true});
    this.props
      .addDietItemToSession(
        this.state.session,
        this.props.workout.customDietSelectedList,
      )
      .then(() => {
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
              library: [],
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
          program_id: this.props.route.params.program_id,
          member_id: this.props.signIn.member_id,
          day: this.props.route.params.selectedDay,
          diet_data: dietData,
          cloned_from: 0,
          type: 'diet',
        };

        this.props
          .addCustomDayDiet(head, url, methods.post, inputs)
          .then((response) => {
            if (response.status == 200) {
              this.setState({loader: false});
              this.props.navigation.navigate('CustomDiet');
            }
          });
      });
  }

  _renderItem = ({item, index}) => {
    // console.error('list '+JSON.stringify(this.props.workout.customDietSelectedList))
    var image = Url.baseUrl + Url.images + item.ref_image.filename;
    var isItemSelect = this.isSelected(item);
    // if(this.isSelected(item)){
    //   console.error('fdh '+JSON.stringify(item))
    // }

    return (
      <TouchableOpacity onPress={() => this.AddOrRemoveItem(item)}>
        <View
          style={{
            marginTop: constant.HEIGHT * 1.5,
            marginHorizontal: constant.HEIGHT * 2,
          }}>
          <View
            style={{
              elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
              marginTop: constant.HEIGHT * 1,
              backgroundColor: this.isSelected(item)
                ? '#ffccd4'
                : constant.WHITE,
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
                  height: constant.HEIGHT * 15,
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
                  {item.library_name}
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
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  search = (searchText) => {
    this.setState({searchText: searchText.toLowerCase()});
    if (searchText.length > 1) {
      this.props.emptyDietItemList();
      this.onloadMore(1, searchText.toLowerCase());
    }
    // this.props.filterLibrary(searchText.toLowerCase());
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}

          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />
            <View style={{flex: 0}}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('CustomDiet')}
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
                        {'Add Item'}
                      </Text>

                      <TouchableOpacity onPress={() => this.doneItem()}>
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
                            paddingLeft: constant.HEIGHT * 5,
                            paddingRight: constant.HEIGHT * 2.5,
                          }}>
                          {'Done'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: constant.HEIGHT * 2,
                      marginLeft: constant.HEIGHT * 2,
                      borderRadius: constant.HEIGHT * 2,
                      backgroundColor: constant.WHITE,
                      borderColor: '#ffeef8',
                      marginRight: constant.HEIGHT * 2,
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
                    }}>
                    <Image
                      style={{
                        alignSelf: 'center',
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginHorizontal: constant.HEIGHT * 1.5,
                      }}
                      source={constant.ICONSEARCH}
                    />
                    <TextInput
                      style={[
                        {
                          fontFamily: constant.SUIFONT,
                          fontSize: constant.responsiveFontSize(2.2),
                          color: '#888888',
                          width: '100%',
                          letterSpacing: constant.HEIGHT * 0.1,
                          marginLeft: constant.HEIGHT * 0.5,
                          fontWeight: 'bold',
                        },
                      ]}
                      placeholder={'Search'}
                      value={this.state.searchText}
                      returnKeyType={'done'}
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
                      onChangeText={(text) => this.search(text)}
                      onSubmitEditing={() => {}}
                    />
                  </View>

                  {this.state.loader == false ? (
                    <View
                      style={{
                        marginTop: constant.HEIGHT * 1,
                        marginLeft: constant.HEIGHT * 1.5,
                      }}>
                      {/* <TextInput
                      value={this.state.searchText}
                      underlineColorAndroid={'red'}
                      onChange={this.search}
                    /> */}

                      <FlatList
                        data={this.props.workout.dietLibraryDetails}
                        extraData={this.props}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0}
                        //   onMomentumScrollBegin = {() => {this.onEndReachedCalledDuringMomentum = false;}}
                        //   onEndReached = {() => {
                        //     if (!this.onEndReachedCalledDuringMomentum) {
                        //       this.onloadMore(this.props.workout.customDietPageNo, "");    // LOAD MORE DATA
                        //       this.onEndReachedCalledDuringMomentum = true;
                        //     }
                        //   }
                        // }
                        onEndReached={() =>
                          this.onloadMore(
                            this.props.workout.customDietPageNo,
                            '',
                          )
                        }
                        initialNumToRender={10}
                        ListEmptyComponent={this.showEmptyListView}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        padding: constant.HEIGHT * 20,
                      }}>
                      <Loader />
                    </View>
                  )}
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
      getDietLibraryAction,
      onProgramDetailAction,
      addDietItemToSession,
      addODietItemSelectedList,
      removeDietItemSelectedList,
      assignDietItemSelectedList,
      emptyDietItemSelectedList,
      emptyDietItemList,
      filterLibrary,
      addCustomDayDiet,
      changeCustomCount,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomDietSingleDay);
