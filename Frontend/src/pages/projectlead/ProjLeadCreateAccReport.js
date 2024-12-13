import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import { FaArrowLeft } from "react-icons/fa";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import axios from 'axios';
import { useParams } from "react-router-dom";

const ProjLeadCreateAccReport = () => {
    const [formData, setFormData] = useState({
        banner_program_title: "",
        flagship_program: "",
        project_title: "",
        project_type: "",
        research_title: "",
        project_category: "",
        proponents: "",
        program: "",
        accreditation_level: "",
        college: "",
        target_groups_beneficiaries: "",
        project_location: "",
        partner_agency: "",
        training_modality: "",
        actual_implementation_date: "",
        total_number_of_days: "",
        submitted_by: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [photos, setPhotos] = useState([{ file: null, description: '' }]);
    const [modalPhoto, setModalPhoto] = useState(null);
    const { projectID } = useParams();
    const navigate = useNavigate();

    //Fetch Accomplishment Report
    useEffect(() => {
        if (!projectID) {
            console.error("Project ID is undefined.");
            return;
        }

        const fetchAccomplishmentReport = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("User not logged in. Please log in again.");
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/monitoring/accomplishment-reports/${projectID}/`,  // Adjust this URL to your API endpoint
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
                    setFormData({
                        banner_program_title: data.banner_program_title || "",
                        flagship_program: data.flagship_program || "",
                        project_title: data.project_title || "",
                        project_type: data.project_type || "",
                        research_title: data.research_title || "",
                        project_category: data.project_category || "",
                        proponents: data.proponents || "",
                        program: data.program || "",
                        accreditation_level: data.accreditation_level || "",
                        college: data.college || "",
                        target_groups_beneficiaries: data.target_groups_beneficiaries || "",
                        project_location: data.project_location || "",
                        partner_agency: data.partner_agency || "",
                        training_modality: data.training_modality || "",
                        actual_implementation_date: data.actual_implementation_date || "",
                        total_number_of_days: data.total_number_of_days || "",
                        submitted_by: data.submitted_by || "",
                    });
                } else {
                    setError("Failed to fetch the report.");
                }
            } catch (error) {
                setError("Error fetching the report.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccomplishmentReport();
    }, [projectID, navigate]);

    // Handle photo uploads
    const handleFileChange = (index, files) => {
        const newPhotos = [...photos];
        newPhotos[index].files = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setPhotos(newPhotos);
    };

    const handlePhotoClick = (url) => {
        setModalPhoto(url);
    };

    const handleDescriptionChange = (index, description) => {
        const newPhotos = [...photos];
        newPhotos[index].description = description;
        setPhotos(newPhotos);
    };

    const addPhotoField = () => {
        setPhotos([...photos, { file: null, description: '' }]);
    };


    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Prepare form data
            const formDataToSubmit = {
                ...formData,
                photos: photos.map((photo) => ({
                    files: photo.files,
                    description: photo.description,
                })),
            };

            // Make API request to backend (update URL to match your backend endpoint)
            const response = await axios.post('/api/accomplishment-reports/', formDataToSubmit, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization token if needed
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            // Handle successful submission
            if (response.status === 201) {
                navigate('/projlead/proj/req/accomplishment-report');
            }
        } catch (err) {
            setError("An error occurred while submitting the report. Please try again.");
            console.error("Submission error: ", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Display loading message while data is being fetched
    }

    if (error) {
        return <div>{error}</div>; // Display error message if fetch fails
    }

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button className="my-5 mr-3" onClick={() => navigate('/projlead/proj/req/accomplishment-report')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold text-left">Create Accomplishment Report</h1>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Extension Accomplishment Report</h2>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Banner Program Title</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.banner_program_title}</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Flagship Program</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.flagship_program}</p>
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Project Title</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type of Project</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_type}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Category</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_category}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Title of Research</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.research_title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Proponents</label>
                                <textarea
                                    className="bg-gray-100 rounded-lg p-3 mt-1 w-full resize-none overflow-hidden"
                                    readOnly
                                    value={formData.proponents}
                                    style={{ height: 'auto', minHeight: '250px' }}
                                />
                            </div>
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Program</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.program}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Accreditation Level</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.accreditation_level}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">College</label>
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.college}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Groups/Beneficiaries</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.target_groups_beneficiaries}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Location</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.project_location}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.partner_agency}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Training Modality</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.training_modality}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual Date of Implementation</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.actual_implementation_date}</p>
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
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.traineesWeighted}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.actualTrainees}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.actualDays}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.personsTrained}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                    <td className="border border-gray-300 px-4 py-2 text-left"> Number of Trainees who evaluated the training to be at least satisfactory </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.satisfactoryEvaluation}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="w-full bg-gray-100 rounded-lg p-2 text-center">Rating 100%</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <p className="bg-gray-100 rounded-lg p-2 w-full text-center">{formData.weightedTraining}</p>
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
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Issues and Challenges Encountered</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quality of the Participants' Engagement</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discussion of Questions Raised and Comments from the Participants</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ways Forward and Plans</label>
                                <textarea className="bg-gray-100 rounded-lg p-3 w-full mt-4" rows="4" placeholder="Enter input here..."></textarea>
                            </div>
                        </div>

                        {/* Photo Documentation */}
                        <h2 className="text-xl font-semibold text-center mb-4 mt-8">Photo Documentation</h2>
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 grid grid-cols-1 gap-2 mb-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Attached Photo {index + 1}
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        className="w-full cursor-pointer file:bg-gray-50 file:border-0 file:p-2 rounded-lg mt-1"
                                        onChange={(e) => handleFileChange(index, Array.from(e.target.files))}
                                    />
                                </div>
                                {photo.files && photo.files.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Attached Files
                                        </label>
                                        <ul className="list-disc list-inside">
                                            {photo.files.map((file, fileIndex) => (
                                                <li
                                                    key={fileIndex}
                                                    className="text-blue-500 cursor-pointer hover:underline"
                                                    onClick={() => handlePhotoClick(file.url)}
                                                >
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        className="bg-gray-100 rounded-lg p-3 mt-1 w-full resize-none"
                                        placeholder="Enter description"
                                        value={photo.description}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        rows={1}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-start mb-4">
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={addPhotoField}
                            >
                                Attach Another Photo
                            </span>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white p-3 rounded-lg"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>

                        {/* Modal for Photo View */}
                        {modalPhoto && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-4 relative">
                                    <img
                                        src={modalPhoto}
                                        alt="Preview"
                                        className="max-w-full max-h-[80vh] rounded-lg"
                                    />
                                    <button
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                                        onClick={() => setModalPhoto(null)}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>





                    {/* Footer Signatures*/}
                    {/* <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Prepared By:</h2>
                        <div className="text-center">
                            <p className="font-semibold">Dr/Engr/Mr/Ms. Chuvaness PhD/MEd/MSc/MD</p>
                            <p>Faculty/College of Information Technology and Communication</p>
                        </div>
                        <h2 className="text-xl font-semibold text-center mt-6">Noted By:</h2>
                        <div className="text-center">
                            <p className="font-semibold">Dr. Maria Teresa M. Fajardo</p>
                            <p>Director, Extension and Community Relations Division</p>
                        </div>
                    </div>  */}
                </div>
            </div>
        </div>
    );
};

export default ProjLeadCreateAccReport;
