import FetchBlob from 'rn-fetch-blob';
//SERVER ENDPOINT = http://http://104.156.254.147:3000

// const BASE_URL = 'http://192.168.0.24:3000';
const BASE_URL = 'https://api.single-pet-owners.com';
const GOOGLE_MAPS_API_KEY = 'AIzaSyC_WYqg5VY3UKnRA4gUgJRYCF3yIRmSiCk';
const ONE_SIGNAL_APP_ID = '1cacaf0f-f1ca-4707-8955-f44a862b8ef0';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const authHeaders = user => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${user.auth.token}`,
  // 'x-access-token': user.auth.token,
});

const url = route => `${BASE_URL}${route}`;

const checkForError = async resp => {
  const info = resp.info();

  if (info.status >= 400) {
    console.log('error', resp.data);
    let json;
    const textError = resp.data;
    try {
      json = await resp.json();
    } catch (e) {}

    let message;

    if (json && json.message) {
      message = json.message;
    } else if (json && json.error) {
      message = json.error;
    } else if (textError) {
      message = textError;
    } else {
      message = `Request fail with status code ${info.status}`;
    }

    throw {
      status: info.status,
      message,
    };
  }
};

const get = async (route, headers = DEFAULT_HEADERS) => {
  const resp = await FetchBlob.fetch('GET', url(route), headers);
  await checkForError(resp);
  return resp;
};

const post = async (route, body, headers = DEFAULT_HEADERS) => {
  const raw = body ? JSON.stringify(body) : null;
  const resp = await FetchBlob.fetch('POST', url(route), headers, raw);
  await checkForError(resp);
  return resp;
};

const patch = async (route, body, headers = DEFAULT_HEADERS) => {
  const raw = body ? JSON.stringify(body) : null;
  const resp = await FetchBlob.fetch('PATCH', url(route), headers, raw);
  await checkForError(resp);
  return resp;
};

const del = async (route, body, headers = DEFAULT_HEADERS) => {
  const raw = body ? JSON.stringify(body) : null;
  const resp = await FetchBlob.fetch('DELETE', url(route), headers, raw);
  await checkForError(resp);
  return resp;
};

const multiform = async (
  route,
  body,
  headers = {...DEFAULT_HEADERS, 'Content-Type': 'multipart/form-data'},
) => {
  const resp = await FetchBlob.fetch('POST', url(route), headers, body);
  await checkForError(resp);
  return resp;
};

export default {
  BASE_URL,
  GOOGLE_MAPS_API_KEY,
  ONE_SIGNAL_APP_ID,
  DEFAULT_HEADERS,
  authHeaders,
  checkForError,
  get,
  post,
  multiform,
  del,
  patch,
};
