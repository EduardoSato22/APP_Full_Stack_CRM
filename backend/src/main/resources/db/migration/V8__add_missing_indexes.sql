-- V8: Índices ausentes em colunas de filtro/agregação com alto volume de consultas

-- deals: colunas usadas em DealSpec.isVisibleToUser, hasAssignedTo e queries de revenue
CREATE INDEX IF NOT EXISTS idx_deals_assigned_to  ON deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_created_by   ON deals(created_by);
CREATE INDEX IF NOT EXISTS idx_deals_stage_closed ON deals(stage, closed_at) WHERE deleted_at IS NULL;

-- activities: colunas usadas em findOverdue, findUpcoming, countTodayPending
CREATE INDEX IF NOT EXISTS idx_activities_assigned_to             ON activities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activities_due_date                ON activities(due_date);
CREATE INDEX IF NOT EXISTS idx_activities_assigned_status_due     ON activities(assigned_to, status, due_date);

-- customers: assigned_to ausente (CustomerSpec.isVisibleToUser filtra por user_id já indexado,
--            mas assignedTo também é filtrado em alguns cenários)
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
