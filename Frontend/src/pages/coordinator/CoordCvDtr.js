import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import CoordinatorSideBar from "../../components/CoordinatorSideBar";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";

const CoordCvDtr = () => {
    const navigate = useNavigate();
    const { projectID } = useParams(); // Extract projectID from the URL
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [totalAttendees, setAttendees] = useState(0);
    const [attachedFiles, setAttachedFiles] = useState([]);

    // deployed
    const API_URL = process.env.REACT_APP_API_URL;

    // local
    // const API_URL = 'http://127.0.0.1:8000/';
    // ${API_URL}

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
                    `${API_URL}/monitoring/projects/${projectID}/details/`,
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
        fetchUpdatedSubmissions();
    }, [projectID, navigate]);

    const fetchUpdatedSubmissions = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/monitoring/project/${projectID}/checklist/Trainer%20CV%20DTR/submissions/`,
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
                setSubmissions(data.submissions); // Dynamically update submissions
            } else {
                console.error("Failed to fetch submissions.");
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    const handleApprove = async (submissionId, modelName) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in. Please log in and try again.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/monitoring/submission/update/trainer_cv_dtr/${submissionId}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "Approved" }),
                }
            );

            if (response.ok) {
                alert("Submission approved successfully!");
                fetchUpdatedSubmissions(); // Refresh the submissions
            } else {
                const errorData = await response.json();
                alert(`Error approving submission: ${errorData.error || "An error occurred."}`);
            }
        } catch (error) {
            console.error("Error approving submission:", error);
            alert("An error occurred while approving the submission.");
        }
    };

    const handleReject = async (submissionId, modelName) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in. Please log in and try again.");
            return;
        }

        const rejectionReason = prompt("Please provide a reason for rejection:");

        if (!rejectionReason) {
            alert("Rejection reason is required.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/monitoring/submission/update/trainer_cv_dtr/${submissionId}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "Rejected", rejection_reason: rejectionReason }),
                }
            );

            if (response.ok) {
                alert("Submission rejected successfully!");
                fetchUpdatedSubmissions(); // Refresh the submissions
            } else {
                const errorData = await response.json();
                alert(`Error rejecting submission: ${errorData.error || "An error occurred."}`);
            }
        } catch (error) {
            console.error("Error rejecting submission:", error);
            alert("An error occurred while rejecting the submission.");
        }
    };

    const handleReset = async (submissionId, modelName) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in. Please log in and try again.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/monitoring/submission/update/trainer_cv_dtr/${submissionId}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "Pending" }),
                }
            );

            if (response.ok) {
                alert("Undid successfully.");
                fetchUpdatedSubmissions(); // Refresh the submissions
            } else {
                const errorData = await response.json();
                alert(`Error resetting submission: ${errorData.error || "An error occurred."}`);
            }
        } catch (error) {
            console.error("Error resetting submission:", error);
            alert("An error occurred while resetting the submission.");
        }
    };

    // Function to handle sorting
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedData = [...submissions].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSubmissions(sortedData);
    };

    // loading substitute
    if (loading) {
        return (
            <div className="p-4">
                <div className="bg-gray-200 animate-pulse h-6 w-3/4 mb-4 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-6 w-1/2 mb-4 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-6 w-full rounded"></div>
            </div>
        );
    }

    if (!projectDetails) {
        return <div>Project not found.</div>;
    }



    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <CoordinatorSideBar />
            </div>
            {/* Main content area */}
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/estaff/projreq/:projectID')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Trainer CV/DTR</h1>
                    </div>
                    {/* Project Details */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">
                            Project Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Project Title
                                </label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">
                                    {projectDetails.projectTitle}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Project Leader
                                </label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">
                                    {projectDetails.projectLeader}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    College/Campus
                                </label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">
                                    {projectDetails.college}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Target Date
                                </label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">
                                    {projectDetails.targetDate}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Partner Agency
                                </label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">
                                    {projectDetails.partnerAgency}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submitted Files Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Submitted Files</h2>
                        <div
                            className="overflow-y-auto"
                            style={{
                                maxHeight: "300px", // Limit the table height
                            }}
                        >
                            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                                <thead className="sticky top-0 bg-gray-100 z-10">
                                    <tr className="border-b">
                                        <th
                                            className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("file_name")}
                                        >
                                            File Name
                                            {sortConfig.key === "file_name" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("submitted_by")}
                                        >
                                            Submitted By
                                            {sortConfig.key === "submitted_by" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("date_uploaded")}
                                        >
                                            Date Submitted
                                            {sortConfig.key === "date_uploaded" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th
                                            className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            {sortConfig.key === "status" &&
                                                (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length > 0 ? (
                                        submissions.map((submission) => (
                                            <tr key={submission.submission_id} className="border-b hover:bg-gray-100">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <a
                                                        href={submission.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate block text-center"
                                                    >
                                                        {submission.file_name || "No File"}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                    {submission.submitted_by || "Unknown"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
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
                                                        <p className="text-xs text-red-600 mt-1">{submission.rejection_reason}</p>
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
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CoordCvDtr;
