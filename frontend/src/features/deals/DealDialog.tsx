import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, InputLabel, MenuItem, Select, TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { dealSchema, type DealFormData } from './dealSchema';
import { STAGE_LABELS } from '../../constants';
import type { Customer, Page } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DealDialog({ open, onClose }: Props) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
  });

  const { data: customersPage } = useQuery({
    queryKey: ['customers-list'],
    queryFn: () => api<Page<Customer>>('/api/customers?size=100'),
    enabled: open,
  });
  const customers = customersPage?.content ?? [];

  useEffect(() => {
    if (open) {
      reset({ stage: 'PROSPECTING', value: 0, title: '', customerId: 0 } as DealFormData);
      setError('');
    }
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (data: DealFormData) =>
      api('/api/deals', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Nova Negociação</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(data => mutation.mutate(data))}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Título *" fullWidth {...register('title')}
                error={!!errors.title} helperText={errors.title?.message} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Valor (R$)" fullWidth type="number" inputProps={{ step: '0.01' }} {...register('value')} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Estágio</InputLabel>
                <Select label="Estágio" defaultValue="PROSPECTING" {...register('stage')}>
                  {(['PROSPECTING','QUALIFICATION','PROPOSAL','NEGOTIATION'] as const).map(s => (
                    <MenuItem key={s} value={s}>{STAGE_LABELS[s]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.customerId}>
                <InputLabel>Cliente *</InputLabel>
                <Select label="Cliente *" {...register('customerId')}>
                  {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField label="Observações" fullWidth multiline rows={2} {...register('notes')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
