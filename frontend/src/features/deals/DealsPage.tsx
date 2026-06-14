import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../contexts/AuthContext';
import { BRL } from '../../constants';
import type { Deal } from '../../types';
import { LoadingCenter } from '../../shared/LoadingCenter';
import { ExportMenu } from '../../shared/ExportMenu';
import { DroppableStageColumn } from './DealColumn';
import { DealDialog } from './DealDialog';

const STAGES = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

export function DealsPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { data: kanban = {}, isLoading } = useQuery({
    queryKey: ['deals-kanban'],
    queryFn: () => api<Record<string, Deal[]>>('/api/deals/kanban'),
  });

  const stageMutation = useMutation({
    mutationFn: ({ dealId, toStage, lostReason }: { dealId: number; toStage: string; fromStage: string; lostReason?: string }) => {
      const params = new URLSearchParams({ stage: toStage });
      if (lostReason) params.set('lostReason', lostReason);
      return api(`/api/deals/${dealId}/stage?${params}`, { method: 'PUT' });
    },
    onMutate: ({ dealId, fromStage, toStage }) => {
      const snapshot = queryClient.getQueryData<Record<string, Deal[]>>(['deals-kanban']);
      queryClient.setQueryData<Record<string, Deal[]>>(['deals-kanban'], prev => {
        if (!prev) return prev;
        const deal = prev[fromStage]?.find(d => d.id === dealId);
        if (!deal) return prev;
        return {
          ...prev,
          [fromStage]: (prev[fromStage] ?? []).filter(d => d.id !== dealId),
          [toStage]: [...(prev[toStage] ?? []), { ...deal, stage: toStage }],
        };
      });
      return { snapshot };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
    onError: (e: Error, _, context) => {
      if (context?.snapshot) queryClient.setQueryData(['deals-kanban'], context.snapshot);
      setError(e.message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['deals-kanban'] }),
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDeal(event.active.data.current?.deal ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;
    const fromStage: string = active.data.current?.fromStage;
    const toStage: string = (over.id as string).replace('stage-', '');
    const dealId: number = active.data.current?.deal?.id;
    if (fromStage === toStage || !dealId) return;

    let lostReason: string | undefined;
    if (toStage === 'LOST') {
      const reason = prompt('Motivo da perda:');
      if (!reason) return;
      lostReason = reason;
    }

    stageMutation.mutate({ dealId, toStage, fromStage, lostReason });
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Pipeline de Vendas</Typography>
          <Typography color="text.secondary">Arraste os cards para mover entre estágios</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <ExportMenu resource="deals" />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Nova Negociação</Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {isLoading ? <LoadingCenter /> : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Box sx={{ overflowX: 'auto', pb: 2 }}>
            <Stack direction="row" spacing={2} sx={{ minWidth: STAGES.length * 290 }}>
              {STAGES.map(stage => (
                <DroppableStageColumn key={stage} stage={stage} deals={kanban[stage] ?? []} />
              ))}
            </Stack>
          </Box>
          <DragOverlay>
            {activeDeal && (
              <Card sx={{ width: 260, cursor: 'grabbing', boxShadow: '0 8px 24px rgb(0 0 0/0.2)', rotate: '2deg' }}>
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{activeDeal.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{activeDeal.customerName}</Typography>
                  {activeDeal.value > 0 && <Typography variant="body2" fontWeight={700} color="secondary.main">{BRL.format(activeDeal.value)}</Typography>}
                </CardContent>
              </Card>
            )}
          </DragOverlay>
        </DndContext>
      )}

      <DealDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Stack>
  );
}
