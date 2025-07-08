import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import RecommendIcon from '@mui/icons-material/Recommend';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const ReportDisplay = ({ report }) => {
  if (!report) return null;
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Resume Analysis Report
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Candidate Profile
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Name:</strong> {report.candidateName || 'Not specified'}
            </Typography>
            {report.candidateEmail && (
              <Typography variant="body1">
                <EmailIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {report.candidateEmail}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {report.candidatePhone && (
              <Typography variant="body1">
                <PhoneIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {report.candidatePhone}
              </Typography>
            )}
            {report.candidateLinkedIn && (
              <Typography variant="body1">
                <LinkedInIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {report.candidateLinkedIn}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ mr: 2 }}>Match Score:</Typography>
        <Chip 
          label={`${report.matchScore}%`} 
          color={report.matchScore >= 70 ? "success" : report.matchScore >= 50 ? "warning" : "error"}
          sx={{ fontSize: '1.2rem', padding: '20px', height: 'auto' }}
        />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Matched Skills
            </Typography>
            <List dense>
              {report.matchedSkills && report.matchedSkills.length > 0 ? (
                report.matchedSkills.map((skill, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={skill} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No matched skills found</Typography>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="error">
              <CancelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Missing Skills
            </Typography>
            <List dense>
              {report.missingSkills && report.missingSkills.length > 0 ? (
                report.missingSkills.map((skill, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <CancelIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={skill} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No missing skills identified</Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Experience Analysis
            </Typography>
            <Typography variant="body2">
              {report.experienceAnalysis || 'No experience analysis available'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Education Analysis
            </Typography>
            <Typography variant="body2">
              {report.educationAnalysis || 'No education analysis available'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          <RecommendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Recommendations
        </Typography>
        
        <Grid container spacing={2}>
          {report.recommendations && report.recommendations.length > 0 ? (
            report.recommendations.map((rec, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {rec.title}
                    </Typography>
                    <Typography variant="body2">
                      {rec.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">No recommendations available</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Improvement Areas
        </Typography>
        
        <List>
          {report.improvementAreas && report.improvementAreas.length > 0 ? (
            report.improvementAreas.map((area, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary={area} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No improvement areas identified</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default ReportDisplay;