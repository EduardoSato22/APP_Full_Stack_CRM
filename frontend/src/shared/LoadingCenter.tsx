import { Box, CircularProgress } from '@mui/material';

export function LoadingCenter() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" py={8}>
      <CircularProgress />
    </Box>
  );
}
