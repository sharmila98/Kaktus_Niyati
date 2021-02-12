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
  LayoutAnimation,
  SafeAreaView,
} from 'react-native';

import * as constant from '../../utils/constants';

import StatusBar from './StatusBar';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  notificationMarkRead,
  onNotificationAction,
} from './../../action/Header_Action';

import {Url, methods} from './../../NetworkConfig/ApiUrlConstatnts';

class Header extends Component {
  static navigationOptions = {
    title: 'Header',
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // console.error(this.props.navigation)
  }

  onNotification() {
    var head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    var url = Url.baseUrl + Url.notificationRead + this.props.signIn.member_id;

    // var inputs = {
    //   member_id: this.props.signIn.member_id,
    //   request_id: item.receiver_id,
    //   type: type,
    // };

    // this.props.navigation.navigate('Notification');

    this.props.notificationMarkRead(head, url, methods.post).then((res) => {
      if (res.status == 200) {
        this.props.navigation.navigate('Notification');
      }
    });
  }

  render() {
    return (
      <View>
        <StatusBar backgroundColor={constant.THEME} overRelay={false} />
        <View
          style={{
            // flex: 0.06,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            // backgroundColor: 'red',
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 1,
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
              flex: 0.3,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginLeft: constant.HEIGHT * 1,
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                marginLeft: constant.HEIGHT * 1,
                padding: constant.HEIGHT * 0.2,
                borderRadius: constant.HEIGHT * 5,
                borderColor: constant.THEME,
                borderWidth: constant.HEIGHT * 0.3,
              }}
              onPress={() =>
                this.props.onPress != undefined && this.props.onPress == false
                  ? this.props.onPress == null
                    ? null
                    : this.props.navigation.navigate('Profile')
                  : this.props.navigation.toggleDrawer()
              }>
              <Image
                style={{
                  alignSelf: 'flex-end',
                  width: constant.HEIGHT * 4,
                  height: constant.HEIGHT * 4,
                  tintColor: constant.GREY,
                }}
                source={constant.ICONPROFILEIMG}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode={'contain'}
              style={{
                alignSelf: 'center',
                width: constant.HEIGHT * 20,
                height: constant.HEIGHT * 3,
              }}
              source={constant.PINKHEADERICON}
            />
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {this.props.showIcons != undefined &&
            this.props.showIcons == false ? null : (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{padding: constant.HEIGHT * 1}}
                  onPress={() => this.props.navigation.navigate('Search')}>
                  <Image
                    resizeMode={'contain'}
                    style={{
                      alignSelf: 'flex-end',
                      width: constant.HEIGHT * 3.5,
                      height: constant.HEIGHT * 3.5,
                      tintColor: constant.BLACK,
                      opacity: 0.4,
                    }}
                    source={constant.ICONSEARCH}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{padding: constant.HEIGHT * 1, flexDirection: 'row'}}
                  onPress={() => this.onNotification()}>
                  <Image
                    style={{
                      alignSelf: 'flex-end',
                      width: constant.HEIGHT * 3.5,
                      height: constant.HEIGHT * 3.5,
                      tintColor: constant.BLACK,
                      opacity: 0.4,
                    }}
                    source={constant.ICONNOTIFICATION}
                  />
                  {this.props.header.notificationCount > 0 ? (
                    <Text
                      style={{
                        position: 'absolute',
                        fontWeight: 'bold',
                        fontSize: constant.responsiveFontSize(1.2),
                        color: constant.WHITE,
                        fontFamily: constant.SUIFONT,
                        right: 3,
                        top: 3,
                        backgroundColor: constant.THEME,
                        textAlign: 'center',
                        borderRadius: constant.HEIGHT * 25,
                        height: constant.HEIGHT * 2,
                        width: constant.HEIGHT * 2,
                      }}>
                      {this.props.header.notificationCount}
                    </Text>
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity style={{padding: constant.HEIGHT * 1}}>
                  <Image
                    style={{
                      alignSelf: 'flex-end',
                      width: constant.HEIGHT * 3.5,
                      height: constant.HEIGHT * 3.5,
                      tintColor: constant.BLACK,
                      opacity: 0.4,
                    }}
                    source={constant.ICONHELP}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    home: state.homeReducer,
    signIn: state.signupReducer,
    live: state.liveReducer,
    home: state.homeReducer,
    header: state.headerReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({notificationMarkRead, onNotificationAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
