import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { API } from '../../constants';

export function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      navigate('/login?error=oauth2_failed');
      return;
    }

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('auth_failed');
        return res.json();
      })
      .then(data => {
        login(
          { userId: data.userId, name: data.name, email: data.email, role: data.role },
          token,
        );
        navigate('/');
      })
      .catch(() => navigate('/login?error=oauth2_failed'));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
      <CircularProgress size={48} />
      <Typography color="text.secondary">Autenticando via provedor social...</Typography>
    </Box>
  );
}
