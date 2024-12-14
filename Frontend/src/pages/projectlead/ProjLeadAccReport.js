import React, {useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { PDFViewer } from '@react-pdf/renderer';
import GeneratePDFDocument from "../../components/Monitoring PDFs/GeneratePDFDocument";

const ProjLeadAccReport = () => {
    const [formData, setFormData] = useState({
        banner_program_title: "Banner Program",
        flagship_program: "Flagship Program",
        project_title: "Project Title",
        project_type: "Project Type",
        research_title: "Research Title",
        project_category: "Project Category",
        proponents: "Proponents",
        program: "Program",
        accreditation_level: "Accorde Level",
        college: "college",
        target_groups_beneficiaries: "target Groups",
        project_location: "project Location",
        partner_agency: "partner Agency",
        training_modality: "target Partner",
        actual_implementation_date: "actrual",
        total_number_of_days: "total",
        submitted_by: "buy"
    });
    const navigate = useNavigate();
    const { projectID } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [photos, setPhotos] = useState([{ file: null, description: '' }]);
    const [modalPhoto, setModalPhoto] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [projectDetails, setProjectDetails] = useState(null);
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

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
                    setPdfUrl(data.projectDetails.pdfUrl);
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
                `http://127.0.0.1:8000/monitoring/project/${projectID}/checklist/Other%20Files/submissions/`,
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
                `http://127.0.0.1:8000/monitoring/submission/update/other_files/${submissionId}/`,
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
                `http://127.0.0.1:8000/monitoring/submission/update/other_files/${submissionId}/`,
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

    
    // Handle photo uploads
    const handleFileChange = (index, files) => {
        const newPhotos = [...photos];
        newPhotos[index].files = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setPhotos(newPhotos);
    };

    const handlePhotoClick = (url) => {
        setModalPhoto(url);
    };

    const handleDescriptionChange = (index, description) => {
        const newPhotos = [...photos];
        newPhotos[index].description = description;
        setPhotos(newPhotos);
    };

    const addPhotoField = () => {
        setPhotos([...photos, { file: null, description: '' }]);
    };


    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Prepare form data
            const formDataToSubmit = {
                ...formData,
                photos: photos.map((photo) => ({
                    files: photo.files,
                    description: photo.description,
                })),
            };

            // Make API request to backend (update URL to match your backend endpoint)
            const response = await axios.post('/api/accomplishment-reports/', formDataToSubmit, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization token if needed
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            // Handle successful submission
            if (response.status === 201) {
                navigate('/projlead/proj/req/accomplishment-report');
            }
        } catch (err) {
            setError("An error occurred while submitting the report. Please try again.");
            console.error("Submission error: ", err);
        } finally {
            setLoading(false);
        }
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
            {/* Sidebar with fixed width */}
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            {/* Main content area */}
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/project/${projectID}')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Accomplishment Report</h1>
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
                        <div
                            className="overflow-y-auto"
                            style={{
                                maxHeight: "300px", // Limit the table height
                            }}
                        >
                            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                                <thead className="sticky top-0 bg-gray-100 z-10">
                                    <tr className="border-b">
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                            File
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                            Date Submitted
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                            Accomplishment Report
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length > 0 ? (
                                        submissions.map((submission) => (
                                            <tr key={submission.submission_id} className="border-b hover:bg-gray-100">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <a
                                                        href={`http://127.0.0.1:8000/media/${submission.directory}/${submission.file_name}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate block text-center"
                                                    >
                                                        {submission.file_name || "No File"}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                    {new Date(submission.date_uploaded).toLocaleDateString()}
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
                    </div>

                    {/* Create Accomplishment Report Section */}
                    <div className="container mx-auto px-4">
                        <button
                            onClick={() => GeneratePDFDocument(formData)}
                            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm mt-3 flex items-center"
                        >
                            <FaFilePdf className="mr-2" />View PDF
                        </button>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Extension Accomplishment Report</h2>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Banner Program Title</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.banner_program_title}</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Flagship Program</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.flagship_program}</p>
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Project Title</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type of Project</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_type}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Category</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_category}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Title of Research</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.research_title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Proponents</label>
                                <textarea
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full resize-none overflow-hidden"
                                    readOnly
                                    value={formData.proponents}
                                    style={{ height: 'auto', minHeight: '250px' }}
                                />
                            </div>
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Program</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.program}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Accreditation Level</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.accreditation_level}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">College</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.college}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Groups/Beneficiaries</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.target_groups_beneficiaries}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Location</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_location}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.partner_agency}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Training Modality</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.training_modality}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual Date of Implementation</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.actual_implementation_date}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Number of Days</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.total_number_of_days}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.submitted_by}</p>
                        </div>

                        {/* PREXC Achievement */}
                        <div className="overflow-x-auto mt-8">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-center" colSpan="4">PREXC Achievement</th>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">Persons Trained Weighted by the Number of Days Training</td>
                                        <td className="border border-gray-300 px-4 py-2 text-left">Actual Number of Trainees based on Attendance Sheets</td>
                                        <td className="border border-gray-300 px-4 py-2 text-left">Actual Number of Days Training</td>
                                        <td className="border border-gray-300 px-4 py-2 text-left">Persons Trained</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.traineesWeighted}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.actualTrainees}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.actualDays}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.personsTrained}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                    <td className="border border-gray-300 px-4 py-2 text-left"> Number of Trainees who evaluated the training to be at least satisfactory </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.satisfactoryEvaluation}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="w-full bg-gray-100 rounded-lg p-2 text-center">Rating 100%</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center"></p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Project Narrative */}
                        <h2 className="text-xl font-semibold text-center mb-6 mt-8">Project Narrative</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description of Major Activities and Topics Covered</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Issues and Challenges Encountered</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quality of the Participants' Engagement</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discussion of Questions Raised and Comments from the Participants</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ways Forward and Plans</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                        </div>

                        {/* Photo Documentation */}
                        <h2 className="text-xl font-semibold text-center mb-4 mt-8">Photo Documentation</h2>
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 grid grid-cols-1 gap-2 mb-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Attached Photo {index + 1}
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        className="w-full cursor-pointer file:bg-gray-50 file:border-0 file:p-2 rounded-lg mt-1"
                                        onChange={(e) => handleFileChange(index, Array.from(e.target.files))}
                                    />
                                </div>
                                {photo.files && photo.files.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Attached Files
                                        </label>
                                        <ul className="list-disc list-inside">
                                            {photo.files.map((file, fileIndex) => (
                                                <li
                                                    key={fileIndex}
                                                    className="text-blue-500 cursor-pointer hover:underline"
                                                    onClick={() => handlePhotoClick(file.url)}
                                                >
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        className="bg-gray-100 rounded-lg p-3 mt-1 w-full resize-none"
                                        placeholder="Enter description"
                                        value={photo.description}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        rows={1}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-start mb-4">
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={addPhotoField}
                            >
                                Attach Another Photo
                            </span>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="bg-blue-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-600 transition"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>

                        {/* Modal for Photo View */}
                        {modalPhoto && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-4 relative">
                                    <img
                                        src={modalPhoto}
                                        alt="Preview"
                                        className="max-w-full max-h-[80vh] rounded-lg"
                                    />
                                    <button
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                                        onClick={() => setModalPhoto(null)}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadAccReport;
