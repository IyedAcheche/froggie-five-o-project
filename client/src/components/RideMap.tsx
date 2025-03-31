import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import { Box, Typography, CircularProgress } from '@mui/material';

// Get API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

// Default center to TCU campus
const defaultCenter = {
  lat: 32.7095,
  lng: -97.3682
};

interface RideMapProps {
  pickupLocation: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  dropoffLocation: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  driverLocation?: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const RideMap: React.FC<RideMapProps> = ({ 
  pickupLocation, 
  dropoffLocation, 
  driverLocation 
}) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert longitude, latitude array to lat/lng object for Google Maps
  const pickupLatLng = {
    lat: pickupLocation.coordinates[1],
    lng: pickupLocation.coordinates[0]
  };

  const dropoffLatLng = {
    lat: dropoffLocation.coordinates[1],
    lng: dropoffLocation.coordinates[0]
  };

  const driverLatLng = driverLocation ? {
    lat: driverLocation.coordinates[1],
    lng: driverLocation.coordinates[0]
  } : null;

  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && result) {
      setDirections(result);
    } else {
      setError(`Error fetching directions: ${status}`);
    }
  };

  const handleMapLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '400px', mb: 3 }}>
      {!isLoaded && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 2
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={driverLatLng || pickupLatLng}
          zoom={14}
          onLoad={handleMapLoad}
        >
          {/* Pickup Location Marker */}
          <Marker
            position={pickupLatLng}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            title="Pickup Location"
          />

          {/* Dropoff Location Marker */}
          <Marker
            position={dropoffLatLng}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            title="Dropoff Location"
          />

          {/* Driver Location Marker (if available) */}
          {driverLatLng && (
            <Marker
              position={driverLatLng}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
              title="Driver Location"
            />
          )}

          {/* Direction Service */}
          <DirectionsService
            options={{
              origin: pickupLatLng,
              destination: dropoffLatLng,
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={directionsCallback}
          />

          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                suppressMarkers: true
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'green' }} />
          <Typography variant="caption">Pickup</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'red' }} />
          <Typography variant="caption">Dropoff</Typography>
        </Box>
        {driverLatLng && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'blue' }} />
            <Typography variant="caption">Driver</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RideMap; 