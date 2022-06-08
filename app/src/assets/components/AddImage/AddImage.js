import React from 'react';
import {View,Image,TouchableOpacity, ActivityIndicator} from 'react-native';
import styles from './AddImage.scss';
import { vw,vh } from 'react-native-expo-viewport-units';
import {Icon} from 'react-native-elements';
import imageIcon from '../../img/imageIcon.png'
import {petActions} from '../../../../redux/actions';
import { connect } from 'react-redux';
import pictureDisplay from '../../helpers/pictureDisplay'
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';


function AddImage(props){
    const { getPetPhotos, petPhotos,pet, ownerPetPhotos, owner,getOwnerPetPhotos,uploadPetPhoto,user,uploadingPetPhoto,uploadedPetPhoto} = props;

    React.useEffect(()=>{
        if (owner){

            getOwnerPetPhotos(pet._id)
        } else {
            getPetPhotos(pet._id)
            console.log('here')

        }
        
    },[])

    React.useEffect(()=>{
        getPetPhotos(pet._id)
        
    },[uploadedPetPhoto])

    React.useEffect(()=>{
        console.log(petPhotos)        
    },)
   
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

    const _openPicker = () =>{
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

        ImagePicker.launchImageLibrary(options, (response) => {
        
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            uploadPetPhoto(createFormData(response),pet._id,user._id);
          }
        });
      };

    return(
        <View style={{backgroundColor:'white'}}>
            <View style={{...styles.container,...props.style}}>
                {!owner&&
                <TouchableOpacity
                    disabled={uploadingPetPhoto}
                    style={{...styles.addImageButton,height:vw(27),width:vw(27)}}
                    onPress={()=>_openPicker()}
                >
                    {uploadingPetPhoto?
                        <ActivityIndicator
                            size={80}
                            color='#ffffff'
                        />
                        :
                        <Icon
                            name='plus' 
                            type='feather'
                            color='#ffffff'
                            size={40}
                        />
                    }
                </TouchableOpacity>
                }
                {!owner&&(petPhotos)&&petPhotos.map((photo,index)=>
                    <TouchableOpacity key={index} style={{...styles.imagePlaceholder,height:vw(27),width:vw(27)}}>
                        <Lightbox activeProps={{style:{flex:1,maxHeight:vh(50)}}}>
                            <Image 
                                key={photo._id}
                                style={{height:vw(28),width:vw(28)}}
                                source={pictureDisplay(photo.picture)}
                                resizeMode={'cover'}
                            />
                        </Lightbox>
                    </TouchableOpacity>
                )
                }
                {owner&&ownerPetPhotos.map((photo,index)=>
                    <TouchableOpacity key={index} style={{...styles.imagePlaceholder,height:vw(27),width:vw(27)}}>
                        <Lightbox activeProps={{style:{flex:1,maxHeight:vh(50)}}}>                        
                            <Image 
                                key={photo._id}
                                style={{height:vw(28),width:vw(28)}}
                                source={pictureDisplay(photo.picture)}
                                resizeMode={'cover'}
                            />
                        </Lightbox>
                    </TouchableOpacity>
                )
                }
                {!owner&&(petPhotos)&&petPhotos.length===0&&
                    <Lightbox activeProps={{style:{flex:1,maxHeight:vh(70)}}}>
                        <View style={{...styles.imagePlaceholder,height:vw(27),width:vw(27)}}>
                            <Image 
                                source={imageIcon}
                                style={styles.imageIcon}
                                resizeMode={'contain'}
                            />
                        </View>
                    </Lightbox>
                }

                
            </View>
        </View>
    );
};



function mapState(state) {
    const { user } = state.user;
    const { petPhotos, ownerPetPhotos,uploadingPetPhoto,uploadedPetPhoto } = state.pet;
    return { petPhotos,ownerPetPhotos,user,uploadingPetPhoto,uploadedPetPhoto };
  }
  
  const actionCreators = {
    getPetPhotos: petActions.getPetPhotos,
    getOwnerPetPhotos: petActions.getOwnerPetPhotos,
    uploadPetPhoto: petActions.uploadPetPhoto,

  
  };
  
  
  
  export default connect(mapState,actionCreators)(AddImage);
  