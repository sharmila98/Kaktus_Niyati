import React, {Component} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

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

import {
  HomeView,
  DietView,
  LiveView,
  ProfileView,
  WorkoutView,
} from './../drawer/DrawerView';
``;
import * as constant from './../../utils/constants';
const Tab = createMaterialBottomTabNavigator();
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
const Stack = createStackNavigator();

import ChangePlan from './Workout/ChangePlan';

const config = {
  animation: 'spring',
  duration: 1000,
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// function Workout() {
//   return (
//     <Stack.Navigator
//       initialRouteName={'Workout'}
//       screenOptions={{
//         headerShown: false,
//         cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
//         transitionSpec: {
//           open: config,
//           close: config,
//         },
//       }}>
//       <Stack.Screen name="Workout" component={WorkoutView} />
//       <Stack.Screen name="ChangePlan" component={ChangePlan} />
//     </Stack.Navigator>
//   );
// }

export function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      activeColor={constant.THEME}
      inactiveColor={constant.GREY}
      labeled={true}
      shifting={false}
      sceneAnimationEnabled={true}
      barStyle={{
        backgroundColor: '#fff',
        borderRadius: constant.HEIGHT * 3,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeView}
        options={{
          tabBarLabel: 'Home',
          // tabBarBadge: true,
          tabBarIcon: ({color}) => (
            <Image
              resizeMode={'center'}
              style={{
                width: constant.HEIGHT * 4,
                tintColor: color,
                height: constant.HEIGHT * 4,
              }}
              source={constant.ICONHOME}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutView}
        options={{
          // tabBarBadge: true,
          tabBarIcon: ({color}) => (
            <Image
              resizeMode={'center'}
              style={{
                width: constant.HEIGHT * 4,
                tintColor: color,
                height: constant.HEIGHT * 4,
              }}
              source={constant.ICONWORKOUT}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveView}
        options={{
          // tabBarLabel: 'Live',
          // tabBarBadge: true,
          tabBarIcon: ({color}) => (
            <Image
              resizeMode={'center'}
              style={{
                width: constant.HEIGHT * 4,
                tintColor: color,
                height: constant.HEIGHT * 4,
              }}
              source={constant.IconLive}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Diet"
        component={DietView}
        options={{
          // tabBarLabel: 'Diet',
          // tabBarBadge: true,
          tabBarIcon: ({color}) => (
            <Image
              resizeMode={'center'}
              style={{
                width: constant.HEIGHT * 4,
                tintColor: color,
                height: constant.HEIGHT * 4,
              }}
              source={constant.ICONDIET}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileView}
        options={{
          // tabBarLabel: 'Profile',
          // tabBarBadge: true,
          tabBarIcon: ({color}) => (
            <Image
              resizeMode={'center'}
              style={{
                width: constant.HEIGHT * 4,
                tintColor: color,
                height: constant.HEIGHT * 4,
              }}
              source={constant.IMGPROFILE}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
