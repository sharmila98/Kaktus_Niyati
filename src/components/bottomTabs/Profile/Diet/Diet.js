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
  RefreshControl,
  LayoutAnimation,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
// import { constant } from "lodash";
import Pie from '../../../libs/Pie';
import * as constant from '../../../utils/constants';
import StatusBar from '../../commons/StatusBar';
import Header from '../../commons/Header';

import {onDietDashboard} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import {PieChart} from 'react-native-svg-charts';
import * as img from 'react-native-svg';
import {Circle, G, Svg, Line, Rect} from 'react-native-svg';
import * as d3 from 'd3';
import {onDietCustomPlanListAction} from '../../../action/CustomPlan_Action';
import FlatListSlider from '../../loginSignup/FlatListSlider';

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

var head, url;

const getCurrentDate = () => {
  var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var d = new Date();
  var date = new Date().getDate();
  var month = monthNames[d.getMonth()];
  var year = new Date().getFullYear();
  var name =
    date == 1 || date == 21 || date == 31
      ? 'st'
      : date == 2 || date == 22
      ? 'nd'
      : date == 3 || date == 23
      ? 'rd'
      : 'th';

  return date + name + ' ' + month + ', ' + year; //format: dd-mm-yyyy;
};

const pieImgs = [
  constant.ICONPROFILEIMG,
  constant.ICONMYPLAN,
  constant.ICONCPLAN,
];

const GRAPH_MARGIN = 20;
const GRAPH_BAR_WIDTH = 8;
const colors = {
  axis: '#E4E4E4',
  bars: constant.THEME,
};

class Diet extends Component {
  static navigationOptions = {
    title: 'Diet',
  };
  constructor(props) {
    super(props);
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
    this.animated = new Animated.Value(0);
    var inputRange = [0, 1];
    var outputRange = ['0deg', '120deg'];
    this.rotate1 = this.animated.interpolate({inputRange, outputRange});
    inputRange = [1, 2];
    outputRange = ['120deg', '0deg'];
    this.rotate2 = this.animated.interpolate({inputRange, outputRange});
    inputRange = [2, 3];
    outputRange = ['180deg', '240deg'];
    this.rotate3 = this.animated.interpolate({inputRange, outputRange});

    this.state = {
      pieData,
      calendar: 'Day',
      pickerValue: '',
      modalVisible: false,
      currentWeek: '',
      perivousWeak: '',
      transform: [{rotate: this.rotate1}],
      toValue: 2,
      selectedDate :moment(new Date()).format('YYYY-MM-DD'),
      selectedStartWeek : moment().startOf('week').format('YYYY-MM-DD'),
      selectedEndWeek : moment().endOf('week').format('YYYY-MM-DD'),
      selectedYear: moment(new Date()).format('YYYY-MM-DD'),
      selectedBackground : constant.WHITE,
    };
  }

  componentDidMount() {
    this.setState(
      {selectedDate: moment(new Date()).format('YYYY-MM-DD')},
      () => {
        this.selectedCalender('Day');
      },
    );
  }

  selectedCalender(option) {
    futureWeek = 0;

    this.setState({modalVisible: false, calendar: option});

    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.dietDashboard + '/dashboard';

    if (option == 'Week') {
      var inputs = {
        data: {
          program_type: 'diet',
          weekstart: this.state.selectedStartWeek,
          weekend: this.state.selectedEndWeek,
        },
        member_id: this.props.signIn.member_id,
        type: 'week',
      };
    } else if (option == 'Month') {
      var inputs = {
        data: {
          program_type: 'diet',
          month: this.state.selectedYear,
        },
        member_id: this.props.signIn.member_id,
        type: 'month',
      };
    } else {
      var inputs = {
        data: {
          program_type: 'diet',
          date: this.state.selectedDate,
        },
        member_id: this.props.signIn.member_id,
        type: 'day',
      };
    }

    this.props.onDietDashboard(head, url, methods.post, inputs).then((res) => {
      if (res.status == 200) {
      }
    });
  }

  dietWeekView() {
    const SVGHeight = 150;
    const SVGWidth = 300;
    const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
    const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;
    var data = [
      {label: 'Sun', value: 500},
      {label: 'Mon', value: 312},
      {label: 'Tue', value: 424},
      {label: 'Wed', value: 745},
      {label: 'Thu', value: 89},
      {label: 'Fri', value: 434},
      {label: 'Sat', value: 650},
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
    // top axis and middle axis
    const middleValue = topValue / 2;
    return this.props.diet.dietDetails.plan.data.length != 0 ? (
      this.state.calendar == 'Week' ? (
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginLeft: constant.HEIGHT * 6,
            marginRight: constant.HEIGHT * 6,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#f7e6ed',
              borderRadius: constant.HEIGHT * 2,
              marginTop: constant.HEIGHT * 5,
            }}>
            <Svg
              width={SVGWidth}
              height={SVGHeight}
              fill={'red'}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                paddingHorizontal: constant.HEIGHT * 5.5,
                // marginLeft: constant.HEIGHT * 1.5,
              }}>
              <G y={graphHeight + GRAPH_MARGIN}>
                {/* <img.Text
                  x={graphWidth - 3}
                  textAnchor="end"
                  y={y(middleValue + 20) * -1}
                  fontSize={10}
                  fill={constant.THEME}
                  fillOpacity={1}>
                  {'Target'}
                </img.Text> */}

                {/* middle axis */}
                {/* <Line
                  x1="0"
                  y1={y(middleValue) * -1}
                  x2={graphWidth}
                  y2={y(middleValue) * -1}
                  stroke={constant.THEME}
                  // strokeDasharray={[3, 3]}
                  strokeWidth="0.5"
                /> */}

                {/* bars Target is 80cal per day */}
                {data.map((item, index) =>
                  this.props.diet.dietDetails.plan.data != undefined &&
                  this.props.diet.dietDetails.plan.data[index] != undefined &&
                  this.props.diet.dietDetails.plan.data[index].fat !=
                    undefined &&
                  this.props.diet.dietDetails.plan.data[index].fat != null ? (
                    <G>
                      <Rect
                        key={'bar' + item.label}
                        x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                        y={
                          y(
                            70 +
                              this.props.diet.dietDetails.plan.data[index].fat +
                              this.props.diet.dietDetails.plan.data[index]
                                .protein +
                              this.props.diet.dietDetails.plan.data[index]
                                .carbs *
                                5,
                          ) * -1
                        }
                        rx={3}
                        width={GRAPH_BAR_WIDTH}
                        height={y(
                          30 +
                            this.props.diet.dietDetails.plan.data[index].fat +
                            this.props.diet.dietDetails.plan.data[index]
                              .protein +
                            this.props.diet.dietDetails.plan.data[index].carbs *
                              5,
                        )}
                        fill={'#F18282'}
                      />
                      <Rect
                        key={'bar' + item.label}
                        x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                        y={
                          y(
                            40 +
                              this.props.diet.dietDetails.plan.data[index]
                                .protein +
                              this.props.diet.dietDetails.plan.data[index]
                                .carbs *
                                5,
                          ) * -1
                        }
                        rx={3}
                        width={GRAPH_BAR_WIDTH}
                        height={y(
                          30 +
                            this.props.diet.dietDetails.plan.data[index]
                              .protein +
                            this.props.diet.dietDetails.plan.data[index].carbs *
                              5,
                        )}
                        fill={'#9BC449'}
                      />
                      <Rect
                        key={'bar' + item.label}
                        x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                        y={
                          y(
                            10 +
                              this.props.diet.dietDetails.plan.data[index]
                                .carbs *
                                5,
                          ) * -1
                        }
                        rx={3}
                        width={GRAPH_BAR_WIDTH}
                        height={y(
                          30 +
                            this.props.diet.dietDetails.plan.data[index].carbs *
                              5,
                        )}
                        fill={'#FFD700'}
                      />
                    </G>
                  ) : null,
                )}

                {/* labels */}
                {data.map((item) => (
                  <img.Text
                    key={'label' + item.label}
                    fontSize="8"
                    x={x(item.label)}
                    fill={'black'}
                    opacity={0.6}
                    y="15"
                    textAnchor="middle">
                    {item.label}
                  </img.Text>
                ))}
              </G>
            </Svg>
          </View>
          <Text
            style={{
              marginTop: constant.HEIGHT * 2,
              opacity: 0.6,
              fontSize: constant.responsiveFontSize(1.8),
              textAlign: 'center',
            }}>
            {moment(this.state.selectedStartWeek).format('MMM, yyyy')}
          </Text>
        </View>
      ) : null
    ) : null;
  }

  dietMonthView() {
    const SVGHeight = 150;
    const SVGWidth = 300;
    const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
    const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;
    var data = [
      {label: '1', value: 500},
      {label: '2', value: 312},
      {label: '3', value: 424},
      {label: '4', value: 745},
      {label: '5', value: 89},
      {label: '6', value: 434},
      {label: '7', value: 650},
      {label: '8', value: 980},
      {label: '9', value: 123},
      {label: '10', value: 186},
      {label: '11', value: 689},
      {label: '12', value: 643},
      {label: '13', value: 500},
      {label: '14', value: 312},
      {label: '15', value: 424},
      {label: '16', value: 745},
      {label: '17', value: 89},
      {label: '18', value: 434},
      {label: '19', value: 650},
      {label: '20', value: 980},
      {label: '21', value: 123},
      {label: '22', value: 186},
      {label: '23', value: 689},
      {label: '24', value: 643},
      {label: '25', value: 650},
      {label: '26', value: 980},
      {label: '27', value: 123},
      {label: '28', value: 186},
      {label: '29', value: 689},
      {label: '30', value: 643},
      {label: '31', value: 643},
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
    // top axis and middle axis
    const middleValue = topValue / 2;
    return this.props.diet.dietDetails.plan.data.length != 0 ? (
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#f7e6ed',
            borderRadius: constant.HEIGHT * 2,
            marginTop: constant.HEIGHT * 5,
          }}>
          <Svg
            width={SVGWidth}
            height={SVGHeight}
            fill={'red'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              paddingHorizontal: constant.HEIGHT * 5.5,
              marginLeft: constant.HEIGHT * 5.5,
            }}>
            <G y={graphHeight + GRAPH_MARGIN}>
              <img.Text
                x={graphWidth - 3}
                textAnchor="end"
                y={y(middleValue + 20) * -1}
                fontSize={10}
                fill={constant.THEME}
                fillOpacity={1}>
                {'Target'}
              </img.Text>

              {/* middle axis */}
              <Line
                x1="0"
                y1={y(middleValue) * -1}
                x2={graphWidth}
                y2={y(middleValue) * -1}
                stroke={constant.THEME}
                // strokeDasharray={[3, 3]}
                strokeWidth="0.5"
              />

              {/* bars Target is 80cal per day */}
              {data.map((item, index) =>
                this.props.diet.dietDetails.plan.data != undefined &&
                this.props.diet.dietDetails.plan.data[index] != undefined &&
                this.props.diet.dietDetails.plan.data[index].cals !=
                  undefined &&
                this.props.diet.dietDetails.plan.data[index].cals != null ? (
                  <G>
                    <Rect
                      key={'bar' + item.label}
                      x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                      y={
                        y(
                          70 +
                            this.props.diet.dietDetails.plan.data[index].fat *
                              5,
                        ) * -1
                      }
                      rx={3}
                      width={GRAPH_BAR_WIDTH}
                      height={y(
                        30 +
                          this.props.diet.dietDetails.plan.data[index].fat * 5,
                      )}
                      fill={'#F18282'}
                    />
                    <Rect
                      key={'bar' + item.label}
                      x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                      y={
                        y(
                          40 +
                            this.props.diet.dietDetails.plan.data[index]
                              .protein *
                              5,
                        ) * -1
                      }
                      rx={3}
                      width={GRAPH_BAR_WIDTH}
                      height={y(
                        30 +
                          this.props.diet.dietDetails.plan.data[index].protein *
                            5,
                      )}
                      fill={'#9BC449'}
                    />
                    <Rect
                      key={'bar' + item.label}
                      x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                      y={
                        y(
                          10 +
                            this.props.diet.dietDetails.plan.data[index].carbs *
                              5,
                        ) * -1
                      }
                      rx={3}
                      width={GRAPH_BAR_WIDTH}
                      height={y(
                        30 +
                          this.props.diet.dietDetails.plan.data[index].carbs *
                            5,
                      )}
                      fill={'#FFD700'}
                    />
                  </G>
                ) : null,
              )}
            </G>
          </Svg>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: constant.HEIGHT * 4,
              marginBottom: constant.HEIGHT * 2,
            }}>
            <Text
              style={{
                flex: 0.5,
                fontSize: constant.responsiveFontSize(1.4),
                textAlign: 'left',
                opacity: 0.6,
              }}>
              {moment(this.state.selectedYear).format('MMM '+1)}
            </Text>
            <Text
              style={{
                flex: 0.5,
                fontSize: constant.responsiveFontSize(1.4),
                textAlign: 'right',
                opacity: 0.6,
              }}>
              {moment(this.state.selectedYear).endOf('month').format('MMM DD')}
            </Text>
          </View>
        </View>
        <Text
          style={{
            marginTop: constant.HEIGHT * 2,
            opacity: 0.6,
            fontSize: constant.responsiveFontSize(1.8),
            textAlign: 'center',
          }}>
          {moment(this.state.selectedYear).format('MMM, yyyy')}
        </Text>
      </View>
    ) : null;
  }

  onCustomDiet() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.customList + this.props.signIn.member_id + '/diet';

    this.props
      .onDietCustomPlanListAction(head, url, methods.get)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('DietCustomPlan');
        }
      });
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

  viewPlan(program_id, program_name, program_day) {
    if(this.state.selectedDate >= moment(new Date()).format('YYYY-MM-DD')){
    this.props.navigation.navigate('DietViewPlan', {
      program_id: program_id,
      program_name: program_name,
      program_day: program_day,
      program_date : this.state.selectedDate,
    });
  }
  }

  getPreviousWeakCount(value) {
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

  animate(to, rotateValue) {
    try {
      this.setState(
        {transform: [{rotate: rotateValue}], toValue: to},
        function () {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        },
      );
      Animated.timing(this.animated, {
        toValue: to,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start(() => {});
      // setTimeout(() => {
      //   // if (this.state.toValue == 1) {
      //   //   this.setState({transform: [{rotate: this.rotate2}]});
      //   //   this.setState({toValue: 2});
      //   // } else if (this.state.toValue == 2) {
      //   //   this.setState({transform: [{rotate: this.rotate3}]});
      //   //   this.setState({toValue: 3});
      //   // } else if (this.state.toValue == 3) {
      //   //   this.setState({transform: [{rotate: this.rotate1}]});
      //   //   this.setState({toValue: 1});
      //   // }
      // }, 100);
    } catch (error) {}
  }

  getDate(previous, isPrevious) {
    // var today = currentDate;
    var date = new Date();
    if (isPrevious == true) {
      date.setDate(date.getDate() - previous);
    } else {
      date.setDate(date.getDate() + previous);
    }

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayName = days[date.getDay()];

    return dayName;
  }

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
    var month = '';
    if (currentMonth <= 0) {
      previousMonthName = previousMonthName - 1;
      currentMonth = previousMonthName;
    } else if (currentMonth >= 13) {
      futureMonthName = futureMonthName + 1;
      currentMonth = futureMonthName;
    }
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

  dateView() {
    let tomorrow = new Date();
    tomorrow = moment(tomorrow).subtract(3, 'day').format('YYYY-MM-DD');
    return (
      <TouchableOpacity
        style={{
          padding: constant.HEIGHT * 0.7,
          flex: 0.14,
          borderRadius: constant.HEIGHT * 1,
          backgroundColor:
            this.state.selectedDate == tomorrow ? '#FFB6C1' : constant.WHITE,
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
          this.setState({selectedDate: tomorrow}, () => {
            this.selectedCalender('Day');
          });
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
    );
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
        {this.dateView()}

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
            this.setState({selectedDate: tomorrow}, () => {
              this.selectedCalender('Day');
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
            this.setState({selectedDate: tomorrow}, () => {
              this.selectedCalender('Day');
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
            this.setState({selectedDate: tomorrow}, () => {
              this.selectedCalender('Day');
            });
          }}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
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
            this.setState({selectedDate: tomorrow}, () => {
              this.selectedCalender('Day');
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
            this.setState({selectedDate: tomorrow}, () => {
              this.selectedCalender('Day');
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
            this.setState({selectedDate: tomorrow}, () => {
              this.selectedCalender('Day');
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
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: this.state.selectedStartWeek == moment().subtract(3, 'weeks').startOf('week').format('YYYY-MM-DD') ?
          '#FFB6C1': constant.WHITE,
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
            let tomorrow = moment(new Date()).subtract(3, 'week');
            this.setState({selectedStartWeek: moment().subtract(3, 'weeks').startOf('week').format('YYYY-MM-DD')}, () => {
              this.setState({selectedEndWeek: moment().subtract(3, 'weeks').endOf('week').format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Week')
            });
            });
          }
          }>
          
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
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: this.state.selectedStartWeek == moment().subtract(2, 'weeks').startOf('week').format('YYYY-MM-DD') ?
          '#FFB6C1': constant.WHITE,
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
            this.setState({selectedStartWeek: moment().subtract(2, 'weeks').startOf('week').format('YYYY-MM-DD')}, () => {
              this.setState({selectedEndWeek: moment().subtract(2, 'weeks').endOf('week').format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Week')
            });
            });
          }
          }>
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
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: this.state.selectedStartWeek == moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD') ?
          '#FFB6C1': constant.WHITE,
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
            this.setState({selectedStartWeek: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD')}, () => {
              this.setState({selectedEndWeek: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Week')
            });
            });
          }
          }>
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
            this.setState({selectedStartWeek:moment().startOf('week').format('YYYY-MM-DD')}, () => {
            this.setState({selectedEndWeek: moment().endOf('week').format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Week')
            });
          })}}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
            {moment(new Date()).format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
            {'wk' + this.getWeek(0, true)}
          </Text>
        </TouchableOpacity>
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
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedYear ==
              moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD')
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
            this.setState({selectedYear: moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Month');
            });
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
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedYear ==
              moment(new Date()).subtract(2, 'month').format('YYYY-MM-DD')
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
            this.setState({selectedYear: moment(new Date()).subtract(2, 'month').format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Month');
            });
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
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedYear ==
              moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD')
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
            this.setState({selectedYear: moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Month');
            });
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
            this.setState({selectedYear: moment(new Date()).format('YYYY-MM-DD')}, () => {
              this.selectedCalender('Month');
            });
          }}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
            {moment(new Date()).format('MMM')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
            {moment(new Date()).format('MM')}
          </Text>
        </TouchableOpacity>
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

  sections(count) {
    try {
      var arr = [];
      for (i = 0; i < count; i++) {
        arr.push({
          percentage: 5 / 3,
          color: '#846B93',
        });
      }
      return arr;
    } catch (error) {}
  }

  progressPie(percent) {
    // Progress Pie method is for generating the progress inside donut
    return (
      <Pie
      radius={constant.HEIGHT * 10}
      innerRadius={constant.HEIGHT * 9.3}
      dividerSize={constant.HEIGHT * 0.1}
        sections={this.sections((percent / 100) * 60)}
        backgroundColor="#D3D5D4"
        strokeCap={'butt'}
      />
    );
  }

  render() {
    const data = [
      {
        key: 1,
        amount: 33,
        svg: {
          fill: constant.THEME,
          onPress: () => this.animate(1, this.rotate1),
        },
        rotate: 70,
      },
      {
        key: 2,
        amount: 33,
        svg: {
          fill: constant.THEME,
          onPress: () => this.animate(2, this.rotate2),
        },
        rotate: 180,
      },
      {
        key: 3,
        amount: 33,
        svg: {
          fill: constant.THEME,
          onPress: () => this.animate(3, this.rotate3),
        },
        rotate: -60,
      },
    ];

    const Labels = ({slices, height, width}) => {
      return slices.map((slice, index) => {
        const {labelCentroid, pieCentroid, data} = slice;
        return (
          <G
            key={index}
            x={labelCentroid[0]}
            rotation={data.rotate}
            y={labelCentroid[1]}>
            {/* {this.state.selectedValue == index + 1 ? null : ( */}

            {/* {this.state.toValue != index + 1 ? ( */}
            <img.Image
              x={-8}
              y={-7}
              width={constant.HEIGHT * 2}
              height={constant.HEIGHT * 2}
              preserveAspectRatio="xMidYMid slice"
              opacity="1"
              href={pieImgs[index]}
            />
            {/* ) : null} */}
            {/* )} */}

            {/* <Circle r={10} fill={'red'} /> */}
          </G>
        );
      });
    };

    var dietObjLen = Object.keys(this.props.diet.dietDetails).length;
    var dietDetails = this.props.diet.dietDetails;

    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />
            <View style={{flex: 0, marginVertical: constant.HEIGHT * 3}}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={() =>
                      this.setState(
                        {selectedDate: moment(new Date()).format('YYYY-MM-DD')},
                        () => {
                          this.selectedCalender('Day');
                        },
                      )
                    }
                  />
                }>
                <View
                  style={{
                    backgroundColor: 'white',
                    marginHorizontal: constant.HEIGHT * 2,
                  }}>
                  {this.state.toValue == 2 ? (
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
                        {getCurrentDate()}
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
                  ) : null}

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
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 3,
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
                        onPress={() => this.selectedCalender('Day')}>
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
                        onPress={() => this.selectedCalender('Week')}>
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
                        onPress={() => this.selectedCalender('Month')}>
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

                  {this.state.toValue == 2 ? (
                    this.state.calendar == 'Day' ? (
                      this.showDate()
                    ) : this.state.calendar == 'Week' ? (
                      this.showWeek()
                    ) : (
                      this.showMonth()
                    )
                  ) : (
                    <View style={{alignItems: 'center'}}>
                      <ImageBackground
                        resizeMode={'contain'}
                        style={{
                          height: constant.HEIGHT * 12,
                          width: constant.HEIGHT * 60,
                        }}
                        source={constant.ICONWORKOUTAD}></ImageBackground>
                    </View>
                    // <View
                    //   style={{
                    //     backgroundColor: constant.WHITE,
                    //     marginTop: constant.HEIGHT * 2,
                    //   }}>
                    //   {/* {this.props.workout.workout_banner.length != 0 ? (
                    //   <FlatListSlider
                    //     data={this.props.workout.workout_banner}
                    //     timer={5000}
                    //     imageKey={'image'}
                    //     local={false}
                    //     width={constant.HEIGHT * 50}
                    //     height={constant.HEIGHT * 15}
                    //     separatorWidth={2}
                    //     outerMargin={constant.HEIGHT * 1}
                    //     separatorWidth={constant.HEIGHT * 10}
                    //     loop={true}
                    //     autoscroll={true}
                    //     onPress={(item, index) => console.log(item)}
                    //     animation
                    //   />
                    // ) : null} */}
                    // </View>
                  )}

                  <View
                    style={{
                      marginTop: constant.HEIGHT * 4,
                      // position: 'absolute',
                    }}>
                    <View
                      style={{
                        elevation:
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
                        <TouchableOpacity style={{}} activeOpacity={1}>
                          <View
                            style={{
                              justifyContent: 'center',
                              marginTop: constant.HEIGHT * 1,
                            }}>
                            <View>
                              <Animated.View
                                style={{
                                  transform: this.state.transform,
                                }}>
                                <PieChart
                                  style={{height: constant.HEIGHT * 28}}
                                  valueAccessor={({item}) => item.amount}
                                  data={data}
                                  spacing={0}
                                  padAngle={0.01}
                                  innerRadius={'75%'}
                                  outerRadius={'100%'}>
                                  <Labels />
                                </PieChart>
                              </Animated.View>
                            </View>
                            <View
                              style={{
                                position: 'absolute',
                                backgroundColor: constant.WHITE,
                                width: constant.HEIGHT * 19.5,
                                height: constant.HEIGHT * 19.5,
                                alignSelf: 'center',
                                borderRadius: constant.HEIGHT * 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                elevation:
                                  Platform.OS === 'ios'
                                    ? null
                                    : constant.HEIGHT * 5,
                                shadowOffset:
                                  Platform.OS === 'ios'
                                    ? {
                                        width: 0,
                                        height: constant.HEIGHT * 2,
                                      }
                                    : null,
                                shadowRadius:
                                  Platform.OS === 'ios'
                                    ? constant.HEIGHT * 2
                                    : 0,
                                shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
                              }}>
                              {this.state.toValue == 2 ? (
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  {this.progressPie(
                                    dietDetails != undefined &&
                                      dietObjLen != 0 &&
                                      dietDetails.plan != undefined &&
                                      dietDetails.plan != null &&
                                      dietDetails.plan.completed != undefined &&
                                      dietDetails.plan.completed != null
                                      ? this.props.diet.dietDetails.plan
                                          .completed
                                      : 0,
                                  )}
                                  <View
                                    style={{
                                      position: 'absolute',
                                      width: 100,
                                      height: 160,
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: constant.responsiveFontSize(
                                          3.4,
                                        ),
                                        fontWeight: 'bold',
                                        color: '#846B93',
                                        fontFamily: constant.SUIFONT,
                                      }}>
                                      {dietDetails != undefined &&
                                      dietObjLen != 0 &&
                                      dietDetails.plan != undefined &&
                                      dietDetails.plan != null &&
                                      dietDetails.plan.completed != undefined &&
                                      dietDetails.plan.completed != null
                                        ? dietDetails.plan.completed
                                        : 0}
                                      %
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: constant.responsiveFontSize(
                                          2,
                                        ),
                                        fontWeight: 'bold',
                                        color: '#846B93',
                                        textAlign: 'center',
                                        fontFamily: constant.SUIFONT,
                                      }}>
                                      {this.state.calendar == 'Day'
                                        ? dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null
                                          ? (dietDetails.plan.calories_burnt !=
                                              undefined &&
                                            dietDetails.plan.calories_burnt !=
                                              null
                                              ? this.props.diet.dietDetails.plan
                                                  .calories_burnt
                                              : '0') +
                                            ' of ' +
                                            (dietDetails.plan.calories_burnt !=
                                              undefined &&
                                            dietDetails.plan.total_cal != null
                                              ? this.props.diet.dietDetails.plan
                                                  .total_cal
                                              : '0') +
                                            ' cal'
                                          : '0 of 0 cal'
                                        : this.state.calendar == 'Week'
                                        ? 'Weekly\nGoal'
                                        : 'Monthly\nGoal'}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: constant.responsiveFontSize(
                                          2,
                                        ),
                                        color: constant.THEME,
                                        fontFamily: constant.SUIFONT,
                                        paddingTop: constant.HEIGHT * 2,
                                      }}>
                                      Diet
                                    </Text>
                                  </View>
                                </View>
                              ) : this.state.toValue == 3 ? (
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: constant.HEIGHT * 15,
                                    height: constant.HEIGHT * 15,
                                    borderRadius: constant.HEIGHT * 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: constant.responsiveFontSize(
                                        2.6,
                                      ),
                                      fontWeight: 'bold',
                                      color: constant.THEME,
                                      textAlign: 'center',
                                      fontFamily: constant.SUIFONT,
                                    }}>
                                    {'Custom Plan'}
                                  </Text>
                                </View>
                              ) : this.state.toValue == 1 ? (
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: constant.HEIGHT * 15,
                                    height: constant.HEIGHT * 15,
                                    borderRadius: constant.HEIGHT * 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: constant.responsiveFontSize(
                                        2.6,
                                      ),
                                      fontWeight: 'bold',
                                      color: constant.THEME,
                                      textAlign: 'center',
                                      fontFamily: constant.SUIFONT,
                                    }}>
                                    Expert review
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            marginTop: -2.5,
                          }}>
                          <Image
                            style={{
                              width: constant.HEIGHT * 3,
                              marginHorizontal: constant.HEIGHT * 1,
                              height: constant.HEIGHT * 2,
                              tintColor: constant.THEME,
                            }}
                            source={constant.DOWNICON}
                          />
                        </View>
                        {this.state.toValue == 2 ? (
                          this.state.calendar == 'Day' ? (
                            <View>
                              <View
                                style={{
                                  elevation:
                                    Platform.OS === 'ios'
                                      ? null
                                      : constant.HEIGHT * 0.5,
                                  marginTop: constant.HEIGHT * 4,
                                  backgroundColor: '#ffeef8',
                                  borderRadius: constant.HEIGHT * 1.5,
                                  shadowOffset:
                                    Platform.OS === 'ios'
                                      ? {
                                          width: 0,
                                          height: constant.HEIGHT * 2,
                                        }
                                      : null,
                                  shadowRadius:
                                    Platform.OS === 'ios'
                                      ? constant.HEIGHT * 2
                                      : 0,
                                  shadowOpacity:
                                    Platform.OS === 'ios' ? 0.24 : 0,
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <Image
                                    style={{
                                      width: '27%',
                                      height: constant.HEIGHT * 23,
                                      marginVertical: constant.HEIGHT * 1,
                                    }}
                                    resizeMode={"contain"}
                                    source={constant.ICONDIETFOOD}
                                  />
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.viewPlan(
                                        dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null
                                          ? // dietDetails.program._id != undefined &&
                                            // dietDetails.program._id != null
                                            dietDetails.plan.program._id
                                          : '',
                                        dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null &&
                                          dietDetails.plan.program
                                            .program_name != undefined &&
                                          dietDetails.plan.program
                                            .program_name != null
                                          ? dietDetails.plan.program
                                              .program_name
                                          : '',
                                        dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null &&
                                          dietDetails.plan.day != undefined &&
                                          dietDetails.plan.day != null
                                          ? dietDetails.plan.day
                                          : '',
                                      )
                                    }
                                    style={{
                                      marginBottom: constant.HEIGHT * 2,
                                      width: '65%',
                                      marginHorizontal: constant.HEIGHT * 2,
                                    }}>
                                    <View
                                      style={{
                                        alignContent: 'flex-start',
                                        alignSelf: 'flex-start',
                                      }}>
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            2,
                                          ),
                                          marginTop: constant.HEIGHT * 3,
                                          marginBottom: constant.HEIGHT * 1,
                                          fontWeight: 'bold',
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {dietDetails != undefined &&
                                        dietObjLen != 0 &&
                                        dietDetails.plan != undefined &&
                                        dietDetails.plan != null &&
                                        dietDetails.plan.program.program_name !=
                                          undefined &&
                                        dietDetails.plan.program.program_name !=
                                          null
                                          ? dietDetails.plan.program
                                              .program_name
                                          : ''}
                                      </Text>

                                      {/* <Image
                                      style={{
                                        width: constant.HEIGHT * 2,
                                        height: constant.HEIGHT * 2,
                                      }}
                                      source={constant.ICONGREENDOT}
                                    /> */}
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <Progress.Bar
                                        progress={
                                          dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null &&
                                          dietDetails.plan.completed !=
                                            undefined &&
                                          dietDetails.plan.completed != null
                                            ? dietDetails.plan.completed / 100
                                            : 0
                                        }
                                        height={constant.HEIGHT * 0.9}
                                        width={constant.HEIGHT * 15}
                                        style={{
                                          alignSelf: 'center',
                                          marginTop: constant.HEIGHT * 0.5,
                                        }}
                                        borderColor="#D5C5B1"
                                        unfilledColor="#D5C5B1"
                                        color="#6D6A6A"
                                      />
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          fontWeight: 'bold',
                                          marginLeft: constant.HEIGHT * 1,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {dietDetails != undefined &&
                                        dietObjLen != 0 &&
                                        dietDetails.plan != undefined &&
                                        dietDetails.plan != null &&
                                        dietDetails.plan.calories_burnt !=
                                          undefined &&
                                        dietDetails.plan.calories_burnt != null
                                          ? dietDetails.plan.calories_burnt
                                          : 0}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          marginLeft: constant.HEIGHT * 0.5,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        cal
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        marginTop: constant.HEIGHT * 0.5,
                                      }}>
                                      <Progress.Bar
                                        progress={
                                          dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null &&
                                          dietDetails.plan.carb != undefined &&
                                          dietDetails.plan.carb != null
                                            ? dietDetails.plan.carb / 100
                                            : 0
                                        }
                                        height={constant.HEIGHT * 0.9}
                                        width={constant.HEIGHT * 15}
                                        style={{
                                          alignSelf: 'center',
                                          marginTop: constant.HEIGHT * 0.5,
                                        }}
                                        borderColor="#D5C5B1"
                                        unfilledColor="#D5C5B1"
                                        color="#F6AE4E"
                                      />
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          fontWeight: 'bold',
                                          marginLeft: constant.HEIGHT * 1,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {dietDetails != undefined &&
                                        dietObjLen != 0 &&
                                        dietDetails.plan != undefined &&
                                        dietDetails.plan != null &&
                                        dietDetails.plan.carb != undefined &&
                                        dietDetails.plan.carb != null
                                          ? dietDetails.plan.carb
                                          : 0}
                                        %
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          marginLeft: constant.HEIGHT * 0.5,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        carbs
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        marginTop: constant.HEIGHT * 0.5,
                                      }}>
                                      <Progress.Bar
                                        progress={
                                          dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null &&
                                          dietDetails.plan.protein !=
                                            undefined &&
                                          dietDetails.plan.protein != null
                                            ? dietDetails.plan.protein / 100
                                            : 0
                                        }
                                        height={constant.HEIGHT * 0.9}
                                        width={constant.HEIGHT * 15}
                                        style={{
                                          alignSelf: 'center',
                                          marginTop: constant.HEIGHT * 0.5,
                                        }}
                                        borderColor="#D5C5B1"
                                        unfilledColor="#D5C5B1"
                                        color="#9BC449"
                                      />
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          fontWeight: 'bold',
                                          marginLeft: constant.HEIGHT * 1,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {dietDetails != undefined &&
                                        dietObjLen != 0 &&
                                        dietDetails.plan != undefined &&
                                        dietDetails.plan != null &&
                                        dietDetails.plan.protein != undefined &&
                                        dietDetails.plan.protein != null
                                          ? dietDetails.plan.protein
                                          : 0}
                                        %
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          marginLeft: constant.HEIGHT * 0.5,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        protien
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        marginTop: constant.HEIGHT * 0.5,
                                      }}>
                                      <Progress.Bar
                                        progress={
                                          dietDetails != undefined &&
                                          dietObjLen != 0 &&
                                          dietDetails.plan != undefined &&
                                          dietDetails.plan != null &&
                                          dietDetails.plan.fat != undefined &&
                                          dietDetails.plan.fat != null
                                            ? dietDetails.plan.fat / 100
                                            : 0
                                        }
                                        height={constant.HEIGHT * 0.9}
                                        width={constant.HEIGHT * 15}
                                        style={{
                                          alignSelf: 'center',
                                          marginTop: constant.HEIGHT * 0.5,
                                        }}
                                        borderColor="#D5C5B1"
                                        unfilledColor="#D5C5B1"
                                        color="#F18282"
                                      />
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          fontWeight: 'bold',
                                          marginLeft: constant.HEIGHT * 1,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {dietDetails != undefined &&
                                        dietObjLen != 0 &&
                                        dietDetails.plan != undefined &&
                                        dietDetails.plan != null &&
                                        dietDetails.plan.fat != undefined &&
                                        dietDetails.plan.fat != null
                                          ? dietDetails.plan.fat
                                          : 0}
                                        %
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          marginLeft: constant.HEIGHT * 0.5,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        fat
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                      }}>
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.5,
                                          ),
                                          fontWeight: 'bold',
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {dietDetails != undefined &&
                                        dietObjLen != 0 &&
                                        dietDetails.plan != undefined &&
                                        dietDetails.plan != null &&
                                        dietDetails.plan.water != undefined &&
                                        dietDetails.plan.water != null
                                          ? dietDetails.plan.water
                                          : 0}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#5D5C5C',
                                          fontSize: constant.responsiveFontSize(
                                            1.5,
                                          ),
                                          marginLeft: constant.HEIGHT * 0.2,
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {' glasses of water'}
                                      </Text>
                                      <Image
                                        resizeMode={'contain'}
                                        style={{
                                          width: constant.HEIGHT * 5,
                                          height: constant.HEIGHT * 5,
                                          alignSelf: 'flex-end',
                                        }}
                                        source={constant.ICONWATER}
                                      />
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.5}}>
                                  <Text
                                    style={{
                                      fontSize: constant.responsiveFontSize(2),
                                      marginVertical: constant.HEIGHT * 2,
                                      textAlign: 'left',
                                      fontWeight: 'bold',
                                      fontFamily: constant.SUIFONT,
                                      opacity: 0.6,
                                    }}>
                                    {moment(
                                      new Date(this.state.selectedDate),
                                    ).format('DD MMM,YYYY')}
                                  </Text>
                                </View>
                                <View style={{flex: 0.5}}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      marginVertical: constant.HEIGHT * 2,
                                      alignSelf: 'flex-end',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.props.navigation.navigate(
                                          'DietChangePlan',
                                        )
                                      }
                                      style={{
                                        borderColor: constant.GREY,
                                        borderBottomWidth:
                                          constant.HEIGHT * 0.2,
                                        opacity: 0.6,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          fontWeight: 'bold',
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        Change Plan
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ) : this.state.calendar == 'Week' ? (
                            this.dietWeekView()
                          ) : (
                            this.dietMonthView()
                          )
                        ) : this.state.toValue == 3 ? (
                          <TouchableOpacity onPress={() => this.onCustomDiet()}>
                            <View
                              style={{
                                marginTop: constant.HEIGHT * 2,
                                backgroundColor: constant.WHITE,
                                borderRadius: constant.HEIGHT * 1.5,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <ImageBackground
                                resizeMode={'contain'}
                                style={{
                                  width: constant.WIDTH * 90,
                                  height: constant.HEIGHT * 25,
                                }}
                                source={
                                  constant.ICONCUSTOMIZED
                                }></ImageBackground>
                            </View>
                          </TouchableOpacity>
                        ) : this.state.toValue == 1 ? (
                          <View
                            style={{
                              elevation:
                                Platform.OS === 'ios'
                                  ? null
                                  : constant.HEIGHT * 0.5,
                              marginTop: constant.HEIGHT * 3,
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
                                flexDirection: 'row',
                              }}>
                              <View style={{flex: 0.4}}>
                                <Image
                                  resizeMode={'cover'}
                                  style={{
                                    width: constant.HEIGHT * 18,
                                    height: constant.HEIGHT * 24,
                                    borderTopLeftRadius: constant.HEIGHT * 1.5,
                                    borderBottomLeftRadius:
                                      constant.HEIGHT * 1.5,
                                  }}
                                  source={constant.ICONDIETCOUCH}
                                />
                              </View>

                              <View
                                style={{
                                  margin: constant.HEIGHT * 3,
                                  flex: 0.6,
                                  paddingLeft: constant.HEIGHT * 2,
                                }}>
                                <Text
                                  style={{
                                    color: '#5D5C5C',
                                    fontSize: constant.responsiveFontSize(1.8),
                                    fontFamily: constant.SUIFONT,

                                    fontWeight: 'bold',
                                  }}>
                                  Want faster results?
                                </Text>
                                <Text
                                  style={{
                                    color: '#5D5C5C',
                                    fontSize: constant.responsiveFontSize(1.6),
                                    marginTop: constant.HEIGHT * 2,
                                    fontFamily: constant.SUIFONT,
                                  }}>
                                  {
                                    'Get Customised diet plan that helps your reach your goal quicker'
                                  }
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'BookNowDiet',
                                    )
                                  }
                                  style={{
                                    backgroundColor: constant.THEME,
                                    borderRadius: constant.HEIGHT * 1,
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                    marginTop: constant.HEIGHT * 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: constant.WHITE,
                                      fontSize: constant.responsiveFontSize(
                                        1.8,
                                      ),
                                      fontFamily: constant.SUIFONT,
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      paddingVertical: constant.HEIGHT * 0.5,
                                      paddingHorizontal: constant.HEIGHT * 2,
                                    }}>
                                    Book now
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    <View style={{marginTop: constant.HEIGHT * 10}}></View>
                  </View>
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
    diet: state.dashBoardReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onDietDashboard,
      onDietCustomPlanListAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Diet);

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
