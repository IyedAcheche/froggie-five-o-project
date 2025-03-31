import axios from 'axios';
import { AuthResponse, UserRole } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Store auth token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Get auth token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Remove auth token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Register a new user
export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole,
  phoneNumber: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
    firstName,
    lastName,
    email,
    password,
    role,
    phoneNumber
  });
  
  return response.data;
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    setToken(response.data.token);
  }
  
  return response.data;
};

// Logout user
export const logout = (): void => {
  removeToken();
};

// Get current user profile
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await axios.get<AuthResponse>(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
}; 