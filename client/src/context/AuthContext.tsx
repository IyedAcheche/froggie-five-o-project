import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, verify the token with your backend
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser) as User;
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, send a request to your backend API
      // const response = await api.post('/auth/login', { email, password });
      
      // For demo purposes, we'll mock a successful login
      if (email === 'rider@example.com' && password === 'password') {
        const mockUser: User = {
          _id: '1',
          firstName: 'John',
          lastName: 'Rider',
          email: 'rider@example.com',
          role: UserRole.RIDER,
          phoneNumber: '555-123-4567',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Mock token
        const token = 'mock-token-rider';
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } else if (email === 'driver@example.com' && password === 'password') {
        const mockUser: User = {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Driver',
          email: 'driver@example.com',
          role: UserRole.DRIVER,
          phoneNumber: '555-987-6543',
          isOnDuty: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Mock token
        const token = 'mock-token-driver';
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } else if (email === 'dispatcher@example.com' && password === 'password') {
        const mockUser: User = {
          _id: '3',
          firstName: 'Alex',
          lastName: 'Dispatcher',
          email: 'dispatcher@example.com',
          role: UserRole.DISPATCHER,
          phoneNumber: '555-765-4321',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Mock token
        const token = 'mock-token-dispatcher';
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, send a request to your backend API
      // const response = await api.post('/auth/register', { ...userData, password });
      
      // For demo purposes, we'll mock a successful registration
      const mockUser: User = {
        _id: '4',
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        email: userData.email || 'newuser@example.com',
        role: userData.role || UserRole.RIDER,
        phoneNumber: userData.phoneNumber || '555-000-0000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Mock token
      const token = 'mock-token-new-user';
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 