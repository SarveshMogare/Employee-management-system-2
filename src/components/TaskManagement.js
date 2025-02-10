import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Grid, 
  Paper, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentTask, setCurrentTask] = useState({
    id: null,
    title: '',
    description: '',
    assignedTo: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '',
  });
  const [filterTab, setFilterTab] = useState(0);

  // Enhanced debugging function to check localStorage
  const debugLocalStorage = () => {
    try {
      // Attempt to access localStorage directly
      const rawTasks = localStorage.getItem('tasks');
      const rawEmployees = localStorage.getItem('employees');
      
      console.group('🔍 TaskManagement - Detailed LocalStorage Debug');
      console.log('🔑 Raw Tasks (localStorage):', rawTasks);
      console.log('🔑 Raw Employees (localStorage):', rawEmployees);
      
      const storedTasks = JSON.parse(rawTasks || '[]');
      const storedEmployees = JSON.parse(rawEmployees || '[]');
      
      console.log('📋 Parsed Tasks:', storedTasks);
      console.log('👥 Parsed Employees:', storedEmployees);
      
      console.log('🧩 Current Tasks State:', tasks);
      console.log('🧩 Current Employees State:', employees);
      
      // Check localStorage availability
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('✅ localStorage is fully functional');
      } catch (storageError) {
        console.error('❌ localStorage is not available:', storageError);
      }
      
      console.groupEnd();
    } catch (err) {
      console.error('🚨 Debug localStorage error:', err);
    }
  };

  // Comprehensive localStorage loading with extensive error handling
  const loadFromLocalStorage = () => {
    try {
      // Explicitly check for localStorage support
      if (typeof(Storage) === "undefined") {
        console.error('❌ localStorage is not supported in this browser');
        setError('Your browser does not support localStorage. Please update your browser.');
        return;
      }

      const rawTasks = localStorage.getItem('tasks');
      const rawEmployees = localStorage.getItem('employees');

      console.log('🔍 Loading from localStorage:', { rawTasks, rawEmployees });

      // Validate and parse tasks
      let parsedTasks = [];
      try {
        parsedTasks = rawTasks ? JSON.parse(rawTasks) : [];
      } catch (parseError) {
        console.error('❌ Error parsing tasks:', parseError);
        localStorage.removeItem('tasks'); // Clear corrupted data
      }

      // Validate and parse employees
      let parsedEmployees = [];
      try {
        parsedEmployees = rawEmployees ? JSON.parse(rawEmployees) : [];
      } catch (parseError) {
        console.error('❌ Error parsing employees:', parseError);
        localStorage.removeItem('employees'); // Clear corrupted data
      }

      // Update state with loaded data
      setTasks(parsedTasks);
      setEmployees(parsedEmployees);

      console.log('✅ Loaded tasks:', parsedTasks);
      console.log('✅ Loaded employees:', parsedEmployees);
    } catch (error) {
      console.error('🚨 Comprehensive loading error:', error);
      setError('Failed to load data. Please refresh the page.');
    }
  };

  // Use useEffect for initial load
  useEffect(() => {
    loadFromLocalStorage();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadFromLocalStorage);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('storage', loadFromLocalStorage);
    };
  }, []);

  // Save task (add or update)
  const handleSaveTask = () => {
    // Validation with detailed logging
    console.group('🔍 Task Save Validation');
    console.log('Current Task:', currentTask);
    console.log('Existing Tasks:', tasks);

    // Comprehensive validation
    const validationErrors = [];
    if (!currentTask.title) validationErrors.push('Task title is required');
    if (!currentTask.assignedTo) validationErrors.push('Please assign the task to an employee');
    if (!currentTask.dueDate) validationErrors.push('Due date is required');

    if (validationErrors.length > 0) {
      console.error('❌ Validation Errors:', validationErrors);
      setError(validationErrors.join(', '));
      console.groupEnd();
      return;
    }

    try {
      // Create new task object
      const taskToSave = {
        ...currentTask,
        id: currentTask.id || Date.now(), // Use timestamp as ID if new task
        createdAt: new Date().toISOString(),
      };

      // Update tasks array
      const updatedTasks = currentTask.id
        ? tasks.map(task => task.id === currentTask.id ? taskToSave : task)
        : [...tasks, taskToSave];

      console.log('📥 Tasks to be saved:', updatedTasks);
      
      // Save to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Update state
      setTasks(updatedTasks);
      setSuccessMessage('Task saved successfully!');
      setOpenDialog(false);
      
      // Debug log
      console.log('✅ Task saved successfully:', taskToSave);
      debugLocalStorage();
    } catch (error) {
      console.error('🚨 Error saving task:', error);
      setError('Failed to save task. Please try again.');
    }

    console.groupEnd();
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'default';
      case 'In Progress': return 'primary';
      case 'Completed': return 'success';
      case 'On Hold': return 'warning';
      case 'Blocked': return 'error';
      default: return 'default';
    }
  };

  // Filter tasks based on tab
  const getFilteredTasks = () => {
    switch (filterTab) {
      case 0: // All Tasks
        return tasks;
      case 1: // My Tasks (if we had user authentication)
        return tasks;
      case 2: // Not Started
        return tasks.filter(task => task.status === 'Not Started');
      case 3: // In Progress
        return tasks.filter(task => task.status === 'In Progress');
      case 4: // Completed
        return tasks.filter(task => task.status === 'Completed');
      default:
        return tasks;
    }
  };

  // Open dialog for adding/editing task
  const handleOpenDialog = (task = null) => {
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    if (task) {
      // Edit existing task
      setCurrentTask(task);
    } else {
      // New task
      setCurrentTask({
        id: (tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1),
        title: '',
        description: '',
        assignedTo: '',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: '',
      });
    }
    setOpenDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
        }}
      >
        {/* Debugging Button - More Prominent */}
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={debugLocalStorage}
          sx={{ 
            mb: 2, 
            position: 'absolute', 
            top: 10, 
            right: 10,
            zIndex: 1000 
          }}
        >
          Debug Storage
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, width: '100%' }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Success Message */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3 
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 'bold' 
            }}
          >
            Task Management
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            }}
            disabled={employees.length === 0}
          >
            Add Task
          </Button>
        </Box>

        {employees.length === 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please add employees first before creating tasks
          </Alert>
        )}

        {/* Task Filters */}
        <Tabs 
          value={filterTab} 
          onChange={(e, newValue) => setFilterTab(newValue)}
          sx={{ 
            mb: 3,
            '& .MuiTab-root': { 
              textTransform: 'none',
              fontWeight: 'medium'
            }
          }}
        >
          <Tab label="All Tasks" />
          <Tab label="My Tasks" />
          <Tab label="Not Started" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>

        {tasks.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No tasks have been created yet. Click "Add Task" to get started!
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredTasks().map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    {employees.find(emp => emp.id === parseInt(task.assignedTo))?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      color={getStatusColor(task.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority} 
                      color={
                        task.priority === 'Critical' ? 'error' :
                        task.priority === 'High' ? 'warning' :
                        task.priority === 'Medium' ? 'primary' :
                        'default'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Task Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {currentTask.id ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  name="title"
                  value={currentTask.title}
                  onChange={handleInputChange}
                  required
                  error={!currentTask.title && error}
                  helperText={!currentTask.title && error ? 'Task title is required' : ''}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Assigned To</InputLabel>
                  <Select
                    name="assignedTo"
                    value={currentTask.assignedTo}
                    label="Assigned To"
                    onChange={handleInputChange}
                    error={!currentTask.assignedTo && error}
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.name} - {emp.position}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  name="dueDate"
                  value={currentTask.dueDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  error={!currentTask.dueDate && error}
                  helperText={!currentTask.dueDate && error ? 'Due date is required' : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={currentTask.status}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    {TASK_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={currentTask.priority}
                    label="Priority"
                    onChange={handleInputChange}
                  >
                    {TASK_PRIORITIES.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)} 
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTask} 
              color="primary" 
              variant="contained"
            >
              Save Task
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default TaskManagement;
