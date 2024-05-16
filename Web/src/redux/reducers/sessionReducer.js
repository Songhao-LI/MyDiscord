// src/redux/reducers/sessionReducer.js
const initialState = {
    messages: [
        {
            name: 'Ryan',
            timestamp: 'one week ago',
            text_body: 'test message 1. test message 1.test message 1.test message 1.test message 1.test message 1.'
        },
        {
            name: 'Rocky',
            timestamp: 'one week ago',
            text_body: 'test message 1.test message 1.test message 1.test message 1.test message 1.test message 1.test message 1.'
        },
        {
            name: 'Priyanshi',
            timestamp: '5 days ago',
            text_body: 'test message 1.test message 1.test message 1.test message 1.test message 1.test message 1.'
        },
        {
            name: 'Torsten Suel',
            timestamp: 'Just now',
            text_body: 'Good Job!'
        }
    ],
    thread_title: 'neighbors 1'
};

function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload
            };
        case 'SET_THREAD_TITLE':
            return {
                ...state,
                thread_title: action.payload
            };
        default:
            return state;
    }
}

export default sessionReducer;
