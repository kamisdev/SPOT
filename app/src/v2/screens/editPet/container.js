import {connect} from 'react-redux';
import Component from './index';
import PetActions from 'services/pet/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  userPets: state.pet.userPets,
  netInfo: state.user.netInfo,
});

const mapDispatchToProps = {
  updatePet: PetActions.creators.updatePet,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
