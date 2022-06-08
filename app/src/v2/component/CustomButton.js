import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {human} from 'react-native-typography';

import R from 'res/R';

export default function CustomButton({
  containerStyle,
  style = 'fill',
  label,
  onPress,
  disabled,
}) {
  let btnStyle = styles.btnFill;
  let btnTitleStyle = styles.btnTitle;
  if (style === 'border') {
    btnStyle = styles.btnBorder;
    btnTitleStyle = styles.btnTitleBorder;
  }

  return (
    <View style={containerStyle}>
      <Button
        buttonStyle={btnStyle}
        title={label}
        titleStyle={btnTitleStyle}
        onPress={onPress}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnFill: {
    backgroundColor: R.colors.bittersweet,
    borderRadius: 40,
    padding: 15,
  },
  btnBorder: {
    borderRadius: 40,
    padding: 14,
    borderColor: R.colors.bittersweet,
    borderWidth: 1,
    backgroundColor: R.colors.white,
  },
  btnTitle: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  btnTitleBorder: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.bittersweet,
  },
});
