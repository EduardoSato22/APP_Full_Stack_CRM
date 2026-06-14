import {
  Box, Button, Card, CardContent, Chip, Container, Divider,
  Grid, Paper, Stack, Typography, alpha, useTheme,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon, GitHub as GitHubIcon,
  Inventory2 as ProductIcon, Notifications as NotificationsIcon,
  OpenInNew as OpenInNewIcon, People as PeopleIcon,
  PlayArrow as DemoIcon, Security as SecurityIcon, Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SCREENSHOTS = [
  { img: '/screenshots/login.png', label: 'Login com OAuth2 Social', path: '/login' },
  { img: '/screenshots/dashboard.png', label: 'Dashboard & Pipeline', path: '/' },
  { img: '/screenshots/activities.png', label: 'Gestão de Atividades', path: '/activities' },
];

const FEATURES = [
  { icon: <PeopleIcon />, title: 'Gestão de Clientes', desc: 'CRM completo com filtros avançados via JPA Specifications, upload de foto e histórico de atividades.' },
  { icon: <AnalyticsIcon />, title: 'Pipeline de Vendas', desc: 'Kanban com drag-and-drop dnd-kit, funil de conversão e receita por stage em tempo real.' },
  { icon: <NotificationsIcon />, title: 'Notificações Real-Time', desc: 'WebSocket STOMP + SockJS. Notificações push sem polling, badge atualizado instantaneamente.' },
  { icon: <ProductIcon />, title: 'Módulo de Vendas', desc: 'Registro de vendas com múltiplos produtos, controle de status e histórico por cliente.' },
  { icon: <SecurityIcon />, title: 'Segurança Enterprise', desc: 'JWT stateless, OAuth2 Social Login (Google/GitHub), rate limiting, CSP/HSTS, conformidade LGPD.' },
  { icon: <SpeedIcon />, title: 'Observabilidade', desc: 'Micrometer + Prometheus + Grafana. Métricas de JVM, HTTP p99, HikariCP. Logs estruturados JSON.' },
];

const TECH_STACK = [
  { category: 'Backend', items: ['Java 17', 'Spring Boot 3.2', 'Spring Security', 'JPA + Flyway', 'Redis', 'WebSocket'] },
  { category: 'Frontend', items: ['React 18', 'TypeScript', 'Material UI 5', 'TanStack Query', 'React Hook Form + Zod', 'Playwright'] },
  { category: 'Infra', items: ['Docker Compose', 'GitHub Actions', 'Prometheus', 'Grafana', 'PostgreSQL', 'H2 (dev)'] },
];

const PORTFOLIO = [
  {
    title: 'Delicatto E-commerce',
    desc: 'E-commerce full-stack para doceria artesanal. Carrinho em tempo real via Socket.IO, pagamentos PIX e cartão via Mercado Pago, painel admin kanban e upload de imagens com Cloudinary.',
    stack: ['React 18', 'Node.js', 'Express', 'Socket.IO', 'Prisma', 'PostgreSQL', 'Mercado Pago'],
    github: 'https://github.com/Eduardo-Sato/dellicato',
    liveUrl: 'https://www.doceriadelicatto.com.br/',
    color: '#EC4899',
  },
  {
    title: 'Drip Landing Page',
    desc: 'Landing page animada com scroll suave e transições cinematográficas. Animações GSAP com ScrollTrigger, scroll suave Lenis e layout responsivo com Tailwind CSS.',
    stack: ['React 18', 'TypeScript', 'GSAP', 'ScrollTrigger', 'Lenis', 'Tailwind CSS'],
    github: 'https://github.com/Eduardo-Sato/drip-landing',
    liveUrl: null,
    color: '#8B5CF6',
  },
  {
    title: 'LR Móveis Planejados',
    desc: 'Site institucional para loja de móveis planejados. SSR com Next.js 15 Turbopack, TypeScript strict, testes E2E com Playwright e cobertura de unidade com Vitest.',
    stack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Vitest', 'Playwright'],
    github: 'https://github.com/Eduardo-Sato/lr-moveis',
    liveUrl: 'https://lr-moveis-planejados.vercel.app/',
    color: '#10B981',
  },
  {
    title: 'RetailFlow CRM',
    desc: 'Este projeto — sistema CRM enterprise full-stack com pipeline Kanban, WebSocket real-time, OAuth2, Prometheus + Grafana e conformidade LGPD.',
    stack: ['Spring Boot 3.2', 'React 18', 'PostgreSQL', 'Redis', 'WebSocket', 'OAuth2'],
    github: 'https://github.com/Eduardo-Sato/retailflow-crm',
    liveUrl: 'https://retailflow-front.vercel.app/',
    color: '#4F46E5',
  },
];

const ARCH_DIAGRAM = `
┌─────────────────────────────────────────────────────────┐
│                    Usuário / Browser                    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS + WebSocket
┌────────────────────────▼────────────────────────────────┐
│              React 18 + TypeScript (Vite)               │
│   TanStack Query · dnd-kit · Recharts · MUI             │
└────────────────────────┬────────────────────────────────┘
                         │ REST JSON + STOMP/SockJS
┌────────────────────────▼────────────────────────────────┐
│           Spring Boot 3.2 (Java 17)                     │
│  JWT Auth · OAuth2 · Rate Limit · RFC 7807              │
│  MapStruct · JPA Specs · @Async Email · Actuator        │
└────┬───────────────────┬────────────────────────────────┘
     │                   │
┌────▼──────┐   ┌────────▼────────┐   ┌────────────────┐
│PostgreSQL │   │   Redis Cache   │   │  Prometheus +  │
│ + Flyway  │   │ (dashboard TTL) │   │  Grafana       │
└───────────┘   └─────────────────┘   └────────────────┘`;

export function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)',
        color: 'white', py: { xs: 8, md: 12 }, px: 2,
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Chip label="Portfólio · Eduardo Sato" sx={{ mb: 3, bgcolor: alpha('#fff', 0.1), color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} />
          <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            RetailFlow CRM
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.8, mb: 4, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            Sistema de gestão de relacionamento com clientes full-stack de nível enterprise
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.65, mb: 5, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            Spring Boot 3.2 + React 18. JWT + OAuth2. WebSocket real-time. Prometheus + Grafana.
            Pipeline de vendas Kanban. Exportação PDF/Excel/CSV. Conformidade LGPD.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained" size="large" startIcon={<DemoIcon />}
              onClick={() => navigate('/login')}
              sx={{ bgcolor: 'white', color: '#0F172A', '&:hover': { bgcolor: alpha('#fff', 0.9) }, px: 4 }}
            >
              Ver Demo
            </Button>
            <Button
              variant="outlined" size="large" startIcon={<GitHubIcon />}
              href="https://github.com/Eduardo-Sato/retailflow-crm" target="_blank" rel="noopener noreferrer"
              sx={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.06) }, px: 4 }}
            >
              GitHub
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Screenshots */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            Interface do Sistema
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
            Capturas reais do RetailFlow CRM em funcionamento
          </Typography>
          <Grid container spacing={3}>
            {SCREENSHOTS.map(s => (
              <Grid item xs={12} md={4} key={s.label}>
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', transition: 'box-shadow .2s', '&:hover': { boxShadow: 8 } }}>
                  <Box sx={{ bgcolor: '#E2E8F0', px: 1.5, py: 0.8, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FC615D', flexShrink: 0 }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FDBC40', flexShrink: 0 }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#34C749', flexShrink: 0 }} />
                    <Box sx={{ ml: 1, flexGrow: 1, bgcolor: 'white', borderRadius: 1, px: 1, py: 0.3 }}>
                      <Typography sx={{ fontSize: 10, color: '#64748B', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        retailflow-front.vercel.app{s.path}
                      </Typography>
                    </Box>
                  </Box>
                  <Box component="img" src={s.img} alt={s.label} sx={{ width: '100%', display: 'block', aspectRatio: '16/10', objectFit: 'cover', objectPosition: 'top' }} />
                  <Box sx={{ px: 2, py: 1.2, textAlign: 'center', bgcolor: 'background.paper' }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary">{s.label}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Funcionalidades</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
          Arquitetura pensada para demonstrar boas práticas de engenharia em todos os níveis
        </Typography>
        <Grid container spacing={3}>
          {FEATURES.map(f => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card elevation={1} sx={{ height: '100%', borderRadius: 3, transition: 'box-shadow .2s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 1.5 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom fontSize={15}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Arquitetura */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Arquitetura</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
            Diagrama de componentes simplificado
          </Typography>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#0F172A', overflow: 'auto' }}>
            <Typography component="pre" sx={{ color: '#7dd3fc', fontFamily: 'monospace', fontSize: { xs: 10, md: 13 }, m: 0, whiteSpace: 'pre' }}>
              {ARCH_DIAGRAM}
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Stack */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Stack Tecnológica</Typography>
        <Grid container spacing={3} mt={1}>
          {TECH_STACK.map(cat => (
            <Grid item xs={12} md={4} key={cat.category}>
              <Card elevation={1} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} color="primary" mb={2} textTransform="uppercase" letterSpacing={0.5} fontSize={12}>
                    {cat.category}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {cat.items.map(item => (
                      <Chip key={item} label={item} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Portfólio */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Portfólio</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
          Outros projetos desenvolvidos por Eduardo Sato
        </Typography>
        <Grid container spacing={3}>
          {PORTFOLIO.map(proj => (
            <Grid item xs={12} sm={6} key={proj.title}>
              <Card elevation={1} sx={{ height: '100%', borderRadius: 3, transition: 'box-shadow .2s', '&:hover': { boxShadow: 6 }, borderTop: `4px solid ${proj.color}` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom fontSize={15}>{proj.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7} mb={2}>{proj.desc}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.8} mb={2}>
                    {proj.stack.map(t => (
                      <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small" startIcon={<GitHubIcon />}
                      href={proj.github} target="_blank" rel="noopener noreferrer"
                      sx={{ color: proj.color, borderColor: proj.color, '&:hover': { bgcolor: alpha(proj.color, 0.06) } }}
                      variant="outlined"
                    >
                      GitHub
                    </Button>
                    {proj.liveUrl && (
                      <Button
                        size="small" startIcon={<OpenInNewIcon />}
                        href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                        sx={{ color: proj.color, borderColor: proj.color, '&:hover': { bgcolor: alpha(proj.color, 0.06) } }}
                        variant="outlined"
                      >
                        Ver Projeto
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* CTA */}
      <Box sx={{ bgcolor: '#0F172A', color: 'white', py: 8, textAlign: 'center', px: 2 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Gostou do projeto?</Typography>
        <Typography variant="body1" sx={{ opacity: 0.7, mb: 4 }}>
          Confira meu portfólio completo ou acesse o demo deste CRM
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained" size="large" startIcon={<OpenInNewIcon />}
            href="https://portfolio-sato-steel.vercel.app/" target="_blank" rel="noopener noreferrer"
            sx={{ bgcolor: 'white', color: '#0F172A', '&:hover': { bgcolor: alpha('#fff', 0.9) } }}
          >
            Acessar Portfólio
          </Button>
          <Button
            variant="outlined" size="large" startIcon={<DemoIcon />}
            onClick={() => navigate('/login')}
            sx={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.06) } }}
          >
            Ver Demo
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
