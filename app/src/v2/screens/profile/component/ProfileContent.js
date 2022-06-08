import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {human} from 'react-native-typography';
import moment from 'moment';

import UserAvatar from 'component/UserAvatar';
import VectorIcon from 'component/VectorIcon';

import Tab from './Tab';

import R from 'res/R';

const AVATAR_SIZE = 140;

export default function ProfileContent({me, userPets, onPressEditProfile}) {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.avatarBorder}>
        <View style={styles.avatarContainer}>
          <UserAvatar
            size={AVATAR_SIZE}
            img={me.image ? {uri: me.image.image} : null}
          />
        </View>
      </View>
      <Text style={styles.userName}>{`${me.firstName} ${me.lastName}`}</Text>
      <Text style={styles.userGender}>{`${
        me.gender === 'male' ? 'Male' : 'Female'
      } | ${
        userPets[me._id]
          ? userPets[me._id].length > 1
            ? `${userPets[me._id].length} pets`
            : `${userPets[me._id].length} pet`
          : '0 pet'
      }`}</Text>
      <Text style={styles.label}>Email Address:</Text>
      <Text style={styles.info}>{me.email}</Text>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.info}>
        {me.addressComponents
          ? `${R.helper.getCity(me.addressComponents)} ${R.helper.getState(
              me.addressComponents,
            )}`
          : 'N/A'}
      </Text>
      <Text style={styles.label}>Phone Number:</Text>
      <Text style={styles.info}>{me.contact ? me.contact : 'N/A'}</Text>
      <Text style={styles.label}>Birth Date:</Text>
      <Text style={styles.info}>
        {me.birthDate ? moment(me.birthDate).format('MMMM DD, YYYY') : 'N/A'}
      </Text>

      <TouchableOpacity style={styles.editBtn} onPress={onPressEditProfile}>
        <Text style={styles.editBtnText}>Edit Profile</Text>
        <VectorIcon
          font="AntDesign"
          name="edit"
          size={24}
          color={R.colors.pictonBlue}
        />
      </TouchableOpacity>

      <View style={styles.tabsContainer}>
        <Tab title="Gallery" isSelected={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
    backgroundColor: R.colors.white,
  },
  avatarContainer: {
    backgroundColor: R.colors.white,
    width: AVATAR_SIZE + 10,
    height: AVATAR_SIZE + 10,
    borderRadius: (AVATAR_SIZE + 10) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorder: {
    backgroundColor: R.colors.amethyst,
    width: AVATAR_SIZE + 20,
    height: AVATAR_SIZE + 20,
    borderRadius: (AVATAR_SIZE + 20) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  userName: {
    ...human.title2,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.fontMain,
    marginHorizontal: 20,
    marginTop: 15,
  },
  userGender: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.silverChalice,
    marginTop: 5,
  },
  label: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.amethyst,
    marginTop: 20,
  },
  info: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.doveGray,
    marginTop: 5,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  editBtn: {
    flexDirection: 'row',
    marginTop: 20,
    borderColor: R.colors.pictonBlue,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  editBtnText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.pictonBlue,
    marginRight: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
});
