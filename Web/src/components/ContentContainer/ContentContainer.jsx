import TopNavigation from '../TopNavigation/TopNavigation.jsx';
import { BsPlusCircleFill } from 'react-icons/bs';

const ContentContainer = () => {
    return (
        <div className='content-container h-screen'>
            <TopNavigation />
            <div className='content-list hide-scrollbar space-y-6 pl-0 mt-3'> {/* Adjust left padding here */}
                <Post
                    name='Ryan'
                    timestamp='one week ago'
                    text={`test message 1. test message 1.test message 1.test message 1.test message 1.test message 1.`}
                />
                <div
                    className='w-full bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-full'/>
                <Post name='Rocky' timestamp='one week ago'
                      text={`test message 1.test message 1.test message 1.test message 1.test message 1.test message 1.test message 1.`}/>
                <div
                    className='w-full bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-full'/>
                <Post name='Priyanshi' timestamp='5 days ago'
                      text={`test message 1.test message 1.test message 1.test message 1.test message 1.test message 1.`}/>
                <div
                    className='w-full bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-full'/>
                <Post
                    name='Torsten Suel'
                    timestamp='Just now'
                    text={`Good Job!`}
                />
            </div>
            <BottomBar/>
        </div>
    );
};

const Divider = () => <hr className="sidebar-hr"/>;
const BottomBar = () => (
    <div className='bottom-bar flex items-center'>
        <PlusIcon />
        <input type='text' placeholder='Enter message...' className='bottom-bar-input flex-1 p-2' />
    </div>
);

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
