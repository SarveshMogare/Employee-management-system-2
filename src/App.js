import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import authentication context
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Import components
import Dashboard from './components/Dashboard';
import AddEmployee from './components/AddEmployee';
import EmployeeList from './components/EmployeeList';
import LeaveManagement from './components/LeaveManagement';
import Navbar from './components/Navbar';
import Login from './components/Login';
import EmployeeProfile from './components/EmployeeProfile';
import DepartmentList from './components/DepartmentList';
import TaskTab from './components/TaskTab';
import EditEmployee from './components/EditEmployee';

// Protected Route Component with Role Validation
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required permission
  if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
    // Redirect to dashboard or show unauthorized page
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            {alert('username: admin, password: admin123')}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute requiredPermission="dashboard">
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-employee" 
              element={
                <ProtectedRoute requiredPermission="add-employee">
                  <Navbar />
                  <AddEmployee />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute requiredPermission="employees">
                  <Navbar />
                  <EmployeeList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees/edit/:id" 
              element={
                <ProtectedRoute requiredPermission="employees">
                  <Navbar />
                  <EditEmployee />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees/profile/:id" 
              element={
                <ProtectedRoute requiredPermission="employees">
                  <Navbar />
                  <EmployeeProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/departments" 
              element={
                <ProtectedRoute requiredPermission="departments">
                  <Navbar />
                  <DepartmentList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute requiredPermission="tasks">
                  <Navbar />
                  <TaskTab />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leave-management" 
              element={
                <ProtectedRoute requiredPermission="leave-management">
                  <Navbar />
                  <LeaveManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect to login for unknown routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
