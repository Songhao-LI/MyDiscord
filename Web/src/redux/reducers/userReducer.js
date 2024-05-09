const initialState = {
    currentUser: {
        username: null,
        email: null,
        phoneNumber: null,
        password: null,
        isLogin: false
    }
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                currentUser: {
                    ...action.payload,
                    isLogin: true
                }
            };
        case 'CLEAR_USER':
            return {
                ...state,
                currentUser: {
                    ...initialState.currentUser
                }
            };
        default:
            return state;
    }
};

export default userReducer;