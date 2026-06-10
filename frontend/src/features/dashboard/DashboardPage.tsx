import { Alert, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  Assignment as ActivityIcon, AttachMoney as MoneyIcon,
  People as PeopleIcon, TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApi } from '../../contexts/AuthContext';
import { BRL, STAGE_COLORS, STAGE_LABELS } from '../../constants';
import type { DashboardData } from '../../types';
import { LoadingCenter } from '../../shared/LoadingCenter';

export function DashboardPage() {
  const api = useApi();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => api<DashboardData>('/api/dashboard/summary'),
    staleTime: 60_000,
  });

  if (isLoading) return <LoadingCenter />;
  if (isError || !data) return <Alert severity="error">Erro ao carregar dashboard</Alert>;

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
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
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
