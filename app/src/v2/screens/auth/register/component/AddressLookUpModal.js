import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import Modal from 'react-native-modal';

import AddressLookUp from 'component/AddressLookUp';

import R from 'res/R';

export default function AddressLookUpModal({isVisible, onClose, onPressDone}) {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      //animationIn="none"
      //animationOut="none"
    >
      <SafeAreaView style={styles.modalContent}>
        <AddressLookUp onBackPress={onClose} onPressDone={onPressDone} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-start',
  },
  modalContent: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
});
