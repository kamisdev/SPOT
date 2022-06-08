import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {human} from 'react-native-typography';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';

export default function SearchBar({
  radius,
  searchText,
  onPressFilter,
  onSearchLocation,
}) {
  const searchRef = useRef();

  return (
    <View style={styles.barContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <VectorIcon
            font="FontAwesome"
            name="search"
            size={20}
            color={R.colors.silverChalice}
          />
          <TextInput
            ref={searchRef}
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            showSoftInputOnFocus={false}
            onFocus={() => {
              onSearchLocation();
              searchRef.current?.blur();
            }}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={onPressFilter}>
          <VectorIcon
            font="FontAwesome"
            name="filter"
            size={24}
            color={R.colors.bittersweet}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.locationContainer}>
        {/* <Text style={styles.location}>Search radius</Text> */}
        <View style={styles.distanceContainer}>
          <Text style={styles.distance}>{`Radius: ${radius} ${
            radius > 1 ? 'kilometers' : 'kilometer'
          }`}</Text>
          {/* <VectorIcon
            font="Feather"
            name="chevron-right"
            size={24}
            color={R.colors.white}
          /> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 5,
    backgroundColor: R.colors.bittersweet,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: R.colors.white,
    paddingVertical: 8,
    paddingHorizontal: 17,
    alignItems: 'center',
    borderRadius: 40,
  },
  searchInput: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    flex: 1,
    marginLeft: 10,
    padding: 0,
  },
  filterBtn: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  location: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansRegular,
    flex: 1,
  },
  distanceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  distance: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansRegular,
  },
});
