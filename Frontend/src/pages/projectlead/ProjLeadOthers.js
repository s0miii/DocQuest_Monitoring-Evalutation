import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadOthers = () => {
    const navigate = useNavigate();

    const [projectDetails, setProjectDetails] = useState({
        title: "",
        leader: "",
        college: "",
        targetDate: "",
        partnerAgency: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [submittedSubmissions, setSubmittedSubmissions] = useState([]);
    const [declineComment, setDeclineComment] = useState({});
    const [showCommentInput, setShowCommentInput] = useState({});

    useEffect(() => {
        const mockData = {
            title: "Tesda Vocational",
            leader: "Tabasan, Wynoah Louis",
            college: "CEA",
            targetDate: "May 2024",
            partnerAgency: "Placeholder Inc."
        };
        setProjectDetails(mockData);
        setLoading(false);

        // const fetchProjectDetails = async () => {
        //     setLoading(true);
        //     try {
        //         const response = await fetch('https://api.samting.com/projects/details');
        //         if (!response.ok) throw new Error('Network response was not ok');
        //         const data = await response.json();
        //         setProjectDetails(data);
        //     } catch (error) {
        //         setError('Failed to fetch data: ' + error.message);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchProjectDetails();
    }, []);

    const handleApprove = (id) => {
        setSubmittedSubmissions(prevSubmissions =>
            prevSubmissions.map(submission =>
                submission.id === id ? { ...submission, status: "Approved", comment: "" } : submission
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
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => navigate('/projlead/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Other/s</h1>
                    </div>

                    {/* Project Details */}
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
                    </div>

                    {/* Submitted Files Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Submitted Files</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Trainer Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date Submitted</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Files</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submittedSubmissions.map((submission) => (
                                        <tr key={submission.id} className="border-b hover:bg-gray-100">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.submittedBy}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.dateSubmitted}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <ul>
                                                    {submission.files.map((file, index) => (
                                                        <li key={index}>
                                                            <a href={`#`} target="_blank" rel="noopener noreferrer">{file}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <button onClick={() => handleApprove(submission.id)} className="text-green-500 hover:text-green-700">Approve</button>
                                                <span className="mx-2">|</span>
                                                <button onClick={() => handleDecline(submission.id)} className="text-red-500 hover:text-red-700">Decline</button>
                                                {showCommentInput[submission.id] && (
                                                    <div className="mt-2 flex items-center">
                                                        <input
                                                            type="text"
                                                            value={declineComment[submission.id] || ""}
                                                            onChange={(e) => handleCommentChange(submission.id, e.target.value)}
                                                            placeholder="Comment"
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

export default ProjLeadOthers;
