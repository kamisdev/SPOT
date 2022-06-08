import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import UserAvatar from 'component/UserAvatar';
import R from 'res/R';
import {human} from 'react-native-typography';

export default function Owner({data, onPressViewProfile}) {
  return (
    <View style={styles.container}>
      <UserAvatar img={data.image ? {uri: data.image.image} : null} size={60} />
      <View style={styles.info}>
        <Text style={styles.name}>{`${data.firstName} ${data.lastName}`}</Text>
        <Text style={styles.label}>OWNER</Text>
      </View>
      <TouchableOpacity
        style={styles.viewProfileBtn}
        onPress={onPressViewProfile}>
        <Text style={styles.viewProfileBtnText}>VIEW PROFILE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: R.colors.bittersweet,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginHorizontal: 10,
  },
  name: {
    ...human.bodyWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  label: {
    ...human.footnoteWhite,
    fontFamily: R.fonts.WorkSansRegular,
  },
  viewProfileBtn: {
    padding: 12,
    backgroundColor: R.colors.white,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileBtnText: {
    ...human.caption2,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.pictonBlue,
  },
});
