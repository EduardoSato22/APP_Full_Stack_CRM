import { createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';

export const createAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: { main: mode === 'light' ? '#0F172A' : '#E2E8F0' },
    secondary: { main: '#4F46E5' },
    background: {
      default: mode === 'light' ? '#F1F5F9' : '#0F172A',
      paper:   mode === 'light' ? '#FFFFFF'  : '#1E293B',
    },
    text: {
      primary:   mode === 'light' ? '#1E293B' : '#F1F5F9',
      secondary: mode === 'light' ? '#64748B' : '#94A3B8',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0/0.1),0 1px 2px -1px rgb(0 0 0/0.1)',
          '&:hover': { boxShadow: '0 4px 6px -1px rgb(0 0 0/0.1)' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
        contained: { boxShadow: 'none' },
      },
    },
  },
});
