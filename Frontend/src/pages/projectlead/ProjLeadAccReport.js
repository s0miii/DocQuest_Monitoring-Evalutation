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
        banner_program_title: "",
        flagship_program: "",
        training_modality: "",
        actualStartDateImplementation: "",
        actualEndDateImplementation: "",
        activities_topics: "",
        issues_challenges: "",
        participant_engagement_quality: "",
        discussion_comments: "",
        ways_forward_plans: "",
        // PREXC Achievement fields
        traineesWeighted: "",
        actualTrainees: "",
        actualDays: "",
        personsTrained: "",
        satisfactoryEvaluation: "",
    });
    const navigate = useNavigate();
    const { projectID, accomplishmentReportID } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [projectDetails, setProjectDetails] = useState(null);
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [prexcAchievement, setPrexcAchievement] = useState(null);

    const handleViewClick = (path) => {
        navigate(path.replace(":projectID", projectID));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // Fetch data for the accomplishment report and PREXC achievement
    useEffect(() => {
        const fetchPrexcAchievement = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("User not logged in. Please log in again.");
                    navigate("/login");
                    return;
                }

                // Fetch PREXC achievement data
                const response = await fetch(
                    `http://127.0.0.1:8000/monitoring/accomplishment_reports/prexc_achievement/?accomplishment_report_id=${accomplishmentReportID}`,
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
                    setPrexcAchievement(data);
                    setFormData((prevData) => ({
                        ...prevData,
                        traineesWeighted: data.traineesWeighted,
                        actualTrainees: data.actualTrainees,
                        actualDays: data.actualDays,
                        personsTrained: data.personsTrained,
                        satisfactoryEvaluation: data.satisfactoryEvaluation,
                    }));
                } else {
                    setError("Failed to fetch PREXC achievement data.");
                }
            } catch (error) {
                setError("Error fetching data: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrexcAchievement();
    }, [accomplishmentReportID, navigate]);

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            const formDataToSubmit = {
                ...formData,
                project: projectID, // Include project ID if required
            };

            const response = await axios.post(
                'http://127.0.0.1:8000/monitoring/accomplishment_reports/',
                formDataToSubmit,
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

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
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/proj/req/:projectID')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Accomplishment Report</h1>
                        
                        <button
                            onClick={() => GeneratePDFDocument(formData)}
                            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm mt-3 mb-3 flex items-center"
                        >
                            <FaFilePdf className="mr-2" />View PDF
                        </button>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Extension Accomplishment Report</h2>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Banner Program Title</label>
                            <input
                                type="text"
                                name="banner_program_title"
                                value={formData.banner_program_title}
                                onChange={handleChange}
                                className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                placeholder="Enter input here..."
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Flagship Program</label>
                            <input
                                type="text"
                                name="flagship_program"
                                value={formData.flagship_program}
                                onChange={handleChange}
                                className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                placeholder="Enter input here..."
                            />
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Project Title</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.projectTitle}</p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type of Project</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.projectType}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Category</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.programCategories}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Title of Research</label>
                            <input
                                type="text"
                                name="researchTitle"
                                value={formData.researchTitle}
                                onChange={handleChange}
                                className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                placeholder="Enter input here..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Proponents</label>
                                <textarea
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full resize-none overflow-hidden"
                                    readOnly
                                    value={projectDetails.proponents}
                                    style={{ height: 'auto', minHeight: '250px' }}
                                />
                            </div>
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Program</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.programs}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Accreditation Level</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.accreditationLevel}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">College</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.college}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Target Groups/Beneficiaries</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.beneficiaries}</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Project Location</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.projectLocation}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.partnerAgency}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Training Modality</label>
                                <input
                                    type="text"
                                    name="training_modality"
                                    value={formData.training_modality}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Enter input here..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual Start Date of Implementation</label>
                                <input
                                    type="date"
                                    name="actualStartDateImplementation"
                                    value={formData.actualStartDateImplementation}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual End Date of Implementation</label>
                                <input
                                    type="date"
                                    name="actualEndDateImplementation"
                                    value={formData.actualEndDateImplementation}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Number of Days</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">ee{formData.total_number_of_days}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.projectLeader}</p>
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
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{prexcAchievement?.traineesWeighted || 'N/A'}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{prexcAchievement?.actualTrainees || 'N/A'}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{prexcAchievement?.actualDays || 'N/A'}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{prexcAchievement?.personsTrained || 'N/A'}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-left">Number of Trainees who evaluated the training to be at least satisfactory</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{prexcAchievement?.satisfactoryEvaluation || 'N/A'}</p>
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
                                <textarea
                                    name="activities_topics"
                                    value={formData.activities_topics}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 w-full mt-4"
                                    rows="4"
                                    placeholder="Enter input here..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Issues and Challenges Encountered</label>
                                <textarea
                                    name="issues_challenges"
                                    value={formData.issues_challenges}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 w-full mt-4"
                                    rows="4"
                                    placeholder="Enter input here..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quality of the Participants' Engagement</label>
                                <textarea
                                    name="participant_engagement_quality"
                                    value={formData.participant_engagement_quality}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 w-full mt-4"
                                    rows="4"
                                    placeholder="Enter input here..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discussion of Questions Raised and Comments from the Participants</label>
                                <textarea
                                    name="discussion_comments"
                                    value={formData.discussion_comments}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 w-full mt-4"
                                    rows="4"
                                    placeholder="Enter input here..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ways Forward and Plans</label>
                                <textarea
                                    name="ways_forward_plans"
                                    value={formData.ways_forward_plans}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 w-full mt-4"
                                    rows="4"
                                    placeholder="Enter input here..."
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                className="bg-blue-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-600 transition"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
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
                    
                </div>
            </div>
        </div>
    );
};

export default ProjLeadAccReport;
