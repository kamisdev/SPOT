import {Platform} from 'react-native';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

async function uploadImage(path, picture) {
  console.log('uploading image');
  await auth().signInWithEmailAndPassword('romel@gad.ai', 'GADAI2020@');
  const imgName = picture.fileName.replace('rn_image_picker_lib_temp_', '');
  const imgUri =
    Platform.OS === 'ios' ? picture.uri.replace('file://', '') : picture.uri;
  const imgKey = `${path}/${imgName}`;
  const imgRef = storage().ref(imgKey);
  const upload = await imgRef.putFile(imgUri);
  if (upload.error) {
    console.log('huehue', error);
  }
  const url = await imgRef.getDownloadURL();
  console.log('image uploaded');

  return {url, imgKey};
}

async function deleteFile(path) {
  await auth().signInWithEmailAndPassword('romel@gad.ai', 'GADAI2020@');
  const fileRef = storage().ref(path);
  const resp = await fileRef.delete();
}

const firebase = {uploadImage, deleteFile};
export default firebase;
