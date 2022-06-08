import axios from "axios";
import {petConstants} from '../constants'
import { ENDPOINT } from 'react-native-dotenv';
import authHead from "../helpers/authHead";

export const petActions = {
    updatePet,
    getPetPhotos,
    getOwnerPetPhotos,
    uploadPetPhoto
};

function updatePet(id,data) {
    return (dispatch,getState) => {
        dispatch(request());
        axios.post(ENDPOINT+'/pet/update/'+id,
        {...data}, 
        authHead(getState))
        .then((result)=>{
            console.log(result)
            dispatch(success());
        }).catch(err=>{
            dispatch(failure(err));
        });
    };

    function request() { return { type: petConstants.UPDATE_PET_REQUEST } }
    function success() { return { type: petConstants.UPDATE_PET_SUCCESS } }
    function failure(error) { return { type: petConstants.UPDATE_PET_FAILURE, error } }
}

function getPetPhotos(petId) {
    console.log('get pet photos',petId)
    return (dispatch,getState) => {
        dispatch(request());
        axios.get(ENDPOINT+'/photo/p/'+petId,
        authHead(getState))
        .then((result)=>{
            console.log(ENDPOINT+'/photo/p/'+petId,result)
            dispatch(success(result.data));
        }).catch(err=>{
            console.log(err);
            dispatch(failure(err));
        });
    };

    function request() { return { type: petConstants.PET_PHOTO_REQUEST } }
    function success(photos) { return { type: petConstants.PET_PHOTO_SUCCESS,photos } }
    function failure(error) { return { type: petConstants.PET_PHOTO_FAILURE, error } }
}

function getOwnerPetPhotos(petId) {
    return (dispatch,getState) => {
        dispatch(request());
        axios.get(ENDPOINT+'/photo/p/'+petId,
        authHead(getState))
        .then((result)=>{
            dispatch(success(result.data));
        }).catch(err=>{
            dispatch(failure(err));
        });
    };

    function request() { return { type: petConstants.OWNER_PET_PHOTO_REQUEST } }
    function success(photos) { return { type: petConstants.OWNER_PET_PHOTO_SUCCESS,photos } }
    function failure(error) { return { type: petConstants.OWNER_PET_PHOTO_FAILURE, error } }
}

function uploadPetPhoto(data,petId,userId) {
    return (dispatch,getState) => {
        dispatch(request());

        axios.post(ENDPOINT+'/user/uploadfile', data)
        .then((result)=>{
            const picture = result.data.key;
            axios.post(ENDPOINT + '/photo/upload/', 
                {
                    petId,
                    userId,
                    picture
                },
                authHead(getState))
                .then((result)=>{
                    dispatch(success(result.data));
                }).catch(err=>{
                    dispatch(failure(err));
                });
        })
        .catch(err=>{
            dispatch(failure(err));
        });

        
    };

    function request() { return { type: petConstants.UPLOAD_PET_PHOTO_REQUEST } }
    function success() { return { type: petConstants.UPLOAD_PET_PHOTO_SUCCESS } }
    function failure(error) { return { type: petConstants.UPLOAD_PET_PHOTO_FAILURE, error } }
}
