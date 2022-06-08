import {connect} from 'react-redux';
import Component from './index';
import UserActions from 'services/user/actions';
import PetActions from 'services/pet/actions';
import MessageActions from 'services/message/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
