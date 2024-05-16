import TopNavigation from '../TopNavigation/TopNavigation.jsx';
import { BsPlusCircleFill } from 'react-icons/bs';
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import axios from "axios";
import {addMessage} from "../../redux/actions/sessionActions.js";

const ContentContainer = () => {
    const messages = useSelector(state => state.session.messages);
    console.log(messages);

    return (
        <div className='content-container h-screen'>
            <TopNavigation />
            <div className='content-list hide-scrollbar space-y-6 pl-0 mt-3'> {/* Adjust left padding here */}
                {messages.map((msg, index) => (
                    <>
                        <Post name={msg.name} timestamp={msg.timestamp} text={msg.text_body} />
                        <div className='w-full bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-full'/>
                    </>
                ))}
            </div>
            <BottomBar/>
        </div>
    );
};

const Divider = () => <hr className="sidebar-hr"/>;
const BottomBar = () => {
    const user = useSelector(state => state.user.currentUser);
    const thread_id = useSelector(state => state.session.thread_title);
    const cur_type = useSelector(state => state.session.cur_type);
    const cur_id = useSelector(state => state.session.cur_index);
    const [permission, setPermission] = useState(false);
    const [message, setMessage] = useState('');  // State to store the input value
    const dispatch = useDispatch();
    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    if (cur_type === 2 && user.hood_id === cur_id) {
        setPermission(true)
    }
    if (cur_type === 0 && user.block_id === cur_id) {
        setPermission(true)
    }

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter' && message.trim() !== '') {
            try {
                const response = await axios.post('/api/messages/reply/', {
                    thread_id: thread_id,  // Example thread_id, replace as necessary
                    title: `Re: Thread ` + thread_id,
                    text_body: message,
                    longitude: null,
                    latitude: null,
                    author_id: user.uID
                });
                dispatch(addMessage({
                    name: user.username,
                    timestamp: new Date().toLocaleTimeString (),
                    text_body: message
                }))

                console.log("Reply posted:", response.data);
                setMessage('');  // Clear input after sending
            } catch (error) {
                console.error("Error posting reply:", error);
            }
        }
    };
    // TODO: permission
    return (
        <>
        {permission && (
        <div className='bottom-bar flex items-center'>
            <PlusIcon />
            <input type='text' placeholder='Enter message...' className='bottom-bar-input flex-1 p-2' value={message} onChange={handleInputChange} onKeyPress={handleKeyPress}/>
        </div>
        )}
        </>
    );
}

const Post = ({ name, timestamp, text }) => {
    const seed = Math.round(Math.random() * 100);
    return (
        <div className='post pl-0 flex items-start justify-start ml-5'> {/* Adjust left padding here */}
            <div className='avatar-wrapper flex justify-start'>
                <img src={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg`} alt='' className='avatar'/>
            </div>

            <div className='post-content ml-5'>
                <p className='post-owner'>
                    {name}
                    <small className='timestamp'>{timestamp}</small>
                </p>
                <p className='post-text'>{text}</p>
            </div>
        </div>
    );
};

const PlusIcon = () => (
    <BsPlusCircleFill size='22' className='text-green-500 dark:shadow-lg mx-2 dark:text-primary' />
);

export default ContentContainer;
