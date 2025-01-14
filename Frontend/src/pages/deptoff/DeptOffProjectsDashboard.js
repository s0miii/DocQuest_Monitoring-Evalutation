import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import DeptOffSideBar from "../../components/DeptOffSideBar";
import axios from "axios";

const DeptOffProjectsDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [projects, setProjects] = useState([]);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            localStorage.clear();
            navigate("/login", { replace: true });
            return;
        }

        const roles = JSON.parse(localStorage.getItem("roles") || "[]");

        if (!roles.includes("estf")) {
            localStorage.clear();
            navigate("/login", { replace: true });
            return;
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios({
                    method: "get",
                    url: "http://127.0.0.1:8000/monitoring/staff-projects/",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!Array.isArray(response.data)) {
                    console.error("Invalid data structure received:", response.data);
                    setError("Invalid data format received from server");
                    setProjects([]);
                    return;
                }

                const formattedProjects = response.data.map((proj) => ({
                    projectID: proj.projectID || "N/A",
                    projectTitle: proj.projectTitle || "Untitled Project",
                    projectLeader: proj.projectLeader || "N/A",
                    targetImplementation: proj.targetImplementation || "N/A",
                }));

                setProjects(formattedProjects);
                setError(null);

                // Fetch progress for each project
                fetchProjectProgress(formattedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError(error.message || "Failed to fetch projects");
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchProjectProgress = async (projects) => {
            try {
                const progressData = {};
                for (const project of projects) {
                    const response = await axios.get(
                        `http://127.0.0.1:8000/monitoring/project/${project.projectID}/progress/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`,
                            },
                        }
                    );
                    progressData[project.projectID] = response.data.progress || 0;
                }
                setProgress(progressData); // Update progress state
            } catch (error) {
                console.error("Error fetching project progress:", error);
            }
        };

        fetchProjects();
    }, [token]);

    // Filter projects
    const filteredProjects = projects.filter((project) =>
        project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedProjects = [...projects].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setProjects(sortedProjects);
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
            <div className="w-1/5 fixed h-full">
                <DeptOffSideBar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Projects Overview</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
                        {/* Completed */}
                        <div className="bg-green-500 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Completed</h2>
                            <h2 className="text-4xl font-bold">
                                {projects.filter((project) => progress[project.projectID] === 100).length}
                            </h2>
                        </div>
                        {/* Ongoing */}
                        <div className="bg-yellow-400 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Ongoing</h2>
                            <h2 className="text-4xl font-bold">
                                {projects.filter((project) => progress[project.projectID] < 100).length}
                            </h2>
                        </div>
                    </div>

                    {/* Projects Table */}
                    <h1 className="text-2xl font-semibold mb-5">Projects</h1>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg mb-6 max-w-sm mx-auto">
                            <FaSearch className="text-gray-500 mx-3" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="flex-1 bg-gray-100 outline-none text-gray-600 placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaFilter className="text-gray-500 mx-3" />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer"
                                            onClick={() => handleSort("projectTitle")}
                                        >
                                            Title {sortConfig.key === "projectTitle" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer"
                                            onClick={() => handleSort("projectLeader")}
                                        >
                                            Project Leader {sortConfig.key === "projectLeader" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer"
                                            onClick={() => handleSort("targetImplementation")}
                                        >
                                            Target Date {sortConfig.key === "targetImplementation" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">           </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProjects.map((project) => (
                                        <tr key={project.projectID}>
                                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">{project.projectTitle}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center border-b border-gray-300">{project.projectLeader}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center border-b border-gray-300">{project.targetImplementation}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center border-b border-gray-300">
                                                {progress[project.projectID]
                                                    ? Number.isInteger(progress[project.projectID])
                                                        ? `${progress[project.projectID]}%`
                                                        : `${progress[project.projectID].toFixed(2)}%`
                                                    : "0%"}
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                                                <button
                                                    className="text-blue-500 hover:underline"
                                                    onClick={() => {
                                                        const roles = JSON.parse(localStorage.getItem("roles")) || []; // Fetch roles from local storage
                                                        if (roles.includes("dpth")) {
                                                            navigate(`/estaff/projreq/${project.projectID}`);
                                                        } else {
                                                            alert("Unknown role or unauthorized access.");
                                                        }
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-between items-center">
                            <div>Showing page {currentPage} out of {totalPages}</div>
                            <div className="flex space-x-2">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeptOffProjectsDashboard;

