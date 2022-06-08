import React from 'react';
import { Provider } from 'react-redux';

import Navigation from './Navigation.js';
import store from './redux/store.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OneSignal from 'react-native-onesignal'; 
import {messageActions} from './redux/actions';

function myiOSPromptCallback(permission){
  console.log(permission)
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    OneSignal.setLogLevel(6, 0);
  
  OneSignal.init("673bdd9c-37f6-40f6-816d-837423bc6a74", {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
  OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
  
  // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
  OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);
  OneSignal.requestPermissions({
    alert: true,
    badge: true,
    sound: true
  });

   OneSignal.addEventListener('opened', this.onOpened);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    
  }


  render(){
    return (
      <SafeAreaProvider>
        <Provider store={ store }>
          <Navigation/>
        </Provider>
      </SafeAreaProvider>
    );
  };
}
  

