import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { productSchema, type ProductFormData } from './productSchema';
import type { Product } from '../../types';

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

export function ProductDialog({ open, product, onClose }: Props) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (open) {
      reset((product ?? { status: 'ACTIVE', unit: 'UNIT', stock: 0 }) as ProductFormData);
      setError('');
    }
  }, [product, open, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      product
        ? api(`/api/products/${product.id}`, { method: 'PUT', body: JSON.stringify(data) })
        : api('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        {product ? 'Editar Produto' : 'Novo Produto'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(data => mutation.mutate(data))}>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Nome *" fullWidth {...register('name')}
                error={!!errors.name} helperText={errors.name?.message} />
            </Grid>
            <Grid item xs={12}><TextField label="URL da Imagem" fullWidth {...register('imageUrl')} /></Grid>
            <Grid item xs={6}>
              <TextField label="Preço *" fullWidth type="number" inputProps={{ step: '0.01' }} {...register('price')}
                error={!!errors.price} helperText={errors.price?.message} />
            </Grid>
            <Grid item xs={6}><TextField label="Preço de Custo" fullWidth type="number" inputProps={{ step: '0.01' }} {...register('costPrice')} /></Grid>
            <Grid item xs={6}><TextField label="SKU" fullWidth {...register('sku')} /></Grid>
            <Grid item xs={6}><TextField label="Estoque" fullWidth type="number" {...register('stock')} /></Grid>
            <Grid item xs={12}>
              <TextField label="Descrição *" fullWidth multiline rows={3} {...register('description')}
                error={!!errors.description} helperText={errors.description?.message} />
            </Grid>
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
