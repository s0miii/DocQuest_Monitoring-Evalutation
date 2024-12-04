import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProponentsSideBar from "../../components/ProponentsSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProponentsProjReq = ({ totalRequirements, completedRequirements }) => {
    const navigate = useNavigate();
    const { projectID } = useParams();
    const [projectDetails, setProjectDetails] = useState(null); // Store project details
    const [assignedRequirements, setAssignedRequirements] = useState([]); // Store assigned requirements
    const [documentCounts, setDocumentCounts] = useState({});
    const [projectProgress, setProjectProgress] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    const handleViewClick = (path) => {
        navigate(path);
    }

    // handle clicks on assigned requirements
    const getRequirementPath = (requirement) => {
        switch (requirement) {
            case "Daily Attendance":
                return `/proponents/project/${projectID}/daily-attendance`;
            case "Summary of Evaluation":
                return `/proponents/project/${projectID}/evaluation-summary`;
            case "Lecture Notes":
                return `/proponents/project/${projectID}/modules-notes`;
            case "Other Files":
                return `/proponents/project/${projectID}/other`;
            case "Photo Documentation":
                return `/proponents/project/${projectID}/photo-docs`;
            default:
                return "#";
        }
    };

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");

                // Fetch project details
                const projectResponse = await fetch(
                    `http://127.0.0.1:8000/monitoring/projects/${projectID}/details/`,
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
                setAssignedRequirements(projectData.assignedRequirements);

                // Fetch project progress
                const progressResponse = await fetch(
                    `http://127.0.0.1:8000/monitoring/project/${projectID}/progress/`,
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
            const token = localStorage.getItem("authToken");

            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            try {
                const countsResponse = await fetch(
                    `http://127.0.0.1:8000/monitoring/project/${projectID}/document_counts/`,
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
    }, [projectID]);

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
                <ProponentsSideBar />
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
                    <div className="assigned-requirements">
                        <h2 className="text-xl font-semibold mb-5">Assigned Documentary Requirements</h2>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <div className="space-y-4">
                                {assignedRequirements && assignedRequirements.length > 0 ? (
                                    assignedRequirements.map((requirement, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div>
                                                <p>{requirement}</p>
                                                <p className="text-gray-500 text-sm">
                                                    {documentCounts[requirement] || 0} document(s) attached
                                                </p>
                                            </div>
                                            <button
                                                className="text-black underline ml-auto pr-3"
                                                onClick={() =>
                                                    handleViewClick(getRequirementPath(requirement))
                                                }
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No assigned requirements available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProponentsProjReq;
