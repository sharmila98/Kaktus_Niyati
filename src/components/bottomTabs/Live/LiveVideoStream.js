import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  PixelRatio,
  Platform,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
// import YouTube, {
//   YouTubeStandaloneIOS,
//   YouTubeStandaloneAndroid,
// } from 'react-native-youtube';
import Orientation from 'react-native-orientation';
import YouTube from 'react-native-youtube';
import * as Progress from 'react-native-progress';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {WebView} from 'react-native-webview';

import * as constant from '../../../utils/constants';
// import {checkNotifications} from 'react-native-permissions';

var showinfo = false,
  rel = false,
  loop = false,
  modestbranding = false,
  videId;
class LiveVideoStream extends React.Component {
  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
    isLooping: true,
    duration: 0,
    currentTime: 0,
    fullscreen: false,
    playerWidth: Dimensions.get('window').width,
    playing: true,
    fullscreen: true,
  };

  _youTubeRef = React.createRef();

  componentDidMount() {
    Orientation.lockToLandscape();
    StatusBar.setHidden(true);
  }

  togglePlaying() {
    this.setState({playing: this.state.playing == true ? false : true});
  }

  _fireResizingHack() {
    clearInterval(this._timeout);

    let wait = 0.2;

    const next = () => {
      this.setState((state) => ({ resizingHackFlag: !state.resizingHackFlag }));

      wait = wait >= 1.5 ? 1.5 : wait * 1.4;
      this._timeout = setTimeout(next, wait * 1000);
    };

    next();
  }


  render() {
    var link = this.props.live.liveProgramDetails.program.live_video;
    return (
      <View style={styles.container}>
        {/* <YouTube
          apiKey="AIzaSyBmnXvH6Sj0BnLqPToMtqO85J1BofkVNAE"
          videoId={'D8GABO8BHvA'} // The YouTube video ID
          play={this.state.playing} // control playback of video with true/false
          fullscreen={this.state.fullscreen} // control whether the video should play in fullscreen or inline
          //   loop // control whether the video should loop when ended
          onReady={(e) => this.setState({isReady: true})}
          onChangeState={(e) => {
            if (e.state == 'playing') {
              this.setState({playing: true, fullscreen: true});
            } else if (e.state == 'paused') {
              this.setState({playing: false, fullscreen: false});
            } else if (e.state == 'end') {
              this.setState({playing: false, fullscreen: false});
            }
          }}
          onChangeQuality={(e) => this.setState({quality: e.quality})}
          onError={(e) => this.setState({error: e.error})}
          // style={{alignSelf: 'stretch', height: 270, width: '100%'}}
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
          showFullscreenButton={true}
          controls={2}
          rel={false}
          loop={false}
          showinfo={false}
          modestbranding={false}
        /> */}

        <WebView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          mediaPlaybackRequiresUserAction={false}
          userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          source={{ html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="https://www.youtube.com/embed/' + link + '?modestbranding=1&playsinline=1&showinfo=0&controls=&rel=0" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}} 
          // source={{
          //   uri: `https://www.youtube.com/embed/${link}?autoplay=1&rel=0&showinfo=0&controls=0&modestbranding=0`,
          //   // html:
          //   //   "<html><body><iframe width='640' height='360' id='ytplayer' type='text/html' src='https://www.youtube.com/embed/iee2TATGMyI?autoplay=1&rel=0&showinfo=0' frameborder=0 allowfullscreen=1></iframe></body></html>",
          // }}
          // source={{uri: 'https://www.youtube.com/embed/iee2TATGMyI?rel=0'}}
        />
        {/* <YoutubePlayer
          height={'100%'}
          play={this.state.playing}
          videoId={'iee2TATGMyI'}
          fullscreen={true}
          onChangeState={(e) => {}}
          initialPlayerParams={{
            showinfo: false,
            rel: 0,
            modestbranding: false,
            loop: true,
          }}
          webViewProps={{
            allowsFullscreenVideo: true,
            javaScriptEnabled: true,
            showinfo: false,
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            },
          }}
          webViewStyle={{
            showinfo: false,
          }}
          volume={100}
        /> */}

        {/* <Youtube
          remote="https://shahab-yousefi.github.io/react-native-youtube-iframe/youtube.html"
          videoId={'iee2TATGMyI'} // The YouTube video ID
          height={'100%'}
          initialPlayerParams={{
            showinfo: false,
            rel: 0,
            modestbranding: false,
            loop: true,
          }}
          webViewProps={{
            allowsFullscreenVideo: true,
            javaScriptEnabled: true,
            showinfo: 0,
            rel: 0,
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            },
          }}
        /> */}

        <TouchableOpacity
          onPress={() => {
            Orientation.lockToPortrait();
            StatusBar.setHidden(false);
            this.props.navigation.goBack();
          }}
          style={styles.topContainer}>
          <Image
            resizeMode={'contain'}
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              tintColor: constant.THEME,
            }}
            source={constant.ICONROUNDBACK}
          />
          {/* <Progress.Circle
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red',
            }}
            // progress={this.state.progress}
            indeterminate={true}
            color={'#FF67A4'}
          /> */}
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: constant.HEIGHT * 1,
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                resizeMode={'contain'}
                style={{
                  width: constant.HEIGHT * 1.5,
                  height: constant.HEIGHT * 2,
                  tintColor: '#ececec',
                }}
                source={constant.ICONCLOCK}
              />
              <View>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2),
                    color: '#ececec',
                    fontWeight: 'bold',
                    marginLeft: constant.HEIGHT * 0.7,
                    fontFamily: constant.SUIFONT,
                  }}>
                  12:05
                </Text>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(0.5),
                    color: '#a5a6a9',
                    fontWeight: 'bold',
                    fontFamily: constant.SUIFONT,
                  }}>
                  TIME LEFT
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', marginLeft: constant.HEIGHT * 3}}>
              <Image
                resizeMode={'contain'}
                style={{
                  width: constant.HEIGHT * 2.2,
                  height: constant.HEIGHT * 2.7,
                  tintColor: '#ececec',
                }}
                source={constant.ICONRANK}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      color: '#ececec',
                      fontWeight: 'bold',
                      marginLeft: constant.HEIGHT * 0.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {'350'}
                  </Text>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(1.2),
                      color: '#a5a6a9',
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 0.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {'/' + '1500'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(0.5),
                    color: '#a5a6a9',
                    fontFamily: constant.SUIFONT,
                  }}>
                  RANK
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', marginLeft: constant.HEIGHT * 3}}>
              <Image
                resizeMode={'contain'}
                style={{
                  width: constant.HEIGHT * 2.2,
                  height: constant.HEIGHT * 2.7,
                  tintColor: '#ececec',
                }}
                source={constant.ICONFIRE}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      color: '#ececec',
                      fontWeight: 'bold',
                      marginLeft: constant.HEIGHT * 0.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {'350'}
                  </Text>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(1.2),
                      color: '#a5a6a9',
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 0.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {' CALS'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(0.5),
                    color: '#a5a6a9',
                    fontFamily: constant.SUIFONT,
                  }}>
                  CALORIE BURN
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', marginLeft: constant.HEIGHT * 3}}>
              <Image
                resizeMode={'contain'}
                style={{
                  width: constant.HEIGHT * 2.5,
                  height: constant.HEIGHT * 3,
                  tintColor: '#ececec',
                }}
                source={constant.ICONHEALTH}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      color: '#ececec',
                      fontWeight: 'bold',
                      marginLeft: constant.HEIGHT * 0.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {'143'}
                  </Text>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(1.2),
                      color: '#a5a6a9',
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 0.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {' BPM'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(0.5),
                    color: '#a5a6a9',
                    fontFamily: constant.SUIFONT,
                  }}>
                  HEART RATE
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              top: constant.HEIGHT * 2,
              bottom: 0,
              right: constant.HEIGHT * 5,
            }}>
            <Image
              resizeMode={'contain'}
              style={{
                width: constant.HEIGHT * 3.5,
                height: constant.HEIGHT * 4,
                tintColor: '#ececec',
                padding: constant.HEIGHT * 1,
              }}
              source={constant.ICONCAST}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    marginTop: constant.HEIGHT * 2,
  },
  bottomContainer: {
    backgroundColor: 'black',
    opacity: 0.5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  topContainer: {
    position: 'absolute',
    top: constant.HEIGHT * 7,
    left: constant.HEIGHT * 5,
    right: constant.HEIGHT * 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  player: {
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
  },
});

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    live: state.liveReducer,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LiveVideoStream);
