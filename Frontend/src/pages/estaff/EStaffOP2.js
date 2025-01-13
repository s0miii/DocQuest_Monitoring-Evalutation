import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffOP2 = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    const [data, setData] = useState([
        {
        academicProgram: "BSIT",
        extenstionProgram: "E-Monitor Advocacy and Community Outreach Program",
        fromDate: "02/29/2024",
        toDate: "02/29/2024",
        campus: "CITC",
        remarks: "Sustained for the last 15 years",
        },
        {
        academicProgram: "BTLED and BFPT",
        extenstionProgram: "Livelihood Skills Training on Meat Processing",
        fromDate: "05/24/2024",
        toDate: "05/24/2024",
        campus: "CITC",
        remarks: "Sustained for the last 15 years",
        },
      ]);

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
                    <h1 className="mb-5 text-2xl font-medium">Extension Program Op2  </h1>
                    <div className="p-4 bg-gray-100">
                        {/* Scrollable Table Container */}
                        <div className="max-w-full overflow-x-auto bg-white border border-gray-300">
                            <table className="min-w-[71.5vw] w-full text-sm text-center table-auto border-collapse">
                                {/* Header Section */}
                                <thead>
                                    {/* Top Row for Notes */}
                                    <tr>
                                        <th colSpan="15" className="px-4 py-3 text-base font-bold text-white bg-blue-800">
                                            MEANS OF VERIFICATION
                                        </th>
                                    </tr>
                                    <tr>
                                        <td colSpan="9" className="px-4 py-2 text-left text-gray-800 bg-gray-200">
                                            1) Extension reports describing the program framework and actual implementation &nbsp; 2) MOUs/MOAs
                                        </td>
                                    </tr>

                                    {/* Main Header Row */}
                                    <tr className="text-gray-900 bg-gray-300">
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400"></th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400">Mandated / Priority
                                        Programs</th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400"></th>
                                        <th colSpan="2" className="px-4 py-2 border border-gray-400">Inclusive Dates</th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400">Campus/College</th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400">Remarks/Link</th>
                                    </tr>

                                    {/* Subheader Row */}
                                    <tr className="text-gray-900 bg-gray-300">
                                        <th className="px-4 py-2 border border-gray-400">From (mm/dd/yyyy)</th>
                                        <th className="px-4 py-2 border border-gray-400">To (mm/dd/yyyy)</th>
                                    </tr>

                                </thead>

                                {/* Table Body */}
                                <tbody className="text-gray-800">
                                    {data.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-300">
                                            <td className="px-4 py-2 border border-gray-400">{index + 1}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.academicProgram}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.extenstionProgram}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.fromDate}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.toDate}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.campus}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                </div>
            </div>
        </div>
    );
};

export default EStaffOP2;
