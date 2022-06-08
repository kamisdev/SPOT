import React from 'react';
import {SafeAreaView, ImageBackground, ScrollView,Text,RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import { ENDPOINT } from 'react-native-dotenv';
import pictureDisplay from '../../assets/helpers/pictureDisplay'
import Snackbar from 'react-native-snackbar';

import styles from './PetList.scss';
import background from  '../../assets/img/RegisterBackground.png';
import puppy from '../../assets/img/puppy.png'

import CustomHeader from '../../assets/components/Header/Header.js'
import Paper from '../../assets/components/Paper/Paper.js';
import PetListEntry from '../../assets/components/PetListEntry/PetListEntry.js'
import RoundedButton from '../../assets/components/RoundedButton/RoundedButton.js'
import {userActions} from '../../../redux/actions';

function PetList({navigation, pets, user, getPets, fetchingPet}) {
  const [refreshing,setRefreshing] = React.useState(false)
  React.useEffect(()=>{
    getPets({user});
    console.log(pets);
  },[])
  
  const editPet = (pet) => {
    navigation.navigate('RegisterPet',{pet})
  }

  const _deletePet = (pet) => {
    const petId = pet._id
    axios.delete(ENDPOINT + '/pet/' +petId, {
      headers: {
      'x-access-token': user.token
      }
    })
    .then(r=>{
      getPets({user})
    })
    .catch(err=>{
      Snackbar.show({
        text: err.toString(),
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    })
  }
  return (
    <ImageBackground 
        style={{width: '100%', height: '100%'}}
        source={background}
    >

      <CustomHeader
      navigation={navigation}          
      title={'Pet List'}
      />
        <ScrollView 
          refreshControl={<RefreshControl refreshing={false} onRefresh={()=>getPets({user})}/>}
          style={styles.scrollview}
          >
          {!fetchingPet&&pets&&pets.map((pet,index)=>{
            const now= new Date(Date.now()).getFullYear()
            const birthDate =new Date(Date.parse(pet.birthDate)).getFullYear();
            const age = now-birthDate
            return(
              <Paper 
                last={(index===pets.length-1)}
                onPress={()=>navigation.navigate('ProfilePet',{pet,user})}
                key={index}
              >
                <PetListEntry
                  avatar={pictureDisplay(pet.picture)}
                  name={pet.petName}
                  breed={pet.breed}
                  age={age}
                  options={true}
                  editPet={()=>editPet(pet)}
                  deletePet={()=>_deletePet(pet)}
                />
                {(index===pets.length-1)&&
                  <RoundedButton
                    title={'ADD MORE PET'}
                    color={'#FD6C59'}
                    style={styles.addButton}
                    onPress={()=>navigation.navigate('RegisterPet')}
                  />
                  }
              </Paper>
            )
          })
          }
         
          {!fetchingPet&&pets&&(pets.length===0)&&
            <Paper>
              <RoundedButton
                title={'ADD PET'}
                color={'#FD6C59'}
                style={styles.addButton}
                onPress={()=>navigation.navigate('RegisterPet')}
              />
            </Paper>
          }
          {fetchingPet&&
            <Paper>
              <Text>Fetching Pets...</Text>
            </Paper>
          }
            
        </ScrollView>
       {/* <SafeAreaView style={styles.buttonContainer}>
          <RoundedButtonOutline
            title={'BACK'}
            style={{marginBottom:10}}
          />
          <RoundedButton
            title={'NEXT'}
            color={'#FD6C59'}
            onPress={()=>navigation.navigate('ProfileHuman')}
          />
        </SafeAreaView>*/}
      
    </ImageBackground>
  );
}

function mapState(state) {
  const { user, pets , fetchingPet } = state.user;
  return { user, pets, fetchingPet };
}

const actionCreators = {
  getPets: userActions.getPets
};



export default connect(mapState,actionCreators)(PetList);
