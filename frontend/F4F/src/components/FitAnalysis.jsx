
import React, { useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line
} from 'recharts';
import { FiUser, FiCheckCircle, FiAlertTriangle, FiBarChart2, FiFileText, FiTrendingUp } from 'react-icons/fi';
import './Analysis.css';
import ReactMarkdown from 'react-markdown';

function FitAnalysis({ analysis }) {
  const { ats_analysis, detailed_analysis } = analysis;

  // Normalize the score for gauge (between 0 and 1)
  const normalizedScore = Math.min(Math.max(ats_analysis.score, 0), 100) / 100;

  // Prepare data for ATS score chart
  const atsScoreData = [
    { name: 'Poor', value: 33, color: '#EF4444' },
    { name: 'Average', value: 33, color: '#F59E0B' },
    { name: 'Good', value: 34, color: '#10B981' },
  ];
  
  // Calculate position for ATS score marker
  const atsScore = Math.min(Math.max(ats_analysis.score, 0), 100);
  
  // Prepare data for bar chart - job fit metrics
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
  
  // Prepare data for radar chart - detailed analysis metrics
  const radarData = [
    { subject: 'Skills Match', A: ats_analysis.skill_score },
    { subject: 'Experience', A: ats_analysis.keyword_score },
    { subject: 'Structure', A: ats_analysis.structure_score },
    { subject: 'ATS Compatibility', A: Math.min(Math.max(ats_analysis.score, 0), 100) },
    { subject: 'Relevance', A: (ats_analysis.skill_score + ats_analysis.keyword_score) / 2 }
  ];

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}: ${payload[0].value}%`}</p>
          <p className="desc">Score based on resume analysis</p>
        </div>
      );
    }
    return null;
  };

  // Format text with ReactMarkdown
  const formatText = (text) => {
    if (!text) return <p>No information available.</p>;
    return <ReactMarkdown>{text}</ReactMarkdown>;
  };

  // Animate elements on load
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
    console.log("Detailed Analysis Data:", detailed_analysis);
  }, [detailed_analysis]);

  return (
    <div className="analysis-results">
      <h2 className="fade-in">Job Fit Analysis Results</h2>
      
      <div className="ats-score fade-in">
        <h3><FiUser className="section-icon" /> Job Fit Score</h3>
        <div className="gauge-container">
          <GaugeChart
            id="fit-gauge"
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
                <div className="marker-circle">
                  <div className="marker-inner"></div>
                </div>
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
            <p>This score indicates how well your resume would perform with Applicant Tracking Systems.</p>
            {detailed_analysis && detailed_analysis.ats_score_description ? (
              <p className="ats-advice">{detailed_analysis.ats_score_description}</p>
            ) : (
              <>
                {atsScore < 40 ? (
                  <p className="ats-advice">Your resume may be filtered out by ATS. Consider improving formatting and keywords.</p>
                ) : atsScore < 70 ? (
                  <p className="ats-advice">Your resume has moderate ATS compatibility. Add more relevant keywords to improve.</p>
                ) : (
                  <p className="ats-advice">Your resume is well-optimized for ATS systems. Great job!</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Skills Comparison Chart */}
        <div className="skills-comparison-container fade-in">
          <h3><FiBarChart2 className="section-icon" /> Skills Match Analysis</h3>
          <div className="skills-comparison-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={[
                  { name: 'Technical Skills', required: 100, candidate: ats_analysis.skill_score || 0 },
                  { name: 'Experience', required: 100, candidate: ats_analysis.keyword_score || 0 },
                  { name: 'Structure', required: 100, candidate: ats_analysis.structure_score || 0 }
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
                  name="Your Skills" 
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
              <span>Your Skills</span>
            </div>
          </div>
        </div>

        {/* Radar Chart and other existing components */}
        <div className="radar-chart-container fade-in">
          <h3><FiBarChart2 className="section-icon" /> Resume Strength Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#fff' }} />
              <Radar
                name="Resume Strength"
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
          <h3><FiBarChart2 className="section-icon" /> Job Fit Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={evaluationData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barSize={40}
            >
              <defs>
                <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5EEAD4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2DD4BF" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255, 255, 255, 0.1)" 
                vertical={false} 
              />
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

        <div className="score-details fade-in">
          <div className="score-item">
            <h4>Technical Skills</h4>
            <div className="score-bar-container">
              <div 
                className="score-bar" 
                style={{ 
                  width: `${ats_analysis.skill_score}%`,
                  background: 'linear-gradient(90deg, #5EEAD4, #2DD4BF)'
                }}
              />
              <span className="score-number">{ats_analysis.skill_score}%</span>
            </div>
          </div>
          
          <div className="score-item">
            <h4>Experience Match</h4>
            <div className="score-bar-container">
              <div 
                className="score-bar" 
                style={{ 
                  width: `${ats_analysis.keyword_score}%`,
                  background: 'linear-gradient(90deg, #3B82F6, #2563EB)'
                }}
              />
              <span className="score-number">{ats_analysis.keyword_score}%</span>
            </div>
          </div>
          
          <div className="score-item">
            <h4>Resume Structure</h4>
            <div className="score-bar-container">
              <div 
                className="score-bar" 
                style={{ 
                  width: `${ats_analysis.structure_score}%`,
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)'
                }}
              />
              <span className="score-number">{ats_analysis.structure_score}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analysis-section fade-in" style={{ 
        background: 'rgba(30, 41, 59, 0.5)',
        backgroundImage: 'url("/neural-bg.svg")',
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover'
      }}>
        <h3><FiCheckCircle className="section-icon" /> Key Strengths</h3>
        <ul className="strengths-list">
          {ats_analysis.strengths && ats_analysis.strengths.length > 0 ? (
            ats_analysis.strengths.map((strength, index) => (
              <li key={index} className="strength-item">
                <span className="strength-bullet">✓</span> {strength}
              </li>
            ))
          ) : (
            <li className="strength-item">
              <span className="strength-bullet">✓</span> No specific strengths identified.
            </li>
          )}
        </ul>
      </div>

      <div className="analysis-section fade-in" style={{ 
        background: 'rgba(30, 41, 59, 0.5)',
        backgroundImage: 'url("/neural-bg.svg")',
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover'
      }}>
        <h3><FiAlertTriangle className="section-icon" /> Areas for Improvement</h3>
        <ul className="weaknesses-list">
          {ats_analysis.weaknesses && ats_analysis.weaknesses.length > 0 ? (
            ats_analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="weakness-item">
                <span className="weakness-bullet">!</span> {weakness}
              </li>
            ))
          ) : (
            <li className="weakness-item">
              <span className="weakness-bullet">!</span> No specific areas for improvement identified.
            </li>
          )}
        </ul>
      </div>

      {/* Missing Skills Section */}
      {ats_analysis.missing_skills && ats_analysis.missing_skills.length > 0 && (
        <div className="analysis-section fade-in" style={{ 
          background: 'rgba(30, 41, 59, 0.5)',
          backgroundImage: 'url("/neural-bg.svg")',
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover'
        }}>
          <h3><FiAlertTriangle className="section-icon" /> Missing Skills</h3>
          <div className="missing-skills">
            {ats_analysis.missing_skills.map((skill, index) => (
              <span key={index} className="missing-skill">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Analysis Section */}
      <div className="detailed-analysis fade-in">
        <h3><FiFileText className="section-icon" /> Detailed Resume Analysis</h3>
        
        {detailed_analysis && typeof detailed_analysis === 'object' ? (
          Object.entries(detailed_analysis).map(([key, value]) => {
            if (value && typeof value === 'string' && key !== 'name' && 
                key !== 'ats_compatibility' && key !== 'suggestions_for_improvement' &&
                key !== 'grammar_language') {
              return (
                <div key={key} className="section fade-in">
                  <h4>{key.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}</h4>
                  <div className="analysis-text">
                    {formatText(value)}
                  </div>
                </div>
              );
            }
            return null;
          })
        ) : (
          <div className="section fade-in">
            <p>No detailed analysis available.</p>
          </div>
        )}
      </div>

      {/* Grammar Language Section - Modified to get content from backend */}
      {detailed_analysis && detailed_analysis.grammar_language && (
        <div className="section fade-in">
          <h4>Grammar Language</h4>
          <div className="analysis-text">
            {formatText(detailed_analysis.grammar_language)}
          </div>
        </div>
      )}

      {/* ATS Compatibility Section - Get content from backend */}
      {detailed_analysis && detailed_analysis.ats_compatibility && (
        <div className="section fade-in">
          <h4>ATS Compatibility</h4>
          <div className="analysis-text">
            {formatText(detailed_analysis.ats_compatibility)}
          </div>
        </div>
      )}

      {/* Suggestions for Improvement Section - Get content from backend */}
      {detailed_analysis && detailed_analysis.suggestions_for_improvement && (
        <div className="section fade-in">
          <h4>Suggestions For Improvement</h4>
          <div className="analysis-text">
            {formatText(detailed_analysis.suggestions_for_improvement)}
          </div>
        </div>
      )}

      {/* ATS Compatibility Section */}
      <div className="section ats-compatibility-section fade-in">
        <h3><FiBarChart2 className="section-icon" /> ATS Compatibility</h3>
        <div className="ats-compatibility-content">
          {detailed_analysis && detailed_analysis.ats_compatibility ? (
            formatText(detailed_analysis.ats_compatibility)
          ) : (
            <p>
              The resume scores {ats_analysis.score}% on ATS compatibility.<br/>
              <strong>Strengths:</strong> {ats_analysis.strengths && ats_analysis.strengths.length > 0 ? ats_analysis.strengths.slice(0, 3).join(', ') : 'None identified'}<br/>
              <strong>Weaknesses:</strong> {ats_analysis.weaknesses && ats_analysis.weaknesses.length > 0 ? ats_analysis.weaknesses.slice(0, 3).join(', ') : 'None identified'}<br/>
              {ats_analysis.missing_skills && ats_analysis.missing_skills.length > 0 && 
                <><strong>Missing important skills:</strong> {ats_analysis.missing_skills.join(', ')}</>
              }
            </p>
          )}
        </div>
        <div className="ats-compatibility-metrics">
          <div className="ats-metric">
            <h4>Keyword Match</h4>
            <div className="score-bar-container">
              <div 
                className="score-bar" 
                style={{ 
                  width: `${ats_analysis.keyword_score}%`,
                  background: 'linear-gradient(90deg, #3B82F6, #2563EB)'
                }}
              />
              <span className="score-number">{ats_analysis.keyword_score}%</span>
            </div>
          </div>
          <div className="ats-metric">
            <h4>Skills Match</h4>
            <div className="score-bar-container">
              <div 
                className="score-bar" 
                style={{ 
                  width: `${ats_analysis.skill_score}%`,
                  background: 'linear-gradient(90deg, #5EEAD4, #2DD4BF)'
                }}
              />
              <span className="score-number">{ats_analysis.skill_score}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions for Improvement Section */}
      <div className="section improvement-section fade-in">
        <h3><FiTrendingUp className="section-icon" /> Suggestions for Improvement</h3>
        <div className="improvement-content">
          {detailed_analysis && detailed_analysis.suggestions_for_improvement ? (
            formatText(detailed_analysis.suggestions_for_improvement)
          ) : (
            <div>
              <p>Based on the analysis, here are some suggestions to improve your resume:</p>
              <ul>
                {ats_analysis.keyword_score < 70 && <li>Add more relevant keywords related to the job role.</li>}
                {ats_analysis.skill_score < 70 && <li>Highlight more skills that are relevant to the position.</li>}
                {ats_analysis.structure_score < 70 && <li>Improve the structure of your resume with clear sections.</li>}
                {ats_analysis.missing_skills && ats_analysis.missing_skills.length > 0 && 
                  <li>Add the following missing skills: {ats_analysis.missing_skills.join(', ')}</li>
                }
                <li>Use action verbs and quantify achievements to make your resume more impactful.</li>
                <li>Ensure your contact information is complete and easily accessible.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FitAnalysis;
