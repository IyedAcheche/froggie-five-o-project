import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  ListItemIcon,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!isAuthenticated) return [];

    const links = [{ title: 'Home', path: '/' }];

    switch (user?.role) {
      case UserRole.RIDER:
        links.push(
          { title: 'Dashboard', path: '/rider-dashboard' },
          { title: 'Request Ride', path: '/request-ride' }
        );
        break;
      case UserRole.DRIVER:
        links.push({ title: 'Dashboard', path: '/driver-dashboard' });
        break;
      case UserRole.DISPATCHER:
        links.push({ title: 'Dashboard', path: '/dispatcher-dashboard' });
        break;
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo variant="full" color="light" />
            </RouterLink>
          </Box>

          {/* Mobile Logo and Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="menu"
              color="inherit"
              onClick={handleToggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo variant="icon" color="light" />
            </RouterLink>
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={{ my: 2, color: 'white', display: 'block', mx: 1 }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          {/* User menu (desktop) */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={`${user?.firstName} ${user?.lastName}`} 
                      src={user?.profilePicture || undefined}
                    >
                      {user?.firstName?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) :
              <Box sx={{ display: 'flex' }}>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary"
                  component={RouterLink} 
                  to="/register"
                >
                  Sign Up
                </Button>
              </Box>
            }
          </Box>
        </Toolbar>

        {/* Mobile drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleToggleDrawer}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleToggleDrawer}
          >
            <Box sx={{ p: 2 }}>
              <Logo variant="full" size="small" />
            </Box>
            <Divider />
            <List>
              {navLinks.map((link) => (
                <ListItem disablePadding key={link.path}>
                  <ListItemButton component={RouterLink} to={link.path}>
                    <ListItemText primary={link.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            {isAuthenticated ? (
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/profile">
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </List>
            ) : (
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/login">
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/register">
                    <ListItemText primary="Sign Up" />
                  </ListItemButton>
                </ListItem>
              </List>
            )}
          </Box>
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Navbar; 