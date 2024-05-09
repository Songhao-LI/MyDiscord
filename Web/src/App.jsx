import Home from "./components/Home.jsx";
import Register from "./components/Popup/Register.jsx";
import Login from "./components/Popup/Login.jsx";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
    const [loginPopup, setLoginPopup] = React.useState(false);
    const [registerPopup, setRegisterPopup] = React.useState(false);

    const handleLoginPopup = () => {
        setLoginPopup(!loginPopup);
    };
    const handleRegisterPopup = () => {
        setRegisterPopup(!registerPopup);
    };

    return (
        <Provider store={store}>
            <BrowserRouter>
                {/*<Register registerPopup={registerPopup} handleRegisterPopup={handleRegisterPopup}></Register>*/}
                {/*<Login loginPopup={loginPopup} handleLoginPopup={handleLoginPopup} handleRegisterPopup={handleRegisterPopup}/>*/}
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
