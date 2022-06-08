import {connect} from 'react-redux';
import Component from './index';
import UserActions from 'services/user/actions';
import PetActions from 'services/pet/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  userPets: state.pet.userPets,
  netInfo: state.user.netInfo,
  userPhotos: state.user.userPhotos,
});

const mapDispatchToProps = {
  getUserPets: PetActions.creators.getUserPets,
  getUserPhotos: UserActions.creators.getUserPhotos,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
