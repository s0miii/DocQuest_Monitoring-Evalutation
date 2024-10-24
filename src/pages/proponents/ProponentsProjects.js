import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProponentsSideBar from "../../components/ProponentsSideBar";

const ProponentsProjects = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProponentsSideBar />
            </div>
            <div className="flex-1 ml-[20%]"> 
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Projects Overview</h1>
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        {/* Completed */}
                        <div className="bg-green-500 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Completed</h2>
                            <h2 className="text-4xl font-bold">00</h2>
                            <button className="mt-2 underline">View</button>
                        </div>
                        {/* Ongoing */}
                        <div className="bg-yellow-400 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Ongoing</h2>
                            <h2 className="text-4xl font-bold">01</h2>
                            <button className="mt-2 underline">View</button>
                        </div>
                    </div>

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
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Project Leader</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Target Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase"> </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">20246565</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Valueno, Rabosa A.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Tesda Vocational</td>
                                        <td className="px-6 py-4 whitespace-nowrap">May 2024</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-black underline pr-3" onClick={() => handleViewClick('/proponents/projects/req')}>
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

export default ProponentsProjects;
