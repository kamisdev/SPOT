import React, {useEffect, useState} from 'react';
import storage from '@react-native-firebase/storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {human} from 'react-native-typography';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';
import {io} from 'socket.io-client';
import OneSignal from 'react-native-onesignal';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import VectorIcon from 'component/VectorIcon';
import LoadingOverlay from 'component/LoadingOverlay';
import ImageViewerHeader from 'component/ImageViewerHeader';
import GalleryPhoto from 'component/GalleryPhoto';

import ProfileContent from './component/ProfileContent';

import R from 'res/R';
import api from 'services/api';

const photoWidth = R.values.x / 3 - 6;
const photoHeight = 125;

export default function Profile({
  netInfo,
  navigation,
  route,
  error,
  me,
  userPets,
  userPhotos,
  //creators
  getMyProfile,
  getUserPets,
  getMessages,
  linkUserDevice,
  getUserPhotos,
  addUserPhotos,
  deleteUserPhoto,
}) {
  const [screenError, setScreenError] = useState(error);
  const [tab, setTab] = useState('gallery');
  const [addPhotoLoading, setAddPhotoLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [imageViewerData, setImageViewerData] = useState([]);

  useEffect(() => {
    SplashScreen.hide();
    console.log('prfile', me.image);

    let socket;
    if (netInfo.isInternetReachable) {
      getMyProfile();
      getUserPets(me._id, () => {});
      getMessages();
      getUserPhotos(me._id);
      socket = io(api.BASE_URL);
      socket.on('chat message', msg => {
        console.log('get message', msg);
        getMessages();
      });
    }

    initializeOneSignal();

    return () => {
      if (socket) {
        socket.disconnect;
      }
    };
  }, []);

  useEffect(() => {
    if (navigation.isFocused() && error && error !== screenError) {
      Alert.alert('Error', error.error.message);
      setScreenError(error);
    }
  }, [error]);

  useEffect(() => {
    let socket;
    if (netInfo.isInternetReachable) {
      getMyProfile();
      getUserPets(me._id, () => {});
      getMessages();
      const socket = io(api.BASE_URL);
      socket.on('chat message', msg => {
        console.log('get message', msg);
        getMessages();
      });
      initializeOneSignal();
    }

    return () => {
      if (socket) {
        socket.disconnect;
      }
    };
  }, [netInfo]);

  const initializeOneSignal = async () => {
    // ONESIGNAL INITIALIZATION
    OneSignal.setAppId(api.ONE_SIGNAL_APP_ID);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response', response);
    });

    // ONESIGNAL HANDLERS
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      // console.log(
      //   'OneSignal: Notification will show in foreground',
      //   notifReceivedEvent,
      // );
      let notif = notifReceivedEvent.getNotification();
      notifReceivedEvent.complete();
      console.log('notif received in foreground', notif);

      showMessage({
        message: notif.title,
        description: notif.body,
        backgroundColor: R.colors.white,
        onPress: () => {
          navigation.navigate('Message');
          hideMessage();
        },
      });
    });
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal notification opened: ', notification);
      navigation.navigate('Message');
    });
    OneSignal.disablePush(false);

    await OneSignal.getDeviceState();
    const deviceState = await OneSignal.getDeviceState();
    console.log('device: ', deviceState.userId);

    if (deviceState.userId && netInfo.isInternetReachable) {
      linkUserDevice(deviceState.userId);
    }
  };

  const onMenuPress = () => {
    navigation.navigate('SettingsNavigation');
  };

  const onPressEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const onPressAddPhoto = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    launchImageLibrary(R.values.imagePickerPhotoOptions, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setAddPhotoLoading(true);
        const photos = [];
        const path = `gallery/owner/${me._id}`;
        const imgUpload = await R.firebase.uploadImage(path, response);
        photos.push({
          ownerId: me._id,
          image: imgUpload.url,
          key: imgUpload.imgKey,
        });
        addUserPhotos(photos, me._id, () => {
          setAddPhotoLoading(false);
        });
      }
    });
  };

  const onPressDeletePhoto = i => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const photos = userPhotos[me._id];
    const selected = photos[i];
    // let newIndex = i - 1;
    const len = photos.length;
    Alert.alert('Delete photo', 'Are you sure you want to delete this photo?', [
      {text: 'CANCEL'},
      {
        text: 'DELETE',
        onPress: async () => {
          setLoadingText('Deleting photo...');
          // setImageViewerData(
          //   getImagesUri(photos.filter(i => i._id !== selected._id)),
          // );
          setShowLoadingOverlay(true);
          await R.firebase.deleteFile(selected.key);
          deleteUserPhoto(selected._id, me._id, async () => {
            if (i < len - 1) {
              if (i === 0) {
                setImageViewerIndex(0);
              } else {
                setImageViewerIndex(i - 1);
              }
            } else {
              if (len === 1) {
                setShowImageViewer(false);
              } else {
                setImageViewerIndex(i - 1);
              }
            }
            setImageViewerData(
              getImagesUri(photos.filter(i => i._id !== selected._id)),
            );
            setShowLoadingOverlay(false);
          });
        },
      },
    ]);
  };

  const onPressGalleryPhoto = index => {
    setImageViewerData(getImagesUri(userPhotos[me._id]));
    setImageViewerIndex(index);
    setShowImageViewer(true);
  };

  const getImagesUri = photos => {
    if (!photos || photos.length === 0) {
      return [];
    }

    const imgs = [];
    photos.forEach(photo => {
      imgs.push({uri: photo.image});
    });

    return imgs;
  };

  const renderGalleryItem = ({item, index}) => {
    if (item._id === 'add_btn') {
      return (
        <TouchableOpacity
          style={styles.addPhotoBtn}
          onPress={onPressAddPhoto}
          disabled={addPhotoLoading}>
          {addPhotoLoading ? (
            <ActivityIndicator size="large" color={R.colors.amethyst} />
          ) : (
            <>
              <VectorIcon
                font="Feather"
                name="plus"
                size={40}
                color={R.colors.amethyst}
              />
              <Text style={styles.addPhotoBtnText}>Add Photo</Text>
            </>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <GalleryPhoto
        data={item}
        width={photoWidth}
        height={photoHeight}
        onPress={() => onPressGalleryPhoto(index - 1)}
      />
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Profile" onMenuPress={onMenuPress} />
      <FlatList
        contentContainerStyle={styles.scroll}
        data={
          userPhotos && userPhotos[me._id]
            ? [{_id: 'add_btn'}, ...userPhotos[me._id]]
            : [{_id: 'add_btn'}]
        }
        keyExtractor={i => i._id}
        renderItem={renderGalleryItem}
        numColumns={3}
        ListHeaderComponent={
          <ProfileContent
            me={me}
            userPets={userPets}
            onPressEditProfile={onPressEditProfile}
          />
        }
      />
      <ImageView
        images={imageViewerData}
        imageIndex={imageViewerIndex}
        visible={showImageViewer}
        onRequestClose={() => setShowImageViewer(false)}
        HeaderComponent={({imageIndex}) => (
          <ImageViewerHeader
            onBackPress={() => setShowImageViewer(false)}
            onPressDeletePhoto={() => onPressDeletePhoto(imageIndex)}
          />
        )}
      />
      <LoadingOverlay isVisible={showLoadingOverlay} text={loadingText} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  addPhotoBtn: {
    backgroundColor: R.colors.white,
    width: photoWidth,
    height: photoHeight,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  addPhotoBtnText: {
    ...human.footnoteWhite,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.amethyst,
    marginTop: 3,
  },
});
