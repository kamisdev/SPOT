import {Platform} from 'react-native';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {createMigrate, persistStore, persistReducer} from 'redux-persist';
import {createLogger} from 'redux-logger';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import AsyncStorage from '@react-native-community/async-storage';
import createSagaMiddleware from 'redux-saga';

import sagas from './sagas';
import migrations, {version} from './migrations.js';

import handlerReducer from './handler/reducer';
import userReducer from './user/reducer';
import petReducer from './pet/reducer';
import locationReducer from './location/reducer';
import messageReducer from './message/reducer';

const combinedReducers = combineReducers({
  handler: handlerReducer,
  user: userReducer,
  pet: petReducer,
  location: locationReducer,
  message: messageReducer,
});

const persistConfig = {
  key: 'root',
  version,
  storage: Platform.select({
    ios: AsyncStorage,
    android: FilesystemStorage,
  }),
  migrate: createMigrate(migrations, {debug: false}),
  whitelist: ['user'],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, combinedReducers);
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({predicate: () => __DEV__});

const initialState = {};

function configureStore() {
  const isDebuggingEnabled = typeof atob !== 'undefined';
  let enhancer;
  if (__DEV__ && isDebuggingEnabled) {
    enhancer = compose(
      applyMiddleware(loggerMiddleware, sagaMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : noop => noop,
    );
  } else {
    enhancer = compose(applyMiddleware(sagaMiddleware));
  }
  return createStore(persistedReducer, initialState, enhancer);
}

export const store = configureStore();
export const persistor = persistStore(store);

Object.keys(sagas).forEach(function(key) {
  sagaMiddleware.run(sagas[key]);
});
