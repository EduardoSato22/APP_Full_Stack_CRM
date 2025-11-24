-- Usuário padrão para desenvolvimento local
INSERT INTO users (id, name, email, password, created_at)
VALUES (1, 'Demo RetailFlow', 'demo@retailflow.com', '$2b$12$yqsvdDeVxCgD3lA6h.ziqO7A52vtdHa1QFLyizs3qCf8e.3p0pwci', CURRENT_TIMESTAMP);

-- Clientes iniciais
INSERT INTO customers (id, first_name, last_name, email, age, photo_url, created_at, updated_at, user_id)
VALUES
    (1, 'Ana', 'Silva', 'ana.silva@example.com', 29, 'https://i.pravatar.cc/150?img=1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
    (2, 'Bruno', 'Almeida', 'bruno.almeida@example.com', 35, 'https://i.pravatar.cc/150?img=2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

-- Produtos iniciais
INSERT INTO products (id, name, description, price, created_at, last_updated, user_id)
VALUES
    (1, 'Notebook Pro 14"', 'Ultrabook com tela Retina, 16GB RAM e 512GB SSD', 8999.90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
    (2, 'Fone Wireless X', 'Cancelamento ativo de ruído e até 30h de bateria', 1299.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

