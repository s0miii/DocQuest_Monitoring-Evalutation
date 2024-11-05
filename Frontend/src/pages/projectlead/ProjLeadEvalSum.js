import React from "react";
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";

const ProjLeadEvalSum = () => {
    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Evaluation Summary</h1>

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

                    {/* Input Details Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Input Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title of Activity</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full" 
                                    placeholder="" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Activity</label>
                                <input 
                                    type="date" 
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full" 
                                    placeholder="" 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name of Speaker/Trainer/Facilitator</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full" 
                                    placeholder="" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name of Evaluator</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full" 
                                    placeholder="" 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Venue of the Activity</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full" 
                                    placeholder="" 
                                />
                            </div>
                        </div>

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

export default ProjLeadEvalSum ;
