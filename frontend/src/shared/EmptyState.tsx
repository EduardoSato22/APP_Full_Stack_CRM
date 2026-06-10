import { Box, Grid, Typography } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

export function EmptyState({ message }: { message: string }) {
  return (
    <Grid item xs={12}>
      <Box textAlign="center" py={8} bgcolor="background.paper" borderRadius={3}>
        <WarningIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography color="text.secondary">{message}</Typography>
      </Box>
    </Grid>
  );
}
