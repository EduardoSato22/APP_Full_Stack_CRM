import { useMemo, useState } from 'react';
import type { PaletteMode } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ColorModeContext } from './contexts/ColorModeContext';
import { AuthContext } from './contexts/AuthContext';
import type { AuthCtx } from './contexts/AuthContext';
import { createAppTheme } from './lib/theme';
import type { AuthUser } from './types';
import { LoginPage } from './features/auth/LoginPage';
import { OAuth2CallbackPage } from './features/auth/OAuth2CallbackPage';
import { AppShell } from './shared/AppShell';
import { CookieConsentBanner } from './shared/CookieConsentBanner';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { CustomersPage } from './features/customers/CustomersPage';
import { ProductsPage } from './features/products/ProductsPage';
import { DealsPage } from './features/deals/DealsPage';
import { ActivitiesPage } from './features/activities/ActivitiesPage';
import { SalesPage } from './features/sales/SalesPage';

export default function App() {
  const [mode, setMode] = useState<PaletteMode>(
    () => (localStorage.getItem('colorMode') as PaletteMode) ?? 'light'
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode(prev => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('colorMode', next);
        return next;
      });
    },
  }), []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const auth: AuthCtx = useMemo(() => ({
    user,
    token,
    login: (u: AuthUser, t: string) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t); setUser(u);
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null); setUser(null);
    },
  }), [user, token]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContext.Provider value={auth}>
          <BrowserRouter>
            <Routes>
              <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
              {!user ? (
                <Route path="*" element={<LoginPage />} />
              ) : (
                <Route element={<AppShell />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/activities" element={<ActivitiesPage />} />
                  <Route path="/sales" element={<SalesPage />} />
                </Route>
              )}
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
        <CookieConsentBanner />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
