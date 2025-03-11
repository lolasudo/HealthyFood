import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1E5945' },
    secondary: { main: '#ADDFAD' },
    background: { default: '#FFF9F2' },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
});