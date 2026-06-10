import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, InputLabel, MenuItem, Select, TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { activitySchema, type ActivityFormData } from './activitySchema';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ActivityDialog({ open, onClose }: Props) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
  });

  useEffect(() => {
    if (open) {
      reset({ type: 'TASK', priority: 'MEDIUM', title: '' } as ActivityFormData);
      setError('');
    }
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (data: ActivityFormData) =>
      api('/api/activities', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Nova Atividade</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(data => mutation.mutate(data))}>
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
            <Grid item xs={12}>
              <TextField label="Título *" fullWidth {...register('title')}
                error={!!errors.title} helperText={errors.title?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Data de Vencimento" fullWidth type="datetime-local"
                InputLabelProps={{ shrink: true }} {...register('dueDate')} />
            </Grid>
            <Grid item xs={12}><TextField label="Descrição" fullWidth multiline rows={2} {...register('description')} /></Grid>
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
