import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';

const EStaffOP2 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Start with an empty table
  const [editIndex, setEditIndex] = useState(null); // Track the row being edited

  // Fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/monitoring/extension_program_op2/");
        setData(response.data);  // Set the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle adding a new row
  const handleAddRow = () => {
    setData([
      ...data,
      {
        academicProgram: "",
        extensionProgram: "",
        fromDate: "",
        toDate: "",
        campus: "",
        remarks: "",
      },
    ]);
    setEditIndex(data.length); // Automatically set the new row to edit mode
  };

  // Handle input changes
  const handleInputChange = (e, field, index) => {
    const newData = [...data];
    newData[index][field] = e.target.value;
    setData(newData);
  };

  // Handle saving changes for a row (POST request)
const handleSaveClick = async (index) => {
    try {
      const rowData = data[index]; // Get the data for the current row
      const token = localStorage.getItem("auth_token"); // Get the token from localStorage
  
      // Send POST request with token authentication
      await axios.post(
        "http://127.0.0.1:8000/monitoring/extension_program_op2/",
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,  // Ensure the token is sent in the headers
          },
        }
      );
  
      // After saving, clear edit index and re-fetch data
      setEditIndex(null);
  
      const response = await axios.get("http://127.0.0.1:8000/monitoring/extension_program_op2/", {
        headers: {
          Authorization: `Token ${token}`,  // Send token to authenticate the GET request
        },
      });
  
      setData(response.data); // Re-fetch data after saving
    } catch (error) {
      console.error("Error saving data:", error);
      // Optionally, display a message to the user indicating an error
    }
  };
  
  // Handle deleting a row
  const handleDeleteRow = async (index) => {
    try {
      const rowId = data[index].id; // Get the row ID to delete

      // Send DELETE request to remove the row
      await axios.delete(
        `http://127.0.0.1:8000/monitoring/extension_program_op2/${rowId}/`,
        {}
      );

      // After deletion, remove the row from the data
      const newData = data.filter((_, rowIndex) => rowIndex !== index);
      setData(newData);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
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
              <div className="min-w-full bg-white border border-gray-300">
                <table className="min-w-full text-sm text-center border-collapse table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-400 w-[50px]">#</th>
                      <th className="px-4 py-2 border border-gray-400 max-w-[200px]">
                        Academic Program
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
                            <td className="px-4 py-2 border border-gray-400 max-w-[200px]">
                              <input
                                type="text"
                                value={row.academicProgram}
                                onChange={(e) => handleInputChange(e, "academicProgram", index)}
                                className="w-full px-2 py-1 truncate border border-gray-300"
                              />
                            </td>
                            <td className="px-4 py-2 border border-gray-400 max-w-[200px]">
                              <input
                                type="text"
                                value={row.extensionProgram}
                                onChange={(e) => handleInputChange(e, "extensionProgram", index)}
                                className="w-full px-2 py-1 truncate border border-gray-300"
                              />
                            </td>
                            <td className="px-4 py-2 border border-gray-400 w-[100px]">
                              <input
                                type="date"
                                value={row.fromDate}
                                onChange={(e) => handleInputChange(e, "fromDate", index)}
                                className="w-full px-2 py-1 border border-gray-300"
                              />
                            </td>
                            <td className="px-4 py-2 border border-gray-400 w-[100px]">
                              <input
                                type="date"
                                value={row.toDate}
                                onChange={(e) => handleInputChange(e, "toDate", index)}
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
                                onClick={() => handleSaveClick(index)}
                                className="px-4 py-1 text-white bg-green-500 rounded"
                              >
                                Save
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2 break-words border border-gray-400 max-w-[200px]">
                              {row.academicProgram}
                            </td>
                            <td className="px-4 py-2 break-words border border-gray-400 max-w-[200px]">
                              {row.extensionProgram}
                            </td>
                            <td className="px-4 py-2 border border-gray-400 w-[100px]">
                              {row.fromDate}
                            </td>
                            <td className="px-4 py-2 border border-gray-400 w-[100px]">
                              {row.toDate}
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
