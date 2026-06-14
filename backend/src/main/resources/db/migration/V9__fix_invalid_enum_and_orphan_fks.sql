-- V9: corrige dados inválidos inseridos pela V7
-- 1. Sale.Status não tem COMPLETED — mapeia para DELIVERED (semanticamente equivalente)
UPDATE sales SET status = 'DELIVERED' WHERE status = 'COMPLETED';

-- 2. Atividades com deal_id ou customer_id apontando para registros soft-deleted
--    causam LazyInitializationException / ObjectNotFoundException ao inicializar o proxy
UPDATE activities
SET deal_id = NULL
WHERE deal_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM deals d WHERE d.id = activities.deal_id AND d.deleted_at IS NOT NULL
  );

UPDATE activities
SET customer_id = NULL
WHERE customer_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM customers c WHERE c.id = activities.customer_id AND c.deleted_at IS NOT NULL
  );
