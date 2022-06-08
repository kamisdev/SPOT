import {connect} from 'react-redux';
import Component from './index';
import MessageActions from 'services/message/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  messages: state.message.messages,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  getMessages: MessageActions.creators.getMessages,
  deleteConvo: MessageActions.creators.deleteConvo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
