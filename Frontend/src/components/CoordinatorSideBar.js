import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

function CoordinatorSidebar() {
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://web-production-4b16.up.railway.app/auth/token/logout/', {}, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
        localStorage.clear();
        navigate('/login');
    };

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
                        <a href="#" className="block px-6 py-3 text-lg font-bold text-yellow-500">Dashboard</a>
                    </li>
                    <li>
                        <button onClick={toggleSubMenu} className="block w-full px-6 py-3 text-lg text-left hover:text-yellow-500 focus:outline-none">
                            Project Proposal
                        </button>
                        <ul className={`${isSubMenuVisible ? '' : 'hidden'} bg-indigo-900`}>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Approved</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Ongoing</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Denied</a></li>
                        </ul>
                    </li>
                    <li><a href="#" className="block px-6 py-3 text-lg hover:text-yellow-500">Documents</a></li>
                    <li>
                        <NavLink
                            to="/staff-projects-dashboard"
                            className={({ isActive }) =>
                                `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                        >
                            Project Monitoring
                        </NavLink>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="block w-full px-6 py-3 text-lg text-left text-white hover:text-red-600"
                        >
                            Log out
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default CoordinatorSidebar;