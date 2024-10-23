import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function ProjLeadSidebar() {
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
                        <button onClick={toggleRequirementsSubMenu} className={`text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none ${isActive(["/requirements"]) ? "text-yellow-500" : ""}`}>
                            Documentary Requirements
                        </button>
                        <ul className={`${isRequirementsSubMenuVisible ? '' : 'hidden'} bg-indigo-900`}>
                        <li><Link to="/requirements/accomplishment-report" className={`block px-6 py-3 hover:text-yellow-500 ${isActive(["/requirements/accomplishment-report", "/requirements/create-accomplishment-report"]) ? "text-yellow-500" : ""}`}>Accomplishment Report</Link></li>
                            <li><Link to="/requirements/daily-attendance" className={`block px-6 py-3 hover:text-yellow-500 ${isActive(["/requirements/daily-attendance"]) ? "text-yellow-500" : ""}`}>Daily Attendance Record</Link></li>
                            <li><Link to="/requirements/evaluation-summary" className={`block px-6 py-3 hover:text-yellow-500 ${isActive(["/requirements/evaluation-summary"]) ? "text-yellow-500" : ""}`}>Evaluation Summary</Link></li>
                            <li><Link to="/requirements/trainer-cv" className={`block px-6 py-3 hover:text-yellow-500 ${isActive(["/requirements/trainer-cv"]) ? "text-yellow-500" : ""}`}>Trainer CV/DTR</Link></li>
                            <li><Link to="/requirements/modules-notes" className={`block px-6 py-3 hover:text-yellow-500 ${isActive(["/requirements/modules-notes"]) ? "text-yellow-500" : ""}`}>Modules/Notes</Link></li>
                            <li><Link to="/requirements/others" className={`block px-6 py-3 hover:text-yellow-500 ${isActive(["/requirements/others"]) ? "text-yellow-500" : ""}`}>Other </Link></li>
                        </ul>
                    </li>
                    <li><Link to="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Log out</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default ProjLeadSidebar;
