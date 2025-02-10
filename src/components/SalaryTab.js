import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

// Tax Calculation Constants
const TAX_BRACKETS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 0.05 },
  { min: 500001, max: 1000000, rate: 0.20 },
  { min: 1000001, max: Infinity, rate: 0.30 }
];

const STANDARD_DEDUCTIONS = {
  providentFund: 0.12,  // 12% of basic salary
  professionalTax: 2500,  // Fixed amount
  healthInsurance: 0.05  // 5% of basic salary
};

function SalaryTab() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPayroll, setCurrentPayroll] = useState({
    id: null,
    employeeId: '',
    month: new Date().toISOString().slice(0, 7),
    basicSalary: '',
    bonus: '',
    overtimePay: '',
    deductions: {}
  });
  const [error, setError] = useState('');

  // Debugging function
  const debugLocalStorage = () => {
    console.group(' LocalStorage Debug');
    console.log('Employees:', localStorage.getItem('employees'));
    console.log('Payrolls:', localStorage.getItem('payrolls'));
    console.groupEnd();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.group(' Loading Salary Data');
        
        // Load employees
        const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
        console.log('Loaded Employees:', storedEmployees);
        
        // Load payrolls
        const storedPayrolls = JSON.parse(localStorage.getItem('payrolls') || '[]');
        console.log('Loaded Payrolls:', storedPayrolls);
        
        // Update state
        setEmployees(storedEmployees);
        setPayrolls(storedPayrolls);
        
        setLoading(false);
        console.groupEnd();
      } catch (err) {
        console.error(' Error loading data:', err);
        setError('Failed to load data. Please check the console.');
        setLoading(false);
      }
    };

    loadData();
    debugLocalStorage();
  }, []);

  const calculateTax = (income) => {
    let totalTax = 0;
    for (let bracket of TAX_BRACKETS) {
      if (income > bracket.min) {
        const taxableAmount = Math.min(income, bracket.max) - bracket.min;
        totalTax += taxableAmount * bracket.rate;
      }
    }
    return totalTax;
  };

  const calculatePayroll = (payroll) => {
    try {
      const basicSalary = parseFloat(payroll.basicSalary) || 0;
      const bonus = parseFloat(payroll.bonus) || 0;
      const overtimePay = parseFloat(payroll.overtimePay) || 0;

      // Calculate Deductions
      const providentFund = basicSalary * STANDARD_DEDUCTIONS.providentFund;
      const healthInsurance = basicSalary * STANDARD_DEDUCTIONS.healthInsurance;
      const professionalTax = STANDARD_DEDUCTIONS.professionalTax;

      // Total Earnings
      const grossSalary = basicSalary + bonus + overtimePay;

      // Tax Calculation
      const incomeTax = calculateTax(grossSalary);

      // Total Deductions
      const totalDeductions = providentFund + healthInsurance + professionalTax + incomeTax;

      // Net Salary
      const netSalary = grossSalary - totalDeductions;

      return {
        ...payroll,
        grossSalary: Number(grossSalary.toFixed(2)),
        deductions: {
          providentFund: Number(providentFund.toFixed(2)),
          healthInsurance: Number(healthInsurance.toFixed(2)),
          professionalTax: Number(professionalTax.toFixed(2)),
          incomeTax: Number(incomeTax.toFixed(2))
        },
        netSalary: Number(netSalary.toFixed(2)),
        paymentStatus: netSalary > 0 ? 'Processed' : 'Failed'
      };
    } catch (err) {
      console.error(' Payroll calculation error:', err);
      return null;
    }
  };

  const handleOpenDialog = (payroll = null) => {
    if (employees.length === 0) {
      setError('Please add employees first');
      return;
    }

    setError('');
    if (payroll) {
      setCurrentPayroll(payroll);
    } else {
      setCurrentPayroll({
        id: Date.now(),
        employeeId: employees[0]?.id.toString() || '',
        month: new Date().toISOString().slice(0, 7),
        basicSalary: '',
        bonus: '',
        overtimePay: '',
        deductions: {}
      });
    }
    setOpenDialog(true);
  };

  const handleSavePayroll = () => {
    console.group(' Saving Payroll');
    console.log('Current Payroll:', currentPayroll);

    if (!currentPayroll.employeeId || !currentPayroll.basicSalary) {
      setError('Employee and Basic Salary are required');
      console.error(' Validation Failed');
      console.groupEnd();
      return;
    }

    const processedPayroll = calculatePayroll(currentPayroll);
    
    if (!processedPayroll) {
      setError('Failed to process payroll. Check your inputs.');
      console.error(' Payroll Processing Failed');
      console.groupEnd();
      return;
    }

    const updatedPayrolls = currentPayroll.id
      ? payrolls.map(p => p.id === currentPayroll.id ? processedPayroll : p)
      : [...payrolls, processedPayroll];

    try {
      localStorage.setItem('payrolls', JSON.stringify(updatedPayrolls));
      setPayrolls(updatedPayrolls);
      setOpenDialog(false);
      setError('');
      console.log(' Payroll Saved Successfully');
      debugLocalStorage();
    } catch (err) {
      console.error(' Error saving payrolls:', err);
      setError('Failed to save payroll. Check console for details.');
    }
    console.groupEnd();
  };

  const handleDeletePayroll = (payrollId) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      const updatedPayrolls = payrolls.filter(p => p.id !== payrollId);
      localStorage.setItem('payrolls', JSON.stringify(updatedPayrolls));
      setPayrolls(updatedPayrolls);
      debugLocalStorage();
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">Payroll Management</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                disabled={employees.length === 0}
              >
                Process Payroll
              </Button>
            </Box>

            {employees.length === 0 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Please add employees before processing payroll
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {payrolls.length === 0 && employees.length > 0 && (
              <Alert severity="info" sx={{ mb: 3 }}>
                No payroll records yet. Click "Process Payroll" to create your first record.
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Basic Salary</TableCell>
                    <TableCell>Gross Salary</TableCell>
                    <TableCell>Net Salary</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payrolls.map((payroll) => {
                    const employee = employees.find(e => e.id === parseInt(payroll.employeeId));
                    return (
                      <TableRow key={payroll.id}>
                        <TableCell>{employee?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          {new Date(payroll.month).toLocaleString('default', { month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>{payroll.basicSalary}</TableCell>
                        <TableCell>{payroll.grossSalary?.toFixed(2)}</TableCell>
                        <TableCell>{payroll.netSalary?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={payroll.paymentStatus}
                            color={payroll.paymentStatus === 'Processed' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit Payroll">
                            <IconButton color="primary" onClick={() => handleOpenDialog(payroll)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Payroll">
                            <IconButton color="error" onClick={() => handleDeletePayroll(payroll.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Payroll Processing Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
              <DialogTitle>
                {currentPayroll.id ? 'Edit Payroll' : 'Process New Payroll'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Employee</InputLabel>
                      <Select
                        value={currentPayroll.employeeId}
                        label="Employee"
                        onChange={(e) => setCurrentPayroll(prev => ({
                          ...prev,
                          employeeId: e.target.value
                        }))}
                      >
                        {employees.map((emp) => (
                          <MenuItem key={emp.id} value={emp.id.toString()}>
                            {emp.name} - {emp.position}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="month"
                      label="Month"
                      value={currentPayroll.month}
                      onChange={(e) => setCurrentPayroll(prev => ({
                        ...prev,
                        month: e.target.value
                      }))}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Basic Salary"
                      value={currentPayroll.basicSalary}
                      onChange={(e) => setCurrentPayroll(prev => ({
                        ...prev,
                        basicSalary: e.target.value
                      }))}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Bonus"
                      value={currentPayroll.bonus}
                      onChange={(e) => setCurrentPayroll(prev => ({
                        ...prev,
                        bonus: e.target.value
                      }))}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Overtime Pay"
                      value={currentPayroll.overtimePay}
                      onChange={(e) => setCurrentPayroll(prev => ({
                        ...prev,
                        overtimePay: e.target.value
                      }))}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="secondary">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSavePayroll} 
                  color="primary" 
                  variant="contained"
                  startIcon={<CalculateIcon />}
                >
                  Calculate Payroll
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <SalaryAnalyticsDashboard />
        </Grid>
      </Grid>
    </Container>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function SalaryAnalyticsDashboard() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      const storedPayrolls = JSON.parse(localStorage.getItem('payrolls') || '[]');
      
      setEmployees(storedEmployees);
      setPayrolls(storedPayrolls);
      
      generateNotifications(storedEmployees, storedPayrolls);
    };

    loadData();
  }, []);

  const generateNotifications = (employees, payrolls) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const newNotifications = [];

    // Salary Due Date Reminder
    if (currentDate.getDate() >= 25) {
      newNotifications.push({
        type: 'warning',
        message: 'Salary processing for next month will start soon!'
      });
    }

    // Payroll Processing Status
    const lastMonthPayrolls = payrolls.filter(p => {
      const payrollDate = new Date(p.month);
      return payrollDate.getMonth() === currentMonth - 1 && 
             payrollDate.getFullYear() === currentYear;
    });

    if (lastMonthPayrolls.length < employees.length) {
      newNotifications.push({
        type: 'error',
        message: `Payroll not processed for all employees last month. ${employees.length - lastMonthPayrolls.length} employees pending.`
      });
    }

    // Tax Filing Reminder (typically in March-July)
    if (currentMonth >= 2 && currentMonth <= 6) {
      newNotifications.push({
        type: 'info',
        message: 'Tax filing season is approaching. Prepare your documents!'
      });
    }

    setNotifications(newNotifications);
    
    // Auto-open notification if there are any
    if (newNotifications.length > 0) {
      setOpenNotification(true);
    }
  };

  const calculateSalaryAnalytics = () => {
    const monthlyTotalSalary = payrolls.reduce((acc, curr) => {
      const month = new Date(curr.month).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + curr.netSalary;
      return acc;
    }, {});

    const monthlyData = Object.entries(monthlyTotalSalary).map(([month, total]) => ({
      month,
      total: Number(total.toFixed(2))
    }));

    const departmentSalaries = employees.reduce((acc, emp) => {
      const empPayrolls = payrolls.filter(p => p.employeeId === emp.id.toString());
      const totalSalary = empPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
      
      acc[emp.department] = (acc[emp.department] || 0) + totalSalary;
      return acc;
    }, {});

    const departmentData = Object.entries(departmentSalaries).map(([department, total]) => ({
      department,
      total: Number(total.toFixed(2))
    }));

    return { monthlyData, departmentData };
  };

  const { monthlyData, departmentData } = calculateSalaryAnalytics();

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <NotificationIcon sx={{ mr: 2 }} />
        <Typography variant="h6">Notifications</Typography>
      </Box>
      {notifications.map((notification, index) => (
        <Alert 
          key={index} 
          severity={notification.type}
          sx={{ mb: 1 }}
        >
          {notification.message}
        </Alert>
      ))}
    </Paper>
  );
}

export default SalaryTab;
