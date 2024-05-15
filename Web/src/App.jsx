import Home from "./components/Home.jsx";
import Register from "./components/Popup/Register.jsx";
import Login from "./components/Popup/Login.jsx";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import axios from "axios";
import { setUser } from "./redux/actions/userActions.js";
import { toggleLoginPopup } from "./redux/actions/popupActions.js";

const App = () => {
    const user = useSelector(state => state.user.currentUser);
    const loginPopup = useSelector(state => state.popups.showLoginPopup);
    const dispatch = useDispatch();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get('/api/users/current');
                dispatch(setUser(response.data));
                dispatch(toggleLoginPopup());
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching user info:', error.message);
            }
        };
        getUserInfo().then(r => {});
    }, []);
    return (
            <BrowserRouter>
                <Register></Register>
                <Login/>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
    );
};

export default App;
