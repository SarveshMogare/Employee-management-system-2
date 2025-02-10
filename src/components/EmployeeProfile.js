import React, { useState } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import {
  Email,
  Phone,
  Business,
  Today,
  School,
  WorkHistory,
} from '@mui/icons-material';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function EmployeeProfile() {
  const [tabValue, setTabValue] = useState(0);

  // Mock data - in a real app, this would come from your API
  const employee = {
    id: 1,
    name: 'John Doe',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    education: [
      {
        degree: 'Master of Computer Science',
        school: 'Stanford University',
        year: '2020',
      },
      {
        degree: 'Bachelor of Engineering',
        school: 'MIT',
        year: '2018',
      },
    ],
    experience: [
      {
        role: 'Software Engineer',
        company: 'Tech Corp',
        period: '2020-2022',
      },
      {
        role: 'Junior Developer',
        company: 'StartUp Inc',
        period: '2018-2020',
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto',
                fontSize: '4rem',
                backgroundColor: '#1976d2',
              }}
            >
              {employee.name.charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {employee.name}
            </Typography>
            <Typography color="textSecondary">{employee.position}</Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <List>
              <ListItem>
                <Email sx={{ mr: 2 }} />
                <ListItemText primary="Email" secondary={employee.email} />
              </ListItem>
              <ListItem>
                <Phone sx={{ mr: 2 }} />
                <ListItemText primary="Phone" secondary={employee.phone} />
              </ListItem>
              <ListItem>
                <Business sx={{ mr: 2 }} />
                <ListItemText
                  primary="Department"
                  secondary={employee.department}
                />
              </ListItem>
              <ListItem>
                <Today sx={{ mr: 2 }} />
                <ListItemText primary="Join Date" secondary={employee.joinDate} />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Skills" />
            <Tab label="Education" />
            <Tab label="Experience" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {employee.skills.map((skill) => (
                <Chip key={skill} label={skill} />
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {employee.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {edu.degree}
                </Typography>
                <Typography color="textSecondary">
                  {edu.school} - {edu.year}
                </Typography>
              </Box>
            ))}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {employee.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  <WorkHistory sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {exp.role}
                </Typography>
                <Typography color="textSecondary">
                  {exp.company} | {exp.period}
                </Typography>
              </Box>
            ))}
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}

export default EmployeeProfile;
