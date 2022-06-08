import React, {forwardRef} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

import R from 'res/R';
import {human} from 'react-native-typography';

function Input(props, ref) {
  return (
    <View style={[styles.inputContainer, props.containerStyle]}>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <TextInput ref={ref} {...props} style={[styles.input, props.style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderColor: R.colors.baliHai,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.fontMain,
    marginBottom: 10,
  },
});

export default forwardRef(Input);
