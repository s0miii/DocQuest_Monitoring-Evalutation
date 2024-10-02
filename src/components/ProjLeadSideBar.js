import React, { useState } from "react";

function ProjLeadSidebar() {
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const [isRequirementsSubMenuVisible, setIsRequirementsSubMenuVisible] = useState(false);

    const toggleSubMenu = () => {
        setIsSubMenuVisible(!isSubMenuVisible)
    };

        const toggleRequirementsSubMenu = () => {
        setIsRequirementsSubMenuVisible(!isRequirementsSubMenuVisible);
    };

    return (
        <div className="w-1/5 bg-vlu text-white h-screen fixed z-50 overflow-y-auto">
            <div className="flex justify-center">
                <img src="/images/logo2.png" alt="DocQuestLogo" className="w-52" />
            </div>
            <nav>
                <ul>
                    <li>
                        <a href="#" className="text-lg font-bold block px-6 py-3 text-yellow-500">Dashboard</a>
                    </li>
                    <li>
                        <button onClick={toggleSubMenu} className="text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none">
                            Projects Management
                        </button>
                        <ul className={`${isSubMenuVisible ? '' : 'hidden'} bg-indigo-900`}>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Create Proposal</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Approved</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Ongoing</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Denied</a></li>
                        </ul>
                    </li>
                    <li><a href="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Create MOA/MOU</a></li>
                    <li>
                        <button onClick={toggleRequirementsSubMenu} className="text-lg w-full text-left block px-6 py-3 hover:text-yellow-500 focus:outline-none">
                            Requirements
                        </button>
                        <ul className={`${isRequirementsSubMenuVisible ? '' : 'hidden'} bg-indigo-900`}>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Accomplishment Report</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">List of Participants</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Daily Attendance Record</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Evaluation Summary</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Trainer CV/DTR</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Modules/Notes</a></li>
                            <li><a href="#" className="block px-6 py-3 hover:text-yellow-500">Other</a></li>
                        </ul>
                    </li>
                    <li><a href="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Log out</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default ProjLeadSidebar;