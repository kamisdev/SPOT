import setWith from 'lodash/setWith';
import clone from 'lodash/clone';

import actions from './actions';

const initialState = {
  messages: null,
};

export default (state = initialState, action) => {
  const {type, messages, receiver, message} = action;

  switch (type) {
    case actions.constants.SET_MESSAGES:
      return setWith(clone(state), 'messages', messages, clone);
    case actions.constants.ADD_SENDING_MESSAGE:
      return {
        ...state,
        messages: [
          {
            _id: `${Math.random()}`,
            receiver,
            message,
            receiverId: receiver._id,
            isSending: true,
            seenAt: new Date(),
          },
          ...state.messages,
        ],
      };
    default:
      return state;
  }
};
