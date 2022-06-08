import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function CustomDatePicker(props) {
  const {isVisible, onPressDone, onClose} = props;

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      animationInTiming={400}
      animationOutTiming={1000}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.doneBtn} onPress={onPressDone}>
            <Text style={styles.doneBtnText}>DONE</Text>
          </TouchableOpacity>
        </View>
        <DatePicker style={styles.picker} {...props} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: R.colors.white,
  },
  header: {
    backgroundColor: R.colors.bittersweet,
    padding: 12,
  },
  doneBtn: {
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  doneBtnText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  picker: {
    width: R.values.x,
  },
});
