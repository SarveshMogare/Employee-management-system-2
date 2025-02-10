import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  PersonAdd as PersonAddIcon, 
  People as PeopleIcon,
  Business as BusinessIcon,
  Task as TaskIcon,
  AttachMoney as MoneyIcon,
  Logout as LogoutIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const navigateTo = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate menu items based on user permissions
  const getMenuItems = () => {
    const allMenuItems = [
      { 
        text: 'Dashboard', 
        icon: <DashboardIcon />, 
        path: '/',
        permission: 'dashboard'
      },
      { 
        text: 'Add Employee', 
        icon: <PersonAddIcon />, 
        path: '/add-employee',
        permission: 'add-employee'
      },
      { 
        text: 'Employees', 
        icon: <PeopleIcon />, 
        path: '/employees',
        permission: 'employees'
      },
      { 
        text: 'Departments', 
        icon: <BusinessIcon />, 
        path: '/departments',
        permission: 'departments'
      },
      { 
        text: 'Tasks', 
        icon: <TaskIcon />, 
        path: '/tasks',
        permission: 'tasks'
      },
      { 
        text: 'Leave Management', 
        icon: <EventIcon />, 
        path: '/leave-management',
        permission: 'leave-management'
      }
    ];

    // If user is admin, return all menu items
    if (user?.role === 'admin') {
      return allMenuItems;
    }

    // Otherwise, filter menu items based on user permissions
    const filteredMenuItems = allMenuItems.filter(item => 
      user?.permissions?.includes(item.permission)
    );

    // Ensure employees tab is visible for HR and Manager
    if (user?.role === 'hr' || user?.role === 'manager') {
      const employeesItem = allMenuItems.find(item => item.text === 'Employees');
      if (!filteredMenuItems.includes(employeesItem)) {
        filteredMenuItems.push(employeesItem);
      }
    }

    return filteredMenuItems;
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Employee Management System
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {user?.name || 'User'}
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <List sx={{ width: 250, pt: 8 }}>
          {getMenuItems().map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigateTo(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
