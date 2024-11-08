import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import ProponentsSideBar from "../../components/ProponentsSideBar";

const ProponentsEvalSum = () => {
    const [attachedFiles, setAttachedFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
    };

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
                    <h1 className="text-2xl font-semibold mb-5">Evaluation Summary/Evaluation Sheets</h1>

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

                    
                    {/* Add New Entry Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Summary of Evaluation</h2>
                        <div className="overflow-x-auto">
                            <table className="table-fixed w-full max-w-md mx-auto text-sm text-center border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 w-2/3">Rating</th>
                                        <th className="px-4 py-2 border border-gray-300 w-1/3">Total Responses</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Excellent (5)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input 
                                                type="number" 
                                                className="bg-gray-100 rounded-lg p-2 text-center w-full" 
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Very Satisfactory (4)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input 
                                                type="number" 
                                                className="bg-gray-100 rounded-lg p-2 text-center w-full" 
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Satisfactory (3)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input 
                                                type="number" 
                                                className="bg-gray-100 rounded-lg p-2 text-center w-full" 
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Fair (2)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input 
                                                type="number" 
                                                className="bg-gray-100 rounded-lg p-2 text-center w-full" 
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Poor (1)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input 
                                                type="number" 
                                                className="bg-gray-100 rounded-lg p-2 text-center w-full" 
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold px-4 py-2 border border-gray-300">Sub Total</td>
                                        <td className="font-semibold px-4 py-2 border border-gray-300">15</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Evaluations</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full" 
                                    placeholder="Total Evaluations" 
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Percentage</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full" 
                                    placeholder="Percentage" 
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add New Submission Section */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-xl font-semibold text-center mb-6">Add New Submission</h2>

                        {/* Day, Date, and Number of Attendees Inputs */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Day</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Enter Day"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded-lg p-3 mt-1 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Number of Attendees</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Number of Attendees"
                                />
                            </div>
                        </div>

                        {/* Attached Files Section */}
                        <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center mb-6 relative">
                            <h3 className="font-semibold text-center mb-1">Attached Files</h3>
                            <div className="text-gray-400 mb-1">
                                <span className="block text-center text-5xl">+</span>
                            </div>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* Preview of Attached Files */}
                        {attachedFiles.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {attachedFiles.map((file, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`attachment-preview-${index}`}
                                            className="h-32 w-full object-cover rounded-lg"
                                        />
                                        <p className="text-xs text-center mt-2">{file.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="bg-yellow-500 text-white font-bold py-2 px-12 rounded-lg hover:bg-yellow-600 transition"
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

export default ProponentsEvalSum;