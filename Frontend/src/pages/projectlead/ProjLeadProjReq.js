import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate, useParams } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadProjReq = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { projectID } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [documentCounts, setDocumentCounts] = useState({});
    const [projectProgress, setProjectProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    // deployed
    const API_URL = process.env.REACT_APP_API_URL;

    // local
    // const API_URL = 'http://127.0.0.1:8000/';
    // ${API_URL}

    const handleViewClick = (path) => {
        navigate(path);
    }

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {


                // Fetch project details
                const projectResponse = await fetch(
                    `${API_URL}/monitoring/projects/${projectID}/details/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!projectResponse.ok) {
                    throw new Error("Failed to fetch project details.");
                }

                const projectData = await projectResponse.json();
                setProjectDetails(projectData.projectDetails);
                // setAssignedRequirements(projectData.assignedRequirements);

                // Fetch project progress
                const progressResponse = await fetch(
                    `${API_URL}/monitoring/project/${projectID}/progress/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!progressResponse.ok) {
                    throw new Error("Failed to fetch project progress.");
                }

                const progressData = await progressResponse.json();
                setProjectProgress(progressData.progress || 0);
            } catch (error) {
                console.error("Error fetching project details:", error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchDocumentCounts = async () => {

            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            try {
                const countsResponse = await fetch(
                    `${API_URL}/monitoring/project/${projectID}/document_counts/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!countsResponse.ok) {
                    throw new Error("Failed to fetch document counts.");
                }

                const countsData = await countsResponse.json();
                setDocumentCounts(countsData.document_counts);
            } catch (error) {
                console.error("Error fetching document counts:", error);
            }
        };


        fetchProjectDetails();
        fetchDocumentCounts();
    }, [projectID, navigate, token]);

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
                        <button className="mr-2" onClick={() => handleViewClick('/projects-dashboard')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Project {projectDetails.projectTitle} Details</h1>
                    </div>

                    {/* Project Details and Progress Status Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Project Title and Leader */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.projectTitle}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.projectLeader}</p>
                            </div>
                        </div>

                        {/* College/Campus, Target Date, Partner Agency */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">College/Campus</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.college}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.targetDate}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{projectDetails.partnerAgency}</p>
                            </div>
                        </div>
                        {/* Project Progress Bar */}
                        <h2 className="text-xl font-semibold text-center mt-8 mb-4">Project Progress Bar</h2>
                        <div className="mt-4 flex flex-col items-center">
                            <div className="w-2/3 bg-gray-200 rounded-full h-2.5 mb-4">
                                <div
                                    className="bg-yellow-500 h-2.5 rounded-full"
                                    style={{ width: `${Math.min(projectProgress, 100)}%`, }}
                                ></div>
                            </div>
                            <div className="w-2/3 flex justify-center text-sm text-gray-600">
                                <span>{Math.min(projectProgress, 100).toFixed(2)}% Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Requirements Section */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-semibold">Documentary Requirements</h2>
                        <button
                            className="text-blue-500 text-sm"
                            onClick={() => handleViewClick(`/projlead/assign-checklist/${projectID}`)}
                        >
                            Assign Proponents
                        </button>
                    </div>
                    <div className="assigned-requirements">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <div className="space-y-4 text-lg">
                                {/* Manually Add Accomplishment Report */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p>Accomplishment Report</p>
                                        <p className="text-gray-500 text-base">
                                            {documentCounts["Accomplishment Report"] || 0} document(s) attached
                                        </p>
                                    </div>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => handleViewClick(`/projlead/project/${projectID}/accomplishment-report`)}
                                    >
                                        View
                                    </button>
                                </div>

                                {/* Render Remaining Requirements Dynamically */}
                                {Object.entries(documentCounts).map(([itemName, count]) => {
                                    if (itemName === "Accomplishment Report") return null; // Skip if already added
                                    return (
                                        <div key={itemName} className="flex justify-between items-center">
                                            <div>
                                                <p>{itemName}</p>
                                                <p className="text-gray-500 text-base">
                                                    {count} document(s) attached
                                                </p>
                                            </div>
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() => handleViewClick(`/projlead/project/${projectID}/${itemName.replace(/\s+/g, '-').toLowerCase()}`)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadProjReq;
