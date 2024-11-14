import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProponentsSideBar from "../../components/ProponentsSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProponentsTrainerCVDTR = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    const [submittedSubmissions, setSubmittedSubmissions] = useState([
        { 
            id: 1, 
            trainerName: "Trainer A", 
            dateSubmitted: "2024-10-10", 
            status: "Approved", 
            files: ["DTR1.pdf", "DTR2.pdf"] 
        },
        { 
            id: 2, 
            trainerName: "Trainer B", 
            dateSubmitted: "2024-10-11", 
            status: "Pending", 
            files: ["DTR3.pdf"] 
        }
    ]);

    // Track newly attached files and form fields
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [trainerName, setTrainerName] = useState("");
    const [submissionDate, setSubmissionDate] = useState("");

    // Handle file attachments in "Add New Submission"
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    // Submit new files to "Submitted Submissions" section
    const handleSubmit = () => {
        if (!trainerName || !submissionDate || attachedFiles.length === 0) {
            alert("Please fill in Trainer Name, Date Submitted, and attach at least one file.");
            return;
        }

        const newSubmission = {
            id: submittedSubmissions.length + 1,
            trainerName,
            dateSubmitted: submissionDate,
            status: "Pending",
            files: attachedFiles.map(file => file.name)
        };

        setSubmittedSubmissions((prevSubmissions) => [...prevSubmissions, newSubmission]);
        setAttachedFiles([]); // Clear the attached files
        setTrainerName("");
        setSubmissionDate("");
    };

    // Handle removal of a submission, only if status is not "Approved"
    const handleRemoveSubmission = (id) => {
        setSubmittedSubmissions((prevSubmissions) => prevSubmissions.filter(submission => submission.id !== id));
    };

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProponentsSideBar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/proponents/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Trainers CV/DTR</h1>
                    </div>

                    {/* Project Details */}
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

                    {/* Submitted Files Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Submitted Files</h2>
                        {submittedSubmissions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                                    <thead>
                                        <tr className="bg-gray-100 border-b">
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Trainer Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date Submitted</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Files</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submittedSubmissions.map((submission) => (
                                            <tr key={submission.id} className="border-b hover:bg-gray-100">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{submission.trainerName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.dateSubmitted}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <ul>
                                                        {submission.files.map((file, index) => (
                                                            <li key={index}>{file}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.status}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {/* Only show "Remove" if status is not "Approved" */}
                                                    {submission.status !== "Approved" && (
                                                        <button
                                                            onClick={() => handleRemoveSubmission(submission.id)}
                                                            className="text-red-500 hover:text-red-700 font-medium"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">No submissions yet.</p>
                        )}
                    </div>

                    {/* Add New Submission Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Add New Submission</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trainer Name</label>
                                <input
                                    type="text"
                                    value={trainerName}
                                    onChange={(e) => setTrainerName(e.target.value)}
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Enter Trainer Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date Submitted</label>
                                <input
                                    type="date"
                                    value={submissionDate}
                                    onChange={(e) => setSubmissionDate(e.target.value)}
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                />
                            </div>
                        </div>

                        {/* Attach Files */}
                        <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center mb-6 relative mt-6">
                            <h3 className="font-semibold text-center mb-1">Attach Files</h3>
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
                                onClick={handleSubmit}
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

export default ProponentsTrainerCVDTR;
