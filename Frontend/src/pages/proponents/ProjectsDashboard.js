import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import ProjLeadSideBar from "../../components/ProjLeadSideBar";
import axios from "axios";

const ProjectsDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [filter, setFilter] = useState("Ongoing"); // Default to Ongoing projects
    const [error, setError] = useState(null);
    const pageSize = 5; // Define the page size



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

    const fetchProjects = async () => {
        try {
            let allProjects = [];
            let page = 1;
            let totalPages = 1;

            // Fetch data from all pages
            do {
                const response = await axios.get(
                    `http://127.0.0.1:8000/monitoring/user-projects/?page=${page}&page_size=${pageSize}`,
                    {
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const { data, meta } = response.data;

                // Combine current page data into allProjects
                allProjects = [...allProjects, ...data];
                totalPages = meta.total_pages;
                page += 1; // Move to the next page
            } while (page <= totalPages);

            // Update the projects state with all fetched projects
            setProjects(allProjects.map((project) => ({
                ...project,
                isCompleted: project.progress >= 100, // Mark completion status
            })));
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error("Error fetching projects:", error);
            setError(error.message || "Failed to fetch projects");
            setProjects([]);
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    useEffect(() => {
        fetchProjects(currentPage); // Fetch projects when the component loads or page changes
    }, [currentPage]);

    const handleViewClick = (project) => {
        if (project.role === "Project Leader") {
            navigate(`/projlead/proj/req/${project.projectID}`);
        } else if (project.role === "Proponent") {
            navigate(`/proponents/proj/req/${project.projectID}`);
        } else {
            alert("Invalid role detected.");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
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


    const renderPagination = () => {
        const paginationButtons = [];

        // Previous Button
        if (currentPage > 1) {
            paginationButtons.push(
                <button
                    key="prev"
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
            );
        }

        // Current Page, Previous, and Next Buttons
        if (currentPage > 1) {
            paginationButtons.push(
                <button
                    key={currentPage - 1}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    {currentPage - 1}
                </button>
            );
        }

        paginationButtons.push(
            <button
                key={currentPage}
                className="px-3 py-1 border rounded bg-gray-300 font-bold"
                disabled
            >
                {currentPage}
            </button>
        );

        if (currentPage < totalPages) {
            paginationButtons.push(
                <button
                    key={currentPage + 1}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    {currentPage + 1}
                </button>
            );
        }

        // Next Button
        if (currentPage < totalPages) {
            paginationButtons.push(
                <button
                    key="next"
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            );
        }

        return paginationButtons;
    };


    // Filter projects by "Completed" or "Ongoing" and apply search term
    const filteredProjects = projects
        .filter((project) => {
            if (filter === "Completed") {
                return project.isCompleted;
            }
            return !project.isCompleted;
        })
        .filter((project) =>
            project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Calculate pagination details after defining filteredProjects
    const totalPages = Math.ceil(filteredProjects.length / pageSize);
    const currentProjects = filteredProjects.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );


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
                <ProjLeadSideBar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <h1 className="text-2xl font-semibold mb-5">Projects Overview</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
                        {/* Completed */}
                        <div
                            className={`bg-green-500 text-white rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${filter === "Completed" ? "ring-4 ring-green-700" : ""}`}
                            onClick={() => setFilter("Completed")}
                        >
                            <h2 className="text-lg font-semibold">Completed</h2>
                            <h2 className="text-4xl font-bold">
                                {projects.filter((p) => p.isCompleted).length}
                            </h2>
                            <span className="mt-2 underline">View</span>
                        </div>
                        {/* Ongoing */}
                        <div
                            className={`bg-yellow-400 text-white rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${filter === "Ongoing" ? "ring-4 ring-yellow-700" : ""}`}
                            onClick={() => setFilter("Ongoing")}
                        >
                            <h2 className="text-lg font-semibold">Ongoing</h2>
                            <h2 className="text-4xl font-bold">
                                {projects.filter((p) => !p.isCompleted).length}
                            </h2>
                            <span className="mt-2 underline">View</span>
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
                                        <th
                                            className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer"
                                            onClick={() => handleSort('projectTitle')}
                                        >
                                            Title {sortConfig.key === 'projectTitle' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer"
                                            onClick={() => handleSort('role')}
                                        >
                                            Project Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer"
                                            onClick={() => handleSort('targetImplementation')}
                                        >
                                            Target Date {sortConfig.key === 'targetImplementation' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProjects.length > 0 ? (
                                        currentProjects.map((project) => (
                                            <tr key={project.projectID}>
                                                <td className="px-6 py-4 whitespace-nowrap">{project.projectTitle}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{project.role || "No Role"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{project.targetImplementation}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        className="text-blue-500 hover:underline"
                                                        onClick={() => handleViewClick(project)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                No projects found. Try changing the filter or search term.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-center items-center space-x-2">
                            {filteredProjects.length > 0 && renderPagination()}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsDashboard;
