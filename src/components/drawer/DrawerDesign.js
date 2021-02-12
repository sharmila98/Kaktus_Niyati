import 'react-native-gesture-handler';
import React, {Component} from 'react';

import {
  View,
  Text,
  Button,
  Easing,
  Animated,
  Linking,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {createDrawerNavigator} from '@react-navigation/drawer';



class DrawerDesign extends Component {
  static navigationOptions = {
    title: 'DrawerDesign',
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <DrawerContentScrollView {...this.props.props}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => props.navigation.navigate('Profile')}>
          {/* <Image
            source={Constants.FLAG}
            style={{width: Constants.HEIGHT * 3, height: Constants.HEIGHT * 3}}
          /> */}
          <Text>hii</Text>
        </TouchableOpacity>
        {/* <DrawerItemList {...props} />  */}
        {/* <DrawerItem
            label="Help"
            focused={true}
            onPress={() => Linking.openURL('https://mywebsite.com/help')}
          /> */}
      </DrawerContentScrollView>
    );
  }
}

export default DrawerDesign;
