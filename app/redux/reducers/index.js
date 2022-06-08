
import { combineReducers } from "redux";
import user from './userReducers.js'
import pet from './petReducers.js'
import location from './locationReducers.js'
import message from './messageReducers.js'


const rootReducer = combineReducers({
    user,
    pet,
    location,
    message
});
export default rootReducer;