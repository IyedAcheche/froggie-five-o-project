import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)'
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(rgba(77, 25, 121, 0.9), rgba(77, 25, 121, 0.75)), url('/campus-night.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: theme.spacing(10, 0),
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container>
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Logo variant="full" size="large" color="light" />
            </Box>
            
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Campus Safety Escort Service
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.9
              }}
            >
              Free rides for TCU students, faculty, and staff to ensure your safety around campus.
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="secondary"
                size="large"
                sx={{ 
                  mr: 2, 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[6],
                  },
                  mb: { xs: 2, sm: 0 }
                }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              
              <Button 
                variant="outlined"
                size="large"  
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            color: theme.palette.primary.main,
            fontWeight: 700
          }}
        >
          Why Choose Froggie Five-O?
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}>
          {/* Card 1 */}
          <Card sx={{ 
            flex: 1,
            height: '100%', 
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: theme.shadows[8]
            }
          }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: theme.palette.primary.main, 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'center' 
            }}>
              <SecurityIcon sx={{ fontSize: 60 }} />
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                Campus Safety
              </Typography>
              <Typography variant="body1">
                Our top priority is ensuring the safety of all TCU students, faculty, and staff. 
                We provide secure transportation around campus when you need it most.
              </Typography>
            </CardContent>
          </Card>
          
          {/* Card 2 */}
          <Card sx={{ 
            flex: 1,
            height: '100%', 
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: theme.shadows[8]
            }
          }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: theme.palette.secondary.main, 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'center' 
            }}>
              <SpeedIcon sx={{ fontSize: 60 }} />
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                Quick Response
              </Typography>
              <Typography variant="body1">
                Our fleet of golf carts and trained drivers ensure you get a ride quickly.
                Request a ride through our mobile-friendly app and track your driver in real-time.
              </Typography>
            </CardContent>
          </Card>
          
          {/* Card 3 */}
          <Card sx={{ 
            flex: 1,
            height: '100%', 
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: theme.shadows[8]
            }
          }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: '#333', 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'center' 
            }}>
              <AccessTimeIcon sx={{ fontSize: 60 }} />
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                Extended Hours
              </Typography>
              <Typography variant="body1">
                Available during evening and night hours when you need it most.
                Our service operates from dusk until late to ensure you're never left stranded.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: '#f8f8f8', py: 8 }}>
        <Container>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              textAlign: 'center', 
              mb: 6,
              color: theme.palette.primary.main,
              fontWeight: 700
            }}
          >
            How It Works
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: isMobile ? 4 : 8
          }}>
            {/* Step 1 */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  mb: 3,
                  mx: 'auto'
                }}
              >
                1
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Request a Ride
              </Typography>
              <Typography variant="body1">
                Use our app to request a ride by entering your pickup location and destination.
              </Typography>
            </Box>

            {/* Step 2 */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  mb: 3,
                  mx: 'auto'
                }}
              >
                2
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Get Matched with a Driver
              </Typography>
              <Typography variant="body1">
                A nearby driver will be assigned to your request and you'll be able to track their location.
              </Typography>
            </Box>

            {/* Step 3 */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  mb: 3,
                  mx: 'auto'
                }}
              >
                3
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Arrive Safely
              </Typography>
              <Typography variant="body1">
                Your driver will take you safely to your destination within the campus area.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: theme.palette.primary.main, 
        color: 'white',
        py: 4
      }}>
        <Container>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4
          }}>
            {/* Footer Column 1 */}
            <Box sx={{ flex: 1 }}>
              <Logo variant="full" size="medium" color="light" />
              <Typography sx={{ mt: 2 }}>
                Ensuring campus safety one ride at a time.
              </Typography>
            </Box>
            
            {/* Footer Column 2 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email: froggie5o@tcu.edu
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Emergency: (817) 555-7777
              </Typography>
              <Typography variant="body2">
                Support: (817) 555-8888
              </Typography>
            </Box>
            
            {/* Footer Column 3 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Hours of Operation
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Sunday - Thursday: 6:00 PM - 1:00 AM
              </Typography>
              <Typography variant="body2">
                Friday - Saturday: 6:00 PM - 3:00 AM
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Froggie Five-O | TCU Campus Safety Escort Service
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 