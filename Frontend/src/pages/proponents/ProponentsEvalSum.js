import React, { useEffect, useState, useRef } from "react";
import Topbar from "../../components/Topbar";
import { useParams, useNavigate } from 'react-router-dom';
import ProponentsSideBar from "../../components/ProponentsSideBar";
import { FaArrowLeft, FaCopy, FaTrash } from "react-icons/fa";
import axios from 'axios';

const ProponentsEvalSum = () => {
    const navigate = useNavigate();
    const { trainerID, projectID } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const [choice, setChoice] = useState("uploadFiles");
    const [generatedLinks, setGeneratedLinks] = useState([]);
    const [linkData, setLinkData] = useState({ trainer: "", expirationDate: "" });
    const [loadingLinks, setLoadingLinks] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [description, setDescription] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [date, setDate] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);
    const linksSectionRef = useRef(null);
    const isExpired = (expirationDate) => new Date(expirationDate) < new Date();


    // deployed
    const API_URL = process.env.REACT_APP_API_URL;

    // local
    // const API_URL = 'http://127.0.0.1:8000/';
    // ${API_URL}

    const [categories, setCategories] = useState({});
    const [totalEvaluations, setTotalEvaluations] = useState();

    const handleChoice = (choice) => {
        setChoice(choice); // set the choice based on user selection
    };

    const handleViewClick = (path) => {
        navigate(path);
    }

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
                `${API_URL}/monitoring/project/${projectID}/checklist/Summary%20of%20Evaluation/submissions/`,
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




    // Handle file attachments
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in or invalid session.");
            return;
        }

        const formData = new FormData();
        formData.append("description", description);

        if (attachedFiles.length > 0) {
            attachedFiles.forEach((file) => {
                formData.append("summary_file", file);
            });
        } else {
            alert("Please attach at least one file.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/monitoring/upload/evaluation/${projectID}/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Submission successful!");
                setDescription("");
                setDate("");
                setAttachedFiles([]);
                fetchUpdatedSubmissions(); // Update submissions list
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || "Submission failed!"}`);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const handleDelete = async (submissionId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in or invalid session.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this submission?");
        if (!confirmDelete) return;

        try {
            // Adjust model_name to "summary_of_evaluation"
            const modelName = "summary_of_evaluation";
            const response = await fetch(
                `${API_URL}/monitoring/submissions/${modelName}/${submissionId}/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.ok) {
                alert("Submission deleted successfully!");
                fetchUpdatedSubmissions(); // Update submissions list
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || "Failed to delete submission."}`);
            }
        } catch (error) {
            console.error("Error deleting submission:", error);
            alert("An error occurred. Please try again.");
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

    useEffect(() => {
        const fetchSummaryData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/monitoring/project/${projectID}/evaluation_summary/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories); // Categories object
                    setTotalEvaluations(data.total_evaluations); // Total count
                } else {
                    alert("Failed to fetch evaluation summary");
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchSummaryData();
    }, [projectID]);



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
        <div className="bg-gray-200 min-h-screen flex">
            {/* Sidebar with fixed width */}
            <div className="w-1/5 fixed h-full">
                <ProponentsSideBar />
            </div>
            {/* Main content area */}
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick(`/proponents/proj/req/${projectID}`)}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Evaluation Summary/Evaluation Sheets</h1>
                    </div>

                    {/* Project Details and Progress Status Section */}
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
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-center">Submitted Files</h2>
                        <div
                            className="overflow-y-auto"
                            style={{
                                maxHeight: "300px", // Limit the table height
                            }}
                        >
                            <table className="min-w-full bg-white rounded-lg shadow-md table-auto">
                                <thead className="top-0 z-10 bg-gray-100">
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
                                                        href={submission.file_url}
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
                                                        <span className="text-gray-500">Cannot Remove</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDelete(submission.submission_id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
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

                    {/* Summary of Evaluation Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Summary of Evaluation</h2>
                        <div className="overflow-x-auto">
                            <table className="table-fixed w-full max-w-md mx-auto text-sm text-center border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 w-2/3">Rating</th>
                                        <th className="px-4 py-2 border border-gray-300 w-1/3">Total Responses</th>
                                        {/* <th className="px-4 py-2 border border-gray-300 w-1/3">Percentage</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(categories).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="px-4 py-2 border border-gray-300 capitalize">
                                                {key.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">{value}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {totalEvaluations > 0 ? ((value / totalEvaluations) * 100).toFixed(2) + "%" : "0%"}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="font-semibold px-4 py-2 border border-gray-300">Sub total</td>
                                        <td className="font-semibold px-4 py-2 border border-gray-300">{totalEvaluations}</td>
                                        <td className="font-semibold px-4 py-2 border border-gray-300">
                                            {totalEvaluations > 0 ? "100%" : "0%"}
                                        </td>
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
                                    value={totalEvaluations}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Percentage</label>
                                <input
                                    type="text"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    value={totalEvaluations > 0 ? "100%" : "0%"}
                                    readOnly
                                />
                            </div>
                        </div>

                    </div>


                    {/* Add New Submission Section */}
                    <div className="p-8 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-6 text-xl font-semibold text-center">
                            Add New Submission
                        </h2>

                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 mt-1 bg-gray-100 rounded-lg"
                                    placeholder="Enter a Short Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Preview of Attached Files */}
                        <div className="relative p-4 mb-6 border border-gray-300 rounded-lg">
                            <h3 className="mb-3 font-semibold text-center">Attach Files</h3>
                            {attachedFiles.length === 0 && (
                                <div className="mb-3 text-gray-400">
                                    <span className="block text-3xl text-center">+</span>
                                </div>
                            )}
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                style={{ zIndex: attachedFiles.length > 0 ? -1 : 1 }} // Prevent interference
                            />
                            {attachedFiles.length > 0 && (
                                <div
                                    className="grid w-full grid-cols-5 gap-3 mt-4 overflow-y-auto"
                                    style={{
                                        maxHeight: "250px", // Scrollable height
                                        paddingRight: "10px", // Space for scrollbar
                                    }}
                                >
                                    {attachedFiles.map((file, index) => {
                                        const fileExtension = file.name.split('.').pop().toUpperCase();
                                        const filePreview = file.type.startsWith("image/")
                                            ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`attachment-preview-${index}`}
                                                    className="object-cover w-20 h-20 rounded-lg" // Deducted 10% width
                                                />
                                            )
                                            : (
                                                <div className="flex items-center justify-center w-20 h-20 text-gray-600 bg-gray-200 rounded-lg">
                                                    <span className="text-lg">{fileExtension}</span>
                                                </div>
                                            );

                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col items-center p-2 border border-gray-200 rounded-lg shadow-md"
                                                title={file.name}
                                                style={{ marginBottom: "10px" }}
                                            >
                                                {filePreview}
                                                <p className="w-full mt-2 text-xs text-center truncate">{file.name}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-12 py-2 font-bold text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
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