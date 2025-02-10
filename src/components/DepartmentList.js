import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Business,
  Group,
} from '@mui/icons-material';

// Predefined department categories
const DEPARTMENT_CATEGORIES = {
  'Technical': [
    'Software Development',
    'IT Support',
    'DevOps',
    'Quality Assurance',
    'Data Science',
    'Cloud Infrastructure',
  ],
  'Business': [
    'Sales',
    'Marketing',
    'Business Development',
    'Customer Success',
    'Public Relations',
  ],
  'Operations': [
    'Human Resources',
    'Finance',
    'Administration',
    'Operations',
    'Facilities',
    'Legal',
  ],
  'Creative': [
    'Design',
    'Content',
    'UX/UI',
    'Creative Services',
    'Brand Management',
  ],
  'Research': [
    'Research & Development',
    'Product Research',
    'Market Research',
    'Innovation Lab',
  ]
};

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Technical');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem('departments') || '[]');
    setDepartments(storedDepartments);
  }, []);

  const handleAddDepartment = () => {
    if (!newDepartment) {
      setError('Please select a department');
      return;
    }

    const existingDepartment = departments.find(
      dept => dept.name.toLowerCase() === newDepartment.toLowerCase()
    );

    if (existingDepartment) {
      setError('Department already exists');
      return;
    }

    const newDept = {
      id: departments.length + 1,
      name: newDepartment,
      category: selectedCategory,
    };

    const updatedDepartments = [...departments, newDept];
    setDepartments(updatedDepartments);
    localStorage.setItem('departments', JSON.stringify(updatedDepartments));
    setNewDepartment('');
    setError('');
  };

  const handleDelete = (id) => {
    // Check if any employees are in this department
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const departmentToDelete = departments.find(dept => dept.id === id);
    
    if (departmentToDelete && employees.some(emp => emp.department === departmentToDelete.name)) {
      setError('Cannot delete department that has employees. Please reassign or remove employees first.');
      return;
    }

    const updatedDepartments = departments.filter(dept => dept.id !== id);
    setDepartments(updatedDepartments);
    localStorage.setItem('departments', JSON.stringify(updatedDepartments));
    setError('');
  };

  const getEmployeeCount = (departmentName) => {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    return employees.filter(emp => emp.department === departmentName).length;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper 
        sx={{ 
          p: 4,
          background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            color: '#1a237e',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Business fontSize="large" />
          Department Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={5}>
            <TextField
              select
              fullWidth
              label="Department Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ mb: 2 }}
            >
              {Object.keys(DEPARTMENT_CATEGORIES).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              select
              fullWidth
              label="Department Name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            >
              {DEPARTMENT_CATEGORIES[selectedCategory].map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddDepartment}
              startIcon={<AddIcon />}
              sx={{
                height: '56px',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: '#1976d2',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Group />
          Current Departments
        </Typography>

        {departments.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}>
            <Typography variant="subtitle1" color="textSecondary">
              No departments added yet. Add your first department!
            </Typography>
          </Paper>
        ) : (
          <List>
            {departments.map((department) => (
              <React.Fragment key={department.id}>
                <ListItem
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(department.id)}
                      sx={{ 
                        color: '#dc004e',
                        '&:hover': { backgroundColor: 'rgba(220, 0, 78, 0.1)' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {department.name}
                        </Typography>
                        <Chip
                          label={department.category}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            color: '#4caf50',
                          }}
                        />
                        <Chip
                          label={`${getEmployeeCount(department.name)} employees`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            color: '#1976d2',
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default DepartmentList;
