import setWith from 'lodash/setWith';
import clone from 'lodash/clone';

import actions from './actions';

const initialState = {
  userPets: {},
  petPhotos: {},
};

export default (state = initialState, action) => {
  const {type, pets, userId, photos, petId} = action;

  switch (type) {
    case actions.constants.SET_USER_PETS:
      return setWith(clone(state), `userPets[${userId}]`, pets, clone);
    case actions.constants.SET_PET_PHOTOS:
      return setWith(clone(state), `petPhotos[${petId}]`, photos, clone);
    default:
      return state;
  }
};
