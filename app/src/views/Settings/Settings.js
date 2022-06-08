import React from 'react';
import { ImageBackground, View, ScrollView, Image } from 'react-native';
import { ENDPOINT } from 'react-native-dotenv';

import styles from './Settings.scss';
import background from  '../../assets/img/RegisterBackground.png';
import puppy from '../../assets/img/puppy.png'
import {userActions} from '../../../redux/actions'
import { connect } from 'react-redux';

import CustomHeader from '../../assets/components/Header/Header.js'
import Paper from '../../assets/components/Paper/Paper.js';
import QuicksandBoldText from '../../assets/components/QuicksandBoldText/QuicksandBoldText.js';
import WorkSansText from '../../assets/components/WorkSansText/WorkSansText.js';
import UploadButton from '../../assets/components/UploadButton/UploadButton.js';
import CustomInput from '../../assets/components/CustomInput/CustomInput.js';
import CustomDropdown from '../../assets/components/CustomDropdown/CustomDropdown.js';
import CustomRadioButton from '../../assets/components/CustomRadioButton/CustomRadioButton.js';
import SettingsButton from '../../assets/components/SettingsButton/SettingsButton.js';

function Settings({navigation,logout}) {
 
  return (
    <ImageBackground 
        style={{width: '100%', height: '100%'}}
        source={background}
    >

      <CustomHeader
          navigation={navigation}          
          title={'Settings'}
          back
          noRight
          onPress={()=>{navigation.goBack()}}
      />
      <View
        style={styles.buttonContainers}
      >
       {/*<SettingsButton
          title="Edit Profile"
          iconName="person"
          iconType="material-icons"
       />*/}
        <SettingsButton
          title="Privacy Policy"
          iconName="file-document"
          iconType="material-community"
          onPress={()=>navigation.navigate('WebComponent',{title:"Privacy Policy",uri:"http://google.com"})}
        />
        <SettingsButton
          title="Terms and Conditions"
          iconName="file-document"
          iconType="material-community"
          onPress={()=>navigation.navigate('WebComponent',{title:"Terms and Conditions",uri:"http://google.com"})}
        />
        <SettingsButton
          title="Logout"
          iconName="exit-run"
          iconType="material-community"
          onPress={()=>{logout();navigation.navigate('Login')}}
        />
      </View>

    </ImageBackground>
  );
}

function mapState(state) {
  const { user } = state.user;
  return { user };
}

const actionCreators = {
  logout: userActions.logout,
};

export default connect(mapState,actionCreators)(Settings);
