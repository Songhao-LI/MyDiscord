import React, {useState} from "react";
import { IoCloseOutline } from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {toggleFriendsPopup} from "../../redux/actions/popupActions.js";
import AOS from "aos";
import axios from "axios";
import {removeFriendRequest} from "../../redux/actions/userActions.js";

// eslint-disable-next-line react/prop-types
const FriendRequest = () => {
    const showFriendRequestPopup = useSelector(state => state.popups.showFriendRequestPopup);
    const friend_requests = useSelector(state => state.user.friendRequests);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const close = () => {
        dispatch(toggleFriendsPopup());
    }
    const acceptRequest = async (request) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/friendrequests/accept/', { req_id: request.id });
            dispatch(removeFriendRequest(request.id));
            console.log(response.data);
        } catch (error) {
            console.error('Error accepting request:', error);
        } finally {
            setLoading(false);
        }
    }

    const declineRequest = async (request) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/friendrequests/reject/', { req_id: request.id });
            dispatch(removeFriendRequest(request.id));
            console.log(response.data);
        } catch (error) {
            console.error('Error declining request:', error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        AOS.init({
            duration: 500,
            easing: "ease-in-sine",
            delay: 100,
            offset: 100,
        });
        AOS.refresh();
        setLoading(false)
    }, []);

    return (
        <>
            {showFriendRequestPopup && (
                <div>
                    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
                        <div className="max-h-[80%] overflow-y-scroll scrollbar-hidden w-1/2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
                            {/* Header secton */}
                            <div className="flex items-center justify-between">
                                <h1>Friend Requests</h1>
                                <div>
                                    <IoCloseOutline
                                        onClick={close}
                                        className="text-2xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Form secton */}
                            <div className="mt-4 mb-8 flex flex-col justify-center justify-items-center">
                                {loading ? (
                                    <div id="loading" aria-label="Loading..." role="status" className="pt-4 flex flex-col items-center space-x-2">
                                        <svg className="h-40 w-40 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                                            <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="24"></line>
                                            <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="24"></line>
                                            <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                                            </line>
                                            <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="24"></line>
                                            <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                                            </line>
                                            <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="24"></line>
                                            <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="24"></line>
                                            <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="24">
                                            </line>
                                        </svg>
                                        <span className="text-4xl font-medium text-gray-500">Loading...</span>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="dark:text-slate-500">
                                            <h1 className="text-center text-xl font-bold dark:text-white text-black">Friend Requests:</h1>
                                        </div>
                                        <section className="py-2">
                                            <div className="mx-auto max-w-6xl p-6">
                                                <ul>
                                                    {friend_requests.map(request => (
                                                        <li key={request.id}
                                                            className="dark:shadow-cyan-500/50 shadow-xl mb-4 p-3 dark:bg-gray-500 bg-white shadow-lg hover:shadow-xl rounded-xl hover:transform hover:scale-105 duration-300">
                                                            <div
                                                                className="flex justify-between items-center space-x-4">
                                                                <img
                                                                    src={`https://avatars.dicebear.com/api/open-peeps/1.svg`}
                                                                    alt=''
                                                                    className="h-10 w-10 object-cover rounded-xl"/>
                                                                <div>
                                                                    <span>User: {request.sender_uID} send a friend request to you!</span>
                                                                </div>
                                                                <div className="flex space-x-4">
                                                                    <button onClick={() => acceptRequest(request)}
                                                                        className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out">Accept
                                                                    </button>
                                                                    <button onClick={() => declineRequest(request)}
                                                                        className="px-4 py-1.5 bg-primary text-gray-300 rounded hover:bg-red-600 transition duration-300 ease-in-out">Decline
                                                                    </button>
                                                                </div>

                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FriendRequest;