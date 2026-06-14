import { useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { BRL, fmtDate } from '../../constants';

interface SaleItemResponse { id: number; productId: number; productName: string; quantity: number; unitPrice: number; subtotal: number; }
interface Sale { id: number; customerId: number; customerName: string; status: string; total: number; saleDate: string; notes?: string; items: SaleItemResponse[]; }
interface Customer { id: number; firstName: string; lastName: string; }
interface Product { id: number; name: string; price: number; }

const STATUS_COLORS: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  PENDING: 'default', CONFIRMED: 'info', SHIPPED: 'warning',
  DELIVERED: 'success', CANCELLED: 'error', REFUNDED: 'error',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente', CONFIRMED: 'Confirmado', SHIPPED: 'Enviado',
  DELIVERED: 'Entregue', CANCELLED: 'Cancelado', REFUNDED: 'Devolvido',
};

export function SalesPage() {
  const api = useApi();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [form, setForm] = useState({ customerId: '', items: [{ productId: '', quantity: 1 }] as { productId: string; quantity: number }[], notes: '' });

  const { data: sales, isLoading, error } = useQuery<{ content: Sale[] }>({
    queryKey: ['sales', filterStatus],
    queryFn: () => api(`/api/sales?${filterStatus ? `status=${filterStatus}&` : ''}sort=saleDate,desc`),
  });

  const { data: customers } = useQuery<{ content: Customer[] }>({
    queryKey: ['customers-dropdown'],
    queryFn: () => api('/api/customers?size=200'),
  });

  const { data: products } = useQuery<{ content: Product[] }>({
    queryKey: ['products-dropdown'],
    queryFn: () => api('/api/products?size=200'),
  });

  const createMutation = useMutation({
    mutationFn: (body: object) => api('/api/sales', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); setDialogOpen(false); resetForm(); },
    onError: (e: Error) => setMutationError(e.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api(`/api/sales/${id}/status?status=${status}`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
    onError: (e: Error) => setMutationError(e.message),
  });

  const resetForm = () => setForm({ customerId: '', items: [{ productId: '', quantity: 1 }], notes: '' });

  const handleCreate = () => {
    createMutation.mutate({
      customerId: Number(form.customerId),
      items: form.items.filter(i => i.productId).map(i => ({ productId: Number(i.productId), quantity: i.quantity })),
      notes: form.notes || undefined,
    });
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { productId: '', quantity: 1 }] }));
  const updateItem = (idx: number, field: string, val: string | number) =>
    setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [field]: val } : it) }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Vendas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Nova Venda
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} label="Status" onChange={e => setFilterStatus(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {mutationError && <Alert severity="error" onClose={() => setMutationError('')} sx={{ mb: 2 }}>{mutationError}</Alert>}
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Erro ao carregar vendas</Alert>}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales?.content?.map(s => (
              <TableRow key={s.id} hover>
                <TableCell>#{s.id}</TableCell>
                <TableCell>{s.customerName}</TableCell>
                <TableCell>{fmtDate(s.saleDate)}</TableCell>
                <TableCell align="right"><b>{BRL.format(s.total)}</b></TableCell>
                <TableCell>
                  <Chip label={STATUS_LABELS[s.status] ?? s.status} color={STATUS_COLORS[s.status] ?? 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select
                      value={s.status}
                      onChange={e => statusMutation.mutate({ id: s.id, status: e.target.value })}
                      displayEmpty
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && !sales?.content?.length && (
              <TableRow><TableCell colSpan={6} align="center">Nenhuma venda encontrada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Venda</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth required>
              <InputLabel>Cliente</InputLabel>
              <Select value={form.customerId} label="Cliente" onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}>
                {customers?.content?.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2" fontWeight={600}>Itens</Typography>
            {form.items.map((item, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <FormControl sx={{ flex: 2 }} size="small">
                  <InputLabel>Produto</InputLabel>
                  <Select value={item.productId} label="Produto" onChange={e => updateItem(idx, 'productId', e.target.value)}>
                    {products?.content?.map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.name} — {BRL.format(p.price)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Qtd" type="number" size="small" sx={{ width: 70 }}
                  value={item.quantity} inputProps={{ min: 1 }}
                  onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                />
                {form.items.length > 1 && (
                  <Button color="error" size="small" onClick={() => removeItem(idx)}>✕</Button>
                )}
              </Stack>
            ))}
            <Button size="small" onClick={addItem}>+ Adicionar item</Button>

            <TextField
              label="Observações" multiline rows={2} fullWidth size="small"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); resetForm(); }}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!form.customerId || form.items.every(i => !i.productId) || createMutation.isPending}
            onClick={handleCreate}
          >
            {createMutation.isPending ? <CircularProgress size={20} /> : 'Registrar Venda'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
