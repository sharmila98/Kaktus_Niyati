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
import Ripple from '../../../libs/Ripple/Ripple';

import StatusBar from '../../commons/StatusBar';
import Header from '../../commons/Header';
import * as Progress from 'react-native-progress';
import {onProfileAction} from '../../../action/Profile_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {
  onCategoriesAction,
  onRegisterAction,
} from '../../../action/Login_Action';

var head,
  url = '';

class Profile extends Component {
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
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.myProfile + this.props.signIn.member_id;

    this.props
      .onProfileAction(head, url, methods.get, false)
      .then((response) => {
        if (response.status == 200) {
          var image =
            Url.baseUrl + Url.images + response.data.data.image.filename;
          this.setState({image: image}, () => {});
        }
      });
  }

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
                  <View style={{}}>
                    <TouchableOpacity activeOpacity={1}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'center',
                          justifyContent: 'center',
                          marginTop: constant.HEIGHT * 1,
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
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('ContactDetails')
                          }
                          style={{
                            position: 'absolute',
                            backgroundColor: constant.WHITE,
                            width: constant.HEIGHT * 22,
                            height: constant.HEIGHT * 22,
                            borderRadius: constant.HEIGHT * 22,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {this.props.myProfile.profileDetails.image !=
                          undefined ? (
                            <Image
                              source={{uri: this.state.image}}
                              resizeMode={'contain'}
                              style={{
                                width: constant.HEIGHT * 20.5,
                                height: constant.HEIGHT * 20.5,
                                alignSelf: 'center',
                                borderRadius: constant.HEIGHT * 19,
                              }}
                            />
                          ) : (
                            <Image
                              source={constant.ICONUSERIMG}
                              resizeMode={'contain'}
                              style={{
                                width: constant.HEIGHT * 20.5,
                                height: constant.HEIGHT * 20.5,
                                alignSelf: 'center',
                                borderRadius: constant.HEIGHT * 20,
                              }}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
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
                        {this.props.myProfile.profileDetails.name}
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
                        ANNA NAGAR
                      </Text> */}
                    </View>
                    <View
                      style={{
                        width: constant.HEIGHT * 25,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        marginTop: constant.HEIGHT * 5,
                      }}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          color: '#5D5C5C',
                          fontWeight: 'bold',
                          fontSize: constant.responsiveFontSize(1.4),
                          fontFamily: constant.SUIFONT,
                        }}>
                        Intermediate
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'center',
                          color: '#5D5C5C',
                          fontWeight: 'bold',
                          fontSize: constant.responsiveFontSize(1.4),
                          fontFamily: constant.SUIFONT,
                        }}>
                        {this.props.myProfile.profileDetails.total_hrs + 'hrs'}
                      </Text>
                    </View>
                    <Progress.Bar
                      progress={0.01}
                      height={constant.HEIGHT * 0.4}
                      width={constant.HEIGHT * 25}
                      style={{
                        alignSelf: 'center',
                      }}
                      borderColor="#ECECEC"
                      unfilledColor="#ECECEC"
                      color="#FF67A4"
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: constant.HEIGHT * 4,
                        marginTop: constant.HEIGHT * 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('LeaderBoard')
                        }
                        style={{flexDirection: 'column', flex: 0.3}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
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
                              fontFamily: constant.SUIFONT,
                            }}>
                            {this.props.myProfile.profileDetails.rank !=
                            undefined
                              ? this.props.myProfile.profileDetails.rank
                              : 0}
                          </Text>
                          <Text
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
                            {'/' + this.props.myProfile.profileDetails.total}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}>
                          <Image
                            resizeMode={'contain'}
                            source={constant.ICONRANK}
                            style={{
                              width: constant.HEIGHT * 3,
                              height: constant.HEIGHT * 3,
                              tintColor: constant.GREY,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(1.8),
                              marginLeft: constant.HEIGHT * 0.2,
                              fontFamily: constant.SUIFONT,
                              opacity: 0.6,
                            }}>
                            Rank
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('History')
                        }
                        style={{
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 0.4,
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
                            this.props.myProfile.profileDetails
                              .session_completed
                          }
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}>
                          <Image
                            resizeMode={'contain'}
                            source={constant.WORKOUTPIE}
                            style={{
                              width: constant.HEIGHT * 2,
                              height: constant.HEIGHT * 2,
                              tintColor: constant.GREY,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(1.8),
                              color: '#a1a0a1',
                              marginLeft: constant.HEIGHT * 0.5,
                              fontFamily: constant.SUIFONT,
                            }}>
                            Sessions
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('Contacts')
                        }
                        style={{
                          justifyContent: 'center',
                          alignSelf: 'center',
                          flex: 0.3,
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
                          {this.props.myProfile.profileDetails.contact_count}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}>
                          <Image
                            resizeMode={'contain'}
                            source={constant.ICONCONTACTS}
                            style={{
                              width: constant.HEIGHT * 3,
                              height: constant.HEIGHT * 3,
                              alignSelf: 'center',
                              tintColor: constant.GREY,
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
                            Contacts
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: constant.responsiveFontSize(1.8),
                    color: '#5D5C5C',
                    marginTop: constant.HEIGHT * 1.5,
                    fontFamily: constant.SUIFONT,
                  }}>
                  {'Your are just few steps away from your goal'}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: constant.HEIGHT * 5,
                    marginRight: constant.HEIGHT * 6,
                  }}>
                  <Image
                    source={constant.ICONSTART}
                    style={{
                      flex: 0.1,
                      width: constant.HEIGHT * 2.5,
                      height: constant.HEIGHT * 6,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 1.5,
                    }}
                  />
                  <Image
                    source={constant.ICONFINISHGOAL}
                    style={{
                      flex: 0.1,
                      width: constant.HEIGHT * 2.5,
                      height: constant.HEIGHT * 6,
                      marginTop: constant.HEIGHT * 0.5,
                    }}
                  />
                </View>
                <Progress.Bar
                  progress={0.01}
                  height={constant.HEIGHT * 0.8}
                  width={constant.HEIGHT * 43}
                  style={{
                    alignSelf: 'center',
                  }}
                  borderColor="#ECECEC"
                  unfilledColor="#ECECEC"
                  color="#FF67A4"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: constant.HEIGHT * 4,
                    marginRight: constant.HEIGHT * 4,
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.4),
                      fontFamily: constant.SUIFONT,
                    }}>
                    {this.props.myProfile.profileDetails.org_weight + 'kg'}
                  </Text>
                  {/* <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.4),
                      fontFamily: constant.SUIFONT,
                    }}>
                    {this.props.myProfile.profileDetails.current_weight + 'kg'}
                  </Text> */}
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.4),
                      fontFamily: constant.SUIFONT,
                    }}>
                    {this.props.myProfile.profileDetails.expected_weight + 'kg'}
                  </Text>
                </View>
                <TouchableOpacity
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
                </TouchableOpacity>
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
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onProfileAction,
      onCategoriesAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
