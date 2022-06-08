import {connect} from 'react-redux';
import Component from './index';
import PetActions from 'services/pet/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  userPets: state.pet.userPets,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  getUserPets: PetActions.creators.getUserPets,
  deletePet: PetActions.creators.deletePet,
  getPetPhotos: PetActions.creators.getPetPhotos,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
