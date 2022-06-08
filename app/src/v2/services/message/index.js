import {takeLatest, put, call, all, select} from 'redux-saga/effects';

import handler from '../handler/actions';
import actions from './actions';
import api from '../api';
import {filter} from 'lodash';

const getUser = state => state.user;

function filterMessages(messages) {
  const filtered = {};
  messages.forEach(msg => {
    if (msg.receiverId) {
      if (!filtered[msg.receiverId]) {
        filtered[msg.receiverId] = [];
      }
      filtered[msg.receiverId].push(msg);
    } else if (msg.senderId) {
      if (!filtered[msg.senderId]) {
        filtered[msg.senderId] = [];
      }
      filtered[msg.senderId].push(msg);
    }
  });

  return filtered;
}

function* getMessages({onSuccess = () => {}}) {
  try {
    console.log('get messages');
    const user = yield select(getUser);
    const route = '/message/messages';
    const resp = yield call(api.get, route, api.authHeaders(user));
    const json = resp.json();
    yield put(actions.creators.setMessages(json));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.GET_MESSAGES,
        error: e,
      }),
    );
  }
}

function* sendMessage({receiverId, message, onSuccess = () => {}}) {
  try {
    console.log('sending message');
    const user = yield select(getUser);
    const route = '/message';
    yield call(api.post, route, {receiverId, message}, api.authHeaders(user));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.SEND_MESSAGE,
        error: e,
      }),
    );
  }
}

function* seenMessage({toSeenMessages}) {
  try {
    const user = yield select(getUser);
    const route = '/message/seen';
    yield call(api.post, route, {toSeenMessages}, api.authHeaders(user));
    yield put(actions.creators.getMessages(() => {}));
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.SEND_MESSAGE,
        error: e,
      }),
    );
  }
}

function* deleteConvo({userId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/message/convo/delete';
    yield call(api.post, route, {userId}, api.authHeaders(user));
    yield put(actions.creators.getMessages(() => {}));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.DELETE_CONVO,
        error: e,
      }),
    );
  }
}

export default function* saga() {
  yield all([
    takeLatest(actions.constants.GET_MESSAGES, getMessages),
    takeLatest(actions.constants.SEND_MESSAGE, sendMessage),
    takeLatest(actions.constants.SEEN_MESSAGE, seenMessage),
    takeLatest(actions.constants.DELETE_CONVO, deleteConvo),
  ]);
}
