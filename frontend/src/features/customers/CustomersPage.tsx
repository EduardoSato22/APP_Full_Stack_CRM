import { useState } from 'react';
import {
  Alert, Avatar, Box, Button, Card, CardActions, CardContent,
  Chip, FormControl, Grid, InputAdornment, InputLabel,
  MenuItem, Select, Stack, TextField, Typography,
} from '@mui/material';
import {
  Add as AddIcon, Business as BusinessIcon,
  Delete as DeleteIcon, Edit as EditIcon,
  Phone as PhoneIcon, Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { BRL, STATUS_COLORS } from '../../constants';
import type { Customer, Page } from '../../types';
import { LoadingCenter } from '../../shared/LoadingCenter';
import { EmptyState } from '../../shared/EmptyState';
import { ExportMenu } from '../../shared/ExportMenu';
import { CustomerDialog } from './CustomerDialog';

export function CustomersPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const { data: page, isLoading } = useQuery({
    queryKey: ['customers', activeSearch, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({ page: '0', size: '20' });
      if (activeSearch) params.set('search', activeSearch);
      if (statusFilter) params.set('status', statusFilter);
      return api<Page<Customer>>(`/api/customers?${params}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api(`/api/customers/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
    onError: (e: Error) => setDeleteError(e.message),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Remover cliente?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">Clientes</Typography>
          <Typography color="text.secondary">{page?.totalElements ?? 0} registros</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <ExportMenu resource="customers" />
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => { setEditing(null); setDialogOpen(true); }}>
            Novo Cliente
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField placeholder="Buscar por nome, email, empresa..." value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setActiveSearch(search)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          sx={{ flexGrow: 1 }} />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {['LEAD','PROSPECT','ACTIVE','INACTIVE','CHURNED'].map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {deleteError && <Alert severity="error" onClose={() => setDeleteError('')}>{deleteError}</Alert>}

      {isLoading ? <LoadingCenter /> : (
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
                  <Button size="small" startIcon={<EditIcon />}
                    onClick={() => { setEditing(c); setDialogOpen(true); }}>Editar</Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(c.id)}>Remover</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {!page?.content.length && <EmptyState message="Nenhum cliente encontrado" />}
        </Grid>
      )}

      <CustomerDialog open={dialogOpen} customer={editing}
        onClose={() => setDialogOpen(false)} />
    </Stack>
  );
}
