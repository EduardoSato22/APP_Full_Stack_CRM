import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert, Box, Button, CircularProgress, Container, Divider,
  InputAdornment, Paper, Stack, TextField, Tooltip, Typography, alpha,
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon,
  Person as PersonIcon, Storefront as StoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { API } from '../../constants';

const BACKEND = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ?? 'http://localhost:8080';

const DEMO_USERS = [
  { label: 'Administrador', email: 'admin@retailflow.demo',   password: 'Admin123',   color: '#0F172A' },
  { label: 'Gerente',       email: 'manager@retailflow.demo', password: 'Manager123', color: '#4F46E5' },
  { label: 'Vendedor',      email: 'sales@retailflow.demo',   password: 'Sales123',   color: '#0EA5E9' },
];

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();

  const doLogin = async (email: string, password: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.message || 'Erro'); }
      const data = await res.json();
      login({ userId: data.userId, name: data.name, email: data.email, role: data.role }, data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    setLoading(true); setError('');
    try {
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.message || 'Erro'); }
      const data = await res.json();
      login({ userId: data.userId, name: data.name, email: data.email, role: data.role }, data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
    }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={2} textAlign="center" mb={3}>
            <Box sx={{
              width: 60, height: 60, borderRadius: '50%', bgcolor: 'primary.main',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',
            }}>
              <StoreIcon fontSize="large" />
            </Box>
            <Typography variant="h4" color="primary">RetailFlow CRM</Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
            </Typography>
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: alpha('#4F46E5', 0.04), borderColor: alpha('#4F46E5', 0.2) }}>
            <Typography variant="caption" fontWeight={700} color="secondary" sx={{ display: 'block', mb: 1.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Acesso rápido para recrutadores
            </Typography>
            <Stack direction="row" spacing={1}>
              {DEMO_USERS.map(u => (
                <Button key={u.email} variant="outlined" size="small" disabled={loading}
                  onClick={() => doLogin(u.email, u.password)}
                  sx={{
                    flex: 1, borderColor: u.color, color: u.color, fontSize: 12, fontWeight: 600,
                    '&:hover': { bgcolor: alpha(u.color, 0.08), borderColor: u.color },
                  }}>
                  {u.label}
                </Button>
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Clique para entrar instantaneamente com dados de demonstração
            </Typography>
          </Paper>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">login social</Typography>
          </Divider>

          <Stack direction="row" spacing={1.5} mb={2}>
            <Tooltip title="Requer GOOGLE_CLIENT_ID configurado no servidor" arrow>
              <Button
                fullWidth variant="outlined" size="medium"
                href={`${BACKEND}/oauth2/authorization/google`}
                sx={{ borderColor: '#DB4437', color: '#DB4437', '&:hover': { bgcolor: alpha('#DB4437', 0.06), borderColor: '#DB4437' } }}
                startIcon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                }
              >
                Google
              </Button>
            </Tooltip>
            <Tooltip title="Requer GITHUB_CLIENT_ID configurado no servidor" arrow>
              <Button
                fullWidth variant="outlined" size="medium"
                href={`${BACKEND}/oauth2/authorization/github`}
                sx={{ borderColor: '#333', color: '#333', '&:hover': { bgcolor: alpha('#333', 0.06), borderColor: '#333' } }}
                startIcon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                }
              >
                GitHub
              </Button>
            </Tooltip>
          </Stack>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">ou entre com sua conta</Typography>
          </Divider>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField label="Nome" fullWidth margin="normal" required
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> }}
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            )}
            <TextField label="Email" fullWidth margin="normal" type="email" required
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <TextField label="Senha" fullWidth margin="normal" type="password" required
              InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment> }}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <Button type="submit" fullWidth variant="contained" size="large"
              sx={{ mt: 3, mb: 2, height: 48 }} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
            <Button fullWidth color="secondary" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Criar conta' : 'Já tenho conta'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
