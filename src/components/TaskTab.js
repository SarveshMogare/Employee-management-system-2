import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Check as CheckIcon 
} from '@mui/icons-material';

import { StorageUtils } from '../utils/storageUtils';

function TaskTab() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'pending'
  });

  // Load initial data
  useEffect(() => {
    const storedEmployees = StorageUtils.getData('employees');
    const storedTasks = StorageUtils.getData('tasks', []);
    
    setEmployees(storedEmployees);
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage
  const saveTasks = (updatedTasks) => {
    StorageUtils.saveData('tasks', updatedTasks);
    setTasks(updatedTasks);
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo) return;

    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, taskToAdd];
    saveTasks(updatedTasks);

    // Reset form
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      status: 'pending'
    });
  };

  // Complete task
  const handleCompleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        pt: 10,  
        mt: 4 
      }}
    >
      <Grid container spacing={4}>
        {/* Task Creation Form */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              background: 'linear-gradient(to right bottom, #f6d365 0%, #fda085 100%)',
              color: 'white'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <AddIcon /> Create New Task
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Task Title"
                  variant="outlined"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      background: 'white' 
                    } 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  variant="outlined"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      background: 'white' 
                    } 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    label="Assign To"
                    required
                    sx={{ background: 'white' }}
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.name}>
                        {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    label="Priority"
                    sx={{ background: 'white' }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddTask}
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(to right, #11998e, #38ef7d)'
                  }}
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Task List */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              background: theme => theme.palette.background.paper
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              Active Tasks
            </Typography>
            
            {tasks.length === 0 ? (
              <Typography 
                variant="body1" 
                color="textSecondary" 
                align="center"
              >
                No tasks assigned. Create a new task!
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {tasks.map((task) => (
                  <Grid item xs={12} key={task.id}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: theme => theme.shadows[4]
                        }
                      }}
                    >
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ mt: 1 }}
                          >
                            {task.description}
                          </Typography>
                        )}
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Chip 
                            label={task.assignedTo} 
                            color="primary" 
                            size="small" 
                          />
                          <Chip 
                            label={task.priority} 
                            color={
                              task.priority === 'high' 
                                ? 'error' 
                                : task.priority === 'medium' 
                                  ? 'warning' 
                                  : 'default'
                            } 
                            size="small" 
                          />
                        </Box>
                      </Box>
                      
                      <Box>
                        <Tooltip title="Mark as Complete">
                          <IconButton 
                            color="success" 
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Task">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default TaskTab;
