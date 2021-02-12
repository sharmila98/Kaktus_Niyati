import React, {Component} from 'react';
import {View, Image, Modal} from 'react-native';

import * as constant from './constants';
import * as Progress from 'react-native-progress';

export default class Loader extends Component {
  render() {
    const {visiblity} = this.props;
    return (
      <Modal
        style={{height: constant.HEIGHT * 100}}
        visible={visiblity == undefined ? false : visiblity}
        transparent={true}>
        <View
          style={{
            height: constant.HEIGHT * 7,
            backgroundColor: 'rgba(0,0,0,0.20)',
          }}
        />

        <View
          style={{
            height: constant.HEIGHT * 100,
            backgroundColor: 'rgba(0,0,0,0.20)',
            justifyContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: constant.HEIGHT * 5,
              width: constant.HEIGHT * 8,
              height: constant.HEIGHT * 8,
              marginBottom: constant.HEIGHT * 8,
              backgroundColor: constant.WHITE,
            }}>
            {/* <Image
              style={{
                resizeMode: 'contain',
                width: constant.HEIGHT * 13,
                height: constant.HEIGHT * 7,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              source={constant.LIVEDAYSUCCESS}
            /> */}
            <Progress.CircleSnail
              style={{
                alignItems: 'center',
                justifyContent: 'center',
               
              }}
              // progress={this.state.progress}
              indeterminate={true}
              direction="clockwise"
              color={'#FF67A4'}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
