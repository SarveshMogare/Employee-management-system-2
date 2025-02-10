import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { 
  safeRender, 
  safeRenderArray, 
  safeGet,
  sanitizeFormData,
  validationSchemas
} from '../utils/renderUtils';

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
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
    // Load departments with safe rendering
    const storedDepartments = JSON.parse(localStorage.getItem('departments') || '[]');
    setDepartments(safeRenderArray(storedDepartments, { 
      preferredKeys: ['name', 'label'] 
    }));

    // Load employee data with safe access
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const employee = employees.find(emp => emp.id === parseInt(id));
    
    if (employee) {
      setFormData({
        name: safeRender(employee.name),
        email: safeRender(employee.email),
        position: safeRender(employee.position),
        department: safeRender(employee.department),
        hireDate: safeRender(employee.hireDate),
        baseSalary: safeRender(employee.baseSalary, { fallback: '0' }),
        bonus: safeRender(employee.bonus, { fallback: '0' }),
        allowance: safeRender(employee.allowance, { fallback: '0' }),
      });
      
      // Find position category with safe access
      for (const [category, positions] of Object.entries(POSITION_CATEGORIES)) {
        if (positions.includes(safeRender(employee.position))) {
          setSelectedPositionCategory(category);
          break;
        }
      }
    } else {
      setError('Employee not found');
      setTimeout(() => navigate('/employees'), 2000);
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input based on field type
    const sanitizedValue = name === 'email' 
      ? validationSchemas.email(value)
      : ['baseSalary', 'bonus', 'allowance'].includes(name)
        ? validationSchemas.number(value)
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const calculateTotalSalary = () => {
    const base = validationSchemas.number(formData.baseSalary);
    const bonus = validationSchemas.number(formData.bonus);
    const allowance = validationSchemas.number(formData.allowance);
    return base + bonus + allowance;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields with safe rendering
    const requiredFields = ['name', 'email', 'position', 'department', 'hireDate', 'baseSalary'];
    const missingFields = requiredFields.filter(field => 
      !safeRender(formData[field]).trim()
    );

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    
    const updatedEmployees = employees.map(emp => 
      emp.id === parseInt(id) ? { 
        ...sanitizeFormData(formData, {
          email: validationSchemas.email,
          baseSalary: validationSchemas.number,
          bonus: validationSchemas.number,
          allowance: validationSchemas.number
        }),
        id: parseInt(id),
        totalSalary: calculateTotalSalary(),
        positionCategory: selectedPositionCategory,
      } : emp
    );
    
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    navigate('/employees');
  };

  const getDepartmentsByCategory = () => {
    const departmentsByCategory = {};
    departments.forEach(dept => {
      const category = safeRender(dept.category, { fallback: 'Uncategorized' });
      const name = safeRender(dept.name);
      
      if (!departmentsByCategory[category]) {
        departmentsByCategory[category] = [];
      }
      departmentsByCategory[category].push(name);
    });
    return departmentsByCategory;
  };

  if (error === 'Employee not found') {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          Employee not found. Redirecting to employee list...
        </Alert>
      </Container>
    );
  }

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
            mb: 4
          }}
        >
          Edit Employee
        </Typography>
        
        {error && error !== 'Employee not found' && (
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
              <TextField
                required
                fullWidth
                select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={!formData.department && error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business color="primary" />
                    </InputAdornment>
                  ),
                }}
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
              </TextField>
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
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    }
                  }}
                >
                  Update Employee
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default EditEmployee;
