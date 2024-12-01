import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FillAttendanceForm = () => {
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null); // Template details
    const [formData, setFormData] = useState({}); // Form data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch the template details using the token
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

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Submit the attendance form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://127.0.0.1:8000/monitoring/attendance/fill/${token}/`, formData);
            alert('Attendance record submitted successfully!');
            navigate('/'); // Redirect to home or success page
        } catch (err) {
            console.error('Error submitting attendance record', err);
            alert('Failed to submit attendance record. Please check your input.');
        }
    };

    if (loading) {
        return <p>Loading template...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                <h1 className="text-xl font-semibold mb-4">{template.templateName}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {template.fields.include_attendee_name && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Attendee Name</label>
                            <input
                                type="text"
                                name="attendee_name"
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded-lg p-3 mt-1"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_gender && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                name="gender"
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded-lg p-3 mt-1"
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
                            <label className="block text-sm font-medium text-gray-700">College</label>
                            <input
                                type="text"
                                name="college"
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded-lg p-3 mt-1"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_department && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <input
                                type="text"
                                name="department"
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded-lg p-3 mt-1"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_year_section && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year/Section</label>
                            <input
                                type="text"
                                name="year_section"
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded-lg p-3 mt-1"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_agency_office && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Agency/Office</label>
                            <input
                                type="text"
                                name="agency_office"
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded-lg p-3 mt-1"
                                required
                            />
                        </div>
                    )}
                    {template.fields.include_contact_number && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                name="contact_number"
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded-lg p-3 mt-1"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FillAttendanceForm;
