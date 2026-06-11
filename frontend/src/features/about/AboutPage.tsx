import {
  Avatar, Box, Button, Card, CardContent, Chip, Container,
  Divider, Grid, Stack, Typography, alpha, useTheme,
} from '@mui/material';
import {
  Code as CodeIcon, GitHub as GitHubIcon, LinkedIn as LinkedInIcon,
  School as SchoolIcon, Work as WorkIcon,
} from '@mui/icons-material';

const TECH_BADGES = [
  { label: 'Java 17', color: '#f89820' },
  { label: 'Spring Boot 3', color: '#6db33f' },
  { label: 'React 18', color: '#61dafb' },
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Redis', color: '#dc382d' },
  { label: 'Docker', color: '#2496ed' },
  { label: 'JWT / OAuth2', color: '#f80' },
  { label: 'Prometheus / Grafana', color: '#e6522c' },
  { label: 'TanStack Query', color: '#ff4154' },
  { label: 'Material UI', color: '#007fff' },
  { label: 'Playwright', color: '#45ba4b' },
];

const EXPERTISE = [
  { area: 'Backend', items: 'Spring Boot, JPA/Hibernate, Flyway, MapStruct, Micrometer, WebSocket/STOMP' },
  { area: 'Frontend', items: 'React, TypeScript, TanStack Query, React Hook Form + Zod, dnd-kit' },
  { area: 'Dados', items: 'PostgreSQL, Redis (cache), JPA Specifications, Flyway migrations' },
  { area: 'DevOps', items: 'Docker Compose, GitHub Actions CI/CD, Prometheus + Grafana' },
  { area: 'Segurança', items: 'JWT stateless, OAuth2 Social Login, Rate Limiting, CSP/HSTS, LGPD' },
  { area: 'Qualidade', items: 'Testcontainers, Mockito, Playwright E2E, JaCoCo, RFC 7807' },
];

export function AboutPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box py={4}>
        {/* Header */}
        <Card elevation={3} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ height: 120, background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }} />
          <CardContent sx={{ pt: 0 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'flex-end' }} mt={-5}>
              <Avatar
                sx={{ width: 96, height: 96, fontSize: 36, bgcolor: 'primary.main', border: '4px solid white', boxShadow: 3 }}
              >
                ES
              </Avatar>
              <Box flex={1} pb={1}>
                <Typography variant="h5" fontWeight={700}>Eduardo Sato</Typography>
                <Typography variant="body2" color="text.secondary">
                  Desenvolvedor Full-Stack · ADS — Unilavras
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} pb={1}>
                <Button
                  variant="outlined" startIcon={<GitHubIcon />} size="small"
                  href="https://github.com/Eduardo-Sato" target="_blank" rel="noopener noreferrer"
                >
                  GitHub
                </Button>
                <Button
                  variant="outlined" startIcon={<LinkedInIcon />} size="small" color="info"
                  href="https://linkedin.com/in/eduardo-sato" target="_blank" rel="noopener noreferrer"
                >
                  LinkedIn
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Sobre */}
        <Card elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <WorkIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>Sobre</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              Desenvolvedor full-stack com foco em sistemas de gestão empresarial (CRM, ERP) e
              arquiteturas orientadas a domínio. Apaixonado por código limpo, observabilidade e
              experiências de usuário que realmente funcionam. Este projeto — RetailFlow CRM — é
              uma demonstração de boas práticas de engenharia de software aplicadas do backend ao frontend,
              da segurança à observabilidade.
            </Typography>
          </CardContent>
        </Card>

        {/* Formação */}
        <Card elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <SchoolIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>Formação</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body1" fontWeight={600}>Análise e Desenvolvimento de Sistemas</Typography>
                <Typography variant="body2" color="text.secondary">Unilavras — Lavras, MG</Typography>
              </Box>
              <Chip label="Em andamento" size="small" color="primary" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>

        {/* Stack de tecnologias */}
        <Card elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <CodeIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>Stack Tecnológica</Typography>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {TECH_BADGES.map(t => (
                <Chip
                  key={t.label} label={t.label} size="small"
                  sx={{
                    bgcolor: alpha(t.color, 0.12),
                    color: t.color,
                    border: `1px solid ${alpha(t.color, 0.3)}`,
                    fontWeight: 600, fontSize: 12,
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Áreas de expertise */}
        <Card elevation={1} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>Áreas de Expertise</Typography>
            <Grid container spacing={2}>
              {EXPERTISE.map(e => (
                <Grid item xs={12} sm={6} key={e.area}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), height: '100%' }}>
                    <Typography variant="caption" fontWeight={700} color="primary" textTransform="uppercase" letterSpacing={0.5}>
                      {e.area}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5} fontSize={12}>
                      {e.items}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
          RetailFlow CRM — Portfólio de Eduardo Sato · 2026
        </Typography>
      </Box>
    </Container>
  );
}
