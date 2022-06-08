import React from 'react';
import { ImageBackground, View, ScrollView, Image } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { ENDPOINT } from 'react-native-dotenv';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';

import styles from './Register.scss';
import background from  '../../assets/img/RegisterBackground.png';
import puppy from '../../assets/img/puppy.png'

import CustomHeader from '../../assets/components/Header/Header.js'
import Paper from '../../assets/components/Paper/Paper.js';
import QuicksandBoldText from '../../assets/components/QuicksandBoldText/QuicksandBoldText.js';
import WorkSansText from '../../assets/components/WorkSansText/WorkSansText.js';
import UploadButton from '../../assets/components/UploadButton/UploadButton.js';
import CustomInput from '../../assets/components/CustomInput/CustomInput.js';
import CustomDropdown from '../../assets/components/CustomDropdown/CustomDropdown.js';
import CustomRadioButton from '../../assets/components/CustomRadioButton/CustomRadioButton.js';
import RoundedButton from '../../assets/components/RoundedButton/RoundedButton.js';

export default function Register({navigation}) {
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
  const [loading,isLoading] = React.useState(false);
  const months = [
    {
      label: 'January',
      value: 1,
    },
    {
      label: 'February',
      value: 2,
    },
    {
      label: 'March',
      value: 3,
    },
    {
      label: 'April',
      value: 4,
    },
    {
      label: 'May',
      value: 5,
    },
    {
      label: 'June',
      value: 6,
    },
    {
      label: 'July',
      value: 7,
    },
    {
      label: 'August',
      value: 8,
    },
    {
      label: 'September',
      value: 9,
    },
    {
      label: 'October',
      value: 10,
    },
    {
      label: 'November',
      value: 11,
    },
    {
      label: 'December',
      value: 12,
    },
    
  ];
  var radio_props = [
    {label: 'Male', value: 0 },
    {label: 'Female', value: 1 }
  ];
  const [userInfo,setUserInfo] = React.useState(
   { email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: new Date(),
    gender: 0,
    contact: 0,
    address: '',
  });
  const [pictureData, setPictureData] = React.useState({});
  const [confirmpass,setConfirmpass] = React.useState('');
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
    for (i=2020; i>=1910; i--){
      y.push({
        label:i.toString(),
        value: i
      })
    };
    setYears(y)
  },[]);
  


const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("image", {
    name: 'picture',
    type: photo.type,
    uri:
      Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });
/*
  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });*/
  console.log(data);
  return data;
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

  const _test = () => {
    console.log('trigger')
    axios.post('http://74.63.195.76:8000/api/user/me/',
    { headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1ZWE4NWI2MzJiNzFmNDUwZjg1NDI4ZTQiLCJqdGkiOiJjODYwODg1M2RjMWYxYWU1ZjA2MWU0ZDk4YWFjNDk1NjBiMGE1NzAzNWU5NjQ0NTBiZWRiZThlMGIxMmM2YTM5OWQwMTYxN2E2NzI5ZDgzZiIsImlhdCI6MTU4ODI2NDg0MywibmJmIjoxNTg4MjY0ODQzLCJleHAiOjE2MTk4MDA4NDMsInN1YiI6IjVlYTMwMTdkZjRlOGRhNDE1MzBlZWRjMiIsInNjb3BlcyI6WyIqIl19.b2DzwKowMArzfOYC_Ag6jV2-k_tSj8SBEl_NKzoVCAGk_7V99fRdn980GHIVNPrfqDAjYnG7JhxhbhJtDSh_BVQU0tU7WT3b0-NKXw6ES_eBZjdI62H2WPGbYiHLmLxhLV5Zy-WIkG0mVYBF4ls5fZavUkCg1vrHop1NZM-EKt_dQHx2euEzXEen4HlAkqU-88ilPNy1hKeNx6cig3P5-9orEBRKyzdpnJRAzVeUI9awuoIZkGbSBNK0c0UQL7atJsegffaK3GgBWcMiCHnVJ-eSKbzHqx8FKFi3qhT-57Sj13ZaQBgBbeQQPBvfE3pEMX10951SwXz0dHXEVhIKMq8Cm9iAk-2KQjKxB0hhLgKRAjILpdyjFDbUAOiuYKCibpGTcV9nyhmSgAj4zyRfEgDLEgGx7NHj4mUpWD3Z7zvxW46eW0T10GcTPfyC9fPpYMkKVq_AItHH1HUtxafFWdrprqvZSSi_CGy8sxtLGJTTh39DJkznRYbQpmytI4SI4Y9prci5cShawGX5zU5Vct4-j99DXbPIQ3pl59W36GFHkcZlrU0-g0iRDYKPN5V0XL3v8L3xUsJLsDBuPqtSp5Aqb_yjVwuEQ0ZilGiJQF1T4hshSdrAMLw9fhoO-gbTiuISvrTnlB0Lu24xkLAdcglN9U5rjw2KHkXncfiTce0'
      }
    }).then(res=>console.log(res))
    .catch(err=>console.log(err))
  }
  const _register = () => {
    if (pictureData.uri) {
      isLoading(true);
      if (confirmpass === userInfo.password) {
        axios.post(ENDPOINT+'/user/uploadfile', createFormData(pictureData))
        .then((result)=>{
          const picture = result.data.key;
          const userData = {...userInfo,picture};
          console.log(userData);
          axios.post(ENDPOINT + '/user/register', userData)
          .then((result) => {
            Snackbar.show({
              text: 'Registered Successfully',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'green',
            });
            isLoading(false);
            setUserInfo({ email: '',
              username: '',
              password: '',
              firstName: '',
              lastName: '',
              birthDate: new Date(),
              gender: 0,
              contact: 0,
              address: '',
              picture:''
            });
          }).catch(err => {
            Snackbar.show({
              text: err.toString(),
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
            isLoading(false);
          });
        });
      } else {
        Snackbar.show({
          text: 'Passwords do not match.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
        isLoading(false);
      }
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
    navigation={navigation}          title={'Register'}
          onPress={()=>navigation.navigate('Login')}
          back
      />
        <ScrollView>
        <Paper>
            <QuicksandBoldText
              style={styles.blueTitle}
            >
              Sign Up
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
              placeholder='Email Address'
              value={userInfo.email}
              onChangeText={e=>{setUserInfo({...userInfo,email:e})}}
            />
            <CustomInput
              placeholder='Username'
              value={userInfo.username}
              onChangeText={e=>{setUserInfo({...userInfo,username:e})}}
            />
            <CustomInput
              placeholder='Password'
              value={userInfo.password}
              onChangeText={e=>{setUserInfo({...userInfo,password:e})}}
              password={true}
            />
            <CustomInput
              placeholder='Confirm Password'
              value={confirmpass}
              onChangeText={e=>{setConfirmpass(e)}}
              password={true}
            />
            <CustomInput
              placeholder='First Name'
              value={userInfo.firstName}
              onChangeText={e=>{setUserInfo({...userInfo,firstName:e})}}
            />
            <CustomInput
              placeholder='Last Name'
              value={userInfo.lastName}
              onChangeText={e=>{setUserInfo({...userInfo,lastName:e})}}
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
                onValueChange={value=>{userInfo.birthDate.setDate(value)}}
                placeholder={{
                  label:'Day',
                  value: null,
                  color: '#C9C9C9'
                }}
              />
              <CustomDropdown
                items={months}
                width={'30%'}
                onValueChange={value=>{userInfo.birthDate.setMonth(value-1)}}
                placeholder={{
                  label:'Month',
                  value: null,
                  color: '#C9C9C9'
                }}
              />
              <CustomDropdown
                items={years}
                width={'30%'}
                onValueChange={value=>{userInfo.birthDate.setFullYear(value)}}
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
              onPress={e=>{setUserInfo({...userInfo,gender:e.value})}}
              color={'#26CFEC'}
              value={userInfo.gender}
            />
            <CustomInput
              placeholder='Contact Number'
              value={userInfo.contact.toString()}
              keyboardType="number-pad"
              onChangeText={e=>{setUserInfo({...userInfo,contact:parseInt(e)})}}
            />
            <CustomInput
              placeholder='Address'
              value={userInfo.address}
              onChangeText={e=>{setUserInfo({...userInfo,address:e})}}
              multiline={true}
            />
            <RoundedButton
              title={loading?'REGISTERING...':'REGISTER'}
              style={styles.next}
              color={'#FD6C59'}
              onPress={()=>_register()}
              disabled={loading}
            />


        </Paper>
        </ScrollView>

    </ImageBackground>
  );
}
