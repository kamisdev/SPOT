import React from 'react';
import { ImageBackground, View, ScrollView, Image,ActivityIndicator } from 'react-native';
import { ENDPOINT } from 'react-native-dotenv';
import {WebView} from 'react-native-webview'

import styles from './WebComponent.scss';
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
import SettingsButton from '../../assets/components/SettingsButton/SettingsButton.js';

export default function WebComponent(props) {
  const [loaded,setLoad] = React.useState(false);

  return (
    <ImageBackground 
        style={{width: '100%', height: '100%'}}
        source={background}
    >

      <CustomHeader
          navigation={props.navigation}          
          title={props.route.params?.title}
          noRight
          back
          onPress={()=>props.navigation.goBack()}
      />
      <View style={{
        flex:1,
      }}>
        {!loaded&&
          <ActivityIndicator
            size="large"
            color="white"
            style={{height:'100%'}}
          />
        }
        <WebView
          source={{ uri: props.route.params?.uri }}
          style={{ marginTop: 20 }}
          onLoad={()=>setLoad(true)}
        />
      </View>

    </ImageBackground>
  );
}
