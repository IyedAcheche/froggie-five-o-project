import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Alert,
  CircularProgress,
  Autocomplete,
  Grid
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Mock campus locations
const campusLocations = [
  { label: 'Student Center', value: 'student_center' },
  { label: 'Library', value: 'library' },
  { label: 'Science Building', value: 'science_building' },
  { label: 'Recreation Center', value: 'recreation_center' },
  { label: 'Dormitory A', value: 'dorm_a' },
  { label: 'Dormitory B', value: 'dorm_b' },
  { label: 'Dormitory C', value: 'dorm_c' },
  { label: 'Music Building', value: 'music_building' },
  { label: 'Student Union', value: 'student_union' },
  { label: 'Campus Store', value: 'campus_store' },
  { label: 'Administration Building', value: 'admin_building' }
];

interface FormData {
  pickupLocation: string;
  dropoffLocation: string;
  notes: string;
}

const RideRequest: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    pickupLocation: '',
    dropoffLocation: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePickupChange = (_event: React.SyntheticEvent, value: string | null) => {
    setFormData({ ...formData, pickupLocation: value || '' });
  };

  const handleDropoffChange = (_event: React.SyntheticEvent, value: string | null) => {
    setFormData({ ...formData, dropoffLocation: value || '' });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.pickupLocation) {
      setError('Please select a pickup location');
      return;
    }
    
    if (!formData.dropoffLocation) {
      setError('Please select a dropoff location');
      return;
    }
    
    if (formData.pickupLocation === formData.dropoffLocation) {
      setError('Pickup and dropoff locations must be different');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    // In a real app, this would be an API call to create a ride request
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      
      // Redirect to rider dashboard after a short delay
      setTimeout(() => {
        navigate('/rider-dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to create ride request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Request a Ride
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Need a safe escort around campus? Request a ride now and our drivers will pick you up in a golf cart.
        </Typography>
        
        {success ? (
          <Alert severity="success" sx={{ mb: 4 }}>
            Your ride request has been created successfully! Redirecting to dashboard...
          </Alert>
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={campusLocations.map(location => location.label)}
                  onChange={handlePickupChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pickup Location"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={campusLocations.map(location => location.label)}
                  onChange={handleDropoffChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Dropoff Location"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Additional Notes (Optional)"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleNotesChange}
                  placeholder="E.g., I'm in a wheelchair, I have luggage, I'll be with 2 other people, etc."
                />
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Request Ride'}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default RideRequest; 