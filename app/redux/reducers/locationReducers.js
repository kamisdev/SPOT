import {locationConstants} from '../constants';

export default function location(state = {
    fetchingLocation: false,
    fetchingUsersAround: false
}, action) {
    switch (action.type) {
        case locationConstants.SEARCH_LOCATION_REQUEST:
            return {
                ...state,
                fetchingLocation: true
            };
        case locationConstants.SEARCH_LOCATION_SUCCESS:
            return {
                ...state,
                fetchingLocation: false,
                locationPredictions: action.location
            };
        case locationConstants.SEARCH_LOCATION_FAILURE:
            return {
                ...state,
                fetchingLocation: false
            };

        case locationConstants.LOCATION_DETAILS_REQUEST:
            return {
                ...state,
            };
        case locationConstants.LOCATION_DETAILS_SUCCESS:
            return {
                ...state,
                locationDetails: action.location
            };
        case locationConstants.LOCATION_DETAILS_FAILURE:
            return {
                ...state,
            };

        case locationConstants.UPDATE_CURRENT_LOCATION_REQUEST:
            return {
                ...state,
            };
        case locationConstants.UPDATE_CURRENT_LOCATION_SUCCESS:
            return {
                ...state,
            };
        case locationConstants.UPDATE_CURRENT_LOCATION_FAILURE:
            return {
                ...state,
            };
        
        case locationConstants.GET_USERS_AROUND_REQUEST:
            return {
                ...state,
                fetchingUsersAround: true
            };
        case locationConstants.GET_USERS_AROUND_SUCCESS:
            return {
                ...state,
                fetchingUsersAround: false,
                usersAround: action.users
            };
        case locationConstants.GET_USERS_AROUND_FAILURE:
            return {
                ...state,
                fetchingUsersAround: false
            };
        default:
            return state
    }
}