export const setUser = user => {
    return {
        type: 'SET_USER',
        payload: user
    };
};

export const clearUser = () => {
    return {
        type: 'CLEAR_USER'
    };
};

export const addFriendRequest = request => {
    return {
        type: 'ADD_FRIEND_REQUEST',
        payload: request
    };
};

export const setFriendRequests = requests => {
    return {
        type: 'SET_FRIEND_REQUESTS',
        payload: requests
    };
};

export const removeFriendRequest = requestId => {
    return {
        type: 'REMOVE_FRIEND_REQUEST',
        payload: {id: requestId}
    };
};

export const addFriend = request => {
    return {
        type: 'ADD_FRIEND',
        payload: request
    };
};

export const setFriend= requests => {
    return {
        type: 'SET_FRIEND',
        payload: requests
    };
};

export const removeFriend = requestId => {
    return {
        type: 'REMOVE_FRIEND',
        payload: {id: requestId}
    };
};