import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {human} from 'react-native-typography';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import VectorIcon from 'component/VectorIcon';
import LoadingOverlay from 'component/LoadingOverlay';

import Message from './component/Messages';

import R from 'res/R';

const tempData = [
  {_id: '1', name: 'Romel Bonnie', date: new Date()},
  {_id: '2', name: 'Devon Klarck', date: new Date()},
];

export default class Messages extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messagesLoading: true,
      refreshing: false,
      loading: false,
      loadingText: 'Loading...',
    };

    this.swipeRef = {};
  }

  componentDidMount() {
    const {netInfo, navigation, getMessages} = this.props;

    if (netInfo.isInternetReachable) {
      getMessages(() => {
        this.setState({messagesLoading: false});
      });
    } else {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      this.setState({messagesLoading: false});
    }

    this._unsubscribe = navigation.addListener('blur', () => {
      Object.keys(this.swipeRef).map(o => this.swipeRef[o].close());
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onSwipeMessage = id => {
    Object.keys(this.swipeRef).map(o => {
      if (id !== o) {
        this.swipeRef[o].close();
      }
    });
  };

  onMenuPress = () => {
    const {navigation} = this.props;
    navigation.navigate('SettingsNavigation');
  };

  onPressMessage = user => {
    const {navigation} = this.props;
    navigation.navigate('ChatScreen', {user});
  };

  onRefresh = () => {
    const {netInfo, getMessages} = this.props;

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    this.setState({refreshing: true});
    getMessages(() => {
      this.setState({refreshing: false});
    });
  };

  onPressDeleteConvo = userId => {
    const {netInfo, deleteConvo} = this.props;

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    Alert.alert(
      'Delete messages',
      'Are you sure you want to delete this conversation?',
      [
        {text: 'CANCEL', onPress: () => this.swipeRef[userId].close()},
        {
          text: 'DELETE',
          onPress: () => {
            this.setState({
              loading: true,
              loadingText: 'Deleting conversation...',
            });
            deleteConvo(userId, () => {
              this.setState({loading: false});
            });
          },
        },
      ],
    );
  };

  renderMessage = ({item}) => {
    const {messages} = this.props;
    const msgObject = R.helper.filterMessages(messages);
    const msg = msgObject[item][0];
    const user = msg.receiverId ? msg.receiver : msg.sender;

    // return <Text>asdasdasd</Text>;

    return (
      <Swipeable
        ref={ref => (this.swipeRef[item] = ref)}
        renderRightActions={() => (
          <RightActions onPressDelete={() => this.onPressDeleteConvo(item)} />
        )}
        onSwipeableWillOpen={() => this.onSwipeMessage(item)}>
        <Message
          msg={msg}
          user={user}
          onPress={() => this.onPressMessage(user)}
        />
      </Swipeable>
    );
  };

  getUnseenMessages = messages => {
    let count = 0;
    const msgObject = R.helper.filterMessages(messages);

    Object.keys(msgObject).map(m => {
      const msg = msgObject[m][0];
      if (!msg.isSending && !msg.seenAt) {
        count += 1;
      }
    });

    if (count > 99) {
      return '99+';
    }

    return count;
  };

  render() {
    const {messages} = this.props;
    const {refreshing, messagesLoading, loading, loadingText} = this.state;

    return (
      <ScreenContainer>
        <ScreenHeader
          title={
            this.getUnseenMessages(messages) === 0
              ? 'Messages'
              : `Messages(${this.getUnseenMessages(messages)})`
          }
          onMenuPress={this.onMenuPress}
        />
        <View style={styles.content}>
          {messagesLoading ? (
            <ActivityIndicator
              style={{marginTop: 20}}
              size="large"
              color={R.colors.bittersweet}
            />
          ) : (
            <FlatList
              data={
                messages ? Object.keys(R.helper.filterMessages(messages)) : []
              }
              keyExtractor={i => i}
              renderItem={this.renderMessage}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              ListFooterComponent={
                !messages || Object.keys(messages).length < 1 ? (
                  <Text style={styles.noMessageText}>
                    You have no messages.
                  </Text>
                ) : null
              }
            />
          )}
        </View>
        <LoadingOverlay isVisible={loading} text={loadingText} />
      </ScreenContainer>
    );
  }
}

function RightActions({onPressDelete}) {
  return (
    <View style={styles.rightActionsContainer}>
      <TouchableOpacity style={styles.deleteBtn} onPress={onPressDelete}>
        <VectorIcon
          font="Feather"
          name="trash-2"
          size={22}
          color={R.colors.white}
        />
        {/* <Text style={styles.deleteText}>Delete</Text> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: R.colors.white,
    paddingBottom: 100,
    marginTop: 5,
  },
  rightActionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  deleteBtn: {
    alignItems: 'center',
    backgroundColor: R.colors.redRibbon,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    ...human.footnote,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.redRibbon,
  },
  noMessageText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    textAlign: 'center',
    padding: 20,
    marginTop: 20,
  },
});
