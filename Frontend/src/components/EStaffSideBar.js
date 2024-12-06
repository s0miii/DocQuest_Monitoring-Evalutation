import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function EStaffSideBar() {
    const location = useLocation();

    const [isUserManagementSubMenuVisible, setIsUserManagementSubMenuVisible] = useState(false);
    const [isPREXCSubMenuVisible, setIsPREXCSubMenuVisible] = useState(false);

    const toggleUserManagementSubMenu = () => {
        setIsUserManagementSubMenuVisible(!isUserManagementSubMenuVisible);
    };


    const togglePREXCSubMenu = () => {
        setIsPREXCSubMenuVisible(!isPREXCSubMenuVisible);
    };

    const isActive = (paths) => {
        return paths.some((path) => location.pathname.startsWith(path));
    };

    return (
        <div className="fixed z-50 w-1/5 h-screen overflow-y-auto text-white bg-vlu">
            <div className="flex justify-center">
                <img src="/images/logo2.png" alt="DocQuestLogo" className="w-52" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/dashboard" className={`text-lg font-bold block px-6 py-3 ${isActive(["/dashboard"]) ? "text-yellow-500" : ""}`}>Dashboard</Link>
                    </li>
                    <li>
                        <button onClick={toggleUserManagementSubMenu} className="block w-full px-6 py-3 text-lg text-left hover:text-yellow-500 focus:outline-none">
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
                        <Link to="/estaff/proj" className={`text-lg block px-6 py-3 hover:text-yellow-500 ${isActive(["/estaff/proj"]) ? "text-yellow-500" : ""}`}>Project Monitoring</Link>
                    </li>
                    <li>
                        <Link to="#" className={`text-lg block px-6 py-3 hover:text-yellow-500 ${isActive(["#"]) ? "text-yellow-500" : ""}`}>
                            Email
                        </Link>
                    </li>
                    <li>
                        <button onClick={togglePREXCSubMenu} className="block w-full px-6 py-3 text-lg text-left hover:text-yellow-500 focus:outline-none">
                            PREXC
                        </button>
                        <ul className={`${isPREXCSubMenuVisible ? "" : "hidden"} bg-indigo-900`}>
                            <li><Link to="/estaff/prexc/op1-op3" className="block px-6 py-3 hover:text-yellow-500">Extension Program (OP1 and OP3)</Link></li>
                            <li><Link to="/estaff/prexc/op2" className="block px-6 py-3 hover:text-yellow-500">Extension Program (OP2)</Link></li>
                            <li><Link to="/estaff/prexc/oc" className="block px-6 py-3 hover:text-yellow-500">Extension Program (Oc)</Link></li>
                            <li><Link to="/estaff/prexc/performance" className="block px-6 py-3 hover:text-yellow-500">College Campus Performance</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/logout" className="block px-6 py-3 text-lg hover:text-yellow-500">
                            Log Out
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default EStaffSideBar;
