import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProponentsSideBar from "../../components/ProponentsSideBar";

const ProjectsDashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;

    const handleViewClick = (project) => {
        if (project.role === "proponent") {
            navigate(`/proponents/proj/req/${project.projectID}`);
        } else if (project.role === "leader") {
            navigate(`/projlead/proj/req/${project.projectID}`);
        } else {
            alert("Invalid role detected.");
        }
    };

    // Fetch projects dynamically
    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/monitoring/user-projects/", {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProjects(data); // Store all projects fetched from the backend
                } else {
                    console.error("Failed to fetch projects:", await response.json());
                    setProjects([]);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [navigate]);

    // Filter projects by search term
    const filteredProjects = (projects || []).filter((project) =>
        project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logic for completed and ongoing projects
    const completedProjects = projects.filter(project => project.status === "completed");
    const ongoingProjects = projects.filter(project => project.status !== "completed");

    // Calculate the displayed projects based on pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(projects.length / projectsPerPage);

    // Page controls
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
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
                            {loading ? (
                                <p className="text-center">Loading projects...</p>
                            ) : (
                                <table className="min-w-full table-auto">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Project ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Project Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Target Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase"> </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentProjects.map((project) => (
                                            <tr key={project.projectID}>
                                                <td className="px-6 py-4 whitespace-nowrap">{project.projectID}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{project.role.charAt(0).toUpperCase() + project.role.slice(1)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{project.projectTitle}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{project.targetImplementation}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        className="text-black underline pr-3"
                                                        onClick={() => handleViewClick(project)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-between items-center">
                            <div>Showing page {currentPage} out of {totalPages} pages</div>
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
}

export default ProjectsDashboard;