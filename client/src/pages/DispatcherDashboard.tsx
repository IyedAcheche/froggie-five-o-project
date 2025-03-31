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
  Tabs,
  Tab
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../context/AuthContext';

// Mock data for active rides
const mockActiveRides = [
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
    },
    driver: null
  },
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
    },
    driver: {
      firstName: 'John',
      lastName: 'Driver',
      phoneNumber: '555-123-4567'
    }
  }
];

// Mock data for available drivers
const mockDrivers = [
  {
    _id: '101',
    firstName: 'John',
    lastName: 'Driver',
    phoneNumber: '555-123-4567',
    isOnDuty: true,
    currentRide: '2'
  },
  {
    _id: '102',
    firstName: 'Sarah',
    lastName: 'Driver',
    phoneNumber: '555-987-6543',
    isOnDuty: true,
    currentRide: null
  },
  {
    _id: '103',
    firstName: 'Michael',
    lastName: 'Driver',
    phoneNumber: '555-876-5432',
    isOnDuty: false,
    currentRide: null
  }
];

// Mock data for carts
const mockCarts = [
  {
    _id: '201',
    cartNumber: '1',
    status: 'in_use',
    currentDriver: '101'
  },
  {
    _id: '202',
    cartNumber: '2',
    status: 'available',
    currentDriver: null
  },
  {
    _id: '203',
    cartNumber: '3',
    status: 'maintenance',
    currentDriver: null
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const DispatcherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch data
    setTimeout(() => {
      try {
        setActiveRides(mockActiveRides);
        setDrivers(mockDrivers);
        setCarts(mockCarts);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load data');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const getCartStatusChip = (status: string) => {
    switch (status) {
      case 'available':
        return <Chip label="Available" color="success" />;
      case 'in_use':
        return <Chip label="In Use" color="primary" />;
      case 'maintenance':
        return <Chip label="Maintenance" color="error" />;
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dispatcher Dashboard
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage rides, drivers, and carts from this central dashboard.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="dispatcher tabs">
              <Tab label="Active Rides" icon={<TimelineIcon />} iconPosition="start" />
              <Tab label="Drivers" icon={<PersonIcon />} iconPosition="start" />
              <Tab label="Carts" icon={<DirectionsCarIcon />} iconPosition="start" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Active Rides
              </Typography>
              <Button variant="contained" color="primary">
                Create Manual Ride
              </Button>
            </Box>
            
            {activeRides.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No active rides at the moment.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
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
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Rider:
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {ride.rider.firstName} {ride.rider.lastName} ({ride.rider.phoneNumber})
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Driver:
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {ride.driver ? `${ride.driver.firstName} ${ride.driver.lastName}` : 'Unassigned'}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Requested at {formatTime(ride.requestTime)}
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
                      {ride.status === 'requested' && (
                        <Button 
                          size="small"
                          variant="contained" 
                          color="primary"
                        >
                          Assign Driver
                        </Button>
                      )}
                      <Button 
                        size="small"
                        color="error"
                      >
                        Cancel Ride
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Drivers
              </Typography>
            </Box>
            
            {drivers.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No drivers available.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {drivers.map((driver) => (
                  <Card key={driver._id}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">
                          {driver.firstName} {driver.lastName}
                        </Typography>
                        <Chip 
                          label={driver.isOnDuty ? 'On Duty' : 'Off Duty'} 
                          color={driver.isOnDuty ? 'success' : 'default'} 
                        />
                      </Box>
                      <Typography variant="body1">
                        Phone: {driver.phoneNumber}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Ride: {driver.currentRide ? `#${driver.currentRide}` : 'None'}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small"
                        component={RouterLink}
                        to={`/users/${driver._id}`}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="small"
                        color="primary"
                        disabled={!driver.isOnDuty || !!driver.currentRide}
                      >
                        Assign Ride
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Carts
              </Typography>
              <Button variant="contained" color="primary">
                Add New Cart
              </Button>
            </Box>
            
            {carts.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No carts available.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {carts.map((cart) => (
                  <Card key={cart._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 8px)' } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">
                          Cart #{cart.cartNumber}
                        </Typography>
                        {getCartStatusChip(cart.status)}
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Driver: 
                        </Typography>
                        <Typography variant="body1">
                          {cart.currentDriver ? 
                            drivers.find(d => d._id === cart.currentDriver)?.firstName + ' ' + 
                            drivers.find(d => d._id === cart.currentDriver)?.lastName 
                            : 'Unassigned'}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small"
                        component={RouterLink}
                        to={`/carts/${cart._id}`}
                      >
                        View Details
                      </Button>
                      {cart.status === 'available' && (
                        <Button 
                          size="small"
                          color="primary"
                        >
                          Assign Driver
                        </Button>
                      )}
                      {cart.status === 'in_use' && (
                        <Button 
                          size="small"
                          color="error"
                        >
                          Unassign
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
        </Box>
      </Box>
    </Container>
  );
};

export default DispatcherDashboard; 