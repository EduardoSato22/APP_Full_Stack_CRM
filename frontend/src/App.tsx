import {
  useCallback, useEffect, useMemo, useState,
  createContext, useContext, ReactNode, FormEvent,
} from 'react';
import {
  Alert, AppBar, Avatar, Badge, Box, Button, Card, CardActions,
  CardContent, CardMedia, Chip, CircularProgress, Container,
  CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Drawer, Grid, IconButton, InputAdornment, LinearProgress,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Menu, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField,
  ThemeProvider, Toolbar, Tooltip, Typography, createTheme, alpha,
  FormControl, InputLabel,
} from '@mui/material';
import {
  Add as AddIcon, Assignment as ActivityIcon,
  AttachMoney as MoneyIcon, BarChart as ReportIcon,
  Business as BusinessIcon, Delete as DeleteIcon,
  Dashboard as DashboardIcon, Edit as EditIcon,
  Email as EmailIcon, Inventory2 as ProductIcon,
  Lock as LockIcon, Logout as LogoutIcon,
  Menu as MenuIcon, Notifications as NotificationsIcon,
  People as PeopleIcon, Person as PersonIcon,
  Phone as PhoneIcon, Search as SearchIcon,
  Storefront as StoreIcon, TrendingUp as TrendingUpIcon,
  CheckCircle as DoneIcon, Warning as WarningIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import {
  BrowserRouter, Route, Routes, useLocation, useNavigate, Outlet,
} from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

// ─── THEME ───────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0F172A' },
    secondary: { main: '#4F46E5' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#64748B' },
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

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const STAGE_COLORS: Record<string, string> = {
  PROSPECTING: '#64748B', QUALIFICATION: '#3B82F6',
  PROPOSAL: '#F59E0B', NEGOTIATION: '#8B5CF6',
  WON: '#10B981', LOST: '#EF4444',
};
const STAGE_LABELS: Record<string, string> = {
  PROSPECTING: 'Prospecção', QUALIFICATION: 'Qualificação',
  PROPOSAL: 'Proposta', NEGOTIATION: 'Negociação',
  WON: 'Ganho', LOST: 'Perdido',
};
const STATUS_COLORS: Record<string, string> = {
  LEAD: '#64748B', PROSPECT: '#3B82F6', ACTIVE: '#10B981',
  INACTIVE: '#F59E0B', CHURNED: '#EF4444',
};
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type AuthUser = { userId: number; name: string; email: string; role: string };
type Customer = {
  id: number; firstName: string; lastName: string; fullName: string;
  email: string; age?: number; phone?: string; company?: string;
  photoUrl?: string; status: string; source?: string; tags?: string[];
  totalRevenue?: number; createdAt: string;
};
type Product = {
  id: number; name: string; description: string; price: number;
  costPrice?: number; margin?: number; sku?: string; stock?: number;
  status: string; imageUrl?: string; categoryName?: string;
  lastUpdated: string; createdAt: string;
};
type Deal = {
  id: number; title: string; value: number; probability: number;
  stage: string; customerName: string; customerId: number;
  assignedToName?: string; expectedCloseDate?: string;
  createdAt: string; notes?: string;
};
type Activity = {
  id: number; type: string; title: string; description?: string;
  customerName?: string; dealTitle?: string; dueDate?: string;
  completedAt?: string; assignedToName?: string; priority: string;
  status: string; createdAt: string;
};
type DashboardData = {
  totalCustomers: number; newCustomersThisMonth: number;
  activeDeals: number; totalPipelineValue: number;
  wonDealsThisMonth: number; wonRevenueThisMonth: number;
  conversionRate: number; activitiesPendingToday: number;
  dealsByStage: Record<string, number>;
  revenueByMonth: Record<string, number>;
};
type Notification = {
  id: number; type: string; title: string; message: string;
  read: boolean; link?: string; createdAt: string;
};
type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number };

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
type AuthCtx = {
  user: AuthUser | null; token: string | null;
  login: (u: AuthUser, t: string) => void; logout: () => void;
};
const AuthContext = createContext<AuthCtx | undefined>(undefined);
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside provider');
  return ctx;
};

// ─── API HOOK ─────────────────────────────────────────────────────────────────
const useApi = () => {
  const { token, logout } = useAuth();
  return useCallback(async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API}${path}`, { ...options, headers });
    if (res.status === 401) { logout(); throw new Error('Sessão expirada'); }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Erro no servidor');
    }
    if (res.status === 204) return null as T;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json() as Promise<T>;
    return null as T;
  }, [token, logout]);
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (u: AuthUser, t: string) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t); setUser(u);
  };
  const logout = () => {
    localStorage.clear(); setToken(null); setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ user, token, login, logout }}>
        {!user ? <LoginPage /> : <PortalRoutes />}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
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
      <Container maxWidth="xs">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={2} textAlign="center" mb={4}>
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

// ─── PORTAL ROUTES ────────────────────────────────────────────────────────────
function PortalRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const SIDEBAR_WIDTH = 240;
const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Clientes', path: '/customers', icon: <PeopleIcon /> },
  { label: 'Produtos', path: '/products', icon: <ProductIcon /> },
  { label: 'Negociações', path: '/deals', icon: <MoneyIcon /> },
  { label: 'Atividades', path: '/activities', icon: <ActivityIcon /> },
];

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const api = useApi();

  useEffect(() => {
    api<{ unread: number }>('/api/notifications/count')
      .then(d => setNotifCount(d?.unread ?? 0)).catch(() => {});
  }, []);

  const openNotifications = async (e: React.MouseEvent<HTMLElement>) => {
    setNotifAnchor(e.currentTarget);
    const data = await api<Notification[]>('/api/notifications').catch(() => []);
    setNotifications(data ?? []);
    setNotifCount(0);
  };

  const markAllRead = async () => {
    await api('/api/notifications/read-all', { method: 'PUT' }).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 0.8, display: 'flex' }}>
          <StoreIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="primary">RetailFlow</Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, mt: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? 'white' : 'text.secondary',
                  '&:hover': { bgcolor: active ? 'primary.dark' : alpha(theme.palette.primary.main, 0.06) },
                }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 400, fontSize: 14 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: 14 }}>
            {user?.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
            <Chip label={user?.role} size="small" sx={{ height: 18, fontSize: 11 }} />
          </Box>
        </Box>
        <Button fullWidth variant="outlined" size="small" startIcon={<LogoutIcon />}
          onClick={logout} color="error" sx={{ borderRadius: 2 }}>Sair</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="nav" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider' } }}>
          {drawer}
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar>
            <IconButton sx={{ display: { md: 'none' }, mr: 1 }} onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {NAV_ITEMS.find(i => i.path === location.pathname)?.label ?? 'CRM'}
            </Typography>
            <IconButton onClick={openNotifications}>
              <Badge badgeContent={notifCount} color="error"><NotificationsIcon /></Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>

      {/* Notifications Menu */}
      <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}
        PaperProps={{ sx: { width: 360, maxHeight: 480 } }}>
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight={600}>Notificações</Typography>
          <Button size="small" onClick={markAllRead}>Marcar todas</Button>
        </Box>
        <Divider />
        {notifications.length === 0
          ? <MenuItem disabled><Typography variant="body2" color="text.secondary">Nenhuma notificação</Typography></MenuItem>
          : notifications.map(n => (
            <MenuItem key={n.id} sx={{ opacity: n.read ? 0.6 : 1, whiteSpace: 'normal', alignItems: 'flex-start', py: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight={n.read ? 400 : 600}>{n.title}</Typography>
                <Typography variant="caption" color="text.secondary">{n.message}</Typography>
              </Box>
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage() {
  const api = useApi();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<DashboardData>('/api/dashboard/summary')
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [api]);

  if (loading) return <LoadingCenter />;
  if (!data) return <Alert severity="error">Erro ao carregar dashboard</Alert>;

  const pieData = Object.entries(data.dealsByStage || {})
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: STAGE_LABELS[k] ?? k, value: v, color: STAGE_COLORS[k] }));

  const revenueData = Object.entries(data.revenueByMonth || {})
    .map(([month, value]) => ({ month, value: Number(value) }));

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {[
          { label: 'Clientes', value: data.totalCustomers, sub: `+${data.newCustomersThisMonth} este mês`, icon: <PeopleIcon />, gradient: 'linear-gradient(135deg,#0F172A,#334155)' },
          { label: 'Deals Ativos', value: data.activeDeals, sub: BRL.format(data.totalPipelineValue ?? 0) + ' pipeline', icon: <MoneyIcon />, gradient: 'linear-gradient(135deg,#4F46E5,#818CF8)' },
          { label: 'Ganhos no Mês', value: data.wonDealsThisMonth, sub: BRL.format(data.wonRevenueThisMonth ?? 0), icon: <TrendingUpIcon />, gradient: 'linear-gradient(135deg,#059669,#34D399)' },
          { label: 'Atividades Hoje', value: data.activitiesPendingToday, sub: `${(data.conversionRate ?? 0).toFixed(1)}% conversão`, icon: <ActivityIcon />, gradient: 'linear-gradient(135deg,#D97706,#FCD34D)' },
        ].map(kpi => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <Paper sx={{ p: 3, background: kpi.gradient, color: 'white', position: 'relative', overflow: 'hidden', borderRadius: 3 }}>
              <Box sx={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.12, transform: 'scale(4)' }}>{kpi.icon}</Box>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <Box sx={{ p: 0.8, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1.5, display: 'flex' }}>{kpi.icon}</Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{kpi.label}</Typography>
              </Stack>
              <Typography variant="h4" fontWeight={700}>{kpi.value}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>{kpi.sub}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>Receita por Mês</Typography>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => BRL.format(v)} />
                <ReTooltip formatter={(v: number) => BRL.format(v)} />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" mb={2}>Deals por Estágio</Typography>
            {pieData.length > 0
              ? <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              : <Typography color="text.secondary">Sem dados</Typography>
            }
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
function CustomersPage() {
  const api = useApi();
  const [page, setPage] = useState<Page<Customer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (s = search, st = statusFilter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: '0', size: '20' });
    if (s) params.set('search', s);
    if (st) params.set('status', st);
    const data = await api<Page<Customer>>(`/api/customers?${params}`).catch(() => null);
    setPage(data);
    setLoading(false);
  }, [api, search, statusFilter]);

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Remover cliente?')) return;
    await api(`/api/customers/${id}`, { method: 'DELETE' }).catch(e => setError(e.message));
    load();
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">Clientes</Typography>
          <Typography color="text.secondary">{page?.totalElements ?? 0} registros</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setDialogOpen(true); }}>
          Novo Cliente
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField placeholder="Buscar por nome, email, empresa..." value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(search, statusFilter)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          sx={{ flexGrow: 1 }} />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); load(search, e.target.value); }}>
            <MenuItem value="">Todos</MenuItem>
            {['LEAD', 'PROSPECT', 'ACTIVE', 'INACTIVE', 'CHURNED'].map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {loading ? <LoadingCenter /> : (
        <Grid container spacing={2}>
          {page?.content.map(c => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                  <Avatar src={c.photoUrl} sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5, fontSize: 28, bgcolor: 'secondary.main' }}>
                    {c.firstName[0]}
                  </Avatar>
                  <Typography variant="h6">{c.fullName}</Typography>
                  {c.company && <Typography variant="caption" color="text.secondary"><BusinessIcon sx={{ fontSize: 12, mr: 0.5 }} />{c.company}</Typography>}
                  <Box mt={1}>
                    <Chip label={c.status} size="small" sx={{ bgcolor: STATUS_COLORS[c.status] + '22', color: STATUS_COLORS[c.status], fontWeight: 600 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mt={1}>{c.email}</Typography>
                  {c.phone && <Typography variant="body2" color="text.secondary"><PhoneIcon sx={{ fontSize: 12, mr: 0.5 }} />{c.phone}</Typography>}
                  {(c.totalRevenue ?? 0) > 0 && (
                    <Typography variant="body2" fontWeight={600} color="success.main" mt={0.5}>
                      {BRL.format(c.totalRevenue!)}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => { setEditing(c); setDialogOpen(true); }}>Editar</Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(c.id)}>Remover</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {!page?.content.length && <EmptyState message="Nenhum cliente encontrado" />}
        </Grid>
      )}

      <CustomerDialog open={dialogOpen} customer={editing}
        onClose={() => setDialogOpen(false)} onSaved={() => { setDialogOpen(false); load(); }} />
    </Stack>
  );
}

function CustomerDialog({ open, customer, onClose, onSaved }: { open: boolean; customer: Customer | null; onClose: () => void; onSaved: () => void }) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  useEffect(() => {
    reset(customer ?? { status: 'LEAD', source: 'ORGANIC' });
  }, [customer, open, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      if (customer) await api(`/api/customers/${customer.id}`, { method: 'PUT', body: JSON.stringify(data) });
      else await api('/api/customers', { method: 'POST', body: JSON.stringify(data) });
      onSaved();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        {customer ? 'Editar Cliente' : 'Novo Cliente'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Nome *" fullWidth {...register('firstName', { required: true })} error={!!errors.firstName} /></Grid>
            <Grid item xs={6}><TextField label="Sobrenome *" fullWidth {...register('lastName', { required: true })} error={!!errors.lastName} /></Grid>
            <Grid item xs={12}><TextField label="Email *" fullWidth type="email" {...register('email', { required: true })} error={!!errors.email} /></Grid>
            <Grid item xs={6}><TextField label="Telefone" fullWidth {...register('phone')} /></Grid>
            <Grid item xs={6}><TextField label="Idade" fullWidth type="number" {...register('age', { valueAsNumber: true })} /></Grid>
            <Grid item xs={6}><TextField label="Empresa" fullWidth {...register('company')} /></Grid>
            <Grid item xs={6}><TextField label="Cargo" fullWidth {...register('position')} /></Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" defaultValue="LEAD" {...register('status')}>
                  {['LEAD','PROSPECT','ACTIVE','INACTIVE','CHURNED'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Origem</InputLabel>
                <Select label="Origem" defaultValue="ORGANIC" {...register('source')}>
                  {['ORGANIC','REFERRAL','ADS','COLD_OUTREACH','EVENT','OTHER'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField label="URL da Foto" fullWidth {...register('photoUrl')} /></Grid>
            <Grid item xs={12}><TextField label="Observações" fullWidth multiline rows={2} {...register('notes')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
function ProductsPage() {
  const api = useApi();
  const [page, setPage] = useState<Page<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (s = search) => {
    setLoading(true);
    const params = new URLSearchParams({ page: '0', size: '20' });
    if (s) params.set('search', s);
    const data = await api<Page<Product>>(`/api/products?${params}`).catch(() => null);
    setPage(data);
    setLoading(false);
  }, [api, search]);

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Remover produto?')) return;
    await api(`/api/products/${id}`, { method: 'DELETE' }).catch(e => setError(e.message));
    load();
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">Produtos</Typography>
          <Typography color="text.secondary">{page?.totalElements ?? 0} itens</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setDialogOpen(true); }}>
          Novo Produto
        </Button>
      </Stack>

      <TextField placeholder="Buscar produto..." value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && load(search)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {loading ? <LoadingCenter /> : (
        <Grid container spacing={2}>
          {page?.content.map(p => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'grey.100', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
                  {p.imageUrl
                    ? <CardMedia component="img" image={p.imageUrl} alt={p.name} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ProductIcon sx={{ fontSize: 48, color: 'grey.300' }} />
                      </Box>
                  }
                  <Chip label={BRL.format(p.price)} color="secondary" size="small" sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700 }} />
                  {(p.stock ?? 0) < 5 && <Chip label="Baixo estoque" color="error" size="small" sx={{ position: 'absolute', top: 10, left: 10 }} />}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} noWrap>{p.name}</Typography>
                  {p.categoryName && <Chip label={p.categoryName} size="small" variant="outlined" sx={{ mb: 1 }} />}
                  <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </Typography>
                  {p.sku && <Typography variant="caption" color="text.secondary">SKU: {p.sku}</Typography>}
                  <Stack direction="row" spacing={1} mt={1} alignItems="center">
                    {p.stock != null && <Chip label={`Estoque: ${p.stock}`} size="small" color={p.stock < 5 ? 'error' : 'success'} variant="outlined" />}
                    {p.margin != null && <Typography variant="caption" color="success.main" fontWeight={600}>{p.margin.toFixed(1)}% margem</Typography>}
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>{fmtDate(p.lastUpdated)}</Typography>
                  <IconButton size="small" color="primary" onClick={() => { setEditing(p); setDialogOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><DeleteIcon fontSize="small" /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {!page?.content.length && <EmptyState message="Nenhum produto cadastrado" />}
        </Grid>
      )}

      <ProductDialog open={dialogOpen} product={editing}
        onClose={() => setDialogOpen(false)} onSaved={() => { setDialogOpen(false); load(); }} />
    </Stack>
  );
}

function ProductDialog({ open, product, onClose, onSaved }: { open: boolean; product: Product | null; onClose: () => void; onSaved: () => void }) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => { reset(product ?? { status: 'ACTIVE', unit: 'UNIT', stock: 0 }); }, [product, open, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      if (product) await api(`/api/products/${product.id}`, { method: 'PUT', body: JSON.stringify(data) });
      else await api('/api/products', { method: 'POST', body: JSON.stringify(data) });
      onSaved();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Nome *" fullWidth {...register('name', { required: true })} /></Grid>
            <Grid item xs={12}><TextField label="URL da Imagem" fullWidth {...register('imageUrl')} /></Grid>
            <Grid item xs={6}><TextField label="Preço *" fullWidth type="number" inputProps={{ step: '0.01' }} {...register('price', { required: true, valueAsNumber: true })} /></Grid>
            <Grid item xs={6}><TextField label="Preço de Custo" fullWidth type="number" inputProps={{ step: '0.01' }} {...register('costPrice', { valueAsNumber: true })} /></Grid>
            <Grid item xs={6}><TextField label="SKU" fullWidth {...register('sku')} /></Grid>
            <Grid item xs={6}><TextField label="Estoque" fullWidth type="number" {...register('stock', { valueAsNumber: true })} /></Grid>
            <Grid item xs={12}><TextField label="Descrição *" fullWidth multiline rows={3} {...register('description', { required: true })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

// ─── DEALS (KANBAN) ───────────────────────────────────────────────────────────
function DealsPage() {
  const api = useApi();
  const [kanban, setKanban] = useState<Record<string, Deal[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await api<Record<string, Deal[]>>('/api/deals/kanban').catch(() => null);
    setKanban(data ?? {});
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, []);

  const handleStageChange = async (dealId: number, stage: string) => {
    let lostReason: string | null = null;
    if (stage === 'LOST') {
      lostReason = prompt('Motivo da perda:');
      if (!lostReason) return;
    }
    const params = new URLSearchParams({ stage });
    if (lostReason) params.set('lostReason', lostReason);
    await api(`/api/deals/${dealId}/stage?${params}`, { method: 'PUT' }).catch(e => setError(e.message));
    load();
  };

  const STAGES = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Pipeline de Vendas</Typography>
          <Typography color="text.secondary">Arraste os cards para mover estágios</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Nova Negociação</Button>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {loading ? <LoadingCenter /> : (
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
          <Stack direction="row" spacing={2} sx={{ minWidth: STAGES.length * 280 }}>
            {STAGES.map(stage => {
              const deals = kanban[stage] ?? [];
              const total = deals.reduce((s, d) => s + (d.value ?? 0), 0);
              return (
                <Box key={stage} sx={{ width: 270, flexShrink: 0 }}>
                  <Box sx={{ p: 1.5, bgcolor: STAGE_COLORS[stage] + '18', borderRadius: 2, mb: 1.5, borderLeft: `4px solid ${STAGE_COLORS[stage]}` }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={700} fontSize={13}>{STAGE_LABELS[stage]}</Typography>
                      <Chip label={deals.length} size="small" sx={{ bgcolor: STAGE_COLORS[stage], color: 'white', fontWeight: 700, height: 22 }} />
                    </Stack>
                    {total > 0 && <Typography variant="caption" color="text.secondary">{BRL.format(total)}</Typography>}
                  </Box>
                  <Stack spacing={1}>
                    {deals.map(deal => (
                      <Card key={deal.id} sx={{ cursor: 'pointer', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography variant="body2" fontWeight={600} noWrap>{deal.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{deal.customerName}</Typography>
                          {deal.value > 0 && <Typography variant="body2" fontWeight={700} color="secondary.main">{BRL.format(deal.value)}</Typography>}
                          <Box mt={1}>
                            <Typography variant="caption" color="text.secondary">Prob: {deal.probability}%</Typography>
                            <LinearProgress variant="determinate" value={deal.probability} sx={{ height: 4, borderRadius: 2, mt: 0.5 }} />
                          </Box>
                          <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap">
                            {STAGES.filter(s => s !== stage).map(s => (
                              <Button key={s} size="small" onClick={() => handleStageChange(deal.id, s)}
                                sx={{ fontSize: 10, py: 0, px: 1, minWidth: 0, height: 22, bgcolor: STAGE_COLORS[s] + '20', color: STAGE_COLORS[s] }}>
                                {STAGE_LABELS[s]}
                              </Button>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                    {deals.length === 0 && (
                      <Box sx={{ p: 2, textAlign: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">Sem deals</Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}

      <DealDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={() => { setDialogOpen(false); load(); }} />
    </Stack>
  );
}

function DealDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => {
    if (open) {
      reset({ stage: 'PROSPECTING', value: 0 });
      api<Page<Customer>>('/api/customers?size=100').then(d => setCustomers(d?.content ?? [])).catch(() => {});
    }
  }, [open, reset, api]);

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      await api('/api/deals', { method: 'POST', body: JSON.stringify(data) });
      onSaved();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Nova Negociação</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Título *" fullWidth {...register('title', { required: true })} /></Grid>
            <Grid item xs={6}><TextField label="Valor (R$)" fullWidth type="number" inputProps={{ step: '0.01' }} {...register('value', { valueAsNumber: true })} /></Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Estágio</InputLabel>
                <Select label="Estágio" defaultValue="PROSPECTING" {...register('stage')}>
                  {['PROSPECTING','QUALIFICATION','PROPOSAL','NEGOTIATION'].map(s => <MenuItem key={s} value={s}>{STAGE_LABELS[s]}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Cliente *</InputLabel>
                <Select label="Cliente *" {...register('customerId', { required: true, valueAsNumber: true })}>
                  {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField label="Observações" fullWidth multiline rows={2} {...register('notes')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

// ─── ACTIVITIES PAGE ──────────────────────────────────────────────────────────
const PRIORITY_COLORS: Record<string, string> = { LOW: '#64748B', MEDIUM: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };
const ACTIVITY_TYPE_ICONS: Record<string, ReactNode> = {
  CALL: <PhoneIcon fontSize="small" />, EMAIL: <EmailIcon fontSize="small" />,
  MEETING: <PeopleIcon fontSize="small" />, TASK: <ActivityIcon fontSize="small" />,
  NOTE: <EditIcon fontSize="small" />, WHATSAPP: <PhoneIcon fontSize="small" />,
};

function ActivitiesPage() {
  const api = useApi();
  const [data, setData] = useState<Page<Activity> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (s = statusFilter) => {
    setLoading(true);
    const params = new URLSearchParams({ size: '50' });
    if (s) params.set('status', s);
    const d = await api<Page<Activity>>(`/api/activities?${params}`).catch(() => null);
    setData(d);
    setLoading(false);
  }, [api, statusFilter]);

  useEffect(() => { load(); }, []);

  const complete = async (id: number) => {
    await api(`/api/activities/${id}/complete`, { method: 'PUT' }).catch(e => setError(e.message));
    load();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Atividades</Typography>
          <Typography color="text.secondary">{data?.totalElements ?? 0} registros</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Nova Atividade</Button>
      </Stack>

      <Stack direction="row" spacing={1}>
        {['', 'PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'].map(s => (
          <Chip key={s} label={s || 'Todas'} onClick={() => { setStatusFilter(s); load(s); }}
            color={statusFilter === s ? 'primary' : 'default'} variant={statusFilter === s ? 'filled' : 'outlined'} />
        ))}
      </Stack>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {loading ? <LoadingCenter /> : (
        <Stack spacing={1.5}>
          {data?.content.map(a => (
            <Card key={a.id}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1, bgcolor: PRIORITY_COLORS[a.priority] + '20', borderRadius: 2, color: PRIORITY_COLORS[a.priority], display: 'flex', mt: 0.3 }}>
                    {ACTIVITY_TYPE_ICONS[a.type] ?? <ActivityIcon fontSize="small" />}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography fontWeight={600}>{a.title}</Typography>
                      <Chip label={a.priority} size="small" sx={{ bgcolor: PRIORITY_COLORS[a.priority] + '20', color: PRIORITY_COLORS[a.priority], fontWeight: 600, height: 20 }} />
                      <Chip label={a.status} size="small" variant="outlined" sx={{ height: 20 }} />
                    </Stack>
                    {a.description && <Typography variant="body2" color="text.secondary">{a.description}</Typography>}
                    <Stack direction="row" spacing={2} mt={0.5}>
                      {a.customerName && <Typography variant="caption" color="text.secondary"><PeopleIcon sx={{ fontSize: 11, mr: 0.3 }} />{a.customerName}</Typography>}
                      {a.dueDate && <Typography variant="caption" color={new Date(a.dueDate) < new Date() && a.status === 'PENDING' ? 'error.main' : 'text.secondary'}>
                        Vence: {fmtDate(a.dueDate)}
                      </Typography>}
                    </Stack>
                  </Box>
                  {a.status !== 'DONE' && a.status !== 'CANCELLED' && (
                    <Tooltip title="Concluir">
                      <IconButton size="small" color="success" onClick={() => complete(a.id)}><DoneIcon /></IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
          {!data?.content.length && <EmptyState message="Nenhuma atividade encontrada" />}
        </Stack>
      )}

      <ActivityDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={() => { setDialogOpen(false); load(); }} />
    </Stack>
  );
}

function ActivityDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => { if (open) reset({ type: 'TASK', priority: 'MEDIUM' }); }, [open, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      await api('/api/activities', { method: 'POST', body: JSON.stringify(data) });
      onSaved();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Nova Atividade</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select label="Tipo" defaultValue="TASK" {...register('type')}>
                  {['CALL','EMAIL','MEETING','TASK','NOTE','WHATSAPP'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select label="Prioridade" defaultValue="MEDIUM" {...register('priority')}>
                  {['LOW','MEDIUM','HIGH','URGENT'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField label="Título *" fullWidth {...register('title', { required: true })} /></Grid>
            <Grid item xs={12}><TextField label="Data de Vencimento" fullWidth type="datetime-local" InputLabelProps={{ shrink: true }} {...register('dueDate')} /></Grid>
            <Grid item xs={12}><TextField label="Descrição" fullWidth multiline rows={2} {...register('description')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function LoadingCenter() {
  return <Box display="flex" justifyContent="center" alignItems="center" py={8}><CircularProgress /></Box>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <Grid item xs={12}>
      <Box textAlign="center" py={8} bgcolor="background.paper" borderRadius={3}>
        <WarningIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography color="text.secondary">{message}</Typography>
      </Box>
    </Grid>
  );
}