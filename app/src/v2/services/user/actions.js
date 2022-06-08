const LOGOUT = 'LOGOUT';
const SET_NETINFO = 'SET_NETINFO';

const REGISTER = 'REGISTER';
const GET_AUTH = 'GET_AUTH';
const SET_AUTH = 'SET_AUTH';
const GET_MY_PROFILE = 'GET_MY_PROFILE';
const SET_MY_PROFILE = 'SET_MY_PROFILE';
const UPDATE_MY_PROFILE = 'UPDATE_MY_PROFILE';
const CHANGE_PASSWORD = 'CHANGE_PASSWORD';

const LINK_USER_DEVICE = 'LINK_USER_DEVICE';

const SOCIAL_LOGIN = 'SOCIAL_LOGIN';
const REGISTER_SOCIAL_USER = 'REGISTER_SOCIAL_USER';

const GET_USER_PHOTOS = 'GET_USER_PHOTOS';
const SET_USER_PHOTOS = 'SET_USER_PHOTOS';
const ADD_USER_PHOTOS = 'ADD_USER_PHOTO';
const DELETE_USER_PHOTO = 'DELETE_USER_PHOTO';

// Forgot Password
const FP_SEND_VERIFICATION = 'FP_SEND_VERIFICATION';
const FP_VERIFY_CODE = 'FP_VERIFY_CODE';
const FP_RESET_PASSWORD = 'FP_RESET_PASSWORD';

const logout = () => ({
  type: LOGOUT,
});
const setNetinfo = netInfo => ({
  type: SET_NETINFO,
  netInfo,
});

const register = (body, image, onSuccess) => ({
  type: REGISTER,
  body,
  image,
  onSuccess,
});

const getAuth = (username, password) => ({
  type: GET_AUTH,
  username,
  password,
});
const setAuth = auth => ({
  type: SET_AUTH,
  auth,
});
const getMyProfile = () => ({
  type: GET_MY_PROFILE,
});
const setMyProfile = me => ({
  type: SET_MY_PROFILE,
  me,
});
const updateMyProfile = (body, image, onSuccess) => ({
  type: UPDATE_MY_PROFILE,
  body,
  image,
  onSuccess,
});
const changePassword = (body, onSuccess) => ({
  type: CHANGE_PASSWORD,
  body,
  onSuccess,
});

const linkUserDevice = deviceId => ({
  type: LINK_USER_DEVICE,
  deviceId,
});

const socialLogin = (userData, onSuccess) => ({
  type: SOCIAL_LOGIN,
  userData,
  onSuccess,
});
const registerSocialUser = body => ({
  type: REGISTER_SOCIAL_USER,
  body,
});

const getUserPhotos = (ownerId, onSuccess) => ({
  type: GET_USER_PHOTOS,
  ownerId,
  onSuccess,
});
const setUserPhotos = (photos, userId) => ({
  type: SET_USER_PHOTOS,
  photos,
  userId,
});
const addUserPhotos = (photos, ownerId, onSuccess) => ({
  type: ADD_USER_PHOTOS,
  photos,
  ownerId,
  onSuccess,
});
const deleteUserPhoto = (photoId, ownerId, onSuccess) => ({
  type: DELETE_USER_PHOTO,
  photoId,
  ownerId,
  onSuccess,
});

const fpSendVerification = (email, onSuccess) => ({
  type: FP_SEND_VERIFICATION,
  email,
  onSuccess,
});
const fpVerifyCode = (email, code, onSuccess) => ({
  type: FP_VERIFY_CODE,
  email,
  code,
  onSuccess,
});
const fpResetPassword = (
  email,
  code,
  newPassword,
  confirmPassword,
  onSuccess,
) => ({
  type: FP_RESET_PASSWORD,
  email,
  code,
  newPassword,
  confirmPassword,
  onSuccess,
});

export default {
  constants: {
    LOGOUT,
    SET_NETINFO,

    REGISTER,
    GET_AUTH,
    SET_AUTH,
    GET_MY_PROFILE,
    SET_MY_PROFILE,
    UPDATE_MY_PROFILE,
    CHANGE_PASSWORD,

    LINK_USER_DEVICE,

    SOCIAL_LOGIN,
    REGISTER_SOCIAL_USER,

    GET_USER_PHOTOS,
    SET_USER_PHOTOS,
    ADD_USER_PHOTOS,
    DELETE_USER_PHOTO,

    FP_SEND_VERIFICATION,
    FP_VERIFY_CODE,
    FP_RESET_PASSWORD,
  },
  creators: {
    logout,
    setNetinfo,

    register,
    getAuth,
    setAuth,
    getMyProfile,
    setMyProfile,
    updateMyProfile,
    changePassword,

    linkUserDevice,

    socialLogin,
    registerSocialUser,

    getUserPhotos,
    setUserPhotos,
    addUserPhotos,
    deleteUserPhoto,

    fpSendVerification,
    fpVerifyCode,
    fpResetPassword,
  },
};
