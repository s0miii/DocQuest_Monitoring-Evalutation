import React, {useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft, FaFilePdf, FaEdit } from "react-icons/fa";
import GeneratePDFDocument from "../../components/Monitoring PDFs/GeneratePDFDocument";

const ProjLeadAccReport = () => {
    const navigate = useNavigate();
    const { projectID, id} = useParams();
    const [loading, setLoading] = useState(true);
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [prexcAchievement, setPrexcAchievement] = useState(null);
    const [accReport, setAccReport] = useState({
        project: '',
        banner_program_title: '',
        flagship_program: '',
        training_modality: '',
        actualStartDateImplementation: '',
        actualEndDateImplementation: '',
        activities_topics: '',
        issues_challenges: '',
        participant_engagement_quality: '',
        discussion_comments: '',
        ways_forward_plans: '', 
        total_number_of_days: '',
        submitted_by: '',
    });
    const [submittedFiles, setSubmittedFiles] = useState([]);
    const [projectDetails, setProjectDetails] = useState({});
    const [error, setError] = useState('');

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
        const fetchSubmittedReports = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }
    
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/monitoring/accomplishment_reports/${id}`, // Adjust the URL as needed
                    {
                        headers: { Authorization: `Token ${token}` }
                    }
                );
    
                if (response.ok) {
                    const reportsData = await response.json();
                    // Check if the response is an array before setting the state
                    if (Array.isArray(reportsData)) {
                        setSubmittedFiles(reportsData); // Ensure it's an array
                    } else {
                        console.error('Expected an array of reports, but received:', reportsData);
                        setSubmittedFiles([]); // Set as empty array if not an array
                    }
                } else {
                    console.error("Failed to fetch submitted reports.");
                }
            } catch (error) {
                console.error("Error fetching submitted reports:", error);
            }
        };
    
        if (id) fetchSubmittedReports();
    }, [id, navigate]);    

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
                    `http://127.0.0.1:8000/monitoring/accomplishment_reports/${id}/`,
                    {
                        headers: { Authorization: `Token ${token}` }
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setProjectDetails(data);
                    // Pre-populate form if editing an existing report
                    setAccReport({
                        ...accReport,
                        project: data.project,
                        banner_program_title: data.banner_program_title,
                        flagship_program: data.flagship_program,
                        training_modality: data.training_modality,
                        actualStartDateImplementation: data.actualStartDateImplementation,
                        actualEndDateImplementation: data.actualEndDateImplementation,
                        activities_topics: data.project_narrative.activities_topics,
                        issues_challenges: data.project_narrative.issues_challenges,
                        participant_engagement_quality: data.project_narrative.participant_engagement_quality,
                        discussion_comments: data.project_narrative.discussion_comments,
                        ways_forward_plans: data.project_narrative.ways_forward_plans,
                        total_number_of_days: data.total_number_of_days,
                        submitted_by: data.submitted_by,
                        approved_photos: data.approved_photos,
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
    }, [id, navigate]);
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }
        
        const method = id ? 'PUT' : 'POST'; // Use PUT if id exists, POST otherwise
        const url = id 
            ? `http://127.0.0.1:8000/monitoring/accomplishment_reports/${id}/` 
            : `http://127.0.0.1:8000/monitoring/accomplishment_reports/`;
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(accReport),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Failed to submit report.");
            
            // Update state carefully, check if the response data includes the necessary properties
            const newFile = { ...data, dateSubmitted: new Date(data.dateSubmitted).toLocaleDateString() };
            setSubmittedFiles(prevFiles => [...prevFiles, newFile]);
            alert("Report submitted successfully!");
        } catch (error) {
            console.error("Error submitting report:", error);
            setError(error.message);
            alert(error.message);
        }
    };

    const handleEdit = (file) => {
        setAccReport(file); // Make sure 'file' contains all fields expected in the form
        console.log("Editing report:", file);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAccReport({ ...accReport, [name]: value });
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
                                value={accReport.banner_program_title}
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
                                value={accReport.flagship_program}
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
                                <select
                                    name="training_modality"
                                    value={accReport.training_modality}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Face to Face">Face to Face</option>
                                    <option value="Virtual">Virtual</option>
                                    <option value="Blended">Blended</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual Start Date of Implementation</label>
                                <input
                                    type="date"
                                    name="actualStartDateImplementation"
                                    value={accReport.actualStartDateImplementation}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual End Date of Implementation</label>
                                <input
                                    type="date"
                                    name="actualEndDateImplementation"
                                    value={accReport.actualEndDateImplementation}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Number of Days</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{accReport.total_number_of_days}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{accReport.submitted_by}</p>
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
                                    value={accReport.activities_topics}
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
                                    value={accReport.issues_challenges}
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
                                    value={accReport.participant_engagement_quality}
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
                                    value={accReport.discussion_comments}
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
                                    value={accReport.ways_forward_plans}
                                    onChange={handleChange}
                                    className="bg-gray-100 rounded-lg p-3 w-full mt-4"
                                    rows="4"
                                    placeholder="Enter ways forward and plans..."
                                />
                            </div>
                        </div>
                        
                        {/* Photo Documentation */}
                        <h2 className="text-xl font-semibold text-center mb-6 mt-8">Photo Documentation</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {accReport.approved_photos && accReport.approved_photos.length > 0 ? (
                                accReport.approved_photos.map(photo => (
                                    <div key={photo.id} className="rounded-lg">
                                        <p className="text-sm text-gray-700">{photo.description || 'No description provided.'}</p>
                                        <p className="text-xs text-gray-500">Uploaded on: {new Date(photo.date_uploaded).toLocaleDateString()}</p>
                                        <img src={`http://127.0.0.1:8000${photo.photo}`} alt="Documented Activity" className="w-full h-auto rounded-lg mt-2" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No approved photos available.</p>
                            )}
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

                    {/* Display submitted report */}
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
                                                    onClick={() => GeneratePDFDocument(accReport, projectDetails)}
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