import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";

const EstaffTrainerCVDTR = () => {
    const [submittedSubmissions, setSubmittedSubmissions] = useState([
        { 
            id: 1, 
            files: ["DTR1.pdf", "DTR2.pdf"], 
            submittedBy: "Proponent A", 
            dateSubmitted: "2024-10-10", 
            status: "Approved", 
            comment: "" 
        },
        { 
            id: 2, 
            files: ["DTR3.pdf"], 
            submittedBy: "Proponent B", 
            dateSubmitted: "2024-10-11", 
            status: "Pending", 
            comment: "" 
        }
    ]);

    const [declineComment, setDeclineComment] = useState({});
    const [showCommentInput, setShowCommentInput] = useState({});

    const handleApprove = (id) => {
        setSubmittedSubmissions((prevSubmissions) =>
            prevSubmissions.map((submission) =>
                submission.id === id
                    ? { ...submission, status: "Approved", comment: "" }
                    : submission
            )
        );
    };

    const handleDecline = (id) => {
        setShowCommentInput((prevState) => ({ ...prevState, [id]: true }));
    };

    const handleCommentChange = (id, comment) => {
        setDeclineComment((prevComments) => ({ ...prevComments, [id]: comment }));
    };

    const handleSubmitComment = (id) => {
        const comment = declineComment[id] || "";
        setSubmittedSubmissions((prevSubmissions) =>
            prevSubmissions.map((submission) =>
                submission.id === id
                    ? { ...submission, status: "Declined", comment }
                    : submission
            )
        );
        setShowCommentInput((prevState) => ({ ...prevState, [id]: false }));
        setDeclineComment((prevComments) => ({ ...prevComments, [id]: "" }));
    };

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <EStaffSideBar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Trainers CV/DTR</h1>

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
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Files</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Submitted By</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date Submitted</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submittedSubmissions.map((submission) => (
                                        <tr key={submission.id} className="border-b hover:bg-gray-100">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                <ul>
                                                    {submission.files.map((file, index) => (
                                                        <li key={index}>{file}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.submittedBy}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.dateSubmitted}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <button
                                                    onClick={() => handleApprove(submission.id)}
                                                    className="text-green-500 hover:text-green-700 font-medium"
                                                >
                                                    Approve
                                                </button>
                                                <span className="mx-2">|</span>
                                                <button
                                                    onClick={() => handleDecline(submission.id)}
                                                    className="text-red-500 hover:text-red-700 font-medium"
                                                >
                                                    Decline
                                                </button>
                                                {showCommentInput[submission.id] && (
                                                    <div className="mt-2 flex items-center">
                                                        <input
                                                            type="text"
                                                            value={declineComment[submission.id] || ""}
                                                            onChange={(e) => handleCommentChange(submission.id, e.target.value)}
                                                            placeholder="Reason for decline"
                                                            className="bg-gray-100 rounded-lg p-2 w-3/4 mr-2"
                                                        />
                                                        <button
                                                            onClick={() => handleSubmitComment(submission.id)}
                                                            className="text-blue-500 hover:text-blue-700 font-medium"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
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

export default EstaffTrainerCVDTR;
