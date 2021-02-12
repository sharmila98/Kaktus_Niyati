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
  Animated,
  Easing,
  ImageBackground,
  RefreshControl,
  ScrollView,
} from 'react-native';
// import { constant } from "lodash";
import Header from '../../commons/Header';

import * as constant from '../../../utils/constants';
import StatusBar from '../../commons/StatusBar';
import Pie from '../../../libs/Pie';
import moment from 'moment';
import {Dimensions} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
// import {PieChart} from 'react-native-svg-charts';
import {Circle, G, Svg, Line, Rect} from 'react-native-svg';
import * as d3 from 'd3';
import * as img from 'react-native-svg';

import {onWorkoutDashBoard} from '../../../action/DashBoard_Action';
import {
  onLiveDashboard,
  onLiveProgramAction,
  onParticipantAction,
  onProgramViewAction,
} from '../../../action/Live_Action';
import Orientation from 'react-native-orientation';

// import DatePicker from 'react-native-date-picker';/
const pieImgs = [constant.ICONGYM, constant.ICONSTATS, constant.SPINDIET];
const screenWidth = Dimensions.get('window').width;

const GRAPH_MARGIN = 20;
const GRAPH_BAR_WIDTH = 5;
const colors = {
  axis: constant.THEME,
  bars: constant.THEME,
};

var currentMonth,
  currentDate,
  currentWeek,
  previousWeak = [],
  futureWeek = '',
  previousWeakCount,
  previousWeakName,
  previousMonth = 13,
  previousMonthName = 13,
  futureMonth = 0,
  futureMonthName = 0,
  position = 2;

currentMonth = new Date().getMonth() + 1;
currentDate = new Date().getDate();
currentWeek = getWeek();
previousWeak = weekCount(new Date().getFullYear(), new Date().getMonth()) + 1;
futureWeek = 0;

var head,
  url,
  live_image = '';

class Live extends Component {
  static navigationOptions = {
    title: 'Dashboard',
  };
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
    var inputRange = [0, 1];
    var outputRange = ['0deg', '120deg'];
    this.rotate1 = this.animated.interpolate({inputRange, outputRange});
    inputRange = [1, 2];
    outputRange = ['120deg', '240deg'];
    this.rotate2 = this.animated.interpolate({inputRange, outputRange});
    inputRange = [2, 3];
    outputRange = ['240deg', '360deg'];
    this.rotate3 = this.animated.interpolate({inputRange, outputRange});
    this.state = {
      pieData,
      calendar: 'Day',
      pickerValue: '',
      modalVisible: false,
      currentWeek: '',
      perivousWeak: '',
      transform: [{rotate: this.rotate1}],
      toValue: 1,
      image: '',
      data: [],
      selectedDate :moment(new Date()).format('YYYY-MM-DD'),
    };
    const data = [50, 20, 4, 10];
    const colors = ['A40E4C', '2C2C54', 'ACC3A6', 'F5D6BA'];

    const pieData = data
      .filter((value) => value > 0)
      .map((value, index) => {
        const toRet = {
          value,
          title: `title-${index}`,
          color: `#${colors[index]}`,
          key: `pie-${index}`,
        };
        return toRet;
      });
  }

  componentDidUpdate() {
    Orientation.lockToPortrait();
  }

  componentDidMount() {
    currentMonth = new Date().getMonth() + 1;
    currentDate = new Date().getDate();

    Orientation.lockToPortrait();

    var inputs = {
      data: {
        date: moment(new Date()).format('YYYY-MM-DD'),
        // weekstart: moment(new Date()).startOf('week').format('YYYY-MM-DD'),
        // weekend: moment(new Date()).endOf('week').format('YYYY-MM-DD'),
        // month: moment(new Date()).format('YYYY-MM-DD'),
      },
      member_id: this.props.signIn.member_id,
      type: 'day',
    };

    this.onLiveDashboard(inputs);
  }

  onLiveDashboard(inputs) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.liveDashboard;

    this.props.onLiveDashboard(head, url, methods.post, inputs).then((res) => {
      if (res.status == 200) {
        if (inputs.type == 'day') {
          // var banner_image =
          //   res.data.data.live[0] != '' &&
          //   res.data.data.live[0] != undefined &&
          //   res.data.data.live[0].length != 0 &&
          //   res.data.data.live[0].programdata != undefined
          //     ? res.data.data.live[0].programdata.banner_image.filename
          //     : res.data.data.upcoming[0].programdata != undefined &&
          //       res.data.data.upcoming[0].programdata.banner_image != undefined
          //     ? res.data.data.upcoming[0].programdata.banner_image.filename
          //     : '';

          // live_image = Url.baseUrl + Url.images + banner_image;

          // this.props.navigation.navigate('LiveVideoStream');

          this.setState({image: live_image}, () => {});
        } else if (inputs.type == 'week') {
          res.data.data != undefined
            ? res.data.data.weekdata != undefined
              ? res.data.data.weekdata.filter((item, index) => {
                  this.setState(
                    {
                      data: [...this.state.data, parseInt(item.cals)],
                    },
                    () => console.log(this.state.data),
                  );
                })
              : ''
            : '';
        }
      }
      // console.error(live_image);

      // console.error(Url.baseUrl + Url.images + res.data.data.live[0].programdata.banner_image.filename);
    });
  }

  onParticipant(type) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    var program_id =
      this.props.live.liveDetails.length != 0
        ? this.props.live.liveDetails[0].programdata._id
        : this.props.live.upcomingLiveDetails.length != 0
        ? this.props.live.upcomingLiveDetails[0].programdata._id
        : null;

    url =
      Url.baseUrl +
      Url.liveParticipant +
      this.props.signIn.member_id +
      '/' +
      program_id +
      '/' +
      type;

    this.props.onParticipantAction(head, url, methods.get).then((res) => {
      if (res.status == 200) {
        this.props.navigation.navigate('Participants');
      }
    });
  }

  animate() {
    Animated.timing(this.animated, {
      toValue: this.state.toValue,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
    setTimeout(() => {
      if (this.state.toValue == 1) {
        this.setState({transform: [{rotate: this.rotate2}]});
        this.setState({toValue: 2});
      } else if (this.state.toValue == 2) {
        this.setState({transform: [{rotate: this.rotate3}]});
        this.setState({toValue: 3});
      } else if (this.state.toValue == 3) {
        this.setState({transform: [{rotate: this.rotate1}]});
        this.setState({toValue: 1});
      }
    }, 500);
  }

  getWeek(previous, isPrevious) {
    var prefixes = [1, 2, 3, 4, 5];

    if (isPrevious == true) {
      return prefixes[
        Math.floor(
          moment(new Date()).subtract(previous, 'week').format('DD') / 7,
        )
      ];
    } else {
      return prefixes[
        Math.floor(moment(new Date()).add(previous, 'week').format('DD') / 7)
      ];
    }
  }

  getPreviousWeakCount(value) {
    // console.error(new Date().getDate() / 7);

    var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      prefixes = [1, 2, 3, 4, 5];

    var no =
      new Date(moment(new Date()).subtract(3, 'week').format('DD')).getDate() /
      7;

    console.log(
      prefixes[
        Math.floor(
          new Date(
            moment(new Date()).subtract(value, 'week').format('DD'),
          ).getDate() / 7,
        )
      ],
    );

    // console.error(
    //   new Date(moment(new Date()).subtract(3, 'week').format('DD')).getDate() /
    //     7,
    // );

    var year = new Date().getFullYear();
    var month = new Date().getMonth();

    var week = Number(currentWeek) - value;
    if (week <= 0) {
      if (currentMonth == 1) {
        previousWeak = weekCount(year - 1, month);
        return previousWeak;
      } else {
        previousWeakCount = previousWeak - position;
        position--;
        // console.error(previousWeak);
        return previousWeakCount;
      }
    } else {
      position--;
      return week;
    }
  }

  getPreviousMonthName(value) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;

    var week = Number(currentWeek) - value;

    if (week <= 0) {
      if (currentMonth == 1) {
        return this.getMonth(12);
      } else {
        return this.getMonth(month - 1);
      }
    } else {
      return this.getMonth(month);
    }
  }

  getDate(previous, isPrevious) {
    // var today = currentDate;
    var dayName = '';
    if (isPrevious == true) {
      dayName = moment(new Date()).subtract(previous, 'day').format('ddd');
    } else {
      dayName = moment(new Date()).add(previous, 'day').format('ddd');
    }

    return dayName;
  }

  onLiveDetails(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.liveProgramView +
      item.programdata._id +
      '/' +
      this.props.signIn.member_id;

    // console.error(url);

    this.props.onProgramViewAction(head, url, methods.get).then((res) => {
      if (res.status == 200) {
        this.onLiveEnroll(item, 'participate');
        this.props.navigation.navigate('LiveVideoStream');
      }
    });
  }

  onLiveEnroll(item, type) {
    if (item != undefined) {
      // console.error(item.programdata._id);item.programdata._iditem.programdata._id + +
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url =
        Url.baseUrl +
        Url.enrollLive +
        this.props.signIn.member_id +
        '/' +
        item.programdata._id +
        '/' +
        type;

      this.props.onLiveProgramAction(head, url, methods.get);
    }
  }

  renderVideo = ({item, index}) => {
    var image = '';
    var banner_image =
      item.programdata != undefined &&
      item.programdata.banner_image != undefined
        ? item.programdata.banner_image.filename
        : '';
    image = Url.baseUrl + Url.images + banner_image;

    return (
      <TouchableOpacity
        onPress={() => this.onLiveEnroll(item, 'enroll')}
        style={{
          marginTop: constant.HEIGHT * 1,
          width: constant.WIDTH * 90,
          height: constant.HEIGHT * 23,
          alignSelf: 'center',
        }}>
        <ImageBackground
          resizeMode={'contain'}
          style={{
            width: constant.WIDTH * 85,
            height: constant.HEIGHT * 23,
            borderBottomLeftRadius: constant.HEIGHT * 1,
            borderBottomRightRadius: constant.HEIGHT * 1,
            borderTopRightRadius: constant.HEIGHT * 1,
            borderTopLeftRadius: constant.HEIGHT * 1,
            overflow: 'hidden',
          }}
          source={{uri: image}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                padding: constant.HEIGHT * 2,
              }}>
              <View style={{flex: 0.96}}>
                <Text
                  style={{
                    width: constant.WIDTH * 13,
                    borderRadius: constant.HEIGHT * 0.5,
                    paddingHorizontal: constant.HEIGHT * 0.5,
                    color: constant.WHITE,
                    textAlign: 'center',
                    fontSize: constant.responsiveFontSize(1.5),
                    fontWeight: 'bold',
                    backgroundColor: '#8FC427',
                    fontFamily: constant.SUIFONT,
                  }}>
                  {item.programdata != undefined &&
                  item.programdata.banner_image != undefined
                    ? item.programdata.level
                    : ''}
                </Text>
              </View>
              {/* <TouchableOpacity
                onPress={() => console.log('f')}
                style={{
                  flex: 0.04,
                  alignSelf: 'center',
                  alignItems: 'center',
                  padding: constant.HEIGHT * 0.5,
                }}>
                <Image
                  style={{
                    width: constant.HEIGHT * 2,
                    height: constant.HEIGHT * 2,
                  }}
                  source={constant.ICONBOOKMARK}
                />
              </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: constant.HEIGHT * 10.5,
              }}>
              <View style={{alignSelf: 'flex-end', flex: 0.7}}>
                <Text
                  style={{
                    borderRadius: constant.HEIGHT * 0.5,
                    paddingHorizontal: constant.HEIGHT * 1.5,
                    color: constant.WHITE,
                    opacity: 0.8,
                    textAlign: 'left',
                    fontSize: constant.responsiveFontSize(2.5),
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  {item.programdata != undefined &&
                  item.programdata.banner_image != undefined
                    ? item.programdata.program_name
                    : ''}
                </Text>
              </View>
              {/* <TouchableOpacity
                onPress={() => console.log('fd')}
                style={{
                  flexDirection: 'row',
                  flex: 0.3,
                  paddingHorizontal: constant.HEIGHT * 1,
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                <Image
                  style={{
                    width: constant.HEIGHT * 2,
                    height: constant.HEIGHT * 2,
                  }}
                  source={constant.ICONDIET}
                />
                <Text
                  style={{
                    borderRadius: constant.HEIGHT * 0.5,
                    paddingHorizontal: constant.HEIGHT * 1,
                    color: constant.WHITE,
                    opacity: 0.8,
                    textAlign: 'center',
                    fontSize: constant.responsiveFontSize(1.5),
                    fontWeight: 'bold',
                  }}>
                  30 Days
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  getFutureWeak(value) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var total = weekCount(year, month + 1);

    var weak = Number(currentWeek) + value;
    // console.error(weak);

    if (weak > total) {
      if (currentMonth == 12) {
        futureWeek = 1;
        return futureWeek;
      } else {
        // futureWeek = futureWeek + 1;
        // console.error(futureWeek);
        return futureWeek;
      }
    } else {
      // console.error(weak);
      return weak;
    }
  }

  getPreviousMonth(value) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;

    var week = Number(currentWeek) - value;

    if (week == 0) {
      if (currentMonth == 1) {
        previousWeak = this.weekCount(year - 1, 12);
        return this.getMonth(12);
      } else {
        previousWeak = previousWeak - 1;

        return this.getMonth(month - 1);
      }
    } else {
      return this.getMonth(month);
    }

    // if (previousWeak[index] == 0) {
    //   if (currentMonth == 1) {
    //     perivousYear = new Date().getFullYear - 1;
    //     perivousMonth = 12;

    //     // previousWeak = [...previousWeak, this.weekCount(perivousYear, perivousMonth)];

    //     return this.weekCount(perivousYear, perivousMonth);
    //   } else {
    //     perivousMonth = new Date().getMonth - 1;
    //     perivousYear = new Date().getFullYear;

    //     return this.weekCount(perivousYear, perivousMonth);
    //   }
    // } else {
    //   // console.error(Number(currentWeek) - value, currentWeek);

    //   previousWeak = [...previousWeak, previousWeak[index] - value];

    //   return previousWeak[index];
    // }
  }

  getFutureMonth(value) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var total = weekCount(year, month);

    var weak = Number(currentWeek) + value;

    if (weak > total) {
      if (currentMonth == 12) {
        futureWeek = 1;
        return this.getMonth(1);
      } else {
        futureWeek = futureWeek + 1;
        return this.getMonth(month + 1);
      }
    } else {
      return this.getMonth(month);
    }
  }

  getMonthNumber(value, isPrevious, position) {
    if (isPrevious) {
      if (value > 0 && value < 13) {
        return value;
      } else if (value <= 0) {
        previousMonth = previousMonth - 1;
        return previousMonth;
      }
    } else {
      if (value > 0 && value < 13) {
        return value;
      } else if (value >= 12) {
        futureMonth = futureMonth + 1;
        return futureMonth;
      }
    }
  }

  getMonth(currentMonth) {
    // moment(new Date()).subtract(previous, 'month').format('MMM');

    if (currentMonth <= 0) {
      previousMonthName = previousMonthName - 1;
      currentMonth = previousMonthName;
    } else if (currentMonth >= 13) {
      futureMonthName = futureMonthName + 1;
      currentMonth = futureMonthName;
    }
    var month = '';
    switch (currentMonth) {
      case 1:
        month = 'Jan';
        break;
      case 2:
        month = 'Feb';
        break;
      case 3:
        month = 'Mar';
        break;
      case 4:
        month = 'Apr';
        break;
      case 5:
        month = 'May';
        break;
      case 6:
        month = 'June';
        break;
      case 7:
        month = 'July';
        break;
      case 8:
        month = 'Aug';
        break;
      case 9:
        month = 'Sep';
        break;
      case 10:
        month = 'Oct';
        break;
      case 11:
        month = 'Nov';
        break;
      case 12:
        month = 'Dec';
        break;
    }
    return month;
  }

  showDate() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: constant.HEIGHT * 2,
          height: constant.HEIGHT * 7,
        }}>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).subtract(3, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).subtract(3, 'day').format('YYYY-MM-DD');
            var inputs = {
              data: {
                date: tomorrow,
              },
              member_id: this.props.signIn.member_id,
              type: 'day',
            };
            this.setState({selectedDate: tomorrow}, () => {
              this.onLiveDashboard(inputs);
            });
            // console.error(new Date(tomorrow).getDate());
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(3, true)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(3, 'day').format('DD')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).subtract(2, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).subtract(2, 'day').format('YYYY-MM-DD');
            var inputs = {
              data: {
                date: tomorrow,
              },
              member_id: this.props.signIn.member_id,
              type: 'day',
            };
            this.setState({selectedDate: tomorrow}, () => {
              this.onLiveDashboard(inputs);
            });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(2, true)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(2, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).subtract(1, 'day').format('YYYY-MM-DD');
            var inputs = {
              data: {
                date: tomorrow,
              },
              member_id: this.props.signIn.member_id,
              type: 'day',
            };
            this.setState({selectedDate: tomorrow}, () => {
              this.onLiveDashboard(inputs);
            });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(1, true)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(1, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.THEME,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).format('YYYY-MM-DD');
            var inputs = {
              data: {
                date: tomorrow,
              },
              member_id: this.props.signIn.member_id,
              type: 'day',
            };
            this.setState({selectedDate: tomorrow}, () => {
              this.onLiveDashboard(inputs);
            });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT, color: constant.WHITE,}}>
            {this.getDate(0)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
            {moment(new Date()).format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).add(1, 'day').format('YYYY-MM-DD');
            var inputs = {
              data: {
                date: tomorrow,
              },
              member_id: this.props.signIn.member_id,
              type: 'day',
            };
            this.setState({selectedDate: tomorrow}, () => {
              this.onLiveDashboard(inputs);
            });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(1, false)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(1, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).add(2, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).add(2, 'day').format('YYYY-MM-DD');
            var inputs = {
              data: {
                date: tomorrow,
              },
              member_id: this.props.signIn.member_id,
              type: 'day',
            };
            this.setState({selectedDate: tomorrow}, () => {
              this.onLiveDashboard(inputs);
            });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(2, false)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(2, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            shadowOffset:
              Platform.OS === 'ios'
                ? {
                    width: 0,
                    height: constant.HEIGHT * 2,
                  }
                : null,
            shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).add(3, 'day').format('YYYY-MM-DD');
            var inputs = {
              data: {
                date: tomorrow,
              },
              member_id: this.props.signIn.member_id,
              type: 'day',
            };
            this.setState({selectedDate: tomorrow}, () => {
              this.onLiveDashboard(inputs);
            });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(3, false)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(3, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  showWeek() {
    position = 2;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: constant.HEIGHT * 2,
          height: constant.HEIGHT * 7,
        }}>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).subtract(3, 'week').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {'wk' + this.getWeek(3, true)}
          </Text>
        </View>

        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).subtract(2, 'week').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {'wk' + this.getWeek(2, true)}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).subtract(1, 'week').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {'wk' + this.getWeek(1, true)}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {'wk' + this.getWeek(0, true)}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).add(1, 'week').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {'wk' + this.getWeek(1, false)}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).add(2, 'week').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {'wk' + this.getWeek(2, false)}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).add(3, 'week').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {'wk' + this.getWeek(3, false)}
          </Text>
        </View>
      </View>
    );
  }

  showMonth() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: constant.HEIGHT * 2,
          height: constant.HEIGHT * 7,
        }}>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).subtract(3, 'month').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(3, 'month').format('MM')}
          </Text>
        </View>

        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).subtract(2, 'month').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(2, 'month').format('MM')}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).subtract(1, 'month').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(1, 'month').format('MM')}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).format('MM')}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).add(1, 'month').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(1, 'month').format('MM')}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).add(2, 'month').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(2, 'month').format('MM')}
          </Text>
        </View>
        <View
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.WHITE,
            borderColor: constant.WHITECOLOR,
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {moment(new Date()).add(3, 'month').format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(3, 'month').format('MM')}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const SVGHeight = 150;
    const SVGWidth = 300;
    const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
    const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;
    const data = [
      {label: 'Sun', value: 250},
      {label: 'Mon', value: 312},
      {label: 'Tue', value: 270},
      {label: 'Wed', value: 350},
      {label: 'Thur', value: 89},
      {label: 'Fri', value: 150},
      {label: 'Sat', value: 190},
    ];

    // X scale point
    const xDomain = data.map((item) => item.label);
    const xRange = [0, graphWidth];
    const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);
    const xValue = d3.scalePoint().domain(xDomain).range(xRange).padding(0.5);

    // Y scale linear
    const maxValue = d3.max(data, (d) => d.value);
    const topValue = Math.ceil(maxValue / 100) * 100;
    const yDomain = [0, topValue];
    const yRange = [0, graphHeight];
    const y = d3.scaleLinear().domain(yDomain).range(yRange);
    var value = 0;
    // top axis and middle axis
    const middleValue = topValue / 2;

    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />
            <View style={{flex: 0}}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={this.props.live.liveLoad} />
                }>
                <View>
                  <View
                    style={{
                      marginHorizontal: constant.HEIGHT * 2,
                      paddingVertical: constant.HEIGHT * 3,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          opacity: 0.5,
                          fontFamily: constant.SUIFONT,
                        }}>
                        {moment(new Date()).format('MMMM DD, YYYY')}
                      </Text>
                      <TouchableOpacity
                        style={{
                          borderColor: constant.THEME,
                          borderWidth: constant.HEIGHT * 0.2,
                          borderRadius: constant.HEIGHT * 0.5,
                          padding: constant.HEIGHT * 0.5,
                          paddingLeft: constant.HEIGHT * 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => this.setState({modalVisible: true})}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            opacity: 0.5,
                            fontFamily: constant.SUIFONT,
                          }}>
                          {this.state.calendar}
                        </Text>
                        <Image
                          style={{
                            marginLeft: constant.HEIGHT * 6,
                            width: constant.HEIGHT * 2,
                            height: constant.HEIGHT * 2,
                          }}
                          source={constant.ICONARROWDOWN}
                        />
                      </TouchableOpacity>
                    </View>

                    <Modal
                      animationType="fade"
                      transparent={true}
                      visible={this.state.modalVisible}>
                      <View
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 0,
                          width: constant.HEIGHT * 15,
                          height: constant.HEIGHT * 14.3,
                          marginTop: constant.HEIGHT * 12,
                          borderRadius: constant.HEIGHT * 0.5,
                          backgroundColor: constant.WHITE,
                          borderColor: constant.WHITECOLOR,
                          elevation:
                            Platform.OS === 'ios' ? null : constant.HEIGHT * 5,
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
                        <TouchableOpacity
                          style={{
                            borderBottomWidth: constant.HEIGHT * 0.1,
                            borderColor: constant.GREY,
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            this.setState({
                              modalVisible: false,
                              calendar: 'Day',
                            });
                            futureWeek = 0;
                            var inputs = {
                              data: {
                                date: moment(new Date()).format('YYYY-MM-DD'),
                                // weekstart: moment(new Date()).startOf('week').format('YYYY-MM-DD'),
                                // weekend: moment(new Date()).endOf('week').format('YYYY-MM-DD'),
                                // month: moment(new Date()).format('YYYY-MM-DD'),
                              },
                              member_id: this.props.signIn.member_id,
                              type: 'day',
                            };

                            this.onLiveDashboard(inputs);
                          }}>
                          <Text
                            style={{
                              paddingVertical: constant.HEIGHT * 1,
                              alignSelf: 'center',
                              fontFamily: constant.SUIFONT,
                            }}>
                            Day
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            borderBottomWidth: constant.HEIGHT * 0.1,
                            borderColor: constant.GREY,
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            futureWeek = 0;

                            this.setState({
                              modalVisible: false,
                              calendar: 'Week',
                            });

                            var inputs = {
                              data: {
                                // date: moment(new Date()).format('YYYY-MM-DD'),
                                weekstart: moment(new Date())
                                  .startOf('week')
                                  .format('YYYY-MM-DD'),
                                weekend: moment(new Date())
                                  .endOf('week')
                                  .format('YYYY-MM-DD'),
                                // month: moment(new Date()).format('YYYY-MM-DD'),
                              },
                              member_id: this.props.signIn.member_id,
                              type: 'week',
                            };
                            this.onLiveDashboard(inputs);
                          }}>
                          <Text
                            style={{
                              paddingVertical: constant.HEIGHT * 1,
                              alignSelf: 'center',
                              fontFamily: constant.SUIFONT,
                            }}>
                            Week
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            borderBottomWidth: constant.HEIGHT * 0.1,
                            borderColor: constant.GREY,
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            futureWeek = 0;

                            this.setState({
                              modalVisible: false,
                              calendar: 'Month',
                            });
                            var inputs = {
                              data: {
                                // date: moment(new Date()).format('YYYY-MM-DD'),
                                // weekstart: moment(new Date()).startOf('week').format('YYYY-MM-DD'),
                                // weekend: moment(new Date()).endOf('week').format('YYYY-MM-DD'),
                                month: moment(new Date()).format('YYYY-MM-DD'),
                              },
                              member_id: this.props.signIn.member_id,
                              type: 'month',
                            };
                            this.onLiveDashboard(inputs);
                          }}>
                          <Text
                            style={{
                              paddingVertical: constant.HEIGHT * 1,
                              alignSelf: 'center',
                              fontFamily: constant.SUIFONT,
                            }}>
                            Month
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>

                    {this.state.calendar == 'Day'
                      ? this.showDate()
                      : this.state.calendar == 'Week'
                      ? this.showWeek()
                      : this.showMonth()}
                  </View>

                  {this.props.live.liveDetails.length != 0 ||
                  this.props.live.upcomingLiveDetails.length != 0 ? (
                    <View
                      style={{
                        // backgroundColor: 'red',
                        marginTop: constant.HEIGHT * 18,
                        // position: 'absolute',
                      }}>
                      <View
                        style={{
                          elevation:
                            Platform.OS === 'ios' ? null : constant.HEIGHT * 3,
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
                        <View
                          style={{
                            marginTop: constant.HEIGHT * -18,
                          }}>
                          <TouchableOpacity
                            style={{}}
                            activeOpacity={1}
                            onPress={() => this.animate()}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                              }}>
                              <Animated.View
                                style={{
                                  transform: this.state.transform,
                                }}>
                                {this.state.calendar == 'Day' ? (
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
                                ) : (
                                  <Pie
                                    radius={100}
                                    innerRadius={82}
                                    sections={[
                                      {
                                        percentage: 100,
                                        color: '#FF67A4',
                                      },
                                      {
                                        percentage: 100,
                                        color: '#FF67A4',
                                      },
                                    ]}
                                    dividerSize={2}
                                    strokeCap={'butt'}
                                  />
                                )}
                              </Animated.View>
                              <View
                                style={{
                                  position: 'absolute',
                                  backgroundColor: 'white',
                                  width: constant.HEIGHT * 20,
                                  height: constant.HEIGHT * 20,
                                  justifyContent: 'center',

                                  borderRadius: constant.HEIGHT * 25,
                                }}>
                                {this.props.live.liveDetails != '' &&
                                this.props.live.liveDetails != undefined &&
                                this.props.live.liveDetails.length != 0 &&
                                this.props.live.liveDetails[0].banner_image !=
                                  undefined ? (
                                  <Image
                                    source={{
                                      uri: live_image,
                                    }}
                                    style={{
                                      width: constant.HEIGHT * 21,
                                      height: constant.HEIGHT * 21,
                                      alignSelf: 'center',
                                      justifyContent: 'center',
                                      borderRadius: constant.HEIGHT * 25,
                                    }}
                                  />
                                ) : (
                                  <Image
                                    source={{uri: live_image}}
                                    style={{
                                      width: constant.HEIGHT * 21,
                                      height: constant.HEIGHT * 21,
                                      alignSelf: 'center',
                                      justifyContent: 'center',
                                      borderRadius: constant.HEIGHT * 25,
                                    }}
                                  />
                                )}
                                <View
                                  style={{
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    justifyContent: 'flex-end',
                                    marginTop: constant.HEIGHT * 15,
                                  }}>
                                  <Text
                                    style={{
                                      color: constant.WHITE,
                                      justifyContent: 'flex-end',
                                      fontWeight: 'bold',
                                      fontFamily: constant.SUIFONT,
                                    }}>
                                    Streamed
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              marginTop: -3,
                            }}>
                            <Image
                              style={{
                                width: constant.HEIGHT * 4,
                                marginHorizontal: constant.HEIGHT * 1,
                                height: constant.HEIGHT * 3,
                                tintColor: constant.THEME,
                              }}
                              source={constant.DOWNICON}
                            />
                          </View>
                        </View>

                        {this.state.calendar == 'Day' ? (
                          <View style={{marginBottom: constant.HEIGHT * 1.5}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: constant.responsiveFontSize(2.5),
                                  fontWeight: 'bold',
                                  fontFamily: constant.SUIFONT,
                                }}>
                                {this.props.live.liveDetails != '' &&
                                this.props.live.liveDetails != undefined &&
                                this.props.live.liveDetails.length != 0 &&
                                this.props.live.liveDetails[0].programdata !=
                                  undefined
                                  ? this.props.live.liveDetails[0].programdata
                                      .program_name
                                  : this.props.live.upcomingLiveDetails != '' &&
                                    this.props.live.upcomingLiveDetails !=
                                      undefined &&
                                    this.props.live.upcomingLiveDetails
                                      .length != 0 &&
                                    this.props.live.upcomingLiveDetails[0]
                                      .programdata != undefined
                                  ? this.props.live.upcomingLiveDetails[0]
                                      .programdata.program_name
                                  : ''}
                              </Text>
                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() => {
                                  this.onParticipant(
                                    this.props.live.liveDetails.length != 0
                                      ? 'participate'
                                      : this.props.live.upcomingLiveDetails
                                          .length != 0
                                      ? 'enroll'
                                      : '',
                                  );
                                }}>
                                <Image
                                  style={{
                                    width: constant.HEIGHT * 2.5,
                                    marginHorizontal: constant.HEIGHT * 0.5,
                                    height: constant.HEIGHT * 2,
                                    marginTop: constant.HEIGHT * 0.2,
                                    // tintColor: constant.THEME,
                                  }}
                                  source={constant.IconFriends}
                                />
                                <Text
                                  style={{
                                    fontSize: constant.responsiveFontSize(1.5),
                                    fontFamily: constant.SUIFONT,
                                  }}>
                                  {this.props.live.liveDetails != '' &&
                                  this.props.live.liveDetails != undefined &&
                                  this.props.live.liveDetails.length != 0 &&
                                  this.props.live.liveDetails[0].programdata !=
                                    undefined
                                    ? this.props.live.liveDetails[0]
                                        .participated
                                    : this.props.live.upcomingLiveDetails !=
                                        '' &&
                                      this.props.live.upcomingLiveDetails !=
                                        undefined &&
                                      this.props.live.upcomingLiveDetails
                                        .length != 0 &&
                                      this.props.live.upcomingLiveDetails[0]
                                        .programdata != undefined
                                    ? this.props.live.upcomingLiveDetails[0]
                                        .participated
                                    : ''}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: constant.HEIGHT * 1,
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
                                {this.props.live.liveDetails != '' &&
                                this.props.live.liveDetails != undefined &&
                                this.props.live.liveDetails.length != 0 &&
                                this.props.live.liveDetails[0].programdata !=
                                  undefined
                                  ? this.props.live.liveDetails[0].friends +
                                    ' friends'
                                  : this.props.live.upcomingLiveDetails != '' &&
                                    this.props.live.upcomingLiveDetails !=
                                      undefined &&
                                    this.props.live.upcomingLiveDetails
                                      .length != 0 &&
                                    this.props.live.upcomingLiveDetails[0]
                                      .programdata != undefined
                                  ? this.props.live.upcomingLiveDetails[0]
                                      .friends + ' friends'
                                  : ''}
                                {/* : this.props.live.upcomingLiveDetails[0].friends +
                                ' friends'} */}
                              </Text>
                              <Text
                                style={{
                                  fontSize: constant.responsiveFontSize(1.5),
                                  marginHorizontal: constant.HEIGHT * 0.2,
                                  color: '#5D5C5C',
                                  fontFamily: constant.SUIFONT,
                                }}>
                                {'participated'}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(1.5),
                                marginHorizontal: constant.HEIGHT * 0.2,
                                marginTop: constant.HEIGHT * 1,
                                color: '#5D5C5C',
                                fontFamily: constant.SUIFONT,
                              }}>
                              {this.props.live.liveDetails != '' &&
                              this.props.live.liveDetails != undefined &&
                              this.props.live.liveDetails.length != 0 &&
                              this.props.live.liveDetails[0].programdata !=
                                undefined
                                ? this.props.live.liveDetails[0].programdata
                                    .desc
                                : this.props.live.upcomingLiveDetails != '' &&
                                  this.props.live.upcomingLiveDetails !=
                                    undefined &&
                                  this.props.live.upcomingLiveDetails.length !=
                                    0 &&
                                  this.props.live.upcomingLiveDetails[0]
                                    .programdata != undefined
                                ? this.props.live.upcomingLiveDetails[0]
                                    .programdata.desc
                                : ''}
                            </Text>
                            {this.props.live.liveDetails != '' &&
                            this.props.live.liveDetails != undefined &&
                            this.props.live.liveDetails.length != 0 &&
                            this.props.live.liveDetails[0].programdata !=
                              undefined ? (
                              <TouchableOpacity
                                style={{
                                  backgroundColor: constant.THEME,
                                  justifyContent: 'center',
                                  alignSelf: 'center',
                                  flexDirection: 'row',
                                  padding: constant.HEIGHT * 1.5,
                                  borderRadius: constant.HEIGHT * 2.5,
                                  marginTop: constant.HEIGHT * 5,
                                }}
                                onPress={() =>
                                  // this.onLiveEnroll(
                                  //   this.props.live.liveDetails[0],
                                  //   'participate',
                                  // )
                                  this.onLiveDetails(
                                    this.props.live.liveDetails[0],
                                  )
                                }>
                                <Image
                                  style={{
                                    width: constant.HEIGHT * 2,
                                    marginHorizontal: constant.HEIGHT * 1,
                                    height: constant.HEIGHT * 2,
                                    alignSelf: 'center',

                                    // tintColor: constant.THEME,
                                  }}
                                  source={constant.ICONPLAY}
                                />
                                <Text
                                  style={{
                                    fontSize: constant.responsiveFontSize(2),
                                    marginHorizontal: constant.HEIGHT * 0.2,
                                    color: constant.WHITE,
                                    alignSelf: 'center',
                                    fontFamily: constant.SUIFONT,
                                  }}>
                                  {'Begin Workout'}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={{
                                  backgroundColor: constant.THEME,
                                  justifyContent: 'flex-end',
                                  alignSelf: 'flex-end',
                                  flexDirection: 'row',
                                  padding: constant.HEIGHT * 1.5,
                                  borderRadius: constant.HEIGHT * 2.5,
                                  marginTop: constant.HEIGHT * 3,
                                }}
                                onPress={() =>
                                  this.onLiveEnroll(
                                    this.props.live.upcomingLiveDetails[0],
                                    'enroll',
                                  )
                                }>
                                <Text
                                  style={{
                                    fontSize: constant.responsiveFontSize(2),
                                    marginHorizontal: constant.HEIGHT * 0.2,
                                    color: constant.WHITE,
                                    alignSelf: 'center',
                                    fontFamily: constant.SUIFONT,
                                  }}>
                                  {'Enroll now'}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignSelf: 'center',
                              background: '#ffeef8',
                            }}>
                            <Svg
                              width={SVGWidth}
                              height={SVGHeight}
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                background: '#ffeef8',
                              }}>
                              <G y={graphHeight + GRAPH_MARGIN}>
                                {/* Top value label */}
                                {data.map((item, index) => (
                                  <img.Image
                                    x={x(item.label) - GRAPH_BAR_WIDTH}
                                    y={y(item.value + 125) * -1}
                                    width={constant.HEIGHT * 3}
                                    height={constant.HEIGHT * 3}
                                    opacity="1"
                                    preserveAspectRatio="xMidYMid slice"
                                    href={require('../../../assets/icons/IconProfilePic.png')}
                                  />
                                ))}
                                {data.map((item, index) => (
                                  <img.Text
                                    key={'label' + item.label}
                                    fontSize="8"
                                    x={x(item.label)}
                                    y={y(item.value + 20) * -1}
                                    fill={'black'}
                                    textAnchor="middle">
                                    {'150 cal'}
                                  </img.Text>
                                ))}

                                <img.Text
                                  x={graphWidth + 25}
                                  textAnchor="end"
                                  y={y(middleValue) * -1 - 5}
                                  fontSize={12}
                                  fill="black"
                                  fillOpacity={0.4}>
                                  {'Target'}
                                </img.Text>
                                {/* middle axis */}
                                <Line
                                  x1="0"
                                  y1={y(middleValue) * -1}
                                  x2={graphWidth}
                                  y2={y(middleValue) * -1}
                                  stroke={colors.axis}
                                  fill={constant.THEME}
                                  strokeWidth="0.5"
                                />
                                {/* bottom axis */}
                                {/* <Line
                                  x1="0"
                                  y1="2"
                                  x2={graphWidth}
                                  y2="2"
                                  stroke={colors.axis}
                                  strokeWidth="0.5"
                                /> */}
                                {/* bars */}
                                {data.map((item) => (
                                  <Rect
                                    key={'bar' + item.label}
                                    x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                                    y={y(item.value) * -1}
                                    rx={2.5}
                                    width={10}
                                    height={y(item.value)}
                                    fill={colors.bars}
                                  />
                                ))}
                                {/* labels */}
                                {data.map((item) => (
                                  <img.Text
                                    key={'label' + item.label}
                                    fontSize="8"
                                    x={x(item.label)}
                                    fill={'black'}
                                    y="10"
                                    textAnchor="middle">
                                    {item.label}
                                  </img.Text>
                                ))}
                              </G>
                            </Svg>
                          </View>
                        )}
                      </View>

                      {this.state.calendar == 'Day' ? (
                        <View
                          style={{
                            marginHorizontal: constant.HEIGHT * 3,
                            marginBottom: constant.HEIGHT * 12,
                          }}>
                          <Text
                            style={{
                              textAlign: 'left',
                              color: constant.BLACK,
                              opacity: 0.6,
                              fontWeight: 'bold',
                              fontSize: constant.responsiveFontSize(2),
                              borderBottomColor: '#5D5C5C',
                              borderBottomWidth: constant.HEIGHT * 0.1,
                              fontFamily: constant.SUIFONT,
                            }}>
                            Upcoming
                          </Text>

                          <FlatList
                            data={this.props.live.upcomingLiveDetails}
                            extraData={this.state}
                            // keyExtractor={this._keyExtractor}
                            renderItem={this.renderVideo}
                            ListEmptyComponent={this.showEmptyListView}
                          />
                        </View>
                      ) : (
                        <View
                          style={{marginBottom: constant.HEIGHT * 12}}></View>
                      )}
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: constant.HEIGHT * 20,
                      }}>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          alignSelf: 'center',
                          fontWeight: 'bold',
                          marginTop: constant.HEIGHT * 1,
                          fontFamily: constant.SUIFONT,
                          opacity: 0.6,
                        }}>
                        No data to display
                      </Text>
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
    live: state.liveReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onLiveDashboard,
      onParticipantAction,
      onLiveProgramAction,
      onProgramViewAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Live);

function weekCount(year, month_number) {
  // month_number is in the range 1..12

  var firstOfMonth = new Date(year, month_number - 1, 1);
  var lastOfMonth = new Date(year, month_number, 0);

  var used = firstOfMonth.getDay() + lastOfMonth.getDate();

  return Math.ceil(used / 7);
}

function getWeek() {
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var prefixes = ['1', '2', '3', '4', '5'];

  var date = new Date();

  var perivousWeak = date - 0;

  perivousWeak = [prefixes[Math.floor(date.getDate() / 7)] - 1];

  return prefixes[Math.floor(date.getDate() / 7)];
}
