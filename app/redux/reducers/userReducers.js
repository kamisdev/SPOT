import {userConstants} from "../constants";
const INITIAL_STATE = {
};

export default function user(state = INITIAL_STATE, action) {
    switch (action.type) {
      case userConstants.setInit:
        return { 
          user: action.user,
          loggedIn: action.loggedIn,
          fetchingPet: false,
          pets:[]
        };
      case userConstants.LOGIN_REQUEST:
        return {
          loggingIn: true,
          user: action.user
        };
      case userConstants.LOGIN_SUCCESS:
        return {
          loggedIn: true,
          user: action.user
        };
      case userConstants.LOGIN_FAILURE:
        return {
            loggingIn: false,
        };
      case userConstants.LOGOUT:
        return {
          user: undefined,
          loggedIn: false,
        };
        
      case userConstants.SOCIAL_LOGIN_SUCCESS:
        return {
          loggedIn: true,
          user: action.user
        };

      case userConstants.USER_PETS_REQUEST:
        return {
          ...state,
          pets:[],
          fetchingPet: true,
        };
      case userConstants.USER_PETS_SUCCESS:
        return {
          ...state,
          pets: action.pets,
          fetchingPet: false,
        };
      case userConstants.USER_PETS_FAILURE:
        return {
          ...state,
          pets: [],
          fetchingPet: false,
        };
        
      case userConstants.OWNER_PETS_REQUEST:
        return {
          ...state,
          ownerPets: [],
        };
      case userConstants.OWNER_PETS_SUCCESS:
        return {
          ...state,
          ownerPets: action.pets,
        };
      case userConstants.OWNER_PETS_FAILURE:
        return {
          ...state,
          ownerPets: [],
        }; 
          
      case userConstants.USER_PETS_PHOTO_REQUEST:
          return {
              ...state,
              userPetsPhotos: []
          };
      case userConstants.USER_PETS_PHOTO_SUCCESS:
          return {
              ...state,
              userPetsPhotos: action.photos
          };
      case userConstants.USER_PETS_PHOTO_FAILURE:
          return {
              ...state,
              userPetsPhotos: []
          };
      case userConstants.OWNER_PETS_PHOTO_REQUEST:
          return {
              ...state,
              ownerPetsPhotos: []
          };
      case userConstants.OWNER_PETS_PHOTO_SUCCESS:
          return {
              ...state,
              ownerPetsPhotos: action.photos
          };
      case userConstants.OWNER_PETS_PHOTO_FAILURE:
          return {
              ...state,
              ownerPetsPhotos: []
          };              
      case userConstants.OWNER_REQUEST:
          return {
              ...state,
              owner: undefined
          };
      case userConstants.OWNER_SUCCESS:
          return {
              ...state,
              owner: action.owner
          };
      case userConstants.OWNER_FAILURE:
          return {
              ...state,
              owner: undefined

          };    
      case userConstants.SET_DEVICES:
          return {
              ...state,
              user: {
                ...state.user,
                deviceId: action.deviceId
              }
          };              
      default:
        return state
    }
  }


