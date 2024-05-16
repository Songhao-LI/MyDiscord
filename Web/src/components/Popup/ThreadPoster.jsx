import React, {useState} from "react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "../Shared/Button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    toggleEditPopup,
    toggleLoginPopup,
    toggleSenderPopup,
    toggleThreadPopup
} from "../../redux/actions/popupActions.js";
import axios from "axios";
import {addHood, addNeighbor} from "../../redux/actions/userActions.js";

// eslint-disable-next-line react/prop-types
const ThreadPoster = () => {
    const showThreadPopup = useSelector(state => state.popups.showThreadPopup);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser);
    const hoods = useSelector(state => state.user.hoods);
    const neighbors = useSelector(state => state.user.hoods);
    const [title, setTitle] = useState("");
    const [text_body, setTextBody] = useState("");
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [feed_type, setFeedType] = useState(null);
    const [feed_type_id, setFeedTypeId] = useState(null);

    const close = () => {
        dispatch(toggleThreadPopup(false));
    }
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleLatitudeChange = (event) => {
        setLatitude(event.target.value);
    };
    const handleLongitudeChange = (event) => {
        setLongitude(event.target.value);
    };
    const handleTextChange = (event) => {
        setTextBody(event.target.value);
    };
    const handleFeedTypeChange = (event) => {
        setFeedType(event.target.value);
    };
    const handleFeedIDChange = (event) => {
        setFeedTypeId(event.target.value);
    };
    const submit = () => {
        if (Number(feed_type) === 0) {
            const sz = neighbors.length
            dispatch(addNeighbor({
                id: sz,
                name: title
            }))
        } else if (Number(feed_type) === 2) {
            const sz = hoods.length
            dispatch(addHood({
                id: sz,
                name: title
            }))
        }
        axios.post(`/api/messages/create_thread/`, {
                "title": title,
                "text_body": text_body,
                "longitude": Number(longitude),
                "latitude": Number(latitude),
                "author_id": user.uID,
                "feed_type": Number(feed_type),
                "feed_type_id": Number(feed_type_id),
            })
            .then(response => {
                console.log('send request successful:', response.data);
                dispatch(toggleThreadPopup(false));
            })
            .catch(error => {
                alert('error.response.data.message')
                console.error('Failed to send request:', error.response.data);
            });
    }
    return (
        <>
            {showThreadPopup && (
                <div>
                    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
                        <div className="w-1/4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
                            {/* Header secton */}
                            <div className="flex items-center justify-between">
                                <h1>Create a New Thread</h1>
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
                                           className="mb-2 text-sm text-start text-grey-900">title: </label>
                                    <input
                                        type="username"
                                        value={title}
                                        onChange={handleTitleChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="username"
                                           className="mb-2 text-sm text-start text-grey-900">text body: </label>
                                    <input
                                        type="username"
                                        value={text_body}
                                        onChange={handleTextChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="username"
                                           className="mb-2 text-sm text-start text-grey-900">Longitude: </label>
                                    <input
                                        type="username"
                                        value={longitude}
                                        onChange={handleLongitudeChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="username"
                                           className="mb-2 text-sm text-start text-grey-900">Latitude: </label>
                                    <input
                                        type="username"
                                        value={latitude}
                                        onChange={handleLatitudeChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="username"
                                           className="mb-2 text-sm text-start text-grey-900">feed_type: </label>
                                    <input
                                        type="username"
                                        value={feed_type}
                                        onChange={handleFeedTypeChange}
                                        className="mt-2 w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="username"
                                           className="mb-2 text-sm text-start text-grey-900">feed_type_id: </label>
                                    <input
                                        type="username"
                                        value={feed_type_id}
                                        onChange={handleFeedIDChange}
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

export default ThreadPoster;