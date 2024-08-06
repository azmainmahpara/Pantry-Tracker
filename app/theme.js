import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    
    primary: {
      main: '#1e88e5', // Changed primary color to blue
    },
    secondary: {
      main: '#d32f2f',
       // Changed secondary color to red
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: '#61c2ec', // Updated gradient colors
          border: 0,
          borderRadius: 8, // Increased border radius
          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          color: 'white',
          height: 48,
          padding: '0 30px',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #b71c1c 90%)', // Added hover effect
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 50,
          height: 28,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(22px)', // Updated transform value
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 26,
          height: 26,
        },
        track: {
          borderRadius: 14,
          border: '1px solid #bdbdbd',
          backgroundColor: '#e0e0e0',
          opacity: 1,
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Roboto Slab", "Helvetica", "Arial", sans-serif',
      fontWeight: 700, // Added font weight
      fontSize: '2.5rem', // Added font size
    },
    h2: {
      fontFamily: '"Roboto Slab", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: '"Roboto Slab", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h4: {
      fontFamily: '"Roboto Slab", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: '"Roboto Slab", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    h6: {
      fontFamily: '"Roboto Slab", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8, // Increased border radius for overall components
  },
});

export default theme;
