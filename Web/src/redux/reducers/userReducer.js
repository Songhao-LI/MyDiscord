const initialState = {
    currentUser: {
        username: null,
        email: null,
        phoneNumber: null,
        password: null,
        isLogin: false
    },
    friendRequests: []  // Initialize friendRequests as a separate array
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
                },
                friendRequests: []  // Clear friendRequests when clearing user
            };
        case 'ADD_FRIEND_REQUEST':
            return {
                ...state,
                friendRequests: [...state.friendRequests, action.payload]
            };
        case 'REMOVE_FRIEND_REQUEST':
            return {
                ...state,
                friendRequests: state.friendRequests.filter(request => request.id !== action.payload.id)
            };
        case 'SET_FRIEND_REQUESTS':
            return {
                ...state,
                friendRequests: action.payload
            };
        default:
            return state;
    }
};

export default userReducer;
