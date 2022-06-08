import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {human} from 'react-native-typography';

import UserAvatar from 'component/UserAvatar';

import R from 'res/R';

export default function CalloutContent({owner, currentLocation}) {
  if (!currentLocation) {
    return null;
  }

  return (
    <View style={styles.calloutContainer}>
      <View style={styles.calloutWrapper}>
        <UserAvatar
          size={60}
          img={owner.image ? {uri: owner.image.image} : null}
        />
        <View style={styles.calloutInfo}>
          <Text style={styles.calloutInfoName}>{`${owner.firstName} ${
            owner.lastName
          }`}</Text>
          <Text style={styles.calloutInfoDesc}>{`${R.helper.getAge(
            owner.birthDate,
          )} | ${owner.gender === 'male' ? 'Male' : 'Female'}`}</Text>
          {currentLocation && (
            <Text style={styles.calloutInfoDistance}>{`${R.helper
              .calculateDistance(
                {
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                },
                {latitude: owner.latitude, longitude: owner.longitude},
                'km',
              )
              .toFixed(4)} KM away`}</Text>
          )}
        </View>
      </View>
      {/* <Text style={styles.calloutInfoDesc}>
        {owner.addressComponents
          ? `${R.helper.getCity(owner.addressComponents)}, ${R.helper.getState(
              owner.addressComponents,
            )}`
          : ''}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  calloutContainer: {
    // width: 230,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: R.colors.white,
    // borderWidth: 1,
    // borderColor: R.colors.alto,
  },
  calloutWrapper: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  calloutInfo: {
    flex: 1,
    marginLeft: 5,
    paddingTop: 5,
  },
  calloutInfoName: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  calloutInfoDesc: {
    ...human.footnote,
    fontFamily: R.fonts.WorkSansRegular,
    marginTop: 2,
  },
  calloutInfoDistance: {
    ...human.footnote,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.bittersweet,
    marginTop: 2,
  },
});
