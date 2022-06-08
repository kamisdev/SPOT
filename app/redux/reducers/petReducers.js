import {petConstants} from '../constants';

export default function pet(state = {
    updatingPet: false,
    petPhotos: [],
    ownerPetPhotos: []
}, action) {
    switch (action.type) {
        case petConstants.UPDATE_PET_REQUEST:
            return {
                ...state,
                updatingPet: true
            };
        case petConstants.UPDATE_PET_SUCCESS:
            return {
                ...state,
                updatedPet: true,
                updatingPet: false
            };
        case petConstants.UPDATE_PET_FAILURE:
            return {
                ...state,
                updatingPet: false
            };

        case petConstants.PET_PHOTO_REQUEST:
            return {
                ...state,
                petPhotos: [],
                uploadedPetPhoto:undefined,
            };
        case petConstants.PET_PHOTO_SUCCESS:
            return {
                ...state,
                petPhotos: action.photos,
                uploadedPetPhoto:undefined,

                
            };
        case petConstants.PET_PHOTO_FAILURE:
            return {
                ...state,
                petPhotos: [],
                uploadedPetPhoto:undefined,

                
            };    
        case petConstants.OWNER_PET_PHOTO_REQUEST:
            return {
                ...state,
                ownerPetPhotos: []
            };
        case petConstants.OWNER_PET_PHOTO_SUCCESS:
            return {
                ...state,
                ownerPetPhotos: action.photos
            };
        case petConstants.OWNER_PET_PHOTO_FAILURE:
            return {
                ...state,
                ownerPetPhotos: []
            };
            
        case petConstants.UPLOAD_PET_PHOTO_REQUEST:
            return {
                ...state,
                uploadingPetPhoto: true
            };
        case petConstants.UPLOAD_PET_PHOTO_SUCCESS:
            return {
                ...state,
                uploadingPetPhoto: false,
                uploadedPetPhoto:true,
            };
        case petConstants.UPLOAD_PET_PHOTO_FAILURE:
            return {
                ...state,
                uploadingPetPhoto: false
            };       
        default:
            return state
    }
}