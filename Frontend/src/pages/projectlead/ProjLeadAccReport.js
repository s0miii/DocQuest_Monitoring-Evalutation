import React, {useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft, FaFilePdf, FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { PDFViewer } from '@react-pdf/renderer';
import GeneratePDFDocument from "../../components/Monitoring PDFs/GeneratePDFDocument";
import axios from 'axios';

const ProjLeadAccReport = () => {
    const navigate = useNavigate();
    const { projectID } = useParams();
    const [loading, setLoading] = useState(true);
    const [submittedFiles, setSubmittedFiles] = useState([]);
    const [projectDetails, setProjectDetails] = useState(null);
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [prexcAchievement, setPrexcAchievement] = useState(null);
    const [formData, setFormData] = useState({
        total_number_of_days: '',
        submitted_by: '',
        banner_program_title: '',
        flagship_program: '',
        training_modality: '',
        actualStartDateImplementation: '',
        actualEndDateImplementation: '',
        activities_topics: '',
        issues_challenges: '',
        participant_engagement_quality: '',
        discussion_comments: '',
        ways_forward_plans: ''
    });

    // Fetch project details 
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

    useEffect(() => {
        const fetchDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/monitoring/accomplishment_reports/${projectID}/`,
                    {
                        headers: { Authorization: `Token ${token}` }
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setProjectDetails(data);
                    // Pre-populate form if editing an existing report
                    setFormData({
                        total_number_of_days: data.total_number_of_days,
                        submitted_by: data.submitted_by,
                        banner_program_title: data.banner_program_title,
                        flagship_program: data.flagship_program,
                        training_modality: data.training_modality,
                        actualStartDateImplementation: data.actualStartDateImplementation,
                        actualEndDateImplementation: data.actualEndDateImplementation,
                        activities_topics: data.project_narrative.activities_topics,
                        issues_challenges: data.project_narrative.issues_challenges,
                        participant_engagement_quality: data.project_narrative.participant_engagement_quality,
                        discussion_comments: data.project_narrative.discussion_comments,
                        ways_forward_plans: data.project_narrative.ways_forward_plans
                    });
                } else {
                    console.error("Failed to fetch project details.");
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [projectID, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const newReport = {
            ...formData,
            dateSubmitted: new Date().toLocaleDateString(), // Current date
            id: 1 // Use a constant ID because only one accomplishment report exists
        };
    
        // Update the state with the new or edited accomplishment report
        setSubmittedFiles([newReport]); // Replace existing report
    
        // Save to local storage for persistence
        localStorage.setItem("submittedReport", JSON.stringify(newReport));
    
        console.log("Form submitted successfully:", newReport);
    
        // Optional: Reset the form fields after submission (if not in edit mode)
        setFormData({
            banner_program_title: "",
            flagship_program: "",
            training_modality: "",
            actualStartDateImplementation: "",
            actualEndDateImplementation: "",
            activities_topics: "",
            issues_challenges: "",
            participant_engagement_quality: "",
            discussion_comments: "",
            ways_forward_plans: ""
        });
    };

    useEffect(() => {
        const savedReport = localStorage.getItem("submittedReport");
        if (savedReport) {
            setSubmittedFiles([JSON.parse(savedReport)]);
        }
    }, []);

    const handleEdit = (report) => {
        setFormData(report); // Load the selected report into the form for editing
        console.log("Editing report:", report);
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
                        <button className="mr-2" onClick={() => navigate(-1)}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Accomplishment Report</h1>
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
                                placeholder="Enter Banner Program Title..."
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
                                placeholder="Enter Flagship Program..."
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
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.researchTitle}</p>
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
                                    placeholder="Enter activities and topics covered..."
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
                                    placeholder="Enter issues and challenges encountered..."
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
                                    placeholder="Enter quality of participants' engagement..."
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
                                    placeholder="Enter discussion comments..."
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
                                    placeholder="Enter ways forward and plans..."
                                />
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} div className="mt-4 flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-600 transition"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Submitted File Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Submitted File</h2>
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
                                    {submittedFiles.map((file) => (
                                        <tr key={file.id} className="border-b">
                                            <td className="px-6 py-4 text-center text-sm text-gray-900">Accomplishment Report {file.id}</td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">{file.dateSubmitted}</td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">Submitted</td>
                                            <td className="px-6 py-4 text-center text-l">
                                                <button 
                                                    className='mr-2 text-blue-500'
                                                    onClick={() => handleEdit(file)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </td>
                                            <td className="flex justify-center px-6 py-4 text-center text-sm">
                                                <button
                                                    onClick={() => GeneratePDFDocument(formData, projectDetails)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-s flex items-center"
                                                >
                                                    <FaFilePdf className="mr-2" />View PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {submittedFiles.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center text-gray-500 py-4">
                                                No files submitted yet.
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
