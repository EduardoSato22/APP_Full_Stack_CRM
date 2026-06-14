export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const STAGE_COLORS: Record<string, string> = {
  PROSPECTING: '#64748B', QUALIFICATION: '#3B82F6',
  PROPOSAL: '#F59E0B', NEGOTIATION: '#8B5CF6',
  WON: '#10B981', LOST: '#EF4444',
};

export const STAGE_LABELS: Record<string, string> = {
  PROSPECTING: 'Prospecção', QUALIFICATION: 'Qualificação',
  PROPOSAL: 'Proposta', NEGOTIATION: 'Negociação',
  WON: 'Ganho', LOST: 'Perdido',
};

export const STATUS_COLORS: Record<string, string> = {
  LEAD: '#64748B', PROSPECT: '#3B82F6', ACTIVE: '#10B981',
  INACTIVE: '#F59E0B', CHURNED: '#EF4444',
};

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#64748B', MEDIUM: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444',
};

export const ACTIVITY_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente', IN_PROGRESS: 'Em Progresso', DONE: 'Concluída', CANCELLED: 'Cancelada',
};

export const ACTIVITY_PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', URGENT: 'Urgente',
};

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  CALL: 'Ligação', EMAIL: 'E-mail', MEETING: 'Reunião', TASK: 'Tarefa', NOTE: 'Nota', WHATSAPP: 'WhatsApp',
};

export const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
