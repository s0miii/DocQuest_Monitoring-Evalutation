import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProponentsSideBar from "../../components/ProponentsSideBar";
import axios from "axios";

const ProjectsDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            localStorage.clear();
            navigate('/login', { replace: true });
            return;
        }

        const roles = JSON.parse(localStorage.getItem('roles') || '[]');

        if (!roles.includes("pjld") && !roles.includes("ppnt")) {
            localStorage.clear();
            navigate('/login', { replace: true });
            return;
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: 'http://127.0.0.1:8000/monitoring/user-projects/',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
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
                    background: proj.background || "N/A",
                    targetImplementation: proj.targetImplementation || "N/A",
                    role: proj.role || "N/A",
                    status: proj.status || "N/A",
                }));

                const sortedProjects = formattedProjects.sort((a, b) =>
                    new Date(b.targetImplementation.split(" - ")[1]) -
                    new Date(a.targetImplementation.split(" - ")[1])
                );

                setProjects(sortedProjects);
                setError(null);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError(error.message || "Failed to fetch projects");
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [token]);

    const handleViewClick = (project) => {
        if (project.role === "Project Leader") {
            navigate(`/projlead/proj/req/${project.projectID}`);
        } else if (project.role === "Proponent") {
            navigate(`/proponents/proj/req/${project.projectID}`);
        } else {
            alert("Invalid role detected.");
        }
    };

    // Handle sorting
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

    // Filter projects by search term
    const filteredProjects = projects.filter((project) =>
        project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logic for completed and ongoing projects
    const completedProjects = projects.filter(project => project.status === "completed");
    const ongoingProjects = projects.filter(project => project.status !== "completed");


    // Calculate the displayed projects based on pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
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
                <ProponentsSideBar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Projects Overview</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
                        {/* Completed */}
                        <div className="bg-green-500 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Completed</h2>
                            <h2 className="text-4xl font-bold">{completedProjects.length}</h2>
                            <button className="mt-2 underline">View</button>
                        </div>
                        {/* Ongoing */}
                        <div className="bg-yellow-400 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Ongoing</h2>
                            <h2 className="text-4xl font-bold">{ongoingProjects.length}</h2>
                            <button className="mt-2 underline">View</button>
                        </div>
                    </div>

                    {/* Projects Table */}
                    <h1 className="text-2xl font-semibold mb-5">Projects</h1>
                    <div className="bg-white shadow-lg rounded-lg p-6">

                        {/* Search Bar */}
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
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Project Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Target Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProjects.map((project) => (
                                        <tr key={project.projectID}>
                                            <td className="px-6 py-4 whitespace-nowrap">{project.projectTitle}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{project.role || "No Role"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{project.targetImplementation}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    className="text-blue-500 hover:underline"
                                                    onClick={() => handleViewClick(project)}
                                                >
                                                    View
                                                </button>
                                            </td>
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

export default ProjectsDashboard;
