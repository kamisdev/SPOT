import axios from "axios";
import {locationConstants} from '../constants'
import { ENDPOINT, PLACES_API_KEY } from 'react-native-dotenv';
import authHead from "../helpers/authHead";
import Qs from 'qs';

export const locationActions = {
    searchLocation,
    updateCurrentLocation,
    getUsersAround,
    getLocationDetails
};


function searchLocation(inputLocation) {
    const query = {
        key: PLACES_API_KEY,
        language: 'en', 
    }

    return (dispatch,getState) => {
        dispatch(request());
        axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?&input='+ encodeURIComponent(inputLocation) + '&' + Qs.stringify(query))
        .then((result)=>{
            if (result.data.status==="OK"){
                dispatch(success(result.data.predictions));
            } else {
                console.log(result)
                dispatch(success([]));
            }
        }).catch(err=>{
            dispatch(failure(err));
        });
    };

    function request() { return { type: locationConstants.SEARCH_LOCATION_REQUEST } }
    function success(location) { return { type: locationConstants.SEARCH_LOCATION_SUCCESS, location } }
    function failure(error) { return { type: locationConstants.SEARCH_LOCATION_FAILURE, error } }
}


function updateCurrentLocation(data) {
    return (dispatch,getState) => {
        dispatch(request());

        axios.post(ENDPOINT + '/location/update', {
            ...data,
            userId: getState().user.user? getState().user.user._id: undefined
        },
        authHead(getState))
        .then((result) => {
            dispatch(success(result));
        })
        .catch(err=>{
            dispatch(failure(err));
        });


    };

    function request() { return { type: locationConstants.UPDATE_CURRENT_LOCATION_REQUEST } }
    function success(location) { return { type: locationConstants.UPDATE_CURRENT_LOCATION_REQUEST, location } }
    function failure(error) { return { type: locationConstants.UPDATE_CURRENT_LOCATION_REQUEST, error } }
}

function getUsersAround(data) {
    return (dispatch,getState) => {
        dispatch(request());

        axios.post(ENDPOINT + '/location/around', {
            ...data,
        },
        authHead(getState))
        .then((result) => {
            dispatch(success(result.data));
        })
        .catch(err=>{
            dispatch(failure(err));
        });
    };

    function request() { return { type: locationConstants.GET_USERS_AROUND_REQUEST } }
    function success(users) { return { type: locationConstants.GET_USERS_AROUND_SUCCESS, users } }
    function failure(error) { return { type: locationConstants.GET_USERS_AROUND_FAILURE, error } }
}


function getLocationDetails(place_id) {
    return (dispatch,getState) => {

        dispatch(request());
        axios.get('https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
            key: PLACES_API_KEY,
            placeid: place_id,
            language: 'en',
          }))
        .then((result)=>{
            if (result.data.status==="OK"){
                dispatch(success(result.data.result.geometry.location));
            } else {
                console.log(result)
                dispatch(success([]));
            }
            
        }).catch(err=>{
            dispatch(failure(err));
        });
    };

    function request() { return { type: locationConstants.LOCATION_DETAILS_REQUEST } }
    function success(location) { return { type: locationConstants.LOCATION_DETAILS_SUCCESS, location } }
    function failure(error) { return { type: locationConstants.LOCATION_DETAILS_FAILURE, error } }
}
