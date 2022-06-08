import {connect} from 'react-redux';
import Component from './index';
import MessageActions from 'services/message/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  messages: state.message.messages,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  sendMessage: MessageActions.creators.sendMessage,
  seenMessage: MessageActions.creators.seenMessage,
  getMessages: MessageActions.creators.getMessages,
  addSendingMessage: MessageActions.creators.addSendingMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
