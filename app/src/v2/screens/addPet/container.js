import {connect} from 'react-redux';
import Component from './index';
import PetActions from 'services/pet/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  addPet: PetActions.creators.addPet,
  addPetPhotos: PetActions.creators.addPetPhotos,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
