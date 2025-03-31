import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HistoryIcon from '@mui/icons-material/History';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../context/AuthContext';

// Mock data for available rides (in a real app, this would come from API)
const mockAvailableRides = [
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
    rider: {
      firstName: 'Jane',
      lastName: 'Student',
      phoneNumber: '555-123-7890'
    }
  },
  {
    _id: '4',
    status: 'requested',
    pickupLocation: {
      address: 'Music Building',
      coordinates: [-97.123, 32.456]
    },
    dropoffLocation: {
      address: 'Student Union',
      coordinates: [-97.123, 32.456]
    },
    requestTime: new Date(Date.now() - 2 * 60000).toISOString(),
    rider: {
      firstName: 'Mike',
      lastName: 'Smith',
      phoneNumber: '555-987-1234'
    }
  }
];

// Mock data for assigned rides
const mockAssignedRides = [
  {
    _id: '2',
    status: 'accepted',
    pickupLocation: {
      address: 'Science Building',
      coordinates: [-97.123, 32.456]
    },
    dropoffLocation: {
      address: 'Dormitory C',
      coordinates: [-97.123, 32.456]
    },
    requestTime: new Date(Date.now() - 15 * 60000).toISOString(),
    rider: {
      firstName: 'Bob',
      lastName: 'Johnson',
      phoneNumber: '555-555-5555'
    }
  }
];

// Mock data for completed rides
const mockCompletedRides = [
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
    rider: {
      firstName: 'Alex',
      lastName: 'Williams',
      phoneNumber: '555-333-4444'
    }
  }
];

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOnDuty, setIsOnDuty] = useState(user?.isOnDuty || false);
  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const [assignedRides, setAssignedRides] = useState<any[]>([]);
  const [completedRides, setCompletedRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch rides
    setTimeout(() => {
      try {
        setAvailableRides(isOnDuty ? mockAvailableRides : []);
        setAssignedRides(mockAssignedRides);
        setCompletedRides(mockCompletedRides);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load rides');
        setLoading(false);
      }
    }, 1000);
  }, [isOnDuty]);

  const handleDutyToggle = () => {
    setIsOnDuty(!isOnDuty);
    // In a real app, would make API call to update status
  };

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
          Driver Dashboard
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your rides and duty status.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isOnDuty}
                  onChange={handleDutyToggle}
                  color="primary"
                />
              }
              label={isOnDuty ? "On Duty" : "Off Duty"}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {isOnDuty 
                ? "You are currently available to receive ride requests." 
                : "Toggle to 'On Duty' to start receiving ride requests."}
            </Typography>
          </Paper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {isOnDuty && (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Available Ride Requests
            </Typography>

            {availableRides.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', mb: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No ride requests available at the moment.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                {availableRides.map((ride) => (
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
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Rider:
                        </Typography>
                        <Typography variant="body1">
                          {ride.rider.firstName} {ride.rider.lastName} ({ride.rider.phoneNumber})
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={RouterLink} 
                        to={`/ride/${ride._id}`}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="small"
                        variant="contained" 
                        color="primary"
                      >
                        Accept Ride
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}

        <Typography variant="h5" component="h2" gutterBottom>
          Current Rides
        </Typography>

        {assignedRides.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', mb: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You have no current rides.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            {assignedRides.map((ride) => (
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
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Rider:
                    </Typography>
                    <Typography variant="body1">
                      {ride.rider.firstName} {ride.rider.lastName} ({ride.rider.phoneNumber})
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/ride/${ride._id}`}
                  >
                    View Details
                  </Button>
                  {ride.status === 'accepted' && (
                    <Button 
                      size="small"
                      variant="contained" 
                      color="primary"
                    >
                      Start Ride
                    </Button>
                  )}
                  {ride.status === 'in_progress' && (
                    <Button 
                      size="small"
                      variant="contained" 
                      color="success"
                    >
                      Complete Ride
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Completed Rides
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<HistoryIcon />}
            component={RouterLink}
            to="/driver/history"
          >
            View All
          </Button>
        </Box>

        {completedRides.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              You haven't completed any rides yet.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {completedRides.map((ride) => (
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

export default DriverDashboard; 