import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffPREXC = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    // State to hold input values for JASAAN and CEA rows
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

    // State to hold the user input for the "TOTAL" row's index 5
    const [totalRowIndex5, setTotalRowIndex5] = useState(""); 

    // Function to handle input changes
    const handleInputChange = (rowName, index, value) => {
        setRows(prevRows => ({
            ...prevRows,
            [rowName]: prevRows[rowName].map((val, i) => (i === index ? value : val))
        }));
    };

    // Function to calculate totals for the "TOTAL" row
    const calculateTotal = (index, rowNames = ["CEA", "CITC", "CSM", "CSTE", "COT", "COM", "JASAAN", "PANAOAN", "OROQUIETA", "VILLANUEVA", "BALUBAL", "ALUBIJID"]) => {
        if (index === 1) {
            return rowNames
                .map(rowName => parseFloat(calculatePercentage(rowName, 0, 0)) || 0)
                .reduce((sum, val) => sum + val, 0)
                .toFixed(2) + "%";
        }
        if (index === 3) {
            return rowNames
                .map(rowName => parseFloat(calculatePercentage(rowName, 2, 2)) || 0)
                .reduce((sum, val) => sum + val, 0)
                .toFixed(2) + "%";
        }
        if (index === 4) {
            const totalPercentage = rowNames
                .map(rowName => {
                    const percentage1 = parseFloat(calculatePercentage(rowName, 0, 0)) || 0;
                    const percentage2 = parseFloat(calculatePercentage(rowName, 2, 2)) || 0;
                    return ((percentage1 + percentage2) / 2).toFixed(2);
                })
                .reduce((sum, val) => sum + parseFloat(val), 0); // Parse the strings back to numbers for summation
        return totalPercentage.toFixed(2) + "%";
        }
        if (index === 5) {
            return rowNames
                .map(rowName => parseFloat(calculateIndex5(rowName)) || 0) // Ensure numeric values
                .reduce((sum, val) => sum + val, 0) // Sum numeric results
                .toFixed(2); // Format the total to two decimal points
        }
        if (index === 7) {
            const total = rowNames
                .map(rowName => {
                    const index5 = parseFloat(calculateIndex5(rowName)) || 0;
                    const index6 = parseFloat(rows[rowName][6]) || 0;
                    return index5 - index6; // Perform the operation for each row
                })
                .reduce((sum, val) => sum + val, 0); // Sum the results
            return total.toFixed(2); // Format the total to two decimal places
        }
        if (index === 10) {
            return rowNames
                .map(rowName => {
                    const index9 = parseFloat(rows[rowName][9]) || 0;
                    const index8 = parseFloat(rows[rowName][8]) || 0;
                    return index9 - index8;
                })
                .reduce((sum, val) => sum + val, 0);
        }
        if (index >= 11 && index <= 13) {
            return ""; // Blank cells for indexes 11 to 13
        }
        return rowNames
            .map(rowName => parseFloat(rows[rowName][index]) || 0)
            .reduce((sum, val) => sum + val, 0);
    };

    const calculatePercentage = (rowName, numeratorIndex, totalIndex) => {
        const numerator = parseFloat(rows[rowName][numeratorIndex]) || 0;
        const denominator = calculateTotal(totalIndex); // Use TOTAL row value
        if (denominator === 0) return "0%";
        return ((numerator / denominator) * 100).toFixed(2) + "%";
    };

    const calculatePercentageDecimal = (rowName) => {
        // Get the numerator values for the required indices
        const numerator1 = parseFloat(rows[rowName][0]) || 0; // First numerator (index 0)
        const numerator2 = parseFloat(rows[rowName][2]) || 0; // Second numerator (index 2)
    
        // Get the denominator from the total (assumed to be index 0 for total row)
        const denominator = calculateTotal(0); // This will get the "TOTAL" row value (index 0)
    
        // If the denominator is 0, return 0 to avoid division by zero
        if (denominator === 0) return 0;
    
        // Calculate the sum of the two numerators and then divide by 2 (average)
        const averageNumerator = (numerator1 + numerator2) / 2;
    
        // Convert the average to a decimal by dividing by the denominator and return
        return (averageNumerator / denominator); // No need to multiply by 100, as we return a decimal
    };
    
    const calculateIndex5 = (rowName) => {
        const percentageDecimal = calculatePercentageDecimal(rowName); // Replace calculatePercentage for index 0
        const totalIndex5Value = parseFloat(totalRowIndex5) || 0; // Validate TOTAL row index 5
        if (!totalIndex5Value) return "0.00"; // Prevent invalid multiplication
        return (percentageDecimal * totalIndex5Value).toFixed(2);
    };
      
    return (
        <div className="flex min-h-screen bg-gray-200">
            <div className="fixed w-1/5 h-full">
                <EStaffSideBar />
            </div>
            <div className="flex-1 ml-[20%]">
                <Topbar />
                <div className="flex flex-col px-10 mt-14">
                    <button className="my-5" onClick={() => handleViewClick('')}>
                        <FaArrowLeft />
                    </button>
                    <div className="max-w-[76vw] w-full p-6 mb-6 bg-white rounded-lg shadow-lg ">
                        <h1 className="mb-5 text-2xl font-medium">College / Campus Performance</h1>
                        <div class="w-full p-4 bg-gray-100">
                        <table class="border border-gray-300 text-sm text-center table-auto">
                            {/* <!-- Title Section --> */}
                            <thead>
                            <tr class="bg-blue-800 text-white">
                                <th colspan="15" class="px-4 py-3 text-center font-bold text-base">
                                PREXC: TECHNICAL ADVISORY EXTENSION PROGRAM
                                </th>
                            </tr>
                            <tr class="bg-gray-200 text-gray-800">
                                <th colspan="15" class="px-4 py-2 text-center">
                                SUMMARY OF ACCOMPLISHMENT AS OF APRIL 2024
                                </th>
                            </tr>
                            </thead>

                            {/* <!-- Table Header --> */}
                            <div className="max-w-[71.5vw] overflow-x-auto">
                            <thead>
                            <tr class="bg-gray-300 text-gray-800 border-b border-gray-400">
                                <th rowspan="2" class="px-4 py-2 border-r border-gray-400">COLLEGES/ CLUSTERED CAMPUSES</th>
                                <th colspan="2" class="px-4 py-2 border-r border-gray-400">Programs (vertically articulated programs counted as 1)</th>
                                <th colspan="2" class="px-4 py-2 border-r border-gray-400">No. of faculty with plantilla</th>
                                <th rowspan="2" class="px-4 py-2 border-r border-gray-400">Average Percentage (Programs & Faculty)</th>
                                <th colspan="3" class="px-4 py-2 border-r border-gray-400">Persons trained weighted by the length of training</th>
                                <th colspan="3" class="px-4 py-2 border-r border-gray-400">Number of Active Partnerships as a result of extension activities</th>
                                <th colspan="3" class="px-4 py-2 border-r border-gray-400">Percent of beneficiaries who rated the training course as satisfactory or higher</th>
                                <th colspan="3" class="px-4 py-2">Number of extension programs organized and supported consistent with the SUC's mandated and priority programs</th>
                            </tr>
                            <tr class="bg-gray-300 text-gray-800 border-b border-gray-400">
                                {/* <!-- Subheaders --> */}
                                <th class="px-4 py-2 border-r border-gray-400">Number</th>
                                <th class="px-4 py-2 border-r border-gray-400">%</th>
                                <th class="px-4 py-2 border-r border-gray-400">Number</th>
                                <th class="px-4 py-2 border-r border-gray-400">%</th>
                                <th class="px-4 py-2 border-r border-gray-400">Target</th>
                                <th class="px-4 py-2 border-r border-gray-400">Weighted Accomplishment</th>
                                <th class="px-4 py-2 border-r border-gray-400">Variance</th>
                                <th class="px-4 py-2 border-r border-gray-400">Target</th>
                                <th class="px-4 py-2 border-r border-gray-400">Accomplishment</th>
                                <th class="px-4 py-2 border-r border-gray-400">Variance</th>
                                <th class="px-4 py-2 border-r border-gray-400">Target</th>
                                <th class="px-4 py-2 border-r border-gray-400">Accomplishment</th>
                                <th class="px-4 py-2 border-r border-gray-400">Variance</th>
                                <th class="px-4 py-2 border-r border-gray-400">Target</th>
                                <th class="px-4 py-2 border-r border-gray-400">Accomplishment</th>
                                <th class="px-4 py-2">Variance</th>
                            </tr>
                            </thead>

                            {/* <!-- Table Body --> */}
                            <tbody>
                            {/* <!-- Example Row: Cagayan de Oro Campus --> */}
                            <tr class="bg-yellow-100 border-b border-gray-300">
                                <td colspan="19" class="px-4 py-2 font-semibold text-left border-r border-gray-400">Cagayan de Oro Campus</td>
                            </tr>

                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">CEA</td>
                                {rows.CEA.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("CEA", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("CEA", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("CEA", 0, 0)) || 0) + (parseFloat(calculatePercentage("CEA", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("CEA")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("CEA")) || 0) - (parseFloat(rows.CEA[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("CEA", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">CITC</td>
                                {rows.CITC.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("CITC", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("CITC", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("CITC", 0, 0)) || 0) + (parseFloat(calculatePercentage("CITC", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("CITC")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("CITC")) || 0) - (parseFloat(rows.CITC[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("CITC", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">CSM</td>
                                {rows.CSM.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("CSM", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("CSM", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("CSM", 0, 0)) || 0) + (parseFloat(calculatePercentage("CSM", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("CSM")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("CSM")) || 0) - (parseFloat(rows.CSM[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("CSM", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">CSTE</td>
                                {rows.CSTE.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("CSTE", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("CSTE", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("CSTE", 0, 0)) || 0) + (parseFloat(calculatePercentage("CSTE", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("CSTE")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("CSTE")) || 0) - (parseFloat(rows.CSTE[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("CSTE", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">COT</td>
                                {rows.COT.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("COT", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("COT", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("COT", 0, 0)) || 0) + (parseFloat(calculatePercentage("COT", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("COT")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("COT")) || 0) - (parseFloat(rows.COT[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("COT", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">COM</td>
                                {rows.COM.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("COM", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("COM", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("COM", 0, 0)) || 0) + (parseFloat(calculatePercentage("COM", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("COM")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("COM")) || 0) - (parseFloat(rows.COM[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("COM", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>

                            <tr className="bg-blue-200 ">
                                <td className="px-4 py-2 text-left border-r border-gray-400">SUBTOTAL</td>
                                {Array.from({ length: 17 }).map((_, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {calculateTotal(index, ["CEA", "CITC", "CSM", "CSTE", "COT", "COM"])}
                                    </td>
                                ))}
                            </tr>

                            <tr class="bg-yellow-100 border-b border-gray-300">
                                <td colspan="19" class="px-4 py-2 font-semibold text-left border-r border-gray-400">Satellite Campuses</td>
                            </tr>

                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">JASAAN</td>
                                {rows.JASAAN.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("JASAAN", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("JASAAN", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("JASAAN", 0, 0)) || 0) + (parseFloat(calculatePercentage("JASAAN", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("JASAAN")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("JASAAN")) || 0) - (parseFloat(rows.JASAAN[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("JASAAN", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">PANAOAN</td>
                                {rows.PANAOAN.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("PANAOAN", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("PANAOAN", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("PANAOAN", 0, 0)) || 0) + (parseFloat(calculatePercentage("PANAOAN", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("PANAOAN")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("PANAOAN")) || 0) - (parseFloat(rows.PANAOAN[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("PANAOAN", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">OROQUIETA</td>
                                {rows.OROQUIETA.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("OROQUIETA", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("OROQUIETA", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("OROQUIETA", 0, 0)) || 0) + (parseFloat(calculatePercentage("OROQUIETA", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("OROQUIETA")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("OROQUIETA")) || 0) - (parseFloat(rows.OROQUIETA[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("OROQUIETA", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">VILLANUEVA</td>
                                {rows.VILLANUEVA.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("VILLANUEVA", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("VILLANUEVA", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("VILLANUEVA", 0, 0)) || 0) + (parseFloat(calculatePercentage("VILLANUEVA", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("VILLANUEVA")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("VILLANUEVA")) || 0) - (parseFloat(rows.VILLANUEVA[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("VILLANUEVA", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">BALUBAL</td>
                                {rows.BALUBAL.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("BALUBAL", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("BALUBAL", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("BALUBAL", 0, 0)) || 0) + (parseFloat(calculatePercentage("BALUBAL", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("BALUBAL")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("BALUBAL")) || 0) - (parseFloat(rows.BALUBAL[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("BALUBAL", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">ALUBIJID</td>
                                {rows.ALUBIJID.map((value, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {index === 1 ? (
                                            <span>
                                                {calculatePercentage("ALUBIJID", 0, 0)}
                                            </span>
                                        ) : index === 3 ? (
                                            <span>
                                                {calculatePercentage("ALUBIJID", 2, 2)}
                                            </span>
                                        ) : index === 4 ? (
                                            // Calculate index 4 as the average of index 1 and index 3
                                            <span>
                                                {(
                                                    (parseFloat(calculatePercentage("ALUBIJID", 0, 0)) || 0) + (parseFloat(calculatePercentage("ALUBIJID", 2, 2)) || 0)
                                                ) / 2 + "%"}
                                            </span>
                                        ) : index === 5 ? (
                                            <span>{calculateIndex5("ALUBIJID")}</span>
                                        ) : index === 7 ? (
                                            <span>
                                                {(
                                                    (parseFloat(calculateIndex5("ALUBIJID")) || 0) - (parseFloat(rows.ALUBIJID[6]) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        ) : index === 10 ? (
                                            <span></span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                                value={value}
                                                onChange={(e) =>
                                                    handleInputChange("ALUBIJID", index, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>

                            <tr className="bg-blue-200 ">
                                <td className="px-4 py-2 text-left border-r border-gray-400">SUBTOTAL</td>
                                {Array.from({ length: 17 }).map((_, index) => (
                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                        {calculateTotal(index, ["JASAAN", "PANAOAN", "OROQUIETA", "VILLANUEVA", "BALUBAL", "ALUBIJID"])}
                                    </td>
                                ))}
                            </tr>

                            {/* <!-- Example Row: Total --> */}
                            <tr className="font-bold text-white bg-blue-800">
                                                <td className="px-4 py-2 border-r border-gray-400">TOTAL</td>
                                                {Array.from({ length: 17 }).map((_, index) => (
                                                    <td key={index} className="px-4 py-2 border-r border-gray-400">
                                                        {index === 5 ? (
                                                            // User input for TOTAL row's index 5
                                                            <input
                                                                type="text"
                                                                value={totalRowIndex5}
                                                                onChange={(e) => setTotalRowIndex5(e.target.value)}
                                                                className="w-full px-2 py-1 text-center bg-blue-800 border rounded"
                                                                placeholder=""
                                                            />
                                                        ) : (calculateTotal(index))}
                                                    </td>
                                                ))}
                                            </tr>
                            </tbody>
                            </div>
                        </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EStaffPREXC;

{/* <tr className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">CEA</td>
                                <td className="py-2 border-r border-gray-400 "></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                                <td className="px-4 py-2 border-r border-gray-400"></td>
                            </tr> */}