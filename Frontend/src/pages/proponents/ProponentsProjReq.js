import React from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProponentsSideBar from "../../components/ProponentsSideBar";

const ProponentsProjReq = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    return (
        <div className="bg-gray-200 min-h-screen flex">
            {/* Sidebar with fixed width */}
            <div className="w-1/5 fixed h-full">
                <ProponentsSideBar />
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
                    </div>

                    {/* Assigned Requirements Section */}
                    <h2 className="text-xl font-semibold mb-5">Assigned Documentary Requirements</h2>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>List of Participants/Daily Attendance Sheet</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/proponents/proj/req/daily-attendance')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Summary of Evaluation/Evaluation Sheets</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/proponents/proj/req/evaluation-summary')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>TrainersCV/DTR</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/proponents/proj/req/trainer-cv-dtr')}>
                                    View
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>Modules/Lecture Notes</p>
                                    <p className="text-gray-500 text-sm">0 document attached</p>
                                </div>
                                <button className="text-black underline ml-auto pr-3" onClick={() => handleViewClick('/proponents/proj/req/modules-notes')}>
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

export default ProponentsProjReq;
