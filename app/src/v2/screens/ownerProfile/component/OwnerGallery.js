import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import ImageView from 'react-native-image-viewing';

import GalleryPhoto from 'component/GalleryPhoto';

import ProfileContent from './ProfileContent';
import Tabs from './Tabs';

import R from 'res/R';

const photoWidth = R.values.x / 3 - 6;
const photoHeight = 125;

export default function OwnerGallery({
  tab,
  userPhotos,
  owner,
  onPressMessageOwner,
  onPressTab,
}) {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [imageViewerData, setImageViewerData] = useState([]);

  const onPressGalleryPhoto = i => {
    setImageViewerData(getImagesUri());
    setImageViewerIndex(i);
    setShowImageViewer(true);
  };

  const getImagesUri = () => {
    if (!userPhotos || userPhotos.length === 0) {
      return [];
    }

    const imgs = [];
    userPhotos.forEach(photo => {
      imgs.push({uri: photo.image});
    });

    return imgs;
  };

  const renderPhoto = ({item, index}) => {
    return (
      <GalleryPhoto
        data={item}
        width={photoWidth}
        height={photoHeight}
        onPress={() => onPressGalleryPhoto(index)}
      />
    );
  };

  return (
    <>
      <FlatList
        contentContainerStyle={styles.galleryList}
        data={userPhotos}
        keyExtractor={i => i._id}
        renderItem={renderPhoto}
        numColumns={3}
        ListHeaderComponent={
          <>
            <ProfileContent data={owner} onPressMessage={onPressMessageOwner} />
            <Tabs tab={tab} onPressTab={onPressTab} />
          </>
        }
      />
      <ImageView
        images={imageViewerData}
        imageIndex={imageViewerIndex}
        visible={showImageViewer}
        onRequestClose={() => setShowImageViewer(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  galleryList: {
    paddingBottom: 100,
  },
});
