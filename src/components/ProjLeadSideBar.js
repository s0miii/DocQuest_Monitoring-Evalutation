import React, { useState } from "react";

function ProjLeadSidebar({ onFilterChange }) {
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

    const toggleSubMenu = () => {
        setIsSubMenuVisible(!isSubMenuVisible);
    };

    return (
        <div className="w-1/5 bg-vlu text-white h-screen fixed z-50">
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
                            {/* Add onClick handlers to change the filter based on the clicked item */}
                            <li>
                                <a href="#" className="block px-6 py-3 hover:text-yellow-500" onClick={() => onFilterChange('Approved')}>Approved</a>
                            </li>
                            <li>
                                <a href="#" className="block px-6 py-3 hover:text-yellow-500" onClick={() => onFilterChange('Ongoing')}>Ongoing</a>
                            </li>
                            <li>
                                <a href="#" className="block px-6 py-3 hover:text-yellow-500" onClick={() => onFilterChange('Disapproved')}>Disapproved</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Create MOA/MOU</a>
                    </li>
                    <li>
                        <a href="#" className="text-lg block px-6 py-3 hover:text-yellow-500">Log out</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default ProjLeadSidebar;
