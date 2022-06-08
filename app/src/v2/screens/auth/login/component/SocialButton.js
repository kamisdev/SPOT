import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import R from 'res/R';

export default function SocialButton({img, onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.btnContainer}>
        <Image style={styles.img} source={img} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    width: 50,
    height: 50,
    backgroundColor: R.colors.white,
    borderRadius: 25,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  img: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
