import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../../components/Topbar';
import ProjLeadSidebar from '../../components/ProjLeadSideBar';
import { FaArrowLeft, FaCopy } from 'react-icons/fa';

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
                    <div ref={linksSectionRef} className='bg-white shadow-md rounded-lg p-6 mb-6'>
                        <h2 className='text-2xl font-semibold text-center mb-4'>Generated Attendance Links</h2>
                        <div className='overflow-x-auto'>
                            <table className='w-full border border-gray-200'>
                                <thead>
                                    <tr className='bg-gray-50'>
                                        <th className='p-3 text-left text-gray-700 font-medium'>Template Name</th>
                                        <th className='p-3 text-left text-gray-700 font-medium'>Link</th>
                                        <th className='p-3 text-left text-gray-700 font-medium'>Date Created</th>
                                        <th className='p-3 text-left text-gray-700 font-medium'>Expiration Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templates.map((template, index) => (
                                        <tr key={index} className='border-t'>
                                            <td className='p-3 text-gray-600'>{template.templateName}</td>
                                            <td className='p-3'>
                                                <button onClick={() => handleCopyLink(template.sharable_link)} className='text-blue-500 flex items-center'>
                                                    <FaCopy className='mr-1' /> Copy Link
                                                </button>
                                            </td>
                                            <td className='p-3 text-gray-600'>{new Date(template.created_at).toLocaleDateString()}</td>
                                            <td className='p-3 text-gray-600'>{template.expiration_date || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Template Creation Section */}
                    <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
                        <h2 className='text-2xl font-semibold text-center mb-4'>Create New Attendance Template</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-600'>Template Name</label>
                                <input
                                    type='text'
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className='bg-gray-100 rounded-lg p-3 mt-1 w-full border focus:outline-none focus:ring-2 focus:ring-blue-400'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-600'>Expiration Date</label>
                                <input
                                    type='date'
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className='bg-gray-100 rounded-lg p-3 mt-1 w-full border focus:outline-none focus:ring-2 focus:ring-blue-400'
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                            {[
                                { label: 'Include Attendee Name', state: includeAttendeeName, setState: setIncludeAttendeeName },
                                { label: 'Include Gender', state: includeGender, setState: setIncludeGender },
                                { label: 'Include College', state: includeCollege, setState: setIncludeCollege },
                                { label: 'Include Department', state: includeDepartment, setState: setIncludeDepartment },
                                { label: 'Include Year/Section', state: includeYearSection, setState: setIncludeYearSection },
                                { label: 'Include Agency/Office', state: includeAgencyOffice, setState: setIncludeAgencyOffice },
                                { label: 'Include Contact Number', state: includeContactNumber, setState: setIncludeContactNumber },
                            ].map((item, idx) => (
                                <div key={idx} className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        checked={item.state}
                                        onChange={() => item.setState(!item.state)}
                                        className='mr-2'
                                    />
                                    <label className='text-sm text-gray-700'>{item.label}</label>
                                </div>
                            ))}
                        </div>
                        <div className='mt-6 text-center'>
                            <button onClick={handleCreateTemplate} className='px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'>
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
