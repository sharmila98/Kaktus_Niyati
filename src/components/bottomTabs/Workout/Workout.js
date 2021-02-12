import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
  Modal,
  FlatList,
  LayoutAnimation,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  RefreshControl,
} from 'react-native';
// import { constant } from "lodash";
import Header from '../../commons/Header';
import moment from 'moment';
import Swipeout from '../../SwipeButton/index';

import * as constant from '../../../utils/constants';
import StatusBar from '../../commons/StatusBar';
import Pie from '../../../libs/Pie';
const pieImgs = [
  constant.ICONMYPLAN,
  constant.ICONEQUIPMENT,
  constant.ICONPROFILEIMG,
  constant.ICONCPLAN,
];

import {
  onWorkoutDashBoard,
  onProgramDetailAction,
  getLibraryAction,
  getEquipmentListAction,
  onBookingAction,
  onBookMarkAction,
  addEquipmentAction,
} from '../../../action/DashBoard_Action';

import {onCustomPlanListAction} from '../../../action/CustomPlan_Action';

import {onBannerImageAction} from '../../../action/Login_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

import FlatListSlider from '../../loginSignup/FlatListSlider';

import Loader from '../../../utils/loader';

import * as img from 'react-native-svg';
import {Circle, G, Svg, Line, Rect} from 'react-native-svg';
import {PieChart} from 'react-native-svg-charts';

var head,
  url,
  image = '';

class Workout extends Component {
  static navigationOptions = {
    title: 'Dashboard',
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
    var outputRange = ['0deg', '135deg'];
    this.rotate1 = this.animated.interpolate({inputRange, outputRange});
    inputRange = [1, 2];
    outputRange = ['135deg', '45deg'];
    this.rotate2 = this.animated.interpolate({inputRange, outputRange});
    inputRange = [2, 3];
    outputRange = ['135deg', '-45deg'];
    this.rotate3 = this.animated.interpolate({inputRange, outputRange});
    inputRange = [3, 4];
    outputRange = ['310deg', '225deg'];
    this.rotate4 = this.animated.interpolate({inputRange, outputRange});

    this.state = {
      pieData,
      calendar: 'Day',
      pickerValue: '',
      modalVisible: false,
      currentWeek: '',
      perivousWeak: '',
      transform: [{rotate: this.rotate1}],
      toValue: 3,
      selectedValue: 3,
      image: '',
      startedDate: '',
      bookmark: false,
    };
  }

  componentDidMount() {
    this.workoutDashBoard();
    this.bannerImages();
    this.animate(1, this.rotate1);
  }

  onBookMark(item) {
    if (this.state.bookmark == true) {
      this.setState({bookmark: false});

      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.bookMark;

      var inputs = {
        type: 'delete',
        member_id: this.props.signIn.member_id,
        program_id: item._id,
      };

      this.props.onBookMarkAction(head, url, methods.post, inputs);
    } else {
      this.setState({bookmark: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.bookMark;

      var inputs = {
        type: 'add',
        member_id: this.props.signIn.member_id,
        program_id: item._id,
      };

      this.props.onBookMarkAction(head, url, methods.post, inputs);
    }
  }

  workoutDashBoard() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.dietDashboard +
      '/workout/' +
      this.props.signIn.member_id;

    var inputs = {
      program_type: 'workout',
      member_id: this.props.signIn.member_id,
    };

    this.props
      .onWorkoutDashBoard(head, url, methods.get, inputs)
      .then((res) => {
        // image =
        //   Url.baseUrl +
        //   Url.images +
        //   res.data.data.plan.program.banner_image.filename;
        var date = moment(res.data.data.plan.start_date).format(
          'DD MMMM, YYYY',
        );
        // console.error(date);
        this.setState({
          image: image,
          startedDate: date,
          bookmark: res.data.data.plan.bookmark,
        });
      });
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

  bannerImages() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    url = Url.baseUrl + Url.bannerImage;

    var input = {
      page_name: 'Workout',
    };

    this.props.onBannerImageAction(head, url, methods.post, input);
  }

  onBookNow() {
    this.props.navigation.navigate('BookNow');
  }

  addEquipment() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.getEquipments;

    var inputs = {
      type: 'workout',
    };

    this.props
      .getEquipmentListAction(head, url, methods.post, inputs)
      .then((response) => {
        if (response.status == 200) {
          this.props.navigation.navigate('EquipmentList');
        }
      });
  }

  animate(to, rotateValue) {
    // Animated.timing(this.animated, {
    //   toValue: this.state.toValue,
    //   duration: 400,
    //   useNativeDriver: true,
    //   easing: Easing.linear,
    // }).start();
    // setTimeout(() => {
    //   if (this.state.toValue == 1) {
    //     this.setState({transform: [{rotate: this.rotate2}]});
    //     this.setState({toValue: 2});
    //   } else if (this.state.toValue == 2) {
    //     this.setState({transform: [{rotate: this.rotate3}]});
    //     this.setState({toValue: 3});
    //   } else if (this.state.toValue == 3) {
    //     this.setState({transform: [{rotate: this.rotate1}]});
    //     this.setState({toValue: 4});
    //   } else if (this.state.toValue == 4) {
    //     this.setState({transform: [{rotate: this.rotate1}]});
    //     this.setState({toValue: 1});
    //   }
    // }, 1000);
    try {
      this.setState(
        {transform: [{rotate: rotateValue}], selectedValue: to},
        function () {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        },
      );
      Animated.timing(this.animated, {
        toValue: to,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => {
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
        // }, 500);
      });
    } catch (e) {}
  }

  onCustomWorkout() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl + Url.customList + this.props.signIn.member_id + '/workout';

    this.props.onCustomPlanListAction(head, url, methods.get).then((resp) => {
      if (resp.status == 200) {
        this.props.navigation.navigate('CustomPlan');
      }
    });

    // this.props.getLibraryAction(head, url, methods.post, input).then((resp) => {
    //   if (resp.status == 200) {
    //     this.props.navigation.navigate('CustomPlan');
    //   }
    // });
  }
  onProgramDetails(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.programDetails +
      '/' +
      this.props.signIn.member_id +
      '/' +
      item._id;

    var inputs = {
      program_id: item._id,
      member_id: this.props.signIn.member_id,
    };
    this.props
      .onProgramDetailAction(head, url, methods.get, inputs)
      .then((resp) => {
        if (resp.status == 200) {
          this.props.navigation.navigate('ProgramDetails', {
            onGoBack: () => this.refresh(),
          });
        }
      });
  }

  refresh() {
    try {
      // setTimeout(() => {
      console.log('sdfdfdfd');
      this.setState({
        loader: false,
      });
      // }, 1500);
    } catch (e) {}
  }

  renderVideo = ({item, index}) => {
    var image = '';
    var banner_image =
      item.banner_image != undefined ? item.banner_image.filename : '';

    image = Url.baseUrl + Url.images + banner_image;
    return (
      <TouchableOpacity
        onPress={() => this.onProgramDetails(item)}
        style={{
          marginTop: constant.HEIGHT * 3,
          width: constant.WIDTH * 85,
          height: constant.HEIGHT * 23,
          alignSelf: 'center',
        }}>
        <ImageBackground
          resizeMode={'cover'}
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
                justifyContent: 'space-between',
              }}>
              <View>
                {item.level != null ? (
                  <Text
                    style={{
                      borderRadius: constant.HEIGHT * 0.5,
                      paddingHorizontal: constant.HEIGHT * 0.5,
                      color: constant.WHITE,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontWeight: 'bold',
                      backgroundColor: '#8FC427',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.level}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => console.log('f')}
                style={{
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
              </TouchableOpacity>
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
                    fontSize: constant.responsiveFontSize(2.2),
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  {item.program_name}
                </Text>
              </View>
              <TouchableOpacity
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
                    fontFamily: constant.SUIFONT,
                  }}>
                  {item.durations + ' Days'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  onDeleteProgram(item) {
    console.error(item);
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.addEquipments;

    var inputs = {
      equipment_id: item.equipment_id,
      member_id: this.props.signIn.member_id,
      action_type: 'delete',
    };

    this.props
      .addEquipmentAction(head, url, methods.post, inputs)
      .then((res) => {
        if (res.status == 200) {
          this.workoutDashBoard();
        }
      });
  }

  renderEquipment = ({item, index}) => {
    var image =
      item.equipment_image != undefined
        ? Url.baseUrl + Url.images + item.equipment_image.filename
        : '';

    let swipeRightButton = [
      {
        text: 'Delete',
        src: constant.ICONDELETE,

        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          this.onDeleteProgram(item);
        },
        type: 'delete',
      },
    ];

    return (
      <Swipeout
        right={swipeRightButton}
        autoClose="true"
        backgroundColor="transparent">
        <TouchableOpacity>
          <View
            style={{
              marginVertical: constant.HEIGHT * 0.5,
              padding: constant.HEIGHT * 1,
              marginHorizontal: constant.HEIGHT * 1.5,
              backgroundColor: constant.WHITE,
              borderColor: '#CECBCB',
              borderWidth: constant.HEIGHT * 0.1,
              borderRadius: constant.HEIGHT * 1.5,
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
            <View
              style={{
                flexDirection: 'row',
              }}>
              {item.equipment_image != undefined &&
              item.equipment_image.filename != undefined ? (
                <View style={{flex: 0.3}}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: constant.HEIGHT * 10,
                      height: constant.HEIGHT * 10,
                    }}
                    source={{uri: image}}
                  />
                </View>
              ) : null}
              <View
                style={{
                  flex: 0.7,
                }}>
                <View style={{flex: 0.8}}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      color: '#5D5C5C',
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                      textAlign: 'auto',
                    }}>
                    {item.equipment_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(1.6),
                      opacity: 0.7,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.model_name}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.2,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(1.4),
                      opacity: 0.5,
                      fontFamily: constant.SUIFONT,
                      justifyContent: 'flex-end',
                      alignSelf: 'flex-end',
                    }}>
                    {this.getDate(item.created_on)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  getDate(date) {
    // console.error('Added on ' + moment(date).format('DD MMMM, YYYY'));
    return 'Added on ' + moment(date).format('DD MMMM, YYYY');
  }

  onLayout = (e) => {
    this.setState({
      width: e.nativeEvent.layout.width,
    });
  };

  bannerNavigation(item) {
    if (item.banner_navigateTo == '') {
      // this.props.navigation.navigate('EquipmentList');
    } else {
      this.props.navigation.navigate(item.banner_navigateTo);
    }
  }

  render() {
    const data = [
      {
        key: 1,
        amount: 25,
        svg: {
          fill: constant.THEME,
          onPress: () => this.animate(1, this.rotate1),
        },
        // arc: {cornerRadius: 3},
        rotate: 45,
      },
      {
        key: 2,
        amount: 25,
        svg: {
          fill: constant.THEME,
          onPress: () => this.animate(2, this.rotate2),
        },
        // arc: {cornerRadius: 3},
        // arc: {cornerRadius: 3,padAngle: 0.1,  }

        rotate: 130,
      },
      {
        key: 3,
        amount: 25,
        svg: {
          fill: constant.THEME,
          onPress: () => this.animate(3, this.rotate3),
        },
        // arc: {cornerRadius: 3},
        rotate: 220,
      },
      {
        key: 4,
        amount: 25,
        svg: {
          fill: constant.THEME,
          onPress: () => this.animate(4, this.rotate4),
        },
        // arc: {cornerRadius: 3},
        rotate: -45,
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

            {/* {this.state.selectedValue != index + 1 ? ( */}
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

    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />
            {/* <Loader visiblity={this.props.workout.workoutLoad} /> */}
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.props.workout.workoutLoad}
                  onRefresh={() => this.workoutDashBoard()}
                />
              }>
              <View style={{flex: 0}}>
                <ScrollView>
                  <View
                    style={{
                      backgroundColor: constant.WHITE,
                      marginTop: constant.HEIGHT * 2,
                      width: constant.HEIGHT * 50,
                      alignSelf: 'center',
                    }}>
                    {this.props.workout.workout_banner.length != 0 ? (
                      <FlatListSlider
                        data={this.props.workout.workout_banner}
                        timer={5000}
                        imageKey={'image'}
                        local={false}
                        height={constant.HEIGHT * 15}
                        width={constant.HEIGHT * 49.9}
                        indicatorActiveColor={constant.THEME}
                        indicatorInActiveColor={constant.GREY}
                        contentContainerStyle={{paddingHorizontal: 0}}
                        // separatorWidth={2}
                        // outerMargin={constant.HEIGHT * 1}
                        // separatorWidth={constant.HEIGHT * 10}
                        loop={true}
                        autoScroll={true}
                        onPress={(item, index) => this.bannerNavigation(item)}
                        animation
                      />
                    ) : null}
                  </View>

                  <View
                    style={
                      {
                        // backgroundColor: 'red',
                        // position: 'absolute',
                      }
                    }>
                    <View
                      style={{
                        margin: constant.HEIGHT * 2,
                        padding: constant.HEIGHT * 2,
                        backgroundColor: constant.WHITE,
                        borderRadius: constant.HEIGHT * 1.5,
                        elevation:
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
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
                            <View
                              style={{
                                position: 'absolute',
                                backgroundColor: constant.WHITE,
                                width: constant.HEIGHT * 19,
                                height: constant.HEIGHT * 19,
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
                              {this.state.selectedValue == 1 ? (
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  {this.progressPie(
                                    this.props.workout.workoutPlan !=
                                      undefined &&
                                      this.props.workout.workoutPlan.program !=
                                        undefined &&
                                      this.props.workout.workoutPlan.program
                                        .completed != undefined
                                      ? this.props.workout.workoutPlan.program
                                          .completed
                                      : '0',
                                  )}
                                  <View
                                    style={{
                                      position: 'absolute',
                                      width: constant.HEIGHT * 15,
                                      height: constant.HEIGHT * 15,
                                      borderRadius: constant.HEIGHT * 5,
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: constant.responsiveFontSize(
                                          4,
                                        ),
                                        fontWeight: 'bold',
                                        color: '#846B93',
                                        fontFamily: constant.SUIFONT,
                                      }}>
                                      {this.props.workout.workoutPlan !=
                                        undefined &&
                                      this.props.workout.workoutPlan.program !=
                                        undefined &&
                                      this.props.workout.workoutPlan.program
                                        .completed != undefined
                                        ? this.props.workout.workoutPlan.program
                                            .completed + '%'
                                        : '0%'}
                                    </Text>
                                    <Text
                                      numberOfLines={2}
                                      style={{
                                        fontSize: constant.responsiveFontSize(
                                          1.8,
                                        ),
                                        textAlign: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        color: '#846B93',
                                        fontFamily: constant.SUIFONT,
                                      }}>
                                      {this.props.workout.workoutPlan !=
                                      undefined
                                        ? this.props.workout.workoutPlan
                                            .program != undefined
                                          ? this.props.workout.workoutPlan
                                              .program.program_name != undefined
                                            ? this.props.workout.workoutPlan
                                                .program.program_name
                                            : ''
                                          : ''
                                        : ''}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: constant.responsiveFontSize(
                                          2,
                                        ),
                                        fontWeight: 'bold',
                                        color: constant.THEME,
                                        marginTop: 7,
                                        fontFamily: constant.SUIFONT,
                                      }}>
                                      My plan
                                    </Text>
                                  </View>
                                </View>
                              ) : this.state.selectedValue == 2 ? (
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: constant.HEIGHT * 15,
                                    height: constant.HEIGHT * 15,
                                    borderRadius: constant.HEIGHT * 5,
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  {this.props.workout.workoutEquipment.length !=
                                  0 ? (
                                    <Text
                                      style={{
                                        fontSize: constant.responsiveFontSize(
                                          3.4,
                                        ),
                                        fontWeight: 'bold',
                                        color: '#846B93',
                                        fontFamily: constant.SUIFONT,
                                      }}>
                                      {
                                        this.props.workout.workoutEquipment
                                          .length
                                      }
                                    </Text>
                                  ) : null}
                                  <Text
                                    style={{
                                      fontSize: constant.responsiveFontSize(2),
                                      color: '#846B93',
                                      fontFamily: constant.SUIFONT,
                                      alignSelf: 'center',
                                      textAlign: 'center',
                                    }}>
                                    {this.props.workout.workoutEquipment
                                      .length != 0
                                      ? 'EQUIPMENTS'
                                      : 'ADD EQUIPMENTS'}
                                  </Text>
                                </View>
                              ) : this.state.selectedValue == 3 ? (
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: constant.HEIGHT * 15,
                                    height: constant.HEIGHT * 15,
                                    borderRadius: constant.HEIGHT * 5,
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: constant.responsiveFontSize(2),
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      textAlign: 'center',
                                      fontFamily: constant.SUIFONT,
                                      color: '#846B93',
                                    }}>
                                    PERSONAL TRAINING
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: constant.HEIGHT * 15,
                                    height: constant.HEIGHT * 15,
                                    borderRadius: constant.HEIGHT * 5,
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: constant.responsiveFontSize(2),
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      textAlign: 'center',
                                      color: '#846B93',
                                      fontFamily: constant.SUIFONT,
                                    }}>
                                    CUSTOM PLAN
                                  </Text>
                                </View>
                              )}
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
                      </View>

                      {this.state.selectedValue == 1 ? (
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              this.onProgramDetails(
                                this.props.workout.workoutPlan.program,
                              )
                            }
                            style={{
                              marginTop: constant.HEIGHT * 3,
                              width: constant.WIDTH * 85,
                              height: constant.HEIGHT * 23,
                              alignSelf: 'center',
                            }}>
                            {this.props.workout.workoutPlan != undefined &&
                            this.props.workout.workoutPlan.program !=
                              undefined &&
                            this.props.workout.workoutPlan.program
                              .banner_image != undefined &&
                            this.props.workout.workoutPlan.program.banner_image
                              .filename != undefined ? (
                              <ImageBackground
                                resizeMode={'cover'}
                                style={{
                                  borderRadius: constant.HEIGHT * 1,
                                  width: constant.WIDTH * 85,
                                  height: constant.HEIGHT * 23,
                                  borderBottomLeftRadius: constant.HEIGHT * 1,
                                  borderBottomRightRadius: constant.HEIGHT * 1,
                                  borderTopRightRadius: constant.HEIGHT * 1,
                                  borderTopLeftRadius: constant.HEIGHT * 1,
                                  overflow: 'hidden',
                                }}
                                source={{
                                  uri:
                                    this.props.workout.workoutPlan !=
                                      undefined &&
                                    this.props.workout.workoutPlan.program !=
                                      undefined &&
                                    this.props.workout.workoutPlan.program
                                      .banner_image != undefined &&
                                    this.props.workout.workoutPlan.program
                                      .banner_image.filename != undefined
                                      ? Url.baseUrl +
                                        Url.images +
                                        this.props.workout.workoutPlan.program
                                          .banner_image.filename
                                      : '',
                                }}>
                                <View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      padding: constant.HEIGHT * 2,
                                      justifyContent: 'space-between',
                                    }}>
                                    <View>
                                      {this.props.workout.workoutPlan !=
                                        undefined &&
                                      this.props.workout.workoutPlan.program !=
                                        undefined &&
                                      this.props.workout.workoutPlan.program
                                        .level != undefined ? (
                                        <Text
                                          style={{
                                            borderRadius: constant.HEIGHT * 0.5,
                                            paddingHorizontal:
                                              constant.HEIGHT * 0.5,
                                            color: constant.WHITE,
                                            textAlign: 'center',
                                            fontSize: constant.responsiveFontSize(
                                              1.5,
                                            ),
                                            fontWeight: 'bold',
                                            backgroundColor: '#B18B59',
                                            fontFamily: constant.SUIFONT,
                                          }}>
                                          {this.props.workout.workoutPlan !=
                                            undefined &&
                                          this.props.workout.workoutPlan
                                            .program != undefined &&
                                          this.props.workout.workoutPlan.program
                                            .level != undefined
                                            ? this.props.workout.workoutPlan
                                                .program.level
                                            : ''}
                                        </Text>
                                      ) : null}
                                    </View>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.onBookMark(
                                          this.props.workout.workoutPlan
                                            .program,
                                        )
                                      }
                                      style={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        padding: constant.HEIGHT * 0.5,
                                      }}>
                                      <Image
                                        style={{
                                          width:
                                            this.state.bookmark == true
                                              ? constant.HEIGHT * 3.5
                                              : constant.HEIGHT * 2,
                                          height:
                                            this.state.bookmark == true
                                              ? constant.HEIGHT * 3.5
                                              : constant.HEIGHT * 2,
                                        }}
                                        source={
                                          this.state.bookmark == true
                                            ? constant.c
                                            : constant.ICONBOOKMARK
                                        }
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignSelf: 'flex-end',
                                      justifyContent: 'flex-end',
                                      marginBottom: constant.HEIGHT * 3,
                                      height: constant.HEIGHT * 12.5,
                                    }}>
                                    <View
                                      style={{
                                        alignSelf: 'flex-end',
                                        flex: 0.7,
                                      }}>
                                      <Text
                                        style={{
                                          borderRadius: constant.HEIGHT * 0.5,
                                          paddingHorizontal:
                                            constant.HEIGHT * 1.5,
                                          color: constant.WHITE,
                                          opacity: 0.8,
                                          textAlign: 'left',
                                          fontSize: constant.responsiveFontSize(
                                            1.8,
                                          ),
                                          fontWeight: 'bold',
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {this.props.workout.workoutPlan !=
                                          undefined &&
                                        this.props.workout.workoutPlan
                                          .program != undefined &&
                                        this.props.workout.workoutPlan.program
                                          .program_name != undefined
                                          ? this.props.workout.workoutPlan
                                              .program.program_name
                                          : ''}
                                      </Text>
                                    </View>
                                    <TouchableOpacity
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
                                          tintColor: constant.WHITE,
                                        }}
                                        source={constant.ICONCALENDAR}
                                      />
                                      <Text
                                        style={{
                                          borderRadius: constant.HEIGHT * 0.5,
                                          paddingHorizontal:
                                            constant.HEIGHT * 1,
                                          color: constant.WHITE,
                                          opacity: 0.8,
                                          textAlign: 'center',
                                          fontSize: constant.responsiveFontSize(
                                            1.5,
                                          ),
                                          fontWeight: 'bold',
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {this.props.workout.workoutPlan !=
                                          undefined &&
                                        this.props.workout.workoutPlan
                                          .program != undefined &&
                                        this.props.workout.workoutPlan.program
                                          .durations != undefined
                                          ? this.props.workout.workoutPlan
                                              .program.durations + ' Days'
                                          : ''}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </ImageBackground>
                            ) : (
                              <ImageBackground
                                resizeMode={'cover'}
                                style={{
                                  width: constant.WIDTH * 85,
                                  height: constant.HEIGHT * 23,
                                  borderBottomLeftRadius: constant.HEIGHT * 1,
                                  borderBottomRightRadius: constant.HEIGHT * 1,
                                  borderTopRightRadius: constant.HEIGHT * 1,
                                  borderTopLeftRadius: constant.HEIGHT * 1,
                                  overflow: 'hidden',
                                }}
                                source={constant.ICONCUSTOMPLAN}>
                                <View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      padding: constant.HEIGHT * 2,
                                      justifyContent: 'space-between',
                                    }}>
                                    <View>
                                      {this.props.workout.workoutPlan !=
                                        undefined &&
                                      this.props.workout.workoutPlan.program !=
                                        undefined &&
                                      this.props.workout.workoutPlan.program
                                        .level != undefined ? (
                                        <Text
                                          style={{
                                            borderRadius: constant.HEIGHT * 0.5,
                                            paddingHorizontal:
                                              constant.HEIGHT * 0.5,
                                            color: constant.WHITE,
                                            textAlign: 'center',
                                            fontSize: constant.responsiveFontSize(
                                              1.5,
                                            ),
                                            fontWeight: 'bold',
                                            backgroundColor: '#B18B59',
                                            fontFamily: constant.SUIFONT,
                                          }}>
                                          {this.props.workout.workoutPlan !=
                                            undefined &&
                                          this.props.workout.workoutPlan
                                            .program != undefined &&
                                          this.props.workout.workoutPlan.program
                                            .level != undefined
                                            ? this.props.workout.workoutPlan
                                                .program.level
                                            : ''}
                                        </Text>
                                      ) : null}
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => this.onBookMark()}
                                      style={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        padding: constant.HEIGHT * 0.5,
                                      }}>
                                      <Image
                                        style={{
                                          width: constant.HEIGHT * 2,
                                          height: constant.HEIGHT * 2,
                                        }}
                                        source={
                                          this.state.bookmark == true
                                            ? constant.ICONBOOKMARKSELECT
                                            : constant.ICONBOOKMARK
                                        }
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      marginTop: constant.HEIGHT * 10.5,
                                    }}>
                                    <View
                                      style={{
                                        alignSelf: 'flex-end',
                                        flex: 0.7,
                                      }}>
                                      <Text
                                        style={{
                                          borderRadius: constant.HEIGHT * 0.5,
                                          paddingHorizontal:
                                            constant.HEIGHT * 1.5,
                                          color: constant.WHITE,
                                          opacity: 0.8,
                                          textAlign: 'left',
                                          fontSize: constant.responsiveFontSize(
                                            2.2,
                                          ),
                                          fontWeight: 'bold',
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {this.props.workout.workoutPlan !=
                                          undefined &&
                                        this.props.workout.workoutPlan
                                          .program != undefined &&
                                        this.props.workout.workoutPlan.program
                                          .program_name != undefined
                                          ? this.props.workout.workoutPlan
                                              .program.program_name
                                          : ''}
                                      </Text>
                                    </View>
                                    <TouchableOpacity
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
                                          paddingHorizontal:
                                            constant.HEIGHT * 1,
                                          color: constant.WHITE,
                                          opacity: 0.8,
                                          textAlign: 'center',
                                          fontSize: constant.responsiveFontSize(
                                            1.5,
                                          ),
                                          fontWeight: 'bold',
                                          fontFamily: constant.SUIFONT,
                                        }}>
                                        {this.props.workout.workoutPlan !=
                                          undefined &&
                                        this.props.workout.workoutPlan
                                          .program != undefined &&
                                        this.props.workout.workoutPlan.program
                                          .durations != undefined
                                          ? this.props.workout.workoutPlan
                                              .program.durations + ' Days'
                                          : ''}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </ImageBackground>
                            )}
                          </TouchableOpacity>

                          <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                              onPress={() => console.log('h')}
                              style={{
                                flex: 0.7,
                                paddingTop: constant.HEIGHT * 2,
                              }}>
                              <Text
                                style={{
                                  textAlign: 'left',
                                  color: constant.BLACK,
                                  opacity: 0.6,
                                  fontWeight: 'bold',
                                  fontFamily: constant.SUIFONT,
                                }}>
                                {' Started on ' + this.state.startedDate}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('ChangePlan')
                              }
                              style={{
                                flex: 0.3,
                                paddingTop: constant.HEIGHT * 2,
                              }}>
                              <Text
                                style={{
                                  textDecorationLine: 'underline',
                                  textAlign: 'right',
                                  color: constant.BLACK,
                                  opacity: 0.6,
                                  fontWeight: 'bold',
                                  fontFamily: constant.SUIFONT,
                                }}>
                                Change Plan
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : this.state.selectedValue == 2 ? (
                        <View>
                          <FlatList
                            data={this.props.workout.workoutEquipment}
                            extraData={this.state}
                            // keyExtractor={this._keyExtractor}
                            renderItem={this.renderEquipment}
                            ListEmptyComponent={this.showEmptyListView}
                          />

                          <TouchableOpacity
                            style={{
                              alignSelf: 'center',
                              marginTop: constant.HEIGHT * 3,
                              flexDirection: 'row',

                              padding: constant.HEIGHT * 1,
                              backgroundColor: constant.WHITE,
                              borderRadius: constant.HEIGHT * 1,
                              elevation:
                                Platform.OS === 'ios'
                                  ? null
                                  : constant.HEIGHT * 0.5,
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
                            }}
                            onPress={() => this.addEquipment()}>
                            <Image
                              source={constant.ICONADDBUTTON}
                              style={{
                                marginHorizontal: constant.HEIGHT * 1,
                                width: constant.HEIGHT * 2,
                                height: constant.HEIGHT * 2,
                                marginTop: constant.HEIGHT * 0.2,
                              }}
                            />
                            <Text
                              style={{
                                marginRight: constant.HEIGHT * 1,

                                fontSize: constant.responsiveFontSize(1.6),
                                opacity: 0.6,
                                fontWeight: 'bold',
                                fontFamily: constant.SUIFONT,
                              }}>
                              {'Add'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : this.state.selectedValue == 3 ? (
                        <View
                          style={{
                            marginTop: constant.HEIGHT * 2,

                            backgroundColor: constant.WHITE,
                            borderRadius: constant.HEIGHT * 1.5,
                            elevation:
                              Platform.OS === 'ios'
                                ? null
                                : constant.HEIGHT * 0.5,
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
                            <Image
                              resizeMode={'stretch'}
                              style={{
                                flex: 0.6,
                                height: '100%',
                                alignSelf: 'stretch',
                              }}
                              source={constant.ICONDIETCOUCH}></Image>

                            <View
                              style={{
                                margin: constant.HEIGHT * 2,
                                flex: 0.4,
                              }}>
                              <Text
                                style={{
                                  color: '#5D5C5C',
                                  fontSize: constant.responsiveFontSize(1.8),
                                  fontFamily: constant.SUIFONT,
                                  fontWeight: 'bold',
                                }}>
                                Personal Trainer
                              </Text>
                              <Text
                                style={{
                                  color: '#5D5C5C',
                                  fontSize: constant.responsiveFontSize(1.6),
                                  marginTop: constant.HEIGHT * 2,
                                  fontFamily: constant.SUIFONT,
                                }}>
                                {
                                  'Get a customised plan that helps your reach your goal quicker'
                                }
                              </Text>
                              <TouchableOpacity
                                style={{
                                  backgroundColor: constant.THEME,
                                  borderRadius: constant.HEIGHT * 1.5,
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                  marginTop: constant.HEIGHT * 2,
                                }}
                                onPress={() => this.onBookNow()}>
                                <Text
                                  style={{
                                    color: constant.WHITE,
                                    fontSize: constant.responsiveFontSize(1.8),
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    paddingVertical: constant.HEIGHT * 1,
                                    paddingHorizontal: constant.HEIGHT * 3,
                                    fontFamily: constant.SUIFONT,
                                  }}>
                                  Book now
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ) : this.state.selectedValue == 4 ? (
                        <TouchableOpacity
                          onPress={() => this.onCustomWorkout()}>
                          <View
                            style={{
                              marginTop: constant.HEIGHT * 2,
                              backgroundColor: constant.WHITE,
                              borderRadius: constant.HEIGHT * 1.5,
                              elevation:
                                Platform.OS === 'ios'
                                  ? null
                                  : constant.HEIGHT * 0.5,
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
                            <ImageBackground
                              resizeMode={'contain'}
                              style={{
                                width: constant.WIDTH * 85,
                                height: constant.HEIGHT * 23,
                              }}
                              source={
                                constant.ICONCUSTOMIZED
                              }></ImageBackground>
                          </View>
                        </TouchableOpacity>
                      ) : null}
                      {this.state.selectedValue == 3 ? (
                        <Text
                          style={{
                            color: '#5D5C5C',
                            fontSize: constant.responsiveFontSize(1.8),
                            marginVertical: constant.HEIGHT * 1,
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {''}
                        </Text>
                      ) : this.state.selectedValue == 4 ? (
                        <Text
                          style={{
                            color: '#5D5C5C',
                            fontSize: constant.responsiveFontSize(1.8),
                            marginVertical: constant.HEIGHT * 2,
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                          }}>
                          {''}
                        </Text>
                      ) : null}
                    </View>

                    <View
                      style={{
                        marginHorizontal: constant.HEIGHT * 3,
                        marginBottom: constant.HEIGHT * 12,
                      }}>
                      {this.props.workout.workoutTopPrograms.length != 0 ? (
                        <Text
                          style={{
                            textAlign: 'left',
                            color: constant.BLACK,
                            opacity: 0.6,
                            fontWeight: 'bold',
                            fontSize: constant.responsiveFontSize(2),
                            fontFamily: constant.SUIFONT,
                          }}>
                          Top picks for cross trainer programs
                        </Text>
                      ) : null}

                      <FlatList
                        data={this.props.workout.workoutTopPrograms}
                        extraData={this.state}
                        // keyExtractor={this._keyExtractor}
                        renderItem={this.renderVideo}
                        ListEmptyComponent={this.showEmptyListView}
                      />
                    </View>
                    <View style={{marginTop: constant.HEIGHT * 10}}></View>
                  </View>
                </ScrollView>
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
    workout: state.dashBoardReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onProgramDetailAction,
      getLibraryAction,
      getEquipmentListAction,
      onBannerImageAction,
      onCustomPlanListAction,
      onBookingAction,
      onBookMarkAction,
      addEquipmentAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
