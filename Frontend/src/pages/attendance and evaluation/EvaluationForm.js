import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EvaluationForm = () => {
    const { token } = useParams();
    const [evaluationData, setEvaluationData] = useState({
        attendee_name: '',
        ratings: {
            relevance_of_topics: '',
            organizational_flow: '',
            learning_methods: '',
            technology_use: '',
            time_efficiency: '',
            mastery_subject: '',
            preparedness: '',
            audience_participation: '',
            interest_level: '',
            handle_questions: '',
            voice_personality: '',
            visual_aids: '',
            venue_assessment: '',
            timeliness: '',
            overall_management: ''
        },
        useful_concepts: '',
        improvement_areas: '',
        additional_comments: '',
        remarks: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/monitoring/evaluation/fill/${token}/`);
                if (!response.ok) {
                    throw new Error('Invalid or expired link');
                }
            } catch (error) {
                setError(error.message);
            }
        };
        validateToken();
    }, [token]);

    const handleInputChange = (event) => {
        const { name, value, type } = event.target;
        if (type === 'number') {
            setEvaluationData(prev => ({
                ...prev,
                ratings: {
                    ...prev.ratings,
                    [name]: Number(value)
                }
            }));
        } else {
            setEvaluationData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/monitoring/evaluation/fill/${token}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...evaluationData,
                    ...evaluationData.ratings
                })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit the evaluation.');
            }
            setIsSubmitted(true);
        } catch (err) {
            setError(err.message || 'An error occurred during submission.');
        }
        setIsLoading(false);
    };

    const categoryLabels = {
        relevance_of_topics: "1. Relevance of Topics Covered",
        organizational_flow: "2. Organizational Flow of Topics",
        learning_methods: "3. Appropriateness of Learning Methods Used",
        technology_use: "4. Use of Technology and Aids",
        time_efficiency: "5. Efficiency of Time Used in Conducting the Activity",
        mastery_subject: "1. Mastery of the Subject Matter",
        preparedness: "2. Preparedness/Organization",
        audience_participation: "3. Ability to Draw Audience Participation",
        interest_level: "4. Ability to Make the Activity Interesting",
        handle_questions: "5. Ability to Handle Participants' Questions",
        voice_personality: "6. Voice Personality",
        visual_aids: "7. Trainer’s Use of Visual Aids or Choice of Activities",
        venue_assessment: "IV. How do you assess the venue used during the activity?",
        timeliness: "V. Timeliness of Service Delivery",
        overall_management: "VI. Overall Management of the Activity"
    };

    const RatingBox = ({ name, label }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex space-x-1">
                {[5, 4, 3, 2, 1, 0].map(num => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => handleInputChange({ target: { name, value: num, type: 'number' } })}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full border-2 ${
                            num === evaluationData.ratings[name] ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-500 border-gray-300'
                        }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );


    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-fixed" style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/images/bg-login3.png")` }}>
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-3xl shadow-2xl max-w-md mx-auto my-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Thank You!</h2>
                    <p className="text-lg text-gray-600 text-center">
                        Your evaluation has been successfully submitted. We appreciate your feedback!
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-fixed" style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/images/bg-login3.png")` }}>
                <div className="bg-gradient-to-r from-red-100 to-red-200 p-8 rounded-3xl shadow-2xl max-w-md mx-auto my-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Error</h2>
                    <p className="text-lg text-red-600 text-center">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-fixed" style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/images/bg-login3.png")` }}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-xl w-full p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Extension Activity Evaluation Form</h1>
                <div className="bg-blue-500 p-3 rounded mb-4">
                    <h3 className="text-black-600 font-bold">Personal Information</h3>
                </div>
                {!isSubmitted && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-black-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="attendee_name"
                                value={evaluationData.attendee_name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 w-full"
                                required
                            />
                        </div>
                        
                        <div className="bg-blue-500 p-3 rounded">
                            <h3 className="text-black-600 font-bold">Instructions</h3>
                        </div>

                        <div className="p-4 bg-gray-100 rounded">
                            <p className="text-sm mb-2">
                                Please evaluate the activity by selecting a rating for each category according to the scale below:
                            </p>
                            <ul className="list-disc list-inside text-sm">
                                <li>5 – Excellent</li>
                                <li>4 – Very Satisfactory</li>
                                <li>3 – Satisfactory</li>
                                <li>2 – Fair</li>
                                <li>1 – Poor</li>
                                <li>0 – Not Applicable</li>
                            </ul>
                        </div>
    
                        <h3 className="text-lg font-semibold">I. Activity</h3>
                        <div className="ml-5">
                            {['relevance_of_topics', 'organizational_flow', 'learning_methods', 'technology_use', 'time_efficiency'].map(key => (
                                <RatingBox key={key} name={key} label={categoryLabels[key]} />
                            ))}
                        </div>
    
                        <h3 className="text-lg font-semibold mt-4">II. Speaker/Trainer/Facilitator</h3>
                        <div className="ml-5">
                            {['mastery_subject', 'preparedness', 'audience_participation', 'interest_level', 'handle_questions', 'voice_personality', 'visual_aids'].map(key => (
                                <RatingBox key={key} name={key} label={categoryLabels[key]} />
                            ))}
                        </div>
    
                        <h3 className="text-lg font-semibold mt-4">III. Feedback</h3>
                        <div className="mb-4 ml-5">
                            <label className="block text-sm font-medium text-gray-700">1. Which concept/information/activity did you find useful in your organization?</label>
                            <textarea
                                name="useful_concepts"
                                value={evaluationData.useful_concepts}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Describe what was useful..."
                            />
                        </div>
                        <div className="mb-4 ml-5">
                            <label className="block text-sm font-medium text-gray-700">2. Which concept/information/activities were least useful? How can they be improved?</label>
                            <textarea
                                name="improvement_areas"
                                value={evaluationData.improvement_areas}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Suggest areas for improvement..."
                            />
                        </div>
                        <div className="mb-4 ml-5">
                            <label className="block text-sm font-medium text-gray-700">3. Other comment/suggestions</label>
                            <textarea
                                name="additional_comments"
                                value={evaluationData.additional_comments}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Any additional feedback..."
                            />
                        </div>
    
                        <h3 className="text-lg font-semibold mt-4">IV-VI. Other Ratings</h3>
                        <div className="ml-5">
                            <RatingBox name="venue_assessment" label={categoryLabels['venue_assessment']} />
                            <RatingBox name="timeliness" label={categoryLabels['timeliness']} />
                            <RatingBox name="overall_management" label={categoryLabels['overall_management']} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Remarks</label>
                            <textarea
                                name="remarks"
                                value={evaluationData.remarks}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Final remarks..."
                            />
                        </div>
                        
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                            Submit Evaluation
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EvaluationForm;
