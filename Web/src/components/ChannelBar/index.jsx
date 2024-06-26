import React, { useState } from 'react';
import { BsHash } from 'react-icons/bs';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setCurIndex, setCurType, setMessages, setThreadTitle} from "../../redux/actions/sessionActions.js";


const ChannelBar = () => {
    const neighbors = useSelector(state => state.user.neighbors);
    const friendships  = useSelector(state => state.user.friends);
    const hoods = useSelector(state => state.user.hoods);
    const [friends, setFriends] = useState([]);

    const getUserInfo = async () => {
        const friend_info = []
        for (let i = 0; i < friendships.length; i++) {
            const response = await axios.get('/api/users/' + friendships[i].toString() + '/');
            friend_info.push({
                feed_type: 1,
                name: response.data.username,
                id: i
            })
        }
        setFriends(friend_info)
    }

    React.useEffect(() => {
        getUserInfo().then(r => {})
    }, [friendships]);

    return (
    <div className='channel-bar shadow-lg'>
      <ChannelBlock />
      <div className='channel-container'>
        <Dropdown header='neighbor feeds ' selections={neighbors} />
        <Dropdown header='friend feeds ' selections= {friends} />
        <Dropdown header='hood feeds ' selections={hoods} />
      </div>
    </div>
    );
};

const Dropdown = ({ header, selections }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className='dropdown'>
      <div onClick={() => setExpanded(!expanded)} className='dropdown-header'>
        <ChevronIcon expanded={expanded} />
        <h5
          className={expanded ? 'dropdown-header-text-selected' : 'dropdown-header-text'}
        >
          {header}
        </h5>
        <FaPlus size='12' className='text-accent text-opacity-80 my-auto ml-auto' />
      </div>
      {expanded &&
        selections &&
        selections.map((selection, index) => <TopicSelection key={index} selection={selection} />)}
    </div>
  );
};

const ChevronIcon = ({ expanded }) => {
  const chevClass = 'text-accent text-opacity-80 my-auto mr-1';
  return expanded ? (
    <FaChevronDown size='14' className={chevClass} />
  ) : (
    <FaChevronRight size='14' className={chevClass} />
  );
};

const TopicSelection = ({ selection }) => {
    const dispatch = useDispatch();
    const handleClick = async () => {
        const url = `/api/messages/get_message_by_thread/?feed_type=${selection.feed_type}&feed_type_id=${selection.id}`;
        try {
            const response = await axios.get(url);
            console.log("Messages fetched:", response.data);
            dispatch(setMessages(response.data.messages));
            dispatch(setThreadTitle(response.data.thread_ids))

            dispatch(setCurType(selection.feed_type));
            dispatch(setCurIndex(selection.feed_type_id));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    return (
        <div className='dropdown-selection' onClick={handleClick}>
            <BsHash size='24' className='text-gray-400' />
            <h5 className='dropdown-selection-text'>{selection.name}</h5>
        </div>
    );
}

const ChannelBlock = () => (
  <div className='channel-block'>
    <h5 className='channel-block-text'>Channels</h5>
  </div>
);

export default ChannelBar;
