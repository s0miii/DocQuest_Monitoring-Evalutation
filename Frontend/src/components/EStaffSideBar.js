import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

function EStaffSideBar({ onFilterChange }) {
    const [activeDropdown, setActiveDropdown] = useState(null); // To track which dropdown is open
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Automatically open and highlight the PREXC Report dropdown if the path is related
        if (location.pathname.includes('/estaff/prexc')) {
            setActiveDropdown('prexc');
        }
    }, [location.pathname]);

    // deployed
    // const API_URL = process.env.REACT_APP_API_URL;

    // local
    const API_URL = 'http://127.0.0.1:8000/';
    // ${API_URL}

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_URL}/auth/token/logout/`, {}, {
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

    const toggleDropdown = (dropdown) => {
        // Toggle the dropdown and close others
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    // Custom isActive function for better control over active link state
    const getIsActive = (path) => {
        // Only consider exactly matching path as active
        return location.pathname === path;
    };

    return (
        <div className="w-1/5 bg-vlu text-white h-screen fixed z-50">
            <div className="flex justify-center">
                <img src="/images/logo2.png" alt="DocQuestLogo" className="w-52" />
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/estaff"
                            className={({ isActive }) =>
                                `text-lg block px-6 py-3 ${isActive && !location.pathname.includes('/estaff/prexc') ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`
                            }
                            isActive={() => getIsActive("/estaff")}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/estaff-project-statistics"
                            className={({ isActive }) =>
                                `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                        >
                            Project Statistics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/estaff-project-view-list/approved/project"
                            className={({ isActive }) =>
                                `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                        >
                            Project List
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/estaff-moa-view-list/all/moa"
                            className={({ isActive }) =>
                                `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                        >
                            MOA List
                        </NavLink>
                    </li>

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
                            onClick={() => toggleDropdown('prexc')}
                            className={`text-lg block px-6 py-3 w-full text-left ${activeDropdown === 'prexc' ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'
                                }`}
                        >
                            PREXC Report
                        </button>
                        {activeDropdown === 'prexc' && (
                            <ul className="pl-6">
                                <li>
                                    <NavLink
                                        to="/estaff/prexc/op1-op3"
                                        className={({ isActive }) =>
                                            `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                                    >
                                        Extension Program OP 1 & OP 3
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/estaff/prexc/op2"
                                        className={({ isActive }) =>
                                            `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                                    >
                                        Extension Program OP 2
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/estaff/prexc/oc"
                                        className={({ isActive }) =>
                                            `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                                    >
                                        Extension Program OC
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/estaff/prexc/performance"
                                        className={({ isActive }) =>
                                            `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                                    >
                                        College Campus Performance
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Accounts Dropdown */}
                    <li>
                        <button
                            onClick={() => toggleDropdown('accounts')}
                            className={`text-lg block px-6 py-3 w-full text-left ${activeDropdown === 'accounts' ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                        >
                            Accounts
                        </button>
                        {activeDropdown === 'accounts' && (
                            <ul className="pl-6">
                                <li>
                                    <NavLink
                                        to="/estaff-userlist"
                                        className={({ isActive }) =>
                                            `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                                    >
                                        User List
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/estaff-create-user"
                                        className={({ isActive }) =>
                                            `text-lg block px-6 py-3 ${isActive ? 'text-yellow-500 font-bold' : 'hover:text-yellow-500'}`}
                                    >
                                        Create User
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <button
                            onClick={handleLogout}
                            className="text-lg text-white block px-6 py-3 hover:text-red-600 w-full text-left"
                        >
                            Log out
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default EStaffSideBar;