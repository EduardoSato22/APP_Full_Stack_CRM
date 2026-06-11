import { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, alpha } from '@mui/material';
import { CookieOutlined as CookieIcon } from '@mui/icons-material';

const CONSENT_KEY = 'cookie_consent';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(CONSENT_KEY));

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'essential-only');
    setVisible(false);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed', bottom: 16, left: 16, right: 16,
        maxWidth: 600, mx: 'auto', p: 2, borderRadius: 3, zIndex: 9999,
        bgcolor: 'background.paper',
        border: t => `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <CookieIcon color="primary" sx={{ flexShrink: 0 }} />
        <Box flex={1}>
          <Typography variant="body2" fontWeight={600}>Cookies e Privacidade</Typography>
          <Typography variant="caption" color="text.secondary">
            Usamos cookies essenciais para autenticação e preferências de interface.
            Nenhum dado é compartilhado com terceiros. Conforme a LGPD, você pode exportar
            ou excluir seus dados em Configurações.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexShrink={0}>
          <Button size="small" variant="outlined" onClick={decline}>Essenciais</Button>
          <Button size="small" variant="contained" onClick={accept}>Aceitar</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
