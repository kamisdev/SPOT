import React from 'react';
import {StyleSheet, Image, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import R from 'res/R';

export default function ScreenContainer({children, hasBackground = true}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />
      {hasBackground && <Image style={styles.bg} source={R.images.bg} />}
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    width: R.values.x,
    height: R.values.y,
  },
});
