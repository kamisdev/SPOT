import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {human} from 'react-native-typography';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import {launchImageLibrary} from 'react-native-image-picker';
import FetchBlob from 'rn-fetch-blob';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import Input from 'component/Input';
import CustomRadioButton from 'component/CustomRadioButton';
import CustomButton from 'component/CustomButton';
import CustomDatePicker from 'component/CustomDatePicker';
import UserAvatar from 'component/UserAvatar';
import LoadingOverlay from 'component/LoadingOverlay';

import UploadBtn from './component/UploadBtn';
import AddressLookUpModal from './component/AddressLookUpModal';

import R from 'res/R';

export default function EditProfile({
  netInfo,
  navigation,
  error,
  updateMyProfile,
  me,
}) {
  const [screenError, setScreenError] = useState(error);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showAddressLookUp, setShowAddressLookUp] = useState(false);

  const [email, setEmail] = useState(me.email);
  const [username, setUsername] = useState(me.username);
  const [firstname, setFirstname] = useState(me.firstName);
  const [lastname, setLastname] = useState(me.lastName);
  const [gender, setGender] = useState(me.gender);
  const [birthdate, setBirthdate] = useState(
    me.birthDate ? new Date(me.birthDate) : null,
  );
  const [contactNumber, setContactNumber] = useState(me.contact);
  const [address, setAddress] = useState(me.address);
  const [picture, setPicture] = useState(
    me.image ? {uri: me.image.image} : null,
  );
  const [latitude, setLatitude] = useState(me.latitude);
  const [longitude, setLongitude] = useState(me.longitude);
  const [addressComponents, setAddressComponents] = useState(
    me.addressComponents ? me.addressComponents : [],
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (error && error !== screenError && navigation.isFocused()) {
      setScreenError(error);
      setSaveLoading(false);
      Alert.alert('Error!', error.error.message);
    }
  }, [error]);

  let usernameRef = useRef();
  let firstnameRef = useRef();
  let lastnameRef = useRef();
  let birthdateRef = useRef();
  let addressRef = useRef();

  const onBackPress = () => {
    navigation.goBack();
  };

  const hasChanges = () => {
    //TODO
  };

  const onPressDatePickerDone = () => {
    if (!birthdate || birthdate === '') {
      setBirthdate(new Date());
    }
    setShowDatePicker(false);
  };

  const uploadPhoto = () => {
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

  const onPressSave = async () => {
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
      gender,
      firstName: firstname,
      lastName: lastname,
      contact: contactNumber ? contactNumber : '',
      address,
      latitude,
      longitude,
      addressComponents,
    };
    const pictureData = [];

    if (!addressComponents) {
      Alert.alert(null, 'Please select a valid address.');
      return;
    }

    if (birthdate && birthdate !== '') {
      body.birthDate = birthdate;
    }

    if (picture && picture.fileName) {
      setSaveLoading(true);
      const path = `profile/${me._id}`;
      const imgUpload = await R.firebase.uploadImage(path, picture);
      body.image = {image: imgUpload.url, key: imgUpload.imgKey};
      if (me.image && me.image.key) {
        await R.firebase.deleteFile(me.image.key);
      }
    }

    setSaveLoading(true);
    updateMyProfile(body, pictureData, () => {
      setSaveLoading(false);
      setTimeout(() => {
        navigation.goBack();
        Snackbar.show({
          text: 'Profile successfully updated!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'green',
        });
      }, 300);
    });
  };

  const onPressSelectLocation = loc => {
    setAddress(loc.address);
    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);
    setAddressComponents(loc.components);
    setShowAddressLookUp(false);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Edit Profile" onBackPress={onBackPress} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View style={styles.formContainer}>
          {/* <Text style={styles.formTitle}>Sign Up</Text> */}
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
          <UploadBtn onPress={uploadPhoto} />
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
            editable={!me.googleId && !me.facebookId}
            style={{
              backgroundColor:
                !me.googleId && !me.facebookId ? R.colors.white : R.colors.alto,
            }}
          />
          {!me.googleId && !me.facebookId && (
            <Input
              label="Username *"
              ref={ref => (usernameRef = ref)}
              placeholder="user123"
              value={username}
              onChangeText={t => setUsername(t)}
              blurOnSubmit={false}
              returnKeyType="next"
              autoCapitalize="none"
              onSubmitEditing={() => firstnameRef.focus()}
            />
          )}
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
            value={contactNumber}
            onChangeText={t => setContactNumber(t)}
            keyboardType="number-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => addressRef.focus()}
          />
          <Input
            label="Address *"
            ref={ref => (addressRef = ref)}
            style={{minHeight: 100, maxHeight: 200, textAlignVertical: 'top'}}
            placeholder="Type your address here"
            multiline
            value={address}
            onChangeText={t => setAddress(t)}
            showSoftInputOnFocus={false}
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

          <CustomButton
            containerStyle={styles.nextBtn}
            label={saveLoading ? 'SAVING...' : 'SAVE'}
            disabled={saveLoading}
            onPress={onPressSave}
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
        onPressDone={onPressSelectLocation}
        initialLocation={{coords: {latitude, longitude}, address}}
      />
      <LoadingOverlay isVisible={saveLoading} text="Updating profile..." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 100,
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
  disabledInput: {
    backgroundColor: R.colors.alto,
  },
});
