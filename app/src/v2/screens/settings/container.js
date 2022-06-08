import {connect} from 'react-redux';
import Component from './index';
import UserActions from 'services/user/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
});

const mapDispatchToProps = {
  logout: UserActions.creators.logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
