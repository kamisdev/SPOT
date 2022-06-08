import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {human} from 'react-native-typography';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import UserAvatar from 'component/UserAvatar';

import ChatInput from './component/ChatInput';
import ReversedList from './component/ReversedList';

import R from 'res/R';
import api from 'services/api';

export default class ChatScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    const {user} = props.route.params;
    this.state = {
      user,
      messagesLoading: false,
      messagesData: R.helper.filterMessages(props.messages),
    };
  }

  componentDidMount() {
    const {netInfo, messages, seenMessage, getMessages} = this.props;
    const {user} = this.state;

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      this.setState({messagesLoading: false});
      return;
    }

    if (!messages) {
      this.setState({messagesLoading: true});
      getMessages(() => {
        this.setState({messagesLoading: false});
        const filteredMessages = R.helper.filterMessages(messages);
        const unseenMsgs = filteredMessages[user._id]
          ? filteredMessages[user._id].filter(
              o => !o.seenAt || o.seenAt === null,
            )
          : null;

        if (unseenMsgs) {
          seenMessage(unseenMsgs);
        }
      });
    } else {
      const filteredMessages = R.helper.filterMessages(messages);
      const unseenMsgs = filteredMessages[user._id]
        ? filteredMessages[user._id].filter(o => !o.seenAt || o.seenAt === null)
        : null;

      if (unseenMsgs) {
        seenMessage(unseenMsgs);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {netInfo, messages, seenMessage, getMessages} = this.props;
    const {user} = this.state;

    if (netInfo !== prevProps.netInfo && netInfo.isInternetReachable) {
      getMessages(() => {
        this.setState({messagesLoading: false});
      });
    }

    if (messages !== prevProps.messages) {
      const filteredMessages = R.helper.filterMessages(messages);
      this.setState({messagesData: filteredMessages});
      if (messages) {
        const unseenMsgs = filteredMessages[user._id]
          ? filteredMessages[user._id].filter(
              o => !o.seenAt || o.seenAt === null,
            )
          : null;

        if (unseenMsgs && unseenMsgs.length > 0) {
          seenMessage(unseenMsgs);
        }
      }
    }
  }

  onBackPress = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onPressSend = (mes, clearInput) => {
    const {netInfo, sendMessage, addSendingMessage} = this.props;
    const {user} = this.state;

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    addSendingMessage(user, mes);
    clearInput();
    sendMessage(user._id, mes, () => {});
  };

  onPressViewProfile = () => {
    const {user} = this.state;
    const {navigation} = this.props;
    navigation.navigate('FindOwners', {
      screen: 'OwnerProfile',
      params: {owner: user},
    });
  };

  render() {
    const {user, messagesLoading, messagesData} = this.state;
    const {me, messages} = this.props;

    return (
      <ScreenContainer>
        <ScreenHeader title="Chat" onBackPress={this.onBackPress} />
        <View style={styles.screenWrapper}>
          <View style={styles.profileContainer}>
            <UserAvatar
              size={50}
              img={user.image ? {uri: user.image.image} : null}
            />
            <View style={styles.profileInfoContainer}>
              <Text style={styles.profileName}>{`${user.firstName} ${
                user.lastName
              }`}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewProfileBtn}
              onPress={this.onPressViewProfile}>
              <Text style={styles.viewProfileBtnText}>VIEW PROFILE</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chatListContainer}>
            {messagesLoading ? (
              <ActivityIndicator
                style={{marginTop: 30}}
                size="large"
                color={R.colors.bittersweet}
              />
            ) : (
              <ReversedList
                data={
                  messagesData && messagesData[user._id]
                    ? messagesData[user._id]
                    : []
                }
                me={me}
              />
            )}
          </View>
          <ChatInput onPressSend={this.onPressSend} />
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: R.colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileInfoContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  profileName: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  viewProfileBtn: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: R.colors.white,
    borderRadius: 30,
    borderColor: R.colors.doveGray,
    borderWidth: 1,
  },
  viewProfileBtnText: {
    ...human.caption1,
    fontFamily: R.fonts.WorkSansRegular,
    color: R.colors.pictonBlue,
  },
  chatListContainer: {
    flex: 1,
  },
});
