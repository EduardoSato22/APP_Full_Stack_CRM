import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { customerSchema, type CustomerFormData } from './customerSchema';
import { ImageUpload } from '../../shared/ImageUpload';
import type { Customer } from '../../types';

interface Props {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerDialog({ open, customer, onClose }: Props) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (open) {
      reset((customer ?? { status: 'LEAD', source: 'ORGANIC' }) as CustomerFormData);
      setError('');
    }
  }, [customer, open, reset]);

  const mutation = useMutation({
    mutationFn: (data: CustomerFormData) =>
      customer
        ? api(`/api/customers/${customer.id}`, { method: 'PUT', body: JSON.stringify(data) })
        : api('/api/customers', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        {customer ? 'Editar Cliente' : 'Novo Cliente'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(data => mutation.mutate(data))}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Nome *" fullWidth {...register('firstName')}
                error={!!errors.firstName} helperText={errors.firstName?.message} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Sobrenome *" fullWidth {...register('lastName')}
                error={!!errors.lastName} helperText={errors.lastName?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email *" fullWidth type="email" {...register('email')}
                error={!!errors.email} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={6}><TextField label="Telefone" fullWidth {...register('phone')} /></Grid>
            <Grid item xs={6}><TextField label="Idade" fullWidth type="number" {...register('age')} /></Grid>
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
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Foto do Cliente</Typography>
              <Controller
                name="photoUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload value={field.value ?? ''} onChange={field.onChange} label="Foto do Cliente" />
                )}
              />
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
