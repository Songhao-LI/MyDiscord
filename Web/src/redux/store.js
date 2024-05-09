import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import popupReducer from "./reducers/popupReducer.js";

const rootReducer = combineReducers({
    user: userReducer,
    popups: popupReducer
});

const store = createStore(rootReducer);

export default store;
