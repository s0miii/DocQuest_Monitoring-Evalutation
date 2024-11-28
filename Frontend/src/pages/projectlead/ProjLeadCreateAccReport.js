import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import { FaArrowLeft } from "react-icons/fa";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import axios from "axios";

const ProjLeadCreateAccReport = () => {
    const [formData, setFormData] = useState({
        bannerProgramTitle: "",
        flagshipProgram: "",
        projectTitle: "",
        typeOfProject: "",
        titleOfResearch: "",
        projectCategory: "",
        proponents: "",
        program: "",
        accreditationLevel: "",
        college: "",
        targetGroups: "",
        projectLocation: "",
        partnerAgency: "",
        trainingModality: "",
        actualDateOfImplementation: "",
        totalDays: "",
        submittedBy: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [photos, setPhotos] = useState([{ file: null, description: '' }]);
    const [modalPhoto, setModalPhoto] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Simulate fetching data from an API
                const response = await fetch('https://api.example.com/project-details');
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                setError('Failed to fetch data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFileChange = (index, files) => {
        const newPhotos = [...photos];
        newPhotos[index].files = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setPhotos(newPhotos);
    };

<<<<<<< HEAD
    const handleFileChange = (index, file) => {
        const newPhotos = [...photos];
        newPhotos[index].file = file;
        setPhotos(newPhotos);
=======
    const handlePhotoClick = (url) => {
        setModalPhoto(url);
>>>>>>> 50d8e4089be3c284c727c5cf0ff36e2bee451fd6
    };

    const handleDescriptionChange = (index, description) => {
        const newPhotos = [...photos];
        newPhotos[index].description = description;
        setPhotos(newPhotos);
    };

    const addPhotoField = () => {
        setPhotos([...photos, { file: null, description: '' }]);
    };

    const handleSubmit = () => {
        console.log(photos);
    };

    return (
        <div className="bg-gray-200 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
<<<<<<< HEAD
                        <button className="my-5 mr-3" onClick={() => handleViewClick('/projlead/proj/req/accomplishment-report')}>
=======
                        <button className="my-5 mr-3" onClick={() => navigate('/projlead/proj/req/accomplishment-report')}>
>>>>>>> 50d8e4089be3c284c727c5cf0ff36e2bee451fd6
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold text-left">Create Accomplishment Report</h1>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-6">Extension Accomplishment Report</h2>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Banner Program Title</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.bannerProgramTitle}</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Flagship Program</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.flagshipProgram}</p>
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Project Title</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.projectTitle}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type of Project</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.typeOfProject}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Category</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.projectCategory}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Title of Research</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.titleOfResearch}</p>
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
                                    <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.accreditationLevel}</p>
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
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.targetGroups}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Location</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.projectLocation}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.partnerAgency}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Training Modality</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.trainingModality}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual Date of Implementation</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.actualDateOfImplementation}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Number of Days</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.totalDays}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                            <p className="bg-gray-100 rounded-lg p-3 mt-1">{formData.submittedBy}</p>
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
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="bg-yellow-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-yellow-600 transition"
                                onClick={handleSubmit}
                            >
                                Submit
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
