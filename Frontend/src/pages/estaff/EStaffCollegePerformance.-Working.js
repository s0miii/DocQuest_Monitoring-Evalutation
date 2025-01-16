import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const EStaffPREXC = () => {
    const navigate = useNavigate();

    const [rows, setRows] = useState({
        CEA: Array(17).fill(""),
        CITC: Array(17).fill(""),
        CSM: Array(17).fill(""),
        CSTE: Array(17).fill(""),
        COT: Array(17).fill(""),
        COM: Array(17).fill(""),
        JASAAN: Array(17).fill(""),
        PANAOAN: Array(17).fill(""),
        OROQUIETA: Array(17).fill(""),
        VILLANUEVA: Array(17).fill(""),
        BALUBAL: Array(17).fill(""),
        ALUBIJID: Array(17).fill(""),
    });

    const [month, setMonth] = useState("Month");
    const [year, setYear] = useState("Year");
    const [totalRowIndex5, setTotalRowIndex5] = useState("");

    // Fetch saved data from the backend
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/monitoring/college_performance/", {
                    headers: {
                        Authorization: `Token ${token}`,
                        Accept: "application/json",
                    },
                });
                // Transform the fetched data into the format required by rows
                const fetchedRows = response.data.reduce((acc, item) => {
                    acc[item.campus] = [
                        item.programs_number || "",
                        item.programs_percentage || "",
                        item.faculty_number || "",
                        item.faculty_percentage || "",
                        item.average_percentage || "",
                        item.persons_trained_target || "",
                        item.persons_trained_weighted_accomplishment || "",
                        item.persons_trained_variance || "",
                        item.partnerships_target || "",
                        item.partnerships_accomplishment || "",
                        item.partnerships_variance || "",
                        item.beneficiaries_target || "",
                        item.beneficiaries_accomplishment || "",
                        item.beneficiaries_variance || "",
                        item.extension_programs_target || "",
                        item.extension_programs_accomplishment || "",
                        item.extension_programs_variance || "",
                    ];
                    return acc;
                }, {});
                setRows((prev) => ({ ...prev, ...fetchedRows }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [navigate]);

    // Handle input changes
    const handleInputChange = (rowName, index, value) => {
        setRows((prevRows) => ({
            ...prevRows,
            [rowName]: prevRows[rowName].map((val, i) => (i === index ? value : val)),
        }));
    };

    // Save data to backend
    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        const dataToSave = Object.entries(rows).map(([campus, values]) => ({
            campus,
            programs_number: parseFloat(values[0]) || null,
            programs_percentage: parseFloat(values[1]) || null,
            faculty_number: parseFloat(values[2]) || null,
            faculty_percentage: parseFloat(values[3]) || null,
            average_percentage: parseFloat(values[4]) || null,
            persons_trained_target: parseFloat(values[5]) || null,
            persons_trained_weighted_accomplishment: parseFloat(values[6]) || null,
            persons_trained_variance: parseFloat(values[7]) || null,
            partnerships_target: parseFloat(values[8]) || null,
            partnerships_accomplishment: parseFloat(values[9]) || null,
            partnerships_variance: parseFloat(values[10]) || null,
            beneficiaries_target: parseFloat(values[11]) || null,
            beneficiaries_accomplishment: parseFloat(values[12]) || null,
            beneficiaries_variance: parseFloat(values[13]) || null,
            extension_programs_target: parseFloat(values[14]) || null,
            extension_programs_accomplishment: parseFloat(values[15]) || null,
            extension_programs_variance: parseFloat(values[16]) || null,
        }));

        try {
            await axios.post("http://127.0.0.1:8000/monitoring/college_performance/", dataToSave, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${token}`,
                },
            });
            alert("Data saved successfully!");
        } catch (error) {
            console.error("Error saving data:", error.response?.data || error.message);
            alert("Failed to save data! Please try again.");
        }
    };

    // Helper function for calculating totals
    const calculateTotal = (index, rowNames = Object.keys(rows)) => {
        return rowNames.reduce((sum, rowName) => {
            const value = parseFloat(rows[rowName][index]) || 0;
            return sum + value;
        }, 0);
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
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h1 className="mb-5 text-2xl font-medium">College / Campus Performance</h1>
                        <div className="overflow-x-auto bg-gray-100">
                            <table className="w-full text-sm text-center border-collapse table-auto">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="px-4 py-2">Campus</th>
                                        {[...Array(17).keys()].map((col) => (
                                            <th key={col} className="px-4 py-2">
                                                Column {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(rows).map(([rowName, values]) => (
                                        <tr key={rowName}>
                                            <td className="px-4 py-2">{rowName}</td>
                                            {values.map((value, index) => (
                                                <td key={index} className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) =>
                                                            handleInputChange(rowName, index, e.target.value)
                                                        }
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-bold bg-gray-200">
                                        <td>Total</td>
                                        {[...Array(17).keys()].map((col) => (
                                            <td key={col} className="px-4 py-2">
                                                {calculateTotal(col)}
                                            </td>
                                        ))}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 text-white bg-blue-500 rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EStaffPREXC;
