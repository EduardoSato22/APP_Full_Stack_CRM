-- V7: Fotos temáticas nos produtos, mais negociações no funil e vendas adicionais
DO $$
DECLARE
    v_uid       BIGINT;
    v_manager   BIGINT;
    v_sales     BIGINT;
    v_cust_ana      BIGINT; v_cust_bruno    BIGINT; v_cust_diego    BIGINT;
    v_cust_henrique BIGINT; v_cust_isabela  BIGINT; v_cust_karen    BIGINT;
    v_cust_lucas    BIGINT; v_cust_samuel   BIGINT; v_cust_tatiana  BIGINT;
    v_cust_vini     BIGINT; v_cust_carla    BIGINT;
    v_d_a BIGINT; v_d_b BIGINT; v_d_c BIGINT; v_d_d BIGINT;
    v_d_e BIGINT; v_d_f BIGINT; v_d_g BIGINT;
    v_prod_crm  BIGINT; v_prod_erp  BIGINT; v_prod_bi   BIGINT;
    v_prod_fw   BIGINT; v_prod_sw   BIGINT; v_prod_nas  BIGINT;
    v_prod_impl BIGINT; v_prod_sup  BIGINT; v_prod_trn  BIGINT;
    v_prod_nb   BIGINT; v_prod_ws   BIGINT; v_prod_mon  BIGINT;
    v_s6 BIGINT; v_s7 BIGINT; v_s8 BIGINT;
BEGIN
    SELECT id INTO v_uid     FROM users WHERE email = 'admin@retailflow.demo';
    IF v_uid IS NULL THEN RETURN; END IF;
    SELECT id INTO v_manager FROM users WHERE email = 'manager@retailflow.demo';
    SELECT id INTO v_sales   FROM users WHERE email = 'sales@retailflow.demo';

    -- Fotos reais temáticas (substitui placeholders genéricos do V6)
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop' WHERE sku = 'SW-CRM-ENT'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' WHERE sku = 'SW-ERP-FIN'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop' WHERE sku = 'SW-BI-ANA'     AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop' WHERE sku = 'SW-AV-100'     AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop' WHERE sku = 'HW-SRV-R540'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop' WHERE sku = 'HW-SW-48P'     AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop' WHERE sku = 'HW-FW-UTM1G'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400&h=300&fit=crop' WHERE sku = 'HW-NAS-40T'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop' WHERE sku = 'SVC-IMPL-60H'  AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop' WHERE sku = 'SVC-SUP-ANUAL' AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop' WHERE sku = 'SVC-TRN-10'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop' WHERE sku = 'HW-WS-P3660'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop' WHERE sku = 'HW-NB-X1C11'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop' WHERE sku = 'HW-MON-32K'    AND user_id = v_uid;

    -- Lookup clientes
    SELECT id INTO v_cust_ana      FROM customers WHERE email = 'ana.silva@techcorp.com.br'       AND user_id = v_uid;
    SELECT id INTO v_cust_bruno    FROM customers WHERE email = 'bruno.almeida@startup.io'         AND user_id = v_uid;
    SELECT id INTO v_cust_carla    FROM customers WHERE email = 'carla.mendes@megavarejo.com.br'   AND user_id = v_uid;
    SELECT id INTO v_cust_diego    FROM customers WHERE email = 'diego.costa@industria.com'        AND user_id = v_uid;
    SELECT id INTO v_cust_henrique FROM customers WHERE email = 'henrique.oliveira@hospital.org'   AND user_id = v_uid;
    SELECT id INTO v_cust_isabela  FROM customers WHERE email = 'isabela.ferreira@ecommerce.com'  AND user_id = v_uid;
    SELECT id INTO v_cust_karen    FROM customers WHERE email = 'karen.souza@logistica.net'        AND user_id = v_uid;
    SELECT id INTO v_cust_lucas    FROM customers WHERE email = 'lucas.nascimento@saas.io'         AND user_id = v_uid;
    SELECT id INTO v_cust_samuel   FROM customers WHERE email = 'samuel.torres@industria2.com'     AND user_id = v_uid;
    SELECT id INTO v_cust_tatiana  FROM customers WHERE email = 'tatiana.nunes@banco.fin.br'       AND user_id = v_uid;
    SELECT id INTO v_cust_vini     FROM customers WHERE email = 'vinicius.azevedo@telecom.com.br'  AND user_id = v_uid;

    -- Lookup produtos
    SELECT id INTO v_prod_crm  FROM products WHERE sku = 'SW-CRM-ENT'    AND user_id = v_uid;
    SELECT id INTO v_prod_erp  FROM products WHERE sku = 'SW-ERP-FIN'    AND user_id = v_uid;
    SELECT id INTO v_prod_bi   FROM products WHERE sku = 'SW-BI-ANA'     AND user_id = v_uid;
    SELECT id INTO v_prod_fw   FROM products WHERE sku = 'HW-FW-UTM1G'   AND user_id = v_uid;
    SELECT id INTO v_prod_sw   FROM products WHERE sku = 'HW-SW-48P'     AND user_id = v_uid;
    SELECT id INTO v_prod_nas  FROM products WHERE sku = 'HW-NAS-40T'    AND user_id = v_uid;
    SELECT id INTO v_prod_impl FROM products WHERE sku = 'SVC-IMPL-60H'  AND user_id = v_uid;
    SELECT id INTO v_prod_sup  FROM products WHERE sku = 'SVC-SUP-ANUAL' AND user_id = v_uid;
    SELECT id INTO v_prod_trn  FROM products WHERE sku = 'SVC-TRN-10'    AND user_id = v_uid;
    SELECT id INTO v_prod_nb   FROM products WHERE sku = 'HW-NB-X1C11'   AND user_id = v_uid;
    SELECT id INTO v_prod_ws   FROM products WHERE sku = 'HW-WS-P3660'   AND user_id = v_uid;
    SELECT id INTO v_prod_mon  FROM products WHERE sku = 'HW-MON-32K'    AND user_id = v_uid;

    -- Novos deals cobrindo todo o funil
    -- PROSPECTING (entrada do funil — 'LEAD' não é estágio válido de deal)
    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('Startup Veloz - implantação CRM inicial', 4800.00, 15, 'PROSPECTING',
            v_cust_bruno, v_sales, v_uid, NOW() - INTERVAL '3 days', NOW())
    RETURNING id INTO v_d_a;

    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('Indústria Aço Forte - ERP + infraestrutura completa', 48000.00, 20, 'PROSPECTING',
            v_cust_diego, v_sales, v_uid, NOW() - INTERVAL '5 days', NOW())
    RETURNING id INTO v_d_b;

    -- QUALIFIED
    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('Logística Rápida - modernização rede switches PoE+', 32000.00, 40, 'QUALIFIED',
            v_cust_karen, v_manager, v_uid, NOW() - INTERVAL '12 days', NOW())
    RETURNING id INTO v_d_c;

    -- PROPOSAL
    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('Indústria Torres 2.0 - BI Analytics + suporte anual', 18500.00, 55, 'PROPOSAL',
            v_cust_samuel, v_manager, v_uid, NOW() - INTERVAL '18 days', NOW())
    RETURNING id INTO v_d_d;

    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('TeleCom Brasil - Firewall UTM Next-Gen + SLA Platinum', 27600.00, 60, 'PROPOSAL',
            v_cust_vini, v_sales, v_uid, NOW() - INTERVAL '14 days', NOW())
    RETURNING id INTO v_d_e;

    -- NEGOTIATION
    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('TechCorp Ana Silva - renovação + expansão módulos CRM', 44000.00, 75, 'NEGOTIATION',
            v_cust_ana, v_manager, v_uid, NOW() - INTERVAL '22 days', NOW())
    RETURNING id INTO v_d_f;

    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('Hospital São Lucas - projeto TI 2025 completo', 63000.00, 80, 'NEGOTIATION',
            v_cust_henrique, v_manager, v_uid, NOW() - INTERVAL '30 days', NOW())
    RETURNING id INTO v_d_g;

    -- deal_products
    IF v_d_a IS NOT NULL THEN
        IF v_prod_crm  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_a, v_prod_crm)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_impl IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_a, v_prod_impl) ON CONFLICT DO NOTHING; END IF;
    END IF;
    IF v_d_b IS NOT NULL THEN
        IF v_prod_erp IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_b, v_prod_erp) ON CONFLICT DO NOTHING; END IF;
        IF v_prod_fw  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_b, v_prod_fw)  ON CONFLICT DO NOTHING; END IF;
    END IF;
    IF v_d_c IS NOT NULL THEN
        IF v_prod_sw  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_c, v_prod_sw)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_sup IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_c, v_prod_sup) ON CONFLICT DO NOTHING; END IF;
    END IF;
    IF v_d_d IS NOT NULL THEN
        IF v_prod_bi  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_d, v_prod_bi)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_sup IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_d, v_prod_sup) ON CONFLICT DO NOTHING; END IF;
    END IF;
    IF v_d_e IS NOT NULL THEN
        IF v_prod_fw  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_e, v_prod_fw)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_sup IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_e, v_prod_sup) ON CONFLICT DO NOTHING; END IF;
    END IF;
    IF v_d_f IS NOT NULL THEN
        IF v_prod_crm  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_f, v_prod_crm)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_erp  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_f, v_prod_erp)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_impl IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_f, v_prod_impl) ON CONFLICT DO NOTHING; END IF;
    END IF;
    IF v_d_g IS NOT NULL THEN
        IF v_prod_fw  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_g, v_prod_fw)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_sw  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_g, v_prod_sw)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_nb  IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_g, v_prod_nb)  ON CONFLICT DO NOTHING; END IF;
        IF v_prod_mon IS NOT NULL THEN INSERT INTO deal_products (deal_id, product_id) VALUES (v_d_g, v_prod_mon) ON CONFLICT DO NOTHING; END IF;
    END IF;

    -- Atividades PENDING e IN_PROGRESS adicionais
    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('CALL', 'Ligação inicial Startup Veloz', 'Entender dores de CRM e gestão de clientes — primeiro contato comercial',
            v_cust_bruno, v_d_a, 'MEDIUM', 'PENDING', v_sales, v_uid,
            NOW() + INTERVAL '1 day', NOW(), NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('MEETING', 'Visita técnica Indústria Aço Forte', 'Levantamento de infraestrutura atual e mapeamento de gap tecnológico',
            v_cust_diego, v_d_b, 'HIGH', 'PENDING', v_manager, v_uid,
            NOW() + INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('TASK', 'Elaborar BOM Logística Rápida', 'Lista de materiais: switches 48P PoE+, APs, patch panels e cabeamento estruturado',
            v_cust_karen, v_d_c, 'HIGH', 'IN_PROGRESS', v_sales, v_uid,
            NOW() + INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('EMAIL', 'Enviar proposta Indústria Torres 2.0', 'Proposta BI Analytics + contrato suporte anual 8×5 com janela de SLA',
            v_cust_samuel, v_d_d, 'MEDIUM', 'PENDING', v_manager, v_uid,
            NOW() + INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('CALL', 'Negociação TeleCom Brasil — condições financeiras', 'Apresentar opções de parcelamento 12× e SLA Platinum diferenciado',
            v_cust_vini, v_d_e, 'HIGH', 'PENDING', v_sales, v_uid,
            NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('MEETING', 'Reunião contratual TechCorp — renovação anual', 'Fechar escopo final de renovação + expansão módulos ERP-CRM integrado',
            v_cust_ana, v_d_f, 'URGENT', 'PENDING', v_manager, v_uid,
            NOW() + INTERVAL '2 days', NOW() - INTERVAL '4 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('TASK', 'Cronograma Hospital São Lucas 2025', 'Planejar etapas de implantação dentro de janela de manutenção hospitalar noturna',
            v_cust_henrique, v_d_g, 'HIGH', 'IN_PROGRESS', v_manager, v_uid,
            NOW() + INTERVAL '5 days', NOW() - INTERVAL '3 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('EMAIL', 'Follow-up Banco Prime Tatiana — renovação suporte', 'Verificar renovação contrato suporte anual antes vencimento julho/2025',
            v_cust_tatiana, NULL, 'MEDIUM', 'PENDING', v_sales, v_uid,
            NOW() + INTERVAL '7 days', NOW(), NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('WHATSAPP', 'WhatsApp Isabela eCommerce Plus — dúvidas implantação', 'Integração API carrinho em produção: timeout no webhook de pagamento',
            v_cust_isabela, NULL, 'MEDIUM', 'PENDING', v_sales, v_uid,
            NOW() + INTERVAL '1 day', NOW(), NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('CALL', 'Upsell MegaVarejo Carla — módulo BI Analytics', 'Apresentar BI Analytics após 6 meses de sucesso do CRM implantado',
            v_cust_carla, NULL, 'MEDIUM', 'PENDING', v_manager, v_uid,
            NOW() + INTERVAL '4 days', NOW(), NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, completed_at, created_at, updated_at)
    VALUES ('NOTE', 'Feedback SaaS Solutions Lucas — plataforma BI', 'Cliente elogiou relatórios automatizados. Oportunidade de renovação antecipada em ago/2025',
            v_cust_lucas, NULL, 'LOW', 'DONE', v_manager, v_uid,
            NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

    -- Vendas adicionais
    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_vini, v_uid, 'COMPLETED', 6800.00, NOW() - INTERVAL '30 days',
            'Firewall UTM Next-Gen — TeleCom Brasil (fase 1 de 2)', NOW() - INTERVAL '30 days')
    RETURNING id INTO v_s6;

    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_diego, v_uid, 'COMPLETED', 16800.00, NOW() - INTERVAL '60 days',
            '4× Switch Gerenciável 48P PoE+ — Indústria Aço Forte (modernização rede)', NOW() - INTERVAL '60 days')
    RETURNING id INTO v_s7;

    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_karen, v_uid, 'COMPLETED', 14400.00, NOW() - INTERVAL '75 days',
            'CRM RetailFlow Licença + Treinamento 3 turmas — Logística Rápida', NOW() - INTERVAL '75 days')
    RETURNING id INTO v_s8;

    IF v_s6 IS NOT NULL AND v_prod_fw IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s6, v_prod_fw, 1, 6800.00, 6800.00);
    END IF;
    IF v_s7 IS NOT NULL AND v_prod_sw IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s7, v_prod_sw, 4, 4200.00, 16800.00);
    END IF;
    IF v_s8 IS NOT NULL AND v_prod_crm IS NOT NULL AND v_prod_trn IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s8, v_prod_crm, 1, 12000.00, 12000.00);
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s8, v_prod_trn, 1,  2400.00,  2400.00);
    END IF;

    -- Notificações
    INSERT INTO notifications (type, title, message, read, user_id, created_at)
    VALUES ('FOLLOW_UP', 'Negociação em aberto', 'TechCorp Ana Silva - renovação anual há 22 dias sem fechar', false, v_uid, NOW() - INTERVAL '1 day');
    INSERT INTO notifications (type, title, message, read, user_id, created_at)
    VALUES ('FOLLOW_UP', 'Pipeline em risco', 'Hospital São Lucas - R$ 63.000 em negociação há 30 dias', false, v_uid, NOW() - INTERVAL '2 days');

END $$;
