import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {human} from 'react-native-typography';
import SplashScreen from 'react-native-splash-screen';
import SafariView from 'react-native-safari-view';

import ScreenContainer from 'component/ScreenContainer';
import Input from 'component/Input';
import CustomButton from 'component/CustomButton';
import VectorIcon from 'component/VectorIcon';
import LoadingOverlay from 'component/LoadingOverlay';

import SocialButton from './component/SocialButton';
import appleAuth, {
  appleAuthAndroid,
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {v4 as uuid} from 'uuid';
import R from 'res/R';

export default function Login({
  netInfo,
  navigation,
  error,
  getAuth,
  socialLogin,
}) {
  const [loginError, setLoginError] = useState(error);
  const [loginLoading, setLoginLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState('Loading...');

  useEffect(() => {
    SplashScreen.hide();
    Linking.addEventListener('url', handleOpenURL);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleOpenURL({url});
      }
    });

    return () => {
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, [handleOpenURL]);

  useEffect(() => {
    if (error && error !== loginError && navigation.isFocused()) {
      Alert.alert('Error', error.error.message);
      setLoginError(error);
      setLoginLoading(false);
    }
  }, [error, loginError, navigation]);

  let passwordRef = useRef();

  const handleOpenURL = ({url}) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    const decodedUser = JSON.parse(decodeURI(user_string));
    // console.log('fb', decodedUser);

    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }

    if (decodedUser.userType === 'newUser') {
      navigation.navigate('CompleteSocialLogin', {userData: decodedUser});
    } else {
      setShowLoadingOverlay(true);
      socialLogin(decodedUser);
    }
  };

  const openURL = url => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  const onPressLogin = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    setLoginLoading(true);
    getAuth(username, password);
  };

  const onPressRegister = () => {
    if (!loginLoading) {
      navigation.navigate('Register');
    }
  };

  const onPressGoogleLogin = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const googleLoginURL = 'https://api.single-pet-owners.com/auth/google';
    openURL(googleLoginURL);
  };

  const onPressFacebookLogin = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const facebookLoginURL = 'https://api.single-pet-owners.com/auth/facebook';
    openURL(facebookLoginURL);
  };

  const onAppleSigninPress = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    Platform.OS === 'ios' ? onPressAppleLoginIOS() : onPressAppleLoginAndroid();
  };

  const onPressAppleLoginAndroid = async () => {
    const rawNonce = uuid();
    const state = uuid();

    try {
      const callbackURL = `${url}/user/appleCallback`;
      appleAuthAndroid.configure({
        clientId: 'com.popzi.android',
        redirectUri: callbackURL,
        scope: appleAuthAndroid.Scope.ALL,
        responseType: appleAuthAndroid.ResponseType.ALL,
        nonce: rawNonce,
        state,
      });

      const response = await appleAuthAndroid.signIn();

      if (response) {
        processAppleUserResponse(response, Platform.OS);
      }
    } catch (e) {
      if (e && e.message) {
        switch (e.message) {
          case appleAuthAndroid.Error.NOT_CONFIGURED:
            console.log('appleAuthAndroid not configured yet.');
            break;
          case appleAuthAndroid.Error.SIGNIN_FAILED:
            console.log('Apple signin failed.');
            break;
          case appleAuthAndroid.Error.SIGNIN_CANCELLED:
            console.log('User cancelled Apple signin.');
            break;
          default:
            console.log('Apple login error: ', e.message);
            break;
        }
      }
    }
  };

  const onPressAppleLoginIOS = async () => {
    try {
      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const credentialState = await appleAuth.getCredentialStateForUser(
        response.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        processAppleUserResponse(response, Platform.OS);
      }
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('user cancelled apple signin');
      } else {
        console.log('apple signin error - ', error);
      }
    }
  };

  const processAppleUserResponse = async (response, platform) => {
    // first time Apple signin users will have these info available
    let socialId;
    let appleUser;
    if (platform === 'ios') {
      const {email, fullName, identityToken} = response;
      socialId = identityToken;
      if (email && fullName.givenName && fullName.familyName) {
        appleUser = {
          email: email,
          firstName: fullName.givenName,
          lastName: fullName.familyName,
        };
      }
    } else {
      const {user, id_token} = response;
      socialId = id_token;
      if (user) {
        appleUser = {
          email: user.email,
          firstName: user.name.firstName,
          lastName: user.name.lastName,
        };
      }
    }

    if (appleUser) {
      //Storage.APPLE_USER.set(appleUser);
    }

    let user = {idToken: socialId, provider: 'apple', platform};
    console.log('user - ', user);
    setShowLoadingOverlay(true);
    socialLogin(user, data => {
      if (data.newUser) {
        setShowLoadingOverlay(false);
        navigation.navigate('CompleteSocialLogin', {userData: data});
      }
    });
    // const savedUser = await Storage.APPLE_USER.get();
    // if (savedUser) {
    //   user = {...user, ...savedUser};
    // }

    //Keyboard.dismiss();
    // const isConnected = await checkInternetConnectivity();
    // if (isConnected) {
    // this.setState({isLoading: true, errorMessage: null});
    // this.props.dispatch({
    //   type: actionTypes.LOGIN_WITH_SOCIAL,
    //   user: user,
    // });
    // } else {
    //   this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    // }
  };

  const onPressShowPassword = () => {
    setHidePassword(!hidePassword);
  };

  const onPressForgotPassword = () => {
    navigation.navigate('FPSendVerificationCode');
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={R.images.loginLogo} />
          <Text style={styles.logoTitle}>SPOT</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login</Text>
          <Input
            containerStyle={{marginTop: 20}}
            placeholder="Username"
            value={username}
            onChangeText={t => setUsername(t)}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.focus()}
            returnKeyType="next"
          />
          <View>
            <Input
              containerStyle={{marginTop: 10}}
              ref={ref => (passwordRef = ref)}
              placeholder="Password"
              value={password}
              onChangeText={t => setPassword(t)}
              autoCapitalize="none"
              secureTextEntry={hidePassword}
              onSubmitEditing={!loginLoading ? onPressLogin : null}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={onPressShowPassword}>
              <VectorIcon
                font="MaterialCommunity"
                name={hidePassword ? 'eye' : 'eye-off'}
                size={28}
                color={R.colors.fontMain}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPassBtn}
            onPress={onPressForgotPassword}>
            <Text style={styles.forgotPassBtnText}>Forgot Password?</Text>
          </TouchableOpacity>
          <CustomButton
            containerStyle={{marginTop: 30}}
            label={loginLoading ? 'LOGGING IN...' : 'LOGIN'}
            onPress={onPressLogin}
            disabled={loginLoading}
          />
          <CustomButton
            containerStyle={{marginTop: 10}}
            label="CREATE ACCOUNT"
            style="border"
            onPress={onPressRegister}
          />
          <View style={styles.socialBtnContainer}>
            <Text style={styles.socialBtnTitle}>or login via</Text>
            <View style={styles.socialButtons}>
              <SocialButton
                img={R.images.icon.facebook}
                onPress={onPressFacebookLogin}
              />
              {/* <SocialButton img={R.images.icon.instagram} /> */}
              <SocialButton
                img={R.images.icon.google}
                onPress={onPressGoogleLogin}
              />
            </View>
            {Platform.OS === 'ios' ? (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <AppleButton
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={styles.appleButton}
                  onPress={onAppleSigninPress}
                />
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay isVisible={showLoadingOverlay} text={overlayText} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: R.values.x * 0.5,
    height: R.values.x * 0.5,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    backgroundColor: R.colors.white,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
    elevation: 1,
    marginTop: 20,
  },
  formTitle: {
    ...human.title2,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.pictonBlue,
    textAlign: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    marginTop: 15,
  },
  logoTitle: {
    ...human.title2White,
    fontFamily: R.fonts.WorkSansSemiBold,
    marginTop: -12,
  },
  socialBtnContainer: {
    marginTop: 30,
  },
  socialBtnTitle: {
    ...human.body,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.silverChalice,
    textAlign: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  eyeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  forgotPassBtn: {
    marginTop: 15,
    alignSelf: 'flex-end',
  },
  forgotPassBtnText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.bittersweet,
  },
  appleButton: {
    width: '70%',
    height: 50,
    shadowColor: '#555',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    marginVertical: 15,
  },
});
