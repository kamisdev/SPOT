import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import Input from 'component/Input';
import CustomButton from 'component/CustomButton';
import VectorIcon from 'component/VectorIcon';
import LoadingOverlay from 'component/LoadingOverlay';

import R from 'res/R';

export default function ChangePassword({
  netInfo,
  navigation,
  error,
  changePassword,
}) {
  const [screenError, setScreenError] = useState(error);
  const [screenLoading, setScreenLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    if (navigation.isFocused() && error && error !== screenError) {
      Alert.alert('Error', error.error.message);
      setScreenError(error);
      setScreenLoading(false);
    }
  }, [error]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onToggleEye = () => {
    setHidePassword(!hidePassword);
  };

  const onPressUpdatePassword = () => {
    const body = {currentPassword, newPassword, confirmPassword};

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    setScreenLoading(true);
    changePassword(body, () => {
      setScreenLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert(null, 'Password successfully changed.');
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Change Password" onBackPress={onBackPress} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <TouchableOpacity style={styles.eyeIcon} onPress={onToggleEye}>
            <VectorIcon
              font="MaterialCommunity"
              name={hidePassword ? 'eye' : 'eye-off'}
              size={28}
              color={R.colors.fontMain}
            />
          </TouchableOpacity>
          <Input
            label="Current Password"
            placeholder="*********"
            value={currentPassword}
            onChangeText={t => setCurrentPassword(t)}
            secureTextEntry={hidePassword}
            blurOnSubmit={false}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => newPasswordRef.current.focus()}
          />
          <Input
            ref={newPasswordRef}
            label="New Password"
            placeholder="*********"
            value={newPassword}
            onChangeText={t => setNewPassword(t)}
            secureTextEntry={hidePassword}
            blurOnSubmit={false}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
          />
          <Input
            ref={confirmPasswordRef}
            label="Confirm New Password"
            placeholder="*********"
            value={confirmPassword}
            onChangeText={t => setConfirmPassword(t)}
            secureTextEntry={hidePassword}
            autoCapitalize="none"
          />
          <CustomButton
            containerStyle={styles.submitBtn}
            label={screenLoading ? 'UPDATING..' : 'UPDATE PASSWORD'}
            disabled={screenLoading}
            onPress={onPressUpdatePassword}
          />
        </View>
      </ScrollView>
      <LoadingOverlay isVisible={screenLoading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: R.colors.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 10,
  },
  submitBtn: {
    marginTop: 30,
  },
  eyeIcon: {
    alignItems: 'flex-end',
  },
});
