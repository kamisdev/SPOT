import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {human} from 'react-native-typography';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import VectorIcon from 'component/VectorIcon';
import LoadingOverlay from 'component/LoadingOverlay';

import Header from './component/Header';
import GalleryPhoto from './component/GalleryPhoto';

import R from 'res/R';

export default function PetProfile({
  netInfo,
  navigation,
  route,
  error,
  me,
  petPhotos,
  //creators
  getPetPhotos,
  addPetPhotos,
  deletePetPhoto,
}) {
  const {pet} = route.params;
  const [screenError, setScreenError] = useState(error);
  const [tab, setTab] = useState('behavior');
  const [addPhotoLoading, setAddPhotoLoading] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const [refreshingGallery, setRefreshingGallery] = useState(false);

  useEffect(() => {
    if (error && error !== screenError && navigation.isFocused()) {
      Alert.alert('Error', error.error.message);
      setScreenError(error);
    }
  }, [error]);

  //componentDidmount
  useEffect(() => {
    if (netInfo.isInternetReachable) {
      getPetPhotos(pet._id);
    }
  }, []);

  useEffect(() => {
    if (petPhotos[pet._id]) {
      setImageViewerData(getImagesUri());
    }
  }, [petPhotos]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onPressTab = val => {
    setTab(val);
  };

  const onPressViewOwnerProfile = () => {
    if (pet.owner._id === me._id) {
      navigation.navigate('Profile');
    } else {
      navigation.goBack();
    }
  };

  const onPressGalleryPhoto = index => {
    setImageViewerData(getImagesUri());
    setImageViewerIndex(index);
    setShowImageViewer(true);
  };

  const renderHeader = () => {
    return (
      <Header
        pet={pet}
        tab={tab}
        onPressTab={onPressTab}
        onPressViewProfile={onPressViewOwnerProfile}
      />
    );
  };

  const renderBehavior = ({item}) => {
    return (
      <View style={styles.behaviorContainer}>
        <Image style={styles.pawIcon} source={R.images.icon.pet} />
        <Text style={styles.behavior}>{item}</Text>
      </View>
    );
  };

  const renderGalleryPhoto = ({item, index}) => {
    if (item._id === 'add_btn') {
      return (
        <TouchableOpacity
          style={styles.addPhotoBtn}
          onPress={onPressAddPhoto}
          disabled={addPhotoLoading}>
          {addPhotoLoading ? (
            <ActivityIndicator size="large" color={R.colors.white} />
          ) : (
            <>
              <VectorIcon
                font="Feather"
                name="plus"
                size={40}
                color={R.colors.white}
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

  const renderImageViewerHeader = ({imageIndex}) => {
    return (
      <View style={styles.viewerHeader}>
        <TouchableOpacity onPress={() => setShowImageViewer(false)}>
          <VectorIcon
            font="Feather"
            name="arrow-left"
            size={32}
            color={R.colors.white}
          />
        </TouchableOpacity>
        <View style={styles.viewerHeaderLeftActions}>
          {pet.userId === me._id ? (
            <TouchableOpacity
              style={styles.deletePhotoBtn}
              onPress={() => onPressDeletePhoto(imageIndex)}>
              <VectorIcon
                font="Feather"
                name="trash-2"
                size={26}
                color={R.colors.redRibbon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const onPressDeletePhoto = i => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const photos = petPhotos[pet._id];
    const selected = photos[i];
    const newIndex = i - 1;
    const len = photos.length;
    Alert.alert('Delete photo', 'Are you sure you want to delete this photo?', [
      {text: 'CANCEL'},
      {
        text: 'DELETE',
        onPress: async () => {
          setLoadingText('Deleting photo...');
          setShowLoadingOverlay(true);
          await R.firebase.deleteFile(selected.key);
          deletePetPhoto(selected._id, pet._id, () => {
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
        const path = `gallery/pet/${me._id}`;
        const imgUpload = await R.firebase.uploadImage(path, response);
        photos.push({
          ownerId: pet._id,
          image: imgUpload.url,
          key: imgUpload.imgKey,
        });
        addPetPhotos(photos, pet._id, () => {
          setAddPhotoLoading(false);
        });
      }
    });
  };

  const getImagesUri = () => {
    if (!petPhotos || !petPhotos[pet._id || petPhotos[pet._id].length === 0]) {
      return [];
    }

    const imgs = [];
    petPhotos[pet._id].forEach(photo => {
      imgs.push({uri: photo.image});
    });

    return imgs;
  };

  const onRefreshGallery = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    setRefreshingGallery(true);
    getPetPhotos(pet._id, () => {
      setRefreshingGallery(false);
    });
  };

  const getPetPhotosData = () => {
    let res = [];
    if (petPhotos && petPhotos[pet._id]) {
      res =
        pet.userId === me._id
          ? [{_id: 'add_btn'}, ...petPhotos[pet._id]]
          : petPhotos[pet._id];
    } else {
      res = pet.userId === me._id ? [{_id: 'add_btn'}] : [];
    }

    return res;
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Pet Profile" onBackPress={onBackPress} />
      <View style={styles.content}>
        {tab === 'behavior' && (
          <FlatList
            contentContainerStyle={styles.galleryList}
            data={pet.behaviours}
            keyExtractor={i => i}
            renderItem={renderBehavior}
            ListHeaderComponent={renderHeader}
          />
        )}
        {tab === 'dislikes' && (
          <ScrollView contentContainerStyle={styles.galleryList}>
            {renderHeader()}
            <Text style={styles.petDislikes}>{pet.dislikes}</Text>
          </ScrollView>
        )}
        {tab === 'gallery' && (
          <FlatList
            contentContainerStyle={styles.galleryList}
            data={getPetPhotosData()}
            keyExtractor={i => i._id}
            renderItem={renderGalleryPhoto}
            numColumns={3}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={
              getPetPhotosData().length === 0 ? (
                <Text style={styles.noContentText}>No photos added.</Text>
              ) : null
            }
            refreshing={refreshingGallery}
            onRefresh={onRefreshGallery}
          />
        )}
      </View>
      <ImageView
        images={imageViewerData}
        imageIndex={imageViewerIndex}
        visible={showImageViewer}
        onRequestClose={() => setShowImageViewer(false)}
        HeaderComponent={renderImageViewerHeader}
      />
      <LoadingOverlay isVisible={showLoadingOverlay} text={loadingText} />
    </ScreenContainer>
  );
}

const avatarSize = 110;
const photoWidth = R.values.x / 3 - 6;
const photoHeight = 125;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
  behaviorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pawIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  behavior: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    flex: 1,
    marginLeft: 10,
  },
  petDislikes: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    marginHorizontal: 15,
    marginTop: 10,
  },
  noContentText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    textAlign: 'center',
    marginTop: 20,
  },
  addPhotoBtn: {
    backgroundColor: R.colors.amethyst,
    width: photoWidth,
    height: photoHeight,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 6,
  },
  addPhotoBtnText: {
    ...human.footnoteWhite,
    fontFamily: R.fonts.WorkSansRegular,
    marginTop: 3,
  },
  galleryList: {
    paddingBottom: 100,
  },
  viewerHeader: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 5,
  },
  deletePhotoBtn: {
    alignSelf: 'flex-end',
  },
  viewerHeaderLeftActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
