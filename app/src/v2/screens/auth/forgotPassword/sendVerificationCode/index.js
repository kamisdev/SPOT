import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import Input from 'component/Input';
import CustomButton from 'component/CustomButton';
import LoadingOverlay from 'component/LoadingOverlay';

import R from 'res/R';

export default function SendVerificationCode({
  netInfo,
  navigation,
  error,
  fpSendVerification,
}) {
  const [screenError, setScreenError] = useState(error);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigation.isFocused() && error && error !== screenError) {
      setLoading(false);
      Alert.alert('Error', error.error.message);
      setScreenError(error);
    }
  }, [error]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onPressSubmit = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    if (!email || email === '') {
      Alert.alert(null, 'Please enter your email.');
      return;
    }

    setLoading(true);
    fpSendVerification(email, () => {
      setLoading(false);
      navigation.navigate('FPVerifyCode', {email});
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Reset Password Request" onBackPress={onBackPress} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Input
            label="Enter your email:"
            placeholder="email@example.com"
            value={email}
            onChangeText={t => setEmail(t)}
            keyboardType="email-address"
            autoCapitalize="none"
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
