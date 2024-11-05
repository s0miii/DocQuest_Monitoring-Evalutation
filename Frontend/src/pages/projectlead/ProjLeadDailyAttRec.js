import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";

const ProjLeadDailyAttRec = () => {
    const [selectedProponent, setSelectedProponent] = useState("");

    const submittedFiles = [
        { fileName: "Day 1 Attendance.pdf", submittedBy: "Proponent A", date: "2024-10-10" },
        { fileName: "Day 2 Attendance.pdf", submittedBy: "Proponent B", date: "2024-10-11" },
        { fileName: "Day 3 Attendance.pdf", submittedBy: "Proponent C", date: "2024-10-12" }
    ];

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Daily Attendance Record/List of Participants</h1>

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tesda Vocational</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tabasan, Wynoah Louis</p>
                            </div>
                        </div>
                        
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

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Assign Daily Attendance Submission</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Enter Proponent</label>
                            <input
                                type="text"
                                value={selectedProponent}
                                onChange={(e) => setSelectedProponent(e.target.value)}
                                className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                placeholder="Enter proponent name/email"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button type="button" className="bg-yellow-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-yellow-600 transition">
                                Assign Task
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Submitted Files</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">File Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Submitted By</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submittedFiles.map((file, index) => (
                                        <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{file.fileName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{file.submittedBy}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{file.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadDailyAttRec;
