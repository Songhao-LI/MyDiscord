import Home from "./components/Home.jsx";
import Register from "./components/Popup/Register.jsx";
import Login from "./components/Popup/Login.jsx";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Register></Register>
                <Login/>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
