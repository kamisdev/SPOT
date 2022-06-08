import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function PetPhotos({photos, onAddPhoto, onRemovePhoto}) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <TouchableOpacity style={styles.addBtn} onPress={onAddPhoto}>
        <VectorIcon
          font="AntDesign"
          name="plus"
          size={38}
          color={R.colors.white}
        />
        <Text style={styles.addBtnText}>Add Photo</Text>
      </TouchableOpacity>
      {photos && photos.length > 0
        ? photos.map((img, index) => {
            return (
              <View key={index} style={styles.photoContainer}>
                <Image style={styles.photo} source={img} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemovePhoto(index)}>
                  <VectorIcon
                    font="AntDesign"
                    name="close"
                    size={18}
                    color={R.colors.white}
                  />
                </TouchableOpacity>
              </View>
            );
          })
        : null}
    </ScrollView>
  );
}

const size = 100;

const styles = StyleSheet.create({
  scroll: {
    marginTop: 20,
  },
  addBtn: {
    width: size,
    height: size,
    borderRadius: 10,
    backgroundColor: R.colors.pictonBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: size,
    height: size,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  photoContainer: {
    width: size,
    height: size,
    borderRadius: 10,
    backgroundColor: R.colors.alto,
    marginLeft: 10,
  },
  removeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: R.colors.redRibbon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    ...human.footnoteWhite,
    fontFamily: R.fonts.WorkSansRegular,
    marginTop: 10,
  },
});
