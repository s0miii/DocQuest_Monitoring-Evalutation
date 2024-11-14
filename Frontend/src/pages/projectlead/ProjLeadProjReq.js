import React from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadProjReq = () => {
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
                    </div>

                    {/* Assigned Requirements Section */}
                    <h2 className="text-xl font-semibold mb-5">Documentary Requirements</h2>
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
