import React, { useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname for current path detection
import { FaHome, FaTrash, FaRecycle, FaUser } from "react-icons/fa";

const Sidebar = () => {
    const pathname = usePathname(); // Get the current path
    const [is3ROpen, setIs3ROpen] = useState(false);

    const toggle3RMenu = () => {
        setIs3ROpen(!is3ROpen);
    };

    const isActive = (path) => pathname === path ? "bg-[#2DC653] text-primary-content" : "";

    return (
        <div className="h-screen w-64 bg-base-200 shadow-lg flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 bg-[#2DC653] text-primary-content text-xl font-bold">
                Dashboard
            </div>

            {/* Menu Items */}
            <ul className="menu p-4 flex-grow text-[#000000] gap-1 text-lg font-semibold w-full">
                <li className={isActive("/dashboard/home")}>
                    <a href="/dashboard/home" className="flex items-center">
                        <FaHome className="mr-2" /> Home
                    </a>
                </li>

                <li className={isActive("/dashboard/my-waste")}>
                    <a href="/dashboard/my-waste" className="flex items-center">
                        <FaTrash className="mr-2" /> My Waste
                    </a>
                </li>

                <li className={pathname.startsWith("/dashboard/3r") ? "bg-[#2DC653] text-primary-content" : ""}>
                    <a href="/dashboard/3r" className="flex items-center">
                        <FaRecycle className="mr-2" /> 3R
                    </a>
                </li>

                <li className={isActive("/dashboard/profile")}>
                    <a href="/dashboard/profile" className="flex items-center">
                        <FaUser className="mr-2" /> Profile
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;