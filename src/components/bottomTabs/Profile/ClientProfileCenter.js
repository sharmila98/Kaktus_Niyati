import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  Modal,
  FlatList,
  ScrollView,
  LayoutAnimation,
  SafeAreaView,
  Animated,
} from 'react-native';
import Pie from '../../../libs/Pie';

// import { constant } from "lodash";

import * as constant from '../../../utils/constants';
import StatusBar from '../../commons/StatusBar';
import Header from '../../commons/Header';
import * as Progress from 'react-native-progress';
import {onProfileAction} from '../../../action/Profile_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {onContactListAction} from '../../../action/SideDrawer_action';
import {
  onCategoriesAction,
  onRegisterAction,
} from '../../../action/Login_Action';

var head,
  url = '';

class ClientProfileCenter extends Component {
  static navigationOptions = {
    title: 'Dashboard',
  };
  constructor(props) {
    super(props);
    this.state = {
      progress: 0.4,
      image: '',
    };
  }

  componentDidMount() {
    var pic =
      this.props.myProfile.clientProfileDetails != undefined &&
      this.props.myProfile.clientProfileDetails.image != undefined &&
      this.props.myProfile.clientProfileDetails.image.filename != undefined
        ? this.props.myProfile.clientProfileDetails.image.filename
        : '';

    if (pic != '') {
      var image = Url.baseUrl + Url.images + pic;
      this.setState({image: image});
    }
    // console.error(this.props.myProfile.profileDetails.isfriend)
  }
  _renderItem = ({item, index}) => {
    // var image = Url.baseUrl + Url.images + item.image[0].filename;
    return (
      <View
        style={{
          marginBottom: constant.HEIGHT * 5,
          paddingLeft: constant.HEIGHT * 1,
        }}>
        <TouchableOpacity
          style={{
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: constant.WHITE,
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
          {/* <Image
            resizeMode={'contain'}
            source={{uri: image}}
            style={{
              marginHorizontal: constant.HEIGHT * 1,
              width: constant.HEIGHT * 13,
              height: constant.HEIGHT * 13,
            }}
          /> */}
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
          {item.name}
        </Text>
      </View>
    );
  };

  onCurrentGoal() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    url = Url.baseUrl + Url.category;

    var inputs = {
      category_type: 'Goal',
    };

    this.props
      .onCategoriesAction(head, url, methods.post, inputs, false)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('CurrentGoal');
        }
        // var inputs = {
        //   category_type: 'Workout',
        // };
        // this.props.onCategoriesAction(head, url, methods.post, inputs, true);
      });
  }

  onRequest() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    url = Url.baseUrl + Url.clientContact;

    var inputs = {
      member_id: this.props.signIn.member_id,
      request_id: this.props.myProfile.clientProfileDetails.member_id,
      type: 'send',
    };

    this.props.onContactListAction(head, url, methods.post, inputs);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          {/* <StatusBar
            backgroundColor={constant.THEME}
            overRelay={true}
            hidden={false}
          /> */}
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />

            <ScrollView>
              <View style={{marginVertical: constant.HEIGHT * 3, flex: 0.94}}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={{
                      width: '90%',
                      height: constant.HEIGHT * 10,
                      marginHorizontal: constant.HEIGHT * 2.5,
                      borderRadius: constant.HEIGHT * 0.5,
                    }}
                    source={constant.ICONLIVEFRIEND}
                  />
                  {/* <View style={{backgroundColor: '#aa84e3'}}>
                  <Text
                    style={{
                      marginLeft: constant.HEIGHT * 5,
                      color: constant.WHITE,
                    }}>
                    WORKOUT
                  </Text>
                  <Text
                    style={{
                      marginLeft: constant.HEIGHT * 5,
                      color: constant.WHITE,
                    }}>
                    LIVE WITH FRIENDS
                  </Text>
                </View> */}
                </View>
                {/* <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}>
                <Image
                  style={{
                    width: constant.HEIGHT * 10,
                    height: constant.HEIGHT * 10,
                    marginHorizontal: constant.HEIGHT * 2.5,
                    borderRadius: constant.HEIGHT * 0.5,
                  }}
                  source={constant.ICONPROFILEOUTER}
                />
              </View> */}
                <View
                  style={{
                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                    margin: constant.HEIGHT * 2,
                    padding: constant.HEIGHT * 2,
                    backgroundColor: constant.WHITE,
                    borderRadius: constant.HEIGHT * 1.5,
                    marginTop: constant.HEIGHT * 22,

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
                      marginTop: constant.HEIGHT * -25,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        marginTop: 30,
                      }}>
                      <Animated.View
                        style={{
                          transform: this.state.transform,
                        }}>
                        <Pie
                          radius={100}
                          innerRadius={82}
                          sections={[
                            {
                              percentage: 100,
                              color: '#FF67A4',
                            },
                          ]}
                          dividerSize={2}
                          strokeCap={'butt'}
                        />
                      </Animated.View>
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: constant.WHITE,
                          width: constant.HEIGHT * 21,
                          height: constant.HEIGHT * 21,
                          borderRadius: constant.HEIGHT * 25,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {this.props.myProfile.clientProfileDetails.image !=
                        undefined ? (
                          <Image
                            source={{uri: this.state.image}}
                            style={{
                              width: constant.HEIGHT * 21,
                              height: constant.HEIGHT * 21,
                              alignSelf: 'center',
                              borderRadius: constant.HEIGHT * 25,
                            }}
                          />
                        ) : (
                          <Image
                            source={constant.ICONUSERIMG}
                            style={{
                              width: constant.HEIGHT * 21,
                              height: constant.HEIGHT * 21,
                              alignSelf: 'center',
                              borderRadius: constant.HEIGHT * 25,
                            }}
                          />
                        )}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        marginTop: -2,
                      }}>
                      <Image
                        style={{
                          width: constant.HEIGHT * 4,
                          marginHorizontal: constant.HEIGHT * 1,
                          height: constant.HEIGHT * 3,
                          tintColor: '#FF67A4',
                        }}
                        source={constant.DOWNICON}
                      />
                    </View>
                    <View style={{alignSelf: 'center'}}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          color: '#5D5C5C',
                          fontWeight: 'bold',
                          fontSize: constant.responsiveFontSize(2.4),
                          fontFamily: constant.SUIFONT,
                        }}>
                        {this.props.clientProfile.centerDetails.center_name}
                      </Text>
                      {/* <Text
                        style={{
                          alignSelf: 'flex-end',
                          color: '#5D5C5C',
                          fontWeight: 'bold',
                          fontSize: constant.responsiveFontSize(1.4),
                          backgroundColor: '#959191',
                          color: constant.WHITE,
                          fontFamily: constant.SUIFONT,
                        }}>
                        {this.props.clientProfile.trainerDetails.role}
                      </Text> */}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: constant.HEIGHT * 4,
                        justifyContent: 'space-between',
                        marginTop: constant.HEIGHT * 3,
                      }}>
                      <TouchableOpacity style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(2.4),
                              color: '#6D6A6A',
                              fontWeight: 'bold',
                              marginLeft: constant.HEIGHT * 0.5,
                              fontFamily: constant.SUIFONT,
                            }}>
                            {this.props.clientProfile.centerDetails.exp}
                          </Text>
                          {/* <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? constant.REBOTOREGULAR
                                  : constant.REBOTOREGULAR,
                              fontSize: constant.responsiveFontSize(1.6),
                              color: '#6D6A6A',
                              alignSelf: 'center',
                              marginTop: constant.HEIGHT * 0.5,
                              fontFamily: constant.SUIFONT,
                            }}>
                            {' yrs'}
                          </Text> */}
                        </View>
                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <Image
                            source={constant.ICONRANK}
                            style={{
                              width: constant.HEIGHT * 2,
                              height: constant.HEIGHT * 2,
                              marginTop: constant.HEIGHT * 0.8,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(1.8),
                              color: '#a1a0a1',
                              marginTop: constant.HEIGHT * 0.2,
                              marginLeft: constant.HEIGHT * 0.2,
                              fontFamily: constant.SUIFONT,
                            }}>
                            Rank
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        // onPress={() =>
                        // }
                        style={{
                          flexDirection: 'column',
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'ios'
                                ? constant.REBOTOREGULAR
                                : constant.REBOTOREGULAR,
                            fontSize: constant.responsiveFontSize(2.4),
                            color: '#6D6A6A',
                            fontWeight: 'bold',
                            marginLeft: constant.HEIGHT * 0.5,
                            alignSelf: 'center',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {
                            this.props.clientProfile.centerDetails
                              .num_of_trainers
                          }
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <Image
                            source={constant.ICONGYM}
                            style={{
                              width: constant.HEIGHT * 1.5,
                              height: constant.HEIGHT * 1.5,
                              marginTop: constant.HEIGHT * 0.8,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(1.8),
                              color: '#a1a0a1',
                              marginTop: constant.HEIGHT * 0.2,
                              marginLeft: constant.HEIGHT * 0.2,
                              fontFamily: constant.SUIFONT,
                            }}>
                            {'Trainers'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        // onPress={() =>
                        //   this.props.navigation.navigate('Contacts')
                        // }
                        style={{
                          flexDirection: 'column',
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'ios'
                                ? constant.REBOTOREGULAR
                                : constant.REBOTOREGULAR,
                            fontSize: constant.responsiveFontSize(2.4),
                            color: '#6D6A6A',
                            fontWeight: 'bold',
                            marginLeft: constant.HEIGHT * 0.5,
                            alignSelf: 'center',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {
                            this.props.clientProfile.centerDetails
                              .num_of_clients
                          }
                        </Text>

                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <Image
                            source={constant.ICONCONTACTS}
                            style={{
                              width: constant.HEIGHT * 2.5,
                              height: constant.HEIGHT * 2.5,
                              alignSelf: 'center',
                            }}
                          />
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(1.8),
                              color: '#a1a0a1',
                              marginTop: constant.HEIGHT * 0.2,
                              marginLeft: constant.HEIGHT * 0.2,
                              fontFamily: constant.SUIFONT,
                            }}>
                            Members
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {/* <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'ios'
                        ? constant.REBOTOREGULAR
                        : constant.REBOTOREGULAR,
                    fontSize: constant.responsiveFontSize(2),
                    color: '#6D6A6A',
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  Targets
                </Text> */}

                <View
                  style={{
                    marginLeft: constant.HEIGHT * 3,
                    marginRight: constant.HEIGHT * 2,
                    marginTop: constant.HEIGHT * 2,
                  }}>
                  {/* <FlatList
                    data={this.props.clientProfile.centerDetails.trainers_details}
                    extraData={this.props}
                    // keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    horizontal={true}
                    ListEmptyComponent={this.showEmptyListView}
                  /> */}
                </View>

                {/* <View
                  style={{
                    flexDirection: 'row',

                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                    margin: constant.HEIGHT * 2,
                    padding: constant.HEIGHT * 2,
                    backgroundColor: constant.WHITE,
                    borderRadius: constant.HEIGHT * 1.5,
                    marginTop: constant.HEIGHT * 2,

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
                    source={constant.ICONTROPHY}
                    style={{
                      width: constant.HEIGHT * 8,
                      height: constant.HEIGHT * 10,
                      alignSelf: 'center',
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      right: 1,
                      top: -7,
                      width: constant.HEIGHT * 5,
                      height: constant.HEIGHT * 5,
                      borderColor: constant.THEME,
                      borderWidth: constant.HEIGHT * 0.1,
                      borderRadius: constant.HEIGHT * 20,
                      padding: constant.HEIGHT * 2,
                    }}>
                    <Image
                      source={constant.ICONCLAP}
                      style={{
                        width: constant.HEIGHT * 3,
                        height: constant.HEIGHT * 4,
                        alignSelf: 'center',
                        marginTop: constant.HEIGHT * -1.5,
                        // position: 'absolute',
                        // right: 1,
                        // top: -8,
                        // borderColor: constant.THEME,
                        // borderWidth: constant.HEIGHT * 0.1,
                        // borderRadius: constant.HEIGHT * 100,
                        // padding: constant.HEIGHT * 2,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: constant.HEIGHT * 3,
                      marginTop: constant.HEIGHT * 2,
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        fontFamily: constant.SUIFONT,
                        fontWeight: 'bold',
                        color: '#6D6A6A',
                      }}>
                      {this.props.clientProfile.trainerDetails.live_sessions}
                    </Text>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        fontFamily: constant.SUIFONT,
                        marginTop: constant.HEIGHT * 1,
                        color: '#6D6A6A',
                      }}>
                      Conducted live Session
                    </Text>
                  </View>
                </View> */}

                {/* <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: constant.HEIGHT * 3.5,
                    marginTop: constant.HEIGHT * 1,
                    borderBottomWidth: constant.HEIGHT * 0.1,
                  }}
                  onPress={
                    () => this.onCurrentGoal()
                    //  this.props.navigation.navigate('CurrentGoal')}
                  }>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(1.6),
                      fontFamily: constant.SUIFONT,
                    }}>
                    Set a new goal
                  </Text>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    myProfile: state.profileReducer,
    clientProfile: state.headerReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onProfileAction,
      onCategoriesAction,
      onContactListAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientProfileCenter);
