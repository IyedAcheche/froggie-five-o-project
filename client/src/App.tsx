import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import DispatcherDashboard from './pages/DispatcherDashboard';
import RideRequest from './pages/RideRequest';
import RideDetails from './pages/RideDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode, requiredRole?: string }> = ({ 
  element, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/rider-dashboard" 
              element={
                <ProtectedRoute 
                  element={<RiderDashboard />} 
                  requiredRole="RIDER" 
                />
              } 
            />
            
            <Route 
              path="/driver-dashboard" 
              element={
                <ProtectedRoute 
                  element={<DriverDashboard />}
                  requiredRole="DRIVER" 
                />
              } 
            />
            
            <Route 
              path="/dispatcher-dashboard" 
              element={
                <ProtectedRoute 
                  element={<DispatcherDashboard />}
                  requiredRole="DISPATCHER" 
                />
              } 
            />
            
            <Route 
              path="/request-ride" 
              element={
                <ProtectedRoute 
                  element={<RideRequest />}
                  requiredRole="RIDER" 
                />
              } 
            />
            
            <Route 
              path="/ride/:id" 
              element={
                <ProtectedRoute 
                  element={<RideDetails />}
                />
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute 
                  element={<Profile />}
                />
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
