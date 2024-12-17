import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import ProjLeadSidebar from '../../components/ProjLeadSideBar';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

const AttendanceReport = () => {
    const navigate = useNavigate();
    const { templateId } = useParams();
    const { projectID } = useParams();
    const [loading, setLoading] = useState(true);
    const [projectDetails, setProjectDetails] = useState(null);
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
        includeSubmittedAt: true
    });

    const handleViewClick = (path) => {
        navigate(path.replace(":projectID", projectID));
    };


    // Fetch project details and submissions
    useEffect(() => {
        if (!projectID) {
            console.error("Project ID is undefined.");
            return;
        }

        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("User not logged in. Please log in again.");
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/monitoring/projects/${projectID}/details/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setProjectDetails(data.projectDetails);
                } else {
                    console.error("Failed to fetch project details.");
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectID, navigate]);
    

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        const fetchTemplateDetailsAndRecords = async () => {
            try {
                const templateResponse = await axios.get(`http://127.0.0.1:8000/monitoring/attendance_templates/${templateId}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setTemplateName(templateResponse.data.templateName);
                setTemplateAttributes({
                    includeAttendeeName: templateResponse.data.include_attendee_name,
                    includeGender: templateResponse.data.include_gender,
                    includeCollege: templateResponse.data.include_college,
                    includeDepartment: templateResponse.data.include_department,
                    includeYearSection: templateResponse.data.include_year_section,
                    includeAgencyOffice: templateResponse.data.include_agency_office,
                    includeContactNumber: templateResponse.data.include_contact_number,
                    includeSubmittedAt: true
                });

                const attendanceResponse = await axios.get(`http://127.0.0.1:8000/monitoring/attendance_records/template/${templateId}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setAttendanceRecords(attendanceResponse.data);
            } catch ( error ) {
                console.error('Error fetching data', error);
                alert('Failed to fetch template or attendance records.');
            }
        };

        fetchTemplateDetailsAndRecords();
    }, [navigate, templateId]);

    const downloadPdf = () => {
        // Calculate if landscape mode is needed based on the number of columns
        const columnsCount = [
            'No.',
            templateAttributes.includeAttendeeName ? "Attendee Name" : null,
            templateAttributes.includeGender ? "Gender" : null,
            templateAttributes.includeCollege ? "College" : null,
            templateAttributes.includeDepartment ? "Department" : null,
            templateAttributes.includeYearSection ? "Year/Section" : null,
            templateAttributes.includeAgencyOffice ? "Agency/Office" : null,
            templateAttributes.includeContactNumber ? "Contact Number" : null,
            templateAttributes.includeSubmittedAt ? "Submitted At" : null
        ].filter(Boolean).length;
    
        // Assume more than 5 columns may need landscape mode for better visibility
        const orientation = columnsCount > 4 ? 'landscape' : 'portrait';
    
        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: 'a4'
        });
    
        doc.setFontSize(16);
        doc.text('Attendance Records', 14, 20);
        doc.text(`Template: ${templateName}`, 14, 30);
    
        const headers = [
            'No.',
            ...(templateAttributes.includeAttendeeName ? ["Attendee Name"] : []),
            ...(templateAttributes.includeGender ? ["Gender"] : []),
            ...(templateAttributes.includeCollege ? ["College"] : []),
            ...(templateAttributes.includeDepartment ? ["Department"] : []),
            ...(templateAttributes.includeYearSection ? ["Year/Section"] : []),
            ...(templateAttributes.includeAgencyOffice ? ["Agency/Office"] : []),
            ...(templateAttributes.includeContactNumber ? ["Contact Number"] : []),
            ...(templateAttributes.includeSubmittedAt ? ["Submitted At"] : [])
        ];
    
        let y = 40;
        doc.setFontSize(12);
        headers.forEach((header, index) => {
            doc.text(header, 14 + index * 40, y);
        });
    
        y += 10;
        attendanceRecords.forEach((record, index) => {
            let x = 14;
            doc.text(String(index + 1), x, y); // Numbering
            x += 40;
            if (templateAttributes.includeAttendeeName) { doc.text(record.attendee_name, x, y); x += 40; }
            if (templateAttributes.includeGender) { doc.text(record.gender, x, y); x += 40; }
            if (templateAttributes.includeCollege) { doc.text(record.college, x, y); x += 40; }
            if (templateAttributes.includeDepartment) { doc.text(record.department, x, y); x += 40; }
            if (templateAttributes.includeYearSection) { doc.text(record.year_section, x, y); x += 40; }
            if (templateAttributes.includeAgencyOffice) { doc.text(record.agency_office, x, y); x += 40; }
            if (templateAttributes.includeContactNumber) { doc.text(record.contact_number, x, y); x += 40; }
            if (templateAttributes.includeSubmittedAt) { doc.text(new Date(record.submitted_at).toLocaleString(), x, y); x += 40; }
            y += 10;
        });
    
        doc.save('attendance-record.pdf');
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
                        <button className='mr-2' onClick={() => handleViewClick('/projlead/project/:projectID/daily-attendance')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-semibold">Attendance Records for {templateName}</h1>
                        <button
                            onClick={downloadPdf}
                            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm mt-3 flex items-center"
                        >
                            <FaFilePdf className="mr-2" />Download PDF
                        </button>
                    </div>
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                        <table className="w-full text-m text-left text-black-500 dark:text-black-400">
                            <thead className="text-xs text-gray-700 uppercase bg-white">
                                <tr>
                                    <th scope="col" className="py-3 px-6">No.</th>
                                    {templateAttributes.includeAttendeeName && <th scope="col" className="py-3 px-6">Attendee Name</th>}
                                    {templateAttributes.includeGender && <th scope="col" className="py-3 px-6">Gender</th>}
                                    {templateAttributes.includeCollege && <th scope="col" className="py-3 px-6">College</th>}
                                    {templateAttributes.includeDepartment && <th scope="col" className="py-3 px-6">Department</th>}
                                    {templateAttributes.includeYearSection && <th scope="col" className="py-3 px-6">Year/Section</th>}
                                    {templateAttributes.includeAgencyOffice && <th scope="col" className="py-3 px-6">Agency/Office</th>}
                                    {templateAttributes.includeContactNumber && <th scope="col" className="py-3 px-6">Contact Number</th>}
                                    {templateAttributes.includeSubmittedAt && <th scope="col" className="py-3 px-6">Submitted At</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {attendanceRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">No records found.</td>
                                    </tr>
                                ) : (
                                    attendanceRecords.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">{index + 1}</td>
                                            {templateAttributes.includeAttendeeName && <td className="py-4 px-6">{record.attendee_name}</td>}
                                            {templateAttributes.includeGender && <td className="py-4 px-6">{record.gender}</td>}
                                            {templateAttributes.includeCollege && <td className="py-4 px-6">{record.college}</td>}
                                            {templateAttributes.includeDepartment && <td className="py-4 px-6">{record.department}</td>}
                                            {templateAttributes.includeYearSection && <td className="py-4 px-6">{record.year_section}</td>}
                                            {templateAttributes.includeAgencyOffice && <td className="py-4 px-6">{record.agency_office}</td>}
                                            {templateAttributes.includeContactNumber && <td className="py-4 px-6">{record.contact_number}</td>}
                                            {templateAttributes.includeSubmittedAt && <td className="py-4 px-6">{new Date(record.submitted_at).toLocaleString()}</td>}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
