import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {human} from 'react-native-typography';

import R from 'res/R';

export default function LoadingOverlay({isVisible, text = 'Loading...'}) {
  return (
    <Modal style={styles.modal} isVisible={isVisible}>
      <View style={styles.modalContent}>
        <ActivityIndicator size="large" color={R.colors.bittersweet} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: R.colors.white,
    padding: 30,
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    marginTop: 10,
  },
});
