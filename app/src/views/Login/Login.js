import React from 'react';
import {
  View,
  ImageBackground,
  Image,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {AsyncStorage} from 'react-native';
import {vw, vh} from 'react-native-expo-viewport-units';
import {SafeAreaView, useSafeArea} from 'react-native-safe-area-context';
import appleAuth, {
  AppleButton,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthError,
  AppleAuthRequestResponse,
} from '@invertase/react-native-apple-authentication';
import Animated from 'react-native-reanimated';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import {ENDPOINT} from 'react-native-dotenv';

import background from '../../assets/img/RegisterBackground.png';
import logo from '../../assets/img/Logo.png';
import google from '../../assets/img/google.png';
import facebook from '../../assets/img/facebook.png';
import apple from '../../assets/img/apple.png';
import styles from './Login.scss';
import SplashScreen from 'react-native-splash-screen';

import CustomInput from '../../assets/components/CustomInput/CustomInput.js';
import RoundedButton from '../../assets/components/RoundedButton/RoundedButton.js';
import RoundedButtonOutline from '../../assets/components/RoundedButtonOutline/RoundedButtonOutline.js';
import SocialButton from '../../assets/components/SocialButtons/SocialButtons.js';
import {userActions} from '../../../redux/actions';
import SafariView from 'react-native-safari-view';
import user from '../../../redux/reducers/userReducers';
import Snackbar from 'react-native-snackbar';

function Login({navigation, loggingIn, user, loggedIn, login, loginSocial}) {
  const [load, setLoad] = React.useState(true);
  const [loginform, setLoginform] = React.useState({
    username: '',
    password: '',
  });
  React.useEffect(() => {
    SplashScreen.hide();
    Linking.addEventListener('url', handleOpenURL);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleOpenURL({url});
      }
    });
  }, []);

  React.useEffect(() => {
    console.log(loggingIn, user, loggedIn);
    if (load && loggedIn && user) {
      AsyncStorage.setItem('user', JSON.stringify(user)).then(res => {
        navigation.navigate('Tabbed');
      });
    }
  });

  const handleOpenURL = ({url}) => {
    // Extract stringified user string out of the URL
    const match = url.match(/user=([^#]+)/);
    if (match) {
      const [, user_string] = match;
      console.log(JSON.parse(decodeURI(user_string)));
      loginSocial(JSON.parse(decodeURI(user_string)));
    } else {
      Snackbar.show({
        text: 'Error fetching user.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
  };
  const loginWithFacebook = () => openURL(ENDPOINT + '/user/auth/facebook/');

  const loginWithGoogle = () => openURL(ENDPOINT + '/user/auth/google/');

  const loginWithApple = () => {
    appleAuth
      .performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      })
      .then(appleResponse => {
        if (appleResponse.email) {
          const data = {
            ...appleResponse,
            familyName: appleResponse.fullName.familyName,
            givenName: appleResponse.fullName.givenName,
            fullName: undefined,
          };
          let str = Object.entries(data)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&');
          let url = ENDPOINT + '/user/auth/apple/?' + str;
          console.log(url);
          openURL(url);
        } else {
          Alert.alert('You need to share your email address.');
        }
      });
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

  const tryLogin = () => {
    const {username, password} = loginform;
    if (username === '' || password === '') {
      Snackbar.show({
        text: 'Username or Password cannot be blank',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    } else {
      login(loginform.username, loginform.password);
      setLoginform({username: '', password: ''});
      setLoad(true);
    }
  };

  const insets = useSafeArea();
  return (
    <>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={background}>
        <KeyboardAvoidingView
          behavior="position"
          style={{alignItems: 'space-around'}}>
          <Animatable.View animation="bounceIn" style={[styles.logoContainer]}>
            <Image
              source={logo}
              style={{width: vh(25), height: vh(25), marginTop: insets.top}}
            />
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={[styles.loginContainer, {width: vw(100)}]}>
            <Text style={styles.blueTitle}>Log In or Sign Up</Text>
            <View style={{width: '100%', alignItems: 'center'}}>
              <CustomInput
                placeholder="Username"
                style={styles.loginInput}
                value={loginform.username}
                onChangeText={e => setLoginform({...loginform, username: e})}
              />
              <CustomInput
                placeholder="Password"
                style={styles.loginInput}
                value={loginform.password}
                password={true}
                onChangeText={e => setLoginform({...loginform, password: e})}
              />
            </View>
            <View style={styles.loginButtons}>
              <RoundedButton
                style={styles.loginButton}
                title={loggingIn ? 'LOGGING IN...' : 'LOGIN'}
                color={'#FD6C59'}
                disabled={loggingIn}
                onPress={() => {
                  tryLogin();
                }}
              />
              <RoundedButtonOutline
                style={styles.loginButton}
                title={'CREATE ACCOUNT'}
                onPress={() => navigation.navigate('Register')}
              />
            </View>
            <Text style={styles.loginText}>or login via</Text>
            <View style={styles.icons}>
              <SocialButton
                image={facebook}
                onPress={() => loginWithFacebook()}
              />
              <SocialButton image={google} onPress={() => loginWithGoogle()} />
              {Platform.OS === 'ios' && (
                <SocialButton image={apple} onPress={() => loginWithApple()} />
              )}
            </View>
          </Animatable.View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

function mapState(state) {
  const {loggingIn, user, loggedIn} = state.user;
  return {loggingIn, user, loggedIn};
}

const actionCreators = {
  login: userActions.login,
  loginSocial: userActions.loginSocial,
};

/*
const mapStateToProps = (state) => {
    const { user } = state
    return { user }
  };

  const actionCreators = {
   loginRequest
};
*/

export default connect(
  mapState,
  actionCreators,
)(Login);
