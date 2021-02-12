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
  RefreshControl,
  Alert,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import Base64 from './../../../libs/Base64/Base64';

import * as constant from '../../../utils/constants';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {RFC_2822} from 'moment';
import {updatePrivacyAction} from '../../../action/Profile_Action';
import {
  BookingAction,
  getBookingDetails,
} from '../../../action/SideDrawer_action';
import moment from 'moment';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';
import ZoomUs from 'react-native-zoom-us';

const skdKey = 'cHrk4IE3XSLjL8Nt0ZtLtxbxP9yxoN9Lx2Px';
const sdkSecret = 'PIsni2MEMwRTVOQfhWv4JiRH26axPUUPfZru';

const exampleMeeting = {
  // for both startMeeting and joinMeeting
  meetingNumber: '96040043254',

  // for startMeeting
  //   userId: '',
  //   zoomAccessToken: '',

  // for joinMeeting
  password: '967943',
};

var head,
  url = '';

var currentDate, expiryDate;

class MyBookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expiryDate: '',
    };
  }

  componentDidMount() {
    this.initZoom();
    this.onRefresh();
  }

  async initZoom() {
    const initializeResult = await ZoomUs.initialize({
      clientKey: skdKey,
      clientSecret: sdkSecret,
    });
  }

  onRefresh() {
    try {
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.myBookings + this.props.signIn.member_id;

      this.props.BookingAction(head, url, methods.get).then((res) => {
        // expiryDate = moment(res.data.data[0].date).add(21, 'days');
        // currentDate = moment(new Date());
        // this.setState({expiryDate: expiryDate.diff(currentDate, 'days')});
      });
    } catch (error) {}
  }

  async joinMeeting(item) {
    try {
      const joinMeetingResult = await ZoomUs.joinMeeting({
        userName: this.props.signIn.loginDetails.name,
        meetingNumber: item.meeting_id,
        password: Base64.decode(item.password),
      });

      console.log({joinMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute joinMeeting');
      console.error(e);
    }
  }

  isAvailable(item) {
    var date = moment(item.booking_date).add(30, 'minutes');
    return date.isAfter(new Date());
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginLeft: constant.HEIGHT * 4,
          marginVertical: constant.HEIGHT * 2,
          marginRight: constant.HEIGHT * 2,
          borderWidth: constant.HEIGHT * 0.1,
          borderColor: constant.THEME,
          borderRadius: constant.HEIGHT * 1,
          paddingHorizontal: constant.HEIGHT * 2,
          paddingVertical: constant.HEIGHT * 1.5,
        }}
        onPress={() => {
          this.props.getBookingDetails(item).then(() => {
            this.props.navigation.navigate('BookingDetails',{
              fromPay: false
            });
          });
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              flex: 0.7,
              fontSize: constant.responsiveFontSize(2),
              fontWeight: 'bold',
              fontFamily: constant.SUIFONT,
            }}>
            {item.package_details != undefined
              ? item.trans_type == 'plan'
                ? item.package_details.duration +
                  ' - ' +
                  item.package_details.type
                : item.package_details.type + ' - ' + item.booking_time
              : ''}
          </Text>

          {item.trans_type == 'booking' && this.isAvailable(item) == true ? (
            <TouchableOpacity
              onPress={() => this.joinMeeting(item)}
              style={{
                flex: 0.3,
                backgroundColor: constant.THEME,
                paddingVertical: constant.HEIGHT * 0.5,
                paddingHorizontal: constant.HEIGHT * 2,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                  color: constant.WHITE,
                  fontSize: constant.responsiveFontSize(1.6),
                }}>
                {'Join Meeting'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{flex: 0.2}} />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: constant.HEIGHT * 1,
          }}>
          <Text
            style={{
              fontSize: constant.responsiveFontSize(1.6),
              fontFamily: constant.SUIFONT,
              opacity: 0.4,
            }}>
            {item.order_id}
          </Text>
          <Image
            source={constant.ICONARROWLEFT}
            resizeMode={'contain'}
            style={{
              width: constant.HEIGHT * 2,
              height: constant.HEIGHT * 2,
              alignSelf: 'center',
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: constant.HEIGHT * 1,
          }}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                fontWeight: 'bold',
                opacity: 0.6,
              }}>
              {'Rs.' + item.amount + '/-'}
            </Text>
            <Text
              style={{
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                marginLeft: constant.HEIGHT * 1,
              }}>
              {moment(item.updated_on).format(' MMM DD, YYYY')}
            </Text>
          </View>
          {item.trans_type == 'plan' ? (
            <View
              style={{
                justifyContent: 'flex-end',
                flex: 0.5,
                flexDirection: 'row',
              }}>
              <Image
                resizeMode={'contain'}
                source={constant.ICONCLOCK}
                style={{
                  width: constant.HEIGHT * 2,
                  height: constant.HEIGHT * 2,
                  alignSelf: 'center',
                  tintColor: constant.THEME,
                }}
              />
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(1.8),
                  fontFamily: constant.SUIFONT,
                  marginLeft: constant.HEIGHT * 0.5,
                }}>
                {item.package_details != undefined
                  ? this.expiryDate(item.ends_on, item.updated_on)
                  : ''}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  expiryDate(date, created) {
    var expiryDate = moment(date);
    var currentDate = moment(created);
    var diff = expiryDate.diff(currentDate, 'days');

    console.log(diff);

    return diff == 0 ? 'Expired' : diff + ' Days Left';
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <ScrollView
              style={{flex: 0}}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.pricing.mybookingLoad}
                  onRefresh={() => this.onRefresh()}
                />
              }>
              <View
                style={{
                  backgroundColor: constant.WHITE,
                  marginVertical: constant.HEIGHT * 2.5,
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
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomWidth: constant.HEIGHT * 0.1,
                      borderColor: '#707070',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.5,
                        fontWeight: 'bold',

                        fontFamily: constant.SUIFONT,
                      }}>
                      My Bookings
                    </Text>
                    <Image
                      source={constant.ICONMENU}
                      style={{
                        marginHorizontal: constant.HEIGHT * 1,
                        width: constant.HEIGHT * 3,
                        height: constant.HEIGHT * 3,
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </TouchableOpacity> */}
                <BackButtonwithTitle
                  title={'My Bookings'}
                  underLine={true}
                  rightTextEnable={false}
                  notificationIcon={false}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightIcon={constant.ICONMENU}
                  // onPressRightIcon={() => this.props.navigation.goBack()}
                  backButton={() => this.props.navigation.goBack()}
                />
                <FlatList
                  data={this.props.pricing.bookingDetails}
                  extraData={this.state}
                  renderItem={this._renderItem}
                  keyExtractor={(item, index) => index + ''}
                  ListEmptyComponent={this.showEmptyListView}
                  ListHeaderComponent={<View />}
                  ListFooterComponent={<View />}
                />
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
    header: state.headerReducer,
    pricing: state.pricingReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {updatePrivacyAction, BookingAction, getBookingDetails},
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MyBookings);

function getOrdinalNum(n) {
  n = parseInt(n);
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
}
