import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert, Box, Button, CircularProgress, Container, Divider,
  InputAdornment, Paper, Stack, TextField, Typography, alpha,
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon,
  Person as PersonIcon, Storefront as StoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { API } from '../../constants';

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
