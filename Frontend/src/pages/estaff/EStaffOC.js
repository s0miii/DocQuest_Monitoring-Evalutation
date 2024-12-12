import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffOC = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

    const [data, setData] = useState([
        {
        moa: "Institute of Integrated Electrical Engineers",
        program: "Bigay Liwanag",
        fromDate: "01/01/2024",
        toDate: "03/01/2024",
        campus: "CEA",
        remarks: "",
        },
        {
        moa: "ANDAM HIGALA, INC.",
        program: "empower HER: a community empowering training",
        fromDate: "03/14/2024",
        toDate: "03/16/2024",
        campus: "CEA",
        remarks: "",
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
                    <h1 className="mb-5 text-2xl font-medium">Extension Program Oc  </h1>
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
                                            1) Training program &nbsp; 2) Attendance sheets &nbsp; 3) Reports / other documentation &nbsp; 4) Accomplished satisfaction survey samples
                                        </td>
                                    </tr>

                                    {/* Main Header Row */}
                                    <tr className="text-gray-900 bg-green-200">
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400"></th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400">Memorandum of Agreements</th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400">Extension Program/Activities</th>
                                        <th colSpan="2" className="px-4 py-2 border border-gray-400">Date Conducted</th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400">Campus/College</th>
                                        <th rowSpan="2" className="px-4 py-2 border border-gray-400">Remarks/Link</th>
                                    </tr>

                                    {/* Subheader Row */}
                                    <tr className="text-gray-900 bg-green-200">
                                        <th className="px-4 py-2 border border-gray-400">From (mm/dd/yyyy)</th>
                                        <th className="px-4 py-2 border border-gray-400">To (mm/dd/yyyy)</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="text-gray-800">
                                    {data.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-300">
                                            <td className="px-4 py-2 border border-gray-400">{index + 1}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.moa}</td>
                                            <td className="px-4 py-2 border border-gray-400">{row.program}</td>
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

export default EStaffOC;
