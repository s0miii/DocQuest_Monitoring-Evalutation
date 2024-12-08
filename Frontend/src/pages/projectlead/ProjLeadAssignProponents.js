import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadAssignProponents = () => {
    const navigate = useNavigate();
    const { projectID } = useParams(); // Retrieve projectID from the URL

    const [activeTraining, setActiveTraining] = useState("Training");
    const [trainingRows, setTrainingRows] = useState([
        {
            id: 1,
            isEditing: true,
            proponent: "Select Proponent",
            checkboxes: [false, false, false, false, false],
        },
    ]);
    const [NonTrainingRows, setDleTrainingRows] = useState([
        {
            id: 1,
            isEditing: true,
            proponent: "Select Proponent",
            checkboxes: [false, false],
        },
    ]);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSubmit = async (row) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in. Please log in and try again.");
            return;
        }

        try {
            const payload = {
                project: projectID, // Dynamically set the project ID from useParams
                proponent: row.proponent, // Selected proponent for this row
                checklist_items: {
                    daily_attendance: row.checkboxes[0],
                    summary_of_evaluation: row.checkboxes[1],
                    lecture_notes: row.checkboxes[2],
                    other_files: row.checkboxes[3],
                    photo_documentation: row.checkboxes[4], // Adjust based on checkbox order
                },
            };

            const response = await fetch(
                "http://127.0.0.1:8000/monitoring/assign-checklist/",
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
                const data = await response.json();
                alert("Checklist successfully assigned!");
                console.log("Response:", data);
            } else {
                const errorData = await response.json();
                alert(`Failed to assign checklist: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error assigning checklist:", error);
            alert("An error occurred while assigning the checklist.");
        }
    };

    const handleViewClick = (path) => {
        navigate(path);
    };

    const hanNonTrainingClick = (training) => {
        setActiveTraining(training);
    };

    const handleAddRow = () => {
        const newRow = {
            id: Date.now(),
            isEditing: true,
            proponent: "Select Proponent",
            checkboxes:
                activeTraining === "Training"
                    ? [false, false, false, false, false]
                    : [false, false],
        };
        if (activeTraining === "Training") {
            setTrainingRows([...trainingRows, newRow]);
        } else {
            setDleTrainingRows([...NonTrainingRows, newRow]);
        }
    };

    const toggleEditMode = (id) => {
        const updateRows = (rows) =>
            rows.map((row) => {
                if (row.id === id) {
                    if (row.isEditing) {
                        handleSubmit(row); // Submit data when exiting edit mode
                    }
                    return { ...row, isEditing: !row.isEditing };
                }
                return row;
            });

        if (activeTraining === "Training") {
            setTrainingRows(updateRows(trainingRows));
        } else {
            setDleTrainingRows(updateRows(NonTrainingRows));
        }
    };

    const handleProponentChange = (id, value) => {
        const updateRows = (rows) =>
            rows.map((row) => (row.id === id ? { ...row, proponent: value } : row));

        if (activeTraining === "Training") {
            setTrainingRows(updateRows(trainingRows));
        } else {
            setDleTrainingRows(updateRows(NonTrainingRows));
        }
    };

    const handleCheckboxChange = (rowId, index) => {
        const updateRows = (rows) =>
            rows.map((row) =>
                row.id === rowId
                    ? {
                        ...row,
                        checkboxes: row.checkboxes.map((checked, i) =>
                            i === index ? !checked : checked
                        ),
                    }
                    : row
            );

        if (activeTraining === "Training") {
            setTrainingRows(updateRows(trainingRows));
        } else {
            setDleTrainingRows(updateRows(NonTrainingRows));
        }
    };

    const getColumnName = (index) => {
        const trainingColumns = [
            "List of Participants/Daily Attendance Sheet",
            "Evaluation Sheets/Summary of Evaluation (in Excel form)",
            "Trainers CV/DTR",
            "Modules/Lecture Notes",
            "Other",
        ];
        const dleColumns = ["Modules/Lecture Notes", "Other"];
        return activeTraining === "Training"
            ? trainingColumns[index]
            : dleColumns[index];
    };

    const rows = activeTraining === "Training" ? trainingRows : NonTrainingRows;

    return (
        <div className="bg-gray-100 min-h-screen flex">
            {/* Sidebar with fixed width */}
            <div className="w-1/5 fixed h-full">
                <ProjLeadSidebar />
            </div>
            {/* Main content area */}
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col mt-14 px-10">
                    <div className="flex items-center mb-5">
                        <button
                            className="mr-2"
                            onClick={() => handleViewClick("/projlead/proj/req")}
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Assign Proponents</h1>
                    </div>

                    {/* Training Tabs */}
                    <div className="flex items-center space-x-3 mb-5">
                        <button
                            className={`text-sm ${activeTraining === "Training"
                                ? "text-blue-500 font-semibold underline"
                                : "text-gray-500"
                                }`}
                            onClick={() => hanNonTrainingClick("Training")}
                        >
                            Training
                        </button>
                        <span>|</span>
                        <button
                            className={`text-sm ${activeTraining === "Non-Training"
                                ? "text-blue-500 font-semibold underline"
                                : "text-gray-500"
                                }`}
                            onClick={() => hanNonTrainingClick("Non-Training")}
                        >
                            Non-Training
                        </button>
                    </div>

                    {/* Notification */}
                    {notification && (
                        <div className="mb-4 text-green-600 font-semibold">
                            {notification}
                        </div>
                    )}

                    {/* Documentary Requirements Table */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left font-semibold">
                                        Proponent
                                    </th>
                                    {activeTraining === "Training" && (
                                        <>
                                            <th className="border border-gray-300 p-2 text-center font-semibold">
                                                Attendance Records
                                            </th>
                                            <th className="border border-gray-300 p-2 text-center font-semibold">
                                                Evaluation Sheets/Summary of Evaluation (in
                                                Excel form)
                                            </th>
                                            <th className="border border-gray-300 p-2 text-center font-semibold">
                                                Trainers CV/DTR
                                            </th>
                                        </>
                                    )}
                                    <th className="border border-gray-300 p-2 text-center font-semibold">
                                        Modules/Lecture Notes
                                    </th>
                                    <th className="border border-gray-300 p-2 text-center font-semibold">
                                        Other Files
                                    </th>
                                    <th className="border border-gray-300 p-2 text-center font-semibold">
                                        Photo Documentations
                                    </th>
                                    <th className="border border-gray-300 p-2 text-center font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id} className="border-t border-gray-200">
                                        <td className="border border-gray-300 p-2">
                                            <select
                                                className="bg-gray-100 p-2 rounded w-full"
                                                value={row.proponent}
                                                onChange={(e) =>
                                                    handleProponentChange(
                                                        row.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>Select Proponent</option>
                                                <option>Proponent 1</option>
                                                <option>Proponent 2</option>
                                            </select>
                                        </td>
                                        {row.checkboxes.map((checked, index) => (
                                            <td
                                                key={index}
                                                className="border border-gray-300 p-2 text-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    disabled={!row.isEditing}
                                                    onChange={() =>
                                                        handleCheckboxChange(row.id, index)
                                                    }
                                                    className="w-4 h-4"
                                                />
                                            </td>
                                        ))}
                                        {/* Action Button in a Dedicated Column */}
                                        <td className="border border-gray-300 p-2 text-center">
                                            <button
                                                onClick={() => toggleEditMode(row.id)}
                                                className="text-blue-500 underline text-sm"
                                            >
                                                {row.isEditing ? "Submit" : "Edit"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-left">
                            <button
                                onClick={handleAddRow}
                                className="text-blue-500 underline text-sm"
                            >
                                Add Row
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadAssignProponents;
