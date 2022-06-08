import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {human} from 'react-native-typography';
import {Svg, Path} from 'react-native-svg';

import UserAvatar from 'component/UserAvatar';

import R from 'res/R';

export default function ChatBubble({data, me}) {
  const user = data.receiver || data.sender;

  return (
    <View>
      <View
        style={[
          styles.bubbleContainer,
          {
            alignSelf: data.receiverId ? 'flex-end' : 'flex-start',
            backgroundColor: data.receiverId
              ? R.colors.pictonBlue
              : R.colors.white,
          },
        ]}>
        <UserAvatar
          containerStyle={{marginTop: 2}}
          size={40}
          img={
            data.receiverId
              ? me.image
                ? {uri: me.image.image}
                : null
              : user.image
              ? {uri: user.image.image}
              : null
          }
        />
        <View style={styles.chatInfo}>
          <Text
            style={[
              styles.chatName,
              {color: data.receiverId ? R.colors.white : R.colors.fontMain},
            ]}>
            {data.receiverId ? 'Me' : `${user.firstName} ${user.lastName}`}
          </Text>
          <Text
            style={[
              styles.message,
              {color: data.receiverId ? R.colors.white : R.colors.fontMain},
            ]}>
            {data.message}
          </Text>
          <Text
            style={[
              styles.chatDate,
              {color: data.receiverId ? R.colors.white : R.colors.fontMain},
            ]}>
            {data.isSending
              ? 'Sending...'
              : R.helper.dateFromNow(data.createdAt)}
          </Text>
        </View>
      </View>
      <View style={data.receiverId ? styles.chatArrowFlip : styles.chatArrow}>
        <Svg
          style={styles.svg}
          width="100%"
          height="100%"
          viewBox="0 0 300 400">
          <Path
            fill={data.receiverId ? R.colors.pictonBlue : R.colors.white}
            d="M5718,952v91.008l63.676-76.888Z"
            transform="translate(-5668 -695)"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: 'row',
    backgroundColor: R.colors.white,
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 12,
    maxWidth: R.values.x * 0.8,
    minWidth: 70,
  },
  message: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
    marginTop: 5,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 6,
    paddingTop: 10,
    paddingRight: 5,
  },
  chatName: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  chatDate: {
    ...human.caption1,
    fontFamily: R.fonts.WorkSansRegular,
    position: 'absolute',
    top: 0,
    right: 5,
  },
  chatArrow: {
    height: 120,
    width: R.values.x * 0.4,
    marginTop: -100,
    marginLeft: -5,
  },
  chatArrowFlip: {
    height: 120,
    width: R.values.x * 0.4,
    marginTop: -100,
    transform: [{scaleX: -1}],
    marginLeft: R.values.x * 0.6,
  },
});
