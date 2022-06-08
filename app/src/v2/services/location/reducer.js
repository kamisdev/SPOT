import setWith from 'lodash/setWith';
import clone from 'lodash/clone';

import actions from './actions';

const initialState = {
  nearbyOwners: {},
};

export default (state = initialState, action) => {
  const {type, owners} = action;

  switch (type) {
    case actions.constants.SET_NEARBY_OWNERS:
      return setWith(clone(state), 'nearbyOwners', owners, clone);
    default:
      return state;
  }
};
