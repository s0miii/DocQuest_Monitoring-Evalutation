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

    const [data, setData] = useState([
        {
            campus: "CEA",
            programNumbers: 1,
            programPercent: 1,
            facultyNumbers: 1,
            facultyPercent: 1,
            avgPercent: 1,
            personsTrainedTarget: 1,
            personsTrainedAccomp: 1,
            personsTrainedVar: 1,
            activePartnerTarget: 1,
            activePartnerAccomp: 1,
            activePartnerVar: 1,
            percentOfBenefTarget: 1,
            percentOfBenefAccomp: 1,
            percentOfBenefVar: 1,
            numOfExProgsTarget: 1,
            numOfExProgsAccomp: 1,
            numOfExProgsVar: 1,
        }
    ]); // Array to hold input values for each row


    // Handle input change for each row
    // const handleChange = (setData, inputs, index, e) => {
    //     const rawValue = e.target.value;

    //     // Allow only numeric values in the input
    //     if (/^[0-9]*\.?[0-9]*$/.test(rawValue)) {
    //     const updatedInputs = [...inputs];
    //     updatedInputs[index] = rawValue; // Update the specific input for the row
    //     setData(updatedInputs);
    //     }
    // };

    // Calculate the total sum of all inputs (convert to numbers)
    // const totalInput = [...dataMain, ...dataSat].reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
      
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
                            {data.map((row, index) => (
                            <tr key={index} className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">{row.campus}</td>
                                <td className="py-2 border-r border-gray-400 ">{row.programNumbers}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.programPercent}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.facultyNumbers}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.facultyPercent}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.avgPercent}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.personsTrainedTarget}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.personsTrainedAccomp}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.personsTrainedVar}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.activePartnerTarget}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.activePartnerAccomp}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.activePartnerVar}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.percentOfBenefTarget}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.percentOfBenefAccomp}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.percentOfBenefVar}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.numOfExProgsTarget}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.numOfExProgsAccomp}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.numOfExProgsVar}</td>
                            </tr>
                            ))}

                            <tr class="bg-yellow-100 border-b border-gray-300">
                                <td colspan="19" class="px-4 py-2 font-semibold text-left border-r border-gray-400">Satellite Campuses</td>
                            </tr>

                            {/* {dataSat.map((row, index) => {
                            // Calculate the percentage for this row, handling division by zero
                            // let percentage = 0;
                            // if (totalInput > 0) {
                            //     percentage = (parseFloat(inputValue) || 0) / totalInput * 100;
                            // }

                            return (
                            <tr key={index} className="bg-white border-b border-gray-300">
                                <td className="px-4 py-2 text-left border-r border-gray-400">{row.campus}</td>
                                <td className="py-2 border-r border-gray-400 ">{row.programNumbers}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.programPercent}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.facultyNumbers}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.facultyPercent}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.personsTrainedTarget}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.personsTrainedAccomp}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.personsTrainedVar}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.activePartnerTarget}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.activePartnerAccomp}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.activePartnerVar}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.percentOfBenefTarget}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.percentOfBenefAccomp}</td>
                                <td className="px-4 py-2 border-r border-gray-400">{row.percentOfBenefVar}</td>
                                <td className="px-4 py-2 border-r border-gray-400">0</td>
                                <td className="px-4 py-2 border-r border-gray-400">1</td>
                                <td className="px-4 py-2 border-r border-gray-400">1</td>
                                <td className="px-4 py-2">0</td>
                            </tr>
                            );
                            })} */}

                            {/* <!-- Example Row: Total --> */}
                            <tr class="bg-blue-800 text-white font-bold">
                                <td class="px-4 py-2 border-r border-gray-400">TOTAL</td>
                                <td class="px-4 py-2 border-r border-gray-400">50</td>
                                <td class="px-4 py-2 border-r border-gray-400">100%</td>
                                <td class="px-4 py-2 border-r border-gray-400">285</td>
                                <td class="px-4 py-2 border-r border-gray-400">100%</td>
                                <td class="px-4 py-2 border-r border-gray-400">100%</td>
                                <td class="px-4 py-2 border-r border-gray-400">8,500.00</td>
                                <td class="px-4 py-2 border-r border-gray-400">1,117.20</td>
                                <td class="px-4 py-2 border-r border-gray-400">7,208.33</td>
                                <td class="px-4 py-2 border-r border-gray-400">11</td>
                                <td class="px-4 py-2 border-r border-gray-400">10</td>
                                <td class="px-4 py-2 border-r border-gray-400">(1)</td>
                                <td class="px-4 py-2 border-r border-gray-400">99%</td>
                                <td class="px-4 py-2 border-r border-gray-400">99%</td>
                                <td class="px-4 py-2 border-r border-gray-400">0</td>
                                <td class="px-4 py-2 border-r border-gray-400">11</td>
                                <td class="px-4 py-2 border-r border-gray-400">3</td>
                                <td class="px-4 py-2">(8)</td>
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
