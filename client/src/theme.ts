import { createTheme } from '@mui/material/styles';

// TCU Colors
const TCU_PURPLE = '#4D1979';
const TCU_PURPLE_LIGHT = '#592291';
const TCU_PURPLE_DARK = '#3B1259';
const TCU_GREY = '#A3A9AC';
const TCU_GREY_DARK = '#666666';
const TCU_BLACK = '#333333';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: TCU_PURPLE,
      light: TCU_PURPLE_LIGHT,
      dark: TCU_PURPLE_DARK,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: TCU_GREY,
      dark: TCU_GREY_DARK,
      contrastText: TCU_BLACK,
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: TCU_BLACK,
      secondary: TCU_GREY_DARK,
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#2E7D32',
    },
    warning: {
      main: '#ED6C02',
    },
    info: {
      main: '#0288D1',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: TCU_PURPLE_LIGHT,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: TCU_PURPLE,
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

export default theme; 