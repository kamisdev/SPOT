import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {human} from 'react-native-typography';

import R from 'res/R';

export default function CustomNotifMessage(props) {
  const {description, message, onPress} = props.message;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.notifContainer}>
        <Text style={styles.notifTitle}>{message}</Text>
        <Text style={styles.notifMessage} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  notifContainer: {
    marginTop: R.values.getStatusBarHeight(),
    backgroundColor: R.colors.white,
    elevation: 3,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  notifTitle: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  notifMessage: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    marginTop: 5,
  },
});
