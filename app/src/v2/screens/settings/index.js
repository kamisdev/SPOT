import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {human} from 'react-native-typography';
import OneSignal from 'react-native-onesignal';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import VectorIcon from 'component/VectorIcon';

import SettingsButton from './component/SettingsButton';

import R from 'res/R';

export default function Settings({navigation, me, logout}) {
  const onBackPress = () => {
    navigation.goBack();
  };

  const onPressChangePassword = () => {
    navigation.navigate('ChangePassword');
  };
  const onPressTOS = () => {
    navigation.navigate('WebView', {
      url: 'https://single-pet-owners.com/terms-and-conditions.html',
    });
  };
  const onPressPrivacyPolicy = () => {
    navigation.navigate('WebView', {
      url: 'https://single-pet-owners.com/privacy-policy.html',
    });
  };

  const handleOnLogout = () => {
    logout();
    OneSignal.disablePush(true);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Settings" onBackPress={onBackPress} />
      <ScrollView>
        {!me.googleId && !me.facebookId && (
          <SettingsButton
            label="Change Password"
            icon={{
              font: 'MaterialCommunity',
              name: 'lock',
              size: 28,
              color: R.colors.fontMain,
            }}
            onPress={onPressChangePassword}
          />
        )}
        <SettingsButton
          label="Terms and Conditions"
          icon={{
            font: 'MaterialCommunity',
            name: 'clipboard-text',
            size: 28,
            color: R.colors.fontMain,
          }}
          onPress={onPressTOS}
        />
        <SettingsButton
          label="Privacy Policy"
          icon={{
            font: 'MaterialCommunity',
            name: 'shield-lock',
            size: 28,
            color: R.colors.fontMain,
          }}
          onPress={onPressPrivacyPolicy}
        />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleOnLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: R.colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  logoutBtnText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
    flex: 1,
    textAlign: 'center',
    color: R.colors.redRibbon,
  },
});
