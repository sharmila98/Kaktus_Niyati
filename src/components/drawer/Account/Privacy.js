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
import * as Progress from 'react-native-progress';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';

import * as constant from '../../../utils/constants';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {RFC_2822} from 'moment';
import {updatePrivacyAction} from '../../../action/Profile_Action';

var head, url;

class Privacy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constant: [
        {name: 'Shobana', area: 'ANNA NAGAR', rank: 120},
        {name: 'Sheeba', area: 'SALIGRAMAM', rank: 1152},
      ],
      isPublic: false,
      isSocial: false,
      isPrivate: false,
      type: '',
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
    // console.error(this.props.profile.profileDetails.privacy)
    this.setState({type: this.props.profile.profileDetails.privacy});
  }

  updatePrivacy(type) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.updatePrivacy;

    var inputs = {
      member_id: this.props.signIn.member_id,
      privacy_type: type,
    };

    this.setState({type: type});

    this.props.updatePrivacyAction(head, url, methods.post, inputs);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0}}>
              <View
                style={{
                  backgroundColor: constant.WHITE,
                  marginVertical: constant.HEIGHT * 1.5,
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
                      fontSize: constant.responsiveFontSize(2),
                      opacity: 0.5,
                      flex: 1,
                      fontWeight: 'bold',

                      fontFamily: constant.SUIFONT,
                    }}>
                    Privacy Setting
                  </Text>
                </TouchableOpacity> */}
                <BackButtonwithTitle
                  title={'Privacy Setting'}
                  underLine={false}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.goBack()}
                />
              </View>
              <View
                style={{
                  marginHorizontal: constant.HEIGHT * 4,
                  marginTop: constant.HEIGHT * 5,
                  borderColor: '#c8cfd5',
                  borderBottomWidth: constant.HEIGHT * 0.1,
                  paddingBottom: constant.HEIGHT * 4,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2.2),
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  Everyone (Public)
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: constant.HEIGHT * 2,
                  }}>
                  <TouchableOpacity
                    style={{flex: 1.3}}
                    onPress={() =>
                      this.props.navigation.navigate('PrivacyViewMore')
                    }>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        fontFamily: constant.SUIFONT,
                        marginRight: constant.HEIGHT * 2,
                      }}>
                      {
                        'Everyone on Pink Fitness can search for you, View your full profile (including your aggregate activity data and shared content),send you friend requests and see your shared activity in the feed.'
                      }
                    </Text>
                    <Text
                      style={{
                        backgroundColor: constant.THEME,
                        borderRadius: constant.HEIGHT * 2,
                        marginTop: constant.HEIGHT * -2,
                        width: constant.HEIGHT * 12,
                        textAlign: 'center',
                      }}>
                      {' See more'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => this.updatePrivacy('public')}>
                    {this.state.type == 'public' ? (
                      <Image
                        source={constant.ICONCHECK}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          tintColor: constant.BLACK,
                          alignSelf: 'center',
                        }}
                      />
                    ) : (
                      <Image
                        source={constant.ICONUNCHECK}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          tintColor: constant.BLACK,
                          alignSelf: 'center',
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: constant.HEIGHT * 4,
                  marginTop: constant.HEIGHT * 5,
                  borderColor: '#c8cfd5',
                  borderBottomWidth: constant.HEIGHT * 0.1,
                  paddingBottom: constant.HEIGHT * 4,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2.2),
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  Friends (Social)
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: constant.HEIGHT * 2,
                  }}>
                  <TouchableOpacity
                    style={{flex: 1.3}}
                    onPress={() =>
                      this.props.navigation.navigate('PrivacyViewMore')
                    }>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        fontFamily: constant.SUIFONT,
                        marginRight: constant.HEIGHT * 2,
                      }}>
                      {
                        'Everyone on Pink Fitness can search for you, View your full profile (including your aggregate activity data and shared content),send you friend requests and see your shared activity in the feed.'
                      }
                    </Text>
                    <Text
                      style={{
                        backgroundColor: constant.THEME,
                        borderRadius: constant.HEIGHT * 2,
                        marginTop: constant.HEIGHT * -2,
                        width: constant.HEIGHT * 12,
                        textAlign: 'center',
                      }}>
                      {' See more'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => this.updatePrivacy('friends')}>
                    {this.state.type == 'friends' ? (
                      <Image
                        source={constant.ICONCHECK}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          tintColor: constant.BLACK,
                          alignSelf: 'center',
                        }}
                      />
                    ) : (
                      <Image
                        source={constant.ICONUNCHECK}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          tintColor: constant.BLACK,
                          alignSelf: 'center',
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: constant.HEIGHT * 4,
                  marginTop: constant.HEIGHT * 5,
                  borderColor: '#c8cfd5',
                  borderBottomWidth: constant.HEIGHT * 0.1,
                  paddingBottom: constant.HEIGHT * 4,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2.2),
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  Only Me (Private)
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: constant.HEIGHT * 2,
                  }}>
                  <TouchableOpacity style={{flex: 1.3}}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        fontFamily: constant.SUIFONT,
                        marginRight: constant.HEIGHT * 2,
                      }}>
                      {
                        'Nobody on Pink Fitness can search for you, View your full profile or your activity, You will not be able to add friends or engage in social activities.'
                      }
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => this.updatePrivacy('private')}>
                    {this.state.type == 'private' ? (
                      <Image
                        source={constant.ICONCHECK}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          tintColor: constant.BLACK,
                          alignSelf: 'center',
                        }}
                      />
                    ) : (
                      <Image
                        source={constant.ICONUNCHECK}
                        style={{
                          marginHorizontal: constant.HEIGHT * 1,
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          tintColor: constant.BLACK,
                          alignSelf: 'center',
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
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
    header: state.headerReducer,
    profile: state.profileReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({updatePrivacyAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Privacy);
