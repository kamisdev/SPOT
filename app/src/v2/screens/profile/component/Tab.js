import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {human} from 'react-native-typography';

import R from 'res/R';

export default function Tab({title, isSelected, onPress}) {
  return (
    <TouchableOpacity
      style={[
        styles.tabContainer,
        {
          backgroundColor: isSelected
            ? R.colors.bittersweet
            : R.colors.amethyst,
        },
      ]}
      onPress={onPress}
      disabled>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: R.colors.amethyst,
    alignItems: 'center',
  },
  title: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
});
