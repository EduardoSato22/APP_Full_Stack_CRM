-- V5: Substitui catálogo demo por dados representativos para avaliação

-- Garante colunas que podem estar ausentes no schema baseline
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS description VARCHAR(500);
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS created_at  TIMESTAMP DEFAULT NOW();

DO $$
DECLARE
    v_uid     BIGINT;
    v_cat_sw  BIGINT;
    v_cat_inf BIGINT;
    v_cat_svc BIGINT;
    v_cat_hw  BIGINT;
BEGIN
    SELECT id INTO v_uid FROM users WHERE email = 'admin@retailflow.demo';
    IF v_uid IS NULL THEN RETURN; END IF;

    -- Remove referências FK antes de apagar produtos demo
    DELETE FROM sale_items    WHERE product_id IN (SELECT id FROM products WHERE user_id = v_uid);
    DELETE FROM deal_products WHERE product_id IN (SELECT id FROM products WHERE user_id = v_uid);
    DELETE FROM products           WHERE user_id = v_uid;
    DELETE FROM product_categories WHERE user_id = v_uid;

    -- Categorias
    INSERT INTO product_categories (name, description, color, user_id, created_at)
    VALUES ('Software & Licenças', 'Licenças SaaS, assinaturas e módulos de software B2B', '#3B82F6', v_uid, NOW())
    RETURNING id INTO v_cat_sw;

    INSERT INTO product_categories (name, description, color, user_id, created_at)
    VALUES ('Infraestrutura', 'Servidores, switches, firewalls e storage corporativo', '#8B5CF6', v_uid, NOW())
    RETURNING id INTO v_cat_inf;

    INSERT INTO product_categories (name, description, color, user_id, created_at)
    VALUES ('Serviços & Suporte', 'Implantação, treinamento e contratos de suporte técnico', '#10B981', v_uid, NOW())
    RETURNING id INTO v_cat_svc;

    INSERT INTO product_categories (name, description, color, user_id, created_at)
    VALUES ('Hardware Corporativo', 'Workstations, notebooks e periféricos profissionais', '#F59E0B', v_uid, NOW())
    RETURNING id INTO v_cat_hw;

    -- Produtos — variedade de preços, margens, unidades e status para demonstração completa
    INSERT INTO products (name, description, price, cost_price, sku, stock, unit, status, category_id, user_id, created_at, last_updated) VALUES

    -- Software (margens altas, estoque "infinito" para licenças)
    ('CRM RetailFlow Enterprise',
     'Licença anual — até 50 usuários, API REST, relatórios customizáveis, SLA 99,9% e suporte dedicado',
     12000.00, 4200.00, 'SW-CRM-ENT', 999, 'UNIT', 'ACTIVE', v_cat_sw, v_uid, NOW(), NOW()),

    ('ERP Financeiro — Módulo Completo',
     'Contas a pagar/receber, DRE automático, conciliação bancária e integração contábil via SPED',
     8500.00, 3000.00, 'SW-ERP-FIN', 999, 'UNIT', 'ACTIVE', v_cat_sw, v_uid, NOW(), NOW()),

    ('Plataforma BI & Analytics',
     'Dashboards em tempo real, relatórios agendados, conectores SQL/REST/Sheets e drill-down interativo',
     6000.00, 1800.00, 'SW-BI-ANA', 999, 'UNIT', 'ACTIVE', v_cat_sw, v_uid, NOW(), NOW()),

    ('Antivírus Corporativo — 100 seats',
     'Proteção endpoint, EDR, firewall DNS, console centralizado e relatório de incidentes — descontinuado para renovação',
     3600.00, 1400.00, 'SW-AV-100', 0, 'UNIT', 'INACTIVE', v_cat_sw, v_uid, NOW(), NOW()),

    -- Infraestrutura (margens menores, estoque físico limitado)
    ('Servidor Dell PowerEdge R540',
     'Xeon Silver 4214R, 64 GB ECC RAM, 2× 1,2 TB SAS RAID 1, PSU redundante 750 W, iDRAC 9',
     18900.00, 13200.00, 'HW-SRV-R540', 5, 'UNIT', 'ACTIVE', v_cat_inf, v_uid, NOW(), NOW()),

    ('Switch Gerenciável 48P PoE+',
     '48× Gigabit PoE+ (740 W total), 4× SFP+ 10G uplink, VLAN 802.1Q, QoS, gestão web e CLI',
     4200.00, 2600.00, 'HW-SW-48P', 12, 'UNIT', 'ACTIVE', v_cat_inf, v_uid, NOW(), NOW()),

    ('Firewall UTM Next-Gen 1 Gbps',
     'IPS/IDS com assinaturas diárias, VPN SSL e IPsec, filtragem de URL por categoria e sandbox cloud',
     6800.00, 4100.00, 'HW-FW-UTM1G', 8, 'UNIT', 'ACTIVE', v_cat_inf, v_uid, NOW(), NOW()),

    ('Storage NAS Empresarial 40 TB',
     'NAS 12 baias RAID 6, replicação offsite, deduplicação e snapshot agendado — modelo descontinuado',
     9200.00, 6500.00, 'HW-NAS-40T', 0, 'UNIT', 'DISCONTINUED', v_cat_inf, v_uid, NOW(), NOW()),

    -- Serviços (unidade SERVICE, estoque zero é padrão)
    ('Implantação CRM — Pacote 60 h',
     'Levantamento de requisitos, configuração, migração de dados legados, testes de aceitação e treinamento go-live',
     9000.00, 2700.00, 'SVC-IMPL-60H', 0, 'SERVICE', 'ACTIVE', v_cat_svc, v_uid, NOW(), NOW()),

    ('Contrato de Suporte Anual',
     'SLA 4 h para incidentes críticos, atendimento 8×5, atualizações incluídas e gerente de conta dedicado',
     4800.00, 1200.00, 'SVC-SUP-ANUAL', 0, 'SERVICE', 'ACTIVE', v_cat_svc, v_uid, NOW(), NOW()),

    ('Treinamento Usuário Final — turma 10',
     'Capacitação presencial ou remota (8 h), material didático em PDF e certificado de conclusão emitido',
     2400.00, 600.00, 'SVC-TRN-10', 0, 'SERVICE', 'ACTIVE', v_cat_svc, v_uid, NOW(), NOW()),

    -- Hardware (margem intermediária, estoque físico)
    ('Workstation Dell Precision 3660',
     'Intel Core i9-13900K, 32 GB DDR5, NVIDIA RTX A2000 12 GB, 1 TB NVMe — para engenharia, CAD e renderização',
     11200.00, 7800.00, 'HW-WS-P3660', 7, 'UNIT', 'ACTIVE', v_cat_hw, v_uid, NOW(), NOW()),

    ('Notebook Lenovo ThinkPad X1 Carbon Gen 11',
     'Intel Core i7-1365U, 16 GB LPDDR5, 512 GB NVMe, tela 14" 2,8K OLED — ultra portátil corporativo',
     9800.00, 6900.00, 'HW-NB-X1C11', 15, 'UNIT', 'ACTIVE', v_cat_hw, v_uid, NOW(), NOW()),

    ('Monitor Profissional 32" 4K IPS',
     'HDR 600, Delta E < 2, USB-C 90 W, KVM integrado, cobertura sRGB 99%, altura e rotação ajustáveis',
     3800.00, 2400.00, 'HW-MON-32K', 20, 'UNIT', 'ACTIVE', v_cat_hw, v_uid, NOW(), NOW());

END $$;
