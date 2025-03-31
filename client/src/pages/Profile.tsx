import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Button,
  Divider,
  TextField,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            src={user.profilePicture} 
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 100, height: 100, mr: 3, bgcolor: 'primary.main' }}
          >
            {user.firstName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role === UserRole.RIDER && 'Rider'}
              {user.role === UserRole.DRIVER && 'Driver'}
              {user.role === UserRole.DISPATCHER && 'Dispatcher'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Email"
            value={user.email}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={user.phoneNumber}
            disabled
            sx={{ mb: 2 }}
          />
          
          {user.role === UserRole.DRIVER && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Typography variant="body1">
                {user.isOnDuty ? 'On Duty' : 'Off Duty'}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Member Since
            </Typography>
            <Typography variant="body1">
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant="outlined">Change Password</Button>
          <Button variant="contained">Edit Profile</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 