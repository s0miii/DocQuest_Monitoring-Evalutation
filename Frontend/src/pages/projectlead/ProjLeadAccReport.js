import React from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";

const ProjLeadAccReport = () => {
    const navigate = useNavigate();

    const handleAddNewSubmission = () => {
        navigate('/requirements/create-accomplishment-report');
    };

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
                    <h1 className="text-2xl font-semibold mb-5">Accomplishment Report</h1>

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

                        {/* Project Progress Status */}
                        <h2 className="text-xl font-semibold text-center mt-8 mb-4">Project Progress Status</h2>
                        <div className="mt-4 flex flex-col items-center">
                            <div className="w-2/3 bg-gray-200 rounded-full h-2.5 mb-4">
                                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                            </div>
                            <div className="w-2/3 flex justify-between text-sm text-gray-600">
                                <div className="text-center">
                                    <span className="block">25%</span>
                                    <span>Day 1</span>
                                </div>
                                <div className="text-center">
                                    <span className="block">50%</span>
                                    <span>Day 2</span>
                                </div>
                                <div className="text-center">
                                    <span className="block">75%</span>
                                    <span>Day 3</span>
                                </div>
                                <div className="text-center">
                                    <span className="block">100%</span>
                                    <span>Day 4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Records Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex justify-center items-center h-48">
                        <p className="text-gray-400 text-lg">No Records Found</p>
                    </div>

                    {/* Add New Submission Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex justify-center items-center flex-col">
                        <p className="text-gray-600 font-semibold mb-4">Add New Submission</p>
                        <div className="bg-gray-200 p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
                            </svg>
                        </div>
                        <button
                            onClick={handleAddNewSubmission}
                            className="bg-yellow-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-yellow-600 transition"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadAccReport;
