import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function SettingsButton({label, icon, onPress}) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      {icon && (
        <VectorIcon
          style={styles.btnIcon}
          font={icon.font}
          name={icon.name}
          size={icon.size}
          color={icon.color}
        />
      )}
      <Text style={styles.btnLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: R.colors.white,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 12,
  },
  btnLabel: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  btnIcon: {
    marginRight: 10,
  },
});
