import setWith from 'lodash/setWith';
import clone from 'lodash/clone';
import actions from './actions';

const initialState = {
  error: null,
};

export default (state = initialState, action) => {
  const {type, error} = action;

  switch (type) {
    case actions.constants.API_ERROR:
      return setWith(clone(state), 'error', error, clone);
    default:
      return state;
  }
};
