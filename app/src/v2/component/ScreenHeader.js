import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {human} from 'react-native-typography';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';

export default function ScreenHeader({title, onMenuPress, onBackPress}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onMenuPress && (
        <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
          <VectorIcon
            font="SimpleLine"
            name="menu"
            size={28}
            color={R.colors.white}
          />
        </TouchableOpacity>
      )}
      {onBackPress && (
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <VectorIcon
            font="AntDesign"
            name="arrowleft"
            size={28}
            color={R.colors.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    ...human.title2White,
    fontFamily: R.fonts.WorkSansSemiBold,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  menuBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
});
