import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadEmployeesAndDepartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchTerm, departmentFilter]);

  const loadEmployeesAndDepartments = () => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    const storedDepartments = JSON.parse(localStorage.getItem('departments') || '[]');
    
    setEmployees(storedEmployees);
    setDepartments(storedDepartments);
  };

  const applyFilters = () => {
    let result = employees;

    // Search Filter
    if (searchTerm) {
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department Filter
    if (departmentFilter) {
      result = result.filter(emp => emp.department === departmentFilter);
    }

    setFilteredEmployees(result);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      setEmployees(updatedEmployees);
    }
  };

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleApplyFilter = () => {
    applyFilters();
    handleCloseFilterDialog();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setFilteredEmployees(employees);
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        paddingTop: 10,
        paddingBottom: 4 
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h5" component="h2">
            Employee List
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleOpenFilterDialog}
            >
              Filter
            </Button>
          </Box>
        </Box>

        {/* Search and Filter Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Employees"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or position"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Filter Dialog */}
        <Dialog 
          open={openFilterDialog} 
          onClose={handleCloseFilterDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or position"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetFilters} color="secondary">
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilter} color="primary" variant="contained">
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        {/* Employee Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.department} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Tooltip title="View Profile">
                        <IconButton 
                          color="primary" 
                          onClick={() => navigate(`/employees/profile/${employee.id}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Employee">
                        <IconButton 
                          color="secondary" 
                          onClick={() => navigate(`/employees/edit/${employee.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Employee">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default EmployeeList;
