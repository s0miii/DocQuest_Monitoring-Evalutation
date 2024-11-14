import React from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadListofParticipants = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    return (
        <div className="bg-gray-200 min-h-screen flex">
            {/* Sidebar with fixed width */}
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            {/* Main content area */}
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">List of Participants</h1>
                    </div>

                    {/* Project Details and Progress Status Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Project Title and Leader */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tesda Vocational</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tabasan, Wynoah Louis</p>
                            </div>
                        </div>
                        
                        {/* College/Campus, Target Date, Partner Agency */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">College/Campus</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">CEA</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">May 2024</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Placeholder Inc.</p>
                            </div>
                        </div>
                    </div>

                    {/* File Submission Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Attach Files</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Attached File</label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Upload Photo"
                                    style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="bg-yellow-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadListofParticipants;
