import React from 'react'
import {AsyncStorage, ImageBackground,View,ScrollView,Text,SafeAreaView} from 'react-native';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import {userActions} from '../../../redux/actions';
import pictureDisplay from '../../assets/helpers/pictureDisplay'
import { Button } from 'react-native-elements';


import background from  '../../assets/img/RegisterBackground.png';
import avatar from '../../assets/img/sharmaine.png';
import puppy from '../../assets/img/puppy.png'
import styles from './ProfileOwner.scss';

import CustomHeader from '../../assets/components/Header/Header.js';
import AvatarLarge from '../../assets/components/AvatarLarge/AvatarLarge.js';
import CustomTabView from '../../assets/components/CustomTabView/CustomTabView.js';
import ImageGallery from '../../assets/components/ImageGallery/ImageGallery.js';
import RoundedButtonOutline from '../../assets/components/RoundedButtonOutline/RoundedButtonOutline.js';
import OwnerPets from '../../assets/components/OwnerPets/OwnerPets';

function ProfileOwner({navigation,ownerPets,owner}){
  
  const [index, setIndex] = React.useState(0);
  const [ownerProfile,setOwnerProfile] = React.useState()
  const [routes] = React.useState([
    { key: 0, title: 'Gallery', component:()=><ImageGallery /> },
    { key: 1, title: 'Pet', transparent:true, component: ()=><OwnerPets navigation={navigation}/>},
  ]);
  const time = new Date()
  const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
  const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(time)

   React.useEffect(()=>{
     setOwnerProfile(owner);
   },[owner]);

  return(
    <ImageBackground 
        style={{width: '100%', height: '100%'}}
        source={background}
    >
      <CustomHeader
    navigation={navigation}        title={'Profile'}
        back
        onPress={()=>{navigation.navigate('Find Owners',{screen:'CompatibleOwners'})}}
      />
      <ScrollView>
        <View style={styles.detailContainer}>
          <View style={styles.spacer}/>
          {(owner)&&
          <>
          <AvatarLarge
              source={pictureDisplay(owner.picture)}
            />
            
            <View style={styles.detailPane}>
              <Text style={styles.profileName}>{owner.firstName} {owner.lastName} </Text>
              <Button
                      onPress={
                        ()=>{navigation.navigate('Messages',
                            {screen:'Thread',
                              params:{
                                receiver: {
                                  id:owner._id,
                                  name:owner.firstName+' '+owner.lastName,
                                  picture:owner.picture,
                                  timestamp:`${da}/${mo}/${ye}`,
                                  facebookId:owner.facebookId
                                }
                              }
                            }
                       )}
                      }
                buttonStyle={styles.messageButton}
                titleStyle={styles.messageButtonText}
                icon={{
                  name: "message",
                  size: 20,
                  color: "white",
                  type: "entypo"
                }}
                title="Send Message"
            />
              <Text style={styles.profileSubtext}>{owner.gender?'Male':'Female'} |  {ownerPets&&ownerPets.length} pet(s)</Text>
              <Text style={styles.purpleText}>Phone Number</Text>
              <Text style={styles.stats}>{owner.contact}</Text>
              <Text style={styles.purpleText}>Email</Text>
              <Text style={styles.stats}>{owner.email}</Text>
              <Text style={styles.purpleText}>Address</Text>
              <Text style={styles.stats}>{owner.address}</Text>
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
  const { ownerPets, owner } = state.user;
  return { ownerPets, owner };
}


const actionCreators = {
  getOwner: userActions.getOwner,
};



export default connect(mapState,actionCreators)(ProfileOwner);
