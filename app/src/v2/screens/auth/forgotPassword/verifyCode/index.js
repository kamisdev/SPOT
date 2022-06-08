import React, {useState, useEffect} from 'react';
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
import LoadingOverlay from 'component/LoadingOverlay';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function VerifyCode({
  netInfo,
  navigation,
  route,
  error,
  fpVerifyCode,
  fpSendVerification,
}) {
  const {email} = route.params;
  const [screenError, setScreenError] = useState(error);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

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

    if (!code || code === '') {
      Alert.alert(null, 'Please enter the verification code.');
      return;
    }

    setLoadingText('Loading...');
    setLoading(true);
    fpVerifyCode(email, code, fpr => {
      setLoading(false);
      navigation.navigate('FPChangePassword', {fprData: fpr});
    });
  };

  const onPressResendCode = () => {
    setLoadingText('Sending verification code...');
    setLoading(true);
    fpSendVerification(email, () => {
      setLoading(false);
      Alert.alert(null, 'Verification code sent!');
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Verify Code" onBackPress={onBackPress} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Input
            containerStyle={{marginTop: 10}}
            label="Enter verification code we've sent to your email:"
            placeholder="123455"
            value={code}
            onChangeText={t => setCode(t)}
            autoCapitalize="none"
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.resendBtn}
            onPress={onPressResendCode}>
            <Text style={styles.resendBtnText}>Resend code</Text>
          </TouchableOpacity>
          <CustomButton
            containerStyle={{marginTop: 30}}
            label="SUBMIT"
            onPress={onPressSubmit}
          />
        </View>
      </ScrollView>
      <LoadingOverlay isVisible={loading} text={loadingText} />
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
  resendBtn: {
    marginTop: 15,
    borderBottomWidth: 1,
    borderColor: R.colors.doveGray,
    alignSelf: 'flex-start',
    paddingHorizontal: 2,
  },
  resendBtnText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.doveGray,
  },
});
