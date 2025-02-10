import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Avatar, 
  CssBaseline 
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Predefined users with specific role-based permissions
const USERS = [
  { 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin',
    name: 'Admin User',
    permissions: [
      'dashboard', 
      'add-employee', 
      'add-department', 
      'employees', 
      'departments', 
      'tasks', 
      'leave-management'
    ]
  },
  { 
    username: 'manager', 
    password: 'manager123', 
    role: 'manager',
    name: 'John Doe',
    permissions: [
      'dashboard', 
      'employees',  
      'tasks', 
      'leave-management'
    ]
  },
  { 
    username: 'hr', 
    password: 'hr123', 
    role: 'hr',
    name: 'Jane Smith',
    permissions: [
      'dashboard', 
      'employees',  
      'departments',
      'add-employee'
    ]
  }
];

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Find user
    const user = USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Successful login
      login({
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      });
      
      // Redirect to dashboard by default
      navigate('/');
    } else {
      // Failed login
      setError('Invalid username or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper 
        elevation={6} 
        sx={{ 
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2
        }}
      >
        <Avatar sx={{ 
          m: 1, 
          bgcolor: 'secondary.main',
          width: 56, 
          height: 56 
        }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          noValidate 
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ mt: 2, textAlign: 'center' }}
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
