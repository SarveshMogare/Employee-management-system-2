import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  InputAdornment,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Person,
  Email,
  Work,
  Business,
  Today,
  AttachMoney,
} from '@mui/icons-material';
import { POSITION_CATEGORIES } from '../utils/constants';
import { StorageUtils } from '../utils/storageUtils';

function AddEmployee() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedPositionCategory, setSelectedPositionCategory] = useState('Engineering');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    hireDate: '',
    baseSalary: '',
    bonus: '0',
    allowance: '0',
  });

  useEffect(() => {
    const storedDepartments = StorageUtils.getData('departments');
    setDepartments(storedDepartments);
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    // Handle salary inputs
    if (['baseSalary', 'bonus', 'allowance'].includes(e.target.name)) {
      value = value.replace(/[^0-9]/g, '');
    }
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const calculateTotalSalary = () => {
    const base = parseInt(formData.baseSalary) || 0;
    const bonus = parseInt(formData.bonus) || 0;
    const allowance = parseInt(formData.allowance) || 0;
    return base + bonus + allowance;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position || !formData.department || 
        !formData.hireDate || !formData.baseSalary) {
      setError('Please fill in all required fields');
      return;
    }

    const existingEmployees = StorageUtils.getData('employees');
    
    const newEmployeeId = existingEmployees.length > 0 
      ? Math.max(...existingEmployees.map(emp => emp.id)) + 1 
      : 1;

    const newEmployee = {
      id: newEmployeeId,
      ...formData,
      totalSalary: calculateTotalSalary(),
      positionCategory: selectedPositionCategory,
      hireDate: (() => {
        const now = new Date();
        // Create a date string in a consistent, parseable format
        return now.toISOString();
      })(),
      baseSalary: parseFloat(formData.baseSalary),
    };
    
    const updatedEmployees = [...existingEmployees, newEmployee];
    try {
      StorageUtils.saveData('employees', updatedEmployees);

      // Navigate back to employees list or dashboard
      navigate('/employees');
    } catch (error) {
      alert('Failed to add employee. Please try again.');
    }
  };

  const getDepartmentsByCategory = () => {
    const departmentsByCategory = {};
    departments.forEach(dept => {
      if (!departmentsByCategory[dept.category]) {
        departmentsByCategory[dept.category] = [];
      }
      departmentsByCategory[dept.category].push(dept.name);
    });
    return departmentsByCategory;
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        paddingTop: 10,  
        mt: 4 
      }}
    >
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
            mb: 4
          }}
        >
          Add New Employee
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1976d2',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Person /> Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!formData.name && error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!formData.email && error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Employment Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1976d2',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Work /> Employment Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Position Category"
                value={selectedPositionCategory}
                onChange={(e) => {
                  setSelectedPositionCategory(e.target.value);
                  setFormData(prev => ({ ...prev, position: '' }));
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                {Object.keys(POSITION_CATEGORIES).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                error={!formData.position && error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                {POSITION_CATEGORIES[selectedPositionCategory].map((position) => (
                  <MenuItem key={position} value={position}>
                    {position}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label="Department"
                >
                  {Object.entries(getDepartmentsByCategory()).map(([category, depts]) => [
                    <MenuItem key={category} disabled sx={{ opacity: 1, fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      {category}
                    </MenuItem>,
                    ...depts.map(dept => (
                      <MenuItem key={dept} value={dept} sx={{ pl: 4 }}>
                        {dept}
                      </MenuItem>
                    ))
                  ]).flat()}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Hire Date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                error={!formData.hireDate && error}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Today color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Salary Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1976d2',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <AttachMoney /> Salary Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Base Salary"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleChange}
                error={!formData.baseSalary && error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bonus"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Allowance"
                name="allowance"
                value={formData.allowance}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ color: '#1976d2' }}>
                Total Salary: ${calculateTotalSalary().toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="button"
                  onClick={() => navigate('/employees')}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={departments.length === 0}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    }
                  }}
                >
                  Add Employee
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default AddEmployee;
