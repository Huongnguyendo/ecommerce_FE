import { createTheme } from '@mui/material';

export const tokens = {
  grey: {
    100: "#f0f0f3",
    200: "#e1e2e7",
    300: "#d1d3da",
    400: "#c2c5ce",
    500: "#b3b6c2",
    600: "#8f929b",
    700: "#6b6d74",
    800: "#48494e",
    900: "#242427",
  },
  primary: {
    // light green
    100: "#d0fcf4",
    200: "#a0f9e9",
    300: "#71f5de",
    400: "#41f2d3",
    500: "#12efc8",
    600: "#0ebfa0",
    700: "#0b8f78",
    800: "#076050",
    900: "#043028",
  },
  secondary: {
    // yellow
    100: "#fcf0dd",
    200: "#fae1bb",
    300: "#f7d299",
    400: "#f5c377",
    500: "#f2b455",
    600: "#c29044",
    700: "#916c33",
    800: "#614822",
    900: "#302411",
  },
  tertiary: {
    // purple
    500: "#8884d8",
  },
  background: {
    light: "#2d2d34",
    main: "#1f2026",
  },
};

// Light theme for regular users
export const lightThemeSettings = () => ({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Elegant blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00bfae', // Teal accent
      light: '#4dd0e1',
      dark: '#00838f',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#fff',
    },
    text: {
      primary: '#222',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Dark theme for admin
export const darkThemeSettings = () => ({
  palette: {
    mode: 'dark',
    primary: {
      ...tokens.primary,
      main: tokens.primary[500],
      light: tokens.primary[400],
      dark: tokens.primary[700],
      contrastText: '#000',
    },
    secondary: {
      ...tokens.secondary,
      main: tokens.secondary[500],
      light: tokens.secondary[400],
      dark: tokens.secondary[700],
      contrastText: '#000',
    },
    tertiary: {
      main: tokens.tertiary[500],
    },
    grey: {
      ...tokens.grey,
    },
    background: {
      default: tokens.background.main,
      light: tokens.background.light,
      paper: tokens.background.light,
    },
    text: {
      primary: tokens.grey[100],
      secondary: tokens.grey[300],
    },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
      fontSize: 32,
      fontWeight: 700,
      color: tokens.grey[100],
    },
    h2: {
      fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
      fontSize: 24,
      fontWeight: 700,
      color: tokens.grey[100],
    },
    h3: {
      fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
      fontSize: 20,
      fontWeight: 800,
      color: tokens.grey[200],
    },
    h4: {
      fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 600,
      color: tokens.grey[300],
    },
    h5: {
      fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
      fontSize: 12,
      fontWeight: 400,
      color: tokens.grey[500],
    },
    h6: {
      fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
      fontSize: 10,
      color: tokens.grey[700],
    },
    body1: {
      color: tokens.grey[100],
    },
    body2: {
      color: tokens.grey[300],
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(18, 239, 200, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(18, 239, 200, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.background.light,
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.background.light,
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.background.light,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      },
    },
  },
});

// Export themes
export const lightTheme = createTheme(lightThemeSettings());
export const darkTheme = createTheme(darkThemeSettings());

// Default export (light theme for users)
export default lightTheme;

