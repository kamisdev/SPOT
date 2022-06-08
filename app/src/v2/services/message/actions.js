const GET_MESSAGES = 'GET_MESSAGES';
const SET_MESSAGES = 'SET_MESSAGES';
const ADD_SENDING_MESSAGE = 'ADD_SENDING_MESSAGE';

const SEND_MESSAGE = 'SEND_MESSAGE';
const SEEN_MESSAGE = 'SEEN_MESSAGE';
const DELETE_CONVO = 'DELETE_CONVO';

const getMessages = onSuccess => ({
  type: GET_MESSAGES,
  onSuccess,
});
const setMessages = messages => ({
  type: SET_MESSAGES,
  messages,
});
const addSendingMessage = (receiver, message) => ({
  type: ADD_SENDING_MESSAGE,
  receiver,
  message,
});

const sendMessage = (receiverId, message, onSuccess) => ({
  type: SEND_MESSAGE,
  receiverId,
  message,
  onSuccess,
});
const seenMessage = toSeenMessages => ({
  type: SEEN_MESSAGE,
  toSeenMessages,
});
const deleteConvo = (userId, onSuccess) => ({
  type: DELETE_CONVO,
  userId,
  onSuccess,
});

export default {
  constants: {
    GET_MESSAGES,
    SET_MESSAGES,
    ADD_SENDING_MESSAGE,

    SEND_MESSAGE,
    SEEN_MESSAGE,
    DELETE_CONVO,
  },
  creators: {
    getMessages,
    setMessages,
    addSendingMessage,

    sendMessage,
    seenMessage,
    deleteConvo,
  },
};
