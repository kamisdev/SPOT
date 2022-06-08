import {takeLatest, put, call, all, select} from 'redux-saga/effects';

import handler from '../handler/actions';
import actions from './actions';
import api from '../api';

const getUser = state => state.user;

function* getUserPets({userId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = `/pet/ownedby/${userId}`;
    const resp = yield call(api.get, route, api.authHeaders(user));
    const json = resp.json();
    yield put(actions.creators.setUserPets(json, userId));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.REGISTER,
        error: e,
      }),
    );
  }
}

function* addPet({petInfo, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/pet/add';
    const resp = yield call(api.post, route, petInfo, api.authHeaders(user));
    const json = resp.json();
    yield put(actions.creators.getUserPets(user.me._id));
    onSuccess(json);
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.ADD_PET,
        error: e,
      }),
    );
  }
}

function* deletePet({petId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = `/pet/delete/${petId}`;
    yield call(api.del, route, null, api.authHeaders(user));
    yield put(actions.creators.getUserPets(user.me._id));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.DELETE_PET,
        error: e,
      }),
    );
  }
}

function* updatePet({petId, petInfo, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = `/pet/update/${petId}`;
    yield call(api.post, route, petInfo, api.authHeaders(user));
    yield put(actions.creators.getUserPets(user.me._id));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.UPDATE_PET,
        error: e,
      }),
    );
  }
}

function* getPetPhotos({ownerId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = `/gallery/${ownerId}`;
    const resp = yield call(api.get, route, api.authHeaders(user));
    const json = resp.json();
    yield put(actions.creators.setPetPhotos(json, ownerId));
    onSuccess(json);
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.GET_PET_PHOTOS,
        error: e,
      }),
    );
  }
}

function* addPetPhotos({photos, ownerId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/gallery/add';
    yield call(api.post, route, {photos}, api.authHeaders(user));
    yield put(actions.creators.getPetPhotos(ownerId));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.ADD_PET_PHOTOS,
        error: e,
      }),
    );
  }
}

function* deletePetPhoto({photoId, ownerId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/gallery/delete';
    yield call(api.post, route, {photoId}, api.authHeaders(user));
    yield put(actions.creators.getPetPhotos(ownerId));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.DELETE_PET_PHOTO,
        error: e,
      }),
    );
  }
}

export default function* saga() {
  yield all([
    takeLatest(actions.constants.GET_USER_PETS, getUserPets),
    takeLatest(actions.constants.ADD_PET, addPet),
    takeLatest(actions.constants.DELETE_PET, deletePet),
    takeLatest(actions.constants.UPDATE_PET, updatePet),

    takeLatest(actions.constants.GET_PET_PHOTOS, getPetPhotos),
    takeLatest(actions.constants.ADD_PET_PHOTOS, addPetPhotos),
    takeLatest(actions.constants.DELETE_PET_PHOTO, deletePetPhoto),
  ]);
}
