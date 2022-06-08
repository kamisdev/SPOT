import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import {human} from 'react-native-typography';
import moment from 'moment';
import {launchImageLibrary} from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';

import ScreenContainer from 'component/ScreenContainer';
import VectorIcon from 'component/VectorIcon';
import Input from 'component/Input';
import CustomRadioButton from 'component/CustomRadioButton';
import CustomButton from 'component/CustomButton';
import UserAvatar from 'component/UserAvatar';
import CustomDatePicker from 'component/CustomDatePicker';
import LoadingOverlay from 'component/LoadingOverlay';

import UploadBtn from './component/UploadBtn';
import AddressLookUpModal from './component/AddressLookUpModal';

import R from 'res/R';

export default function Register({netInfo, navigation, error, register}) {
  const [registerError, setRegisterError] = useState(error);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showAddressLookUp, setShowAddressLookUp] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [picture, setPicture] = useState();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [gender, setGender] = useState();
  const [birthdate, setBirthdate] = useState();
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [addressComponents, setAddressComponents] = useState();

  let usernameRef = useRef();
  let passwordRef = useRef();
  let confirmPasswordRef = useRef();
  let firstnameRef = useRef();
  let lastnameRef = useRef();
  let birthdateRef = useRef();
  let addressRef = useRef();

  useEffect(() => {
    if (error && error !== registerError && navigation.isFocused()) {
      console.log('huehue');
      setRegisterError(error);
      setSubmitLoading(false);
      showError(error.error.message);
    }
  }, [error]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const showError = message => {
    // Snackbar.show({
    //   text: message,
    //   duration: Snackbar.LENGTH_INDEFINITE,
    //   backgroundColor: R.colors.redRibbon,
    // });
    Alert.alert('Error!', message);
  };

  const onPressTerms = () => {
    setAgreeToTerms(!agreeToTerms);
  };
  const onPressTOSLink = () => {
    navigation.navigate('WebView', {
      url: 'https://single-pet-owners.com/terms-and-conditions.html',
    });
  };

  const onPressUploadPhoto = () => {
    launchImageLibrary(R.values.imagePickerPhotoOptions, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setPicture(response);
      }
    });
  };

  const onPressDatePickerDone = () => {
    if (!birthdate || birthdate === '') {
      setBirthdate(new Date());
    }
    setShowDatePicker(false);
  };

  const onPressSelecLocation = loc => {
    setAddress(loc.address);
    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);
    setAddressComponents(loc.components);
    setShowAddressLookUp(false);
  };

  const onPressRegister = async () => {
    if (submitLoading) {
      return;
    }

    if (
      email === '' ||
      username === '' ||
      password === '' ||
      confirmPassword === '' ||
      firstname === '' ||
      lastname === '' ||
      address === '' ||
      !gender ||
      gender === ''
    ) {
      showError('Please fill in all the required fields (*).');
      return;
    } else if (username.length < 4) {
      showError('Username must be at least 4 characters.');
      return;
    } else if (!latitude || !longitude) {
      showError('Please enter your address.');
      return;
    } else if (!agreeToTerms) {
      showError('Please agree to Terms and Conditions.');
      return;
    }

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const body = {
      email,
      username,
      password,
      confirmPassword,
      firstName: firstname,
      lastName: lastname,
      address,
      latitude,
      longitude,
      addressComponents,
    };

    if (!addressComponents) {
      Alert.alert(null, 'Please select a valid address.');
      return;
    }

    if (gender) {
      body.gender = gender;
    }
    if (birthdate) {
      body.birthDate = birthdate;
    }
    if (contact) {
      body.contact = contact;
    }
    if (address) {
      body.address = address;
    }

    if (picture && picture.fileName) {
      setSubmitLoading(true);
      const path = `profile`;
      const imgUpload = await R.firebase.uploadImage(path, picture);
      body.image = {image: imgUpload.url, key: imgUpload.imgKey};
    }

    setSubmitLoading(true);
    register(body);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>REGISTER</Text>
      <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
        <VectorIcon
          font="AntDesign"
          name="arrowleft"
          size={28}
          color={R.colors.white}
        />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign Up</Text>
          <Text style={styles.infoText}>
            Fill in all the required fields(*)
          </Text>

          {picture && (
            <View style={styles.avatarContainer}>
              <UserAvatar
                img={picture}
                containerStyle={styles.avatar}
                size={110}
              />
            </View>
          )}
          <UploadBtn onPress={onPressUploadPhoto} />
          <Input
            label="Email Address *"
            placeholder="your-email@example.com"
            value={email}
            onChangeText={t => setEmail(t)}
            blurOnSubmit={false}
            returnKeyType="next"
            keyboardType="email-address"
            autoCapitalize="none"
            onSubmitEditing={() => usernameRef.focus()}
          />
          <Input
            label="Username *"
            ref={ref => (usernameRef = ref)}
            placeholder="user123"
            value={username}
            onChangeText={t => setUsername(t)}
            blurOnSubmit={false}
            returnKeyType="next"
            autoCapitalize="none"
            onSubmitEditing={() => passwordRef.focus()}
          />
          <Input
            label="Password *"
            ref={ref => (passwordRef = ref)}
            placeholder="********"
            value={password}
            onChangeText={t => setPassword(t)}
            blurOnSubmit={false}
            returnKeyType="next"
            autoCapitalize="none"
            secureTextEntry
            onSubmitEditing={() => confirmPasswordRef.focus()}
          />
          <Input
            label="Confirm Password *"
            ref={ref => (confirmPasswordRef = ref)}
            placeholder="********"
            value={confirmPassword}
            onChangeText={t => setConfirmPassword(t)}
            blurOnSubmit={false}
            returnKeyType="next"
            autoCapitalize="none"
            secureTextEntry
            onSubmitEditing={() => firstnameRef.focus()}
          />
          <Input
            label="First Name *"
            ref={ref => (firstnameRef = ref)}
            placeholder="John"
            value={firstname}
            onChangeText={t => setFirstname(t)}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => lastnameRef.focus()}
          />
          <Input
            label="Last Name *"
            ref={ref => (lastnameRef = ref)}
            placeholder="Doe"
            value={lastname}
            onChangeText={t => setLastname(t)}
            returnKeyType="next"
          />
          <Input
            label="Date of Birth *"
            ref={ref => (birthdateRef = ref)}
            placeholder={moment().format('MMMM DD, YYYY')}
            showSoftInputOnFocus={false}
            onFocus={() => {
              setShowDatePicker(true);
              birthdateRef.blur();
            }}
            value={birthdate ? moment(birthdate).format('MMMM DD, YYYY') : ''}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Gender *</Text>
            <CustomRadioButton
              formHorizontal
              radioProps={[
                {label: 'Female', value: 'female'},
                {label: 'Male', value: 'male'},
              ]}
              width={'50%'}
              initial={0}
              onPress={e => {
                setGender(e.value);
              }}
              color={R.colors.pictonBlue}
              value={gender}
            />
          </View>

          <Input
            label="Contact Number"
            placeholder="123456789"
            value={contact}
            onChangeText={t => setContact(t)}
            keyboardType="number-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => addressRef.focus()}
          />
          <Input
            label="Address *"
            ref={ref => (addressRef = ref)}
            style={{minHeight: 50, maxHeight: 200, textAlignVertical: 'top'}}
            placeholder="Type your address here"
            multiline
            showSoftInputOnFocus={false}
            value={address}
            onChangeText={t => setAddress(t)}
            onFocus={() => {
              if (netInfo.isInternetReachable) {
                setShowAddressLookUp(true);
              } else {
                Alert.alert(
                  'No network connection',
                  'Please check your internet connection and try again.',
                );
              }
              addressRef.blur();
            }}
          />
          <TouchableWithoutFeedback style={{flex: 1}} onPress={onPressTerms}>
            <View style={styles.termsContainer}>
              <View
                style={[
                  styles.radioBtn,
                  {
                    backgroundColor: agreeToTerms
                      ? R.colors.bittersweet
                      : R.colors.white,
                  },
                ]}>
                {agreeToTerms && (
                  <VectorIcon
                    font="Feather"
                    name="check"
                    size={16}
                    color={R.colors.white}
                  />
                )}
              </View>
              <View style={{marginLeft: 7, flexDirection: 'row'}}>
                <Text style={styles.termsText}>I agree to the </Text>
                <TouchableOpacity onPress={onPressTOSLink}>
                  <Text style={styles.termsLink}>Terms and Conditions</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <CustomButton
            containerStyle={styles.nextBtn}
            label={submitLoading ? 'LOADING...' : 'SUBMIT'}
            onPress={onPressRegister}
            disabled={submitLoading}
          />
        </View>
      </ScrollView>
      <CustomDatePicker
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        date={birthdate ? birthdate : new Date()}
        onDateChange={d => setBirthdate(d)}
        mode="date"
        maximumDate={new Date()}
        onPressDone={onPressDatePickerDone}
      />
      <AddressLookUpModal
        isVisible={showAddressLookUp}
        onClose={() => setShowAddressLookUp(false)}
        onPressDone={onPressSelecLocation}
      />
      <LoadingOverlay isVisible={submitLoading} text="Please wait..." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 20,
  },
  title: {
    ...human.title3White,
    fontFamily: R.fonts.WorkSansSemiBold,
    textAlign: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  formTitle: {
    ...human.title2,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.pictonBlue,
    textAlign: 'center',
    marginTop: 15,
  },
  formContainer: {
    backgroundColor: R.colors.white,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    elevation: 3,
    padding: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  backIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginTop: 10,
  },
  inputTitle: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansSemiBold,
    marginTop: 10,
    marginBottom: 10,
  },
  infoText: {
    ...human.footnote,
    fontFamily: R.fonts.WorkSansRegular,
    textAlign: 'center',
    color: R.colors.doveGray,
    marginTop: 5,
  },
  nextBtn: {
    marginTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  avatar: {
    elevation: 2,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  radioBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: R.colors.bittersweet,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
  },
  termsLink: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
});
