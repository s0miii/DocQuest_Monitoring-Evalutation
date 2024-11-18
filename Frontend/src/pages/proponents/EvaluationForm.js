import React, { useState } from 'react';

const EvaluationForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        speaker: '',
        evaluator: '',
        venue: '',
        activityRatings: {
            relevanceOfTopics: '',
            organizationalFlow: '',
            appropriatenessOfMethods: '',
            useOfTech: '',
            efficiency: '',
        },
        speakerRatings: {
            masteryOfSubject: '',
            preparedness: '',
            audienceParticipation: '',
            interestingActivity: '',
            handleQuestions: '',
            voicePersonality: '',
            visualAids: '',
        },
        venueRating: '',
        serviceTimeliness: '',
        overallManagement: '',
        usefulConcepts: '',
        leastUsefulConcepts: '',
        otherComments: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRatingChange = (section, name, value) => {
        setFormData({
            ...formData,
            [section]: { ...formData[section], [name]: parseInt(value) },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-fixed" style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/images/bg-login3.png")` }}>
            <div className="overflow-auto h-screen p-8 bg-white rounded-lg shadow-lg max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Extension Activity Evaluation Form</h2>

                <div className="bg-blue-500 p-3 rounded mb-4">
                    <h3 className="text-black-600 font-bold">Activity Information</h3>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Title of Activity</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Date of Activity</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Name of Speaker/Trainer/Facilitator</label>
                        <input
                            type="text"
                            name="speaker"
                            value={formData.speaker}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Name of Evaluator</label>
                        <input
                            type="text"
                            name="evaluator"
                            value={formData.evaluator}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Venue of Activity</label>
                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                </div>

                <div className="bg-blue-500 p-3 rounded mb-4">
                    <h3 className="text-black-600 font-bold">Instructions</h3>
                </div>

                <div className="mb-6 p-4 bg-gray-100 rounded">
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

                {/* I: Activity Ratings */}
                <h3 className="text-lg font-semibold mt-6 mb-2">I. Activity</h3>
                {[
                    { key: 'relevanceOfTopics', label: '1. Relevance of Topics Covered' },
                    { key: 'organizationalFlow', label: '2. Organizational Flow of Topics' },
                    { key: 'appropriatenessOfMethods', label: '3. Appropriateness of Learning Methods Used' },
                    { key: 'useOfTech', label: '4. Use of Technology and Aids' },
                    { key: 'efficiency', label: '5. Efficiency of Time Used in Conducting the Activity' },
                ].map((item) => (
                    <div className="ml-5" key={item.key}>
                        <RatingDropdown
                            label={item.label}
                            value={formData.activityRatings[item.key]}
                            onChange={(value) => handleRatingChange('activityRatings', item.key, value)}
                        />
                    </div>
                ))}

                {/* II: Speaker/Trainer/Facilitator Ratings */}
                <h3 className="text-lg font-semibold mt-6 mb-2">II. Speaker/Trainer/Facilitator</h3>
                {[
                    { key: 'masteryOfSubject', label: '1. Mastery of the Subject Matter' },
                    { key: 'preparedness', label: '2. Preparedness/Organization' },
                    { key: 'audienceParticipation', label: '3. Ability to Draw Audience Participation' },
                    { key: 'interestingActivity', label: '4. Ability to Make the Activity Interesting' },
                    { key: 'handleQuestions', label: "5. Ability to Handle Participants' Questions" },
                    { key: 'voicePersonality', label: '6. Voice Personality' },
                    { key: 'visualAids', label: '7. Trainer’s Use of Visual Aids or Choice of Activities' },
                ].map((item) => (
                    <div className="ml-5" key={item.key}>
                        <RatingDropdown
                            label={item.label}
                            value={formData.speakerRatings[item.key]}
                            onChange={(value) => handleRatingChange('speakerRatings', item.key, value)}
                        />
                    </div>
                ))}

                {/* Feedback Section */}
                <h3 className="text-lg font-semibold mt-6 mb-2">III. Feedback</h3>
                <div className="ml-5 mb-4">
                    <label className="block text-sm font-medium mb-2">1. Which concept/information/activity did you find useful in your organization?</label>
                    <textarea
                        name="usefulConcepts"
                        value={formData.usefulConcepts}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="ml-5 mb-4">
                    <label className="block text-sm font-medium mb-2">2. Which concept/information/activities were least useful? How can they be improved?</label>
                    <textarea
                        name="leastUsefulConcepts"
                        value={formData.leastUsefulConcepts}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="ml-5 mb-4">
                    <label className="block text-sm font-medium mb-2">3. Other comments/suggestions</label>
                    <textarea
                        name="otherComments"
                        value={formData.otherComments}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Other Ratings */}
                <h3 className="text-lg font-semibold mt-6 mb-2">IV - VI. Other Ratings</h3>
                <div className="ml-5">
                    <RatingDropdown
                        label="IV. How do you assess the venue used during the activity?"
                        value={formData.venueRating}
                        onChange={(value) => handleRatingChange(null, 'venueRating', value)}
                    />
                    <RatingDropdown
                        label="V. Timeliness of Service Delivery"
                        value={formData.serviceTimeliness}
                        onChange={(value) => handleRatingChange(null, 'serviceTimeliness', value)}
                    />
                    <RatingDropdown
                        label="VI. Overall Management of the Activity"
                        value={formData.overallManagement}
                        onChange={(value) => handleRatingChange(null, 'overallManagement', value)}
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

    // Dropdown component for rating
    const RatingDropdown = ({ label, value, onChange }) => {
        return (
            <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium">{label}</label>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="border rounded p-2 ml-4 w-35" 
                >
                    <option value="">Select Rating</option>
                    {[5, 4, 3, 2, 1, 0].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

export default EvaluationForm;
