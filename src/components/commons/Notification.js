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
  ToastAndroid,
} from 'react-native';

// import Slider from '@react-native-community/slider';

import * as constant from './../../utils/constants';
import Header from './../commons/Header';
import StatusBar from './../commons/StatusBar';
import {onProfileAction} from './../../action/Profile_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from './../../NetworkConfig/ApiUrlConstatnts';

import {onContactListAction} from './../../action/SideDrawer_action';
import {onNotificationAction} from './../../action/Header_Action';
import BackButtonwithTitle from './../commons/BackButtonwithTitle';

var head,
  url = '';

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userItem: -1,
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
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

  onRequest(item, type) {
    // console.error(item);
    var head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    url = Url.baseUrl + Url.clientContact;

    var inputs = {
      member_id: this.props.signIn.member_id,
      request_id: item.receiver_id,
      type: type,
    };

    this.props
      .onContactListAction(head, url, methods.post, inputs)
      .then((res) => {
        constant.toastAlert(res.data.message, ToastAndroid.LONG);
        this.props.navigation.navigate('Home');
      });
  }

  _renderItem = ({item, index}) => {
    var image =
      item.image != undefined
        ? Url.baseUrl + Url.images + item.image.filename
        : null;

    return item.type == 'request' ? (
      <View
        style={{
          borderColor: '#00000029',
          borderBottomWidth: constant.HEIGHT * 0.1,
          borderTopWidth: constant.HEIGHT * 0.1,
          marginVertical: constant.HEIGHT * 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          {image != null ? (
            <Image
              source={{uri: image}}
              style={{
                width: constant.HEIGHT * 8,
                height: '100%',
                alignSelf: 'center',
                borderRadius: constant.HEIGHT * 2.5,
                marginLeft: constant.HEIGHT * 2,
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
          <View
            style={{
              marginLeft: constant.HEIGHT * 2,
              alignSelf: 'center',
              // flex: 0.5,
            }}>
            <Text
              style={{
                color: '#5D5C5C',
                fontWeight: 'bold',
                fontSize: constant.responsiveFontSize(2.2),
                fontFamily: constant.SUIFONT,
              }}>
              {item.clientname}
            </Text>
            <View
              style={{flexDirection: 'row', marginTop: constant.HEIGHT * 1}}>
              <Image
                style={{
                  width: constant.HEIGHT * 2.5,
                  height: constant.HEIGHT * 2,
                  alignSelf: 'center',
                  tintColor: '#6D6A6A',
                }}
                source={constant.IconFriends}
              />
              <Text
                style={{
                  marginHorizontal: constant.HEIGHT * 0.5,
                  alignSelf: 'center',
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.6),
                  fontFamily: constant.SUIFONT,
                }}>
                {item.message}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', marginTop: constant.HEIGHT * 1}}>
              <Image
                style={{
                  width: constant.HEIGHT * 1.8,
                  height: constant.HEIGHT * 2,
                  alignSelf: 'center',

                  tintColor: '#6D6A6A',
                }}
                source={constant.ICONCONTACTS}
              />
              <Text
                style={{
                  marginHorizontal: constant.HEIGHT * 0.5,
                  alignSelf: 'center',
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.6),
                  fontFamily: constant.SUIFONT,
                }}>
                Requested
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-end',
            paddingVertical: constant.HEIGHT * 1.5,
            marginRight: constant.HEIGHT * 1.5,
          }}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              backgroundColor: constant.THEME,
              paddingVertical: constant.HEIGHT * 1,
              // paddingHorizontal: constant.HEIGHT * 2,
              borderRadius: constant.HEIGHT * 1,
              width: constant.HEIGHT * 12,
              alignItems: 'center',
            }}
            onPress={() => this.onRequest(item, 'accepted')}>
            <Text
              style={{
                color: constant.WHITE,
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                fontWeight: 'bold',
              }}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 1,
              paddingVertical: constant.HEIGHT * 1,
              width: constant.HEIGHT * 12,
              alignItems: 'center',
              borderRadius: constant.HEIGHT * 1,
              backgroundColor: '#959191',
            }}
            onPress={() => this.onRequest(item, 'rejected')}>
            <Text
              style={{
                color: constant.WHITE,
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                fontWeight: 'bold',
              }}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : item.type == 'message' ? (
      <View
        style={{
          borderColor: '#00000029',
          borderBottomWidth: constant.HEIGHT * 0.1,
          borderTopWidth: constant.HEIGHT * 0.1,
          marginVertical: constant.HEIGHT * 1,
          paddingVertical: constant.HEIGHT * 0.5,
          backgroundColor: item.read == true ? constant.WHITE : '#f2f5f8',
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          {image != null ? (
            <Image
              source={{uri: image}}
              style={{
                width: constant.HEIGHT * 8,
                height: '100%',
                alignSelf: 'center',
                borderRadius: constant.HEIGHT * 2.5,
                marginLeft: constant.HEIGHT * 2,
              }}
            />
          ) : (
            <Image
              source={constant.ICONPROFILEIMG}
              style={{
                width: constant.HEIGHT * 8,
                height: constant.HEIGHT * 8,
                tintColor: constant.GREY,
                marginLeft: constant.HEIGHT * 2,

                alignSelf: 'center',
              }}
            />
          )}

          <Text
            style={{
              marginHorizontal: constant.HEIGHT * 0.5,
              alignSelf: 'center',
              color: '#5D5C5C',
              flex: 0.8,
              fontSize: constant.responsiveFontSize(1.6),
              fontFamily: constant.SUIFONT,
              marginRight: constant.HEIGHT * 2,
              marginLeft: constant.HEIGHT * 1,
            }}>
            {item.message}
          </Text>

          <Image
            source={constant.ICONCLAP}
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              marginLeft: constant.HEIGHT * 2,
              alignSelf: 'center',
              tintColor: '#d9d9d9',
            }}
          />

          {/* <View
            style={{
              marginLeft: constant.HEIGHT * 2,
              alignSelf: 'center',
              // flex: 0.5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: constant.HEIGHT * 1,
                marginHorizontal: constant.HEIGHT * 2,
              }}>
              {image != null ? (
                <Image
                  source={{uri: image}}
                  style={{
                    width: constant.HEIGHT * 8,
                    height: '100%',
                    alignSelf: 'center',
                    borderRadius: constant.HEIGHT * 2.5,
                    marginLeft: constant.HEIGHT * 2,
                  }}
                />
              ) : (
                <Image
                  source={constant.ICONPROFILEIMG}
                  style={{
                    width: constant.HEIGHT * 6,
                    height: constant.HEIGHT * 6,
                    borderRadius: constant.HEIGHT * 10,
                    tintColor: constant.GREY,
                    alignSelf: 'center',
                  }}
                />
              )}
              <Text
                style={{
                  marginHorizontal: constant.HEIGHT * 0.5,
                  alignSelf: 'center',
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.6),
                  fontFamily: constant.SUIFONT,
                  marginRight: constant.HEIGHT * 2,
                }}>
                {item.message}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', marginTop: constant.HEIGHT * 1}}>
              <Image
                style={{
                  width: constant.HEIGHT * 1.8,
                  height: constant.HEIGHT * 2,
                  alignSelf: 'center',

                  tintColor: '#6D6A6A',
                }}
                source={constant.ICONCONTACTS}
              />
              <Text
                style={{
                  marginHorizontal: constant.HEIGHT * 0.5,
                  alignSelf: 'center',
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.6),
                  fontFamily: constant.SUIFONT,
                }}>
                Requested
              </Text>
            </View>
          </View> */}
        </View>

        {/* <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-end',
            paddingVertical: constant.HEIGHT * 1.5,
            marginRight: constant.HEIGHT * 1.5,
          }}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              backgroundColor: constant.THEME,
              paddingVertical: constant.HEIGHT * 1,
              // paddingHorizontal: constant.HEIGHT * 2,
              borderRadius: constant.HEIGHT * 1,
              width: constant.HEIGHT * 12,
              alignItems: 'center',
            }}
            onPress={() => this.onRequest(item, 'accepted')}>
            <Text
              style={{
                color: constant.WHITE,
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                fontWeight: 'bold',
              }}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 1,
              paddingVertical: constant.HEIGHT * 1,
              width: constant.HEIGHT * 12,
              alignItems: 'center',
              borderRadius: constant.HEIGHT * 1,
              backgroundColor: '#959191',
            }}
            onPress={() => this.onRequest(item, 'rejected')}>
            <Text
              style={{
                color: constant.WHITE,
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                fontWeight: 'bold',
              }}>
              Reject
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    ) : null;
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
                  }}>
                  {/* <TouchableOpacity
                    onPress={() => {
                      head = {
                        accept: 'application/json',
                        Authorization: this.props.signIn.token,
                      };

                      url =
                        Url.baseUrl +
                        Url.notification +
                        this.props.signIn.member_id +
                        '/' +
                        'all';

                      this.props
                        .onNotificationAction(head, url, methods.get)
                        .then((res) => {
                          if (res.status == 200) {
                            this.props.navigation.goBack();
                          }
                        });
                    }}
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
                    <Image
                      style={{
                        alignSelf: 'center',
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2.5,
                      }}
                      source={constant.ICONNOTIFICATION}
                    />
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        fontWeight: 'bold',
                        marginLeft: constant.HEIGHT * 1,
                        fontFamily: constant.SUIFONT,
                      }}>
                      Notifications
                    </Text>
                  </TouchableOpacity> */}
                  <BackButtonwithTitle
                    title={'Notifications'}
                    underLine={false}
                    icon={constant.ICONARROWORANGE}
                    notificationIcon={true}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    backButton={() => {
                      head = {
                        accept: 'application/json',
                        Authorization: this.props.signIn.token,
                      };

                      url =
                        Url.baseUrl +
                        Url.notification +
                        this.props.signIn.member_id +
                        '/' +
                        'all';

                      this.props
                        .onNotificationAction(head, url, methods.get)
                        .then((res) => {
                          if (res.status == 200) {
                            this.props.navigation.goBack();
                          }
                        });
                    }}
                  />
                  <FlatList
                    data={this.props.header.notificationList}
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
    header: state.headerReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({onContactListAction, onNotificationAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
