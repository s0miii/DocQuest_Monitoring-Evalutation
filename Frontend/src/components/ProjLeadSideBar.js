import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

function ProjLeadSidebar() {
    const location = useLocation();

    const isRequirementsPath = location.pathname.startsWith("/projlead/requirements");

    // deployed
    // const API_URL = process.env.REACT_APP_API_URL;

    // local
    const API_URL = 'http://127.0.0.1:8000/';
    // ${API_URL}

    const navigate = useNavigate();

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

    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

    const toggleSubMenu = () => {
        setIsSubMenuVisible(!isSubMenuVisible);
    };

    const isActive = (paths) => {
        return paths.some(path => location.pathname.startsWith(path));
    };

    return (
        <div className="w-1/5 bg-vlu text-white h-screen fixed z-50 overflow-y-auto">
            <div className="flex justify-center">
                <img src="/images/logo2.png" alt="DocQuestLogo" className="w-52" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/user" className={`text-lg font-bold block px-6 py-3 ${isActive(["/user"]) ? "text-yellow-500" : ""}`}>Dashboard</Link>
                    </li>
                    <li>
                        <button onClick={toggleSubMenu} className="text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none">
                            Projects Management
                        </button>
                        <ul className={`${isSubMenuVisible ? '' : 'hidden'} bg-indigo-900`}>
                            <li><Link to="#" className="block px-6 py-3 hover:text-yellow-500">Create Proposal</Link></li>
                            <li><Link to="#" className="block px-6 py-3 hover:text-yellow-500">Approved</Link></li>
                            <li><Link to="#" className="block px-6 py-3 hover:text-yellow-500">Ongoing</Link></li>
                            <li><Link to="#" className="block px-6 py-3 hover:text-yellow-500">Denied</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Create MOA/MOU</Link>
                    </li>
                    <li>
                        <Link to="/projects-dashboard" className={`text-lg block px-6 py-3 hover:text-yellow-500 ${isActive(["/projects-dashboard"]) ? "text-yellow-500" : ""}`}>Project Monitoring</Link>
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

export default ProjLeadSidebar;
