import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';

export default function ImageViewerHeader({onBackPress, onPressDeletePhoto}) {
  return (
    <View style={styles.viewerHeader}>
      <TouchableOpacity onPress={onBackPress}>
        <VectorIcon
          font="Feather"
          name="arrow-left"
          size={32}
          color={R.colors.white}
        />
      </TouchableOpacity>
      <View style={styles.viewerHeaderLeftActions}>
        <TouchableOpacity
          style={styles.deletePhotoBtn}
          onPress={onPressDeletePhoto}>
          <VectorIcon
            font="Feather"
            name="trash-2"
            size={26}
            color={R.colors.redRibbon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
