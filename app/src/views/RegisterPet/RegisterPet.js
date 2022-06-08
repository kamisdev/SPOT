import React from 'react';
import { ImageBackground, View, ScrollView, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import axios from 'axios';
import { ENDPOINT } from 'react-native-dotenv';
import pictureDisplay from '../../assets/helpers/pictureDisplay'

import styles from './RegisterPet.scss';
import background from  '../../assets/img/RegisterBackground.png';

import CustomHeader from '../../assets/components/Header/Header.js'
import Paper from '../../assets/components/Paper/Paper.js';
import QuicksandBoldText from '../../assets/components/QuicksandBoldText/QuicksandBoldText.js';
import WorkSansText from '../../assets/components/WorkSansText/WorkSansText.js';
import UploadButton from '../../assets/components/UploadButton/UploadButton.js';
import CustomInput from '../../assets/components/CustomInput/CustomInput.js';
import CustomDropdown from '../../assets/components/CustomDropdown/CustomDropdown.js';
import CustomRadioButton from '../../assets/components/CustomRadioButton/CustomRadioButton.js';
import RoundedButton from '../../assets/components/RoundedButton/RoundedButton.js';
import RoundedButtonOutline from '../../assets/components/RoundedButtonOutline/RoundedButtonOutline.js';
import AddImage from '../../assets/components/AddImage/AddImage.js';
import {userActions,petActions} from '../../../redux/actions';


 function RegisterPet({navigation, user, getPets, route, pet, updatePet}) {
  let petParam; 
  if (route.params) {
    petParam = route.params.pet
  };
  


  const months = [
    {
      label: 'January',
      value: 0,
    },
    {
      label: 'February',
      value: 1,
    },
    {
      label: 'March',
      value: 2,
    },
    {
      label: 'April',
      value: 3,
    },
    {
      label: 'May',
      value: 4,
    },
    {
      label: 'June',
      value: 5,
    },
    {
      label: 'July',
      value: 6,
    },
    {
      label: 'August',
      value: 7,
    },
    {
      label: 'September',
      value: 8,
    },
    {
      label: 'October',
      value: 9,
    },
    {
      label: 'November',
      value: 10,
    },
    {
      label: 'December',
      value: 11,
    },
    
  ];
  var radio_props = [
    {label: 'Male', value: 0 },
    {label: 'Female', value: 1 }
  ];

const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("image", {
    name: 'picture',
    type: photo.type,
    uri:
      Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });
  return data;
};
  const [loading,isLoading] = React.useState(false);
  const [pictureData,setPictureData] = React.useState({})
  const [petInfo,setPetInfo] = React.useState({
    userId: user._id,
    petName: '',
    breed: '',
    height: 0,
    weight: 0,
    birthDate: new Date(),
    gender: 0,
    behaviour: '',
    dislikes: '',
    picture: '',
  });
  const [days,setDays] = React.useState([
    {
      label: '0',
      value: 0,
    }]);
  const [years,setYears] = React.useState([
    {
      label: '0',
      value: 0,
    }]);

  React.useEffect(()=>{
    console.log(pet);
    if(pet.updatingPet){
      getPets({user});
      navigation.goBack();
    }
  })  
  React.useEffect(()=>{
    if (petParam) {
      let {_id,...petInfoss} = petParam;
        petInfoss = {
          ...petInfoss,
          birthDate: new Date(petInfoss.birthDate),
          gender: petInfo.gender?1:0,
        }
      setPetInfo(petInfoss);
      setPictureData({uri: pictureData(petParam.picture)})
    }
    let d = []
    var i;
    for (i=1; i<=31; i++){
      d.push({
        label:i.toString(),
        value: i
      })
    };
    setDays(d);
    let y = [];
    for (i=2020; i>=1900; i--){
      y.push({
        label:i.toString(),
        value: i
      })
    };
    setYears(y)
  },[]);
  const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5
  };
  const _openPicker = () =>{
    ImagePicker.launchImageLibrary(options, (response) => {
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setPictureData(response)
      }
    });
  };

  const _register = () => {
    if (pictureData.uri) {
      isLoading(true);
       axios.post(ENDPOINT+'/user/uploadfile', createFormData(pictureData))
        .then((result)=>{
          const picture = result.data.key;
          const petData = {...petInfo,picture};
          axios.post(ENDPOINT + '/pet/register', petData, {
            headers: {
            'x-access-token': user.token
            }
          })
          .then((result) => {
            console.log(result);
            Snackbar.show({
              text: 'Registered Successfully',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'green',
            });
            isLoading(false);
            setPetInfo({ userId: '',
              petName: '',
              breed: '',
              height: 0,
              weight: 0,
              birthDate: new Date(),
              gender: 0,
              behaviour: '',
              dislikes: '',
              picture: '',
            });
            setPictureData({})
            getPets({user});
          }).catch(err => {
            Snackbar.show({
              text: err.toString(),
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
            isLoading(false);
          });
        }).catch(err=>{
          Snackbar.show({
            text: err.toString(),
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
          isLoading(false);
        });
      
    } else {
      Snackbar.show({
        text: 'You need to add a photo.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
      isLoading(false);
    }
  };

  return (
    <ImageBackground 
        style={{width: '100%', height: '100%'}}
        source={background}
    >
      <CustomHeader
    navigation={navigation}          title={petParam?'Edit Pet':'Add Pet'}
          back
          onPress={()=>navigation.goBack()}
      />
        <ScrollView>
        <Paper last>
            <QuicksandBoldText
              style={styles.blueTitle}
            >
              Pet Details
            </QuicksandBoldText>
            <View style={styles.roundPicture}>
              <Image 
                source={{uri:pictureData.uri }}
                style={{width:'100%',height:'100%',backgroundColor:'#acacac'}}
              />
            </View>
            {(!pictureData.uri)&&
            <UploadButton
              style={styles.upload}
              onPress={()=>{_openPicker()}}
            />
            }
            <CustomInput
              placeholder='Pet Name'
              value={petInfo.petName}
              onChangeText={e=>{setPetInfo({...petInfo,petName:e})}}
            />
            <CustomInput
              placeholder='Dog Breed'
              value={petInfo.breed}
              onChangeText={e=>{setPetInfo({...petInfo,breed:e})}}
            />
            <CustomInput
              placeholder='Height (ft)'
              value={petInfo.height?petInfo.height.toString():''}
              onChangeText={e=>{setPetInfo({...petInfo,height:e})}}
            />
            <CustomInput
              placeholder='Weight (lbs)'
              value={petInfo.weight?petInfo.weight.toString():''}
              onChangeText={e=>{setPetInfo({...petInfo,weight:e})}}
            />
            <WorkSansText
              style={styles.subTitle}
            >
              Date of Birth
            </WorkSansText>
            <View style={styles.dateDropdowns}>
              <CustomDropdown
                items={days}
                width={'20%'}
                value={petInfo.birthDate.getDate()}
                onValueChange={value=>{setPetInfo({...petInfo,birthDate:new Date(petInfo.birthDate.setDate(value))})}}
                placeholder={{
                  label:'Day',
                  value: null,
                  color: '#C9C9C9'
                }}
              />
              <CustomDropdown
                items={months}
                width={'30%'}
                value={petInfo.birthDate.getMonth()}
                onValueChange={value=>{
                  setPetInfo({...petInfo,birthDate:new Date(petInfo.birthDate.setMonth(value))})
                }}
                placeholder={{
                  label:'Month',
                  value: null,
                  color: '#C9C9C9'
                }}
              />
              <CustomDropdown
                items={years}
                width={'30%'}
                value={petInfo.birthDate.getFullYear()}
                onValueChange={value=>{setPetInfo({...petInfo,birthDate:new Date(petInfo.birthDate.setFullYear(value))})}}
                placeholder={{
                  label:'Year',
                  value: null,
                  color: '#C9C9C9'
                }}
              />
            </View>
            <WorkSansText
              style={{...styles.subTitle,marginTop:40}}
            >
              Gender
            </WorkSansText>
            <CustomRadioButton
              radioProps={radio_props}
              width={'50%'}
              onPress={e=>{setPetInfo({...petInfo,gender:e.value})}}
              color={'#32CC32'}
              value={petInfo.gender}
            />
            {petParam&&
              <AddImage
                pet={petParam}
              />
            }
            <WorkSansText
              style={styles.subTitle}
            >
              Behaviour
            </WorkSansText>
            {/*<View style={styles.behaviours}>
              <CustomDropdown
                  items={years}
                  width={'100%'}
                  placeholder={{
                    label:'Select Behaviour',
                    value: null,
                    color: '#C9C9C9'
                  }}
              />
                </View>*/}
            <CustomInput
              placeholder='Behaviour'
              value={petInfo.behaviour}
              onChangeText={e=>{setPetInfo({...petInfo,behaviour:e})}}
              multiline={true}
            />
            <CustomInput
              placeholder='Dislikes'
              value={petInfo.dislikes}
              onChangeText={e=>{setPetInfo({...petInfo,dislikes:e})}}
              multiline={true}
            />
            <View style={styles.buttonGroup}>
              <RoundedButtonOutline
                title={'BACK'}
                style={styles.button}
                onPress={()=>navigation.goBack()}
              />
              {petParam?
              <RoundedButton
                title={pet.updatingPet?'SAVING...':'SAVE'}
                disabled={pet.updatingPet}
                color={'#FD6C59'}
                onPress={()=>updatePet(petParam._id,petInfo)}
              />:
              <RoundedButton
                title={loading?'ADDING...':'ADD'}
                disabled={loading}
                color={'#FD6C59'}
                onPress={()=>_register()}
              />}
            </View>
            


        </Paper>
        </ScrollView>

    </ImageBackground>
  );
}


function mapState(state) {
  const { user } = state.user;
  const { pet }= state;
  return { user,pet };
}


const actionCreators = {
  getPets: userActions.getPets,
  updatePet: petActions.updatePet
};

export default connect(mapState,actionCreators)(RegisterPet);
