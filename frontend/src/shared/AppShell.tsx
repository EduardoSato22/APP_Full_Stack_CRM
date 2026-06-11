import { useContext, useEffect, useState } from 'react';
import {
  AppBar, Avatar, Badge, Box, Button, Chip, Divider, Drawer,
  IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Menu, MenuItem, Toolbar, Tooltip, Typography, alpha, useTheme,
} from '@mui/material';
import {
  Assignment as ActivityIcon, AttachMoney as MoneyIcon,
  Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon, Inventory2 as ProductIcon,
  Logout as LogoutIcon, Menu as MenuIcon,
  Notifications as NotificationsIcon, People as PeopleIcon,
  Storefront as StoreIcon,
} from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../contexts/ColorModeContext';
import { useApi, useAuth } from '../contexts/AuthContext';
import { useNotifications } from './useNotifications';
import type { Notification } from '../types';

const SIDEBAR_WIDTH = 240;
const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/',           icon: <DashboardIcon /> },
  { label: 'Clientes',     path: '/customers',  icon: <PeopleIcon /> },
  { label: 'Produtos',     path: '/products',   icon: <ProductIcon /> },
  { label: 'Negociações',  path: '/deals',      icon: <MoneyIcon /> },
  { label: 'Atividades',   path: '/activities', icon: <ActivityIcon /> },
];

export function AppShell() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [restCount, setRestCount] = useState(0);
  const api = useApi();
  const muiTheme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);

  const { liveNotifications, liveCount, resetCount } = useNotifications(user?.userId, token);

  const notifCount = restCount + liveCount;

  useEffect(() => {
    api<{ unread: number }>('/api/notifications/count')
      .then(d => setRestCount(d?.unread ?? 0)).catch(() => {});
  }, []);

  const openNotifications = async (e: React.MouseEvent<HTMLElement>) => {
    setNotifAnchor(e.currentTarget);
    const data = await api<Notification[]>('/api/notifications').catch(() => []);
    const merged = [...liveNotifications.filter(ln => !data?.some(d => d.id === ln.id)), ...(data ?? [])];
    setNotifications(merged);
    setRestCount(0);
    resetCount();
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
                  '&:hover': { bgcolor: active ? 'primary.dark' : alpha(muiTheme.palette.primary.main, 0.06) },
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
            <Tooltip title={muiTheme.palette.mode === 'dark' ? 'Modo claro' : 'Modo escuro'}>
              <IconButton onClick={toggleColorMode} sx={{ mr: 0.5 }}>
                {muiTheme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={openNotifications}>
              <Badge badgeContent={notifCount} color="error"><NotificationsIcon /></Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>

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
