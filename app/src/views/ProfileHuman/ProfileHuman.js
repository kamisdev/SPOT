import React from 'react'
import {AsyncStorage, ImageBackground,View,ScrollView,Text,SafeAreaView} from 'react-native';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import OneSignal from 'react-native-onesignal'; 
import axios from "axios";
import { ENDPOINT } from 'react-native-dotenv';



import background from  '../../assets/img/RegisterBackground.png';
import raymond from '../../assets/img/raymond-colt.png';
import puppy from '../../assets/img/puppy.png'
import styles from './ProfileHuman.scss';

import CustomHeader from '../../assets/components/Header/Header.js';
import AvatarLarge from '../../assets/components/AvatarLarge/AvatarLarge.js';
import CustomTabView from '../../assets/components/CustomTabView/CustomTabView.js';
import ImageGallery from '../../assets/components/ImageGallery/ImageGallery.js';
import RoundedButtonOutline from '../../assets/components/RoundedButtonOutline/RoundedButtonOutline.js';
import MyPets from '../../assets/components/MyPets/MyPets';
import pictureDisplay from '../../assets/helpers/pictureDisplay'
import {userActions,messageActions} from '../../../redux/actions';

function ProfileHuman({navigation,user,pets,getPets,setBadge,setDevices}){
 
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 0, title: 'Gallery', component:()=><ImageGallery user={user}/> },
    { key: 1, title: 'My Pet', transparent: true, component: ()=><MyPets transparent navigation={navigation} user={user} />},
  ]);
  

  React.useEffect(() => {
    getPets({user});
    OneSignal.addEventListener('ids', onIds);
    OneSignal.addEventListener('received', onReceived);

    return () => {
      OneSignal.removeEventListener('ids', onIds);
      OneSignal.removeEventListener('received', onReceived);

    }
  }, [])

  React.useEffect(()=>{
    console.log(user.deviceId)
  })
  const onIds = device => {
    setDevices(user._id,device.userId)
    
  }
  
  function onReceived(notification) {
    console.log("Notification received: ", notification);
    setBadge(notification.payload?.badge)
  }

  return(
    <ImageBackground 
        style={{width: '100%', height: '100%'}}
        source={background}
    >
      <CustomHeader
    navigation={navigation}        title={'Profile'}
      />
      <ScrollView>
        <View style={styles.detailContainer}>
          <View style={styles.spacer}/>
          {user&&
          <>
          <AvatarLarge
              source={pictureDisplay(user.picture)}
            />
            <View style={styles.detailPane}>
              <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.profileSubtext}>{user.gender?'Male':'Female'} |  {pets&&pets.length} pet(s)</Text>
              <Text style={styles.purpleText}>Phone Number</Text>
              <Text style={styles.stats}>{user.contact}</Text>
              <Text style={styles.purpleText}>Email</Text>
              <Text style={styles.stats}>{user.email}</Text>
              <Text style={styles.purpleText}>Address</Text>
              <Text style={styles.stats}>{user.address}</Text>
            </View>
            </>
          }

          <CustomTabView
            routes={routes}
            view={index}
            setIndex={setIndex}
            tabColor="#B447D6"
            activatedColor="#FD6C59"
            color="#FFFFFF"
          />
         
        </View>
        
       
      </ScrollView>
    </ImageBackground>

  );
};


function mapState(state) {
  const { user, pets } = state.user;
  return { user, pets };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
  getPets: userActions.getPets,
  setBadge: messageActions.setBadge,
  setDevices: userActions.setDevices
};



export default connect(mapState,actionCreators)(ProfileHuman);
