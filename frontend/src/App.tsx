import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  ReactNode,
  FormEvent,
} from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  PeopleAlt as PeopleIcon,
  Storefront as StoreIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Inventory2 as ProductIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// --- TEMA E ESTILOS ---
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F172A', // Slate 900 (Modern Dark Blue)
    },
    secondary: {
      main: '#4F46E5', // Indigo 600 (Vibrant Accent)
    },
    background: {
      default: '#F1F5F9', // Slate 100
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }, // Remove overlay in dark mode if switched
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
          },
        },
      },
    },
  },
});

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// --- TIPAGEM ---
type AuthUser = {
  userId: number;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  age: number;
  photoUrl?: string;
  createdAt: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // NOVO CAMPO DE IMAGEM
  createdAt: string;
  lastUpdated: string;
};

type CustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  photoUrl?: string;
};

type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // NOVO CAMPO NO FORM
};

// --- AUTH CONTEXT ---
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro do AuthContext.Provider');
  }
  return context;
};

// --- FORMATADORES ---
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// --- API HOOK ---
const useApi = () => {
  const { token } = useAuth();

  return useCallback(
    async <T,>(path: string, options: RequestInit = {}) => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let message = 'Erro ao comunicar com o servidor';
        if (errorBody) {
          try {
            const parsed = JSON.parse(errorBody);
            message =
              parsed.message ||
              parsed.error ||
              (typeof parsed === 'string' ? parsed : message);
          } catch {
            message = errorBody;
          }
        }
        throw new Error(message);
      }

      if (response.status === 204) {
        return null as T;
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return response.json() as Promise<T>;
      }

      return null as T;
    },
    [token],
  );
};

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [token]);

  const handleLogin = (userData: AuthUser, authToken: string) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ user, token, login: handleLogin, logout: handleLogout }}>
        {!user ? <AuthPage /> : <PortalRoutes />}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

// --- TELA DE LOGIN / REGISTRO ---
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || 'Erro na autenticação');
      }

      const data = await response.json();
      login({ userId: data.userId, name: data.name, email: data.email }, data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Stack spacing={2} textAlign="center" mb={4}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1,
              }}
            >
              <StoreIcon fontSize="large" />
            </Box>
            <Typography variant="h4" fontWeight={700} color="primary">
              RetailFlow
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin
                ? 'Bem-vindo de volta! Acesse sua conta.'
                : 'Crie sua conta e comece agora.'}
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                label="Nome completo"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            )}

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <TextField
              label="Senha"
              fullWidth
              margin="normal"
              type="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, height: 48, fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>

            <Button
              fullWidth
              color="secondary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Criar nova conta' : 'Já tenho conta'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// --- ROTAS DO PORTAL ---
function PortalRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<CustomersPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// --- SHELL DA APLICAÇÃO (NAVBAR) ---
function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const items = [
    { label: 'Dashboard', path: '/', icon: <TrendingUpIcon /> },
    { label: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
    { label: 'Produtos', path: '/produtos', icon: <StoreIcon /> },
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <StoreIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                flexGrow: 1
              }}
            >
              RetailFlow
            </Typography>

            <Stack direction="row" spacing={1} flexGrow={isMobile ? 1 : 0}>
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    startIcon={!isMobile && item.icon}
                    variant={isActive ? 'contained' : 'text'}
                    color={isActive ? 'primary' : 'inherit'}
                    onClick={() => navigate(item.path)}
                    sx={{ 
                      borderRadius: 50, 
                      px: 3,
                      backgroundColor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? '#fff' : 'text.secondary',
                      '&:hover': {
                         backgroundColor: isActive ? 'primary.dark' : alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            <Box sx={{ flexGrow: 0, ml: 2 }}>
              <Button 
                color="error" 
                variant="outlined" 
                size="small"
                startIcon={<LogoutIcon />} 
                onClick={logout}
                sx={{ borderRadius: 50 }}
              >
                Sair
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

// --- DASHBOARD ---
function Dashboard() {
  const api = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          api<Customer[]>('/customers'),
          api<Product[]>('/products'),
        ]);
        if (active) {
          setCustomers(customersResponse ?? []);
          setProducts(productsResponse ?? []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar dados');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [api]);

  const latestCustomers = useMemo(
    () => [...customers].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 4),
    [customers],
  );

  const latestProducts = useMemo(
    () => [...products].sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated)).slice(0, 4),
    [products],
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography color="text.secondary">Visão geral do seu negócio</Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Clientes Ativos"
            value={customers.length}
            icon={<PeopleIcon />}
            color="primary.main"
            gradient="linear-gradient(135deg, #0F172A 0%, #334155 100%)"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Produtos"
            value={products.length}
            icon={<ProductIcon />}
            color="secondary.main"
            gradient="linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Ticket Médio"
            value={products.length ? currencyFormatter.format(products.reduce((acc, p) => acc + p.price, 0) / products.length) : 'R$ 0,00'}
            icon={<TrendingUpIcon />}
            color="#059669"
            gradient="linear-gradient(135deg, #059669 0%, #34D399 100%)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Últimos Clientes</Typography>
              <Button size="small" href="/clientes">Ver todos</Button>
            </Stack>
            <Stack spacing={2}>
              {latestCustomers.map((customer) => (
                <Card key={customer.id} variant="outlined" sx={{ '&:hover': { transform: 'none', boxShadow: 'none', bgcolor: '#F8FAFC' } }}>
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={customer.photoUrl} sx={{ width: 48, height: 48, bgcolor: 'secondary.light' }}>
                        {customer.firstName[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{customer.fullName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.email}
                        </Typography>
                      </Box>
                      <Box flexGrow={1} />
                      <Chip label="Novo" size="small" color="success" variant="outlined" />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              {!latestCustomers.length && <Typography color="text.secondary">Nenhum cliente recente.</Typography>}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Últimos Produtos</Typography>
              <Button size="small" href="/produtos">Ver todos</Button>
            </Stack>
            <Stack spacing={2}>
              {latestProducts.map((product) => (
                <Card key={product.id} variant="outlined" sx={{ '&:hover': { transform: 'none', boxShadow: 'none', bgcolor: '#F8FAFC' } }}>
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 2, 
                          bgcolor: 'background.default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                         {product.imageUrl ? (
                           <img src={product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         ) : (
                           <ProductIcon color="disabled" />
                         )}
                      </Box>
                      <Box>
                        <Typography fontWeight={600}>{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Atualizado: {formatDate(product.lastUpdated)}
                        </Typography>
                      </Box>
                      <Box flexGrow={1} />
                      <Typography fontWeight={700} color="primary">
                        {currencyFormatter.format(product.price)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              {!latestProducts.length && <Typography color="text.secondary">Nenhum produto recente.</Typography>}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

type SummaryCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  gradient: string;
};

function SummaryCard({ title, value, icon, gradient }: SummaryCardProps) {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        background: gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
           <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, display: 'flex' }}>
             {icon}
           </Box>
           <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
             {title}
           </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </Box>
      {/* Elemento decorativo */}
      <Box 
        sx={{ 
          position: 'absolute', 
          right: -20, 
          bottom: -20, 
          opacity: 0.1, 
          transform: 'scale(4)' 
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}

// --- PÁGINA DE CLIENTES ---
function CustomersPage() {
  const api = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Customer[]>('/customers');
      setCustomers(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleCreateOrUpdate = async (values: CustomerFormValues) => {
    setSaving(true);
    try {
      if (editingCustomer) {
        await api(`/customers/${editingCustomer.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
      } else {
        await api('/customers', {
          method: 'POST',
          body: JSON.stringify(values),
        });
      }
      await loadCustomers();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja realmente remover este cliente?')) {
      return;
    }
    try {
      await api(`/customers/${id}`, { method: 'DELETE' });
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover cliente');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
  };

  const filtered = useMemo(
    () =>
      customers.filter((customer) =>
        customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [customers, search],
  );

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
        <Box>
           <Typography variant="h4" fontWeight={700}>Clientes</Typography>
           <Typography color="text.secondary">Gerencie sua base de contatos</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setDialogOpen(true)}
          sx={{ height: 48, px: 3 }}
        >
          Novo Cliente
        </Button>
      </Stack>

      <TextField
        fullWidth
        placeholder="Buscar cliente por nome ou email..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((customer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={customer.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2 }}>
                <Box sx={{ position: 'relative', mt: 2 }}>
                  <Avatar 
                    src={customer.photoUrl} 
                    sx={{ 
                      width: 96, 
                      height: 96, 
                      fontSize: 32,
                      bgcolor: customer.photoUrl ? 'transparent' : 'secondary.main',
                      border: '4px solid #fff',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    {customer.firstName[0]}
                  </Avatar>
                </Box>
                <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>{customer.fullName}</Typography>
                  <Chip label={`${customer.age} anos`} size="small" sx={{ mb: 2, bgcolor: 'background.default' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                     <EmailIcon fontSize="small" /> {customer.email}
                  </Typography>
                </CardContent>
                <CardActions sx={{ width: '100%', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                   <Button size="small" startIcon={<EditIcon />} onClick={() => { setEditingCustomer(customer); setDialogOpen(true); }}>
                     Editar
                   </Button>
                   <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(customer.id)}>
                     Remover
                   </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {!filtered.length && (
            <Grid item xs={12}>
               <Box textAlign="center" py={8} bgcolor="background.paper" borderRadius={4}>
                 <Typography color="text.secondary">Nenhum cliente encontrado.</Typography>
               </Box>
            </Grid>
          )}
        </Grid>
      )}

      <CustomerFormDialog
        open={dialogOpen}
        loading={saving}
        initialData={editingCustomer ?? undefined}
        onClose={handleCloseDialog}
        onSubmit={handleCreateOrUpdate}
      />
    </Stack>
  );
}

// --- DIALOG DE CLIENTE ---
type CustomerDialogProps = {
  open: boolean;
  initialData?: Customer;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
};

function CustomerFormDialog({ open, initialData, loading, onClose, onSubmit }: CustomerDialogProps) {
  const defaultValues: CustomerFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    age: 18,
    photoUrl: '',
  };

  const { register, handleSubmit, formState, reset } = useForm<CustomerFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialData ? {
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        age: initialData.age,
        photoUrl: initialData.photoUrl ?? '',
      } : defaultValues);
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        {initialData ? 'Editar Cliente' : 'Novo Cliente'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Nome"
                fullWidth
                {...register('firstName', { required: 'Obrigatório' })}
                error={!!formState.errors.firstName}
                helperText={formState.errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Sobrenome"
                fullWidth
                {...register('lastName', { required: 'Obrigatório' })}
                error={!!formState.errors.lastName}
                helperText={formState.errors.lastName?.message}
              />
            </Grid>
          </Grid>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Obrigatório' })}
            error={!!formState.errors.email}
            helperText={formState.errors.email?.message}
          />
          <TextField
            label="Idade"
            type="number"
            fullWidth
            margin="normal"
            {...register('age', { valueAsNumber: true, min: 0 })}
          />
          <TextField
            label="URL da Foto (Opcional)"
            fullWidth
            margin="normal"
            {...register('photoUrl')}
            InputProps={{
              startAdornment: <InputAdornment position="start"><ImageIcon /></InputAdornment>
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Cliente'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

// --- PÁGINA DE PRODUTOS ---
function ProductsPage() {
  const api = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Product[]>('/products');
      setProducts(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreateOrUpdate = async (values: ProductFormValues) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await api(`/products/${editingProduct.id}`, { method: 'PUT', body: JSON.stringify(values) });
      } else {
        await api('/products', { method: 'POST', body: JSON.stringify(values) });
      }
      await loadProducts();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja realmente remover este produto?')) {
      return;
    }
    try {
      await api(`/products/${id}`, { method: 'DELETE' });
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover produto');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
        <Box>
           <Typography variant="h4" fontWeight={700}>Catálogo de Produtos</Typography>
           <Typography color="text.secondary">Gerencie estoque e preços</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setDialogOpen(true)}
          sx={{ height: 48, px: 3 }}
        >
          Novo Produto
        </Button>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'grey.100' }}>
                   {product.imageUrl ? (
                     <CardMedia
                       component="img"
                       image={product.imageUrl}
                       alt={product.name}
                       sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                     />
                   ) : (
                     <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
                        <ProductIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                     </Box>
                   )}
                   <Chip 
                     label={currencyFormatter.format(product.price)} 
                     color="secondary" 
                     size="small" 
                     sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }} 
                   />
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom noWrap title={product.name}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                   <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                     {formatDate(product.lastUpdated)}
                   </Typography>
                   <IconButton size="small" color="primary" onClick={() => { setEditingProduct(product); setDialogOpen(true); }}>
                     <EditIcon />
                   </IconButton>
                   <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                     <DeleteIcon />
                   </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {!products.length && (
            <Grid item xs={12}>
               <Box textAlign="center" py={8} bgcolor="background.paper" borderRadius={4}>
                 <Typography color="text.secondary">Nenhum produto cadastrado.</Typography>
               </Box>
            </Grid>
          )}
        </Grid>
      )}

      <ProductFormDialog
        open={dialogOpen}
        loading={saving}
        initialData={editingProduct ?? undefined}
        onClose={handleCloseDialog}
        onSubmit={handleCreateOrUpdate}
      />
    </Stack>
  );
}

// --- DIALOG DE PRODUTO ---
type ProductDialogProps = {
  open: boolean;
  initialData?: Product;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
};

function ProductFormDialog({ open, initialData, loading, onClose, onSubmit }: ProductDialogProps) {
  const defaultValues: ProductFormValues = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '', // Campo novo
  };

  const { register, handleSubmit, formState, reset } = useForm<ProductFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialData ? {
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        imageUrl: initialData.imageUrl ?? '',
      } : defaultValues);
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        {initialData ? 'Editar Produto' : 'Novo Produto'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Nome do Produto"
            fullWidth
            {...register('name', { required: 'Obrigatório' })}
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message}
          />
          <TextField
            label="URL da Imagem"
            fullWidth
            margin="normal"
            placeholder="https://..."
            {...register('imageUrl')}
            InputProps={{
              startAdornment: <InputAdornment position="start"><ImageIcon /></InputAdornment>
            }}
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Preço (R$)"
                type="number"
                fullWidth
                {...register('price', {
                  required: 'Obrigatório',
                  min: { value: 0.01, message: 'Valor mínimo R$ 0,01' },
                  valueAsNumber: true,
                })}
                error={!!formState.errors.price}
                helperText={formState.errors.price?.message}
              />
            </Grid>
          </Grid>
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            {...register('description', { required: 'Obrigatório' })}
            error={!!formState.errors.description}
            helperText={formState.errors.description?.message}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default App;