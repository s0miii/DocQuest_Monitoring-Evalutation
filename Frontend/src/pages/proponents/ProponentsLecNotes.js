import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProponentsSideBar from "../../components/ProponentsSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProponentsLecNotes = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

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
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [trainerName, setTrainerName] = useState("");
    const [submissionDate, setSubmissionDate] = useState(today);

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

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files).map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));
        setAttachedFiles(files); 
    };

    const handleSubmit = () => {
        if (!trainerName || !submissionDate || attachedFiles.length === 0 ) {
            alert("Please complete all fields and attach at least one file.");
            return;
        }

        const newSubmission = {
            id: submittedSubmissions.length + 1,
            trainerName,
            dateSubmitted: submissionDate,
            files: attachedFiles,
            status: "Pending",
            comments: ""
        };

        setSubmittedSubmissions(prevSubmissions => [...prevSubmissions, newSubmission]);
        setAttachedFiles([]);
        setTrainerName("");
        setSubmissionDate("");
    };

    const handleRemoveSubmission = (id) => {
        setSubmittedSubmissions(prevSubmissions => prevSubmissions.filter(submission => submission.id !== id));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProponentsSideBar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => navigate('/proponents/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Modules/Lecture Notes</h1>
                    </div>


                    {/* Project Details */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.title}</p> {/* sample onliiiii */}
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
                                                        <li key={index}>
                                                            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {submission.status}
                                                {submission.status === "Declined" && submission.comments && (
                                                    <p className="text-xs text-red-500 mt-1">{submission.comments}</p>  // Smaller font and below the status
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {submission.status !== "Approved" && (
                                                    <button onClick={() => handleRemoveSubmission(submission.id)} className="text-red-500 hover:text-red-700">
                                                        Remove
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
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
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="mb-4 col-span-2"></div>
                        <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center mb-6 relative">
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
                        {attachedFiles.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {attachedFiles.map((file, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                                        <img
                                            src={file.url}
                                            alt={`Preview ${index}`}
                                            className="h-32 w-full object-cover rounded-lg"
                                        />
                                        <p className="text-xs text-center mt-2">{file.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSubmit}
                                type="button"
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-12 rounded-lg transition-colors"
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

export default ProponentsLecNotes;
