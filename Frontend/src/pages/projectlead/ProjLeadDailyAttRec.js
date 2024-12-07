import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ProjLeadDailyAttRec = () => {
    const navigate = useNavigate();
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

    const handleViewClick = (path) => {
        navigate(path);
    }

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
        const token = localStorage.getItem("authToken");

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

    const submittedFiles = [
        { fileName: "Day 1 Attendance.pdf", submittedBy: "Proponent A", date: "2024-10-10" },
        { fileName: "Day 2 Attendance.pdf", submittedBy: "Proponent B", date: "2024-10-11" },
        { fileName: "Day 3 Attendance.pdf", submittedBy: "Proponent C", date: "2024-10-12" }
    ];

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Daily Attendance Record/List of Participants</h1>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tesda Vocational</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tabasan, Wynoah Louis</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">College/Campus</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">CEA</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">May 2024</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Placeholder Inc.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Submitted Files</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">File Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Submitted By</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submittedFiles.map((file, index) => (
                                        <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{file.fileName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{file.submittedBy}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{file.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadDailyAttRec;
