import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {human} from 'react-native-typography';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import {launchImageLibrary} from 'react-native-image-picker';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import UserAvatar from 'component/UserAvatar';
import Input from 'component/Input';
import CustomRadioButton from 'component/CustomRadioButton';
import CustomDatePicker from 'component/CustomDatePicker';
import CustomButton from 'component/CustomButton';
import LoadingOverlay from 'component/LoadingOverlay';

import UploadBtn from './component/UploadBtn';
import Behaviour from './component/Behaviour';

import R from 'res/R';

export default function EditPet({
  netInfo,
  navigation,
  route,
  error,
  updatePet,
}) {
  const {pet} = route.params;
  const [screenError, setScreenError] = useState(error);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [petInfo, setPetInfo] = useState(pet);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [behaviours, setBehaviours] = useState(pet.behaviours);
  const [picture, setPicture] = useState();

  let breedRef = useRef();
  let heightRef = useRef();
  let weightRef = useRef();
  let birthdateRef = useRef();

  useEffect(() => {
    if (error && error !== screenError && navigation.isFocused()) {
      setSubmitLoading(false);
      Alert.alert('Error', error.error.message);
      setScreenError(error);
    }
  }, [error]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onPressDatePickerDone = () => {
    if (!petInfo.birthDate || petInfo.birthDate === '') {
      const bday = new Date();
      const age = R.helper.computePetAge(bday);
      setPetInfo({...petInfo, birthDate: bday, age});
    }
    setShowDatePicker(false);
  };
  const handleOnDateChange = d => {
    const age = R.helper.computePetAge(d);
    setPetInfo({...petInfo, birthDate: d, age});
  };

  const onAddBehavior = val => {
    setBehaviours([...behaviours, val]);
  };
  const onRemoveBehavior = val => {
    const newBehaviors = behaviours.filter(o => o !== val);
    setBehaviours(newBehaviors);
  };

  const hasChanges = () => {
    let res = false;
    if (petInfo.petName !== pet.petName) {
      res = true;
    } else if (petInfo.breed !== pet.breed) {
      res = true;
    } else if (petInfo.height !== pet.height) {
      res = true;
    } else if (petInfo.weight !== pet.weight) {
      res = true;
    } else if (petInfo.birthDate !== pet.birthDate) {
      res = true;
    } else if (petInfo.gender !== pet.gender) {
      res = true;
    } else if (petInfo.dislikes !== pet.dislikes) {
      res = true;
    } else if (behaviours !== pet.behaviours) {
      res = true;
    } else if (picture && picture.fileName) {
      res = true;
    }

    return res;
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

  const onPressSubmit = async () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const {
      petName,
      breed,
      height,
      weight,
      birthDate,
      gender,
      dislikes,
    } = petInfo;

    if (
      !petName ||
      petName === '' ||
      !breed ||
      breed === '' ||
      !height ||
      height === '' ||
      !weight ||
      weight === '' ||
      !birthDate ||
      birthDate === '' ||
      !dislikes ||
      dislikes === ''
    ) {
      Alert.alert(null, 'Please fill in all fields.');
      return;
    } else if (gender === undefined || gender === null || gender === '') {
      Alert.alert(null, 'Please select a gender.');
      return;
    } else if (!behaviours || behaviours.length < 1) {
      Alert.alert(null, 'Please add at least one behaviour.');
      return;
    }

    const body = {...petInfo, behaviours};

    if (picture && picture.fileName) {
      setSubmitLoading(true);
      const path = `pet/${pet._id}`;
      const imgUpload = await R.firebase.uploadImage(path, picture);
      body.image = {image: imgUpload.url, key: imgUpload.imgKey};
      if (pet.image) {
        await R.firebase.deleteFile(pet.image.key);
      }
    }

    setSubmitLoading(true);
    updatePet(pet._id, body, () => {
      setSubmitLoading(false);
      setTimeout(() => {
        Snackbar.show({
          text: 'Pet updated successfully.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: R.colors.malachite,
          action: {
            text: 'Dismiss',
            textColor: R.colors.white,
            onPress: Snackbar.dismiss(),
          },
        });
        if (navigation.isFocused()) {
          navigation.goBack();
        }
      }, 300);
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Edit Pet" onBackPress={onBackPress} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.avatarContainer}>
            <UserAvatar
              img={
                picture
                  ? picture
                  : petInfo.image
                  ? {uri: petInfo.image.image}
                  : R.images.petDefaultAvatar
              }
              size={90}
            />
            <UploadBtn onPress={uploadPhoto} />
          </View>
          <Input
            label="Pet Name"
            placeholder="Your pet name"
            value={petInfo.petName}
            onChangeText={t => setPetInfo({...petInfo, petName: t})}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => breedRef.focus()}
          />
          <Input
            ref={ref => (breedRef = ref)}
            label="Pet Breed"
            placeholder="Your pet breed"
            value={petInfo.breed}
            onChangeText={t => setPetInfo({...petInfo, breed: t})}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => heightRef.focus()}
          />
          <Input
            ref={ref => (heightRef = ref)}
            label="Height (ft)"
            placeholder="2 ft."
            value={petInfo.height.toString()}
            onChangeText={t => setPetInfo({...petInfo, height: t})}
            blurOnSubmit={false}
            returnKeyType="next"
            keyboardType="number-pad"
            onSubmitEditing={() => weightRef.focus()}
          />
          <Input
            ref={ref => (weightRef = ref)}
            label="Weight (lbs)"
            placeholder="10 lbs."
            value={petInfo.weight.toString()}
            onChangeText={t => setPetInfo({...petInfo, weight: t})}
            blurOnSubmit={false}
            returnKeyType="next"
            keyboardType="number-pad"
            onSubmitEditing={() => birthdateRef.focus()}
          />
          <Input
            ref={ref => (birthdateRef = ref)}
            label="Date of Birth"
            placeholder={moment().format('MMMM DD, YYYY')}
            showSoftInputOnFocus={false}
            onFocus={() => {
              setShowDatePicker(true);
              birthdateRef.blur();
            }}
            value={
              petInfo.birthDate
                ? moment(petInfo.birthDate).format('MMMM DD, YYYY')
                : ''
            }
          />
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gender</Text>
            <CustomRadioButton
              formHorizontal
              radioProps={[
                {label: 'Female', value: 'female'},
                {label: 'Male', value: 'male'},
              ]}
              width={'50%'}
              initial={0}
              onPress={e => {
                setPetInfo({...petInfo, gender: e.value});
              }}
              color={R.colors.pictonBlue}
              value={petInfo.gender}
            />
          </View>
          <Behaviour
            list={behaviours}
            onAdd={onAddBehavior}
            onRemove={onRemoveBehavior}
          />
          <Input
            containerStyle={styles.multilineInputContainer}
            label="Dislikes"
            style={styles.multilineInput}
            multiline
            value={petInfo.dislikes}
            onChangeText={t => setPetInfo({...petInfo, dislikes: t})}
          />
          <CustomButton
            containerStyle={styles.submitBtn}
            label={submitLoading ? 'LOADING...' : 'SAVE CHANGES'}
            onPress={onPressSubmit}
            disabled={!hasChanges() || submitLoading}
          />
        </View>
      </ScrollView>
      <CustomDatePicker
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        date={petInfo.birthDate ? new Date(petInfo.birthDate) : new Date()}
        onDateChange={handleOnDateChange}
        mode="date"
        maximumDate={new Date()}
        onPressDone={onPressDatePickerDone}
      />
      <LoadingOverlay isVisible={submitLoading} text="Updating pet..." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 100,
    marginTop: 20,
  },
  formContainer: {
    backgroundColor: R.colors.white,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.fontMain,
    marginBottom: 10,
  },
  multilineInputContainer: {
    marginTop: 30,
  },
  multilineInput: {
    minHeight: 120,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: 50,
    marginHorizontal: 15,
  },
});
