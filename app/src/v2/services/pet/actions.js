const GET_USER_PETS = 'GET_USER_PETS';
const SET_USER_PETS = 'SET_USER_PETS';

const ADD_PET = 'ADD_PET';
const DELETE_PET = 'DELETE_PET';
const UPDATE_PET = 'UPDATE_PET';

const GET_PET_PHOTOS = 'GET_PET_PHOTOS';
const SET_PET_PHOTOS = 'SET_PET_PHOTOS';
const ADD_PET_PHOTOS = 'ADD_PET_PHOTOS';
const DELETE_PET_PHOTO = 'DELETE_PET_PHOTO';

const getUserPets = (userId, onSuccess) => ({
  type: GET_USER_PETS,
  userId,
  onSuccess,
});
const setUserPets = (pets, userId) => ({
  type: SET_USER_PETS,
  pets,
  userId,
});

const addPet = (petInfo, onSuccess) => ({
  type: ADD_PET,
  petInfo,
  onSuccess,
});
const deletePet = (petId, onSuccess) => ({
  type: DELETE_PET,
  petId,
  onSuccess,
});
const updatePet = (petId, petInfo, onSuccess) => ({
  type: UPDATE_PET,
  petId,
  petInfo,
  onSuccess,
});

const getPetPhotos = (ownerId, onSuccess) => ({
  type: GET_PET_PHOTOS,
  ownerId,
  onSuccess,
});
const setPetPhotos = (photos, petId) => ({
  type: SET_PET_PHOTOS,
  photos,
  petId,
});
const addPetPhotos = (photos, ownerId, onSuccess) => ({
  type: ADD_PET_PHOTOS,
  photos,
  ownerId,
  onSuccess,
});
const deletePetPhoto = (photoId, ownerId, onSuccess) => ({
  type: DELETE_PET_PHOTO,
  photoId,
  ownerId,
  onSuccess,
});

export default {
  constants: {
    GET_USER_PETS,
    SET_USER_PETS,

    ADD_PET,
    DELETE_PET,
    UPDATE_PET,

    GET_PET_PHOTOS,
    SET_PET_PHOTOS,
    ADD_PET_PHOTOS,
    DELETE_PET_PHOTO,
  },
  creators: {
    getUserPets,
    setUserPets,

    addPet,
    deletePet,
    updatePet,

    getPetPhotos,
    setPetPhotos,
    addPetPhotos,
    deletePetPhoto,
  },
};
