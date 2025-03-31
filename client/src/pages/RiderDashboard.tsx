import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../context/AuthContext';

// Mock data for rides (in a real app, this would come from API)
const mockRides = [
  {
    _id: '1',
    status: 'requested',
    pickupLocation: {
      address: 'Student Center',
      coordinates: [-97.123, 32.456]
    },
    dropoffLocation: {
      address: 'Library',
      coordinates: [-97.123, 32.456]
    },
    requestTime: new Date(Date.now() - 5 * 60000).toISOString(),
    driver: null
  },
  {
    _id: '2',
    status: 'in_progress',
    pickupLocation: {
      address: 'Science Building',
      coordinates: [-97.123, 32.456]
    },
    dropoffLocation: {
      address: 'Dormitory C',
      coordinates: [-97.123, 32.456]
    },
    requestTime: new Date(Date.now() - 15 * 60000).toISOString(),
    driver: {
      firstName: 'John',
      lastName: 'Driver',
      phoneNumber: '555-123-4567'
    }
  },
  {
    _id: '3',
    status: 'completed',
    pickupLocation: {
      address: 'Recreation Center',
      coordinates: [-97.123, 32.456]
    },
    dropoffLocation: {
      address: 'Student Union',
      coordinates: [-97.123, 32.456]
    },
    requestTime: new Date(Date.now() - 120 * 60000).toISOString(),
    driver: {
      firstName: 'Sarah',
      lastName: 'Driver',
      phoneNumber: '555-987-6543'
    }
  }
];

const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [pastRides, setPastRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch rides
    setTimeout(() => {
      try {
        const active = mockRides.filter(ride => 
          ride.status === 'requested' || ride.status === 'accepted' || ride.status === 'in_progress'
        );
        const past = mockRides.filter(ride => 
          ride.status === 'completed' || ride.status === 'cancelled'
        );
        
        setActiveRides(active);
        setPastRides(past);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load rides');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'requested':
        return <Chip label="Requested" color="warning" icon={<AccessTimeIcon />} />;
      case 'accepted':
        return <Chip label="Accepted" color="info" icon={<CheckCircleIcon />} />;
      case 'in_progress':
        return <Chip label="In Progress" color="primary" icon={<DirectionsCarIcon />} />;
      case 'completed':
        return <Chip label="Completed" color="success" icon={<CheckCircleIcon />} />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} />;
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hi, {user?.firstName}!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Need a ride? Request one now and our drivers will pick you up in a golf cart.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/rider/request"
          sx={{ mb: 4 }}
        >
          Request a Ride
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h5" component="h2" gutterBottom>
          Active Rides
        </Typography>

        {activeRides.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', mb: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You don't have any active rides.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            {activeRides.map((ride) => (
              <Card key={ride._id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      Ride #{ride._id}
                    </Typography>
                    {getStatusChip(ride.status)}
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Pickup:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {ride.pickupLocation.address}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Dropoff:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {ride.dropoffLocation.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Requested at {formatTime(ride.requestTime)}
                  </Typography>
                  
                  {ride.driver && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Driver:
                      </Typography>
                      <Typography variant="body1">
                        {ride.driver.firstName} {ride.driver.lastName} ({ride.driver.phoneNumber})
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/ride/${ride._id}`}
                  >
                    View Details
                  </Button>
                  {ride.status === 'requested' && (
                    <Button 
                      size="small" 
                      color="error"
                    >
                      Cancel Ride
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Past Rides
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<HistoryIcon />}
            component={RouterLink}
            to="/rider/history"
          >
            View All
          </Button>
        </Box>

        {pastRides.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              You haven't taken any rides yet.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {pastRides.map((ride) => (
              <Box key={ride._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1">
                        Ride #{ride._id}
                      </Typography>
                      {getStatusChip(ride.status)}
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {ride.pickupLocation.address} → {ride.dropoffLocation.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(ride.requestTime)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={RouterLink} 
                      to={`/ride/${ride._id}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default RiderDashboard; 