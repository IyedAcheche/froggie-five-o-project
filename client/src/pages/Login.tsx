import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  Box, 
  Paper, 
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const { login, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Demo accounts:
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Rider: rider@example.com / password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Driver: driver@example.com / password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dispatcher: dispatcher@example.com / password
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 