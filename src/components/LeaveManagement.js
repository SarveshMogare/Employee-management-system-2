import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon 
} from '@mui/icons-material';

import { StorageUtils } from '../utils/storageUtils';

function LeaveManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveRequest, setLeaveRequest] = useState({
    employeeId: '',
    employeeName: '',
    startDate: '',
    endDate: '',
    leaveType: 'Casual',
    reason: ''
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Load employees and leave history on component mount
  useEffect(() => {
    const storedEmployees = StorageUtils.getData('employees');
    setEmployees(storedEmployees);

    // Load or initialize leave history
    const savedLeaveHistory = StorageUtils.getData('leaveHistory') || [];
    setLeaveHistory(savedLeaveHistory);
  }, []);

  // Handle employee selection
  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employeeId);
    setLeaveRequest(prev => ({
      ...prev,
      employeeId: employeeId,
      employeeName: employee.name
    }));
  };

  // Handle leave request input changes
  const handleLeaveRequestChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit leave request
  const handleSubmitLeaveRequest = () => {
    // Validate leave request
    if (!leaveRequest.employeeId || !leaveRequest.startDate || !leaveRequest.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new leave request
    const newLeaveRequest = {
      ...leaveRequest,
      id: Date.now(), // Unique identifier
      submittedOn: new Date().toISOString()
    };

    // Update leave history
    const updatedLeaveHistory = [...leaveHistory, newLeaveRequest];
    
    // Save to localStorage
    try {
      StorageUtils.saveData('leaveHistory', updatedLeaveHistory);
      
      // Update employee's leave information
      const updatedEmployees = employees.map(emp => 
        emp.id === leaveRequest.employeeId 
          ? {
              ...emp, 
              leaveStartDate: leaveRequest.startDate,
              leaveEndDate: leaveRequest.endDate,
              leaveReason: leaveRequest.reason
            }
          : emp
      );
      StorageUtils.saveData('employees', updatedEmployees);

      // Update state
      setLeaveHistory(updatedLeaveHistory);
      setEmployees(updatedEmployees);

      // Reset form
      setLeaveRequest({
        employeeId: '',
        employeeName: '',
        startDate: '',
        endDate: '',
        leaveType: 'Casual',
        reason: ''
      });
      setSelectedEmployee('');

      // Trigger storage event
      window.dispatchEvent(new Event('storage'));

      // Show success dialog
      setOpenDialog(true);
    } catch (error) {
      alert('Failed to submit leave request');
    }
  };

  // Delete leave request
  const handleDeleteLeaveRequest = (leaveRequestId) => {
    const updatedLeaveHistory = leaveHistory.filter(
      request => request.id !== leaveRequestId
    );

    try {
      StorageUtils.saveData('leaveHistory', updatedLeaveHistory);
      setLeaveHistory(updatedLeaveHistory);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      alert('Failed to delete leave request');
    }
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        paddingTop: 10,  
        paddingBottom: 4 
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Leave Management
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Employee Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={selectedEmployee}
              label="Select Employee"
              onChange={(e) => handleEmployeeSelect(e.target.value)}
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Leave Request Form */}
        {selectedEmployee && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee Name"
                value={leaveRequest.employeeName}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  name="leaveType"
                  value={leaveRequest.leaveType}
                  label="Leave Type"
                  onChange={handleLeaveRequestChange}
                >
                  <MenuItem value="Casual">Casual Leave</MenuItem>
                  <MenuItem value="Sick">Sick Leave</MenuItem>
                  <MenuItem value="Vacation">Vacation</MenuItem>
                  <MenuItem value="Maternity">Maternity/Paternity</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={leaveRequest.startDate}
                onChange={handleLeaveRequestChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={leaveRequest.endDate}
                onChange={handleLeaveRequestChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Leave"
                name="reason"
                multiline
                rows={3}
                value={leaveRequest.reason}
                onChange={handleLeaveRequestChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleSubmitLeaveRequest}
                fullWidth
              >
                Submit Leave Request
              </Button>
            </Grid>
          </>
        )}

        {/* Leave History */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Leave History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveHistory.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.employeeName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.leaveType} 
                        color={
                          request.leaveType === 'Sick' ? 'error' :
                          request.leaveType === 'Vacation' ? 'success' :
                          'primary'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{request.startDate}</TableCell>
                    <TableCell>{request.endDate}</TableCell>
                    <TableCell>{request.reason || 'No reason provided'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteLeaveRequest(request.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Leave Request Submitted</DialogTitle>
        <DialogContent>
          <Typography>
            Your leave request for {leaveRequest.employeeName} has been successfully submitted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LeaveManagement;
