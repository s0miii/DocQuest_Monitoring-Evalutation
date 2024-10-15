import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function EStaffSideBar() {
    const location = useLocation();

    const [isUserManagementSubMenuVisible, setIsUserManagementSubMenuVisible] = useState(false);
    const [isProjectsSubMenuVisible, setIsProjectsSubMenuVisible] = useState(false);
    const [isPREXCSubMenuVisible, setIsPREXCSubMenuVisible] = useState(false);

    const toggleUserManagementSubMenu = () => {
        setIsUserManagementSubMenuVisible(!isUserManagementSubMenuVisible);
    };

    const toggleProjectsSubMenu = () => {
        setIsProjectsSubMenuVisible(!isProjectsSubMenuVisible);
    };

    const togglePREXCSubMenu = () => {
        setIsPREXCSubMenuVisible(!isPREXCSubMenuVisible);
    };

    const isActive = (paths) => {
        return paths.some((path) => location.pathname.startsWith(path));
    };

    return (
        <div className="w-1/5 bg-vlu text-white h-screen fixed z-50 overflow-y-auto">
            <div className="flex justify-center">
                <img src="/images/logo2.png" alt="DocQuestLogo" className="w-52" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/dashboard" className={`text-lg font-bold block px-6 py-3 ${isActive(["/dashboard"]) ? "text-yellow-500" : ""}`}>Dashboard</Link>
                    </li>
                    <li>
                        <button onClick={toggleUserManagementSubMenu} className="text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none">
                            User Management
                        </button>
                        <ul className={`${isUserManagementSubMenuVisible ? "" : "hidden"} bg-indigo-900`}>
                            <li><Link to="/user-management/view" className="block px-6 py-3 hover:text-yellow-500">View Users</Link></li>
                            <li><Link to="/user-management/create" className="block px-6 py-3 hover:text-yellow-500">Create User</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/documents" className={`text-lg block px-6 py-3 hover:text-yellow-500 ${isActive(["/documents"]) ? "text-yellow-500" : ""}`}>Documents</Link>
                    </li>
                    <li>
                        <button onClick={toggleProjectsSubMenu} className="text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none">
                            Projects
                        </button>
                        <ul className={`${isProjectsSubMenuVisible ? "" : "hidden"} bg-indigo-900`}>
                            <li><Link to="/projects/monitoring" className="block px-6 py-3 hover:text-yellow-500">Monitoring</Link></li>
                            <li><Link to="/projects/evaluation" className="block px-6 py-3 hover:text-yellow-500">Evaluation</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/auto-message" className={`text-lg block px-6 py-3 hover:text-yellow-500 ${isActive(["/auto-message"]) ? "text-yellow-500" : ""}`}>
                            Auto Message
                        </Link>
                    </li>
                    <li>
                        <Link to="/email" className={`text-lg block px-6 py-3 hover:text-yellow-500 ${isActive(["/email"]) ? "text-yellow-500" : ""}`}>
                            Email
                        </Link>
                    </li>
                    <li>
                        <button onClick={togglePREXCSubMenu} className="text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none">
                            PREXC
                        </button>
                        <ul className={`${isPREXCSubMenuVisible ? "" : "hidden"} bg-indigo-900`}>
                            <li><Link to="/prexc/op1-op2" className="block px-6 py-3 hover:text-yellow-500">Extension Program (OP1 and OP2)</Link></li>
                            <li><Link to="/prexc/op2" className="block px-6 py-3 hover:text-yellow-500">Extension Program (OP2)</Link></li>
                            <li><Link to="/prexc/oc" className="block px-6 py-3 hover:text-yellow-500">Extension Program (Oc)</Link></li>
                            <li><Link to="/prexc/campus-performance" className="block px-6 py-3 hover:text-yellow-500">College Campus Performance</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/logout" className="text-lg block px-6 py-3 hover:text-yellow-500">
                            Log Out
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default EStaffSideBar;
