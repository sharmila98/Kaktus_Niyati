import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import * as constant from '../../utils/constants';
import PropTypes from 'prop-types';

class BackButtonwithTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.props.backButton}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginRight: constant.HEIGHT * 2,
          }}>
          <Image
            source={this.props.icon}
            style={{
              marginHorizontal: constant.HEIGHT * 1,
              width: constant.HEIGHT * 2,
              height: constant.HEIGHT * 2,
              alignSelf: 'center',
              tintColor: constant.THEME,
            }}
          />
          {this.props.notificationIcon == true ? (
            <Image
              style={{
                alignSelf: 'center',
                width: constant.HEIGHT * 2.5,
                height: constant.HEIGHT * 2.5,
              }}
              source={constant.ICONNOTIFICATION}
            />
          ) : null}
          <Text
            style={{
              fontFamily:
                Platform.OS === 'ios'
                  ? constant.REBOTOREGULAR
                  : constant.REBOTOREGULAR,
              fontSize: constant.responsiveFontSize(2),
              opacity: 0.6,
              flex: 1,
              fontWeight: 'bold',
              borderBottomWidth:
                this.props.underLine == true ? constant.HEIGHT * 0.1 : 0,
              borderColor: '#707070',
              fontFamily: constant.SUIFONT,
            }}>
            {this.props.title}
          </Text>
          {this.props.rightIconEnable == true ? (
            this.props.rightTextEnable == true ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: constant.HEIGHT * 0.5,
                }}
                onPress={this.props.onPressRightText}>
                <Image
                  source={constant.ICONHISTORY}
                  resizeMode={'contain'}
                  style={{
                    marginRight: constant.HEIGHT * 0.5,
                    width: constant.HEIGHT * 3,
                    height: constant.HEIGHT * 3,
                    alignSelf: 'center',
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
                  {this.props.rightText}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={this.props.onPressRightIcon}>
                <Image
                  source={this.props.rightIcon}
                  style={{
                    marginHorizontal: constant.HEIGHT * 1,
                    width: constant.HEIGHT * 3,
                    height: constant.HEIGHT * 3,
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
            )
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
}
BackButtonwithTitle.defaultProps = {
  title: '',
  rightText: '',
  notificationIcon: false,
  underLine: false,
  rightIconEnable: false,
  rightTextEnable: false,
};
BackButtonwithTitle.propTypes = {
  title: PropTypes.string.isRequired,
  rightText: PropTypes.string.isRequired,
  backButton: PropTypes.func.isRequired,
  icon: PropTypes.any.isRequired,
  // rightIcon: PropTypes.any.isRequired,
  notificationIcon: PropTypes.bool,
  underLine: PropTypes.bool,
  rightIconEnable: PropTypes.bool,
  rightTextEnable: PropTypes.bool,
  // onPressRightText: PropTypes.func.isRequired,
  // onPressRightIcon: PropTypes.func.isRequired,
};

export default BackButtonwithTitle;
