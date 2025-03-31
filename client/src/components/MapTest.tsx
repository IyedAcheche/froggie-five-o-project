import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import RideMap from './RideMap';

// Sample test data
const testPickupLocation = {
  address: 'TCU Student Center',
  coordinates: [-97.3651, 32.7088] as [number, number] // [longitude, latitude]
};

const testDropoffLocation = {
  address: 'TCU Library',
  coordinates: [-97.3602, 32.7094] as [number, number] // [longitude, latitude]
};

const testDriverLocation = {
  coordinates: [-97.3630, 32.7091] as [number, number] // [longitude, latitude]
};

const MapTest: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Google Maps Test Page
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Map with Driver, Pickup, and Dropoff
          </Typography>
          
          <Typography variant="body2" paragraph color="text.secondary">
            This is a test of the RideMap component showing a driver's location, pickup point, and dropoff point.
            You should see three markers and a route between the pickup and dropoff locations.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              API Key Status: {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Set (but may be invalid)' : 'Not Set'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              If you see a "Development purposes only" watermark or errors, your API key may be invalid or missing.
            </Typography>
          </Box>
          
          <RideMap 
            pickupLocation={testPickupLocation}
            dropoffLocation={testDropoffLocation}
            driverLocation={testDriverLocation}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="bold">
              Test Data:
            </Typography>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
              {JSON.stringify(
                {
                  pickupLocation: testPickupLocation,
                  dropoffLocation: testDropoffLocation,
                  driverLocation: testDriverLocation
                }, 
                null, 
                2
              )}
            </pre>
          </Box>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Map with Only Pickup and Dropoff
          </Typography>
          
          <Typography variant="body2" paragraph color="text.secondary">
            This is a test of the RideMap component without a driver location.
            You should see two markers and a route between them.
          </Typography>
          
          <RideMap 
            pickupLocation={testPickupLocation}
            dropoffLocation={testDropoffLocation}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default MapTest; 