import React, { useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { FiUser, FiCheckCircle, FiAlertTriangle, FiBarChart2, FiFileText, FiTrendingUp } from 'react-icons/fi';
import './Analysis.css';
import ReactMarkdown from 'react-markdown';

function HireAnalysis({ analysis }) {
  const { ats_analysis, recruitment_analysis } = analysis;

  // Normalize the score for gauge (between 0 and 1)
  const normalizedScore = Math.min(Math.max(ats_analysis.score, 0), 100) / 100;
  
  // Calculate position for ATS score marker
  const atsScore = Math.min(Math.max(ats_analysis.score, 0), 100);

  // Prepare data for bar chart - candidate evaluation metrics
  const evaluationData = [
    {
      category: 'Technical Skills',
      score: ats_analysis.skill_score,
      fill: '#5EEAD4'
    },
    {
      category: 'Experience',
      score: ats_analysis.keyword_score,
      fill: '#3B82F6'
    },
    {
      category: 'Structure',
      score: ats_analysis.structure_score,
      fill: '#8B5CF6'
    }
  ];
  
  // Prepare data for radar chart - candidate evaluation metrics
  const radarData = [
    { subject: 'Technical Skills', A: ats_analysis.skill_score },
    { subject: 'Experience', A: ats_analysis.keyword_score },
    { subject: 'Resume Structure', A: ats_analysis.structure_score },
    { subject: 'Overall Match', A: Math.min(Math.max(ats_analysis.score, 0), 100) },
    { subject: 'Qualifications', A: (ats_analysis.skill_score + ats_analysis.keyword_score) / 2 }
  ];
  
  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}: ${payload[0].value}%`}</p>
          <p className="tooltip-desc">Score out of 100%</p>
        </div>
      );
    }
    return null;
  };
  
  // Format text with ReactMarkdown
  const formatText = (text) => {
    if (!text) return <p className="empty-section-message">No information available.</p>;
    if (typeof text !== 'string') {
      console.warn("Unexpected data type for text content:", typeof text, text);
      return <p className="empty-section-message">Invalid data format.</p>;
    }
    if (text.trim() === '') return <p className="empty-section-message">No information available.</p>;
    
    try {
      return <ReactMarkdown>{text}</ReactMarkdown>;
    } catch (error) {
      console.error("Error rendering markdown:", error);
      return <p>{text}</p>;
    }
  };
    // Add a function to parse sections from candidate_overview
  const parseRecruitmentSections = () => {
    if (!recruitment_analysis || !recruitment_analysis.candidate_overview) {
      return recruitment_analysis || {};
    }
    
    const overview = recruitment_analysis.candidate_overview;
    const parsedData = { ...recruitment_analysis };
    
    // Define section markers in the text
    const sectionMarkers = {
      technical_qualification: "**Technical Qualification Assessment:**",
      professional_experience: "**Professional Experience:**",
      education_certifications: "**Education and Certifications:**",
      red_flags: "**Red Flags and Concerns:**",
      candidate_strengths: "**Candidate Strengths:**",
      interview_recommendations: "**Interview Recommendations:**",
      hiring_recommendation: "**Hiring Recommendation:**"
    };
    
    // Extract candidate overview (everything before Technical Qualification)
    const techQualIndex = overview.indexOf(sectionMarkers.technical_qualification);
    if (techQualIndex > 0) {
      parsedData.candidate_overview = overview.substring(0, techQualIndex).trim();
    }
    
    // Extract each section
    Object.entries(sectionMarkers).forEach(([key, marker], index, array) => {
      const startIndex = overview.indexOf(marker);
      if (startIndex !== -1) {
        const startContent = startIndex + marker.length;
        
        // Find the next section marker
        let endIndex = overview.length;
        for (let i = index + 1; i < array.length; i++) {
          const nextMarker = array[i][1];
          const nextIndex = overview.indexOf(nextMarker);
          if (nextIndex !== -1 && nextIndex > startIndex) {
            endIndex = nextIndex;
            break;
          }
        }
        
        // Extract the content
        parsedData[key] = overview.substring(startContent, endIndex).trim();
      }
    });
    
    return parsedData;
  };
  
  // Use the parsed data instead of the raw recruitment_analysis
  const parsedRecruitmentData = parseRecruitmentSections();
  
  // Add a function to check if the recruitment analysis has meaningful data
  const hasRecruitmentData = () => {
    if (!parsedRecruitmentData || typeof parsedRecruitmentData !== 'object') return false;
    
    // Check if at least one section has content
    return Object.values(parsedRecruitmentData).some(value => 
      value && typeof value === 'string' && value.trim() !== '');
  };
  
  // Add animation to elements when they come into view
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('visible');
        }, 100 * index);
      });
    };
    
    animateElements();
    
    // Enhanced logging to debug the recruitment analysis data
    console.log("Recruitment Analysis Data:", recruitment_analysis);
    if (recruitment_analysis) {
      console.log("Available sections:", Object.keys(recruitment_analysis));
      console.log("Candidate overview length:", 
        recruitment_analysis.candidate_overview ? recruitment_analysis.candidate_overview.length : 0);
      
      // Check if any sections are empty and log them
      const emptySections = Object.entries(recruitment_analysis)
        .filter(([_, value]) => !value || value.trim?.() === '')
        .map(([key]) => key);
      
      console.log("Empty sections:", emptySections);
    }
  }, [recruitment_analysis]);

  return (
    <div className="analysis-results">
      <h2 className="fade-in">Hiring Analysis Results</h2>
      
      <div className="ats-score fade-in">
        <h3><FiUser className="section-icon" /> Candidate Match Score</h3>
        <div className="gauge-container">
          <GaugeChart
            id="hire-gauge"
            nrOfLevels={20}
            percent={normalizedScore}
            colors={["#EF4444", "#F59E0B", "#10B981"]}
            arcWidth={0.3}
            textColor="#ffffff"
            needleColor="#8B5CF6"
            needleBaseColor="#8B5CF6"
            animate={true}
            formatTextValue={value => `${Math.round(normalizedScore * 100)}%`}
            cornerRadius={3}
            arcsLength={[0.3, 0.3, 0.4]}
            marginInPercent={0.02}
          />
        </div>
        
        {/* ATS Score Chart */}
        <div className="ats-score-chart-container fade-in">
          <h3><FiTrendingUp className="section-icon" /> ATS Compatibility Score</h3>
          <div className="ats-score-chart">
            <div className="ats-score-bar-container">
              <div className="ats-score-track">
                <div className="ats-score-segments">
                  <div className="ats-score-segment" style={{ width: '33%' }}>
                    <span className="segment-label">Poor</span>
                  </div>
                  <div className="ats-score-segment" style={{ width: '33%' }}>
                    <span className="segment-label">Average</span>
                  </div>
                  <div className="ats-score-segment" style={{ width: '34%' }}>
                    <span className="segment-label">Good</span>
                  </div>
                </div>
              </div>
              <div 
                className="ats-score-progress" 
                style={{ 
                  width: `${atsScore}%`,
                }}
              ></div>
              <div 
                className="ats-score-marker"
                style={{
                  left: `${atsScore}%`,
                }}
              >
                <div className="marker-value">{atsScore}%</div>
                <div className="marker-inner"></div>
              </div>
            </div>
            <div className="ats-score-scale">
              <div className="scale-point">0%</div>
              <div className="scale-point">25%</div>
              <div className="scale-point">50%</div>
              <div className="scale-point">75%</div>
              <div className="scale-point">100%</div>
            </div>
          </div>
          <div className="ats-score-description">
            <p>This score indicates how well this candidate's resume would perform with Applicant Tracking Systems.</p>
            {atsScore < 40 ? (
              <p className="ats-advice">This resume may be filtered out by ATS. Consider candidates with better formatted resumes.</p>
            ) : atsScore < 70 ? (
              <p className="ats-advice">This resume has moderate ATS compatibility. The candidate has included some relevant keywords.</p>
            ) : (
              <p className="ats-advice">This resume is well-optimized for ATS systems, indicating the candidate understands modern job application practices.</p>
            )}
          </div>
        </div>

        {/* Skills Match Comparison Chart */}
        <div className="skills-comparison-container fade-in">
          <h3><FiBarChart2 className="section-icon" /> Skills Match Analysis</h3>
          <div className="skills-comparison-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={[
                  { name: 'Technical', required: 100, candidate: ats_analysis.skill_score || 0 },
                  { name: 'Experience', required: 100, candidate: ats_analysis.keyword_score || 0 },
                  { name: 'Education', required: 100, candidate: ats_analysis.education_score || 70 },
                  { name: 'Soft Skills', required: 100, candidate: ats_analysis.soft_skills_score || 65 },
                  { name: 'Industry Knowledge', required: 100, candidate: ats_analysis.industry_score || 60 }
                ]}
                margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tick={{ fill: '#ffffff' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: '#ffffff' }} 
                  width={80}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 25, 40, 0.9)', 
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="required" 
                  name="Job Requirement" 
                  fill="rgba(255, 255, 255, 0.2)" 
                  radius={[0, 4, 4, 0]}
                />
                <Bar 
                  dataKey="candidate" 
                  name="Candidate Skills" 
                  fill="url(#skillsGradient)" 
                  radius={[0, 4, 4, 0]}
                  animationBegin={300}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <defs>
                  <linearGradient id="skillsGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5EEAD4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="skills-comparison-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
              <span>Job Requirements</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'linear-gradient(90deg, #5EEAD4, #8B5CF6)' }}></div>
              <span>Candidate Skills</span>
            </div>
          </div>
        </div>

        {/* Add Radar Chart */}
        <div className="radar-chart-container fade-in">
          <h3><FiBarChart2 className="section-icon" /> Candidate Strength Profile</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#fff' }} />
              <Radar
                name="Candidate Strength"
                dataKey="A"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="evaluation-chart fade-in">
          <h3><FiBarChart2 className="section-icon" /> Candidate Evaluation Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={evaluationData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barSize={40}
            >
              <defs>
                <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5EEAD4" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#5EEAD4" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: '#ffffff' }} 
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#ffffff' }} 
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="score" 
                name="Score" 
                radius={[8, 8, 0, 0]}
                animationBegin={300}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {evaluationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#barGradient${index + 1})`} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
            </div>

            {/* Detailed Analysis Sections with Improved Layout */}
            <div className="detailed-analysis-container fade-in">
              <h3 className="section-main-title"><FiFileText className="section-icon" /> Detailed Candidate Analysis</h3>
              
              <div className="analysis-sections-wrapper">
                {/* Left Column */}
                <div className="analysis-column">
                  {/* Candidate Overview Section */}
                  <div className="analysis-section-card fade-in">
                    <div className="section-card-header">
                      <h4 className="section-title">Candidate Overview</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.candidate_overview ? 
                        formatText(parsedRecruitmentData.candidate_overview) : 
                        <p className="empty-section-message">No candidate overview information available.</p>
                      }
                    </div>
                  </div>
                  
                  {/* Technical Qualification Section */}
                  <div className="analysis-section-card fade-in">
                    <div className="section-card-header">
                      <h4 className="section-title">Technical Qualification Assessment</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.technical_qualification ? 
                        formatText(parsedRecruitmentData.technical_qualification) : 
                        <p className="empty-section-message">Technical qualification assessment pending.</p>
                      }
                    </div>
                  </div>
                  
                  {/* Professional Experience Section */}
                  <div className="analysis-section-card fade-in">
                    <div className="section-card-header">
                      <h4 className="section-title">Professional Experience</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.professional_experience ? 
                        formatText(parsedRecruitmentData.professional_experience) : 
                        <p className="empty-section-message">Professional experience details pending.</p>
                      }
                    </div>
                  </div>
                  
                  {/* Education and Certifications Section */}
                  <div className="analysis-section-card fade-in">
                    <div className="section-card-header">
                      <h4 className="section-title">Education and Certifications</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.education_certifications ? 
                        formatText(parsedRecruitmentData.education_certifications) : 
                        <p className="empty-section-message">Education and certifications information pending.</p>
                      }
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="analysis-column">
                  {/* Red Flags Section */}
                  <div className="analysis-section-card fade-in warning-card">
                    <div className="section-card-header warning-header">
                      <h4 className="section-title">Red Flags and Concerns</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.red_flags ? 
                        formatText(parsedRecruitmentData.red_flags) : 
                        <p className="empty-section-message">No red flags or concerns identified.</p>
                      }
                    </div>
                  </div>
                  
                  {/* Candidate Strengths Section */}
                  <div className="analysis-section-card fade-in strength-card">
                    <div className="section-card-header strength-header">
                      <h4 className="section-title">Candidate Strengths</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.candidate_strengths ? 
                        formatText(parsedRecruitmentData.candidate_strengths) : 
                        <p className="empty-section-message">Candidate strengths analysis pending.</p>
                      }
                    </div>
                  </div>
                  
                  {/* Interview Recommendations Section */}
                  <div className="analysis-section-card fade-in">
                    <div className="section-card-header">
                      <h4 className="section-title">Interview Recommendations</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.interview_recommendations ? 
                        formatText(parsedRecruitmentData.interview_recommendations) : 
                        <p className="empty-section-message">Interview recommendations pending.</p>
                      }
                    </div>
                  </div>
                  
                  {/* Hiring Recommendation Section */}
                  <div className="analysis-section-card fade-in recommendation-card">
                    <div className="section-card-header recommendation-header">
                      <h4 className="section-title">Hiring Recommendation</h4>
                    </div>
                    <div className="section-card-body">
                      {parsedRecruitmentData.hiring_recommendation ? 
                        formatText(parsedRecruitmentData.hiring_recommendation) : 
                        <p className="empty-section-message">Hiring recommendation pending.</p>
                      }
                    </div>
                  </div>
                  
                  {/* ATS Compatibility Section */}
                  <div className="analysis-section-card fade-in ats-card">
                    <div className="section-card-header ats-header">
                      <h4 className="section-title">ATS Compatibility</h4>
                    </div>
                    <div className="section-card-body">
                      <div className="ats-compatibility-summary">
                        <div className="ats-score-pill" style={{ 
                          backgroundColor: atsScore < 40 ? '#EF4444' : atsScore < 70 ? '#F59E0B' : '#10B981' 
                        }}>
                          {atsScore}%
                        </div>
                        <p>
                          {atsScore < 40 ? 
                            "Poor ATS compatibility. Resume may be filtered out by automated systems." : 
                            atsScore < 70 ? 
                            "Moderate ATS compatibility. Some improvements recommended." : 
                            "Good ATS compatibility. Resume is well-optimized for automated systems."}
                        </p>
                      </div>
                      <div className="ats-details">
                        <p>Key factors affecting ATS score:</p>
                        <ul className="ats-factors-list">
                          <li>Keyword match: <span className="factor-score">{ats_analysis.keyword_score}%</span></li>
                          <li>Structure quality: <span className="factor-score">{ats_analysis.structure_score}%</span></li>
                          <li>Technical relevance: <span className="factor-score">{ats_analysis.skill_score}%</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default HireAnalysis;