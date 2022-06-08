import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import UserAvatar from 'component/UserAvatar';
import R from 'res/R';
import {human} from 'react-native-typography';

export default function ListView({
  nearbyOwners,
  currentLocation,
  refreshing,
  onRefresh,
  onPressViewInMap,
  onPressViewProfile,
}) {
  const handleOnPressViewProfile = owner => {
    onPressViewProfile(owner);
  };

  const renderItem = ({item}) => {
    const loc = {latitude: item.latitude, longitude: item.longitude};

    return (
      <Owner
        data={item}
        distance={R.helper.calculateDistance(
          currentLocation,
          {latitude: item.latitude, longitude: item.longitude},
          'km',
        )}
        onPressViewInMap={() => onPressViewInMap(loc, item)}
        onPressViewProfile={() => onPressViewProfile(item)}
      />
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={nearbyOwners}
      keyExtractor={i => i._id}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

function Owner({data, distance, onPressViewInMap, onPressViewProfile}) {
  return (
    <View style={styles.ownerContainer}>
      <View style={styles.ownerWrapper}>
        <View style={styles.avatarContainer}>
          <UserAvatar
            size={avatarSize}
            img={data.image ? {uri: data.image.image} : null}
          />
        </View>
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerName}>{`${data.firstName} ${
            data.lastName
          }`}</Text>
          <Text style={styles.ownerDesc}>
            {`${R.helper.getAge(data.birthDate)} | ${
              data.gender === 'male' ? 'Male' : 'Female'
            }`}
          </Text>
          <Text style={styles.ownerDesc}>{`${distance.toFixed(
            2,
          )} KM away`}</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.actionBtn} onPress={onPressViewProfile}>
          <Text style={styles.actionBtnText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: R.colors.bittersweet}]}
          onPress={onPressViewInMap}>
          <Text style={styles.actionBtnText}>View in Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const avatarSize = 60;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  ownerContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: R.colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  ownerWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatarContainer: {
    backgroundColor: R.colors.white,
    width: avatarSize + 12,
    height: avatarSize + 12,
    borderRadius: (avatarSize + 12) / 2,
    borderColor: R.colors.amethyst,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerInfo: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 10,
  },
  ownerName: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  ownerDesc: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
    marginTop: 2,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.pictonBlue,
    padding: 10,
  },
  actionBtnText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansRegular,
  },
});
