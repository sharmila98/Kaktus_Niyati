import 'react-native-gesture-handler';
import * as React from 'react';
import {Component} from 'react';
import {Provider} from 'react-redux';
// import messaging from '@react-native-firebase/messaging';

import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import {PersistGate} from 'redux-persist/integration/react';
// import {StoreConfig, persistor} from './src/Reducers/StoreConfig/StoreConfig';

import {store, persistor} from './src/storeConfig/storeconfig';
import Splash from './src/components/loginSignup/Splash';
import SignIn from './src/components/loginSignup/SignIn';
import Login from './src/components/loginSignup/Login';
import OtpScreen from './src/components/loginSignup/OtpScreen';
import Success from './src/components/loginSignup/Success';

// import {BottomTabs} from './src/components/bottomTabs/BottomConfig';
const Stack = createStackNavigator();

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

function Container() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: config,
            close: config,
          },
        }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default class App extends Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Container />
        </PersistGate>
      </Provider>
    );
  }
}
