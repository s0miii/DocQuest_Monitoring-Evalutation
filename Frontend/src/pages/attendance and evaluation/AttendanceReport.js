import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import ProjLeadSidebar from '../../components/ProjLeadSideBar';
import { FaArrowLeft } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

const AttendanceReport = () => {
    const navigate = useNavigate();
    const { templateId } = useParams();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [templateName, setTemplateName] = useState('');
    const [templateAttributes, setTemplateAttributes] = useState({
        includeAttendeeName: true,
        includeGender: false,
        includeCollege: false,
        includeDepartment: false,
        includeYearSection: false,
        includeAgencyOffice: false,
        includeContactNumber: false,
    });

    // Fetch Template Details and Attendance Records
    useEffect(() => {
        const fetchTemplateDetailsAndRecords = async () => {
            try {
                // Fetch template details
                const templateResponse = await axios.get(`http://127.0.0.1:8000/monitoring/attendance_templates/${templateId}/`, {
                    headers: { 'Authorization': 'Token 547dca520cf2940cd3cada1bf5208411a27d3ce5' },
                });
                setTemplateName(templateResponse.data.templateName);

                // Store template attributes
                const templateAttributes = {
                    includeAttendeeName: templateResponse.data.include_attendee_name,
                    includeGender: templateResponse.data.include_gender,
                    includeCollege: templateResponse.data.include_college,
                    includeDepartment: templateResponse.data.include_department,
                    includeYearSection: templateResponse.data.include_year_section,
                    includeAgencyOffice: templateResponse.data.include_agency_office,
                    includeContactNumber: templateResponse.data.include_contact_number
                };
                setTemplateAttributes(templateAttributes);

                // Fetch attendance records
                const attendanceResponse = await axios.get(`http://127.0.0.1:8000/monitoring/attendance_records/template/${templateId}/`, {
                    headers: { 'Authorization': 'Token 547dca520cf2940cd3cada1bf5208411a27d3ce5' },
                });
                setAttendanceRecords(attendanceResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
                alert('Failed to fetch template or attendance records.');
            }
        };

        fetchTemplateDetailsAndRecords();
    }, [templateId]);

    // Function to generate and download the PDF
    const downloadPdf = () => {
        const doc = new jsPDF();

        // Set title
        doc.setFontSize(16);
        doc.text('Attendance Records', 14, 20);
        doc.text(`Template: ${templateName}`, 14, 30);

        // Set table header based on template attributes
        const headers = [];
        if (templateAttributes.includeAttendeeName) headers.push("Attendee Name");
        if (templateAttributes.includeGender) headers.push("Gender");
        if (templateAttributes.includeCollege) headers.push("College");
        if (templateAttributes.includeDepartment) headers.push("Department");
        if (templateAttributes.includeYearSection) headers.push("Year/Section");
        if (templateAttributes.includeAgencyOffice) headers.push("Agency/Office");
        if (templateAttributes.includeContactNumber) headers.push("Contact Number");

        const startY = 40;
        doc.setFontSize(12);
        let y = startY;

        // Draw header
        headers.forEach((header, index) => {
            doc.text(header, 14 + index * 40, y);
        });

        // Draw the data rows based on template attributes
        y += 10;
        attendanceRecords.forEach((record) => {
            let x = 14;
            if (templateAttributes.includeAttendeeName) {
                doc.text(record.attendee_name, x, y);
                x += 40;
            }
            if (templateAttributes.includeGender) {
                doc.text(record.gender, x, y);
                x += 40;
            }
            if (templateAttributes.includeCollege) {
                doc.text(record.college, x, y);
                x += 40;
            }
            if (templateAttributes.includeDepartment) {
                doc.text(record.department, x, y);
                x += 40;
            }
            if (templateAttributes.includeYearSection) {
                doc.text(record.year_section, x, y);
                x += 40;
            }
            if (templateAttributes.includeAgencyOffice) {
                doc.text(record.agency_office, x, y);
                x += 40;
            }
            if (templateAttributes.includeContactNumber) {
                doc.text(record.contact_number, x, y);
                x += 40;
            }
            y += 10;
        });

        // Save the PDF
        doc.save('attendance-report.pdf');
    };

    return (
        <div className='bg-gray-200 min-h-screen flex'>
            <div className='w-1/5 fixed h-full'>
                <ProjLeadSidebar />
            </div>
            <div className='flex-1 ml-[20%]'>
                <Topbar />
                <div className='flex flex-col mt-14 px-10'>
                    <div className='flex items-center mb-5'>
                        <button className='mr-2' onClick={() => navigate('/projlead/proj/req/daily-attendance')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Attendance Records for Template #{templateId}</h1>
                        <button
                            onClick={downloadPdf}
                            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-sm text-sm mt-3"
                        >
                            Download PDF
                        </button>
                    </div>
                    <table className="min-w-full bg-white shadow-lg">
                        <thead>
                            <tr>
                                {templateAttributes.includeAttendeeName && <th className="px-6 py-3 text-left">Attendee Name</th>}
                                {templateAttributes.includeGender && <th className="px-6 py-3 text-left">Gender</th>}
                                {templateAttributes.includeCollege && <th className="px-6 py-3 text-left">College</th>}
                                {templateAttributes.includeDepartment && <th className="px-6 py-3 text-left">Department</th>}
                                {templateAttributes.includeYearSection && <th className="px-6 py-3 text-left">Year/Section</th>}
                                {templateAttributes.includeAgencyOffice && <th className="px-6 py-3 text-left">Agency/Office</th>}
                                {templateAttributes.includeContactNumber && <th className="px-6 py-3 text-left">Contact Number</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No records found.</td>
                                </tr>
                            ) : (
                                attendanceRecords.map((record, index) => (
                                    <tr key={index}>
                                        {templateAttributes.includeAttendeeName && <td className="px-6 py-3">{record.attendee_name}</td>}
                                        {templateAttributes.includeGender && <td className="px-6 py-3">{record.gender}</td>}
                                        {templateAttributes.includeCollege && <td className="px-6 py-3">{record.college}</td>}
                                        {templateAttributes.includeDepartment && <td className="px-6 py-3">{record.department}</td>}
                                        {templateAttributes.includeYearSection && <td className="px-6 py-3">{record.year_section}</td>}
                                        {templateAttributes.includeAgencyOffice && <td className="px-6 py-3">{record.agency_office}</td>}
                                        {templateAttributes.includeContactNumber && <td className="px-6 py-3">{record.contact_number}</td>}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
