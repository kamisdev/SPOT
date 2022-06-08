import React from 'react'
import {View,Image,TouchableOpacity} from 'react-native';
import { vw,vh } from 'react-native-expo-viewport-units';
import styles from './ImageGallery.scss';
import { connect } from 'react-redux';
import {userActions} from '../../../../redux/actions';
import Lightbox from 'react-native-lightbox'
import pictureDisplay from '../../helpers/pictureDisplay'


function ImageGallery(props){
    const {user, owner, userPetsPhotos, getPetsPhotos,ownerPetsPhotos,getPets} = props;
    React.useEffect(()=>{
        if (user) {
            getPetsPhotos({user})
        } else if (owner){
            getPetsPhotos({owner})
            getPets({owner})
        }
    },[])

    React.useEffect(()=>{
    })

    return(
        <View style={styles.container}>
            {user&&userPetsPhotos&&userPetsPhotos.map((i,index)=>{
                return(
                    <TouchableOpacity key={index} style={{...styles.imagePlaceholder,height:vw(27),width:vw(27)}}>
                        <Lightbox activeProps={{style:{flex:1,maxHeight:vh(50)}}}>
                            <Image 
                                source={pictureDisplay(i.picture)}    
                                style={{height:vw(27),width:vw(27)}}
                            />
                        </Lightbox>
                    </TouchableOpacity>
                );
            })}
            {owner&&ownerPetsPhotos&&ownerPetsPhotos.map((i,index)=>{
                return(
                    <TouchableOpacity key={index} style={{...styles.imagePlaceholder,height:vw(28),width:vw(28),marginRight:vw(2)}}>
                        <Lightbox activeProps={{style:{flex:1,maxHeight:vh(50)}}}>
                            <Image 
                                source={pictureDisplay(i.picture)}
                                style={{height:vw(28),width:vw(28)}}
                            />
                        </Lightbox>
                    </TouchableOpacity>
                );
            })}
        </View>
  
    );
};


function mapState(state) {
    const { userPetsPhotos,ownerPetsPhotos } = state.user;
    return { userPetsPhotos,ownerPetsPhotos };
  }
  
  const actionCreators = {
    getPetsPhotos: userActions.getPetsPhotos,
    getPets: userActions.getPets
  };
  
  export default connect(mapState,actionCreators)(ImageGallery);
  