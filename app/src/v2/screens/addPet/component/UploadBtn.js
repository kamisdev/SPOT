import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function UploadBtn({onPress}) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <VectorIcon
        font="SimpleLine"
        name="cloud-upload"
        size={32}
        color={R.colors.white}
      />
      <Text style={styles.btnText}>Upload Pet Profile Photo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    backgroundColor: R.colors.alto,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  btnText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
    marginLeft: 20,
  },
});
