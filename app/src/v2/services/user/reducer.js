import setWith from 'lodash/setWith';
import clone from 'lodash/clone';

import actions from './actions';

const initialState = {
  auth: null,
  me: null,
  netInfo: null,
  userPhotos: {},
};

export default (state = initialState, action) => {
  const {type, auth, me, netInfo, photos, userId} = action;

  switch (type) {
    case actions.constants.LOGOUT:
      return initialState;
    case actions.constants.SET_AUTH:
      return setWith(clone(state), 'auth', auth, clone);
    case actions.constants.SET_MY_PROFILE:
      return setWith(clone(state), 'me', me, clone);
    case actions.constants.SET_NETINFO:
      return setWith(clone(state), 'netInfo', netInfo);
    case actions.constants.SET_USER_PHOTOS:
      return setWith(clone(state), `userPhotos[${userId}]`, photos, clone);
    default:
      return state;
  }
};
