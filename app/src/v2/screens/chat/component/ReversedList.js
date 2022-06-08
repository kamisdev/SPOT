import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import ChatBubble from './ChatBubble';
import R from 'res/R';

export default function ReversedList({data, me}) {
  const [reversedData, setReversedData] = useState(data);

  const renderChat = ({item}) => {
    return <ChatBubble data={item} me={me} />;
  };

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={data}
      keyExtractor={i => i._id}
      renderItem={renderChat}
      inverted
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
});
