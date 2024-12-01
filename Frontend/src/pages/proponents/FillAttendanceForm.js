import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FillAttendanceForm = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/monitoring/attendance/fill/${token}/`);
                setTemplate(response.data);
                setLoading(false);
            } catch (err) {
                setError('Invalid or expired link.');
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://127.0.0.1:8000/monitoring/attendance/fill/${token}/`, formData);
            alert('Attendance record submitted successfully!');
            navigate('/');
        } catch (err) {
            console.error('Error submitting attendance record', err);
            alert('Failed to submit attendance record. Please check your input.');
        }
    };

    if (loading) {
        return <p className="text-center text-gray-600">Loading template...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    {template.templateName}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {template.fields.include_attendee_name && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Attendee Name</label>
                            <input
                                type="text"
                                name="attendee_name"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_gender && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Gender</label>
                            <select
                                name="gender"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    )}
                    {template.fields.include_college && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">College</label>
                            <input
                                type="text"
                                name="college"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter your college name"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_department && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Department</label>
                            <input
                                type="text"
                                name="department"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter your department"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_year_section && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Year/Section</label>
                            <input
                                type="text"
                                name="year_section"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter your year and section"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_agency_office && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Agency/Office</label>
                            <input
                                type="text"
                                name="agency_office"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter your agency or office"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_contact_number && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Contact Number</label>
                            <input
                                type="text"
                                name="contact_number"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter your contact number"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                    >
                        Submit Attendance
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FillAttendanceForm;
