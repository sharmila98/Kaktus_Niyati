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
  Slider,
  FlatList,
} from 'react-native';
import * as Progress from 'react-native-progress';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';

import {onProfileAction} from '../../../action/Profile_Action';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

var head,
  url = '';

class Participants extends Component {
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

  componentDidMount() {}

  showEmptyListView = () => {
    return (
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: constant.responsiveFontSize(2),
            alignSelf: 'center',
            fontWeight: 'bold',
            marginTop: constant.HEIGHT * 1,
            fontFamily: constant.SUIFONT,
          }}>
          No data to display
        </Text>
      </View>
    );
  };

  _renderItem = ({item, index}) => {
    var image = Url.baseUrl + Url.images + item.image.filename;

    return (
      <View
        style={{
          borderColor: '#fbfafb',
          borderBottomWidth: constant.HEIGHT * 0.3,
          paddingBottom: constant.HEIGHT * 0.5,
        }}>
        <TouchableOpacity
          style={{
            marginLeft: constant.HEIGHT * 3,
            marginRight: constant.HEIGHT * 1.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{uri: image}}
              style={{
                width: constant.HEIGHT * 6,
                height: constant.HEIGHT * 6,
                borderRadius: constant.HEIGHT * 10,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontSize: constant.responsiveFontSize(2),
                alignSelf: 'center',
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
                marginLeft: constant.HEIGHT * 0.7,
              }}>
              {item.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={constant.ICONRANK}
              style={{
                width: constant.HEIGHT * 2.5,
                height: constant.HEIGHT * 2.5,
                alignSelf: 'center',
                tintColor: constant.BLACK,
                marginLeft: constant.HEIGHT * 1,
              }}
            />
            <Text
              style={{
                fontSize: constant.responsiveFontSize(1.5),
                alignSelf: 'center',
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
              }}>
              {item.rank}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  onClientProfile(item) {
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
            this.props.navigation.navigate('ClientProfile');
          }
        });
    }
  }

  renderItem = ({item, index}) => {
    var image =
      item.image != undefined
        ? Url.baseUrl + Url.images + item.image.filename
        : null;
    // console.error(image);
    // var pro_pic = Url.baseUrl + Url.images + image;
    // var image = Url.baseUrl + Url.images + item.image.filename;

    return (
      <View
        style={{
          borderColor: '#fbfafb',
          borderBottomWidth: constant.HEIGHT * 0.3,
          paddingBottom: constant.HEIGHT * 0.5,
          marginTop: constant.HEIGHT * 1.5,
        }}>
        <TouchableOpacity
          style={{
            marginLeft: constant.HEIGHT * 3,
            marginRight: constant.HEIGHT * 1.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => this.onClientProfile(item)}>
          <View style={{flexDirection: 'row'}}>
            {image != null ? (
              <Image
                source={{uri: image}}
                style={{
                  width: constant.HEIGHT * 6,
                  height: constant.HEIGHT * 6,
                  borderRadius: constant.HEIGHT * 10,
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Image
                source={constant.ICONPROFILEIMG}
                style={{
                  width: constant.HEIGHT * 6,
                  height: constant.HEIGHT * 6,
                  borderRadius: constant.HEIGHT * 10,
                  alignSelf: 'center',
                }}
              />
            )}
            <Text
              style={{
                fontSize: constant.responsiveFontSize(2),
                alignSelf: 'center',
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
                marginLeft: constant.HEIGHT * 0.7,
              }}>
              {item.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {item.member_id != this.props.signIn.member_id ? (
              <Image
                source={constant.ICONADDFRIEND}
                style={{
                  width: constant.HEIGHT * 2.5,
                  height: constant.HEIGHT * 2.5,
                  alignSelf: 'center',
                }}
              />
            ) : null}
            <Image
              source={constant.ICONRANK}
              style={{
                width: constant.HEIGHT * 2.5,
                height: constant.HEIGHT * 2.5,
                alignSelf: 'center',
                tintColor: constant.BLACK,
                marginLeft: constant.HEIGHT * 1,
              }}
            />
            <Text
              style={{
                fontSize: constant.responsiveFontSize(1.5),
                alignSelf: 'center',
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
              }}>
              {item.rank}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
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
                      {this.props.live.liveDetails != '' &&
                      this.props.live.liveDetails != undefined &&
                      this.props.live.liveDetails.length != 0 &&
                      this.props.live.liveDetails[0].programdata != undefined
                        ? this.props.live.liveDetails[0].programdata
                            .program_name
                        : this.props.live.upcomingLiveDetails != '' &&
                          this.props.live.upcomingLiveDetails != undefined &&
                          this.props.live.upcomingLiveDetails.length != 0 &&
                          this.props.live.upcomingLiveDetails[0].programdata !=
                            undefined
                        ? this.props.live.upcomingLiveDetails[0].programdata
                            .program_name
                        : ''}
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginRight: constant.HEIGHT * 2,
                      marginLeft: constant.HEIGHT * 3,
                      marginVertical: constant.HEIGHT * 2,
                      borderBottomWidth: constant.HEIGHT * 0.1,
                      borderColor: '#707070',
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        flex: 1,
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {'Friends'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Image
                        style={{
                          width: constant.HEIGHT * 2.5,
                          marginHorizontal: constant.HEIGHT * 0.2,
                          height: constant.HEIGHT * 2,
                          marginTop: constant.HEIGHT * 0.2,
                          // tintColor: constant.THEME,
                        }}
                        source={constant.IconFriends}
                      />
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(1.5),
                          marginHorizontal: constant.HEIGHT * 0.3,
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                        }}>
                        {this.props.live.friends.length}
                      </Text>
                    </View>
                  </View>
                  <FlatList
                    data={this.props.live.friends}
                    extraData={this.state}
                    // keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this.showEmptyListView}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginRight: constant.HEIGHT * 2,
                      marginLeft: constant.HEIGHT * 3,
                      marginVertical: constant.HEIGHT * 2,
                      borderBottomWidth: constant.HEIGHT * 0.1,
                      borderColor: '#707070',
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        flex: 1,
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {'Participants'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Image
                        style={{
                          width: constant.HEIGHT * 2.5,
                          marginHorizontal: constant.HEIGHT * 0.2,
                          height: constant.HEIGHT * 2,
                          marginTop: constant.HEIGHT * 0.2,
                          // tintColor: constant.THEME,
                        }}
                        source={constant.IconFriends}
                      />
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(1.5),
                          marginHorizontal: constant.HEIGHT * 0.3,
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                        }}>
                        {this.props.live.participants.length}
                      </Text>
                    </View>
                  </View>
                  <FlatList
                    data={this.props.live.participants}
                    extraData={this.state}
                    // keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.showEmptyListView}
                  />
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
    live: state.liveReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onProfileAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Participants);
