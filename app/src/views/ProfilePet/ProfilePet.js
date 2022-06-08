import React from 'react'
import {ImageBackground,View,ScrollView,Text,Image} from 'react-native';
import {Button} from 'react-native-elements';
import { vw } from 'react-native-expo-viewport-units';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import pictureDisplay from '../../assets/helpers/pictureDisplay'


import background from  '../../assets/img/RegisterBackground.png';
import styles from './ProfilePet.scss';
import owner from '../../assets/img/raymond-colt.png';
import puppy from '../../assets/img/puppy.png';

import CustomHeader from '../../assets/components/Header/Header.js';
import AvatarLarge from '../../assets/components/AvatarLarge/AvatarLarge.js';
import CustomTabView from '../../assets/components/CustomTabView/CustomTabView.js';
import PawList from '../../assets/components/PawList/PawList.js';
import ImageGallery from '../../assets/components/ImageGallery/ImageGallery.js';
import OwnerStrip from '../../assets/components/OwnerStrip/OwnerStrip';
import AddImage from '../../assets/components/AddImage/AddImage';


export default function ProfilePet({navigation,route}){
  const {pet,user,owner} = route.params;
  const now= new Date(Date.now()).getFullYear()
  const birthDate =new Date(Date.parse(pet.birthDate)).getFullYear();
  const age = now-birthDate;
  React.useEffect(()=>{
    console.log(route);
    const b = pet.behaviour.split("\n");
    let c = []
    b.map(i=>{
      c.push({key:i})
    })
    setBehaviour(c);
    const d = pet.dislikes.split("\n");
    let e = []
    d.map(i=>{
      e.push({key:i})
    })
    setDislikes(e);
  },[])
  const [index, setIndex] = React.useState(0);
  const routes = [
    { key: 0, title: 'Behavior', component:()=><PawList list={behaviour}/> },
    { key: 1, title: 'Dislikes', component: ()=><PawList list={dislikes}/>},
    { key: 2, title: 'Gallery', component: ()=><AddImage style={styles.gallery} owner={owner} pet={pet}/>},
  ];
  const [behaviour,setBehaviour] = React.useState();
  const [dislikes,setDislikes] = React.useState();

  const [photos] = React.useState([
    {src:puppy},{src:puppy},{src:puppy},{src:puppy},{src:puppy},{src:puppy},
  ]);

  return(
    <ImageBackground 
    style={{width: '100%', height: '100%'}}
    source={background}
    >
      <CustomHeader
        navigation={navigation}        
        title={'Profile'}
        back
        onPress={()=>{!owner?navigation.navigate('My Pet',{screen:'PetList'}):navigation.navigate('CompatibleOwners')}}
      />
      <OwnerStrip
        userName={`${user.firstName} ${user.lastName}`}
        avatar={pictureDisplay(user.picture)}
        color="#FD6C59"
        textColor="#FFFFFF"
        subtext="owner"
        navigation={navigation}
        owner={owner}
        id={owner?owner._id:undefined}
      />
      <ScrollView>
        <View style={styles.blurContainer}>
          <ImageBackground
            style={styles.blurContainerImage}
            source={pictureDisplay(pet.picture)}
          >
            <AvatarLarge 
              source={pictureDisplay(pet.picture)}
            />
            <BlurView
              style={styles.blur}
              blurType="light"
              blurAmount={10}
            />
          </ImageBackground>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.profileName}>{pet.petName}</Text>
          <Text style={styles.profileSubtext}>{pet.breed} |  {age} year (s) old</Text>
        </View>
        <CustomTabView
            routes={routes}
            view={index}
            setIndex={setIndex}
            tabColor="#B447D6"
            activatedColor="#FD6C59"
            color="#FFFFFF"

          />
          <View style={{paddingBottom:80,backgroundColor:'#fff'}}/>
      </ScrollView>
  </ImageBackground>
  )
}