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
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  PeopleAlt as PeopleIcon,
  Storefront as StoreIcon,
  TrendingUp as TrendingUpIcon,
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

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#154360' },
    secondary: { main: '#F39C12' },
    background: {
      default: '#f6f7fb',
    },
  },
  shape: { borderRadius: 12 },
});

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

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
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro do AuthContext.Provider');
  }
  return context;
};

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

const formatDateTime = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

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
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Stack spacing={2} textAlign="center" mb={2}>
          <Typography variant="h4" fontWeight={600}>
            RetailFlow CRM
          </Typography>
          <Typography color="text.secondary">
            {isLogin
              ? 'Acesse sua área para gerenciar clientes e produtos'
              : 'Crie uma conta para começar o desafio final'}
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              label="Nome completo"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              required
            />
          )}

          <TextField
            label="Email institucional"
            fullWidth
            margin="normal"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            required
          />

          <TextField
            label="Senha"
            fullWidth
            margin="normal"
            type="password"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : isLogin ? 'Entrar' : 'Criar conta'}
          </Button>

          <Button fullWidth sx={{ mt: 1 }} onClick={() => setIsLogin((value) => !value)}>
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já possui conta? Faça login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

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

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: 'Dashboard', path: '/' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Produtos', path: '/produtos' },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#0b273c' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            RetailFlow | {user?.name}
          </Typography>
          <Stack direction="row" spacing={1} mr={3}>
            {items.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                variant={location.pathname === item.path ? 'outlined' : 'text'}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

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
    () => [...customers].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 3),
    [customers],
  );

  const latestProducts = useMemo(
    () => [...products].sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated)).slice(0, 3),
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
    <Stack spacing={3}>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Clientes ativos"
            value={customers.length}
            subtitle="Cadastros completos com foto e contato"
            icon={<PeopleIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Produtos ofertados"
            value={products.length}
            subtitle="Catálogo pronto para CRUD completo"
            icon={<StoreIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Ticket médio"
            value={
              products.length
                ? currencyFormatter.format(
                    products.reduce((total, product) => total + product.price, 0) / products.length,
                  )
                : '—'
            }
            subtitle="Baseado nos valores cadastrados"
            icon={<TrendingUpIcon fontSize="large" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Últimos clientes
            </Typography>
            {latestCustomers.map((customer) => (
              <Stack key={customer.id} direction="row" alignItems="center" spacing={2} py={1}>
                <Avatar src={customer.photoUrl}>{customer.firstName[0]}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{customer.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.email} • {customer.age} anos
                  </Typography>
                </Box>
              </Stack>
            ))}
            {!latestCustomers.length && (
              <Typography color="text.secondary">Cadastre um cliente para começar.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Últimos produtos
            </Typography>
            {latestProducts.map((product) => (
              <Stack key={product.id} spacing={0.5} py={1.2}>
                <Typography fontWeight={600}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currencyFormatter.format(product.price)} • Atualizado em {formatDate(product.lastUpdated)}
                </Typography>
              </Stack>
            ))}
            {!latestProducts.length && (
              <Typography color="text.secondary">Cadastre um produto para visualizar aqui.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

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
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Clientes
          </Typography>
          <Typography color="text.secondary">
            Cadastre e mantenha o CRM em dia, como descrito no desafio final.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Novo cliente
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TextField
        placeholder="Busque por nome ou email"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((customer) => (
            <Grid item xs={12} sm={6} md={4} key={customer.id}>
              <Card>
                <CardHeader
                  avatar={<Avatar src={customer.photoUrl}>{customer.firstName[0]}</Avatar>}
                  title={customer.fullName}
                  subheader={`${customer.email} • ${customer.age} anos`}
                />
                <CardContent>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Cliente ativo" color="primary" size="small" />
                  </Stack>
                  <Stack direction="row" spacing={1} mt={2}>
                    <IconButton color="primary" onClick={() => { setEditingCustomer(customer); setDialogOpen(true); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(customer.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!filtered.length && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography>Cadastre o primeiro cliente para visualizar aqui.</Typography>
              </Paper>
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
      reset(
        initialData
          ? {
              firstName: initialData.firstName,
              lastName: initialData.lastName,
              email: initialData.email,
              age: initialData.age,
              photoUrl: initialData.photoUrl ?? '',
            }
          : defaultValues,
      );
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar cliente' : 'Novo cliente'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                fullWidth
                margin="normal"
                {...register('firstName', { required: 'Informe o nome' })}
                error={!!formState.errors.firstName}
                helperText={formState.errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobrenome"
                fullWidth
                margin="normal"
                {...register('lastName', { required: 'Informe o sobrenome' })}
                error={!!formState.errors.lastName}
                helperText={formState.errors.lastName?.message}
              />
            </Grid>
          </Grid>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Informe o email' })}
            error={!!formState.errors.email}
            helperText={formState.errors.email?.message}
          />
          <TextField
            label="Idade"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
            {...register('age', {
              required: 'Informe a idade',
              valueAsNumber: true,
              min: { value: 0, message: 'Idade deve ser positiva' },
            })}
            error={!!formState.errors.age}
            helperText={formState.errors.age?.message}
          />
          <TextField
            label="URL da foto"
            fullWidth
            margin="normal"
            {...register('photoUrl')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

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
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Produtos
          </Typography>
          <Typography color="text.secondary">
            Controle todo o catálogo com preços e datas de atualização.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Novo produto
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" px={3} py={2} fontWeight={600}>
            <Typography>Produto</Typography>
            <Typography>Descrição</Typography>
            <Typography>Preço</Typography>
            <Typography>Atualizado em</Typography>
            <Typography textAlign="right">Ações</Typography>
          </Box>
          <Divider />
          {products.map((product) => (
            <Box
              key={product.id}
              display="grid"
              gridTemplateColumns="repeat(5, 1fr)"
              px={3}
              py={2}
              alignItems="center"
            >
              <Typography fontWeight={600}>{product.name}</Typography>
              <Typography color="text.secondary" noWrap>
                {product.description}
              </Typography>
              <Typography>{currencyFormatter.format(product.price)}</Typography>
              <Typography>{formatDateTime(product.lastUpdated)}</Typography>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <IconButton
                  color="primary"
                  onClick={() => {
                    setEditingProduct(product);
                    setDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
          {!products.length && (
            <Box textAlign="center" py={4} color="text.secondary">
              Nenhum produto cadastrado.
            </Box>
          )}
        </Paper>
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
  };

  const { register, handleSubmit, formState, reset } = useForm<ProductFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              name: initialData.name,
              description: initialData.description,
              price: initialData.price,
            }
          : defaultValues,
      );
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar produto' : 'Novo produto'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            {...register('name', { required: 'Informe o nome do produto' })}
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message}
          />
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            {...register('description', { required: 'Informe a descrição' })}
            error={!!formState.errors.description}
            helperText={formState.errors.description?.message}
          />
          <TextField
            label="Preço"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
            {...register('price', {
              required: 'Informe o preço',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Preço deve ser maior que zero' },
            })}
            error={!!formState.errors.price}
            helperText={formState.errors.price?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

type SummaryCardProps = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: ReactNode;
};

function SummaryCard({ title, value, subtitle, icon }: SummaryCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e8f0' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default App;