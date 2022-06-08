import {connect} from 'react-redux';
import Component from './index';
import UserActions from 'services/user/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  fpSendVerification: UserActions.creators.fpSendVerification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
