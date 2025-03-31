import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Box, 
  Paper, 
  Avatar,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phoneNumber: string;
}

const Register: React.FC = () => {
  const { register, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.RIDER,
    phoneNumber: ''
  });
  
  const [formErrors, setFormErrors] = useState<Partial<RegisterFormData>>({});
  
  const { firstName, lastName, email, password, confirmPassword, role, phoneNumber } = formData;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user types
    if (formErrors[name as keyof RegisterFormData]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
    
    if (error) clearError();
  };
  
  const handleSelectChange = (e: SelectChangeEvent<UserRole>) => {
    setFormData({ ...formData, role: e.target.value as UserRole });
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<RegisterFormData> = {};
    
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Phone number is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register({
        firstName,
        lastName,
        email,
        role,
        phoneNumber
      }, password);
      
      navigate('/');
    } catch (err) {
      // Error is handled in the auth context
    }
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8, 
          mb: 4,
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create an Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={handleChange}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
            />
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={handleChange}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
            />
          </Box>
          
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
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            value={phoneNumber}
            onChange={handleChange}
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber || 'Format: 123-456-7890'}
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={handleSelectChange}
            >
              <MenuItem value={UserRole.RIDER}>Rider</MenuItem>
              <MenuItem value={UserRole.DRIVER}>Driver</MenuItem>
              <MenuItem value={UserRole.DISPATCHER}>Dispatcher</MenuItem>
            </Select>
            <FormHelperText>
              {role === UserRole.RIDER && 'Request rides around campus'}
              {role === UserRole.DRIVER && 'Drive a golf cart to pick up riders'}
              {role === UserRole.DISPATCHER && 'Manage rides and drivers'}
            </FormHelperText>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
            />
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 