import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function DeptOffSideBar() {
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

    const toggleSubMenu = () => {
        setIsSubMenuVisible(!isSubMenuVisible)
    };

    return (
        <div className="fixed z-50 w-1/5 h-screen overflow-y-auto text-white bg-vlu">
            <div className="flex justify-center">
                <img src="/images/logo2.png" alt="DocQuestLogo" className="w-52" />
            </div>
            <nav>
                <ul>
                    <li>
                        <a href="#" className="block px-6 py-3 text-lg font-bold hover:text-yellow-500">Dashboard</a>
                    </li>
                    <li>
                        <button onClick={toggleSubMenu} className="block w-full px-6 py-3 text-lg text-left hover:text-yellow-500 focus:outline-none">
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

                    <li><a href="#" className="block px-6 py-3 text-lg hover:text-yellow-500">Log out</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default DeptOffSideBar;