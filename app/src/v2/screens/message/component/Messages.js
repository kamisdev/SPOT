import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {human} from 'react-native-typography';

import UserAvatar from 'component/UserAvatar';

import R from 'res/R';

export default function Message({msg, user, onPress}) {
  return (
    <RectButton
      style={{
        backgroundColor:
          msg.isSending || msg.seenAt ? R.colors.white : R.colors.athensGray,
      }}
      onPress={onPress}>
      <Text style={styles.messageDate}>
        {msg.isSending ? 'Sending...' : R.helper.dateFromNow(msg.createdAt)}
      </Text>
      <View style={styles.messageContainer}>
        <UserAvatar
          size={60}
          img={user.image ? {uri: user.image.image} : null}
        />
        <View style={styles.messageInfoContainer}>
          <Text style={styles.messageName}>{`${user.firstName} ${
            user.lastName
          }`}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {msg.receiverId ? `You: ${msg.message}` : msg.message}
          </Text>
        </View>
        {!msg.isSending && !msg.seenAt && <View style={styles.seenIndicator} />}
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomColor: R.colors.alto,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginTop: -5,
  },
  messageInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  messageName: {
    ...human.body,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  message: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.fontMain,
    marginTop: 3,
  },
  messageDate: {
    ...human.footnote,
    fontFamily: R.fonts.WorkSansRegular,
    textAlign: 'right',
    marginRight: 15,
    marginTop: 7,
  },
  seenIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: R.colors.redRibbon,
  },
});
