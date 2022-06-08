import axios from "axios";
import {messageConstants} from '../constants'
import { ENDPOINT,ONESIGNAL_APP_ID } from 'react-native-dotenv';
import authHead from "../helpers/authHead";

export const messageActions = {
    sendMessage,
    viewThread,
    viewInbox,
    setBadge
};

function sendMessage(data) {
    return (dispatch,getState) => {
        dispatch(request());
        console.log('triggered')
        axios.post(ENDPOINT + '/message/write', {
            ...data,
        },
        authHead(getState))
        .then((result) => {
            dispatch(success(result.data.threadId));
        })
        .catch(err=>{
            console.log(err);
            dispatch(failure(err));
        });
    };

    function request() { return { type: messageConstants.SEND_MESSAGE_REQUEST, message:data.lastMessage } }
    function success(threadId) { return { type: messageConstants.SEND_MESSAGE_SUCCESS, threadId } }
    function failure(error) { return { type: messageConstants.SEND_MESSAGE_FAILURE, error } }
}

function viewThread(threadId,initial) {
    return (dispatch,getState) => {
        dispatch(request());
        axios.get(ENDPOINT + '/message/thread/'+threadId, 
        authHead(getState))
        .then((result) => {
            dispatch(success(result.data));
        })
        .catch(err=>{
            console.log(err);
            dispatch(failure(err));
        });
    };

    function request() { return { type: messageConstants.VIEW_THREAD_REQUEST, initial } }
    function success(messages) { return { type: messageConstants.VIEW_THREAD_SUCCESS,messages,threadId  } }
    function failure(error) { return { type: messageConstants.VIEW_THREAD_FAILURE, error } }
}

function viewInbox(userId) {
    return (dispatch,getState) => {
        dispatch(request());

        axios.get(ENDPOINT + '/message/inbox/'+userId, 
        authHead(getState))
        .then((result) => {
            dispatch(success(result.data));
        })
        .catch(err=>{
            console.log(err);
            dispatch(failure(err));
        });
    };

    function request() { return { type: messageConstants.VIEW_INBOX_REQUEST } }
    function success(threads) { return { type: messageConstants.VIEW_INBOX_SUCCESS,threads }  }
    function failure(error) { return { type: messageConstants.VIEW_INBOX_FAILURE, error } }
}
function setBadge(val){
    return (dispatch,getState) => {
        dispatch({type: messageConstants.SET_MESSAGE_BADGE,val})
        if (val===0){
            const data = {
                body: {
                  content_available: true,
                  ios_badgeType: "SetTo",
                  ios_badgeCount: 0
                },
                userId:getState().user.user._id
            }
            axios.post(ENDPOINT + '/device/send', {
                ...data,
            },
            authHead(getState))
            .catch(err=>{
                console.log(err);
            });
        }
    }
} 