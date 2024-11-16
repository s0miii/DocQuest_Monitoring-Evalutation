import React from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadProjReq = ({ totalRequirements, completedRequirements }) => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    // Calculate the progress percentage, ensuring it does not exceed 100%
    const progressPercentage = totalRequirements > 0 
    ? Math.min((completedRequirements / totalRequirements) * 100, 100) 
    : 0;


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
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/proj')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Project Details</h1>
                    </div>

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
                                    <div
                                        className="bg-yellow-500 h-2.5 rounded-full"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <div className="w-2/3 flex justify-center text-sm text-gray-600">
                                    <span>{progressPercentage.toFixed(0)}% Completed</span>
                                </div>
                            </div>
                        </div>

                    {/* Assigned Requirements Section */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-semibold">Documentary Requirements</h2>
                        <button 
                            className="text-blue-500 text-sm" 
                            onClick={() => handleViewClick('/projlead/proj/req/assign-proponents')}
                        >
                            Assign Proponents
                        </button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Progress/Accomplishment/Terminal Report</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/projlead/proj/req/accomplishment-report')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>List of Participants/Daily Attendance Sheet</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/projlead/proj/req/daily-attendance')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Summary of Evaluation/Evaluation Sheets</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/projlead/proj/req/evaluation-summary')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>TrainersCV/DTR</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/projlead/proj/req/trainer-cv-dtr')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Modules/Lecture Notes</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/projlead/proj/req/modules-notes')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Other</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/projlead/proj/req/others')}>
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

export default ProjLeadProjReq;
