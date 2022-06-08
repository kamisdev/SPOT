import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';

export default function FAB({onPress, style, icon}) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <VectorIcon
        font={icon.font}
        name={icon.name}
        size={icon.size}
        color={icon.color}
      />
    </TouchableOpacity>
  );
}

const size = 50;

const styles = StyleSheet.create({
  btn: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
