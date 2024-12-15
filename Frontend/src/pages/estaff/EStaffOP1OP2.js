import React from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffOP1OP2 = () => {
    const navigate = useNavigate();

    const handleViewClick = (path) => {
        navigate(path);
    }

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
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-center">Campus/College</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Title of Training</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center" colSpan="2">Inclusive Dates</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Weight Per Duration</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">No. of Trainees</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Trainees Weighted by the Length of Training</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">No. of Trainees Surveyed</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center" colSpan="5">Quality and Relevance Rating</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Remarks/Status</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Supporting Documents</th>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">From</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">To</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">P</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">F</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">S</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">VS</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">E</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-center">CEA</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">Bigay Liwanag</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">1/1/2024</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">3/1/2024</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17.00</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">17</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center"></td>
                                        <td className="border border-gray-300 px-4 py-2 text-center"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EStaffOP1OP2;
