// src/redux/actions/sessionActions.js
export const addMessage = (message) => ({
    type: 'ADD_MESSAGE',
    payload: message
});

export const setMessages = (messages) => ({
    type: 'SET_MESSAGES',
    payload: messages
});

export const setThreadTitle = (title) => ({
    type: 'SET_THREAD_TITLE',
    payload: title
});

export const setCurType = (type) => ({
    type: 'SET_CUR_TYPE',
    payload: type
});

export const setCurIndex = (index) => ({
    type: 'SET_CUR_ID',
    payload: index
});