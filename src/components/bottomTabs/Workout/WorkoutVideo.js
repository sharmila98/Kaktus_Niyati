import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Image,
  UIManager,
  FlatList,
  LayoutAnimation,
  SafeAreaView,
  BackHandler,
  Text,
  ScrollView,
  useColorScheme,
  Dimensions,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  StatusBar,
  RefreshControl,
} from 'react-native';
// import { constant } from "lodash";

import * as constant from './../../../utils/constants';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import Icon from 'react-native-vector-icons/FontAwesome5'; // and this
import Orientation from 'react-native-orientation';
import * as Progress from 'react-native-progress';
import Slider from './../../../libs/Slider';
import Ripple from './../../../libs/Ripple/Ripple';
import CallDetectorManager from 'react-native-call-detection';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {onWorkoutDayStatus} from '../../../action/Workout_action';
// import GoogleCast, { CastButton } from 'react-native-google-cast'

const {width} = Dimensions.get('window');

var videoIndex = 0;

class WorkoutVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      orgDuration: 0,
      paused: false,
      overlay: false,
      fullscreen: false,
      loading: false,
      error: false,
      repeatTimes: false,
      restTimer: false,
      repeatCount: 0,
      restDuration: 0,
      restSeconds: 0,
      completed: false,
      user_satisfied: '',
      userDislike: false,
      userLike: true,
      userPercent: 0,
    };
  }

  startListenerTapped() {
    this.callDetector = new CallDetectorManager(
      (event, phoneNumber) => {
        // For iOS event will be either "Connected",
        // "Disconnected","Dialing" and "Incoming"

        // For Android event will be either "Offhook",
        // "Disconnected", "Incoming" or "Missed"
        // phoneNumber should store caller/called number

        console.log(event, phoneNumber);

        if (event === 'Disconnected') {
          // Do something call got disconnected
          this.setState({paused: false, overlay: false});
        } else if (event === 'Connected') {
          // Do something call got connected
          // This clause will only be executed for iOS
        } else if (event === 'Incoming') {
          // Do something call got incoming
          this.setState({paused: true, overlay: true});
          clearInterval(this.interval);
        } else if (event === 'Dialing') {
          // Do something call got dialing
          // This clause will only be executed for iOS
          this.setState({paused: true, overlay: true});
          clearInterval(this.interval);
        } else if (event === 'Offhook') {
          this.setState({paused: true, overlay: true});
          clearInterval(this.interval);
          //Device call state: Off-hook.
          // At least one call exists that is dialing,
          // active, or on hold,
          // and no calls are ringing or waiting.
          // This clause will only be executed for Android
        } else if (event === 'Missed') {
          this.setState({paused: false, overlay: false});
          // Do something call got missed
          // This clause will only be executed for Android
        }
      },
      false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );
  }

  stopListenerTapped() {
    this.callDetector && this.callDetector.dispose();
  }

  loader() {
    if (this.state.loading == true) {
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        loading: true,
      });
    }
  }

  loaderfalse() {
    this.setState({
      loading: false,
    });
  }

  loadertrue() {
    console.log('buffering');
    this.setState({
      loading: true,
    });
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    StatusBar.setHidden(false);
    clearInterval(this.interval);
  }

  goback() {
    Orientation.unlockAllOrientations();
    Orientation.lockToPortrait();
    StatusBar.setHidden(false);
    clearInterval(this.interval);
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  }

  componentDidMount() {
    Orientation.lockToLandscape();
    StatusBar.setHidden(true);
    this.setState({fullscreen: true});
    if (
      this.props.workout.workoutSingleDayDetails.length ==
      this.props.workout.completed_exercise
    ) {
      videoIndex = 0;
    } else {
      videoIndex =
        this.props.workout.completed_exercise == 0
          ? 0
          : this.props.workout.completed_exercise - 1;
    }

    this.loader();
    this.startListenerTapped();
    this.setState({repeatTimes: true});
  }

  handleDoubleTap = (doubleTapCallback, singleTapCallback) => {
    // lastTap = null;
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      clearTimeout(this.timer);
      doubleTapCallback();
    } else {
      this.lastTap = now;
      this.timer = setTimeout(() => {
        singleTapCallback();
      }, DOUBLE_PRESS_DELAY);
    }
  };

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    // Setup the header and tabBarVisible status
    const header = state.params && (state.params.fullscreen ? undefined : null);
    const tabBarVisible = state.params ? state.params.fullscreen : true;
    return {
      // For stack navigators, you can hide the header bar like so
      header,
      // For the tab navigators, you can hide the tab bar like so
      tabBarVisible,
    };
  };

  overlay = () => {
    if (this.state.overlay == true) {
      this.setState({overlay: false});
    } else {
      this.setState({overlay: true});
      setTimeout(() => {
        this.setState({overlay: false});
      }, 5000);
    }
  };

  onEndVideo = ({enddd}) => {
    console.log('endVi');
  };

  onBuffer = () => {
    console.log('onBuffer');
    this.loadertrue();
  };

  end = ({enddd}) => {
    console.log('end');
    if (videoIndex >= this.props.workout.workoutSingleDayDetails.length - 1) {
      console.log('completed');
      this.setState({
        completed: true,
      });
      this.dayStatus(videoIndex, 'completed');
    } else {
      this.setState(
        {
          paused: true,
          restTimer: true,
          restSeconds: this.state.restDuration,
        },
        function () {
          this.startRest();
          setTimeout(() => {
            console.log('this.state.repeatCount', this.state.repeatCount);
            if (this.state.repeatCount == 0) {
              this.setState(
                {
                  paused: false,
                  restTimer: false,
                  repeatTimes: true,
                },
                function () {
                  videoIndex = videoIndex + 1;
                  this.loadertrue();
                  this.dayStatus(videoIndex, 'progress');
                },
              );
            } else {
              this.video.seek(0);
              this.setState({
                duration: this.state.orgDuration,
                paused: false,
                restTimer: false,
                repeatTimes: true,
              });
            }
          }, this.state.restDuration * 1000);
        },
      );
    }
  };

  dayStatus(videoIndex, status) {
    var head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    var url = Url.baseUrl + Url.dietDayStatus;

    var input = {
      member_id: this.props.signIn.member_id,
      program_id: this.props.workout.workoutSingleDayDetails[videoIndex]
        .program_id,
      program_type: 'workout',
      completed_exercise: videoIndex + 1,
      status: status,
      user_satisfied: this.state.user_satisfied,
      day: this.props.workout.workoutDay,
    };

    this.props
      .onWorkoutDayStatus(head, url, methods.post, input)
      .then((resp) => {
        console.log(resp);
      });
  }

  load = ({duration}) => {
    console.log('load');
    this.loaderfalse();
    var dur =
      parseInt(duration) *
      parseInt(
        this.props.workout.workoutSingleDayDetails[videoIndex].library_data
          .count,
      );
    var repCount = parseInt(
      this.props.workout.workoutSingleDayDetails[videoIndex].library_data
        .times_to_repeat,
    );
    var rest = parseInt(
      this.props.workout.workoutSingleDayDetails[videoIndex].library_data.rest,
    );
    clearInterval(this.interval);
    this.setState(
      {
        duration: dur,
        orgDuration: dur,
        repeatCount: repCount,
        restDuration: rest,
        restSeconds: rest,
        videoRepCount: this.props.workout.workoutSingleDayDetails[videoIndex]
          .library_data.count,
      },
      function () {},
    );
  };

  getTime = (t, currentTime) => {
    const digit = (n) => (n < 10 ? `0${n}` : `${n}`);
    // const t = Math.round(time);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));

    const csec = digit(Math.floor(currentTime % 60));
    const cmin = digit(Math.floor((currentTime / 60) % 60));
    const chr = digit(Math.floor((currentTime / 3600) % 60));

    var seconds = sec - csec;
    var minutes = min - cmin;

    return seconds; // this will convert sec to timer string
  };

  progress = ({currentTime}) => {
    // const digit = (n) => (n < 10 ? `0${n}` : `${n}`);

    // console.log('Current ', digit(Math.floor(currentTime % 60)));
    if (this.state.duration > 0) {
      this.setState(
        {
          duration: this.state.duration - 1,
          currentTime: currentTime,
        },
        function () {
          // console.log('&&&', this.state.duration);
          if (this.state.duration <= 5) {
            console.log(this.state.repeatCount);
            this.setState({
              repeatTimes: false,
            });
            if (this.state.repeatCount != 0) {
              this.setState(
                {
                  repeatCount: this.state.repeatCount - 1,
                },
                function () {
                  console.log('^%%%%%%%%%%0', this.state.repeatCount);
                },
              );
            }
          } else {
            this.setState({
              repeatTimes: true,
            });
          }
        },
      );
    }
  };

  startRest() {
    try {
      this.interval = setInterval(() => {
        console.log('hi', this.state.restSeconds);
        this.setState({
          restSeconds: this.state.restSeconds - 1,
        });
        if (this.state.restSeconds == 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    } catch (error) {}
  }

  onReady = () => {
    console.log('dd');
  };

  backward = () => {
    this.video.seek(this.state.currentTime - 5);
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };
  forward = () => {
    this.video.seek(this.state.currentTime + 5); // here the video is seek to 5 sec forward
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };

  onslide = (slide) => {
    this.video.seek(slide * this.state.duration); // here the upation is maked for video seeking
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({overlay: false}), 3000);
  };

  youtubeSeekLeft = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        this.video.seek(currentTime - 5);
      },
      () => {
        this.setState({overlay: true});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: false}),
          3000,
        );
      },
    );
  };
  youtubeSeekRight = () => {
    const {currentTime} = this.state;
    this.handleDoubleTap(
      () => {
        // this fn is used to detect the double tap first callback
        this.video.seek(currentTime + 5);
      },
      () => {
        this.setState({overlay: true});
        this.overlayTimer = setTimeout(
          () => this.setState({overlay: false}),
          3000,
        );
      },
    );
  };

  fullscreen = () => {
    const {fullscreen} = this.state;
    if (fullscreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    this.setState({fullscreen: !fullscreen});
  };

  videoPause() {
    clearInterval(this.interval);
    this.setState({paused: true});
  }

  videoPlay() {
    this.setState({paused: false});
  }

  handleError = (meta) => {
    try {
      const {
        error: {code},
      } = meta;
      let error = 'An error occured playing video';

      switch (code) {
        case -11800:
          error = 'Could not load video from URL';
          break;
      }
      this.setState(error);
    } catch (error) {}
  };
  render() {
    const {
      currentTime,
      orgDuration,
      duration,
      paused,
      overlay,
      fullscreen,
      error,
    } = this.state;

    return (
      <View style={style.container}>
        <StatusBar hidden />
        <View style={fullscreen ? style.fullscreenVideo : style.video}>
          <Video
            fullscreen={true}
            poster={
              Url.baseUrl +
              Url.images +
              this.props.workout.workoutSingleDayDetails[videoIndex]
                .librarydata[0].ref_image.filename
            }
            posterResizeMode={'contain'}
            paused={paused}
            ref={(ref) => (this.video = ref)}
            repeat={this.state.repeatTimes}
            source={{
              uri: convertToProxyURL(
                this.props.workout.workoutSingleDayDetails[videoIndex]
                  .video_url,
              ),
              // cache: true,
            }}
            style={{
              ...StyleSheet.absoluteFillObject,
              // flex:1,
              // marginHorizontal: constant.HEIGHT * 1,
              // width: constant.HEIGHT * 30,
              // height: constant.HEIGHT * 40,
              backgroundColor: '#fff',
              resizeMode: 'contain',
            }}
            resizeMode="contain"
            onBuffer={this.onBuffer}
            onVideoBuffer={this.onBuffer}
            onError={this.handleError}
            onLoad={this.load}
            onEnd={this.end}
            preventsDisplaySleepDuringVideoPlayback={true}
            onLoadStart={this.onBuffer}
            onplayerr={this.onBuffer}
            playInBackground={false}
            onReadyForDisplay={this.onReady}
            progressUpdateInterval={parseInt('1000.0')}
            onProgress={this.progress}
            volume={1.0}
            // selectedVideoTrack={{
            //   type: 'resolution',
            //   value: 180,
            // }}
            reportBandwidth={true}
            // onLoadStart={console.log('loadStart')}
            // onVideoLoad={console.log('onVideoLoad')}
            // onVideoLoadStart={console.log('loadvideoStart')}
            onVideoEnd={this.onEndVideo}
          />
          <View style={style.overlay}>
            {/* now we can remove this not */}

            {/* {overlay == true ? ( */}

            <View
              style={{
                flex: 1,
                backgroundColor: overlay == true ? '#0006' : 'transparent',
              }}>
              {this.state.completed == false ? (
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.overlay}
                    style={{flex: 0.4, flexDirection: 'row'}}>
                    {overlay == true ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: constant.HEIGHT * 1,
                          marginTop: constant.HEIGHT * 1,
                          flex: 1,
                          // backgroundColor: 'orange',
                        }}>
                        <TouchableOpacity
                          onPress={() => this.goback()}
                          style={{
                            paddingVertical: constant.HEIGHT * 2,
                            paddingLeft: constant.HEIGHT * 2,
                            paddingRight: constant.HEIGHT * 2,
                            flex: 0.05,
                          }}>
                          <Image
                            source={constant.ICONBACKVIDEO}
                            resizeMode={'cover'}
                            style={{
                              width: constant.HEIGHT * 4,
                              height: constant.HEIGHT * 4,
                              tintColor: constant.THEME,
                            }}
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            flex: 0.65,
                            justifyContent: 'flex-start',
                            paddingTop: constant.HEIGHT * 1,
                          }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: constant.responsiveFontSize(1.4),
                              color: '#fff',
                            }}>
                            {this.props.workout.workoutSingleDayDetails[
                              videoIndex
                            ].librarydata[0] != undefined
                              ? this.props.workout.workoutSingleDayDetails[
                                  videoIndex
                                ].librarydata[0].library_name
                              : ''}
                          </Text>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: constant.responsiveFontSize(1.3),
                              color: '#fff',
                            }}>
                            {'Day ' +
                              this.props.workout.workoutSingleDayDetails[
                                videoIndex
                              ].day}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                            marginRight: constant.HEIGHT * 3,
                            flex: 0.4,
                          }}>
                          <TouchableOpacity
                            style={{
                              padding: constant.HEIGHT * 3,
                            }}>
                            {/* <CastButton
                          style={{
                            width: constant.HEIGHT * 4,
                            height: constant.HEIGHT * 4,
                          }}
                        /> */}
                            {/* <Image
                          source={constant.ICONCAST}
                          resizeMode={'contain'}
                          style={{
                            width: constant.HEIGHT * 4,
                            height: constant.HEIGHT * 4,
                            tintColor: constant.WHITE,
                          }}
                        /> */}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              padding: constant.HEIGHT * 3,
                            }}>
                            {/* <Image
                          source={constant.ICONINFO}
                          resizeMode={'contain'}
                          style={{
                            width: constant.HEIGHT * 4,
                            height: constant.HEIGHT * 4,
                            tintColor: constant.WHITE,
                          }}
                        /> */}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              padding: constant.HEIGHT * 3,
                            }}>
                            {/* <Image
                          source={constant.ICONMUSIC}
                          resizeMode={'contain'}
                          style={{
                            width: constant.HEIGHT * 4,
                            height: constant.HEIGHT * 4,
                            tintColor: constant.WHITE,
                          }}
                        /> */}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              padding: constant.HEIGHT * 3,
                            }}>
                            {/* <Image
                          source={constant.ICONBROADCAST}
                          resizeMode={'contain'}
                          style={{
                            width: constant.HEIGHT * 4,
                            height: constant.HEIGHT * 4,
                            tintColor: constant.WHITE,
                          }}
                        /> */}
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.overlay}
                    style={{flex: 0.2}}>
                    <View
                      style={{
                        justifyContent: 'center',
                        marginHorizontal: constant.HEIGHT * 48,
                        borderRadius: constant.HEIGHT * 10,
                        flex: 1,
                      }}>
                      {this.state.restTimer == true ? (
                        <View
                          style={{
                            width: constant.HEIGHT * 12,
                            height: constant.HEIGHT * 12,
                            borderRadius: constant.HEIGHT * 8,
                            //  borderColor: constant.WHITE,
                            //  borderWidth: constant.HEIGHT * 1,
                            backgroundColor: constant.THEME,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: constant.responsiveFontSize(1.2),
                            }}>
                            {'Rest'}
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: constant.responsiveFontSize(1.4),
                            }}>
                            {this.state.restSeconds + ' Sec'}
                          </Text>
                        </View>
                      ) : this.state.loading == true ? (
                        <Progress.Circle
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            // backgroundColor: 'red',
                          }}
                          // progress={this.state.progress}
                          indeterminate={true}
                          color={'#FF67A4'}
                        />
                      ) : this.state.overlay == true ? (
                        this.state.paused == false ? (
                          <Ripple
                            onPress={() => this.videoPause()}
                            style={{
                              justifyContent: 'center',
                              // backgroundColor: 'blue',
                              alignItems: 'center',
                              padding: constant.HEIGHT * 2,

                              // flex: 1,
                            }}>
                            <Image
                              source={constant.ICONPAUSE}
                              resizeMode={'cover'}
                              style={{
                                width: constant.HEIGHT * 7,
                                height: constant.HEIGHT * 7,
                                tintColor: constant.THEME,
                              }}
                            />
                          </Ripple>
                        ) : (
                          <Ripple
                            onPress={() => this.videoPlay()}
                            style={{
                              justifyContent: 'center',
                              // backgroundColor: 'blue',
                              padding: constant.HEIGHT * 2,

                              alignItems: 'center',
                              // flex: 1,
                            }}>
                            <Image
                              source={constant.DOWNICON}
                              resizeMode={'contain'}
                              style={{
                                transform: [{rotate: '-90deg'}],
                                width: constant.HEIGHT * 6,
                                height: constant.HEIGHT * 6,
                                tintColor: constant.THEME,
                              }}
                            />
                          </Ripple>
                        )
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.overlay}
                    style={{
                      flex: 0.4,
                      marginHorizontal: constant.HEIGHT * 1,
                      marginBottom: constant.HEIGHT * 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      flexDirection: 'row',
                    }}>
                    {this.state.loading == false &&
                    this.state.restTimer == false ? (
                      <View style={{flex: 0.5}}>
                        <View
                          style={{
                            width: constant.HEIGHT * 12,
                            height: constant.HEIGHT * 12,
                            borderRadius: constant.HEIGHT * 8,
                            borderColor: constant.WHITE,
                            borderWidth: constant.HEIGHT * 1,
                            marginLeft: constant.HEIGHT * 2,
                            backgroundColor: constant.THEME,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: constant.responsiveFontSize(1.5),
                            }}>
                            {this.state.duration}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    <View
                      style={{
                        flex: 0.5,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        paddingLeft: constant.HEIGHT * 5,
                        marginHorizontal: constant.HEIGHT * 2,
                        marginBottom: constant.HEIGHT * 2,
                      }}>
                      {this.state.restTimer == true &&
                      this.state.repeatCount == 0 ? (
                        <View
                          style={{
                            borderRadius: constant.HEIGHT * 1,
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
                            elevation:
                              Platform.OS === 'ios'
                                ? null
                                : constant.HEIGHT * 1,
                            flexDirection: 'row',
                            backgroundColor: constant.WHITE,
                            justifyContent: 'center',
                            alignItems: 'center',
                            // width: constant.HEIGHT * 30,
                            height: constant.HEIGHT * 8,
                          }}>
                          <View
                            style={{
                              paddingHorizontal: constant.HEIGHT * 2,
                              flexWrap: 'wrap',
                            }}>
                            <Text
                              style={{
                                opacity: 0.6,
                                fontSize: constant.responsiveFontSize(0.8),
                              }}>
                              {'Up Next'}
                            </Text>
                            <Text
                              numberOfLines={2}
                              style={{
                                color: constant.THEME,
                                fontWeight: 'bold',
                                maxWidth: constant.HEIGHT * 20,
                                fontSize: constant.responsiveFontSize(0.8),
                              }}>
                              {this.props.workout.workoutSingleDayDetails[
                                videoIndex + 1
                              ].librarydata[0] != undefined
                                ? this.props.workout.workoutSingleDayDetails[
                                    videoIndex + 1
                                  ].librarydata[0].library_name
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={{
                              justifyContent: 'center',
                              paddingRight: constant.HEIGHT * 1,
                            }}>
                            <Image
                              resizeMode="cover"
                              style={{
                                width: constant.HEIGHT * 8,
                                height: constant.HEIGHT * 8,
                                borderRadius: constant.HEIGHT * 1,
                              }}
                              source={{
                                uri:
                                  Url.baseUrl +
                                  Url.images +
                                  this.props.workout.workoutSingleDayDetails[
                                    videoIndex + 1
                                  ].librarydata[0].ref_image.filename,
                              }}
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: constant.THEMEGRADIENT,
                    borderRadius: constant.HEIGHT * 1,
                    alignItems: 'center',
                    marginHorizontal: constant.HEIGHT * 20,
                    marginVertical: constant.HEIGHT * 9,
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
                    elevation:
                      Platform.OS === 'ios' ? null : constant.HEIGHT * 1,
                    padding: constant.HEIGHT * 2,
                    flex: 1,
                  }}>
                  <Ripple
                    onPress={() => this.close()}
                    style={{
                      flex: 0.1,
                      justifyContent: 'flex-end',
                      alignSelf: 'flex-end',
                      padding: constant.HEIGHT * 1,
                    }}>
                    <Image
                      resizeMode="cover"
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        tintColor:
                          this.state.userLike == false
                            ? constant.GREY
                            : constant.THEME,
                      }}
                      source={constant.ICONCLOSE}
                    />
                  </Ripple>
                  <View style={{flex: 0.3}}>
                    <Text
                      numberOfLines={2}
                      style={{
                        opacity: 0.6,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: constant.responsiveFontSize(1.1),
                      }}>
                      {"Congratulations! You have completed\ntoday's workout."}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 0.4,
                    }}>
                    <Ripple
                      onPress={() => this.userSatisfied(1)}
                      style={{
                        paddingVertical: constant.HEIGHT * 4,
                        paddingHorizontal: constant.HEIGHT * 3,
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: constant.HEIGHT * 5,
                          height: constant.HEIGHT * 5,
                          tintColor:
                            this.state.userLike == false
                              ? constant.GREY
                              : constant.THEME,
                        }}
                        source={constant.ICONTHUMBUP}
                      />
                    </Ripple>
                    <Ripple
                      onPress={() => this.userSatisfied(2)}
                      style={{
                        paddingVertical: constant.HEIGHT * 4,
                        paddingHorizontal: constant.HEIGHT * 3,
                        marginTop: constant.HEIGHT * 2,
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: constant.HEIGHT * 5,
                          height: constant.HEIGHT * 5,
                          tintColor:
                            this.state.userDislike == false
                              ? constant.GREY
                              : constant.THEME,
                        }}
                        source={constant.ICONTHUMBDOWN}
                      />
                    </Ripple>
                  </View>
                  <View style={{flex: 0.2}}>
                    <View style={{marginTop: constant.HEIGHT * 3}}>
                      <Text
                        style={{
                          opacity: 0.6,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          fontSize: constant.responsiveFontSize(0.9),
                        }}>
                        {'How difficult was the workout?'}
                      </Text>

                      <Slider
                        step={1}
                        minimumValue={0}
                        maximumValue={100}
                        onValueChange={(ChangedValue) => {
                          this.setState({
                            userPercent: ChangedValue,
                          });
                        }}
                        thumbTouchSize={{
                          width: 30,
                          height: 30,
                        }}
                        trackStyle={{
                          height: constant.HEIGHT * 0.5,
                          borderRadius: constant.HEIGHT * 0.5,
                        }}
                        thumbStyle={{
                          width: 20,
                          height: 20,
                          borderRadius: 30 / 2,
                          backgroundColor: constant.WHITE,
                          elevation:
                            Platform.OS === 'ios'
                              ? null
                              : constant.HEIGHT * 0.5,
                          shadowColor: 'black',
                          shadowOffset: {width: 0, height: 2},
                          shadowRadius: 2,
                          shadowOpacity: 0.35,
                        }}
                        minimumTrackTintColor={constant.GREENLIGHT}
                        maximumTrackTintColor={constant.GREYLIGHT}
                      />
                    </View>
                  </View>
                  <Ripple
                    style={{
                      flex: 0.1,
                      alignSelf: 'flex-end',
                      justifyContent: 'flex-end',
                      paddingHorizontal: constant.HEIGHT * 0.5,
                      paddingVertical: constant.HEIGHT * 1,
                      marginTop: constant.HEIGHT * 6,
                    }}>
                    <Text
                      style={{
                        opacity: 0.6,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textDecorationLine: 'underline',
                        textDecorationStyle: 'solid',
                        fontSize: constant.responsiveFontSize(0.8),
                      }}>
                      {'Show reports of my workout'}
                    </Text>
                  </Ripple>
                </View>
              )}

              {/* <View style={{flexDirection: 'row', flex: 1}}>
                  <Icon
                    name="backward"
                    style={style.icon}
                    onPress={this.backward}
                  />
                 
                  <Icon
                    name="forward"
                    style={style.icon}
                    onPress={this.forward}
                  />
                  <View style={style.sliderCont}>
                    <View style={style.timer}>
                      <Text style={{color: 'white'}}>
                        {this.getTime(currentTime)}
                      </Text>
                      <Text style={{color: 'white'}}>
                        {this.getTime(duration)}{' '}
                      </Text>
                      <Icon
                      onPress={this.fullscreen}
                      name={fullscreen ? 'compress' : 'expand'}
                      style={{
                        backgroundColor: 'red',
                        padding: 10,
                      }}
                    />
                    </View>
                    <Slider
                      // we want to add some param here

                      maximumTrackTintColor="white"
                      minimumTrackTintColor="white"
                      thumbTintColor="white" // now the slider and the time will work
                      value={currentTime / duration} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                      onValueChange={this.onslide}
                    />
                  </View> 
                </View>*/}
            </View>

            {/* // ) : (
            //   <View style={style.overlaySet}>
            //     <TouchableNativeFeedback onPress={this.youtubeSeekLeft}>
            //       <View style={{flex: 1}} />
            //     </TouchableNativeFeedback>
            //     <TouchableNativeFeedback onPress={this.youtubeSeekRight}>
            //       <View style={{flex: 1}} />
            //     </TouchableNativeFeedback>
            //   </View>
            // )} */}
          </View>
          {this.state.restTimer == false && this.state.repeatCount != 0 ? (
            <Image
              source={constant.PINKHEADERICON}
              resizeMode={'contain'}
              style={{
                flex: 1,
                width: constant.HEIGHT * 12,
                height: constant.HEIGHT * 5,
                marginTop: constant.HEIGHT * 40,
                marginRight: constant.HEIGHT * 3,
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                tintColor: constant.GREYLIGHT,
              }}
            />
          ) : null}
        </View>

        {/* <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginVertical: 100,
              color: 'red',
              fontWeight: 'bold',
            }}>
            Hello Wellcome to TekNik GG
          </Text> */}
      </View>
    );
  }

  close() {
    try {
      this.setState({
        completed: false,
      });
      this.goback();
    } catch (error) {}
  }

  userSatisfied(type) {
    try {
      if (type == 1) {
        this.setState(
          {
            user_satisfied: true,
            userDislike: false,
            userLike: true,
          },
          function () {
            this.dayStatus(videoIndex, 'completed');
          },
        );
      } else {
        this.setState(
          {
            user_satisfied: false,
            userDislike: true,
            userLike: false,
          },
          function () {
            this.dayStatus(videoIndex, 'completed');
          },
        );
      }
    } catch (error) {}
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySet: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 25,
  },
  sliderCont: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  video: {
    width: width,
    height: width,
    backgroundColor: '#fff',
  },
  fullscreenVideo: {
    backgroundColor: 'black',
    ...StyleSheet.absoluteFill,
    elevation: 1,
  },
});

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    workout: state.dashBoardReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({onWorkoutDayStatus}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutVideo);
