import React from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'small' | 'medium' | 'large';
  color?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'medium',
  color = 'dark'
}) => {
  // Size mapping
  const sizeMap = {
    small: {
      icon: 24,
      fontSize: '1rem',
      spacing: 1
    },
    medium: {
      icon: 36,
      fontSize: '1.5rem',
      spacing: 1.5
    },
    large: {
      icon: 48,
      fontSize: '2rem',
      spacing: 2
    }
  };

  // Color mapping
  const colorMap = {
    light: {
      primary: '#FFFFFF',
      secondary: '#D0D3D6'
    },
    dark: {
      primary: '#4D1979', // TCU Purple
      secondary: '#333333'
    }
  };

  const selectedSize = sizeMap[size];
  const selectedColor = colorMap[color];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      <DirectionsCarFilledIcon
        sx={{ 
          fontSize: selectedSize.icon,
          color: selectedColor.primary,
          transform: 'scaleX(-1)', // Flip horizontally to face right
          mr: variant === 'full' ? selectedSize.spacing : 0
        }}
      />
      
      {variant === 'full' && (
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: selectedSize.fontSize,
            color: selectedColor.primary,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline'
          }}
        >
          Froggie 
          <Box 
            component="span" 
            sx={{ 
              fontSize: '80%', 
              mx: 0.5, 
              color: selectedColor.secondary
            }}
          >
            Five-O
          </Box>
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 