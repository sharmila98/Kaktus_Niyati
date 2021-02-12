import React, {Component} from 'react';
import {View, Platform,TouchableOpacity,Text} from 'react-native';

import * as constant from '../../../utils/constants';

class UpdateMeasurement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: true,
    };
  }

  componentDidCatch() {
    this.setState({modal: true});
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.modal == true ? (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 0,
              elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 10,
              justifyContent: 'center',
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
                justifyContent: 'center',
                backgroundColor: constant.WHITE,
                borderColor: 'grey',
                borderWidth: constant.HEIGHT * 0.1,
                alignSelf: 'center',
                width: '75%',
                height: constant.HEIGHT * 30,
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('UpdateMeasurementWeight')
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: constant.HEIGHT * 1,
                  backgroundColor: 'white',
                  padding: constant.HEIGHT * 1.3,
                  borderRadius: constant.HEIGHT * 3,
                  borderWidth: constant.HEIGHT * 0.2,
                  borderColor: constant.THEME,
                  marginHorizontal: constant.HEIGHT * 5.5,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2),
                    fontWeight: '600',
                    fontFamily: constant.SUIFONT,
                    color: constant.THEME,
                  }}>
                  UPDATE FOR WEIGHT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('UpdateMeasurementHeight')
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: constant.HEIGHT * 1,
                  backgroundColor: 'white',
                  padding: constant.HEIGHT * 1.3,
                  borderRadius: constant.HEIGHT * 3,
                  borderWidth: constant.HEIGHT * 0.2,
                  borderColor: constant.THEME,
                  marginHorizontal: constant.HEIGHT * 5.5,
                  marginTop: constant.HEIGHT * 3.5,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2),
                    fontWeight: '600',
                    fontFamily: constant.SUIFONT,
                    color: constant.THEME,
                  }}>
                  UPDATE FOR HEIGHT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

export default UpdateMeasurement;
