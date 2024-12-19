import React, { useEffect, useState, useRef } from "react";
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft, FaCopy, FaTrash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const ProjLeadEvalSum = () => {
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
    const [categories, setCategories] = useState({});
    const [totalEvaluations, setTotalEvaluations] = useState();

    const handleChoice = (choice) => {
        setChoice(choice); // set the choice based on user selection
    };

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
                `http://127.0.0.1:8000/monitoring/project/${projectID}/checklist/Daily%20Attendance/submissions/`,
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
                setGeneratedLinks(data.links || []);
            } else {
                setGeneratedLinks([]); // Ensure it's an empty array on error
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
                setTrainers([]); 
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

    // Fetch generated links when the "generateLinks" tab is selected
    useEffect(() => {
        if (choice === "generateLinks") {
            fetchGeneratedLinks(); // Fetch links automatically
        }
    }, [choice]); // When 'choice' changes to "generateLinks", this effect will run

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

    const handleDeleteLink = async (linkId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Please log in again.");
            return;
        }
    
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/monitoring/evaluation_links/${linkId}/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
    
            if (response.ok) {
                alert("Link deleted successfully.");
                setGeneratedLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId));
            } else {
                alert("Failed to delete link.");
            }
        } catch (error) {
            console.error("Error deleting link:", error);
        }
    };

    const viewEvaluationReport = () => {
        navigate(`/evaluations/${trainerID}/${projectID}`);
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
                formData.append("attendance_file", file);
            });
        } else {
            alert("Please attach at least one file.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/monitoring/upload/attendance/${projectID}/`, {
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
            // Adjust model_name to "daily_attendance"
            const modelName = "daily_attendance";
            const response = await fetch(
                `http://127.0.0.1:8000/monitoring/submissions/${modelName}/${submissionId}/`,
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

    const handleCopyLink = link => {
        // Example backend link: 'http://127.0.0.1:8000/monitoring/evaluation/fill/{token}'
        // Assume the frontend route is similar but on a different port: 'http://127.0.0.1:3000/monitoring/evaluation/fill/{token}'
    
        const backendBaseURL = "127.0.0.1:8000";
        const frontendBaseURL = "127.0.0.1:3000";
    
        const frontendLink = link.replace(backendBaseURL, frontendBaseURL);
    
        navigator.clipboard.writeText(frontendLink).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Error copying link: ', err);
            alert('Failed to copy link.');
        });
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
                const response = await fetch(`http://127.0.0.1:8000/monitoring/project/${projectID}/evaluation_summary/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);  // Log to see the exact structure
                    setCategories(data.categories);
                    setTotalEvaluations(data.total_evaluations);
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

                    
                    {/* Buttons to choose file upload or link generation */}
                    <div className="flex mb-6 space-x-4">
                        <button
                            className={`px-6 py-2 text-white ${choice === "uploadFiles" ? "bg-blue-500" : "bg-gray-500"} rounded-lg`}
                            onClick={() => handleChoice("uploadFiles")}
                        >
                            Upload Physical Files
                        </button>
                        <button
                            className={`px-6 py-2 text-white ${choice === "generateLinks" ? "bg-blue-500" : "bg-gray-500"} rounded-lg`}
                            onClick={() => handleChoice("generateLinks")}
                        >
                            Generate Evaluation Links
                        </button>
                    </div>

                    {/* Conditional Rendering of Sections */}
                    {choice === "uploadFiles" && (
                        <div>
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
                                                                className="block text-center text-blue-900 truncate hover:underline"
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

                            {/* Add New Submission Section */}
                            <div className="p-8 bg-white rounded-lg shadow-lg">
                                <h2 className="mb-6 text-xl font-semibold text-center">
                                    Add New Submission
                                </h2>

                            <div className="grid grid-cols-2 gap-4 mb-6">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full p-3 mt-1 bg-gray-100 rounded-lg"
                                        placeholder="Set Date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
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
                                    className="px-12 py-2 font-bold text-white transition bg-blue-900 rounded-lg hover:bg-blue-900"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        </div>
                    )}

                    {choice === "generateLinks" && (
                        <div>
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
                                            {Object.entries(categories).map(([key, value], index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 border border-gray-300">{key}</td>
                                                    <td className="px-4 py-2 border border-gray-300">{value}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="px-4 py-2 font-semibold border border-gray-300">Sub Total</td>
                                                <td className="px-4 py-2 font-semibold border border-gray-300">{totalEvaluations}</td>
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
                                            value={totalEvaluations}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Percentage</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 mt-1 bg-gray-100 rounded-lg"
                                            value={`${(totalEvaluations / totalEvaluations * 100).toFixed(2)}%`} 
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Generated Evaluation Links Section */}
                            <div ref={linksSectionRef} className='p-6 mb-6 bg-white rounded-lg shadow-md'>
                                <h2 className='mb-4 text-2xl font-semibold text-center'>Generated Evaluation Links</h2>
                                <div className='overflow-x-auto overflow-y-auto max-h-60'>
                                    <table className='w-full border border-gray-200'>
                                        <thead>
                                            <tr className='bg-gray-50'>
                                                <th className='p-3 font-medium text-left text-gray-700'>Trainer Name</th>
                                                <th className='p-3 font-medium text-left text-gray-700'>Link</th>
                                                <th className='p-3 font-medium text-left text-gray-700'>Date Created</th>
                                                <th className='p-3 font-medium text-left text-gray-700'>Expiration Date</th>
                                                <th className='p-3 font-medium text-left text-gray-700'>Actions</th>
                                                <th className='p-3 font-medium text-left text-gray-700'>Evaluation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {generatedLinks && generatedLinks.length > 0 ? (
                                                generatedLinks.map((link, index) => (
                                                    <tr key={index} className='border-t'>
                                                        <td className='p-3 text-gray-600'>{link.trainer_name || "No trainer assigned"}</td>
                                                        <td className='p-3'>
                                                            {link.sharable_link ? (
                                                                <button
                                                                    onClick={() => handleCopyLink(link.sharable_link)}
                                                                    className={`flex items-center ${isExpired(link.expiration_date) ? 'cursor-not-allowed opacity-50 text-gray-500' : 'text-blue-500'}`}
                                                                    disabled={isExpired(link.expiration_date)}
                                                                >
                                                                    {isExpired(link.expiration_date) ? (
                                                                        <span>Expired</span>
                                                                    ) : (
                                                                        <>
                                                                            <FaCopy className='mr-1' />
                                                                            Copy Link
                                                                        </>
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-500">No link available</span>
                                                            )}
                                                        </td>
                                                        <td className='p-3 text-gray-600'>{new Date(link.created_at).toLocaleDateString()}</td>
                                                        <td className='p-3 text-gray-600'>{link.expiration_date || "No expiration date"}</td>
                                                        <td className='p-3'>
                                                            {isExpired(link.expiration_date) ? (
                                                                <span className="text-red-500">Expired</span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleDeleteLink(link.id)}
                                                                    className="text-red-500 hover:text-red-700">
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className='p-3'>
                                                            <button onClick={viewEvaluationReport}>
                                                                View Evaluation Report
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="p-3 text-center text-gray-500">
                                                        No evaluation links available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
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
                                            className="px-6 py-2 text-white transition-colors bg-blue-900 rounded-lg hover:bg-blue-700"
                                        >
                                            Generate Link
                                        </button>
                                    </div>
                                </form>
                                {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjLeadEvalSum;
