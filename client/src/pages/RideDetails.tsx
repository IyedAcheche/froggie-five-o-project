import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatIcon from '@mui/icons-material/Chat';
import CallIcon from '@mui/icons-material/Call';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';
import RideMap from '../components/RideMap';

// Mock ride data (in a real app, this would come from an API)
const mockRide = {
  _id: '1',
  status: 'in_progress',
  pickupLocation: {
    address: 'Student Center',
    coordinates: [-97.3651, 32.7088] // Actual coordinates for a TCU location
  },
  dropoffLocation: {
    address: 'Library',
    coordinates: [-97.3602, 32.7094] // Actual coordinates for another TCU location
  },
  requestTime: new Date(Date.now() - 15 * 60000).toISOString(),
  acceptTime: new Date(Date.now() - 10 * 60000).toISOString(),
  pickupTime: new Date(Date.now() - 5 * 60000).toISOString(),
  estimatedDropoffTime: new Date(Date.now() + 5 * 60000).toISOString(),
  rider: {
    _id: '101',
    firstName: 'Jane',
    lastName: 'Student',
    phoneNumber: '555-123-7890'
  },
  driver: {
    _id: '201',
    firstName: 'John',
    lastName: 'Driver',
    phoneNumber: '555-123-4567',
    location: {
      coordinates: [-97.3630, 32.7091] // This would be updated in real-time in a real app
    }
  },
  cart: {
    _id: '301',
    cartNumber: '1'
  },
  notes: 'I have two bags with me.'
};

const RideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch ride details
    const fetchRide = async () => {
      try {
        // In a real app, this would be a fetch to your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, just use mock data
        setRide({...mockRide, _id: id});
        setLoading(false);
      } catch (err) {
        setError('Failed to load ride details');
        setLoading(false);
      }
    };

    fetchRide();
  }, [id]);

  // Mock driver position update every few seconds (simulating real-time updates)
  useEffect(() => {
    if (!ride || ride.status !== 'in_progress') return;

    const updateDriverLocation = () => {
      // Simulate small movement in a random direction
      const latChange = (Math.random() - 0.5) * 0.0005;
      const lngChange = (Math.random() - 0.5) * 0.0005;
      
      setRide((prevRide: typeof ride) => ({
        ...prevRide,
        driver: {
          ...prevRide.driver,
          location: {
            coordinates: [
              prevRide.driver.location.coordinates[0] + lngChange,
              prevRide.driver.location.coordinates[1] + latChange
            ]
          }
        }
      }));
    };

    // Update driver position every 5 seconds
    const interval = setInterval(updateDriverLocation, 5000);
    return () => clearInterval(interval);
  }, [ride]);

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
  
  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString();
  };

  const handleCancelDialogOpen = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };

  const handleCancelReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCancelReason(e.target.value);
  };

  const handleCancelRide = async () => {
    setCancelling(true);
    
    try {
      // In a real app, this would be an API call to cancel the ride
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the ride status locally
      setRide({ ...ride, status: 'cancelled' });
      setCancelDialogOpen(false);
    } catch (err) {
      setError('Failed to cancel ride');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!ride) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Ride not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ride Details
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Ride #{ride._id}
            </Typography>
            {getStatusChip(ride.status)}
          </Box>
          
          {/* Map showing pickup, dropoff, and driver locations */}
          {ride.status !== 'cancelled' && (
            <RideMap 
              pickupLocation={ride.pickupLocation}
              dropoffLocation={ride.dropoffLocation}
              driverLocation={ride.driver?.location}
            />
          )}
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <LocationOnIcon color="success" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pickup Location
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {ride.pickupLocation.address}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <MyLocationIcon color="error" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Dropoff Location
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {ride.dropoffLocation.address}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Request Time
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(ride.requestTime)} at {formatTime(ride.requestTime)}
              </Typography>
            </Box>
            
            {ride.status === 'in_progress' && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Estimated Arrival
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatTime(ride.estimatedDropoffTime)}
                </Typography>
              </Box>
            )}
            
            {ride.notes && (
              <Box sx={{ gridColumn: { md: '1 / 3' } }}>
                <Typography variant="body2" color="text.secondary">
                  Additional Notes
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {ride.notes}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {ride.driver && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Driver Information
                </Typography>
                <Typography variant="body1">
                  {ride.driver.firstName} {ride.driver.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cart #{ride.cart.cartNumber}
                </Typography>
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<CallIcon />}
                    size="small"
                    href={`tel:${ride.driver.phoneNumber}`}
                  >
                    Call
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<ChatIcon />}
                    size="small"
                  >
                    Chat
                  </Button>
                </Box>
              </Paper>
            )}
            
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Rider Information
              </Typography>
              <Typography variant="body1">
                {ride.rider.firstName} {ride.rider.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {ride.rider.phoneNumber}
              </Typography>
              
              {user?.role !== UserRole.RIDER && (
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<CallIcon />}
                    size="small"
                    href={`tel:${ride.rider.phoneNumber}`}
                  >
                    Call Rider
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            
            {(user?.role === UserRole.RIDER || user?.role === UserRole.DISPATCHER) && 
             (ride.status === 'requested' || ride.status === 'accepted') && (
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelDialogOpen}
              >
                Cancel Ride
              </Button>
            )}
            
            {user?.role === UserRole.DRIVER && ride.status === 'in_progress' && (
              <Button
                variant="contained"
                color="success"
              >
                Complete Ride
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCancelDialogClose}>
        <DialogTitle>Cancel Ride</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this ride? Please provide a reason for cancellation.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for cancellation"
            fullWidth
            variant="outlined"
            value={cancelReason}
            onChange={handleCancelReasonChange}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>
            Go Back
          </Button>
          <Button 
            onClick={handleCancelRide} 
            color="error" 
            disabled={cancelling}
          >
            {cancelling ? <CircularProgress size={24} /> : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RideDetails; 