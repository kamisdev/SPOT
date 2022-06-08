import {takeLatest, put, call, all, select} from 'redux-saga/effects';

import handler from '../handler/actions';
import actions from './actions';
import api from '../api';

const getUser = state => state.user;

function* getNearbyOwners({body, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/location/users/nearby';
    const resp = yield call(api.post, route, body, api.authHeaders(user));
    const json = resp.json();
    yield put(actions.creators.setNearbyOwners(json));
    onSuccess(json);
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.GET_NEARBY_OWNERS,
        error: e,
      }),
    );
  }
}

export default function* saga() {
  yield all([takeLatest(actions.constants.GET_NEARBY_OWNERS, getNearbyOwners)]);
}
