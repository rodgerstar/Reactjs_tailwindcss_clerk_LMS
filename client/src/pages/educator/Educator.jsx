import React from "react";

import {Outlet} from "react-router-dom";
import Navbar from "../../Components/educator/Navbar.jsx";
import Sidebar from "../../Components/educator/Sidebar.jsx";
import Footer from "../../Components/educator/Footer.jsx";


const Educator = () => {
    return (
        <div className='text-default min-h-screen bg-white'>
            <Navbar/>
            <div className='flex'>
                <Sidebar/>
                <div className='flex-1'>
                    {<Outlet/>}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Educator