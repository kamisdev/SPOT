import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import R from 'res/R';

export default function GalleryPhoto({data, width, height, onPress}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.photoContainer, {width, height}]}>
        <Image
          style={{width, height, borderRadius: 10, resizeMode: 'cover'}}
          source={{uri: data.image}}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    backgroundColor: R.colors.alto,
    marginHorizontal: 3,
    marginBottom: 6,
    borderRadius: 10,
  },
});
