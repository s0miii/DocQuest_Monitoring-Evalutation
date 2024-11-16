import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import { useNavigate } from 'react-router-dom';
import ProjLeadSidebar from "../../components/ProjLeadSideBar";
import { FaArrowLeft } from "react-icons/fa";

const ProjLeadAssignProponents = () => {
    const navigate = useNavigate();
    const [activeTraining, setActiveTraining] = useState("Dle Training");
    const [trainingRows, setTrainingRows] = useState([{ id: 1, isEditing: true, proponent: "Select Proponent", checkboxes: [false, false, false, false, false] }]);
    const [dleTrainingRows, setDleTrainingRows] = useState([{ id: 1, isEditing: true, proponent: "Select Proponent", checkboxes: [false, false] }]);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification("");
            }, 3000);
            return () => clearTimeout(timer); 
        }
    }, [notification]);

    const handleViewClick = (path) => {
        navigate(path);
    };

    const handleTrainingClick = (training) => {
        setActiveTraining(training);
    };

    const handleAddRow = () => {
        const newRow = { 
            id: Date.now(), 
            isEditing: true, 
            proponent: "Select Proponent", 
            checkboxes: activeTraining === "Training" ? [false, false, false, false, false] : [false, false] 
        };
        if (activeTraining === "Training") {
            setTrainingRows([...trainingRows, newRow]);
        } else {
            setDleTrainingRows([...dleTrainingRows, newRow]);
        }
    };

    const toggleEditMode = (id) => {
        const updateRows = (rows) =>
            rows.map(row => {
                if (row.id === id) {
                    if (row.isEditing) {
                        const selectedCheckboxes = row.checkboxes
                            .map((checked, index) => (checked ? getColumnName(index) : null))
                            .filter(Boolean)
                            .join(", ");
                        setNotification(`Successfully assigned ${row.proponent} to ${selectedCheckboxes}`);
                    }
                    return { ...row, isEditing: !row.isEditing };
                }
                return row;
            });
        
        if (activeTraining === "Training") {
            setTrainingRows(updateRows(trainingRows));
        } else {
            setDleTrainingRows(updateRows(dleTrainingRows));
        }
    };

    const handleProponentChange = (id, value) => {
        const updateRows = (rows) =>
            rows.map(row => (row.id === id ? { ...row, proponent: value } : row));
        
        if (activeTraining === "Training") {
            setTrainingRows(updateRows(trainingRows));
        } else {
            setDleTrainingRows(updateRows(dleTrainingRows));
        }
    };

    const handleCheckboxChange = (rowId, index) => {
        const updateRows = (rows) =>
            rows.map(row =>
                row.id === rowId ? { ...row, checkboxes: row.checkboxes.map((checked, i) => (i === index ? !checked : checked)) } : row
            );

        if (activeTraining === "Training") {
            setTrainingRows(updateRows(trainingRows));
        } else {
            setDleTrainingRows(updateRows(dleTrainingRows));
        }
    };

    const getColumnName = (index) => {
        const trainingColumns = ["List of Participants/Daily Attendance Sheet", "Evaluation Sheets/Summary of Evaluation (in Excel form)", "Trainers CV/DTR*", "Modules/Lecture Notes", "Other"];
        const dleColumns = ["Modules/Lecture Notes", "Other"];
        return activeTraining === "Training" ? trainingColumns[index] : dleColumns[index];
    };

    const rows = activeTraining === "Training" ? trainingRows : dleTrainingRows;

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
                        <button className="mr-2" onClick={() => handleViewClick('/projlead/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Assign Proponents</h1>
                    </div>

                    {/* Training Tabs */}
                    <div className="flex items-center space-x-3 mb-5">
                        <button
                            className={`text-sm ${activeTraining === "Training" ? "text-blue-500 font-semibold underline" : "text-gray-500"}`}
                            onClick={() => handleTrainingClick("Training")}
                        >
                            Training
                        </button>
                        <span>|</span>
                        <button
                            className={`text-sm ${activeTraining === "Dle Training" ? "text-blue-500 font-semibold underline" : "text-gray-500"}`}
                            onClick={() => handleTrainingClick("Dle Training")}
                        >
                            Dle Training
                        </button>
                    </div>

                    {/* Notification */}
                    {notification && <div className="mb-4 text-green-600 font-semibold">{notification}</div>}

                    {/* Documentary Requirements Table */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left font-semibold">Proponent</th>
                                    {activeTraining === "Training" && (
                                        <>
                                            <th className="border border-gray-300 p-2 text-center font-semibold">List of Participants/Daily Attendance Sheet</th>
                                            <th className="border border-gray-300 p-2 text-center font-semibold">Evaluation Sheets/Summary of Evaluation (in Excel form)</th>
                                            <th className="border border-gray-300 p-2 text-center font-semibold">Trainers CV/DTR*</th>
                                        </>
                                    )}
                                    <th className="border border-gray-300 p-2 text-center font-semibold">Modules/Lecture Notes</th>
                                    <th className="border border-gray-300 p-2 text-center font-semibold">Other</th>
                                    <th className="border border-gray-300 p-2 text-center font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id} className="border-t border-gray-200">
                                        <td className="border border-gray-300 p-2">
                                            <select
                                                className="bg-gray-100 p-2 rounded w-full"
                                                value={row.proponent}
                                                onChange={(e) => handleProponentChange(row.id, e.target.value)}
                                            >
                                                <option>Select Proponent</option>
                                                <option>Proponent 1</option>
                                                <option>Proponent 2</option>
                                            </select>
                                        </td>
                                        {row.checkboxes.map((checked, index) => (
                                            <td key={index} className="border border-gray-300 p-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    disabled={!row.isEditing}
                                                    onChange={() => handleCheckboxChange(row.id, index)}
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
