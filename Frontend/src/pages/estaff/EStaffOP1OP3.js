import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffOP1OP3 = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    const [data, setData] = useState([
        {
        campus: "",
        title: "",
        fromDate: "",
        toDate: "",
        weight: "",
        trainees: "",
        traineeWeight: "",
        traineeSurveyed: "",
        poor: "",
        fairlySatisfied: "",
        satisfied: "",
        verySatisfied: "",
        excellent: "",
        remarks: "",
        supportingDocs: ""
        },
      ]);

    const totalTrainees = data.reduce((sum, row) => sum + (row.trainees || 0), 0);
    const totalWeighted = data.reduce((sum, row) => sum + (row.traineeWeight || 0), 0);
    const totalSurveyed = data.reduce((sum, row) => sum + (row.traineeSurveyed || 0), 0);
    const totalP = data.reduce((sum, row) => sum + (row.poor || 0), 0);
    const totalF = data.reduce((sum, row) => sum + (row.fairlySatisfied || 0), 0);
    const totalS = data.reduce((sum, row) => sum + (row.satisfied || 0), 0);
    const totalVS = data.reduce((sum, row) => sum + (row.verySatisfied || 0), 0);
    const totalE = data.reduce((sum, row) => sum + (row.excellent || 0), 0);
    const totalQuality = totalSurveyed > 0 
    ? (totalP + totalF + totalS + totalVS + totalE) / totalSurveyed 
    : 0;

    // Handle Input Change
    const handleChange = (index, field, value) => {
        const updatedData = [...data];
        updatedData[index][field] = value;
        setData(updatedData);
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
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
                        <h1 className="mb-5 text-2xl font-medium">Extension Program OP1 and OP3</h1>
                        <div class="p-4 bg-gray-100">
                        {/* <!-- Scrollable Table Container --> */}
                        <div class="max-w-full overflow-x-auto border border-gray-300 bg-white">
                            <table class="min-w-[71.5vw] w-full text-sm text-center table-auto border-collapse">
                            {/* <!-- Header Section --> */}
                            <div className="max-w-[71.5vw] overflow-x-auto">
                            <thead>
                                {/* <!-- Top Row for Notes --> */}
                                <tr>
                                <th colspan="15" class="bg-blue-800 text-white font-bold px-4 py-3 text-base">
                                    MEANS OF VERIFICATION
                                </th>
                                </tr>
                                <tr>
                                <td colspan="9" class="bg-gray-200 text-gray-800 py-2 text-left px-4">
                                    1) Training program &nbsp; 2) Attendance sheets &nbsp; 3) Reports / other documentation &nbsp; 4) Accomplished satisfaction survey samples
                                </td>
                                </tr>

                                {/* <!-- Main Header Row --> */}
                                <tr class="bg-green-200 text-gray-900">
                                <th rowspan="2" class="border border-gray-400 px-4 py-2">Campus/College</th>
                                <th rowspan="2" class="border border-gray-400 px-4 py-2">Title of Training</th>
                                <th colspan="2" class="border border-gray-400 px-4 py-2">Inclusive Dates</th>
                                <th rowspan="2" class="border border-gray-400 px-4 py-2 relative">
                                Weight per Duration
                                <span className="relative inline-block ml-2 group">
                                <img
                                    src="/images/info.png"
                                    alt="Info Icon"
                                    className="inline-block w-4 h-4 mr-1 cursor-pointer"
                                />
                                {/* <!-- Tooltip --!> */}
                                <span className="absolute w-64 p-2 mb-1 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-800 rounded shadow-lg opacity-0 pointer-events-none left-1/2 bottom-full group-hover:opacity-100 group-hover:pointer-events-auto group-hover:z-50">
                                    Weight per Duration Explanation:
                                    <ul className="mt-1 ml-4 list-disc">
                                    <li>.5 = Less than 8 hours</li>
                                    <li>1 = 8 hours or 1 day</li>
                                    <li>1.25 = 2 days</li>
                                    <li>1.5 = 3 to 4 days</li>
                                    <li>2 = 5 days or more</li>
                                    </ul>
                                </span>
                                </span>
                                </th>
                                <th rowspan="2" class="border border-gray-400 px-4 py-2">Number of Trainees</th>
                                <th rowspan="2" class="border border-gray-400 px-4 py-2">Trainees Weighted by Length of Training</th>
                                <th rowspan="2" class="border border-gray-400 px-4 py-2">No. of Trainees Surveyed</th>
                                <th colspan="5" class="border border-gray-400 px-4 py-2">Quality and Relevance Rating</th>
                                <th rowspan="2" class="border border-gray-400 px-4 py-2">Remarks/Status</th>
                                <th rowspan="2" class="border border-gray-400 px-4 py-2">Supporting Documents</th>
                                </tr>

                                {/* <!-- Subheader Row --> */}
                                <tr class="bg-green-200 text-gray-900">
                                <th class="border border-gray-400 px-4 py-2">From (mm/dd/yyyy)</th>
                                <th class="border border-gray-400 px-4 py-2">To (mm/dd/yyyy)</th>
                                <th class="border border-gray-400 px-4 py-2">P</th>
                                <th class="border border-gray-400 px-4 py-2">F</th>
                                <th class="border border-gray-400 px-4 py-2">S</th>
                                <th class="border border-gray-400 px-4 py-2">VS</th>
                                <th class="border border-gray-400 px-4 py-2">E</th>
                                </tr>
                            </thead>

                            {/* <!-- Table Body --> */}
                            <tbody class="text-gray-800">

                            {/* <!-- Content Row--> */}
                            {data.map((row, index) => (
                            <tr key={index} class="border-b border-gray-300">
                                {/* <!-- Campus/College --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.campus}</td>
                                {/* <!-- Title of Training --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.title}</td>
                                {/* <!-- From Date --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.fromDate}</td>
                                {/* <!-- To Date --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.toDate}</td>
                                {/* <!-- Weight Per Duration --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.weight}</td>
                                {/* <!-- Number of Trainees --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.trainees}</td>
                                {/* <!-- Trainees Weighted by Length of Training --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.traineeWeight}</td>
                                {/* <!-- No. of Trainees Surveyed --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.traineeSurveyed}</td>
                                {/* <!-- Quality and Relevance Training (Top to bottom = P to E) --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.poor}</td>
                                <td class="border border-gray-400 px-4 py-2">{row.fairlySatisfied}</td>
                                <td class="border border-gray-400 px-4 py-2">{row.satisfied}</td>
                                <td class="border border-gray-400 px-4 py-2">{row.verySatisfied}</td>
                                <td class="border border-gray-400 px-4 py-2">{row.excellent}</td>
                                {/* <!-- Remarks/Status --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.remarks}</td>
                                {/* <!-- Supporting Documents --> */}
                                <td class="border border-gray-400 px-4 py-2">{row.supportingDocs}</td>
                            </tr>))}

                            {/* <!-- Total Row --> */}
                            <tr class="font-bold bg-gray-100">
                            <td rowspan="3" class="border border-gray-400 px-4 py-2"></td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2"></td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2"></td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2"></td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2">Total</td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2">{totalTrainees}</td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2">{totalWeighted}</td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2">{totalSurveyed}</td>
                            </tr>
                            <tr class="font-bold bg-gray-100">
                            <td class="border border-gray-400 px-4 py-2">{totalP}</td>
                            <td class="border border-gray-400 px-4 py-2">{totalF}</td>
                            <td class="border border-gray-400 px-4 py-2">{totalS}</td>
                            <td class="border border-gray-400 px-4 py-2">{totalVS}</td>
                            <td class="border border-gray-400 px-4 py-2">{totalE}</td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2"></td>
                            <td rowspan="3" class="border border-gray-400 px-4 py-2"></td>
                            </tr>
                            <tr class="font-bold bg-gray-100">
                            <td colspan="5" class="border border-gray-400 px-4 py-2">{totalQuality}</td>
                            </tr>
                            </tbody>
                            </div>
                            </table>
                        </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EStaffOP1OP3;
