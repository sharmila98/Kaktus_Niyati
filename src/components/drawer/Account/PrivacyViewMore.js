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
} from 'react-native';
import * as Progress from 'react-native-progress';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';

import * as constant from '../../../utils/constants';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {RFC_2822} from 'moment';

class PrivacyViewMore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constant: [
        {name: 'Shobana', area: 'ANNA NAGAR', rank: 120},
        {name: 'Sheeba', area: 'SALIGRAMAM', rank: 1152},
      ],
      isPublic: false,
      isSocial: false,
      isPrivate: false,
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
  }

  getTitle(name) {
    return (
      <Text
        style={{
          fontSize: constant.responsiveFontSize(2),
          fontWeight: 'bold',
          fontFamily: constant.SUIFONT,
        }}>
        {name}
      </Text>
    );
  }
  getSubtitle(name, isTop) {
    return (
      <Text
        style={{
          fontSize: constant.responsiveFontSize(1.8),
          fontFamily: constant.SUIFONT,
          marginTop: isTop == true ? constant.HEIGHT * 1.5 : 0.5,
          marginLeft: constant.HEIGHT * 1,
        }}>
        {name}
      </Text>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <ScrollView>
              <View style={{flex: 0}}>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignSelf: 'flex-end',
                      marginRight: constant.HEIGHT * 2,
                    }}>
                    <Image
                      source={constant.ICONCLOSE}
                      style={{
                        marginHorizontal: constant.HEIGHT * 1,
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        alignSelf: 'center',
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginHorizontal: constant.HEIGHT * 3,
                    marginTop: constant.HEIGHT * 1.5,
                    borderColor: '#c8cfd5',
                    borderBottomWidth: constant.HEIGHT * 0.1,
                    paddingBottom: constant.HEIGHT * 4,
                  }}>
                  {this.getTitle('A full profile includes things like:')}
                  {this.getSubtitle('- Full Name', true)}
                  {this.getSubtitle('- Photos', false)}
                  {this.getSubtitle('- Hometown', false)}
                  {this.getSubtitle('- Bio', false)}
                  {this.getSubtitle(
                    '- Training minutes, rank, Calories, number of workouts.',
                    false,
                  )}
                  {this.getSubtitle(
                    '- The content your shared and your posts shared to the feed.',
                    false,
                  )}
                  {this.getSubtitle(
                    '- Public feed content you have liked',
                    false,
                  )}
                  {this.getSubtitle('- The interests you follow.', false)}
                  {this.getSubtitle(
                    '- Your achivements and challenges.',
                    false,
                  )}
                </View>
                <View
                  style={{
                    marginHorizontal: constant.HEIGHT * 3,
                    marginTop: constant.HEIGHT * 1.5,
                    borderColor: '#c8cfd5',
                    borderBottomWidth: constant.HEIGHT * 0.1,
                    paddingBottom: constant.HEIGHT * 4,
                  }}>
                  {this.getTitle('A Limited profile includes things like:')}
                  {this.getSubtitle('- Full Name', true)}
                  {this.getSubtitle('- Photos', false)}
                  {this.getSubtitle('- Hometown', false)}
                  {this.getSubtitle('- Bio', false)}
                  {this.getSubtitle(
                    '-  Fitness & Diet activity like achievements goals',
                    false,
                  )}
                  {this.getSubtitle('-  The interests you follow.', false)}
                </View>
                <View
                  style={{
                    marginHorizontal: constant.HEIGHT * 3,
                    marginTop: constant.HEIGHT * 1.5,
                    borderColor: '#c8cfd5',
                    borderBottomWidth: constant.HEIGHT * 0.1,
                    paddingBottom: constant.HEIGHT * 4,
                  }}>
                  {this.getTitle('The Feed includes activity like:')}
                  {this.getSubtitle(
                    '-  shared activity like runs and training, sessions, including location if shared',
                    true,
                  )}
                  {this.getSubtitle(
                    '- Fitness & Diet activity like achievements goals',
                    false,
                  )}
                  {this.getSubtitle('- New friends', false)}
                  {this.getSubtitle('- 3rd party connections', false)}
                </View>
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
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyViewMore);
