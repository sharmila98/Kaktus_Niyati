import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

import * as constant from '../../../utils/constants';

import Slider from '@react-native-community/slider';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import Header from '../../commons/Header';
import {onNotificationAction} from '../../../action/Header_Action';

import {onCategoriesAction, getUserDetails} from '../../../action/Login_Action';
import {onCategoriesActionUpdate} from '../../../action/UpdateMeasurement_action';

var head, url;

class UpdateMeasurementHeight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      height_cm: 0,
      height_inch: 0,
      SliderValue: 0,
      currentImage: 0,
      images: [constant.ICONSTART, constant.ICONDOWN, constant.ICONPUSH],
      inputs: {
        type: 'weight',
        member_id: 'string',
        height: 0,
        weight: 0,
      },
      edit: true,
    };
  }

  componentDidMount() {
    this.setState({edit: true});
    var inch =
      this.props.signIn.registration.height != undefined
        ? 0.3937008 * this.props.signIn.registration.height
        : 0.0;

    this.setState({
      height_cm:
        this.props.signIn.registration.height != undefined
          ? this.props.signIn.registration.height
          : 0,
      height_inch: inch.toFixed(2),
    });
  }
  updateHeight() {
    var inputs = {
      type: 'height',
      member_id: this.props.signIn.member_id,
      height: this.state.height_cm,
      weight: this.props.signIn.registration.weight,
    };

    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.updateMeasurement;

    // console.warn(inputs);
    this.props
      .onCategoriesActionUpdate(head, url, methods.post, inputs)
      .then((response) => {
        // console.warn(response);

        if (response.status == 200) {
          this.props.navigation.navigate('Home');
        }
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <Header navigation={this.props.navigation} onPress={false} />
          {/* <TouchableOpacity
                  onPress={(() => this.props.navigation.goBack())}
                  style={{
                    flexDirection: 'row',
                    margin: constant.HEIGHT * 1,
                    marginLeft: constant.HEIGHT * 2.5,
                  }}>
                  <Image
                    source={constant.ICONARROWORANGE}
                    style={{
                      width: constant.HEIGHT * 3,
                      height: constant.HEIGHT * 2.5,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 1.5,
                      marginHorizontal: constant.HEIGHT * 1,
                    }}
                  />
                 
                </TouchableOpacity> */}

          <View
            style={{
              margin: constant.HEIGHT * 1.5,
              backgroundColor: constant.WHITE,
              flex: 1,
              marginTop: constant.HEIGHT * 8,
            }}>
            {/* <TouchableOpacity onPress={() => this.props.navigate.goBack()}>
              <Image
                source={constant.ICONARROW}
                style={{
                  width: constant.HEIGHT * 2.5,
                  height: constant.HEIGHT * 2.5,
                  marginLeft: constant.HEIGHT * 1.5,
                  marginTop: constant.HEIGHT * 1.5,
                }}
              />
            </TouchableOpacity> */}

            <Text
              style={{
                fontSize: constant.responsiveFontSize(2),
                alignSelf: 'center',
                fontWeight: 'bold',
                marginTop: constant.HEIGHT * 1.5,
                fontFamily: constant.SUIFONT,
              }}>
              Your Current Height
            </Text>

            <View
              style={{
                flex: 0,
                alignSelf: 'center',
                marginTop: constant.HEIGHT * 6,
                // position: 'absolute',
              }}>
              <Image
                source={constant.ICONFEMALE}
                resizeMode="cover"
                style={{
                  alignSelf: 'center',
                  width:
                    this.state.height_cm <= 50
                      ? constant.HEIGHT * 12
                      : this.state.height_cm <= 90
                      ? constant.HEIGHT * 15
                      : this.state.height_cm <= 130
                      ? constant.HEIGHT * 16.5
                      : constant.HEIGHT * 18,
                  height:
                    this.state.height_cm <= 50
                      ? constant.HEIGHT * 28
                      : this.state.height_cm <= 90
                      ? constant.HEIGHT * 30
                      : this.state.height_cm <= 130
                      ? constant.HEIGHT * 34
                      : constant.HEIGHT * 38,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: constant.HEIGHT * 3,
                // marginTop:
                //   this.state.height_cm <= 50
                //     ? constant.HEIGHT * 20
                //     : this.state.height_cm <= 90
                //     ? constant.HEIGHT * 15
                //     : this.state.height_cm <= 130
                //     ? constant.HEIGHT * 10
                //     : constant.HEIGHT * 3,
              }}>
              {this.state.edit == true ? (
                <Image
                  source={constant.ICONMINUS}
                  style={{
                    width: constant.HEIGHT * 2.5,
                    height: constant.HEIGHT * 2.5,
                    padding: constant.HEIGHT * 1,
                    tintColor: constant.THEME,
                  }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    var changedValue = this.state.height_cm - 1;
                    if (changedValue > 0) {
                      var inch = 0.3937008 * changedValue;
                      this.setState({
                        height_cm: changedValue,
                        height_inch: inch.toFixed(2),
                      });

                      this.onSeekChange(changedValue);
                    }
                  }}>
                  <Image
                    source={constant.ICONMINUS}
                    style={{
                      width: constant.HEIGHT * 2.5,
                      height: constant.HEIGHT * 2.5,
                      padding: constant.HEIGHT * 1,
                      tintColor: constant.THEME,
                    }}
                  />
                </TouchableOpacity>
              )}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      alignSelf: 'center',
                      color: constant.THEME,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {this.state.height_cm + ' Cms'}
                  </Text>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      alignSelf: 'center',
                      fontWeight: 'bold',
                      color: '#000000',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {' / '}
                  </Text>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      alignSelf: 'center',
                      color: constant.THEME,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {this.state.height_inch + ' In'}
                  </Text>
                </View>
                {this.state.edit == true ? (
                  <Slider
                    step={1}
                    minimumValue={60}
                    maximumValue={200}
                    value={this.props.signIn.registration.height}
                    thumbTintColor="#e0e5e8"
                    minimumTrackTintColor="#FF67A4"
                    style={{
                      width: constant.HEIGHT * 25,
                      height: constant.HEIGHT * 6,
                      alignSelf: 'center',
                      borderRadius: 50,
                    }}
                  />
                ) : (
                  <Slider
                    step={1}
                    minimumValue={60}
                    maximumValue={200}
                    value={this.props.signIn.registration.height}
                    thumbTintColor="#e0e5e8"
                    minimumTrackTintColor="#FF67A4"
                    onValueChange={(ChangedValue) => {
                      var inch = 0.3937008 * ChangedValue;
                      this.setState({
                        height_cm: ChangedValue,
                        height_inch: inch.toFixed(2),
                      });
                      this.onSeekChange(ChangedValue);
                    }}
                    style={{
                      width: constant.HEIGHT * 25,
                      height: constant.HEIGHT * 6,
                      alignSelf: 'center',
                      borderRadius: 50,
                    }}
                  />
                )}
              </View>
              {this.state.edit == true ? (
                <Image
                  source={constant.ICONPLUS}
                  style={{
                    width: constant.HEIGHT * 2,
                    height: constant.HEIGHT * 2,
                    marginLeft: constant.HEIGHT * 1.5,
                    padding: constant.HEIGHT * 1,
                    tintColor: constant.THEME,
                  }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    var changedValue = this.state.height_cm + 1;
                    if (changedValue <= 200) {
                      var inch = 0.3937008 * changedValue;
                      this.setState({
                        height_cm: changedValue,
                        height_inch: inch.toFixed(2),
                      });
                      this.onSeekChange(changedValue);
                    }
                  }}>
                  <Image
                    source={constant.ICONPLUS}
                    style={{
                      width: constant.HEIGHT * 2,
                      height: constant.HEIGHT * 2,
                      marginLeft: constant.HEIGHT * 1.5,
                      padding: constant.HEIGHT * 1,
                      tintColor: constant.THEME,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
            {this.state.edit == true ? (
              <TouchableOpacity
                onPress={() => {
                  this.setState({edit: false});
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: constant.HEIGHT * 3,
                  backgroundColor: 'grey',
                  padding: constant.HEIGHT * 1,
                  borderRadius: constant.HEIGHT * 1,
                  borderWidth: constant.HEIGHT * 0,
                  borderColor: constant.THEME,
                  marginHorizontal: constant.HEIGHT * 20,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2),
                    fontWeight: '600',
                    fontFamily: constant.SUIFONT,
                    color: constant.WHITE,
                  }}>
                  EDIT
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.updateHeight();
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: constant.HEIGHT * 3,
                  backgroundColor: constant.THEME,
                  padding: constant.HEIGHT * 1,
                  borderRadius: constant.HEIGHT * 1,
                  borderWidth: constant.HEIGHT * 0.2,
                  borderColor: constant.THEME,
                  marginHorizontal: constant.HEIGHT * 20,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(2),
                    fontWeight: '600',
                    fontFamily: constant.SUIFONT,
                    color: constant.WHITE,
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
  onSeekChange(value) {
    this.setState({weight: value});
    var inputs = {
      ...this.props.signIn.registration,
      height: value,
    };
    this.props.getUserDetails(inputs);
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onCategoriesAction,
      getUserDetails,
      onCategoriesActionUpdate,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateMeasurementHeight);
