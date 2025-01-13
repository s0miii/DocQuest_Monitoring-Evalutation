import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function DeptOffSideBar() {
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

    const toggleSubMenu = () => {
        setIsSubMenuVisible(!isSubMenuVisible)
    };

    return (
        <div className="w-1/5 bg-vlu text-white h-screen fixed z-50">
            <div className="flex justify-center">
                <img src="/images/logo2.png" alt="DocQuestLogo" className="w-52" />
            </div>
            <nav>
                <ul>
                    <li>
                        <a href="#" className="text-lg font-bold block px-6 py-3 hover:text-yellow-500">Dashboard</a>
                    </li>
                    <li>
                        <button onClick={toggleSubMenu} className="text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none">
                            Documents
                        </button>
                    </li>
                    <li>
                        <NavLink
                            to="/deptoff-projects-dashboard"
                            className={({ isActive }) =>
                                `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                        >
                            Project Monitoring
                        </NavLink>
                    </li>

                    <li><a href="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Log out</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default DeptOffSideBar;