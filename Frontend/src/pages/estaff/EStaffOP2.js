import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffOP2 = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]); // Start with an empty table
    const [editIndex, setEditIndex] = useState(null); // Track the row being edited

    // Fetch all entries on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        alert("User not logged in. Please log in again.");
        navigate("/login");
        return;
        }

        fetch('http://127.0.0.1:8000/monitoring/extension_program_op2/', {
        headers: {
            Authorization: `Token ${token}`,
            Accept: 'application/json',
        },
        })
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, [navigate]);


    // Add a new empty row
    const handleAddRow = () => {
        const newData = [...data, {
            quarter: "",
            mandated_priority_program: "",
            extension_program: "",
            from_date: "",
            to_date: "",
            campus: "",
            remarks: "",
            id: null,
        }];
        setData(newData);
        setEditIndex(newData.length - 1); // Set to last new index
        console.log("Added new row, new data length:", newData.length);
    };

    // Handle input changes
    const handleInputChange = (e, field, index) => {
        const newData = [...data];
        newData[index][field] = e.target.value;
        setData(newData);
    };



    const handleSaveClick = index => {
        console.log("Attempting to save at index:", index);  // Debug log
        console.log("Current data:", data);   

        if (index < 0 || index >= data.length) {
            console.error('Invalid index:', index);
            alert('Invalid index. Please refresh the data or try again.');
            return;
        }

        const entry = data[index];
        if (!entry) {
            console.error('Error: No entry found at this index.');
            alert('No entry found at this index.');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        const url = entry.id ? `http://127.0.0.1:8000/monitoring/extension_program_op2/${entry.id}/` : `http://127.0.0.1:8000/monitoring/extension_program_op2/`;
        const method = entry.id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(`${err.detail || 'Unknown error'} status: ${response.status}`) });
            }
            return response.json();
        })
        .then(updatedEntry => {
            const updatedData = [...data];
            updatedData[index] = entry.id ? updatedEntry : { ...entry, id: updatedEntry.id };
            setData(updatedData);
            setEditIndex(null);
            alert('Save successful!');
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert('Error saving data: ' + error.message);
        });
    };


    const handleDeleteRow = index => {
        const entry = data[index];
        const token = localStorage.getItem("token");
        if (!token) {
        alert("User not logged in. Please log in again.");
        navigate("/login");
        return;
        }

        if (!entry.id) {
        setData(data.filter((_, i) => i !== index));
        return;
        }

        fetch(`http://127.0.0.1:8000/monitoring/extension_program_op2/${entry.id}/`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
            Accept: 'application/json',
        },
        })
        .then(() => {
        setData(data.filter((_, i) => i !== index));  // Update local state to remove the entry
        })
        .catch(error => console.error('Error deleting data:', error));
    };

    return (
        <div className="flex min-h-screen bg-gray-200">
        <div className="fixed w-1/5 h-full">
            <EStaffSideBar />
        </div>
        <div className="flex-1 ml-[20%]">
            <Topbar />
            <div className="flex flex-col px-10 mt-14">
            <button className="my-5" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </button>
            <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
                <h1 className="mb-5 text-2xl font-medium">Extension Program Op2</h1>
                <div className="w-full p-4 overflow-x-auto bg-gray-100">
                {/* Scrollable Table Container */}
                <div className="min-w-full bg-white border border-gray-300">
                    <table className="min-w-full text-sm text-center border-collapse table-auto">
                    <thead>
                        <tr>
                        <th className="px-4 py-2 border border-gray-400 w-[50px]">#</th>
                        <th className="px-4 py-2 border border-gray-400 w-[150px]">Quarter</th>
                        <th className="px-4 py-2 border border-gray-400 max-w-[200px]">
                            Mandated/Priority Program
                        </th>
                        <th className="px-4 py-2 border border-gray-400 max-w-[200px]">
                            Extension Program
                        </th>
                        <th className="px-4 py-2 border border-gray-400 w-[100px]">
                            From
                        </th>
                        <th className="px-4 py-2 border border-gray-400 w-[100px]">
                            To
                        </th>
                        <th className="px-4 py-2 border border-gray-400 max-w-[150px]">
                            Campus
                        </th>
                        <th className="px-4 py-2 border border-gray-400 max-w-[150px]">
                            Remarks
                        </th>
                        <th className="px-4 py-2 border border-gray-400 w-[150px]">
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="px-4 py-2 border border-gray-400">{index + 1}</td>
                            {editIndex === index ? (
                            <>
                                <td className="px-4 py-2 border border-gray-400 w-[150px]">
                                <select
                                    value={row.quarter}
                                    onChange={(e) => handleInputChange(e, "quarter", index)}
                                    className="w-full px-2 py-1 border border-gray-300"
                                >
                                    <option value="">Select Quarter</option>
                                    <option value="1st Quarter">1st Quarter</option>
                                    <option value="2nd Quarter">2nd Quarter</option>
                                    <option value="3rd Quarter">3rd Quarter</option>
                                    <option value="4th Quarter">4th Quarter</option>
                                </select>
                                </td>
                                <td className="px-4 py-2 border border-gray-400 max-w-[200px]">
                                <input
                                    type="text"
                                    value={row.mandated_priority_program}
                                    onChange={(e) => handleInputChange(e, "mandated_priority_program", index)}
                                    className="w-full px-2 py-1 truncate border border-gray-300"
                                />
                                </td>
                                <td className="px-4 py-2 border border-gray-400 max-w-[200px]">
                                <input
                                    type="text"
                                    value={row.extension_program}
                                    onChange={(e) => handleInputChange(e, "extension_program", index)}
                                    className="w-full px-2 py-1 truncate border border-gray-300"
                                />
                                </td>
                                <td className="px-4 py-2 border border-gray-400 w-[100px]">
                                <input
                                    type="date"
                                    value={row.from_date}
                                    onChange={(e) => handleInputChange(e, "from_date", index)}
                                    className="w-full px-2 py-1 border border-gray-300"
                                />
                                </td>
                                <td className="px-4 py-2 border border-gray-400 w-[100px]">
                                <input
                                    type="date"
                                    value={row.to_date}
                                    onChange={(e) => handleInputChange(e, "to_date", index)}
                                    className="w-full px-2 py-1 border border-gray-300"
                                />
                                </td>
                                <td className="px-4 py-2 border border-gray-400 max-w-[150px]">
                                <input
                                    type="text"
                                    value={row.campus}
                                    onChange={(e) => handleInputChange(e, "campus", index)}
                                    className="w-full px-2 py-1 truncate border border-gray-300"
                                />
                                </td>
                                <td className="px-4 py-2 border border-gray-400 max-w-[150px]">
                                <input
                                    type="text"
                                    value={row.remarks}
                                    onChange={(e) => handleInputChange(e, "remarks", index)}
                                    className="w-full px-2 py-1 truncate border border-gray-300"
                                />
                                </td>
                                <td className="px-4 py-2 border border-gray-400 w-[150px]">
                                <button
                                    onClick={handleSaveClick}
                                    className="px-4 py-1 text-white bg-green-500 rounded"
                                >
                                    Save
                                </button>
                                </td>
                            </>
                            ) : (
                            <>
                                <td className="px-4 py-2 border border-gray-400 w-[150px]">{row.quarter}</td>
                                <td className="px-4 py-2 break-words border border-gray-400 max-w-[200px]">
                                {row.mandated_priority_program}
                                </td>
                                <td className="px-4 py-2 break-words border border-gray-400 max-w-[200px]">
                                {row.extension_program}
                                </td>
                                <td className="px-4 py-2 border border-gray-400 w-[100px]">
                                {row.from_date}
                                </td>
                                <td className="px-4 py-2 border border-gray-400 w-[100px]">
                                {row.to_date}
                                </td>
                                <td className="px-4 py-2 break-words border border-gray-400 max-w-[150px]">
                                {row.campus}
                                </td>
                                <td className="px-4 py-2 break-words border border-gray-400 max-w-[150px]">
                                {row.remarks}
                                </td>
                                <td className="px-4 py-2 border border-gray-400 w-[150px]">
                                <button
                                    onClick={() => setEditIndex(index)}
                                    className="px-4 py-1 mb-1 mr-2 text-white bg-blue-500 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteRow(index)}
                                    className="px-4 py-1 text-white bg-red-500 rounded"
                                >
                                    Delete
                                </button>
                                </td>
                            </>
                            )}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                <button
                    onClick={handleAddRow}
                    className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
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

export default EStaffOP2;
