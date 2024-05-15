import React, {useState} from "react";
import { IoCloseOutline } from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {toggleFriendsPopup} from "../../redux/actions/popupActions.js";
import AOS from "aos";

// eslint-disable-next-line react/prop-types
const FriendRequest = () => {
    const showFriendRequestPopup = useSelector(state => state.popups.showFriendRequestPopup);
    const friendRequests = useSelector(state => state.popups.friendRequests);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const close = () => {
        dispatch(toggleFriendsPopup());
    }

    React.useEffect(() => {
        AOS.init({
            duration: 500,
            easing: "ease-in-sine",
            delay: 100,
            offset: 100,
        });
        AOS.refresh();
    }, []);

    return (
        <>
            {showFriendRequestPopup && (
                <div>
                    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
                        <div className="w-1/2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
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
                                            <h1 className="text-center text-xl font-bold dark:text-white text-black">Search Results for:</h1>
                                        </div>
                                        <section className="py-10">
                                            <div className="mx-auto max-w-6xl p-6">
                                                <ul>
                                                     <li data-aos="fade-up"
                                                         className="dark:shadow-cyan-500/50 shadow-xl mb-4 p-3 dark:bg-gray-500 bg-white shadow-lg hover:shadow-xl rounded-xl hover:transform hover:scale-105 duration-300">
                                                         <div className="flex items-center space-x-4">
                                                             <img
                                                                 src={`https://avatars.dicebear.com/api/open-peeps/1.svg`}
                                                                 alt='' className="h-20 w-20 object-cover rounded-xl"/>
                                                             <div className="flex flex-col">
                                                             </div>
                                                         </div>
                                                     </li>
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