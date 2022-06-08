import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import moment from 'moment';
import {human} from 'react-native-typography';
import {launchImageLibrary} from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import Input from 'component/Input';
import CustomDatePicker from 'component/CustomDatePicker';
import CustomRadioButton from 'component/CustomRadioButton';
import CustomButton from 'component/CustomButton';
import UserAvatar from 'component/UserAvatar';
import LoadingOverlay from 'component/LoadingOverlay';

import PetPhotos from './component/PetPhotos';
import Behaviour from './component/Behaviour';
import UploadBtn from './component/UploadBtn';

import R from 'res/R';

export default function AddPet({
  netInfo,
  navigation,
  error,
  me,
  addPet,
  addPetPhotos,
}) {
  const [screenError, setScreenError] = useState(error);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingOverlayText, setLoadingOverlayText] = useState('Adding pet...');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [petInfo, setPetInfo] = useState({});
  const [petPhotos, setPetPhotos] = useState([]);
  const [behaviours, setBehaviours] = useState([]);
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
    if (!petInfo.birthdate || petInfo.birthdate === '') {
      const bday = new Date();
      const age = R.helper.computePetAge(bday);
      setPetInfo({...petInfo, birthdate: bday, age});
    }
    setShowDatePicker(false);
  };
  const handleOnDateChange = d => {
    const age = R.helper.computePetAge(d);
    setPetInfo({...petInfo, birthdate: d, age});
  };

  const onPressAddPhoto = () => {
    launchImageLibrary(R.values.imagePickerPhotoOptions, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setPetPhotos([...petPhotos, response]);
      }
    });
  };
  const onPressRemovePhoto = i => {
    const newPhotos = petPhotos.filter((img, index) => index !== i);
    setPetPhotos(newPhotos);
  };

  const onPressAddBehaviour = val => {
    if (val !== '') {
      setBehaviours([...behaviours, val]);
    }
  };
  const onPressRemoveBehaviour = val => {
    const newBehaviours = behaviours.filter(o => o !== val);
    setBehaviours(newBehaviours);
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
    const {name, breed, height, weight, birthdate, gender, dislikes} = petInfo;

    if (
      !name ||
      name === '' ||
      !breed ||
      breed === '' ||
      !height ||
      height === '' ||
      !weight ||
      weight === '' ||
      !birthdate ||
      birthdate === '' ||
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

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const body = {...petInfo, birthDate: birthdate, petName: name, behaviours};
    setLoadingOverlayText('Adding pet...');

    if (picture && picture.fileName) {
      setSubmitLoading(true);
      const path = 'pet';
      const imgUpload = await R.firebase.uploadImage(path, picture);
      body.image = {image: imgUpload.url, key: imgUpload.imgKey};
    }

    setSubmitLoading(true);
    addPet(body, async res => {
      const toUploadPhotos = [];
      if (toUploadPhotos && toUploadPhotos.length > 0) {
        setLoadingOverlayText('Uploading pet photos...');
      }
      for (const img of petPhotos) {
        const path = `gallery/pet/${me._id}`;
        const imgUpload = await R.firebase.uploadImage(path, img);
        toUploadPhotos.push({
          ownerId: res._id,
          image: imgUpload.url,
          key: imgUpload.imgKey,
        });
      }
      addPetPhotos(toUploadPhotos, res._id, () => {
        setSubmitLoading(false);
        Snackbar.show({
          text: 'Pet added successfully.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: R.colors.malachite,
        });
        if (navigation.isFocused()) {
          navigation.goBack();
        }
      });
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Add Pet" onBackPress={onBackPress} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* <Text style={styles.formTitle}>Register Pet</Text> */}
          <Text style={styles.formSubTitle}>Please fill in all fields.</Text>
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
            label="Pet Name"
            placeholder="Your pet name"
            value={petInfo.name}
            onChangeText={t => setPetInfo({...petInfo, name: t})}
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
            value={petInfo.height}
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
            value={petInfo.weight}
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
              petInfo.birthdate
                ? moment(petInfo.birthdate).format('MMMM DD, YYYY')
                : ''
            }
          />
          <Input
            label="Age"
            placeholder="Enter birthday to compute age"
            editable={false}
            value={petInfo.age}
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
              onPress={e => {
                setPetInfo({...petInfo, gender: e.value});
              }}
              color={R.colors.pictonBlue}
              value={petInfo.gender}
            />
          </View>
          <PetPhotos
            photos={petPhotos}
            onAddPhoto={onPressAddPhoto}
            onRemovePhoto={onPressRemovePhoto}
          />
          <Behaviour
            list={behaviours}
            onAdd={onPressAddBehaviour}
            onRemove={onPressRemoveBehaviour}
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
            label={submitLoading ? 'LOADING...' : 'SUBMIT'}
            onPress={onPressSubmit}
            disabled={submitLoading}
          />
        </View>
      </ScrollView>
      <CustomDatePicker
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        date={petInfo.birthdate ? petInfo.birthdate : new Date()}
        onDateChange={handleOnDateChange}
        mode="date"
        maximumDate={new Date()}
        onPressDone={onPressDatePickerDone}
      />
      <LoadingOverlay isVisible={submitLoading} text={loadingOverlayText} />
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
  formTitle: {
    ...human.title3,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.pictonBlue,
    textAlign: 'center',
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
  formSubTitle: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.silverChalice,
    textAlign: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  avatar: {
    elevation: 2,
  },
});
