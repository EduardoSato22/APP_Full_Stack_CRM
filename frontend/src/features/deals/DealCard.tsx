import { Card, CardContent, Box, LinearProgress, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { BRL } from '../../constants';
import type { Deal } from '../../types';

export function DraggableDealCard({ deal, stage }: { deal: Deal; stage: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `deal-${deal.id}`,
    data: { deal, fromStage: stage },
  });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` } : undefined;

  return (
    <Card ref={setNodeRef} style={style} {...listeners} {...attributes}
      sx={{
        cursor: isDragging ? 'grabbing' : 'grab',
        border: '1px solid', borderColor: 'divider',
        opacity: isDragging ? 0.4 : 1,
        transition: isDragging ? 'none' : 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 4px 12px rgb(0 0 0/0.12)' },
        touchAction: 'none',
      }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="body2" fontWeight={600} noWrap>{deal.title}</Typography>
        <Typography variant="caption" color="text.secondary">{deal.customerName}</Typography>
        {deal.value > 0 && <Typography variant="body2" fontWeight={700} color="secondary.main">{BRL.format(deal.value)}</Typography>}
        <Box mt={1}>
          <Typography variant="caption" color="text.secondary">Prob: {deal.probability}%</Typography>
          <LinearProgress variant="determinate" value={deal.probability} sx={{ height: 4, borderRadius: 2, mt: 0.5 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
