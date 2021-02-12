import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import RootReducer from '../reducers/index';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  //   timeout: 5000,
};

let middleware = [];
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, thunkMiddleware, loggerMiddleware];
} else {
  middleware = [...middleware, thunkMiddleware];
}
const persistedReducer = persistReducer(persistConfig, RootReducer);
let store = createStore(persistedReducer, applyMiddleware(...middleware));
let persistor = persistStore(store);

export {store, persistor};
