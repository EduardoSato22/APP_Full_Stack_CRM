-- Adiciona colunas ausentes no schema existente de produção
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS color VARCHAR(50);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
