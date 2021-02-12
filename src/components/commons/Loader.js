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
import * as Progress from 'react-native-progress';

import {Url, methods} from './../../NetworkConfig/ApiUrlConstatnts';

class Loader extends Component {
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

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          alignContent: 'center',
        }}>
        <Progress.CircleSnail
          color={[constant.THEME, constant.GREENCOLOR]}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            alignContent: 'center',
          }}
          size={50}
          indeterminate={true}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
