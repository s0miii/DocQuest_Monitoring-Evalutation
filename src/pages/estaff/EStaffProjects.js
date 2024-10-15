import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import Topbar from "../../components/Topbar";
import EStaffSidebar from "../../components/EStaffSideBar";

const EStaffProjects = () => {

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <EStaffSidebar />
            </div>
            <div className="flex-1 ml-[20%]"> 
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Projects Overview</h1>

                    {/* Approved, Pending, Rejected UI */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {/* Not Yet Started */}
                        <div className="bg-orange-500 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Not Yet Started</h2>
                            <h2 className="text-4xl font-bold">07</h2>
                        </div>
                        {/* Ongoing */}
                        <div className="bg-yellow-400 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Ongoing</h2>
                            <h2 className="text-4xl font-bold">05</h2>
                        </div>
                        {/* Completed */}
                        <div className="bg-green-500 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Completed</h2>
                            <h2 className="text-4xl font-bold">02</h2>
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
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">College</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Project Leader</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Target Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Partner Agency</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status of Accomplishment Report</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase"> </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">CEA</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Valueno, Rabosa A.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Tesda Vocational</td>
                                        <td className="px-6 py-4 whitespace-nowrap">May 2024</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Placeholder Inc.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Incomplete</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-black-600">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">CEA</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Valueno, Rabosa A.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Tesda Vocational</td>
                                        <td className="px-6 py-4 whitespace-nowrap">May 2024</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Placeholder Inc.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Incomplete</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-black-600">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">CEA</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Valueno, Rabosa A.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Tesda Vocational</td>
                                        <td className="px-6 py-4 whitespace-nowrap">May 2024</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Placeholder Inc.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Incomplete</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-black-600">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">CITC</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Valueno, Rabosa A.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Tesda Vocational</td>
                                        <td className="px-6 py-4 whitespace-nowrap">May 2024</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Placeholder Inc.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Incomplete</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-black-600">View</button>
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

export default EStaffProjects;
