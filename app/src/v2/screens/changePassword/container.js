import {connect} from 'react-redux';
import Component from './index';
import UserActions from 'services/user/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  changePassword: UserActions.creators.changePassword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
