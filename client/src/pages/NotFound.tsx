import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center'
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 4 }} />
        
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4, maxWidth: '600px' }}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/"
        >
          Go to Home Page
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 