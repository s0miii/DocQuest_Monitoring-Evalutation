import React from "react";
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";

const ProjLeadLecNotes = () => {
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
                    <h1 className="text-2xl font-semibold mb-5">Modules/Lecture Notes</h1>

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
                        <div className="flex justify-center items-center flex-col">
                            <div className="bg-gray-200 p-4 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
                                </svg>
                            </div>
                            <button className="bg-yellow-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-yellow-600 transition">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Add New Submission Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Add New Submission</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Row 1 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <input
                                    type="text"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Project Leader"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <input
                                    type="text"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Project Title"
                                />
                            </div>
                            {/* Row 2 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Document Type</label>
                                <input
                                    type="text"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Document Type"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date Submitted</label>
                                <input
                                    type="date"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
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

export default ProjLeadLecNotes;
