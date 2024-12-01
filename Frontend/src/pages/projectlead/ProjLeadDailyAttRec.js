import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../../components/Topbar';
import ProjLeadSidebar from '../../components/ProjLeadSideBar';
import { FaArrowLeft } from 'react-icons/fa';

const ProjLeadDailyAttRec = () => {
    const navigate = useNavigate();
    const [templateName, setTemplateName] = useState('');
    const [includeAttendeeName, setIncludeAttendeeName] = useState(true);
    const [includeGender, setIncludeGender] = useState(false);
    const [includeCollege, setIncludeCollege] = useState(false);
    const [includeDepartment, setIncludeDepartment] = useState(false);
    const [includeYearSection, setIncludeYearSection] = useState(false);
    const [includeAgencyOffice, setIncludeAgencyOffice] = useState(false);
    const [includeContactNumber, setIncludeContactNumber] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');
    const [templates, setTemplates] = useState([]);

    // Reference to the "Generated Attendance Links" section
    const linksSectionRef = useRef(null);

    // Fetch templates on component mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/monitoring/attendance_templates/', {
                    headers: { 'Authorization': 'Token 547dca520cf2940cd3cada1bf5208411a27d3ce5' },
                });
                setTemplates(response.data);
            } catch (error) {
                console.error('Error fetching templates', error);
                alert('Failed to fetch templates.');
            }
        };
        fetchTemplates();
    }, []);

    const handleCreateTemplate = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/monitoring/attendance_templates/',
                {
                    project: 1,
                    templateName,
                    include_attendee_name: includeAttendeeName,
                    include_gender: includeGender,
                    include_college: includeCollege,
                    include_department: includeDepartment,
                    include_year_section: includeYearSection,
                    include_agency_office: includeAgencyOffice,
                    include_contact_number: includeContactNumber,
                    expiration_date: expirationDate,
                },
                {
                    headers: { 'Authorization': 'Token 547dca520cf2940cd3cada1bf5208411a27d3ce5' },
                }
            );

            const newTemplate = response.data;
            setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
            alert(`Attendance Template Created! Share this link: ${newTemplate.sharable_link}`);

            // Scroll to "Generated Attendance Links" section after creation
            if (linksSectionRef.current) {
                linksSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error creating attendance template', error);
            alert('Failed to create attendance template.');
        }
    };

    const handleCopyLink = link => {
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Error copying link: ', err);
            alert('Failed to copy link.');
        });
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
                        <button className='mr-2' onClick={() => navigate('/projlead/proj/req')}>
                            <FaArrowLeft />
                        </button>
                        <h1 className='text-2xl font-semibold'>Daily Attendance Record/List of Participants</h1>
                    </div>

                    {/* Project Details Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-center mb-4">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tesda Vocational</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Tabasan, Wynoah Louis</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">College/Campus</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">CEA</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">May 2024</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Partner Agency</label>
                                <p className="bg-gray-100 rounded-lg p-3 mt-1">Placeholder Inc.</p>
                            </div>
                        </div>
                    </div>

                    {/* Generated Attendance Links Section */}
                    <div ref={linksSectionRef} className='bg-white shadow-lg rounded-lg p-6 mb-6'>
                        <h2 className='text-xl font-semibold text-center mb-4'>Generated Attendance Links</h2>
                        <table className='min-w-full table-auto border-collapse'>
                            <thead>
                                <tr className='border-b'>
                                    <th className='p-2 text-left'>Template Name</th>
                                    <th className='p-2 text-left'>Link</th>
                                    <th className='p-2 text-left'>Date Created</th>
                                    <th className='p-2 text-left'>Expiration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((template, index) => (
                                    <tr key={index} className='border-b'>
                                        <td className='p-2'>{template.templateName}</td>
                                        <td className='p-2'>
                                            <button onClick={() => handleCopyLink(template.sharable_link)} className='text-blue-500'>
                                                Copy Link
                                            </button>
                                        </td>
                                        <td className='p-2'>{new Date(template.created_at).toLocaleDateString()}</td>
                                        <td className='p-2'>{template.expiration_date || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Template Creation Section */}
                    <div className='bg-white shadow-lg rounded-lg p-6 mb-6'>
                        <h2 className='text-xl font-semibold text-center mb-4'>Create New Attendance Template</h2>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Template Name</label>
                                <input
                                    type='text'
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className='bg-gray-100 rounded-lg p-3 mt-1 w-full'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Expiration Date</label>
                                <input
                                    type='date'
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className='bg-gray-100 rounded-lg p-3 mt-1 w-full'
                                />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={includeAttendeeName}
                                    onChange={() => setIncludeAttendeeName(!includeAttendeeName)}
                                />
                                <label className='ml-2 text-sm text-gray-700'>Include Attendee Name</label>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={includeGender}
                                    onChange={() => setIncludeGender(!includeGender)}
                                />
                                <label className='ml-2 text-sm text-gray-700'>Include Gender</label>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={includeCollege}
                                    onChange={() => setIncludeCollege(!includeCollege)}
                                />
                                <label className='ml-2 text-sm text-gray-700'>Include College</label>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={includeDepartment}
                                    onChange={() => setIncludeDepartment(!includeDepartment)}
                                />
                                <label className='ml-2 text-sm text-gray-700'>Include Department</label>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={includeYearSection}
                                    onChange={() => setIncludeYearSection(!includeYearSection)}
                                />
                                <label className='ml-2 text-sm text-gray-700'>Include Year/Section</label>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={includeAgencyOffice}
                                    onChange={() => setIncludeAgencyOffice(!includeAgencyOffice)}
                                />
                                <label className='ml-2 text-sm text-gray-700'>Include Agency/Office</label>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={includeContactNumber}
                                    onChange={() => setIncludeContactNumber(!includeContactNumber)}
                                />
                                <label className='ml-2 text-sm text-gray-700'>Include Contact Number</label>
                            </div>
                        </div>
                        <div className='mt-6 text-center'>
                            <button onClick={handleCreateTemplate} className='px-6 py-2 text-white bg-blue-500 rounded-lg'>
                                Create Template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjLeadDailyAttRec;
