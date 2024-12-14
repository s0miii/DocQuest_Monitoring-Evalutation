import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ProjLeadEvalSum = () => {
    const navigate = useNavigate();
    const { projectID } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [submissions, setSubmissions] = useState([]);
    // const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const [trainers, setTrainers] = useState([]);
    // const [selectedTrainerId, setSelectedTrainerId] = useState('');
    // const [sharableLink, setSharableLink] = useState("");
    // const [expirationDate, setExpirationDate] = useState('');
    
    const [generatedLinks, setGeneratedLinks] = useState([]);
    const [linkData, setLinkData] = useState({ trainer: "", expirationDate: "" });
    const [loadingLinks, setLoadingLinks] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleViewClick = (path) => {
        navigate(path.replace(":projectID", projectID));
    };

    // Fetch project details and submissions
    useEffect(() => {
        if (!projectID) {
            console.error("Project ID is undefined.");
            return;
        }

        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("User not logged in. Please log in again.");
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/monitoring/projects/${projectID}/details/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setProjectDetails(data.projectDetails);
                    setIsProjectLeader(data.isProjectLeader);
                } else {
                    console.error("Failed to fetch project details.");
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
        // fetchUpdatedSubmissions();
    }, [projectID, navigate]);


    // Fetch generated links for the project
    const fetchGeneratedLinks = async () => {
        setLoadingLinks(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/monitoring/evaluation_links/?project=${projectID}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setGeneratedLinks(data.links);
            } else {
                setErrorMessage("Failed to fetch links.");
            }
        } catch (error) {
            console.error("Error fetching links:", error);
            setErrorMessage("Failed to fetch links.");
        } finally {
            setLoadingLinks(false);
        }
    };

    useEffect(() => {
        const fetchTrainers = async () => {
            const token = localStorage.getItem("token");
            if (!projectID || !token) {
                console.error("Project ID is undefined or user is not logged in.");
                setTrainers([]); // Ensures trainers is always an array
                return;
            }
    
            try {
                const response = await fetch(`http://127.0.0.1:8000/monitoring/project/${projectID}/trainers/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch trainers');
                }
                const data = await response.json();
                setTrainers(data.trainers || []); // Fallback to an empty array if undefined
            } catch (error) {
                console.error('Error fetching trainers:', error);
                setTrainers([]); // Ensures trainers is always an array on error
            }
        };
    
        fetchTrainers();
    }, [projectID]);
    

    // Handle Sharable Link generation
    const handleGenerateLink = async (e) => {
        e.preventDefault();
        const { trainer, expirationDate } = linkData;
        const token = localStorage.getItem("token");
        if (!token) return;
    
        const postData = {
            trainer_id: trainer,
            project_id: projectID,
            expiration_date: expirationDate,
        };

        console.log("Post Data being sent:", postData);
    
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/monitoring/generate_evaluation_link/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                }
            );
    
            const data = await response.json(); // Assuming the server always returns JSON
            if (response.ok) {
                setLinkData({ trainer: "", expirationDate: "" });  // Reset form on success
                fetchGeneratedLinks();  // Refresh the links list
                setErrorMessage("");  // Clear any existing error message
            } else {
                throw new Error(data.error || "Failed to generate link.");
            }
        } catch (error) {
            console.error("Error generating link:", error);
            setErrorMessage(error.message || "Error generating link.");
        }
    };
    
    // const fetchUpdatedSubmissions = async () => {
    //     const token = localStorage.getItem("token");

    //     if (!token) {
    //         alert("User not logged in. Please log in again.");
    //         navigate("/login");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(
    //             `http://127.0.0.1:8000/monitoring/project/${projectID}/checklist/Daily%20Attendance/submissions/`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `Token ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (response.ok) {
    //             const data = await response.json();
    //             setSubmissions(data.submissions); // Dynamically update submissions
    //         } else {
    //             console.error("Failed to fetch submissions.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching submissions:", error);
    //     }
    // };


    // // Function to handle sorting
    // const handleSort = (key) => {
    //     let direction = "asc";
    //     if (sortConfig.key === key && sortConfig.direction === "asc") {
    //         direction = "desc";
    //     }
    //     setSortConfig({ key, direction });

    //     const sortedData = [...submissions].sort((a, b) => {
    //         if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    //         if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    //         return 0;
    //     });

    //     setSubmissions(sortedData);
    // };

    // const handleApprove = async (submissionId, modelName) => {
    //     const token = localStorage.getItem("token");

    //     if (!token) {
    //         alert("You are not logged in. Please log in and try again.");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(
    //             `http://127.0.0.1:8000/monitoring/submission/update/daily_attendance/${submissionId}/`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Token ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({ status: "Approved" }),
    //             }
    //         );

    //         if (response.ok) {
    //             alert("Submission approved successfully!");
    //             fetchUpdatedSubmissions(); // Refresh the submissions
    //         } else {
    //             const errorData = await response.json();
    //             alert(`Error approving submission: ${errorData.error || "An error occurred."}`);
    //         }
    //     } catch (error) {
    //         console.error("Error approving submission:", error);
    //         alert("An error occurred while approving the submission.");
    //     }
    // };

    // const handleReject = async (submissionId, modelName) => {
    //     const token = localStorage.getItem("token");

    //     if (!token) {
    //         alert("You are not logged in. Please log in and try again.");
    //         return;
    //     }

    //     const rejectionReason = prompt("Please provide a reason for rejection:");

    //     if (!rejectionReason) {
    //         alert("Rejection reason is required.");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(
    //             `http://127.0.0.1:8000/monitoring/submission/update/daily_attendance/${submissionId}/`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Token ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({ status: "Rejected", rejection_reason: rejectionReason }),
    //             }
    //         );

    //         if (response.ok) {
    //             alert("Submission rejected successfully!");
    //             fetchUpdatedSubmissions(); // Refresh the submissions
    //         } else {
    //             const errorData = await response.json();
    //             alert(`Error rejecting submission: ${errorData.error || "An error occurred."}`);
    //         }
    //     } catch (error) {
    //         console.error("Error rejecting submission:", error);
    //         alert("An error occurred while rejecting the submission.");
    //     }
    // };

    
    // loading substitute
    if (loading) {
        return (
            <div className="p-4">
                <div className="w-3/4 h-6 mb-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/2 h-6 mb-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    if (!projectDetails) {
        return <div>Project not found.</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-200">
            <div className="fixed w-1/5 h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col px-10 mt-14">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/proj/req/:projectID')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Evaluation Summary</h1>
                    </div>

                    {/* Project Details */}
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-center">
                            Project Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Project Title
                                </label>
                                <p className="p-3 mt-1 bg-gray-100 rounded-lg">
                                    {projectDetails.projectTitle}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Project Leader
                                </label>
                                <p className="p-3 mt-1 bg-gray-100 rounded-lg">
                                    {projectDetails.projectLeader}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    College/Campus
                                </label>
                                <p className="p-3 mt-1 bg-gray-100 rounded-lg">
                                    {projectDetails.college}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Target Date
                                </label>
                                <p className="p-3 mt-1 bg-gray-100 rounded-lg">
                                    {projectDetails.targetDate}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Partner Agency
                                </label>
                                <p className="p-3 mt-1 bg-gray-100 rounded-lg">
                                    {projectDetails.partnerAgency}
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Submitted Files Section */}
                    {/* <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-center">Submitted Files</h2>
                        <div
                            className="overflow-y-auto"
                            style={{
                                maxHeight: "300px", // Limit the table height
                            }}
                        >
                            <table className="min-w-full bg-white rounded-lg shadow-md table-auto">
                                <thead className="sticky top-0 z-10 bg-gray-100">
                                    <tr className="border-b">
                                        <th
                                            className="px-6 py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase cursor-pointer"
                                            onClick={() => handleSort("file_name")}
                                        >
                                            File Name
                                            {sortConfig.key === "file_name" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase cursor-pointer"
                                            onClick={() => handleSort("submitted_by")}
                                        >
                                            Submitted By
                                            {sortConfig.key === "submitted_by" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase cursor-pointer"
                                            onClick={() => handleSort("date_uploaded")}
                                        >
                                            Date Submitted
                                            {sortConfig.key === "date_uploaded" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>
                                        <th className="px-6 py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase">
                                            Description
                                        </th>
                                        <th
                                            className="px-6 py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase cursor-pointer"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            {sortConfig.key === "status" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>
                                        <th className="px-6 py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length > 0 ? (
                                        submissions.map((submission) => (
                                            <tr key={submission.submission_id} className="border-b hover:bg-gray-100">
                                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                    <a
                                                        href={`http://127.0.0.1:8000/media/${submission.directory}/${submission.file_name}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-center text-blue-600 truncate hover:underline"
                                                    >
                                                        {submission.file_name || "No File"}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center text-gray-700 whitespace-nowrap">
                                                    {submission.submitted_by || "Unknown"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center text-gray-700 whitespace-nowrap">
                                                    {new Date(submission.date_uploaded).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700" style={{ maxWidth: "200px", wordWrap: "break-word" }}>
                                                    {submission.description || "No Description"}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <p
                                                        className={` ${submission.status === "Approved"
                                                            ? "text-green-600"
                                                            : submission.status === "Pending"
                                                                ? "text-yellow-500"
                                                                : submission.status === "Rejected"
                                                                    ? "text-red-600"
                                                                    : "text-gray-600"
                                                            }`}
                                                    >
                                                        {submission.status}
                                                    </p>
                                                    {submission.status === "Rejected" && submission.rejection_reason && (
                                                        <p className="mt-1 text-xs text-red-600">{submission.rejection_reason}</p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center text-gray-700 whitespace-nowrap">
                                                    {submission.status === "Approved" ? (
                                                        <span className="text-gray-500">Approved</span>
                                                    ) : submission.status === "Rejected" ? (
                                                        <span className="text-gray-500">Rejected</span>
                                                    ) : (
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() => handleApprove(submission.submission_id, submission.model_name)}
                                                                className="text-green-500 hover:text-green-700"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(submission.submission_id, submission.model_name)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No submissions available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div> */}

                    {/* Evaluation Summary Section */}
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-center">Summary of Evaluation</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full max-w-md mx-auto text-sm text-center border border-collapse border-gray-300 table-fixed">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="w-2/3 px-4 py-2 border border-gray-300">Rating</th>
                                        <th className="w-1/3 px-4 py-2 border border-gray-300">Total Responses</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Excellent (5)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input
                                                type="number"
                                                className="w-full p-2 text-center bg-gray-100 rounded-lg"
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Very Satisfactory (4)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input
                                                type="number"
                                                className="w-full p-2 text-center bg-gray-100 rounded-lg"
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Satisfactory (3)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input
                                                type="number"
                                                className="w-full p-2 text-center bg-gray-100 rounded-lg"
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Fair (2)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input
                                                type="number"
                                                className="w-full p-2 text-center bg-gray-100 rounded-lg"
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 border border-gray-300">Poor (1)</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <input
                                                type="number"
                                                className="w-full p-2 text-center bg-gray-100 rounded-lg"
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 font-semibold border border-gray-300">Sub Total</td>
                                        <td className="px-4 py-2 font-semibold border border-gray-300">15</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="grid max-w-2xl grid-cols-2 gap-4 mx-auto mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Evaluations</label>
                                <input
                                    type="text"
                                    className="w-full p-3 mt-1 bg-gray-100 rounded-lg"
                                    placeholder="Total Evaluations"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Percentage</label>
                                <input
                                    type="text"
                                    className="w-full p-3 mt-1 bg-gray-100 rounded-lg"
                                    placeholder="Percentage"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>


                    {/* Sharable Link Generation Section */}
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-center">Generate Sharable Link</h2>

                        <form onSubmit={handleGenerateLink}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Trainer</label>
                                <select
                                    value={linkData.trainer}
                                    onChange={(e) => setLinkData({ ...linkData, trainer: e.target.value })}
                                    className="w-full p-2 bg-gray-100 rounded-lg"
                                >
                                    <option value="">Select a Trainer</option>
                                    {Array.isArray(trainers) && trainers.map((trainer) => (
                                        <option key={trainer.LOTID} value={trainer.LOTID}>{trainer.faculty}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                                <input
                                    type="date"
                                    value={linkData.expirationDate}
                                    onChange={(e) => setLinkData({ ...linkData, expirationDate: e.target.value })}
                                    className="w-full p-2 bg-gray-100 rounded-lg"
                                />
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Generate Link
                                </button>
                            </div>
                        </form>

                        {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}

                        {/* Display Generated Links */}
                        <div className="mt-6">
                            {loadingLinks ? (
                                <p>Loading generated links...</p>
                            ) : (
                                <ul>
                                    {generatedLinks.map((link) => (
                                        <li key={link.id} className="mb-2">
                                            <div className="flex items-center justify-between">
                                                <span>{link.link_url}</span>
                                                <span>{link.expiration_date}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadEvalSum;
