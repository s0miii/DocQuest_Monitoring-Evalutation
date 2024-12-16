import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import ProjLeadSidebar from '../../components/ProjLeadSideBar';
import { FaArrowLeft} from 'react-icons/fa';
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
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvaluations = async () => {
            const response = await fetch(`http://127.0.0.1:8000/monitoring/evaluations/?trainer=${trainerID}&project=${projectID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token 78df3f539a7103e489f5ca314932eaf69ea0c6ba'
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
                        <h1 className="text-2xl font-semibold">Evaluation Report </h1>
                    </div>
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                            <table className="w-full text-m text-left text-black-500 dark:text-black-400">
                            <thead className="bg-blue-500">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    IDNO.
                                </th>
                                {['I.1', 'I.2', 'I.3', 'I.4', 'I.5', 'II.1', 'II.2', 'II.3', 'II.4', 'II.5', 'II.6', 'II.7', 'IV', 'V', 'VI', 'AVERAGE'].map((header) => (
                                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-black-200">
                            {evaluations.map((evaluation, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900">{evaluation.id}</td>
                                    {['relevance_of_topics', 'organizational_flow', 'learning_methods', 'technology_use', 'time_efficiency', 'mastery_subject', 'preparedness', 'audience_participation', 'interest_level', 'handle_questions', 'voice_personality', 'visual_aids', 'venue_assessment', 'timeliness', 'overall_management'].map(key => (
                                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{evaluation[key]}</td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{evaluation.average}</td>
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