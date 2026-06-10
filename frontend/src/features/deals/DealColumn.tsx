import { Box, Chip, Stack, Typography, alpha } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { STAGE_COLORS, STAGE_LABELS, BRL } from '../../constants';
import type { Deal } from '../../types';
import { DraggableDealCard } from './DealCard';

export function DroppableStageColumn({ stage, deals }: { stage: string; deals: Deal[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: `stage-${stage}` });
  const total = deals.reduce((s, d) => s + (d.value ?? 0), 0);

  return (
    <Box sx={{ width: 270, flexShrink: 0 }}>
      <Box sx={{ p: 1.5, bgcolor: STAGE_COLORS[stage] + '18', borderRadius: 2, mb: 1.5, borderLeft: `4px solid ${STAGE_COLORS[stage]}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={700} fontSize={13}>{STAGE_LABELS[stage]}</Typography>
          <Chip label={deals.length} size="small" sx={{ bgcolor: STAGE_COLORS[stage], color: 'white', fontWeight: 700, height: 22 }} />
        </Stack>
        {total > 0 && <Typography variant="caption" color="text.secondary">{BRL.format(total)}</Typography>}
      </Box>
      <Box ref={setNodeRef} sx={{
        minHeight: 80, borderRadius: 2, transition: 'background 0.15s',
        bgcolor: isOver ? alpha(STAGE_COLORS[stage], 0.1) : 'transparent',
        border: isOver ? `2px dashed ${STAGE_COLORS[stage]}` : '2px solid transparent',
      }}>
        <Stack spacing={1}>
          {deals.map(deal => <DraggableDealCard key={deal.id} deal={deal} stage={stage} />)}
          {deals.length === 0 && !isOver && (
            <Box sx={{ p: 2, textAlign: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Sem deals</Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
