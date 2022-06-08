import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import OneSignal from 'react-native-onesignal';
import FlashMessage from 'react-native-flash-message';

import Navigation from './screens/Navigation';
import {store, persistor} from 'services/store';

import api from './services/api';

import CustomNotifMessage from 'component/CustomNotifMessage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation store={store} />
          <FlashMessage
            position="top"
            MessageComponent={props => <CustomNotifMessage {...props} />}
            duration={5000}
          />
        </PersistGate>
      </Provider>
    );
  }
}
