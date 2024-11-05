import React from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";

const EStaffProjMonitoring = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    return (
        <div className="bg-gray-200 min-h-screen flex">
            {/* Sidebar with fixed width */}
            <div className="w-1/5 fixed h-full">
                <EStaffSideBar />
            </div>
            {/* Main content area */}
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Project Details</h1>

                    {/* Project Details and Progress Status Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Project Title and Leader */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tesda Vocational</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Valueno, Rabosa A.</p>
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


                    {/* Submitted Requirements Section */}
                    <h2 className="text-xl font-semibold mb-5">Submitted Requirements</h2>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Accomplishment Report</p>
                                    <p className="text-gray-500 text-sm">1 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/evaluation-summary')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>List of Participants</p>
                                    <p className="text-gray-500 text-sm">2 documents attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/participants-list')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Daily Attendance Record</p>
                                    <p className="text-gray-500 text-sm">1 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/daily-attendance')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Additional Documents</p>
                                    <p className="text-gray-500 text-sm">2 documents attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/additional-documents')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Summary of Evaluation</p>
                                    <p className="text-gray-500 text-sm">1 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/evaluation-summary')}>
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EStaffProjMonitoring;
