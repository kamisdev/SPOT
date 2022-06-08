import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {human} from 'react-native-typography';
import moment from 'moment';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import UserAvatar from 'component/UserAvatar';
import CustomRadioButton from 'component/CustomRadioButton';
import CustomDatePicker from 'component/CustomDatePicker';
import Input from 'component/Input';
import CustomButton from 'component/CustomButton';
import LoadingOverlay from 'component/LoadingOverlay';

import AddressLookUpModal from './component/AddressLookUpModal';

import R from 'res/R';

export default function CompleteSocialLogin({
  netInfo,
  navigation,
  route,
  error,
  registerSocialUser,
}) {
  const {userData} = route.params;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddressLookUp, setShowAddressLookUp] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [screenError, setScreenError] = useState(error);

  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [gender, setGender] = useState();
  const [birthDate, setBirthDate] = useState();
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [addressComponents, setAddressComponents] = useState();

  let birthdateRef = useRef();
  let addressRef = useRef();
  let lastNameRef = useRef();

  useEffect(() => {
    if (error && error !== screenError && navigation.isFocused()) {
      console.log('huehue');
      setScreenError(error);
      setSubmitLoading(false);
      Alert.alert('Error', error.error.message);
    }
  }, [error]);

  const onPressDatePickerDone = () => {
    if (!birthDate || birthDate === '') {
      setBirthDate(new Date());
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

  const onPressRegister = () => {
    if (!birthDate || !gender || !address || address === '') {
      Alert.alert(null, 'Please fill in all the required(*) fields.');
      return;
    } else if (!latitude || !longitude) {
      Alert.alert(null, 'Please select a complete address.');
      return;
    } else if (!addressComponents) {
      Alert.alert(null, 'Please select a valid address.');
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
      ...userData,
      firstName,
      lastName,
      gender,
      birthDate,
      address,
      latitude,
      longitude,
      addressComponents,
    };

    if (contact && contact !== '') {
      body.contact = contact;
    }

    setSubmitLoading(true);
    registerSocialUser(body);
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Complete Your Profile" onBackPress={onBackPress} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.formContainer}>
          <View style={styles.avatarContainer}>
            <UserAvatar
              size={90}
              img={
                userData.picture
                  ? {uri: userData.picture}
                  : R.images.defaultAvatar
              }
            />
          </View>
          <Input
            label="First Name *"
            placeholder="Firstname"
            value={firstName}
            onChangeText={t => setFirstName(t)}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
          />
          <Input
            ref={lastNameRef}
            label="Last Name *"
            placeholder="Lastname"
            value={lastName}
            onChangeText={t => setLastName(t)}
          />
          {/* <Text style={styles.name}>{`${userData.firstName} ${
            userData.lastName
          }`}</Text>
          <Text style={styles.email}>{userData.email}</Text> */}

          <Input
            label="Date of Birth *"
            ref={ref => (birthdateRef = ref)}
            placeholder={moment().format('MMMM DD, YYYY')}
            showSoftInputOnFocus={false}
            onFocus={() => {
              setShowDatePicker(true);
              birthdateRef.blur();
            }}
            value={birthDate ? moment(birthDate).format('MMMM DD, YYYY') : ''}
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
              setShowAddressLookUp(true);
              addressRef.blur();
            }}
          />

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
        date={birthDate ? birthDate : new Date()}
        onDateChange={d => setBirthDate(d)}
        mode="date"
        maximumDate={new Date()}
        onPressDone={onPressDatePickerDone}
      />
      <AddressLookUpModal
        isVisible={showAddressLookUp}
        onClose={() => setShowAddressLookUp(false)}
        onPressDone={onPressSelecLocation}
      />
      <LoadingOverlay isVisible={submitLoading} text="Loading..." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: R.colors.white,
    margin: 15,
    borderRadius: 10,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  name: {
    ...human.title3,
    fontFamily: R.fonts.WorkSansSemiBold,
    textAlign: 'center',
    marginTop: 10,
  },
  email: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 10,
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
  nextBtn: {
    marginTop: 40,
  },
});
