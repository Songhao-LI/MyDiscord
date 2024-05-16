const initialState = {
    currentUser: {
        username: null,
        email: null,
        phoneNumber: null,
        password: null,
        isLogin: false
    },
    friendRequests: [],
    friends: []
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
        case 'ADD_FRIEND':
            return {
                ...state,
                friends: [...state.friends, action.payload]
            };
        case 'REMOVE_FRIEND':
            return {
                ...state,
                friends: state.friends.filter(friend => friend.id !== action.payload.id)
            };
        case 'SET_FRIEND':
            return {
                ...state,
                friends: action.payload
            };
        default:
            return state;
    }
};

export default userReducer;
