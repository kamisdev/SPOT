import {takeLatest, put, call, all, select} from 'redux-saga/effects';

import handler from '../handler/actions';
import actions from './actions';
import api from '../api';

const getUser = state => state.user;

function* register({body, image, onSuccess = () => {}}) {
  try {
    const route = '/user/register';
    yield call(api.post, route, body);
    yield put(actions.creators.getAuth(body.username, body.password));
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

function* getAuth({username, password}) {
  try {
    const route = '/user/login';
    const resp = yield call(api.post, route, {username, password});
    const json = resp.json();
    yield put(actions.creators.setAuth(json));
    yield getMyProfile();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.GET_AUTH,
        error: e,
      }),
    );
  }
}

function* getMyProfile() {
  try {
    const user = yield select(getUser);
    const route = '/user/me';
    const resp = yield call(api.get, route, api.authHeaders(user));
    const json = resp.json();
    yield put(actions.creators.setMyProfile(json));
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.GET_MY_PROFILE,
        error: e,
      }),
    );
  }
}

function* updateMyProfile({body, image, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/user/me/update';
    let bodyData = body;
    // if (image && image.length > 0) {
    //   const uploadRoute = '/user/uploadFile';
    //   const uploadResp = yield call(api.multiform, uploadRoute, image, {
    //     ...api.authHeaders(user),
    //     'Content-Type': 'multipart/form-data',
    //   });
    //   bodyData.picture = uploadResp.data;
    // }
    yield call(api.post, route, bodyData, api.authHeaders(user));
    yield getMyProfile();
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.UPDATE_MY_PROFILE,
        error: e,
      }),
    );
  }
}

function* changePassword({body, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/user/password/change';
    yield call(api.post, route, body, api.authHeaders(user));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.CHANGE_PASSWORD,
        error: e,
      }),
    );
  }
}

function* linkUserDevice({deviceId}) {
  try {
    const user = yield select(getUser);
    const route = '/user/device';
    yield call(api.post, route, {deviceId}, api.authHeaders(user));
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.LINK_USER_DEVICE,
        error: e,
      }),
    );
  }
}

function* socialLogin({userData, onSuccess}) {
  try {
    const route = '/user/login/social';
    const resp = yield call(api.post, route, userData);
    const json = resp.json();
    if (json.newUser) {
      onSuccess(json);
    } else {
      yield put(actions.creators.setAuth(json));
      yield getMyProfile();
    }
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.SOCIAL_LOGIN,
        error: e,
      }),
    );
  }
}

function* registerSocialUser({body}) {
  try {
    const route = '/user/social/register';
    const resp = yield call(api.post, route, body);
    const json = resp.json();
    yield put(actions.creators.setAuth(json));
    yield getMyProfile();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.REGISTER_SOCIAL_USER,
        error: e,
      }),
    );
  }
}

function* getUserPhotos({ownerId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = `/gallery/${ownerId}`;
    const resp = yield call(api.get, route, api.authHeaders(user));
    const json = resp.json();
    yield put(actions.creators.setUserPhotos(json, ownerId));
    onSuccess(json);
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.GET_USER_PHOTOS,
        error: e,
      }),
    );
  }
}

function* addUserPhotos({photos, ownerId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/gallery/add';
    yield call(api.post, route, {photos}, api.authHeaders(user));
    yield put(actions.creators.getUserPhotos(ownerId));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.ADD_USER_PHOTO,
        error: e,
      }),
    );
  }
}

function* deleteUserPhoto({photoId, ownerId, onSuccess = () => {}}) {
  try {
    const user = yield select(getUser);
    const route = '/gallery/delete';
    yield call(api.post, route, {photoId}, api.authHeaders(user));
    yield put(actions.creators.getUserPhotos(ownerId));
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.DELETE_USER_PHOTO,
        error: e,
      }),
    );
  }
}

function* fpSendVerification({email, onSuccess = () => {}}) {
  try {
    const route = '/user/forgotPassword/sendVerification';
    yield call(api.post, route, {email});
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.FP_SEND_VERIFICATION,
        error: e,
      }),
    );
  }
}

function* fpVerifyCode({email, code, onSuccess = () => {}}) {
  try {
    const route = '/user/forgotPassword/verifyCode';
    const resp = yield call(api.post, route, {email, code});
    const json = resp.json();
    onSuccess(json);
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.FP_VERIFY_CODE,
        error: e,
      }),
    );
  }
}

function* fpResetPassword({
  email,
  code,
  newPassword,
  confirmPassword,
  onSuccess = () => {},
}) {
  try {
    const route = '/user/forgotPassword/resetPassword';
    yield call(api.post, route, {email, code, newPassword, confirmPassword});
    onSuccess();
  } catch (e) {
    yield put(
      handler.creators.apiError({
        type: 'request',
        action: actions.constants.FP_RESET_PASSWORD,
        error: e,
      }),
    );
  }
}

export default function* saga() {
  yield all([
    takeLatest(actions.constants.REGISTER, register),
    takeLatest(actions.constants.GET_AUTH, getAuth),
    takeLatest(actions.constants.GET_MY_PROFILE, getMyProfile),
    takeLatest(actions.constants.UPDATE_MY_PROFILE, updateMyProfile),
    takeLatest(actions.constants.CHANGE_PASSWORD, changePassword),
    takeLatest(actions.constants.LINK_USER_DEVICE, linkUserDevice),
    takeLatest(actions.constants.SOCIAL_LOGIN, socialLogin),
    takeLatest(actions.constants.REGISTER_SOCIAL_USER, registerSocialUser),
    takeLatest(actions.constants.GET_USER_PHOTOS, getUserPhotos),
    takeLatest(actions.constants.ADD_USER_PHOTOS, addUserPhotos),
    takeLatest(actions.constants.DELETE_USER_PHOTO, deleteUserPhoto),
    takeLatest(actions.constants.FP_SEND_VERIFICATION, fpSendVerification),
    takeLatest(actions.constants.FP_VERIFY_CODE, fpVerifyCode),
    takeLatest(actions.constants.FP_RESET_PASSWORD, fpResetPassword),
  ]);
}
