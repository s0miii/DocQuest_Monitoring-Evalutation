import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffProjMonitoring = ({ totalRequirements, completedRequirements }) => {
    const navigate = useNavigate();

    const [projectDetails, setProjectDetails] = useState({
        title: "Tesda Vocational",
        leader: "Tabasan, Wynoah Louis",
        college: "CEA",
        targetDate: "May 2024",
        partnerAgency: "Placeholder Inc."
    });

    const handleViewClick = (path) => {
        navigate(path);
    }

    const progressPercentage = totalRequirements > 0 
        ? Math.min((completedRequirements / totalRequirements) * 100, 100) 
        : 0;

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
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/estaff/proj')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Project Details</h1>
                    </div>

                    {/* Project Details and Progress Status Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.title}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.leader}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">College/Campus</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.college}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.targetDate}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.partnerAgency}</p>
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

                    {/* Submitted Requirements Section */}
                    <h2 className="text-xl font-semibold mb-5">Submitted Requirements</h2>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>List of Participants/Daily Attendance Sheet</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/estaff/proj/monitoring/daily-attendance')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Summary of Evaluation/Evaluation Sheets</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/estaff/proj/monitoring/evaluation-summary')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>TrainersCV/DTR</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/estaff/proj/monitoring/trainer-cv-dtr')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Modules/Lecture Notes</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/estaff/proj/monitoring/modules-notes')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Other</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/estaff/proj/monitoring/other')}>
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
