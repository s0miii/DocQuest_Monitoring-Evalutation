import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";
import ProponentsSideBar from "../../components/ProponentsSideBar";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ProponentsDailyAttRec = () => {
    const navigate = useNavigate();
    const { projectID } = useParams(); // Extract projectID from the URL
    const [projectDetails, setProjectDetails] = useState(null);
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [totalAttendees, setAttendees] = useState(0);
    const [attachedFiles, setAttachedFiles] = useState([]); // Array to handle multiple files
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const currentUser = localStorage.getItem("userFullName");

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
                const token = localStorage.getItem("authToken");
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
        const token = localStorage.getItem("authToken");

        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/monitoring/project/${projectID}/checklist/Daily Attendance/submissions/`,
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

    // Handle form submission
    const handleSubmit = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("User not logged in or invalid session.");
            return;
        }

        const formData = new FormData();
        formData.append("description", description);
        formData.append("total_attendees", totalAttendees);

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
                setAttendees(0);
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
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("User not logged in or invalid session.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this submission?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/monitoring/submissions/${submissionId}/`,
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

    if (loading) {
        return <div>Loading project details...</div>;
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
                        <button
                            className="mr-2"
                            onClick={() => handleViewClick("/proponents/proj/req/:projectID")}
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Daily Attendance Record</h1>
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

                    {/* Add New Submission Section */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-xl font-semibold text-center mb-6">
                            Add New Submission
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
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
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Set Date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Total Number of Attendees
                                </label>
                                <input
                                    type="number"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Number of Attendees"
                                    value={totalAttendees}
                                    onChange={(e) => setAttendees(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Preview of Attached Files */}
                        <div className="border border-gray-300 rounded-lg p-4 mb-6 relative">
                            <h3 className="font-semibold text-center mb-3">Attach Files</h3>
                            {attachedFiles.length === 0 && (
                                <div className="text-gray-400 mb-3">
                                    <span className="block text-center text-3xl">+</span>
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
                                    className="grid grid-cols-5 gap-3 mt-4 w-full overflow-y-auto"
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
                                                    className="h-20 w-20 object-cover rounded-lg" // Deducted 10% width
                                                />
                                            )
                                            : (
                                                <div className="flex items-center justify-center h-20 w-20 bg-gray-200 rounded-lg text-gray-600">
                                                    <span className="text-lg">{fileExtension}</span>
                                                </div>
                                            );

                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col items-center border border-gray-200 rounded-lg p-2 shadow-md"
                                                title={file.name}
                                                style={{ marginBottom: "10px" }}
                                            >
                                                {filePreview}
                                                <p className="text-xs mt-2 text-center truncate w-full">{file.name}</p>
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
                                className="bg-yellow-500 text-white font-bold py-2 px-12 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Submit
                            </button>
                        </div>

                        {/* Uploaded Submissions Section */}
                        <div className="bg-white shadow-lg rounded-lg p-8 mt-6">
                            <h2 className="text-xl font-semibold text-center mb-6">Your Daily Attendance Records</h2>
                            {submissions.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {submissions.map((submission) => {
                                        // Remove "attendance_records/" prefix
                                        const processedFileName = submission.file_name?.replace("attendance_records/", "") || "N/A";

                                        // Truncate long file names
                                        const displayFileName =
                                            processedFileName.length > 20
                                                ? `${processedFileName.substring(0, 17)}...`
                                                : processedFileName;

                                        return (
                                            <div key={submission.submission_id} className="border border-gray-300 rounded-lg p-4 relative">
                                                {/* Delete button */}
                                                <button
                                                    className="absolute top-2 right-2 text-gray-700 font-bold"
                                                    onClick={() => handleDelete(submission.submission_id)}
                                                >
                                                    X
                                                </button>
                                                <p className="font-medium">
                                                    Status:{" "}
                                                    <span
                                                        className={
                                                            submission.status === "Approved"
                                                                ? "text-green-500"
                                                                : submission.status === "Rejected"
                                                                    ? "text-red-500"
                                                                    : "text-blue-500"
                                                        }
                                                    >
                                                        {submission.status}
                                                    </span>
                                                </p>
                                                {submission.rejection_reason && submission.status === "Rejected" && (
                                                    <p className="text-black">Rejection Reason: {submission.rejection_reason}</p>
                                                )}
                                                <p className="text-gray-500 text-sm">
                                                    Uploaded On: {new Date(submission.date_uploaded).toLocaleString()}
                                                </p>
                                                {submission.file_name && (
                                                    <p className="text-sm text-gray-700 mt-2">
                                                        File Name: <span className="font-mono">{displayFileName}</span>
                                                    </p>
                                                )}
                                                {submission.description && (
                                                    <p className="text-gray-600 text-sm mt-2">
                                                        Description: {submission.description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center">You have not uploaded any submissions yet.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProponentsDailyAttRec;
