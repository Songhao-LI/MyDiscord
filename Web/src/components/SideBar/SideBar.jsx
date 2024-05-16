import { BsPlus, BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import { FaFire, FaPoo } from 'react-icons/fa';
import { SlUserFollow } from "react-icons/sl";
import { MdAssignmentAdd } from "react-icons/md";
import {toggleSenderPopup, toggleThreadPopup} from "../../redux/actions/popupActions.js";
import {useDispatch} from "react-redux";

const SideBar = () => {
    const dispatch = useDispatch();
    const friendRequestHandler = () => {
        dispatch(toggleSenderPopup(true));
    }
    const createThread = () => {
        dispatch(toggleThreadPopup(true));
    }

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg">
        <SideBarIcon icon={<FaFire size="28" />} text={'Home'}/>
        <Divider />
        <SideBarIcon icon={<BsPlus size="32" />} text={'Send Friend Request'} handler={friendRequestHandler}/>
        <SideBarIcon icon={<SlUserFollow size="25"/>} text={'Join a Block'}/>
        <SideBarIcon icon={<MdAssignmentAdd size="25"/>} text={'Create new Thread'} handler={createThread}/>
        <Divider />
        <SideBarIcon icon={<BsGearFill size="22" />} />
    </div>
  );
};

const SideBarIcon = ({ icon, text, handler = () => {}}) => (


  <div className="sidebar-icon group" onClick={handler}>
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">
      {text}
    </span>
  </div>
);


const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
