// reducers/popupReducer.js
const initialState = {
    showLoginPopup: false,
    showRegisterPopup: false,
    showEditPopup: false,
    showFriendRequestPopup: false
};

const popupReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_LOGIN_POPUP':
            return {
                ...state,
                showLoginPopup: !state.showLoginPopup
            };
        case 'TOGGLE_REGISTER_POPUP':
            return {
                ...state,
                showRegisterPopup: !state.showRegisterPopup
            };
        case 'TOGGLE_EDIT_POPUP':
            return {
                ...state,
                showEditPopup: !state.showEditPopup
            };
        case 'TOGGLE_FRIENDS_POPUP':
            return {
                ...state,
                showFriendRequestPopup: !state.showFriendRequestPopup
            };
        default:
            return state;
    }
};

export default popupReducer;
