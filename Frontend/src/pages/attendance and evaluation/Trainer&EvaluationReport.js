import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import ProjLeadSidebar from '../../components/ProjLeadSideBar';
import { FaArrowLeft, FaFilePdf} from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 

const TrainerProjectDetails = () => {
    const navigate = useNavigate();
    const { trainerID, projectID } = useParams();

    // Function to handle the redirection to EvaluationReport
    const viewEvaluationReport = () => {
        navigate(`/evaluations/${trainerID}/${projectID}`);
    };

    return (
        <div>
            <h1>Trainer Project Details</h1>
            <button onClick={viewEvaluationReport}>View Evaluation Report</button>
        </div>
    );
};

const EvaluationReport = () => {
    const { trainerID, projectID } = useParams();
    const [trainerName, setTrainerName] = useState('');
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    

    useEffect(() => {
        // Fetch Trainer's Name
        const fetchTrainerName = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/monitoring/trainers/${trainerID}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTrainerName(data.name);  // Assuming the response contains a 'name' field
            } else {
                alert("Failed to fetch trainer details");
            }
        };

        const fetchEvaluations = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not logged in. Please log in again.");
                navigate("/login");
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/monitoring/evaluations/?trainer=${trainerID}&project=${projectID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const enhancedData = data.map(item => ({
                    ...item,
                    average: calculateRowAverage(item)
                }));
                setEvaluations(enhancedData);
            } else {
                // Handle errors here, such as displaying a message
            }
            setLoading(false);
        };

        fetchTrainerName();
        fetchEvaluations();
    }, [trainerID, projectID]);

    // Calculate row average as a whole number
    const calculateRowAverage = (evaluation) => {
        const keys = [
            'relevance_of_topics', 'organizational_flow', 'learning_methods', 'technology_use', 'time_efficiency',
            'mastery_subject', 'preparedness', 'audience_participation', 'interest_level', 'handle_questions',
            'voice_personality', 'visual_aids', 'venue_assessment', 'timeliness', 'overall_management'
        ];

        const validValues = keys.map(key => evaluation[key]).filter(val => val !== null && val !== undefined);
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        return validValues.length > 0 ? Math.round(sum / validValues.length) : 'N/A';
    };

    // Function to generate PDF for the Evaluation Rating Table
    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape'  // Landscape orientation
        });
    
        // Set title and its position
        doc.setFontSize(16);
        doc.text('Evaluation Report', 14, 15);
    
        const headers = [
            'IDNO.', 'I.1', 'I.2', 'I.3', 'I.4', 'I.5', 'II.1', 'II.2', 'II.3', 'II.4', 'II.5', 'II.6', 'II.7', 'IV', 'V', 'VI', 'AVERAGE'
        ];
    
        const data = evaluations.map(evaluation => [
            evaluation.id,
            evaluation.relevance_of_topics,
            evaluation.organizational_flow,
            evaluation.learning_methods,
            evaluation.technology_use,
            evaluation.time_efficiency,
            evaluation.mastery_subject,
            evaluation.preparedness,
            evaluation.audience_participation,
            evaluation.interest_level,
            evaluation.handle_questions,
            evaluation.voice_personality,
            evaluation.visual_aids,
            evaluation.venue_assessment,
            evaluation.timeliness,
            evaluation.overall_management,
            evaluation.average
        ]);
    
        // Add table to the document
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 25,
            styles: {
                fontSize: 10,
                cellPadding: 2,
                align: 'center',
                cellWidth: 15
            },
            headStyles: {
                fillColor: [0, 42, 105], 
                textColor: 255,
                fontSize: 10,
                halign: 'center'
            },
            columnStyles: {
                16: { cellWidth: 24 }
            },
            theme: 'grid',
            margin: { horizontal: 10 },
            tableWidth: 'wrap'
        });
    
        // Save PDF with dynamic name based on the trainer's name or a default
        doc.save(`evaluation-report-${trainerName}.pdf`);
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

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
                        <h1 className="text-2xl font-semibold">
                            Evaluation Report for {trainerName || 'Trainer'}
                        </h1>
                        <button
                            onClick={generatePDF}
                            className="ml-auto bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-md text-sm mt-3 flex items-center"
                        >
                            <FaFilePdf className="mr-2" />Download PDF
                        </button>
                    </div>

                    {/* Evaluation Table with Border */}
                    <h2 className="text-lg font-bold text-center mt-1">I - VI. Training Evaluation Rating</h2>
                    <div className="overflow-x-auto mt-3 border border-black-300 shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-black-200">
                            <thead className="bg-blue-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                        IDNO.
                                    </th>
                                    {['I.1', 'I.2', 'I.3', 'I.4', 'I.5', 'II.1', 'II.2', 'II.3', 'II.4', 'II.5', 'II.6', 'II.7', 'IV', 'V', 'VI'].map((header) => (
                                        <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                        AVERAGE
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-black-200">
                                {evaluations.map((evaluation, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm font-medium text-black-900">{evaluation.id}</td>
                                        {['relevance_of_topics', 'organizational_flow', 'learning_methods', 'technology_use', 'time_efficiency', 'mastery_subject', 'preparedness', 'audience_participation', 'interest_level', 'handle_questions', 'voice_personality', 'visual_aids', 'venue_assessment', 'timeliness', 'overall_management'].map(key => (
                                            <td key={key} className="px-6 py-4 whitespace-normal break-words text-sm text-black-500">{evaluation[key]}</td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-black-500">{evaluation.average}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Feedback and Remarks Section */}
                    <h2 className="text-lg font-bold text-center mt-6">III. Feedback and Remarks</h2>
                    <div className="overflow-x-auto mt-3 mb-10 border border-black-300 shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-black-200">
                            <thead className="bg-blue-900 text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider" style={{ width: '5%' }}>
                                        IDNO.
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider" style={{ width: '25%' }}>
                                        Useful Concepts
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider" style={{ width: '25%' }}>
                                        Areas for Improvement
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider" style={{ width: '25%' }}>
                                        Other Comments/Suggestions
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider" style={{ width: '20%' }}>
                                        Remarks
                                    </th>
                                </tr>
                            </thead>

                            {/* Feedback and Remarks Table Body */}
                            <tbody className="bg-white divide-y divide-black-200">
                                {evaluations.map((evaluation, index) => (
                                    <tr key={`feedback-${index}`}>
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-black-900">{evaluation.id}</td>
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-black-500">{evaluation.useful_concepts}</td>
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-black-500">{evaluation.improvement_areas}</td>
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-black-500">{evaluation.additional_comments}</td>
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-black-500">{evaluation.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { TrainerProjectDetails, EvaluationReport };