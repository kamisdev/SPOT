import React from 'react';
import {View,ScrollView,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

import styles from './MyPets.scss';
import puppy from '../../img/puppy.png'
import pictureDisplay from '../../helpers/pictureDisplay'
import {userActions} from '../../../../redux/actions'
import PetListEntry from '../../components/PetListEntry/PetListEntry.js';


function MyPets({user,navigation,pets,getPets}){
    
    
    return(
        <View style={{height:300,width:'100%'}}>
            <ScrollView style={{height:300,width:'100%'}}>
                {pets&&pets.map((pet,index)=>{
                    return(
                        <TouchableOpacity style={styles.container} key={index} onPress={()=>navigation.navigate('My Pet',{screen:'ProfilePet',params:{pet,user:user}})}>
                            <PetListEntry
                                key={index}
                                avatar={pictureDisplay(pet.picture)}
                                name={pet.petName}
                                breed={pet.breed}
                                age={pet.age}
                                buttons={false}
                            />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

        </View>
    );
};
function mapState(state) {
    const { pets, ownerPets,user,owner } = state.user;
    return { pets, ownerPets,user,owner };
  }


const actionCreators = {
    getPets: userActions.getPets
  };
  

  export default connect(mapState,actionCreators)(MyPets);
