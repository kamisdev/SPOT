import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {human} from 'react-native-typography';

import R from 'res/R';

export default function Tabs({tab, onPressTab}) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor:
              tab === 'gallery' ? R.colors.bittersweet : R.colors.amethyst,
          },
        ]}
        onPress={() => onPressTab('gallery')}>
        <Text style={styles.tabText}>Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor:
              tab === 'pet' ? R.colors.bittersweet : R.colors.amethyst,
          },
        ]}
        onPress={() => onPressTab('pet')}>
        <Text style={styles.tabText}>Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  tabText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
});
