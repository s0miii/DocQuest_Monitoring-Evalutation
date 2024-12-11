import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function ProponentsSideBar() {
    const location = useLocation();

    const isRequirementsPath = location.pathname.startsWith("/requirements");

    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const [isRequirementsSubMenuVisible, setIsRequirementsSubMenuVisible] = useState(isRequirementsPath);

    const toggleSubMenu = () => {
        setIsSubMenuVisible(!isSubMenuVisible);
    };

    const toggleRequirementsSubMenu = () => {
        setIsRequirementsSubMenuVisible(!isRequirementsSubMenuVisible);
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
                    <li><Link to="#" className={`text-lg font-bold block px-6 py-3 ${isActive(["/user"]) ? "text-yellow-500" : ""}`}>Dashboard</Link></li>
                    <li><Link to="/projects-dashboard" className="text-lg block px-6 py-3 hover:text-yellow-500">Project Monitoring</Link></li>
                    <li><Link to="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Log out</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default ProponentsSideBar;
