import {connect} from 'react-redux';
import Component from './index';
import UserActions from 'services/user/actions';
import PetActions from 'services/pet/actions';
import MessageActions from 'services/message/actions';

const mapStateToProps = state => ({
  error: state.handler.error,
  me: state.user.me,
  userPets: state.pet.userPets,
  netInfo: state.user.netInfo,
  userPhotos: state.user.userPhotos,
});

const mapDispatchToProps = {
  logout: UserActions.creators.logout,
  getUserPets: PetActions.creators.getUserPets,
  getMyProfile: UserActions.creators.getMyProfile,
  getMessages: MessageActions.creators.getMessages,
  linkUserDevice: UserActions.creators.linkUserDevice,
  getUserPhotos: UserActions.creators.getUserPhotos,
  addUserPhotos: UserActions.creators.addUserPhotos,
  deleteUserPhoto: UserActions.creators.deleteUserPhoto,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
