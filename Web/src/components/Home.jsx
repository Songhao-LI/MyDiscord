import Channelbar from './ChannelBar';
import ContentContainer from './ContentContainer';
import SideBar from './SideBar';

import AOS from "aos";
import "aos/dist/aos.css";
import React from "react";

// eslint-disable-next-line react/prop-types
const Home = () => {
    React.useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
            offset: 100,
        });
        AOS.refresh();
    }, []);

    return (
        <div className="flex">
            <SideBar/>
            <Channelbar/>
            <ContentContainer/>
        </div>
    );
};

export default Home;

