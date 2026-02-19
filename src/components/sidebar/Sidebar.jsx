import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import dashboardIcon from "../../assets/grid.svg";
import userIcon from "../../assets/user-profile.svg";
import teamIcon from "../../assets/users-profiles.svg";
import settingsIcon from "../../assets/settings.svg";
import logoutIcon from "../../assets/power.svg";
import alertCircleImg from '../../assets/alertcircle.png'

function Sidebar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    }

    const handleConfirmLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <div className="w-64 h-screen bg-[#2d2b3a] text-white flex flex-col px-4">


            <div className="h-20 flex items-center border-b border-gray-700">
                <h2>LOGO</h2>
            </div>


            <div className="flex-1 py-6 text-left">
                <p className="text-gray-400 text-xs font-semibold mb-4 tracking-wider">
                    MAIN MENU
                </p>

                <ul className="space-y-3">
                    <li>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition duration-200 !text-gray-300 !font-normal"
                        >
                            <img
                                src={dashboardIcon}
                                alt="Dashboard"
                                className="w-5 h-5 object-contain"
                            />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/users"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition duration-200 !text-gray-300 !font-normal"
                        >
                            <img
                                src={userIcon}
                                alt="User Management"
                                className="w-5 h-5 object-contain"
                            />
                            <span>User Management</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/team"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition duration-200 !text-gray-300 !font-normal"
                        >
                            <img
                                src={teamIcon}
                                alt="Team"
                                className="w-5 h-5 object-contain"
                            />
                            <span>Team</span>
                        </Link>
                    </li>

                </ul>

                <p className="text-gray-400 mt-10 text-xs font-semibold mb-4 tracking-wider">
                    SETTINGS
                </p>

                <ul className="space-y-3">
                    <li>
                        <Link
                            to="/settings"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition duration-200 !text-gray-300 !font-normal"
                        >
                            <img
                                src={settingsIcon}
                                alt="Settings"
                                className="w-5 h-5 object-contain"
                            />
                            <span>Settings</span>
                        </Link>
                    </li>
                    <li>
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition duration-200 cursor-pointer text-gray-300"
                            onClick={handleLogoutClick}
                        >
                            <img
                                src={logoutIcon}
                                alt="Logout"
                                className="w-5 h-5 object-contain"
                            />
                            <span>Logout</span>
                        </div>
                    </li>
                </ul>

            </div>

            {showLogoutModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                                <div className="bg-white w-[361px] p-4 rounded-lg ">
                                    <img src={alertCircleImg} className="w-[75px] h-[75px] mx-auto" alt="" />
                                    <p className="mt-6 text-[#222323] text-[20px] leading-4 font-medium">
                                        Are you sure want to Logout?
                                    </p>
            
                                    <div className="flex mt-10 gap-4">
                                        <div
                                            onClick={() => setShowLogoutModal(false)}
                                            className="border-[#D5D5D5] text-[#FF1717] hover:border-[#FF1717] duration-300 border w-full text-[16px] font-medium px-4 py-2 rounded-lg cursor-pointer"
                                        >
                                            No, Cancel
                                        </div>
                                        <div
                                            onClick={handleConfirmLogout}
                                            className="bg-[#FF1717] hover:bg-[#DE5555] duration-300 text-white w-full text-[16px] font-medium px-4 py-2 rounded-lg cursor-pointer"
                                        >
                                            Logout
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

        </div>
    );
}

export default Sidebar;

