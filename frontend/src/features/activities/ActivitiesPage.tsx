import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip,
  IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import {
  Add as AddIcon, Assignment as ActivityIcon,
  CheckCircle as DoneIcon, Edit as EditIcon,
  Email as EmailIcon, People as PeopleIcon, Phone as PhoneIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { ACTIVITY_PRIORITY_LABELS, ACTIVITY_STATUS_LABELS, PRIORITY_COLORS, fmtDate } from '../../constants';
import type { Activity, Page } from '../../types';
import { LoadingCenter } from '../../shared/LoadingCenter';
import { EmptyState } from '../../shared/EmptyState';
import { ActivityDialog } from './ActivityDialog';

const ACTIVITY_TYPE_ICONS: Record<string, ReactNode> = {
  CALL: <PhoneIcon fontSize="small" />, EMAIL: <EmailIcon fontSize="small" />,
  MEETING: <PeopleIcon fontSize="small" />, TASK: <ActivityIcon fontSize="small" />,
  NOTE: <EditIcon fontSize="small" />, WHATSAPP: <PhoneIcon fontSize="small" />,
};

export function ActivitiesPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completeError, setCompleteError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['activities', statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({ size: '50' });
      if (statusFilter) params.set('status', statusFilter);
      return api<Page<Activity>>(`/api/activities?${params}`);
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => api(`/api/activities/${id}/complete`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
    onError: (e: Error) => setCompleteError(e.message),
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Atividades</Typography>
          <Typography color="text.secondary">{data?.totalElements ?? 0} registros</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Nova Atividade</Button>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {(['', 'PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const).map(s => (
          <Chip key={s} label={s ? ACTIVITY_STATUS_LABELS[s] : 'Todas'}
            onClick={() => setStatusFilter(s)}
            color={statusFilter === s ? 'primary' : 'default'}
            variant={statusFilter === s ? 'filled' : 'outlined'} />
        ))}
      </Stack>

      {completeError && <Alert severity="error" onClose={() => setCompleteError('')}>{completeError}</Alert>}

      {isLoading ? <LoadingCenter /> : (
        <Stack spacing={1.5}>
          {data?.content.map(a => (
            <Card key={a.id}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1, bgcolor: PRIORITY_COLORS[a.priority] + '20', borderRadius: 2, color: PRIORITY_COLORS[a.priority], display: 'flex', mt: 0.3 }}>
                    {ACTIVITY_TYPE_ICONS[a.type] ?? <ActivityIcon fontSize="small" />}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography fontWeight={600}>{a.title}</Typography>
                      <Chip label={ACTIVITY_PRIORITY_LABELS[a.priority] ?? a.priority} size="small" sx={{ bgcolor: PRIORITY_COLORS[a.priority] + '20', color: PRIORITY_COLORS[a.priority], fontWeight: 600, height: 20 }} />
                      <Chip label={ACTIVITY_STATUS_LABELS[a.status] ?? a.status} size="small" variant="outlined" sx={{ height: 20 }} />
                    </Stack>
                    {a.description && <Typography variant="body2" color="text.secondary">{a.description}</Typography>}
                    <Stack direction="row" spacing={2} mt={0.5}>
                      {a.customerName && <Typography variant="caption" color="text.secondary"><PeopleIcon sx={{ fontSize: 11, mr: 0.3 }} />{a.customerName}</Typography>}
                      {a.dueDate && (
                        <Typography variant="caption" color={new Date(a.dueDate) < new Date() && a.status === 'PENDING' ? 'error.main' : 'text.secondary'}>
                          Vence: {fmtDate(a.dueDate)}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                  {a.status !== 'DONE' && a.status !== 'CANCELLED' && (
                    <Tooltip title="Concluir">
                      <IconButton size="small" color="success" onClick={() => completeMutation.mutate(a.id)}><DoneIcon /></IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
          {!data?.content.length && <EmptyState message="Nenhuma atividade encontrada" />}
        </Stack>
      )}

      <ActivityDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Stack>
  );
}
