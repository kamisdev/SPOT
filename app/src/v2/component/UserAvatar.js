import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import R from 'res/R';

export default function UserAvatar({containerStyle, img, size = 50}) {
  return (
    <View
      style={[
        containerStyle,
        styles.avatarContainer,
        {width: size, height: size, borderRadius: size / 2},
      ]}>
      <Image
        style={[
          styles.img,
          {width: size, height: size, borderRadius: size / 2},
        ]}
        source={img ? img : R.images.defaultAvatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: R.colors.alto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    resizeMode: 'cover',
  },
});
