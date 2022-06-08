import {messageConstants} from '../constants';

export default function message (state = {
    threads : [],
    messages: [],
    fetchingThreads: false,
    fetchingMessages: false,
    sendingMessage: false,
    messageSent: false,
    messageBadge: 0
}, action) {
    switch (action.type) {
        case messageConstants.VIEW_INBOX_REQUEST:
            return {
                ...state,
                fetchingThreads: true
            };
        case messageConstants.VIEW_INBOX_SUCCESS:
            return {
                ...state,
                fetchingThreads: false,
                threads: action.threads
            };
        case messageConstants.VIEW_INBOX_FAILURE:
            return {
                ...state,
                fetchingThreads: false
            };
        case messageConstants.VIEW_THREAD_REQUEST:
            return {
                ...state,
                fetchingMessages: true,
                messages: action.initial? []:state.messages
            };
        case messageConstants.VIEW_THREAD_SUCCESS:
            return {
                ...state,
                fetchingMessages: false,
                messages: action.messages,
                threadId: action.threadId,
            };
        case messageConstants.VIEW_THREAD_FAILURE:
            return {
                ...state,
                fetchingMessages: false,
            };

        case messageConstants.SEND_MESSAGE_REQUEST:
            return {
                ...state,
                sendingMessage: true,
                messageSent: false,
                messages: [{
                    message: action.message,
                    senderId: "",
                    timestamp: "Sending...",
                    },
                    ...state.messages
                ]
            };
        case messageConstants.SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                messageSent: true,
                threadId: action.threadId,
                sendingMessage: false,
            };
        case messageConstants.SEND_MESSAGE_FAILURE:
            return {
                ...state,
                sendingMessage: false,
            };
        case messageConstants.SET_MESSAGE_BADGE:
            return {
                ...state,
                messageBadge: action.val===0?0:action.val + state.messageBadge
            }
        default:
            return state
    }
}