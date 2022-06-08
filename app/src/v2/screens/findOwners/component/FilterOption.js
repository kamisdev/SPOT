import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {human} from 'react-native-typography';
import Slider from '@react-native-community/slider';

import R from 'res/R';

export default function FilterOption({
  isVisible,
  onClose,
  radius,
  onChangeRadius,
}) {
  const [dRadius, setdRadius] = useState(radius);

  const handleOnPressApply = () => {
    onChangeRadius(dRadius);
    onClose();
  };

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.optionContainer}>
          <Text style={styles.optionTitle}>Search radius:</Text>
          <Slider
            style={styles.slider}
            value={dRadius}
            step={1}
            minimumValue={1}
            maximumValue={50}
            minimumTrackTintColor={R.colors.bittersweet}
            maximumTrackTintColor={R.colors.fontMain}
            onValueChange={val => setdRadius(val)}
          />
          <Text style={styles.radiusValue}>{dRadius} kilometers</Text>
        </View>
        <TouchableOpacity style={styles.applyBtn} onPress={handleOnPressApply}>
          <Text style={styles.applyBtnText}>APPLY</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContent: {
    backgroundColor: R.colors.white,
    borderRadius: 10,
    marginHorizontal: 30,
  },
  optionContainer: {
    padding: 15,
  },
  optionTitle: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
    marginTop: 10,
  },
  slider: {
    height: 25,
    marginLeft: -10,
  },
  radiusValue: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.bittersweet,
    textAlign: 'center',
  },
  applyBtn: {
    padding: 15,
    backgroundColor: R.colors.bittersweet,
    marginTop: 20,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
  applyBtnText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
});
