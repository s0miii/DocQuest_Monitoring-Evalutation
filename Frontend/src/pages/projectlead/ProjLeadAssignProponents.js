import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadAssignProponents = () => {
    const navigate = useNavigate();
    const { projectID } = useParams();
    const checklistItems = [
        "Attendance Sheet",
        "Evaluation Sheets/Summary of Evaluation",
        "Trainers CV/DTR",
        "Modules/Lecture Notes",
        "Other Files",
        "Photo Documentations",
    ];


    const [activeTraining, setActiveTraining] = useState("Training");
    const [trainingRows, setTrainingRows] = useState([
        {
            id: 1,
            isEditing: true,
            proponent: "Select Proponent",
            checkboxes: [false, false, false, false, false],
        },
    ]);
    const [NonTrainingRows, setNonTrainingRows] = useState([
        {
            id: 1,
            isEditing: true,
            proponent: "Select Proponent",
            checkboxes: [false, false],
        },
    ]);
    const [proponents, setProponents] = useState([]);
    const [notification, setNotification] = useState("");

    // deployed
    const API_URL = process.env.REACT_APP_API_URL;

    // local
    // const API_URL = 'http://127.0.0.1:8000/';
    // ${API_URL}

    const fetchProponents = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `${API_URL}/monitoring/project/${projectID}/assigned/`,
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

                // Map response to the checkbox state
                const updatedProponents = data.proponents.map((proponent) => ({
                    id: proponent.id,
                    name: proponent.name,
                    isEditing: false,
                    checkboxes: [
                        proponent.daily_attendance || false,
                        proponent.summary_of_evaluation || false,
                        proponent.trainer_cv_dtr || false,
                        proponent.lecture_notes || false,
                        proponent.other_files || false,
                        proponent.photo_documentation || false,
                    ],
                }));

                setProponents(updatedProponents);
            } else {
                console.error("Failed to fetch checklist data.");
            }
        } catch (error) {
            console.error("Error fetching checklist data:", error);
        }
    };




    useEffect(() => {
        fetchProponents();
    }, [projectID]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSubmit = async (proponent) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in. Please log in and try again.");
            return;
        }

        try {
            const payload = {
                project: projectID,
                proponent: proponent.id,
                checklist_items: {
                    daily_attendance: proponent.checkboxes[0],
                    summary_of_evaluation: proponent.checkboxes[1],
                    trainer_cv_dtr: proponent.checkboxes[2],
                    lecture_notes: proponent.checkboxes[3],
                    other_files: proponent.checkboxes[4],
                    photo_documentation: proponent.checkboxes[5],
                },
            };

            const response = await fetch(
                `${API_URL}/monitoring/assign-checklist/${projectID}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                alert("Checklist successfully assigned!");
                fetchProponents(); // Refresh the data
            } else {
                const errorData = await response.json();
                alert(`Failed to assign checklist: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error assigning checklist:", error);
            alert("An error occurred while assigning the checklist.");
        }
    };


    const handleAddRow = () => {
        const newRow = {
            id: Date.now(),
            isEditing: true,
            proponent: "Select Proponent",
            checkboxes:
                activeTraining === "Training"
                    ? [false, false, false, false, false, false]
                    : [false, false],
        };
        if (activeTraining === "Training") {
            setTrainingRows([...trainingRows, newRow]);
        } else {
            setNonTrainingRows([...NonTrainingRows, newRow]);
        }
    };

    const toggleEditMode = (proponentId) => {
        setProponents((prevProponents) =>
            prevProponents.map((proponent) => {
                if (proponent.id === proponentId) {
                    if (proponent.isEditing) {
                        handleSubmit(proponent); // Submit data when exiting edit mode
                    }
                    return { ...proponent, isEditing: !proponent.isEditing };
                }
                return proponent;
            })
        );
    };

    const handleCheckboxChange = (proponentId, index) => {
        setProponents((prevProponents) =>
            prevProponents.map((proponent) =>
                proponent.id === proponentId
                    ? {
                        ...proponent,
                        checkboxes: proponent.checkboxes.map((checked, i) =>
                            i === index ? !checked : checked
                        ),
                    }
                    : proponent
            )
        );
    };



    const rows = activeTraining === "Training" ? trainingRows : NonTrainingRows;

    return (
        <div className="bg-gray-100 min-h-screen flex">
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button
                            className="mr-2"
                            onClick={() => navigate(`/projlead/proj/req/${projectID}`)}
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Assign Proponents</h1>
                    </div>

                    {/* <div className="flex items-center space-x-3 mb-5">
                        <button
                            className={`text-sm ${activeTraining === "Training"
                                ? "text-blue-500 font-semibold underline"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTraining("Training")}
                        >
                            Training
                        </button>
                        <span>|</span>
                        <button
                            className={`text-sm ${activeTraining === "Non-Training"
                                ? "text-blue-500 font-semibold underline"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTraining("Non-Training")}
                        >
                            Non-Training
                        </button>
                    </div> */}

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left font-semibold">
                                        Proponent
                                    </th>
                                    {checklistItems.map((item, index) => (
                                        <th
                                            key={index}
                                            className="border border-gray-300 p-2 text-center font-semibold"
                                        >
                                            {item}
                                        </th>
                                    ))}
                                    <th className="border border-gray-300 p-2 text-center font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {proponents.map((proponent) => (
                                    <tr key={proponent.id} className="border-t border-gray-200">
                                        {/* Proponent Name */}
                                        <td className="border border-gray-300 p-2">{proponent.name}</td>

                                        {/* Checkboxes for Checklist Items */}
                                        {checklistItems.map((item, index) => (
                                            <td key={index} className="border border-gray-300 p-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={proponent.checkboxes[index] || false} // Default to false
                                                    disabled={!proponent.isEditing}
                                                    onChange={() => handleCheckboxChange(proponent.id, index)}
                                                    className="w-4 h-4"
                                                />
                                            </td>
                                        ))}

                                        {/* Edit/Save Button */}
                                        <td className="border border-gray-300 p-2 text-center">
                                            <button
                                                onClick={() => toggleEditMode(proponent.id)}
                                                className="text-blue-500 underline text-sm"
                                            >
                                                {proponent.isEditing ? "Save" : "Edit"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadAssignProponents;
