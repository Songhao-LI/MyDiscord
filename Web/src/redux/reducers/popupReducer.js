// reducers/popupReducer.js
const initialState = {
    showLoginPopup: false,
    showRegisterPopup: false
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
        default:
            return state;
    }
};

export default popupReducer;
