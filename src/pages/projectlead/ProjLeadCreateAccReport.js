import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";

const ProjLeadCreateAccReport = () => {
    const [projectType, setProjectType] = useState("");
    const [projectCategory, setProjectCategory] = useState("");
    const [trainingModality, setTrainingModality] = useState("");

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
                        <button className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-semibold text-left">Create Accomplishment Report</h1>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Extension Accomplishment Report</h2>

                        {/* Banner Program and Project Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Banner Program Title</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Banner Program Title" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Flagship Program</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Flagship Program" />
                            </div>
                        </div>

                        {/* Project Title and Type of Project */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Project Title" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type of Project</label>
                                <select
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="New Project">New Project</option>
                                    <option value="Continuing Project">Continuing Project</option>
                                </select>
                            </div>
                        </div>

                        {/* Title of Research */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Title of Research</label>
                            <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Title of Research" />
                        </div>

                        {/* Project Category */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Project Category</label>
                            <select
                                className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                value={projectCategory}
                                onChange={(e) => setProjectCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="Research-based">Research-based</option>
                                <option value="Community Outreach Extension">Community Outreach Extension</option>
                                <option value="GAD">GAD</option>
                                <option value="Capability Building Training">Capability Building Training</option>
                                <option value="Monitoring and Evaluation">Monitoring and Evaluation</option>
                                <option value="Other">Other</option>
                            </select>
                            {projectCategory === "Other" && (
                                <input
                                    className="bg-gray-100 rounded-lg p-3 mt-2 w-full"
                                    placeholder="Please specify..."
                                    value={projectCategory === "Other" ? "" : projectCategory}
                                    onChange={(e) => setProjectCategory(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Proponents and Program */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Proponents</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 mt-1 w-full" rows="5" placeholder="Enter Proponents"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Program</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Program" />
                                <label className="block text-sm font-medium text-gray-700 mt-4">Accreditation Level</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Accreditation Level" />
                                <label className="block text-sm font-medium text-gray-700 mt-4">College</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter College" />
                            </div>
                        </div>

                        {/* Target Groups/Beneficiaries */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Target Groups/Beneficiaries</label>
                            <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Target Groups/Beneficiaries" />
                        </div>

                        {/* Project Location and Partner Agency */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Location</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Project Location" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Partner Agency" />
                            </div>
                        </div>

                        {/* Training Modality */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Training Modality</label>
                            <select
                                className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                value={trainingModality}
                                onChange={(e) => setTrainingModality(e.target.value)}
                            >
                                <option value="">Select Modality</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Face to Face">Face to Face</option>
                                <option value="Blended">Blended</option>
                            </select>
                        </div>

                        {/* Actual Date of Implementation and Total Days */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual Date of Implementation</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Date" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Number of Days</label>
                                <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Number of Days" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                            <input className="bg-gray-100 rounded-lg p-3 mt-1 w-full" placeholder="Enter Submitter Name" />
                        </div>
                    </div>

                    {/* PREXC Achievement */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-center" colSpan="4">PREXC Achievement</th>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-left"></td>
                                        <td className="border border-gray-300 px-4 py-2 text-left">Actual Number of Trainees based on Attendance Sheets</td>
                                        <td className="border border-gray-300 px-4 py-2 text-left">Actual Number of Days Training</td>
                                        <td className="border border-gray-300 px-4 py-2 text-left">Persons Trained</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-left"> Number of Trainees who evaluated the training to be at least satisfactory </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input type="number" className="w-full bg-gray-100 rounded-lg p-2" placeholder="Enter input..." />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input type="number" className="w-full bg-gray-100 rounded-lg p-2" placeholder="Enter input..." />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input type="number" className="w-full bg-gray-100 rounded-lg p-2" placeholder="Enter input..." />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">Persons Trained Weighted by the Number of Days Training</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input type="number" className="w-full bg-gray-100 rounded-lg p-2" placeholder="Enter input..." />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="w-full bg-gray-100 rounded-lg p-2 text-center">Rating 100%</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input type="number" className="w-full bg-gray-100 rounded-lg p-2" placeholder="Enter input..." />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {/* Project Narrative */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Project Narrative</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description of Major Activities and Topics Covered</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Issues and Challenges Encountered</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quality of the Participants' Engagement</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discussion of Questions Raised and Comments from the Participants</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ways Forward and Plans</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Photo Documentation */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Photo Documentation</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Attached Photo</label>
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

                    {/* Footer Signatures
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Prepared By:</h2>
                        <div className="text-center">
                            <p className="font-semibold">Dr/Engr/Mr/Ms. John Doe PhD/MEd/MSc/MD</p>
                            <p>Faculty/College of Information Technology and Communication</p>
                        </div>
                        <h2 className="text-xl font-semibold text-center mt-6">Noted By:</h2>
                        <div className="text-center">
                            <p className="font-semibold">Dr. Maria Teresa M. Fajardo</p>
                            <p>Director, Extension and Community Relations Division</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default ProjLeadCreateAccReport;
