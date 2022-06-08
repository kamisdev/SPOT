import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {human} from 'react-native-typography';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';
import api from 'services/api';

export default function SearchAddressModal({
  isVisible,
  onClose,
  onPressLocation,
}) {
  const onPressGooglePlace = (data, details) => {
    onClose();
    onPressLocation(details);
  };

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackButtonPress={onClose}>
      <View style={styles.modalContent}>
        <GooglePlacesAutocomplete
          placeholder="Search address..."
          onPress={onPressGooglePlace}
          query={{key: api.GOOGLE_MAPS_API_KEY, language: 'en'}}
          styles={{
            textInput: styles.searchTextInput,
          }}
          fetchDetails={true}
        />
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <VectorIcon
            font="Feather"
            name="arrow-left"
            size={30}
            color={R.colors.fontMain}
          />
        </TouchableOpacity>
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
    backgroundColor: R.colors.alto,
  },
  searchTextInput: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    backgroundColor: R.colors.white,
    borderRadius: 0,
    paddingRight: 15,
    paddingLeft: 55,
  },
  backBtn: {
    position: 'absolute',
    top: 5,
    left: 10,
  },
});
