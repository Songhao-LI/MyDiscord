import React, {useState} from "react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "../Shared/Button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {toggleEditPopup, toggleLoginPopup, toggleSenderPopup} from "../../redux/actions/popupActions.js";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const RequestSender = () => {
    const showRequestSenderPopup = useSelector(state => state.popups.showRequestSenderPopup);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser);
    const [uID, setUserID] = useState(null);

    const close = () => {
        dispatch(toggleSenderPopup(false));
    }
    const handleUserChange = (event) => {
        setUserID(event.target.value);
    };
    const submit = () => {
        axios.post(`http://localhost:8000/api/friendrequests/`, {
            "sender_uID": user.uID,
            "receiver_uID": uID
        })
            .then(response => {
                console.log('send request successful:', response.data);
                dispatch(toggleSenderPopup(false));
            })
            .catch(error => {
                alert('error.response.data.message')
                console.error('Failed to send request:', error.response.data);
            });
    }
    return (
        <>
            {showRequestSenderPopup && (
                <div>
                    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
                        <div className="w-1/4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
                            {/* Header secton */}
                            <div className="flex items-center justify-between">
                                <h1>Send a Friend Request</h1>
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
                                           className="mb-2 text-sm text-start text-grey-900">user id: </label>
                                    <input
                                        type="username"
                                        value={uID}
                                        onChange={handleUserChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        text="Send Now"
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

export default RequestSender;