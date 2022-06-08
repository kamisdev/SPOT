import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';

import UserAvatar from 'component/UserAvatar';
import VectorIcon from 'component/VectorIcon';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function Pet({data, onPress, onPressDelete, onPressEdit}) {
  return (
    <View style={styles.bg}>
      <TouchableOpacity style={styles.petContainer} onPress={onPress}>
        <UserAvatar
          img={data.image ? {uri: data.image.image} : R.images.petDefaultAvatar}
          size={60}
        />
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{data.petName}</Text>
          <Text style={styles.petDesc}>{`${
            data.breed
          } | ${R.helper.computePetAge(data.birthDate)}`}</Text>
        </View>
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity style={styles.actionBtn} onPress={onPressEdit}>
            <VectorIcon
              font="Feather"
              name="edit"
              size={20}
              color={R.colors.pictonBlue}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onPressDelete}>
            <VectorIcon
              font="Feather"
              name="x"
              size={20}
              color={R.colors.redRibbon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: R.colors.alto,
  },
  petContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: R.colors.white,
  },
  petInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: R.colors.white,
    elevation: 3,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petName: {
    ...human.body,
    fontFamily: R.fonts.WorkSansSemiBold,
    marginTop: 5,
  },
  petDesc: {
    ...human.footnote,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.doveGray,
    marginTop: 5,
  },
});
