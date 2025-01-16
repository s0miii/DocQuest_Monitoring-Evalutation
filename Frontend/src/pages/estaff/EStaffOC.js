import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import EStaffSideBar from "../../components/EStaffSideBar";
import { FaArrowLeft } from "react-icons/fa";

const EStaffOC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Start with an empty table
  const [editIndex, setEditIndex] = useState(null); // Track the row being edited

  // deployed
  const API_URL = process.env.REACT_APP_API_URL;

  // local
  // const API_URL = 'http://127.0.0.1:8000/';
  // ${API_URL}

  useEffect(() => {
    const fetchOCData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/monitoring/extension_program_oc/", {
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data.");
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOCData();
  }, [navigate]);

  const handleAddRow = () => {
    const newRow = {
      memorandum_of_agreements: "",
      extension_program: "",
      from_date: "",
      to_date: "",
      campus: "",
      remarks: "",
      id: null,
    };
    setData([...data, newRow]);
    setEditIndex(data.length); // Set the last row to edit mode
  };

  const handleInputChange = (e, field, index) => {
    const newData = [...data];
    newData[index][field] = e.target.value;
    setData(newData);
  };

  const handleSaveClick = async (index) => {
    const entry = data[index];
    if (!entry.memorandum_of_agreements || !entry.extension_program || !entry.from_date || !entry.to_date) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not logged in. Please log in again.");
      navigate("/login");
      return;
    }

    const url = entry.id
      ? `${API_URL}/monitoring/extension_program_oc/${entry.id}/`
      : `${API_URL}/monitoring/extension_program_oc/`;
    const method = entry.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error saving data.");
      }

      const updatedEntry = await response.json();
      const updatedData = [...data];
      updatedData[index] = entry.id ? updatedEntry : { ...entry, id: updatedEntry.id };
      setData(updatedData);
      setEditIndex(null);
      alert("Save successful!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert(`Error saving data: ${error.message}`);
    }
  };

  const handleDeleteRow = async (index) => {
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

    try {
      await fetch(`${API_URL}/monitoring/extension_program_oc/${entry.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });
      setData(data.filter((_, i) => i !== index));
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
            <h1 className="mb-5 text-2xl font-medium">Extension Program OC</h1>
            <div className="w-full p-4 overflow-x-auto bg-gray-100">
              <div className="min-w-full bg-white border border-gray-300">
                <table className="min-w-full text-sm text-center border-collapse table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-400 w-[50px]">#</th>
                      <th className="px-4 py-2 border border-gray-400 max-w-[200px]">Memorandum of Agreements</th>
                      <th className="px-4 py-2 border border-gray-400 max-w-[200px]">Extension Program/Activities</th>
                      <th className="px-4 py-2 border border-gray-400 w-[100px]">From</th>
                      <th className="px-4 py-2 border border-gray-400 w-[100px]">To</th>
                      <th className="px-4 py-2 border border-gray-400 max-w-[150px]">Campus/College</th>
                      <th className="px-4 py-2 border border-gray-400 max-w-[150px]">Remarks/Link</th>
                      <th className="px-4 py-2 border border-gray-400 w-[150px]">Actions</th>
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
                                value={row.memorandum_of_agreements}
                                onChange={(e) => handleInputChange(e, "memorandum_of_agreements", index)}
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
                              {row.memorandum_of_agreements}
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

export default EStaffOC;
