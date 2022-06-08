import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import Input from 'component/Input';
import CustomButton from 'component/CustomButton';
import LoadingOverlay from 'component/LoadingOverlay';

import R from 'res/R';

export default function FPChangePassword({
  netInfo,
  navigation,
  route,
  error,
  fpResetPassword,
}) {
  const {fprData} = route.params;
  const [screenError, setScreenError] = useState(error);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  let confirmPasswordRef = useRef();

  useEffect(() => {
    if (navigation.isFocused() && error && error !== screenError) {
      setLoading(false);
      Alert.alert('Error', error.error.message);
      setScreenError(error);
    }
  }, [error]);

  const onPressSubmit = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    if (
      !newPassword ||
      newPassword === '' ||
      !confirmPassword ||
      confirmPassword === ''
    ) {
      Alert.alert(null, 'Please enter new password and confirm password.');
      return;
    } else if (newPassword.length < 8) {
      Alert.alert(null, 'Password length must be at least 8 characters.');
      return;
    } else if (newPassword !== confirmPassword) {
      Alert.alert(null, 'Passwords do not match.');
      return;
    }

    setLoading(true);
    fpResetPassword(
      fprData.email,
      fprData.code,
      newPassword,
      confirmPassword,
      () => {
        setLoading(false);
        Alert.alert(null, 'Password successfully changed.', [
          {text: 'Back to Login', onPress: () => navigation.navigate('Login')},
        ]);
      },
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Change Password" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Input
            containerStyle={{marginTop: 10}}
            label="Enter your new password:"
            placeholder="********"
            value={newPassword}
            onChangeText={t => setNewPassword(t)}
            autoCapitalize="none"
            secureTextEntry
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => confirmPasswordRef.focus()}
          />
          <Input
            ref={ref => (confirmPasswordRef = ref)}
            label="Confirm new password:"
            placeholder="********"
            value={confirmPassword}
            onChangeText={t => setConfirmPassword(t)}
            autoCapitalize="none"
            secureTextEntry
          />
          <CustomButton
            containerStyle={{marginTop: 30}}
            label="SUBMIT"
            onPress={onPressSubmit}
          />
        </View>
      </ScrollView>
      <LoadingOverlay isVisible={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: R.colors.white,
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
});
