import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProponentsSideBar from "../../components/ProponentsSideBar";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from 'react-router-dom';

const ProponentsDailyAttRec = () => {
    const navigate = useNavigate();
    const { project_id } = useParams(); // Extract project_id from the URL

    // Form states
    const [date, setDate] = useState('');
    const [description, setDescription] = useState("");
    const [totalAttendees, setAttendees] = useState(0);
    const [attachedFiles, setAttachedFiles] = useState([]); // Array to handle multiple files

    // Handle file selection
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    // Function for submission
    const handleSubmit = async () => {
        const token = localStorage.getItem("authToken"); // Retrieve token for authentication

        if (!token) {
            alert("User not logged in or invalid session.");
            return;
        }

        const formData = new FormData();
        formData.append('description', description); // Append description
        formData.append('total_attendees', totalAttendees); // Append total attendees
        formData.append('date', date); // Append date

        // Append files to form data
        attachedFiles.forEach((file, index) => {
            formData.append(`attendance_file_${index}`, file);
        });

        try {
            // Send POST request to the backend
            const response = await fetch(`http://127.0.0.1:8000/monitoring/upload/attendance/${project_id}/`, {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`, // Include token for authentication
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Submission successful:", data);
                alert("Submission successful!");
            } else {
                const errorData = await response.json();
                console.error("Submission failed:", errorData);
                alert(`Error: ${errorData.error || "Submission failed!"}`);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("An error occurred. Please try again later.");
        }
    };


    // Navigation handler
    const handleViewClick = (path) => {
        navigate(path);
    };

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
                        <button className="mr-2" onClick={() => handleViewClick('/proponents/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Daily Attendance Record {project_id}</h1>
                    </div>
                    {/* Project Details and Progress Status Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Project Title and Leader */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tesda Vocational</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tabasan, Wynoah Louis</p>
                            </div>
                        </div>

                        {/* College/Campus, Target Date, Partner Agency */}
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

                    {/* Add New Submission Section */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-xl font-semibold text-center mb-6">Add New Submission</h2>

                        {/* Day, Date, and Number of Attendees Inputs */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Enter Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Number of Attendees</label>
                                <input
                                    type="number"
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full"
                                    placeholder="Number of Attendees"
                                    value={totalAttendees}
                                    onChange={(e) => setAttendees(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Attached Files Section */}
                        <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center mb-6 relative">
                            <h3 className="font-semibold text-center mb-1">Attached Files</h3>
                            <div className="text-gray-400 mb-1">
                                <span className="block text-center text-5xl">+</span>
                            </div>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* Preview of Attached Files */}
                        {attachedFiles.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {attachedFiles.map((file, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`attachment-preview-${index}`}
                                            className="h-32 w-full object-cover rounded-lg"
                                        />
                                        <p className="text-xs text-center mt-2">{file.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-yellow-500 text-white font-bold py-2 px-12 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Submit
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProponentsDailyAttRec;