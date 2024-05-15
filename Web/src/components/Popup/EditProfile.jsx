import React, {useState} from "react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "../Shared/Button.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {useDispatch, useSelector} from "react-redux";
import {toggleEditPopup, toggleLoginPopup} from "../../redux/actions/popupActions.js";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const EditProfile = () => {
    const showEditPopup = useSelector(state => state.popups.showEditPopup);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser);
    const [username, setUsername] = useState(user.username);
    const [profile, setProfile] = useState(user.profile);
    const [photo, setPhoto] = useState(user.photo);

    const close = () => {
        dispatch(toggleEditPopup());
    }
    const handleProfileChange = (event) => {
        setProfile(event.target.value);
    };
    const handlePhotoChange = (event) => {
        setPhoto(event.target.value);
    };

    React.useEffect(() => {
        setUsername(user.username);
        setPhoto(user.photo);
        setProfile(user.profile)
    }, [user]);

    const submit = () => {
        const updateData = {
            profile: profile,
            photo: photo
        };

        axios.patch(`http://localhost:8000/api/users/${user.uID}/`, updateData)
            .then(response => {
                console.log('Update successful:', response.data);
                dispatch(toggleEditPopup());  // Optionally close the popup on success
            })
            .catch(error => {
                console.error('Failed to update user:', error.response.data);
            });
    }
    return (
        <>
            {showEditPopup && (
                <div>
                    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
                        <div className="w-1/3 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
                            {/* Header secton */}
                            <div className="flex items-center justify-between">
                                <h1>My User Info</h1>
                                <div>
                                    <IoCloseOutline
                                        onClick={close}
                                        className="text-2xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Form secton */}
                            <div className="mt-4 flex flex-col ">
                                <div>
                                    <label htmlFor="username"
                                           className="mb-2 text-sm text-start text-grey-900">Username: </label>
                                    <input
                                        type="username"
                                        value={username}
                                        disabled
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="Profile"
                                           className="mb-2 text-sm text-start text-grey-900">Profile: </label>
                                    <input
                                        type="username"
                                        value={profile}
                                        onChange={handleProfileChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="Profile"
                                           className="mb-2 text-sm text-start text-grey-900">Photo: </label>
                                    <input
                                        type="username"
                                        value={photo}
                                        onChange={handlePhotoChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        text="Update"
                                        bgColor={"bg-primary"}
                                        textColor={"text-white"}
                                        handler={submit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditProfile;