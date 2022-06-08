import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {human} from 'react-native-typography';
import {RectButton} from 'react-native-gesture-handler';

import R from 'res/R';

export default function Tab({title, isSelected, onPress}) {
  return (
    <RectButton
      style={[
        styles.tabContainer,
        {
          backgroundColor: isSelected
            ? R.colors.bittersweet
            : R.colors.amethyst,
        },
      ]}
      onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </RectButton>
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
