import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Badge} from 'react-native-elements';
import {connect} from 'react-redux';

import R from 'res/R';

function CustomBadge({messages, containerStyle, badgeFor = 'Message'}) {
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    let count = 0;
    if (messages) {
      const msgObject = R.helper.filterMessages(messages);
      Object.keys(msgObject).map(m => {
        const msg = msgObject[m][0];
        if (!msg.isSending && !msg.seenAt) {
          count += 1;
        }
      });
      setBadgeCount(count);
    }
  }, [messages]);

  if (!messages || Object.keys(messages).length < 1 || badgeCount === 0) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <Badge
        status="error"
        badgeStyle={{width: 10, height: 10, borderRadius: 5}}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

const mapStateToProps = state => ({
  messages: state.message.messages,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomBadge);
