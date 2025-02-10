import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Box,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  PeopleAlt as PeopleIcon, 
  Business as BusinessIcon, 
  Person as PersonIcon,
  WorkOutline as WorkIcon,
  TrendingUp as TrendIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  GroupAdd as GroupAddIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { StorageUtils } from '../utils/storageUtils';  

// Utility function to safely convert to string
const safeToString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    // If it's an object, try to extract a meaningful string representation
    if (value.name) return value.name.toString();
    if (value.id) return value.id.toString();
    return JSON.stringify(value);
  }
  return value.toString();
};

// Utility function to calculate average employee tenure
const calculateAverageTenure = (employees) => {
  const currentDate = new Date();
  const validEmployees = employees.filter(emp => emp.joinDate);
  const totalTenure = validEmployees.reduce((sum, emp) => {
    const joinDate = new Date(emp.joinDate);
    const yearsEmployed = (currentDate - joinDate) / (1000 * 60 * 60 * 24 * 365.25);
    return sum + yearsEmployed;
  }, 0);

  const averageTenure = validEmployees.length > 0 
    ? totalTenure / validEmployees.length 
    : 0;

  return Number(averageTenure.toFixed(2));
};

// Utility function to calculate salary metrics
const calculateSalaryMetrics = (employees) => {
  // Filter out employees with invalid or missing base salary
  const validEmployees = employees.filter(emp => 
    emp.baseSalary && !isNaN(parseFloat(emp.baseSalary))
  );

  // Total base salary calculation
  const totalSalary = validEmployees.reduce((sum, emp) => 
    sum + parseFloat(emp.baseSalary), 0);

  // Average base salary calculation
  const averageSalary = validEmployees.length > 0 
    ? totalSalary / validEmployees.length 
    : 0;

  return {
    totalSalary: Number(totalSalary.toFixed(2)),
    averageSalary: Number(averageSalary.toFixed(2))
  };
};

// Utility function to calculate employees on leave this month
const calculateEmployeesOnLeave = (employees) => {
  return employees.filter(emp => {
    // If no leave information, not on leave
    if (!emp.leaveStartDate || !emp.leaveEndDate) {
      return false;
    }

    const currentDate = new Date();
    const leaveStart = new Date(emp.leaveStartDate);
    const leaveEnd = new Date(emp.leaveEndDate);

    // Employee is on leave if current date is within leave period
    return currentDate >= leaveStart && currentDate <= leaveEnd;
  }).length;
};

// Utility function to calculate active employees
const calculateActiveEmployees = (employees) => {
  return employees.filter(emp => {
    // If no leave information, consider employee active
    if (!emp.leaveStartDate || !emp.leaveEndDate) {
      return true;
    }

    const currentDate = new Date();
    const leaveStart = new Date(emp.leaveStartDate);
    const leaveEnd = new Date(emp.leaveEndDate);

    // Employee is active if current date is outside leave period
    return currentDate < leaveStart || currentDate > leaveEnd;
  }).length;
};

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [employeeStats, setEmployeeStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    employeesOnLeave: [],
    departmentCounts: {}
  });
  
  const [salaryMetrics, setSalaryMetrics] = useState({
    totalSalary: 0,
    averageSalary: 0
  });
  
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Memoized update function to prevent unnecessary re-renders
  const updateDashboardMetrics = useCallback(() => {
    // Initialize default data if not exists
    StorageUtils.initializeDefaultData();

    // Load data from localStorage
    const storedEmployees = StorageUtils.getData('employees');
    const storedDepartments = StorageUtils.getData('departments');

    // Calculate department counts
    const departmentCounts = storedEmployees.reduce((acc, emp) => {
      const dept = safeToString(emp.department);
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // Calculate employees on leave this month
    const employeesOnLeave = calculateEmployeesOnLeave(storedEmployees);

    // Calculate active employees
    const activeEmployees = calculateActiveEmployees(storedEmployees);

    // Calculate salary metrics
    const { totalSalary, averageSalary } = calculateSalaryMetrics(storedEmployees);

    // Update state
    setEmployeeStats(prevStats => ({
      ...prevStats,
      totalEmployees: storedEmployees.length,
      activeEmployees,
      employeesOnLeave,
      departmentCounts
    }));

    setSalaryMetrics({
      totalSalary,
      averageSalary
    });

    setDepartments(storedDepartments.map(safeToString));
    setEmployees(storedEmployees);
  }, []);

  // Initial load and setup storage event listener
  useEffect(() => {
    // Initial update
    updateDashboardMetrics();

    // Listen for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'employees' || event.key === 'departments') {
        updateDashboardMetrics();
      }
    };

    // Add event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Add periodic check to ensure updates
    const intervalId = setInterval(updateDashboardMetrics, 5000);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [updateDashboardMetrics]);

  // Render Department Counts
  const renderDepartmentCounts = () => {
    return Object.entries(employeeStats.departmentCounts).map(([dept, count]) => (
      <Grid item xs={12} sm={6} md={4} key={dept}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 2, color: theme.palette.text.secondary }} />
              <Typography variant="subtitle1">{dept}</Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main
              }}
            >
              {count}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        paddingTop: 10,  
        paddingBottom: 4 
      }}
    >
      <Grid container spacing={4}>
        {/* Employee Overview Cards */}
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(to right bottom, #36D1DC, #5B86E5)',
              color: 'white'
            }}
            elevation={6}
          >
            <CardContent 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <PeopleIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {employeeStats.totalEmployees}
              </Typography>
              <Typography variant="subtitle1">
                Total Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(to right bottom, #11998e, #38ef7d)',
              color: 'white'
            }}
            elevation={6}
          >
            <CardContent 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <GroupAddIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {employeeStats.employeesOnLeave}
              </Typography>
              <Typography variant="subtitle1">
                Employees on Leave This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(to right bottom, #f12711, #f5af19)',
              color: 'white'
            }}
            elevation={6}
          >
            <CardContent 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <TimerIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {employeeStats.activeEmployees}
              </Typography>
              <Typography variant="subtitle1">
                Active Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(to right bottom, #8E2DE2, #4A00E0)',
              color: 'white'
            }}
            elevation={6}
          >
            <CardContent 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <BusinessIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {Object.keys(employeeStats.departmentCounts).length}
              </Typography>
              <Typography variant="subtitle1">
                Total Departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Salary Metrics Cards */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(to right bottom, #36D1DC, #5B86E5)',
              color: 'white'
            }}
            elevation={6}
          >
            <CardContent 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <MoneyIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ₹{salaryMetrics.totalSalary.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
              <Typography variant="subtitle1">
                Total Base Salary
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(to right bottom, #11998e, #38ef7d)',
              color: 'white'
            }}
            elevation={6}
          >
            <CardContent 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <MoneyIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ₹{salaryMetrics.averageSalary.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
              <Typography variant="subtitle1">
                Average Base Salary
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Counts */}
        <Grid item xs={12}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: theme.palette.background.paper
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <BusinessIcon sx={{ mr: 2, color: theme.palette.text.secondary }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 'bold'
                }}
              >
                Department Employee Distribution
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {renderDepartmentCounts()}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
