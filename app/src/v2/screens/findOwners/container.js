import {connect} from 'react-redux';
import Component from './index';
import LocationActions from 'services/location/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  nearbyOwners: state.location.nearbyOwners,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  getNearbyOwners: LocationActions.creators.getNearbyOwners,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
