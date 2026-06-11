import { useState } from 'react';
import {
  Alert, Box, Button, Card, CardActions, CardContent, CardMedia,
  Chip, Grid, IconButton, InputAdornment, Stack, TextField, Typography,
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
  Inventory2 as ProductIcon, Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { BRL, fmtDate } from '../../constants';
import type { Product, Page } from '../../types';
import { LoadingCenter } from '../../shared/LoadingCenter';
import { EmptyState } from '../../shared/EmptyState';
import { ExportMenu } from '../../shared/ExportMenu';
import { ProductDialog } from './ProductDialog';

export function ProductsPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const { data: page, isLoading } = useQuery({
    queryKey: ['products', activeSearch],
    queryFn: () => {
      const params = new URLSearchParams({ page: '0', size: '20' });
      if (activeSearch) params.set('search', activeSearch);
      return api<Page<Product>>(`/api/products?${params}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    onError: (e: Error) => setDeleteError(e.message),
  });

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">Produtos</Typography>
          <Typography color="text.secondary">{page?.totalElements ?? 0} itens</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <ExportMenu resource="products" />
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => { setEditing(null); setDialogOpen(true); }}>
            Novo Produto
          </Button>
        </Stack>
      </Stack>

      <TextField placeholder="Buscar produto..." value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && setActiveSearch(search)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />

      {deleteError && <Alert severity="error" onClose={() => setDeleteError('')}>{deleteError}</Alert>}

      {isLoading ? <LoadingCenter /> : (
        <Grid container spacing={2}>
          {page?.content.map(p => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'grey.100', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
                  {p.imageUrl
                    ? <CardMedia component="img" image={p.imageUrl} alt={p.name} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ProductIcon sx={{ fontSize: 48, color: 'grey.300' }} />
                      </Box>
                  }
                  <Chip label={BRL.format(p.price)} color="secondary" size="small" sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700 }} />
                  {(p.stock ?? 0) < 5 && <Chip label="Baixo estoque" color="error" size="small" sx={{ position: 'absolute', top: 10, left: 10 }} />}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} noWrap>{p.name}</Typography>
                  {p.categoryName && <Chip label={p.categoryName} size="small" variant="outlined" sx={{ mb: 1 }} />}
                  <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </Typography>
                  {p.sku && <Typography variant="caption" color="text.secondary">SKU: {p.sku}</Typography>}
                  <Stack direction="row" spacing={1} mt={1} alignItems="center">
                    {p.stock != null && <Chip label={`Estoque: ${p.stock}`} size="small" color={p.stock < 5 ? 'error' : 'success'} variant="outlined" />}
                    {p.margin != null && <Typography variant="caption" color="success.main" fontWeight={600}>{p.margin.toFixed(1)}% margem</Typography>}
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>{fmtDate(p.lastUpdated)}</Typography>
                  <IconButton size="small" color="primary" onClick={() => { setEditing(p); setDialogOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(p.id)}><DeleteIcon fontSize="small" /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {!page?.content.length && <EmptyState message="Nenhum produto cadastrado" />}
        </Grid>
      )}

      <ProductDialog open={dialogOpen} product={editing} onClose={() => setDialogOpen(false)} />
    </Stack>
  );
}
