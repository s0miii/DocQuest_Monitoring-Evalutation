import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";
import ProponentsSideBar from "../../components/ProponentsSideBar";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ProponentsCvDtr = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { projectID } = useParams(); // Extract projectID from the URL
    const [projectDetails, setProjectDetails] = useState(null);
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [totalAttendees, setAttendees] = useState(0);
    const [attachedFiles, setAttachedFiles] = useState([]); // Array to handle multiple files
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const currentUser = localStorage.getItem("userFullName");

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
                formData.append("cv_dtr_file", file);
            });
        } else {
            alert("Please attach at least one file.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/monitoring/upload/trainer_cv_dtr/${projectID}/`, {
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
            const modelName = "trainer_cv_dtr";
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

    if (loading) {
        return (
            <div className="p-4">
                <div className="bg-gray-200 animate-pulse h-6 w-3/4 mb-4 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-6 w-1/2 mb-4 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-6 w-full rounded"></div>
            </div>
        );
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
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length > 0 ? (
                                        submissions.map((submission) => (
                                            <tr key={submission.submission_id} className="border-b hover:bg-gray-100">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <a
                                                        // href={`${API_URL}/media/${submission.directory}/${submission.file_name}`}
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
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
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-xl font-semibold text-center mb-6">
                            Add New Submission
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
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

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProponentsCvDtr;