import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

import AddressLookUp from 'component/AddressLookUp';

import R from 'res/R';

export default function AddressLookUpModal({
  isVisible,
  onClose,
  onPressDone,
  initialLocation,
}) {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.modalContent}>
        <AddressLookUp
          onBackPress={onClose}
          onPressDone={onPressDone}
          initialLocation={initialLocation}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  modalContent: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
});
