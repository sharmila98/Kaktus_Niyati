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
  Dimensions,
  ImageBackground,
  ScrollView,
  processColor,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
// import { constant } from "lodash";
// import Pie from '../../../libs/Pie';

import * as constant from '../../../utils/constants';
import StatusBar from '../../commons/StatusBar';
import Header from '../../commons/Header';

// import Pie from './../../../libs/Chart/PieWrapper';
// import MyLabels from './MyLabels';
import {onCategoriesAction} from '../../../action/Login_Action';
import Dropdown from '../../DropDown/Dropdown';
// import ModalDropdown from 'react-native-modal-dropdown';
const screenWidth = Dimensions.get('window').width;
// import {copilot, walkthroughable, CopilotStep} from '../../../libs/Copilot';

// import {
//   LineChart,
//   BarChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart,
// } from 'react-native-chart-kit';

import messaging from '@react-native-firebase/messaging';
import DropDownPicker from 'react-native-dropdown-picker';
// import {Dropdown} from 'react-native-dropdown';
// import {
//   Surface,
//   Shape,
//   Group,
//   RadialGradient,import * as Progress from 'react-native-progress';

// } from '@react-native-community/art';
import {onProfileAction} from '../../../action/Profile_Action';
// import {PieChart} from 'react-native-svg-charts';
// import {Circle, G, Svg, Line, Rect} from 'react-native-svg';
// import * as d3 from 'd3';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

import {onHomeAction} from '../../../action/Home_Action';
import {onBannerImageAction} from '../../../action/Login_Action';
import {
  onProgramDetailAction,
  onProgramDDAction,
  onBookMarkAction,
  onDietDay,
} from '../../../action/DashBoard_Action';
import {onNotificationAction} from '../../../action/Header_Action';

import Analog from './../../../libs/Analog';
import Loader from '../../../utils/loader';

import * as img from 'react-native-svg';
import moment from 'moment';
import FlatListSlider from './../../loginSignup/FlatListSlider';
// import CardFlip from 'react-native-card-flip';
// import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
// var currentMonth,
//   currentDate,
//   currentWeek,
//   previousWeak,
//   previousWeakCount,
//   previousWeakName,
//   previousMonth = 13,
//   previousMonthName = 13,
//   futureMonth = 0,
//   futureMonthName = 0,
//   futureWeek = '',
//   position = 2,
//   year,
//   month;

// currentMonth = new Date().getMonth() + 1;
// currentDate = new Date().getDate();
// currentWeek = getWeek();
// previousWeak = weekCount(new Date().getFullYear(), new Date().getMonth()) + 1;
// futureWeek = 0;
// const HEART_SHAPE =
//   'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z';

// const SHADOW = {
//   shadowOpacity: 1,
//   shadowColor: 'red',
//   shadowRadius: 8,
//   shadowOffset: {x: 0, y: 0},
// };

// const surfaceDimensions = Dimensions.get('window').width;
// const gradient = new RadialGradient(
//   {
//     '.1': 'red',
//     '0.4': 'red',
//     '1': 'red',
//   },
//   50,
//   50,
//   20,
//   20,
//   50,
//   50,
// );

// const pieImgs = [constant.WORKOUTPIE, constant.ICONSTATS, constant.DIETPIE];

// const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

// function wp(percentage) {
//   const value = (percentage * viewportWidth) / 100;
//   return Math.round(value);
// }

// const slideHeight = viewportHeight * 0.36;
// const slideWidth = wp(75);
// const itemHorizontalMargin = wp(2);

// export const sliderWidth = viewportWidth;
// export const itemWidth = slideWidth + itemHorizontalMargin * 2;

// const getCurrentDate = () => {
//   var monthNames = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];
//   var d = new Date();
//   var date = new Date().getDate();
//   var month = monthNames[d.getMonth()];
//   var year = new Date().getFullYear();
//   var name =
//     date == 1 || date == 21 || date == 31
//       ? 'st'
//       : date == 2 || date == 22
//       ? 'nd'
//       : date == 3 || date == 23
//       ? 'rd'
//       : 'th';

//   return date + name + ' ' + month + ', ' + year; //format: dd-mm-yyyy;
// };

// var head, url;

// const GRAPH_MARGIN = 20;
// const GRAPH_BAR_WIDTH = 8;
// const colors = {
//   axis: '#E4E4E4',
//   bars: constant.THEME,
// };

class Home extends Component {
  static navigationOptions = {
    title: 'Dashboard',
  };
  constructor(props) {
    super(props);
    this.state = {};
   
  }

  handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null});
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)});
    }

    console.log(event.nativeEvent);
  }

  getPreviousWeakCount(value) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();

    var week = Number(currentWeek) - value;
    ``;

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

 
 

  render() {
        
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}></Modal> */}
      </View>
    );
  }

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cardContainer: {
    height: constant.HEIGHT * 32,
  },
  card: {
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  card1: {
    backgroundColor: '#FE474C',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
    lineHeight: 470,
    textAlign: 'center',
    fontSize: 55,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
