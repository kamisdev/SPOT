import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {human} from 'react-native-typography';
import moment from 'moment';

import UserAvatar from 'component/UserAvatar';
import VectorIcon from 'component/VectorIcon';

import R from 'res/R';

export default function ProfileContent({data, onPressMessage}) {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.avatarBorder}>
        <View style={styles.avatarContainer}>
          <UserAvatar
            img={data.image ? {uri: data.image.image} : null}
            size={avatarSize}
          />
        </View>
      </View>
      <Text style={styles.userName}>{`${data.firstName} ${
        data.lastName
      }`}</Text>
      <Text style={styles.userGender}>{`${
        data.gender ? 'Male' : 'Female'
      }`}</Text>
      <Text style={styles.label}>Email Address:</Text>
      <Text style={styles.info}>{data.email}</Text>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.info}>
        {data.addressComponents
          ? `${R.helper.getCity(data.addressComponents)} ${R.helper.getState(
              data.addressComponents,
            )}`
          : 'N/A'}
      </Text>
      <Text style={styles.label}>Phone Number:</Text>
      <Text style={styles.info}>{data.contact ? data.contact : 'N/A'}</Text>
      <Text style={styles.label}>Birth Date:</Text>
      <Text style={styles.info}>
        {data.birthDate
          ? moment(data.birthDate).format('MMMM DD, YYYY')
          : 'N/A'}
      </Text>
      <TouchableOpacity style={styles.editBtn} onPress={onPressMessage}>
        <Text style={styles.editBtnText}>Message</Text>
        <VectorIcon
          font="Ionicons"
          name="chatbubble-ellipses-outline"
          size={24}
          color={R.colors.pictonBlue}
        />
      </TouchableOpacity>
    </View>
  );
}

const avatarSize = 140;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
    backgroundColor: R.colors.white,
    paddingBottom: 30,
  },
  avatarContainer: {
    backgroundColor: R.colors.white,
    width: avatarSize + 10,
    height: avatarSize + 10,
    borderRadius: (avatarSize + 10) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorder: {
    backgroundColor: R.colors.amethyst,
    width: avatarSize + 20,
    height: avatarSize + 20,
    borderRadius: (avatarSize + 20) / 2,
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
    marginTop: 30,
    borderColor: R.colors.pictonBlue,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
    // backgroundColor: R.colors.pictonBlue,
  },
  editBtnText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.pictonBlue,
    marginRight: 10,
  },
});
