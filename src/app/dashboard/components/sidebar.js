import React, { useState } from "react";
import { FaBaby, FaHome, FaRecycle, FaShoppingCart, FaTrash, FaUser } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const Sidebar = () => {
    const [is3ROpen, setIs3ROpen] = useState(false);

    const toggle3RMenu = () => {
        setIs3ROpen(!is3ROpen);
    };

    return (
        <div className="h-screen w-64 bg-base-200 shadow-lg flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 bg-[#2DC653] text-primary-content text-xl font-bold">
                Dashboard
            </div>

            {/* Menu Items */}
            <ul className="menu p-4 flex-grow text-[#000000] gap-1 text-lg font-semibold w-full">
                <li>
                    <a href="/dashboard/home" className="flex items-center">
                        <FaHome className="mr-2" /> Home
                    </a>
                </li>

                <li>
                    <a href="/dashboard/my-waste" className="flex items-center">
                        <FaTrash className="mr-2" /> My Waste
                    </a>
                </li>
                
                <li>
                    <a href="/dashboard/3r" className="flex items-center">
                        <FaRecycle className="mr-2" />3R
                    </a>
                </li>
                
                {/* 3R Dropdown */}
                {/* <li>
                    <div 
                        onClick={toggle3RMenu}
                        className="flex items-center justify-between cursor-pointer "
                    >
                        <div className="flex items-center">
                            <FaRecycle className="mr-4" /> 3R
                        </div>
                        {is3ROpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </div>
                    {is3ROpen && (
                        <ul className="ml-6 mt-1 space-y-2">
                            <li>
                                <a href="/dashboard/3r/reduce" className="text-sm">
                                    Reduce
                                </a>
                            </li>
                            <li>
                                <a href="/dashboard/3r/reuse" className="text-sm">
                                    Reuse
                                </a>
                            </li>
                            <li>
                                <a href="/dashboard/3r/recycle" className="text-sm">
                                    Recycle
                                </a>
                            </li>
                        </ul>
                    )}
                </li> */}

                <li>
                    <a href="/dashboard/sell" className="flex items-center">
                        <FaShoppingCart className="mr-2" /> Sell
                    </a>
                </li>
                <li>
                    <a href="/dashboard/profile" className="flex items-center">
                        <FaUser className="mr-2" /> Profile
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;