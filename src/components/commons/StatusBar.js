import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform, StatusBar} from 'react-native';

class StatusBars extends Component {
  static navigationOptions = {
    title: 'Status',
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={[styles.statusBar]}>
        <StatusBar
          translucent
          animated={true}
          barStyle={
            this.props.overRelay == false ? 'dark-content' : 'light-content'
          }
          hidden={this.props.hidden}
          networkActivityIndicatorVisible={true}
          showHideTransition={'fade'}
          backgroundColor={this.props.backgroundColor}       
        />
      </View>
    );
  }
}

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default StatusBars;
