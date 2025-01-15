// src/components/resume/ResumeAnalyzer.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Upload, 
    FileText, 
    CheckCircle, 
    AlertCircle, 
    BarChart2, 
    Target, 
    Book,
    FileSearch,
    Layout,
    List
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ScoreCard Component with PropTypes
const ScoreCard = ({ title, score, icon: Icon, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-600">{title}</h4>
                <p className="text-2xl font-bold text-gray-900">{score}%</p>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    </div>
);

ScoreCard.propTypes = {
    title: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    description: PropTypes.string.isRequired
};

// KeywordBadge Component with PropTypes
const KeywordBadge = ({ keyword, type = 'match' }) => (
    <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            type === 'match' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
        }`}
    >
        {type === 'match' ? (
            <CheckCircle className="h-4 w-4 mr-1" />
        ) : (
            <AlertCircle className="h-4 w-4 mr-1" />
        )}
        {keyword}
    </span>
);

KeywordBadge.propTypes = {
    keyword: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['match', 'missing'])
};

export default function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Layout },
        { id: 'keywords', label: 'Keywords', icon: List },
        { id: 'suggestions', label: 'Suggestions', icon: FileSearch },
        { id: 'format', label: 'Format', icon: FileText }
    ];

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!['text/plain', 'application/pdf', 'application/msword', 
                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                .includes(file.type)) {
                toast.error('Unsupported file format');
                return;
            }

            try {
                const text = await file.text();
                setResumeText(text);
                toast.success('Resume uploaded successfully');
            } catch (error) {
                console.error('File upload error:', error);
                toast.error('Failed to read resume file');
            }
        }
    };

    const handleAnalyze = async () => {
        if (!resumeText || !jobDescription) {
            toast.error('Please provide both resume and job description');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/resume-analysis/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeText, jobDescription }),
            });

            if (!response.ok) throw new Error('Analysis failed');

            const result = await response.json();
            setAnalysis(result);
            setActiveTab('overview');
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        if (!analysis) return null;

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Match Progress */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4">Overall Match Analysis</h4>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${analysis.matchPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-500">Match Score</p>
                                <p className="font-medium text-gray-900">{analysis.matchPercentage.toFixed(1)}%</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-500">ATS Compatible</p>
                                <p className="font-medium text-gray-900">
                                    {analysis.isATSCompatible ? 'Yes' : 'No'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-500">Format Score</p>
                                <p className="font-medium text-gray-900">{analysis.formatScore.toFixed(1)}%</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-500">Industry Match</p>
                                <p className="font-medium text-gray-900">{analysis.industryCategory}</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {analysis.quickWins.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Improvements</h4>
                                <div className="space-y-2">
                                    {analysis.quickWins.map((win, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                            {win}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'keywords':
                return (
                    <div className="space-y-6">
                        {/* Matching Keywords */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Found Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.matchingKeywords.map((keyword, index) => (
                                    <KeywordBadge key={index} keyword={keyword} type="match" />
                                ))}
                            </div>
                        </div>

                        {/* Missing Keywords */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missingKeywords.map((keyword, index) => (
                                    <KeywordBadge key={index} keyword={keyword} type="missing" />
                                ))}
                            </div>
                        </div>

                        {/* Industry Keywords */}
                        {analysis.industryKeywords?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Industry-Specific Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.industryKeywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'suggestions':
                return (
                    <div className="space-y-4">
                        {/* Priority Improvements */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Priority Improvements</h4>
                            {analysis.priorityImprovements.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="flex items-start p-4 bg-red-50 rounded-lg mb-2"
                                >
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-sm text-gray-800">{suggestion}</p>
                                </div>
                            ))}
                        </div>

                        {/* General Suggestions */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Suggestions</h4>
                            {analysis.suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="flex items-start p-4 bg-blue-50 rounded-lg mb-2"
                                >
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-sm text-gray-800">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'format':
                return (
                    <div className="space-y-6">
                        {/* Format Checklist */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4">Format Checklist</h4>
                            <div className="space-y-2">
                                {Object.entries(analysis.formatChecklist).map(([item, passed]) => (
                                    <div key={item} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{item}</span>
                                        {passed ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ATS Optimization */}
                        {analysis.atsOptimizationTips?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">ATS Optimization Tips</h4>
                                <div className="space-y-2">
                                    {analysis.atsOptimizationTips.map((tip, index) => (
                                        <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg">
                                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <p className="text-sm text-gray-800">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Rest of the component remains the same until Analysis Results */}
            
            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-6">
                    {/* Score Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <ScoreCard
                            title="Overall Match"
                            score={analysis.matchPercentage.toFixed(1)}
                            icon={Target}
                            description="Resume-job match score"
                        />
                        <ScoreCard
                            title="Technical Match"
                            score={analysis.skillScore.toFixed(1)}
                            icon={BarChart2}
                            description="Technical skills alignment"
                        />
                        <ScoreCard
                            title="Keyword Match"
                            score={analysis.keywordScore.toFixed(1)}
                            icon={Book}
                            description="Required keywords found"
                        />
                        <ScoreCard
                            title="Format Score"
                            score={analysis.formatScore.toFixed(1)}
                            icon={FileText}
                            description="ATS compatibility score"
                        />
                    </div>

                    {/* Analysis Tabs */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {renderTabContent()}
                        </div>
                        </div>
                </div>
            )}

            {/* File Upload Form Section - Always visible */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">ATS Resume Checker</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Resume Upload Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Upload Resume</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                            <input
                                type="file"
                                accept=".txt,.doc,.docx,.pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="resume-upload"
                            />
                            <label
                                htmlFor="resume-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <Upload className="h-12 w-12 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-600">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Supported formats: TXT, DOC, DOCX, PDF
                                </span>
                            </label>
                        </div>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Or paste your resume text here..."
                            className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Job Description Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Job Description</h3>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !resumeText || !jobDescription}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <FileSearch className="h-5 w-5" />
                                    <span>Analyze Resume</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// PropTypes for the analysis object structure
ResumeAnalyzer.propTypes = {
    analysis: PropTypes.shape({
        matchPercentage: PropTypes.number,
        skillScore: PropTypes.number,
        keywordScore: PropTypes.number,
        formatScore: PropTypes.number,
        isATSCompatible: PropTypes.bool,
        matchingKeywords: PropTypes.arrayOf(PropTypes.string),
        missingKeywords: PropTypes.arrayOf(PropTypes.string),
        suggestions: PropTypes.arrayOf(PropTypes.string),
        industryCategory: PropTypes.string,
        industryKeywords: PropTypes.arrayOf(PropTypes.string),
        formatChecklist: PropTypes.objectOf(PropTypes.bool),
        atsOptimizationTips: PropTypes.arrayOf(PropTypes.string),
        priorityImprovements: PropTypes.arrayOf(PropTypes.string),
        quickWins: PropTypes.arrayOf(PropTypes.string),
        strengths: PropTypes.arrayOf(PropTypes.string),
        weaknesses: PropTypes.arrayOf(PropTypes.string)
    })
};

