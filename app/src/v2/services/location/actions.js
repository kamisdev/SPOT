const GET_NEARBY_OWNERS = 'SEARCH_PET_OWNERS';
const SET_NEARBY_OWNERS = 'SET_PET_OWNERS';

const getNearbyOwners = (body, onSuccess) => ({
  type: GET_NEARBY_OWNERS,
  body,
  onSuccess,
});
const setNearbyOwners = owners => ({
  type: SET_NEARBY_OWNERS,
  owners,
});

export default {
  constants: {
    GET_NEARBY_OWNERS,
    SET_NEARBY_OWNERS,
  },
  creators: {
    getNearbyOwners,
    setNearbyOwners,
  },
};
