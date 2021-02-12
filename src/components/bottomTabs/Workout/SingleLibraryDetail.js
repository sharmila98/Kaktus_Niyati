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
  ToastAndroid,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';

// import Sound from 'react-native-sound';

// import Slider from '@react-native-community/slider';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

var videos = [
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
];

import {
  onWorkoutDashBoard,
  onChangePlanAction,
  onProgramDDAction,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

var head, url;

var monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

var days = [
  {
    text: 'HIIT Express',
    image: constant.ICONWORKOUTHUMB,
    level: 'Level 1',
  },
  {
    text: 'Cardio blast',
    image: constant.ICONWORKOUT3,
    level: 'Level 1',
  },
  {
    text: 'Bike Charge',
    image: constant.ICONWORKOUT2,
    level: 'Level 1',
  },
  {
    text: 'HIIT Express',
    image: constant.ICONWORKOUTHUMB,
    level: 'Level 1',
  },
];
// import SoundPlayer from 'react-native-sound-player';

class SingleLibraryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: '',
    };
  }

  componentDidMount() {
    var image =
      Url.baseUrl +
      Url.images +
      this.props.workout.singleLibraryDetails[0].ref_image.filename;

    this.loadertrue();

    this.setState({images: image});

    // try {
    //   // play the file tone.mp3
    //   SoundPlayer.playUrl(
    //     'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    //   );
    // } catch (e) {
    //   console.log(`cannot play the sound file`, e);
    // }
    // Sound.setCategory('Playback', false);

    // const sound = new Sound(
    //   'https://transom.org/wp-content/uploads/2004/03/200206.hodgman8.mp3',
    //   Sound.MAIN_BUNDLE,
    //   (error) => this.callback(error, sound),
    // );
  }

  // callback = (error, sound) => {
  //   alert('error', error);
  //   sound.play(() => {
  //     sound.release();
  //   });
  // };

  _renderItem = ({item, index}) => {
    var image = Url.baseUrl + Url.images + item.image[0].filename;
    return (
      <View
        style={{
          marginBottom: constant.HEIGHT * 5,
          paddingLeft: constant.HEIGHT * 1,
        }}>
        <TouchableOpacity
          style={{
            elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: constant.WHITE,
            borderRadius: constant.HEIGHT * 1.5,
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
          <Image
            resizeMode={'contain'}
            source={{uri: image}}
            style={{
              marginHorizontal: constant.HEIGHT * 1,
              width: constant.HEIGHT * 13,
              height: constant.HEIGHT * 13,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginTop: constant.HEIGHT * 1,
            color: '#5D5C5C',
            width: constant.HEIGHT * 18,
            fontFamily: constant.SUIFONT,
            fontSize: constant.responsiveFontSize(1.8),
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          {item.name}
        </Text>
      </View>
    );
  };

  loadertrue() {
    console.log('buffering');
    this.setState({
      loading: true,
    });
  }

  loaderfalse() {
    this.setState({
      loading: false,
    });
  }

  load = ({duration}) => {
    console.log('load');
    this.loaderfalse();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          {/* <StatusBar backgroundColor={constant.THEME} overRelay={false} /> */}
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0, paddingBottom: constant.HEIGHT * 10}}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={this.props.workout.workoutLoad} />
                }>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  {/* <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('ProgramDetails')
                    }
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
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {this.props.workout.singleLibraryDetails[0].library_name}
                    </Text>
                  </TouchableOpacity> */}
                  <BackButtonwithTitle
                    title={
                      this.props.workout.singleLibraryDetails[0].library_name
                    }
                    underLine={false}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() => this.props.navigation.goBack()}
                  />

                  <TouchableOpacity
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <View
                      style={{
                        marginTop: constant.HEIGHT * 1.5,
                        marginBottom: constant.HEIGHT * 1,
                        borderRadius: constant.HEIGHT * 2,
                        width: constant.WIDTH * 85,
                        height: constant.HEIGHT * 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff',
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
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                      }}>
                      <Video
                        fullscreen={false}
                        poster={
                          Url.baseUrl +
                          Url.images +
                          this.props.workout.singleLibraryDetails[0].ref_image
                            .filename
                        }
                        posterResizeMode={'contain'}
                        paused={false} // this will manage the pause and play
                        ref={(ref) => (this.video = ref)}
                        repeat={true}
                        source={{
                          uri: convertToProxyURL(
                            this.props.workout.singleLibraryDetails[0].ref_video
                              .ref_video_url,
                          ),
                          cache: true,
                          // uri: videos[count],
                          // uri:
                          //   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
                        }}
                        style={{
                          width: constant.WIDTH * 85,
                          height: constant.HEIGHT * 25,
                          borderRadius: constant.HEIGHT * 2,
                        }}
                        resizeMode="cover"
                        onBuffer={this.onBuffer}
                        onVideoBuffer={this.onBuffer}
                        onError={this.handleError}
                        onLoad={this.load}
                        onEnd={this.end}
                        onLoadStart={this.onBuffer}
                        playInBackground={false}
                        onReadyForDisplay={this.onReady}
                        onProgress={this.progress}
                        volume={1.0}
                        selectedVideoTrack={{
                          type: 'resolution',
                          value: 180,
                        }}
                        reportBandwidth={true}
                        // onLoadStart={console.log('loadStart')}
                        // onVideoLoad={console.log('onVideoLoad')}
                        // onVideoLoadStart={console.log('loadvideoStart')}
                        onVideoEnd={this.onEndVideo}
                      />
                      <View
                        style={[
                          StyleSheet.absoluteFillObject,
                          {
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            marginHorizontal: constant.HEIGHT * 1,
                            marginVertical: constant.HEIGHT * 1,
                          },
                        ]}>
                        {this.state.loading == true ? (
                          <Progress.Circle
                            indeterminate={true}
                            size={20}
                            color={constant.THEME}
                          />
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      marginLeft: constant.HEIGHT * 4,
                      marginRight: constant.HEIGHT * 2,
                      marginTop: constant.HEIGHT * 2,
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(2),
                        color: '#6D6A6A',
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      Benefits
                    </Text>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        color: '#5D5C5C',
                        marginTop: constant.HEIGHT * 1,
                        marginRight: constant.HEIGHT * 1.5,
                        fontFamily: constant.SUIFONT,
                      }}>
                      {this.props.workout.singleLibraryDetails[0].desc}
                    </Text>

                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(2),
                        color: '#6D6A6A',
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      Targets
                    </Text>
                  </View>

                  <View
                    style={{
                      marginLeft: constant.HEIGHT * 3,
                      marginRight: constant.HEIGHT * 2,
                      marginTop: constant.HEIGHT * 2,

                    }}>
                    <FlatList
                      data={
                        this.props.workout.singleLibraryDetails[0].target_group
                      }
                      extraData={this.props}
                      // keyExtractor={this._keyExtractor}
                      renderItem={this._renderItem}
                      numColumns={2}
                      ListEmptyComponent={this.showEmptyListView}
                    />
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
    workout: state.dashBoardReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onWorkoutDashBoard,
      onChangePlanAction,
      onProgramDDAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleLibraryDetail);
