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
  StatusBar,
  Slider,
  FlatList,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Dropdown from '../../../components/DropDown/Dropdown';
import * as constant from '../../../utils/constants';

// import Slider from '@react-native-community/slider';

const rating = [
  {id: 0, label: 'Daily', value: 'Daily'},
  {id: 1, label: 'Weekly', value: 'Weekly'},
  {id: 2, label: 'Monthly', value: 'Monthly'},
  {id: 3, label: 'Quartely', value: 'Quartely'},
  {id: 4, label: 'Half-yearly', value: 'Half-yearly'},
  {id: 5, label: 'Yearly', value: 'Yearly'},
  {id: 6, label: 'One time', value: 'One time '},
];

class SetNewGoal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constant: [
        {name: 'Shobana', area: 'ANNA NAGAR', rank: 120},
        {name: 'Sheeba', area: 'SALIGRAMAM', rank: 1152},
      ],
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
  }

  switchImage() {
    if (this.state.currentImage < this.state.images.length - 1) {
      this.setState({
        currentImage: this.state.currentImage + 1,
      });
    } else {
      this.setState({
        currentImage: 0,
      });
    }
    return this.currentImage;
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View
            style={{
              backgroundColor: constant.WHITE,
              flex: 1,
              marginTop: constant.HEIGHT * 3,
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: constant.HEIGHT * 1,
                marginRight: constant.HEIGHT * 2.5,
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
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  flex: 1,
                  marginLeft: constant.HEIGHT * 2.5,
                  fontFamily: constant.SUIFONT,
                  fontSize: constant.responsiveFontSize(2.5),
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginTop: constant.HEIGHT * 1.5,
                  borderBottomWidth: constant.HEIGHT * 0.1,
                  borderColor: '#707070',
                }}>
                Set a new Goal
              </Text>
            </View>
            <View
              style={{
                marginTop: constant.HEIGHT * 1.5,
                marginLeft: constant.HEIGHT * 5,
                marginRight: constant.HEIGHT * 2.5,
                borderRadius: constant.HEIGHT * 1,
              }}>
              <Dropdown
                style={{}}
                placeholder="Select Type"
                data={rating}></Dropdown>
              <Dropdown
                style={{}}
                placeholder="Select Type"
                data={rating}></Dropdown>
              <Dropdown
                style={{}}
                placeholder="Select Type"
                data={rating}></Dropdown>
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                backgroundColor: constant.APPTHEME,
                borderRadius: constant.HEIGHT * 1.5,
                marginTop: constant.HEIGHT * 5,
                paddingHorizontal: constant.HEIGHT * 2,
              }}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.8),
                  paddingHorizontal: constant.HEIGHT * 2,
                  paddingVertical: constant.HEIGHT * 1,
                  color: constant.WHITE,
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  showEmptyListView = () => {
    return <View />;
  };
}

export default SetNewGoal;
