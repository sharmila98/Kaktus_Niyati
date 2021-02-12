import 'react-native-gesture-handler';
// import * as React{useState} from 'react';
import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  Easing,
  Animated,
  Linking,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {createDrawerNavigator} from '@react-navigation/drawer';

import {store, persistor} from './../../storeConfig/storeconfig'; //Import the store

const {dispatch} = store;

import {signOut} from './../../action/Login_Action';

import History from './TopView/History';
import BookMark from './TopView/BookMark';
import Contacts from './TopView/Contacts';
import LeaderBoard from './TopView/LeaderBoard';

// import Contacts from './src/components/UserDetails/Contacts';
// import LeaderBoard from './src/components/UserDetails/LeaderBoard';
// import AvailCoupon from './src/components/Account/AvailCoupon';
// import ContactDetails from './src/components/Account/ContactDetails';
// import MyGoal from './src/components/UserGoal/MyGoal';
// import SetNewGoal from './src/components/UserGoal/SetNewGoal';
// import CurrentGoal from './src/components/UserGoal/CurrentGoal';

import Home from '../bottomTabs/Home/Home';
import Diet from '../bottomTabs/Diet/Diet';
import Live from '../bottomTabs/Live/Live';
import Profile from '../bottomTabs/Profile/Profile';
import Workout from '../bottomTabs/Workout/Workout';

import * as constant from '../../utils/constants';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import CustomPlan from './../bottomTabs/Workout/CustomPlan';
import ChangePlan from './../bottomTabs/Workout/ChangePlan';
import CustomProgramDetails from './../bottomTabs/Workout/CustomProgramDetails';
import CustomSingleDay from './../bottomTabs/Workout/CustomSingleDay';

import ProgramDetails from './../bottomTabs/Workout/ProgramDetails';
import WorkoutVideo from './../bottomTabs/Workout/WorkoutVideo';
import Participants from './../bottomTabs/Live/Participants';
import ClientProfile from './../bottomTabs/Profile/ClientProfile';
import BookNow from './../bottomTabs/Workout/BookNow';
import EquipmentList from './../bottomTabs/Workout/EquipmentList';
import WorkOutSDDetails from './../bottomTabs/Workout/WorkOutSDDetails';
import SingleLibraryDetail from './../bottomTabs/Workout/SingleLibraryDetail';
import CurrentGoal from './../drawer/YourGoal/CurrentGoal';
import ReferFriend from './../drawer/CommonClass/ReferFriend';
// import {stack} from 'd3';
import UpdateMeasurement from './YourGoal/UpdateMeasurement';
import UpdateMeasurementHeight from './YourGoal/UpdateMeasurementHeight';

import UpdateMeasurementWeight from './YourGoal/UpdateMeasurementWeight';

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
const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();
// const [modal, setmodal]= useState( false );

function navi(props, item) {
  props.navigation.toggleDrawer();
  item == 'Renew package'
    ? props.navigation.navigate('RenewPricing')
    : props.navigation.navigate(item);
}

function DrawerListItem(item, icon, props) {
  return (
    <TouchableOpacity
      onPress={() => {
        item == 'Splash'
          ? logOut(props)
          : item == 'UpdateMeasurement'
          ? UpdateMeasurementItem(item, icon)
          : navi(props, item);
      }}
      style={{
        flexDirection: 'row',
        paddingVertical: constant.HEIGHT * 1,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          item == 'Splash' ? logOut(props) : navi(props, item);
        }}>
        {icon != undefined ? (
          <Image
            resizeMode={'contain'}
            style={{
              marginLeft: constant.HEIGHT * 1,
              alignSelf: 'flex-end',
              width: constant.HEIGHT * 2,
              height: constant.HEIGHT * 2,
              tintColor: constant.GREY,
            }}
            source={icon}
          />
        ) : null}
        <Text
          numberOfLines={1}
          style={{
            paddingLeft: constant.HEIGHT * 1,
            flexShrink: 1,
            maxWidth: constant.HEIGHT * 30,
            color: constant.TEXTCOLOR,
            fontSize: constant.responsiveFontSize(1.6),
            fontFamily: constant.SUIFONT,
          }}>
          {item == 'Splash'
            ? 'Sign out'
            : item == 'MyBookings'
            ? 'My Bookings'
            : item == 'AvailCoupon'
            ? 'Avail Coupon'
            : item == 'MyGoal'
            ? 'My Goal'
            : item == 'CurrentGoal'
            ? 'Current Goal'
            : item == 'ContactDetails'
            ? 'Contact Details'
            : item == 'BookMark'
            ? 'Bookmark'
            : item == 'LeaderBoard'
            ? 'Leaderboard'
            : item}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function logOut(props) {
  var state = store.getState();
  dispatch(signOut(state.signupReducer.loginDetails.member_id, state.signupReducer.token));
  props.navigation.replace('Splash');
}

function UpdateMeasurementItem(item, icon) {
  return (
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
  );
}

function DrawerListHeader(item, icon) {
  return (
    <View
      style={{
        paddingHorizontal: constant.HEIGHT * 1,
        marginTop: constant.HEIGHT * 3,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => this.props.navigation.toggleDrawer()}>
        <Image
          style={{
            alignSelf: 'flex-end',
            resizeMode: 'contain',
            width: constant.HEIGHT * 2.5,
            // item == 'Device'
            // ? constant.HEIGHT * 2
            // : item == 'Notification'
            // ? constant.HEIGHT * 2
            // : constant.HEIGHT * 3,
            height: constant.HEIGHT * 2.5,
            // item == 'Notification'
            //   ? constant.HEIGHT * 2
            //   : constant.HEIGHT * 3,
            tintColor: constant.THEME,
          }}
          source={icon}
        />
        <Text
          numberOfLines={1}
          style={{
            paddingLeft: constant.HEIGHT * 1,
            flexShrink: 1,
            color: constant.THEME,
            fontWeight: 'bold',
            fontSize: constant.responsiveFontSize(1.8),
            maxWidth: constant.HEIGHT * 30,
            fontFamily: constant.SUIFONT,
          }}>
          {item}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: constant.BORDERDRAWER,
          flex: 1,
          height: constant.HEIGHT * 0.1,
          marginTop: constant.HEIGHT * 1,
        }}
      />
    </View>
  );
}

function CustomDrawerContent(props) {
  var state = store.getState();
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          marginHorizontal: constant.HEIGHT * 1,
          marginVertical: constant.HEIGHT * 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: constant.HEIGHT * 1,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => props.navigation.navigate('Profile')}>
            <Image
              resizeMode={'contain'}
              style={{
                alignSelf: 'flex-end',
                width: constant.HEIGHT * 4,
                height: constant.HEIGHT * 4,
                borderRadius: constant.HEIGHT * 5,
                borderBottomLeftRadius: constant.HEIGHT * 8,
                borderBottomRightRadius: constant.HEIGHT * 8,
                borderTopRightRadius: constant.HEIGHT * 8,
                borderTopLeftRadius: constant.HEIGHT * 8,
                tintColor: constant.GREY,
              }}
              source={constant.ICONPROFILEIMG}
            />
            <Text
              numberOfLines={1}
              style={{
                paddingLeft: constant.HEIGHT * 1,
                flexShrink: 1,
                fontWeight: 'bold',
                fontSize: constant.responsiveFontSize(2.0),
                color: constant.TEXTCOLOR,
                maxWidth: constant.HEIGHT * 30,
                fontFamily: constant.SUIFONT,
              }}>
              {state.signupReducer.loginDetails.name}
            </Text>
          </TouchableOpacity>
        </View>
        {/* {DrawerListItem('History', constant.ICONHISTORY, props)}
        {DrawerListItem('BookMark', constant.ICONBOOKMARK, props)}
        {DrawerListItem('Contacts', constant.ICONCONTACT, props)}
        {DrawerListItem('LeaderBoard', constant.ICONSTATS, props)}

        {DrawerListHeader('Accounts', constant.ICONACCOUNT)}
        {DrawerListItem('ContactDetails', undefined, props)}
        {DrawerListItem('Privacy', undefined, props)}
        {DrawerListItem('Renew package', undefined, props)}
        {DrawerListItem('MyBookings', undefined, props)}
        {DrawerListItem('AvailCoupon', undefined, props)}
        {DrawerListItem('Splash', undefined, props)}

        {DrawerListHeader('Your goal', constant.ICONTAPE)}
        {DrawerListItem('MyGoal', undefined, props)}
        {DrawerListItem('CurrentGoal', undefined, props)}
        {DrawerListItem('UpdateMeasurement', undefined, props)} */}

        {/* {DrawerListHeader('Device', constant.ICONWATCH)}
        {DrawerListItem('Set up a new device', undefined, props)}
        {DrawerListItem('Disconnect device', undefined, props)} */}

        {DrawerListHeader('Notification', constant.ICONNOTIFICATION)}
        {DrawerListItem('Notification', undefined, props)}
        {/* {DrawerListItem('Set notification tone', undefined, props)} */}
      </View>
    </DrawerContentScrollView>
  );
}

function WorkoutFunc() {
  return (
    <Stack.Navigator
      initialRouteName={'Workout'}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Workout" component={Workout} />
    </Stack.Navigator>
  );
}

function LiveFunc() {
  return (
    <Stack.Navigator
      initialRouteName={'Live'}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Live" component={Live} />
     
    </Stack.Navigator>
  );
}

function HomeFunc() {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Home" component={Home} />
     
    </Stack.Navigator>
  );
}

function ProfileFunc() {
  return (
    <Stack.Navigator
      initialRouteName={'Profile'}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Profile" component={Profile} />
     
    </Stack.Navigator>
  );
}

export function HomeView() {
  return CommonView(HomeFunc, 'PricingDetails');
}

export function WorkoutView() {
  return CommonView(WorkoutFunc, 'Workout');
}

export function LiveView() {
  return CommonView(LiveFunc, 'Live');
}

export function DietView() {
  return CommonView(Diet, 'Diet');
}

export function ProfileView() {
  return CommonView(ProfileFunc, 'Diet');
}

function CommonView(screen, name) {
  return (
    <Drawer.Navigator
      initialRouteName={name}
      keyboardDismissMode={'on-drag'}
      drawerPosition={'left'}
      // openByDefault={true}
      statusBarAnimation={true}
      drawerContent={(props) => CustomDrawerContent(props)}
      hideStatusBar={false}>
      <Drawer.Screen name={name} component={screen} />
    </Drawer.Navigator>
  );
}
