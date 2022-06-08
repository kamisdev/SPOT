import {connect} from 'react-redux';
import Component from './index';
import UserActions from 'services/user/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  getAuth: UserActions.creators.getAuth,
  socialLogin: UserActions.creators.socialLogin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
