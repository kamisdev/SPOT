import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NetInfo from '@react-native-community/netinfo';

import UserActions from 'services/user/actions';

import Login from './auth/login/container';
import Register from './auth/register/container';
import CompleteSocialLogin from './auth/completeSocialLogin/container';
import FPSendVerificationCode from './auth/forgotPassword/sendVerificationCode/container';
import FPVerifyCode from './auth/forgotPassword/verifyCode/container';
import FPChangePassword from './auth/forgotPassword/changePassword/container';

import Profile from './profile/container';
import EditProfile from './editProfile/container';

import MyPet from './myPet/container';
import AddPet from './addPet/container';
import PetProfile from './petProfile/container';
import EditPet from './editPet/container';

import FindOwners from './findOwners/container';
import OwnerProfile from './ownerProfile/container';

import Message from './message/container';
import ChatScreen from './chat/container';

import Settings from './settings/container';
import ChangePassword from './changePassword/container';

import AddressLookUp from 'component/AddressLookUp';
import WebView from './webView/container';

import BottomTabBar from 'component/BottomTabBar';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthScreens() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="AddressLookUp" component={AddressLookUp} />
      <Stack.Screen
        name="CompleteSocialLogin"
        component={CompleteSocialLogin}
      />
      <Stack.Screen
        name="FPSendVerificationCode"
        component={FPSendVerificationCode}
      />
      <Stack.Screen name="FPVerifyCode" component={FPVerifyCode} />
      <Stack.Screen name="FPChangePassword" component={FPChangePassword} />
      <Stack.Screen name="WebView" component={WebView} />
    </Stack.Navigator>
  );
}

function MainScreens() {
  return (
    <Stack.Navigator
      initialRouteName="TabNavigation"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
      <Stack.Screen name="SettingsNavigation" component={SettingsStack} />
      <Stack.Screen name="AddressLookUp" component={AddressLookUp} />
      <Stack.Screen name="WebView" component={WebView} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      initialRouteName="Profile">
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{title: 'Profile'}}
      />
      <Tab.Screen
        name="MyPet"
        component={PetStack}
        options={{title: 'My Pet'}}
      />
      <Tab.Screen
        name="FindOwners"
        component={FindOwnersStack}
        options={{title: 'Find Owners'}}
      />
      <Tab.Screen
        name="Message"
        component={MessageStack}
        options={{title: 'Message'}}
      />
    </Tab.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}

function PetStack() {
  return (
    <Stack.Navigator
      initialRouteName="MyPet"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="MyPet" component={MyPet} />
      <Stack.Screen name="AddPet" component={AddPet} />
      <Stack.Screen name="PetProfile" component={PetProfile} />
      <Stack.Screen name="EditPet" component={EditPet} />
    </Stack.Navigator>
  );
}

function FindOwnersStack() {
  return (
    <Stack.Navigator
      initialRouteName="FindOwners"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="FindOwners" component={FindOwners} />
      <Stack.Screen name="OwnerProfile" component={OwnerProfile} />
      <Stack.Screen name="PetProfile" component={PetProfile} />
    </Stack.Navigator>
  );
}

function MessageStack() {
  return (
    <Stack.Navigator
      initialRouteName="Message"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="Message" component={Message} />
    </Stack.Navigator>
  );
}

function isAuthorized(store) {
  const {user} = store.getState();
  return user.auth !== null && user.me !== null;
}

export default function Navigation({store}) {
  const [authorized, setAuthorized] = useState(isAuthorized(store));

  useEffect(() => {
    const unsubcribe = store.subscribe(() => {
      setAuthorized(isAuthorized(store));
    });
    const unsubscribeNetwork = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      store.dispatch({type: 'SET_NETINFO', netInfo: state});
    });

    return () => {
      unsubcribe();
      unsubscribeNetwork();
    };
  });

  return (
    <NavigationContainer>
      {!authorized ? <AuthScreens /> : <MainScreens />}
      {/* <AuthScreens /> */}
    </NavigationContainer>
  );
}
