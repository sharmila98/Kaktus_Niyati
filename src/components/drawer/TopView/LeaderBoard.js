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

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {onLeaderBoardAction} from '../../../action/SideDrawer_action';
import {onProfileAction} from '../../../action/Profile_Action';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';


var head, url;

class LeaderBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constant: [
        {name: 'Shobana', area: 'ANNA NAGAR', rank: 120},
        {name: 'Sheeba', area: 'SALIGRAMAM', rank: 1152},
      ],
    };
  }

  componentDidMount() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.leaderBoards;

    var inputs = {
      member_id: this.props.signIn.member_id,
      start: 0,
      end: 10,
    };

    this.props.onLeaderBoardAction(head, url, methods.post, inputs);
  }

  showEmptyListView = () => {
    return <View />;
  };

  openClose(index) {
    console.log(index, this.state.userItem);
    if (index == this.state.userItem) {
      this.setState({
        userItem: -1,
      });
    } else {
      this.setState({
        userItem: index,
      });
    }
  }

  onClientProfile(item, index) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.myProfile + item.member_id;

    if (item.member_id == this.props.signIn.member_id) {
      this.props.navigation.navigate('Profile');
    } else {
      this.props
        .onProfileAction(head, url, methods.get, true)
        .then((response) => {
          if (response.status == 200) {
            this.openClose(index);
          }
        });
    }
  }

  _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          borderColor: '#fbfafb',
          borderBottomWidth: constant.HEIGHT * 0.3,
        }}>
        <TouchableOpacity
          style={{
            marginLeft: constant.HEIGHT * 3,
            marginRight: constant.HEIGHT * 1.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => {
            // this.onClientProfile(item, index);
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={constant.ICONUSERIMG}
              style={{
                width: constant.HEIGHT * 7,
                height: constant.HEIGHT * 7,
                marginVertical: constant.HEIGHT * 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                alignSelf: 'center',
                marginLeft: constant.HEIGHT * 2,
              }}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(2),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                {item.name}
              </Text>
              <View
                style={{
                  marginRight: constant.HEIGHT * 2,
                  marginTop: constant.HEIGHT * 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={constant.ICONRANK}
                    style={{
                      width: constant.HEIGHT * 2,
                      height: constant.HEIGHT * 2,
                      marginBottom: constant.HEIGHT * 0.5,
                      marginRight: constant.HEIGHT * 0.5,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.8),
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.rank}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'ios'
                        ? constant.REBOTOREGULAR
                        : constant.REBOTOREGULAR,
                    opacity: 0.5,
                    fontSize: constant.responsiveFontSize(1.5),
                    fontFamily: constant.SUIFONT,
                  }}>
                  Rank
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {this.state.userItem == index ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#FEF6F6',
              borderRadius: constant.HEIGHT * 1,
            }}>
            <View
              style={{
                flexDirection: 'row',

                marginLeft: constant.HEIGHT * 3,
                marginVertical: constant.HEIGHT * 1,
              }}>
              <Image
                source={constant.ICONPROFILEPIC}
                style={{
                  width: constant.HEIGHT * 10,
                  height: constant.HEIGHT * 10,
                  marginTop: constant.HEIGHT * 0.8,
                }}
              />
            </View>
            <View style={{alignSelf: 'center', flex: 1}}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.8),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                {this.props.profile.clientProfileDetails != undefined
                  ? this.props.profile.clientProfileDetails.name
                  : ''}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: constant.HEIGHT * 1.5,
                }}>
                <View style={{marginRight: constant.HEIGHT * 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={constant.ICONRANK}
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginBottom: constant.HEIGHT * 0.5,
                        marginRight: constant.HEIGHT * 0.5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      421
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      opacity: 0.5,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontFamily: constant.SUIFONT,
                    }}>
                    Rank
                  </Text>
                </View>
                <View style={{marginRight: constant.HEIGHT * 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={constant.ICONGYM}
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginBottom: constant.HEIGHT * 0.5,
                        marginRight: constant.HEIGHT * 0.5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      34
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      opacity: 0.5,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontFamily: constant.SUIFONT,
                    }}>
                    Sessions
                  </Text>
                </View>
                <View style={{marginRight: constant.HEIGHT * 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={constant.ICONCONTACTS}
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginBottom: constant.HEIGHT * 0.5,
                        marginRight: constant.HEIGHT * 0.5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      260
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      opacity: 0.5,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontFamily: constant.SUIFONT,
                    }}>
                    Contacts
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}
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
                      Leaderboard
                    </Text>
                  </TouchableOpacity> */}
                   <BackButtonwithTitle
                  title={'Leaderboard'}
                  underLine={true}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.goBack()}
                  
                  />
                  <FlatList
                    data={this.props.sideView.leaderBoardDetails}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index + ''}
                    ListEmptyComponent={this.showEmptyListView}
                  />
                  <View style={{height: constant.HEIGHT * 10}} />
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
    sideView: state.sideDrawerReducer,
    profile: state.profileReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onLeaderBoardAction,
      onProfileAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
