import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {human} from 'react-native-typography';

import UserAvatar from 'component/UserAvatar';

import Owner from './Owner';
import Tab from './Tab';

import R from 'res/R';

export default function Header({pet, tab, onPressTab, onPressViewProfile}) {
  return (
    <View style={styles.content}>
      <Owner data={pet.owner} onPressViewProfile={onPressViewProfile} />
      <View style={styles.coverPhotoContainer} />
      <View style={styles.avatarBorder}>
        <View style={styles.avatarContainer}>
          <UserAvatar
            img={pet.image ? {uri: pet.image.image} : R.images.petDefaultAvatar}
            size={avatarSize}
          />
        </View>
      </View>
      <Text style={styles.petName}>{pet.petName}</Text>
      <Text style={styles.petInfo}>{`${pet.breed} | ${R.helper.computePetAge(
        pet.birthDate,
      )} | ${pet.gender === 'male' ? 'Male' : 'Female'}`}</Text>
      <View style={styles.tabContainer}>
        <Tab
          title="Behaviour"
          isSelected={tab === 'behavior'}
          onPress={() => onPressTab('behavior')}
        />
        <Tab
          title="Dislikes"
          isSelected={tab === 'dislikes'}
          onPress={() => onPressTab('dislikes')}
        />
        <Tab
          title="Gallery"
          isSelected={tab === 'gallery'}
          onPress={() => onPressTab('gallery')}
        />
      </View>
    </View>
  );
}

const avatarSize = 110;

const styles = StyleSheet.create({
  content: {
    backgroundColor: R.colors.white,
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
    marginTop: -60,
    alignSelf: 'center',
  },
  coverPhotoContainer: {
    minHeight: 100,
    backgroundColor: R.colors.athensGray,
  },
  petName: {
    ...human.title3,
    fontFamily: R.fonts.WorkSansSemiBold,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  petInfo: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.silverChalice,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 10,
  },
});
