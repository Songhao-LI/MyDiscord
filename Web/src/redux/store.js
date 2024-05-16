import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import popupReducer from "./reducers/popupReducer.js";
import sessionReducer from "./reducers/sessionReducer.js";

const rootReducer = combineReducers({
    user: userReducer,
    popups: popupReducer,
    session: sessionReducer
});

const store = createStore(rootReducer);

export default store;
