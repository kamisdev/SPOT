import {connect} from 'react-redux';
import Component from './index';
import PetActions from 'services/pet/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  petPhotos: state.pet.petPhotos,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  getUserPets: PetActions.creators.getUserPets,
  getPetPhotos: PetActions.creators.getPetPhotos,
  addPetPhotos: PetActions.creators.addPetPhotos,
  deletePetPhoto: PetActions.creators.deletePetPhoto,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
