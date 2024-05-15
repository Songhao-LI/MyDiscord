import {
    FaSearch,
    FaHashtag,
    FaRegBell,
    FaUserCircle,
    FaMoon,
    FaSun, FaCaretDown,
} from 'react-icons/fa';
import useDarkMode from '../../hooks/useDarkMode';
import {useDispatch, useSelector} from "react-redux";
import Button from "../Shared/Button.jsx";
import {toggleEditPopup, toggleFriendsPopup, toggleLoginPopup} from "../../redux/actions/popupActions.js";
import axios from "axios";
import {clearUser} from "../../redux/actions/userActions.js";

const TopNavigation = () => {
    const current_user = useSelector(state => state.user.currentUser);
    const friend_requests = useSelector(state => state.user.friendRequests);
    const dispatch = useDispatch();


    const handleLogin = () => {
        dispatch(toggleLoginPopup(true))
    }
    const signOutHandler = () => {
        const response = axios.post('/api/users/logout/');
        dispatch(clearUser());
    }
    const editHandler = () => {
        dispatch(toggleEditPopup(true));
    }
    const friendRequestHandler = () => {
        dispatch(toggleFriendsPopup(true));
    }

    return (
        <div className='top-navigation'>
            <HashtagIcon/>
            <Title/>
            <ThemeIcon/>
            <Search/>
            <div onClick={friendRequestHandler}>
                <BellIcon/>
                <div style={{right: '6.5rem'}} className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-2 flex items-center justify-center text-xs">
                    {friend_requests.length}
                </div>
            </div>
            <div className="mr-2">
                {!current_user.isLogin && (
                    <Button className="relative"
                            text="Login"
                            bgColor={"bg-primary"}
                            textColor={"text-white"}
                            handler={handleLogin}
                    />
                )}
                {current_user.isLogin && (
                    <div className="mr-2">
                        {/* Menu Items */}
                        <div className="hidden lg:block ">
                            <ul className="flex items-center gap-4">
                                {/* Dropdown  */}
                                <li className="relative cursor-pointer group">
                                    <div
                                        className="flex items-center gap-[2px] font-semibold text-gray-500 dark:hover:text-white py-2">
                                        <UserCircle/>
                                        <span>
                                    <FaCaretDown className="group-hover:rotate-180 duration-300"/>
                                </span>
                                    </div>
                                    {/* Dropdown Links */}
                                    <div
                                        className="absolute right-0 z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white shadow-md dark:bg-gray-900 p-2 dark:text-white ">
                                        <ul className="space-y-2">
                                            <li>
                                        <span
                                            className="text-gray-500  dark:hover:text-white duration-200 inline-block w-full p-2 hover:bg-primary/20 rounded-md font-semibold">
                                            Account Info
                                        </span>
                                                <span onClick={editHandler}
                                                      className="text-gray-500  dark:hover:text-white duration-200 inline-block w-full p-2 hover:bg-primary/20 rounded-md font-semibold">
                                            Settings
                                        </span>
                                                <span onClick={signOutHandler}
                                                      className="text-gray-500  dark:hover:text-white duration-200 inline-block w-full p-2 hover:bg-primary/20 rounded-md font-semibold">
                                            Sign Out
                                        </span>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ThemeIcon = () => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
    return (
        <span onClick={handleMode}>
      {darkTheme ? (
          <FaSun size='24' className='top-navigation-icon'/>
      ) : (
          <FaMoon size='24' className='top-navigation-icon'/>
      )}
    </span>
    );
};

const Search = () => (
    <div className='search'>
        <input className='search-input' type='text' placeholder='Search...'/>
        <FaSearch size='18' className='text-secondary my-auto'/>
    </div>
);
const BellIcon = () => <FaRegBell size='24' className='top-navigation-icon'/>;
const UserCircle = () => <FaUserCircle size='24' className='top-navigation-icon'/>;
const HashtagIcon = () => <FaHashtag size='20' className='title-hashtag'/>;
const Title = () => <h5 className='title-text'>neighbors1</h5>;

export default TopNavigation;
