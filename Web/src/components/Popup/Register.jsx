import React, {useState} from "react";
import { IoCloseOutline } from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {toggleLoginPopup, toggleRegisterPopup} from "../../redux/actions/popupActions.js";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const Register = () => {
    const [name, setName] = useState("");
    const [profile, setProfile] = useState("");
    const [photo, setPhoto] = useState("");
    const [password, setPassword] = useState("");
    const [longitude, setLongitude] = useState(null);
    const [hood_id, setHood_id] = useState(null);
    const [block_id, setBlock_id] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const registerPopup = useSelector(state => state.popups.showRegisterPopup);
    const dispatch = useDispatch();

    const handleProfileChange = (event) => {
        setProfile(event.target.value);
    };
    const handlePhotoChange = (event) => {
        setPhoto(event.target.value);
    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleLongitudeChange = (event) => {
        setLongitude(event.target.value);
    };
    const handleLatitudeChange = (event) => {
        setLatitude(event.target.value);
    };
    const handleBlockChange = (event) => {
        setBlock_id(event.target.value);
    };
    const handleHoodChange = (event) => {
        setHood_id(event.target.value);
    };

    const registerNow = () => {
        axios.post('/api/users/', {
            block_id: Number(block_id),
            hood_id: Number(hood_id),
            username: name,
            password: password,
            profile: profile,
            photo: photo,
            home_longitude: longitude,
            home_latitude: latitude
        }).then((response) => {
            console.log('Register successful:', response.data);
            dispatch(toggleRegisterPopup());
            alert('Register success!');
        }).catch((error) => {
            alert('Register failed: invalid input');
            if (error.response) {
                console.error('Register failed:', error.response.data);
            } else if (error.request) {
                console.error('No response:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        });
    };

    const googleRegister = () => {
        console.log('Google')
    }

    const closeRegisterPopup = () => {
        // create an account
        dispatch(toggleRegisterPopup());
    }


    return (
        <>
            {registerPopup && (
                <div>
                    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
                        <div
                            className="w-[800px] fixed max-h-[80%] overflow-y-scroll scrollbar-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
                            {/* Header secton */}
                            <div className="flex items-center flex-row-reverse">
                                <div>
                                    <IoCloseOutline
                                        onClick={closeRegisterPopup}
                                        className="text-2xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* main secton */}
                            <div className="container flex flex-col mx-auto rounded-lg pt-12">
                                <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
                                    <div className="flex items-center justify-center w-full lg:p-12 ">
                                        <div className="flex items-center xl:p-10">
                                            <form
                                                className="flex flex-col w-full h-full pb-6 text-center rounded-3xl">
                                                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                                                    REGISTER
                                                </h3>
                                                <p className="mb-4 text-slate-400">Join our community and connect with
                                                    others.!</p>
                                                <a onClick={googleRegister}
                                                   className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-green-200 dark:bg-slate-700 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300">
                                                    <img className="h-5 mr-2"
                                                         src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                                                         alt=""/>
                                                    Sign up with Google
                                                </a>
                                                <div className="flex items-center mb-3">
                                                    <hr className="h-0 border-b border-solid border-grey-500 grow"/>
                                                    <p className="mx-4 text-grey-600">or</p>
                                                    <hr className="h-0 border-b border-solid border-grey-500 grow"/>
                                                </div>
                                                <label htmlFor="name"
                                                       className="mb-2 text-sm text-start text-grey-900">Name*</label>
                                                <input id="name" type="name" placeholder="your name"
                                                       value={name} onChange={handleNameChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label htmlFor="password"
                                                       className="mb-2 text-sm text-start text-grey-900">Password*</label>
                                                <input id="password" type="password" placeholder="Set up your password"
                                                       value={password} onChange={handlePasswordChange}
                                                       className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-800 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label
                                                    className="mb-2 text-sm text-start text-grey-900">Profile*</label>
                                                <input id="profile" placeholder="Enter your profile"
                                                       value={profile} onChange={handleProfileChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label
                                                    className="mb-2 text-sm text-start text-grey-900">Photo*</label>
                                                <input id="profile" placeholder="Enter your avatar url"
                                                       value={photo} onChange={handlePhotoChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label
                                                    className="mb-2 text-sm text-start text-grey-900">Longitude(optional)</label>
                                                <input type="number" id="longitude"
                                                       placeholder="Enter your home longitude"
                                                       value={longitude} onChange={handleLongitudeChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label
                                                    className="mb-2 text-sm text-start text-grey-900">Latitude(optional)</label>
                                                <input type="number" id="longitude"
                                                       placeholder="Enter your home longitude"
                                                       value={latitude} onChange={handleLatitudeChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label
                                                    className="mb-2 text-sm text-start text-grey-900">Block id</label>
                                                <input type="number" id="longitude"
                                                       placeholder="Enter your block_id"
                                                       value={block_id} onChange={handleBlockChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>
                                                <label
                                                    className="mb-2 text-sm text-start text-grey-900">Hood id</label>
                                                <input type="number" id="longitude"
                                                       placeholder="Enter your hood_id"
                                                       value={hood_id} onChange={handleHoodChange}
                                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-800 mb-7 placeholder:text-grey-700 bg-gray-200 dark:bg-gray-800 text-dark-grey-900 rounded-2xl"/>

                                                <button onClick={registerNow} type="button"
                                                        className="w-full px-6 py-5 mt-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-primary">
                                                    Sign Up
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;
