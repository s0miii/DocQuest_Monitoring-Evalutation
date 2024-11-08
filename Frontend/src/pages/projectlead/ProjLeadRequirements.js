import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";

const ProjLeadRequirements = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">

                    {/* Projects Table */}
                    <h1 className="text-2xl font-semibold mb-5">Projects</h1>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                    
                    {/* Search Bar */}
                    <div className="flex items-center bg-gray-100 p-3 rounded-lg mb-6 max-w-sm mx-auto">
                        <FaSearch className="text-gray-500 mx-3" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-gray-100 outline-none text-gray-600 placeholder-gray-500"
                        />
                        <FaFilter className="text-gray-500 mx-3" />
                    </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Project ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Project Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase"> </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">20240560</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Tesda Vocational</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Project Proposal</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Approved</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-black underline pr-3" onClick={() => handleViewClick('/projlead/req/accomplishment-report')}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div>Showing 1 to 4 of 11 entries</div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 bg-gray-300 rounded-lg">1</button>
                                <button className="px-3 py-1 bg-gray-100 rounded-lg">2</button>
                                <button className="px-3 py-1 bg-gray-100 rounded-lg">...</button>
                                <button className="px-3 py-1 bg-gray-100 rounded-lg">11</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjLeadRequirements;
