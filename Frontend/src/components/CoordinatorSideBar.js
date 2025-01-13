import React, { useState } from "react";

function CoordinatorSidebar() {
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
                    <li><a href="#" className="block px-6 py-3 text-lg hover:text-yellow-500">Log out</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default CoordinatorSidebar;