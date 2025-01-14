import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import axios from 'axios';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft, FaCopy, FaTrash, FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ProjLeadDailyAttRec = () => {
    const navigate = useNavigate();
    const { projectID } = useParams(); // Extract projectID from the URL
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [isProjectLeader, setIsProjectLeader] = useState(false);

    const [templateName, setTemplateName] = useState('');
    const [includeAttendeeName, setIncludeAttendeeName] = useState(true);
    const [includeGender, setIncludeGender] = useState(false);
    const [includeCollege, setIncludeCollege] = useState(false);
    const [includeDepartment, setIncludeDepartment] = useState(false);
    const [includeYearSection, setIncludeYearSection] = useState(false);
    const [includeAgencyOffice, setIncludeAgencyOffice] = useState(false);
    const [includeContactNumber, setIncludeContactNumber] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');
    const [templates, setTemplates] = useState([]);
    const [totalAttendeesTable, setTotalAttendeesTable] = useState(null);
    const [averageAttendees, setAverageAttendees] = useState(null);
    const [numTemplates, setNumTemplates] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [templateId, setTemplateId] = useState(null);
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [choice, setChoice] = useState("uploadFiles");
    // Reference to the "Generated Attendance Links" section
    const linksSectionRef = useRef(null);
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [totalAttendees, setAttendees] = useState(0);
    const [attachedFiles, setAttachedFiles] = useState([]);

    // deployed
    const API_URL = process.env.REACT_APP_API_URL;

    // local
    // const API_URL = 'http://127.0.0.1:8000/';
    // ${API_URL}

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

    // Fetch templates on component mount
    useEffect(() => {
        const token = localStorage.getItem("token"); // Move this inside useEffect
        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        const fetchTemplates = async () => {
            try {
                const response = await axios.get(`${API_URL}/monitoring/attendance_templates/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setTemplates(response.data);
            } catch (error) {
                console.error('Error fetching templates', error);
                alert('Failed to fetch templates.');
            }
        };
        fetchTemplates();
    }, []);

    // Function to handle calculation of total attendees
    const calculateTotalAttendees = async () => {
        try {
            const token = localStorage.getItem("token"); // Move this inside useEffect
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            const projectId = 1;
            const response = await axios.post(
                `${API_URL}/monitoring/calculate_attendees/${projectId}/`,
                {},
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setTotalAttendeesTable(response.data.total_attendees);
            setAverageAttendees(response.data.average_attendees);
            setNumTemplates(response.data.num_templates);
            alert('Attendance totals calculated successfully!');
        } catch (error) {
            console.error('Error calculating total attendees', error);
            alert('Failed to calculate total attendees.');
        }
    };

    const fetchUpdatedSubmissions = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/monitoring/project/${projectID}/checklist/Daily%20Attendance/submissions/`,
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
            const response = await fetch(`${API_URL}/monitoring/upload/attendance/${projectID}/`, {
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

    // Create new template
    const handleCreateTemplate = async () => {
        try {
            const token = localStorage.getItem("token"); // Move this inside useEffect
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                `${API_URL}/monitoring/attendance_templates/`,
                {
                    project: 1,
                    templateName,
                    include_attendee_name: includeAttendeeName,
                    include_gender: includeGender,
                    include_college: includeCollege,
                    include_department: includeDepartment,
                    include_year_section: includeYearSection,
                    include_agency_office: includeAgencyOffice,
                    include_contact_number: includeContactNumber,
                    expiration_date: expirationDate,
                },
                {
                    headers: { 'Authorization': `Token ${token}` },
                }
            );

            const newTemplate = response.data;
            setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
            alert(`Attendance Template Created! Share this link: ${newTemplate.sharable_link}`);

            // Scroll to "Generated Attendance Links" section after creation
            if (linksSectionRef.current) {
                linksSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }

            // Clear the form fields after creation
            setTemplateName('');
            setIncludeAttendeeName(true);
            setIncludeGender(false);
            setIncludeCollege(false);
            setIncludeDepartment(false);
            setIncludeYearSection(false);
            setIncludeAgencyOffice(false);
            setIncludeContactNumber(false);
            setExpirationDate('');

        } catch (error) {
            console.error('Error creating attendance template', error);
            alert('Failed to create attendance template.');
        }
    };

    // Check if template is expired
    const isExpired = (expirationDate) => {
        const today = new Date();
        const expiration = new Date(expirationDate);
        return expiration < today;
    };

    const handleCopyLink = link => {
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Error copying link: ', err);
            alert('Failed to copy link.');
        });
    };

    // Delete template
    const handleDeleteTemplate = async (templateId) => {
        try {
            const token = localStorage.getItem("token"); // Move this inside useEffect
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            await axios.delete(`${API_URL}/monitoring/attendance_templates/${templateId}/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            setTemplates(templates.filter(template => template.id !== templateId));
            alert('Template deleted successfully!');
        } catch (error) {
            console.error('Error deleting template', error);
            alert('Failed to delete template.');
        }
    };

    // Start editing a template
    const handleEditTemplate = (template) => {
        setIsEditing(true);
        setEditingTemplateId(template.id);
        setTemplateName(template.templateName);
        setIncludeAttendeeName(template.include_attendee_name);
        setIncludeGender(template.include_gender);
        setIncludeCollege(template.include_college);
        setIncludeDepartment(template.include_department);
        setIncludeYearSection(template.include_year_section);
        setIncludeAgencyOffice(template.include_agency_office);
        setIncludeContactNumber(template.include_contact_number);
        setExpirationDate(template.expiration_date);
    };

    // Save edited template
    const handleSaveTemplate = async () => {
        try {
            const token = localStorage.getItem("token"); // Move this inside useEffect
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            const response = await axios.put(
                `${API_URL}/monitoring/attendance_templates/${templateId}/`,
                `${API_URL}/monitoring/attendance_templates/${editingTemplateId}/`,
                {
                    project: 1,
                    templateName,
                    include_attendee_name: includeAttendeeName,
                    include_gender: includeGender,
                    include_college: includeCollege,
                    include_department: includeDepartment,
                    include_year_section: includeYearSection,
                    include_agency_office: includeAgencyOffice,
                    include_contact_number: includeContactNumber,
                    expiration_date: expirationDate,
                },
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            const updatedTemplate = response.data;
            setTemplates(prevTemplates =>
                prevTemplates.map(template =>
                    template.id === updatedTemplate.id ? updatedTemplate : template
                )
            );
            alert('Template updated successfully!');
            setIsEditing(false);  // Exit editing mode
            setEditingTemplateId(null);
            resetFormFields();
        } catch (error) {
            console.error('Error updating template', error.response || error);
            alert('Failed to update template. Please try again.');
        }
    };


    // Reset form fields after editing
    const resetFormFields = () => {
        setTemplateName('');
        setIncludeAttendeeName(true);
        setIncludeGender(false);
        setIncludeCollege(false);
        setIncludeDepartment(false);
        setIncludeYearSection(false);
        setIncludeAgencyOffice(false);
        setIncludeContactNumber(false);
        setExpirationDate('');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);  // Exit editing mode without saving changes
        setEditingTemplateId(null);  // Clear the editing template id
        resetFormFields();  // Clear the form fields
    };

    const handleViewAttendanceRecords = (templateId) => {
        // Navigate to a new page (or modal) where attendance records can be viewed.
        navigate(`/projlead/attendance-records/${templateId}`);
    };

    // Get today's date to set as the minimum value for expiration date
    const todayDate = new Date().toISOString().split('T')[0];


    return (
        <div className="flex min-h-screen bg-gray-200">
            <div className="fixed w-1/5 h-full">
                <ProjLeadSidebar />
            </div>
            {/* Main content area */}
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col px-10 mt-14">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/proj/req/:projectID')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Attendance Record</h1>
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
                            Generate Attendance Links
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
                                                >
                                                    Total Attendees
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
                                                                href={`${API_URL}/media/${submission.directory}/${submission.file_name}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block text-center text-blue-600 truncate hover:underline"
                                                            >
                                                                {submission.file_name || "No File"}
                                                            </a>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center text-gray-700 whitespace-nowrap">
                                                            {submission.total_attendees || "Unknown"}
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

                                <div className="grid grid-cols-3 gap-4 mb-6">
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Total Number of Attendees
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full p-3 mt-1 bg-gray-100 rounded-lg"
                                            placeholder="Number of Attendees"
                                            value={totalAttendees}
                                            onChange={(e) => setAttendees(e.target.value)}
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
                            </div >
                        </div >
                    )}

                    {
                        choice === "generateLinks" && (
                            <div>
                                {/* Total Attendees Info Section */}
                                <div className='p-6 mb-6 bg-white rounded-lg shadow-md'>
                                    <h2 className='mb-4 text-2xl font-semibold text-center'>Total Attendance Information</h2>
                                    <div className='grid grid-cols-1 gap-6 text-center md:grid-cols-3'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-600'>Total Attendees</label>
                                            <p className='p-3 mt-1 bg-gray-100 rounded-lg'>
                                                {totalAttendeesTable !== null ? totalAttendeesTable : 'Loading...'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-600'>Average Attendees</label>
                                            <p className='p-3 mt-1 bg-gray-100 rounded-lg'>
                                                {averageAttendees !== null ? averageAttendees : 'Loading...'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-600'>Number of Templates</label>
                                            <p className='p-3 mt-1 bg-gray-100 rounded-lg'>
                                                {numTemplates !== null ? numTemplates : 'Loading...'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4"> {/* This div centers the button horizontally */}
                                        <button
                                            onClick={calculateTotalAttendees}
                                            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                        >
                                            Calculate Total Attendees
                                        </button>
                                    </div>
                                </div>

                                {/* Generated Attendance Links Section */}
                                <div ref={linksSectionRef} className='p-6 mb-6 bg-white rounded-lg shadow-md'>
                                    <h2 className='mb-4 text-2xl font-semibold text-center'>Generated Attendance Links</h2>
                                    <div className='overflow-x-auto overflow-y-auto max-h-60'> {/* Tailwind classes for scrolling */}
                                        <table className='w-full border border-gray-200'>
                                            <thead>
                                                <tr className='bg-gray-50'>
                                                    <th className='p-3 font-medium text-left text-gray-700'>Template Name</th>
                                                    <th className='p-3 font-medium text-left text-gray-700'>Link</th>
                                                    <th className='p-3 font-medium text-left text-gray-700'>Date Created</th>
                                                    <th className='p-3 font-medium text-left text-gray-700'>Expiration Date</th>
                                                    <th className='p-3 font-medium text-left text-gray-700'>Actions</th>
                                                    <th className='p-3 font-medium text-left text-gray-700'>Attendance Report</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {templates.map((template, index) => (
                                                    <tr key={index} className='border-t'>
                                                        <td className='p-3 text-gray-600'>{template.templateName}</td>
                                                        <td className='p-3'>
                                                            <button
                                                                onClick={() => handleCopyLink(template.sharable_link)}
                                                                className={`flex items-center ${isExpired(template.expiration_date) ? 'cursor-not-allowed opacity-50 text-gray-500' : 'text-blue-500'}`}
                                                                disabled={isExpired(template.expiration_date)}
                                                            >
                                                                {isExpired(template.expiration_date) ? (
                                                                    <span>Expired</span>
                                                                ) : (
                                                                    <>
                                                                        <FaCopy className='mr-1' />
                                                                        Copy Link
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                        <td className='p-3 text-gray-600'>{new Date(template.created_at).toLocaleDateString()}</td>
                                                        <td className='p-3 text-gray-600'>{template.expiration_date || 'N/A'}</td>
                                                        <td className='p-3'>
                                                            {isExpired(template.expiration_date) ? (
                                                                <span className='text-red-500'>Expired</span>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleDeleteTemplate(template.id)}
                                                                        className='mr-2 text-red-500'>
                                                                        <FaTrash />
                                                                    </button>
                                                                </>
                                                            )
                                                            }
                                                        </td >
                                                        <td className='p-3 text-gray-600'>
                                                            <button
                                                                onClick={() => handleViewAttendanceRecords(template.id)}
                                                                className='text-blue-500 hover:text-blue-600'>
                                                                View Attendance Records
                                                            </button>
                                                        </td >
                                                    </tr >
                                                ))}
                                            </tbody >
                                        </table >
                                    </div >
                                </div >

                                {/* Template Creation and Editing Section */}
                                < div className='p-6 mb-6 bg-white rounded-lg shadow-md' >
                                    <h2 className='mb-4 text-2xl font-semibold text-center'>
                                        {isEditing ? 'Edit Attendance Template' : 'Create New Attendance Template'}
                                    </h2>
                                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-600'>Template Name</label>
                                            <input
                                                type='text'
                                                value={templateName}
                                                onChange={(e) => setTemplateName(e.target.value)}
                                                className='w-full p-3 mt-1 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                disabled={isEditing}  // Disable in editing mode
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-600'>Expiration Date</label>
                                            <input
                                                type='date'
                                                value={expirationDate}
                                                onChange={(e) => setExpirationDate(e.target.value)}
                                                className='w-full p-3 mt-1 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                min={todayDate}  // Ensure only future dates can be selected
                                            />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 mt-4 md:grid-cols-3'>
                                        {[
                                            { label: 'Include Attendee Name', state: includeAttendeeName, setState: setIncludeAttendeeName },
                                            { label: 'Include Gender', state: includeGender, setState: setIncludeGender },
                                            { label: 'Include College', state: includeCollege, setState: setIncludeCollege },
                                            { label: 'Include Department', state: includeDepartment, setState: setIncludeDepartment },
                                            { label: 'Include Year/Section', state: includeYearSection, setState: setIncludeYearSection },
                                            { label: 'Include Agency/Office', state: includeAgencyOffice, setState: setIncludeAgencyOffice },
                                            { label: 'Include Contact Number', state: includeContactNumber, setState: setIncludeContactNumber },
                                        ].map((item, idx) => (
                                            <div key={idx} className='flex items-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={item.state}
                                                    onChange={() => item.setState(!item.state)}
                                                    className='mr-2'
                                                    disabled={isEditing}  // Disable in editing mode
                                                />
                                                <label className='text-sm text-gray-700'>{item.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='mt-6 text-center'>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleSaveTemplate}
                                                    className='px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
                                                >
                                                    Save Template
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className='px-6 py-2 ml-4 text-white bg-gray-500 rounded-lg hover:bg-gray-600'
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={handleCreateTemplate}
                                                className='px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
                                            >
                                                Create Template
                                            </button>
                                        )}
                                    </div>
                                </div >
                            </div >
                        )}
                </div >
            </div >
        </div >
    );
};


export default ProjLeadDailyAttRec;
