-- V6: Fotos em clientes/produtos, mais negociações, atividades e vendas demo

DO $$
DECLARE
    v_uid     BIGINT;
    v_manager BIGINT;
    v_sales   BIGINT;
    v_cust_ana      BIGINT; v_cust_bruno    BIGINT; v_cust_carla    BIGINT;
    v_cust_diego    BIGINT; v_cust_elena    BIGINT; v_cust_felipe   BIGINT;
    v_cust_gabi     BIGINT; v_cust_henrique BIGINT; v_cust_isabela  BIGINT;
    v_cust_joao     BIGINT; v_cust_karen    BIGINT; v_cust_lucas    BIGINT;
    v_cust_mariana  BIGINT; v_cust_nicolas  BIGINT; v_cust_olivia   BIGINT;
    v_cust_renata   BIGINT; v_cust_samuel   BIGINT; v_cust_tatiana  BIGINT;
    v_cust_vini     BIGINT;
    v_d3  BIGINT; v_d5  BIGINT; v_d9  BIGINT; v_d14 BIGINT;
    v_nd1 BIGINT; v_nd2 BIGINT; v_nd3 BIGINT; v_nd4 BIGINT; v_nd5 BIGINT; v_nd6 BIGINT;
    v_prod_crm  BIGINT; v_prod_erp  BIGINT; v_prod_bi   BIGINT;
    v_prod_impl BIGINT; v_prod_sup  BIGINT; v_prod_srv  BIGINT;
    v_prod_nb   BIGINT; v_prod_ws   BIGINT; v_prod_mon  BIGINT;
    v_s1 BIGINT; v_s2 BIGINT; v_s3 BIGINT; v_s4 BIGINT; v_s5 BIGINT;
BEGIN
    SELECT id INTO v_uid     FROM users WHERE email = 'admin@retailflow.demo';
    IF v_uid IS NULL THEN RETURN; END IF;
    SELECT id INTO v_manager FROM users WHERE email = 'manager@retailflow.demo';
    SELECT id INTO v_sales   FROM users WHERE email = 'sales@retailflow.demo';

    -- 1. Fotos de clientes
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=1'  WHERE email = 'ana.silva@techcorp.com.br'       AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=8'  WHERE email = 'bruno.almeida@startup.io'         AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=2'  WHERE email = 'carla.mendes@megavarejo.com.br'   AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=11' WHERE email = 'diego.costa@industria.com'        AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=3'  WHERE email = 'elena.rodrigues@fintech.com.br'   AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=15' WHERE email = 'felipe.lima@agencia.net'          AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=4'  WHERE email = 'gabriela.santos@escola.edu.br'    AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=16' WHERE email = 'henrique.oliveira@hospital.org'   AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=5'  WHERE email = 'isabela.ferreira@ecommerce.com'  AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=17' WHERE email = 'joao.pereira@construtora.com.br'  AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=6'  WHERE email = 'karen.souza@logistica.net'        AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=18' WHERE email = 'lucas.nascimento@saas.io'         AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=7'  WHERE email = 'mariana.carvalho@farmacia.com'    AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=19' WHERE email = 'nicolas.martins@advocacia.adv'    AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=9'  WHERE email = 'olivia.rocha@imobiliaria.com.br'  AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=10' WHERE email = 'renata.barbosa@consultoria.com'   AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=20' WHERE email = 'samuel.torres@industria2.com'     AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=12' WHERE email = 'tatiana.nunes@banco.fin.br'       AND user_id = v_uid;
    UPDATE customers SET photo_url = 'https://i.pravatar.cc/150?img=14' WHERE email = 'vinicius.azevedo@telecom.com.br'  AND user_id = v_uid;

    -- 2. Imagens de produtos
    UPDATE products SET image_url = 'https://placehold.co/400x300/3B82F6/FFF?text=CRM+Enterprise'  WHERE sku = 'SW-CRM-ENT'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/3B82F6/FFF?text=ERP+Financeiro'  WHERE sku = 'SW-ERP-FIN'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/3B82F6/FFF?text=BI+Analytics'    WHERE sku = 'SW-BI-ANA'     AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/94A3B8/FFF?text=Antivirus'       WHERE sku = 'SW-AV-100'     AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/8B5CF6/FFF?text=Servidor+Dell'   WHERE sku = 'HW-SRV-R540'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/8B5CF6/FFF?text=Switch+48P'      WHERE sku = 'HW-SW-48P'     AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/8B5CF6/FFF?text=Firewall+UTM'    WHERE sku = 'HW-FW-UTM1G'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/94A3B8/FFF?text=Storage+NAS'     WHERE sku = 'HW-NAS-40T'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/10B981/FFF?text=Implantacao+CRM' WHERE sku = 'SVC-IMPL-60H'  AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/10B981/FFF?text=Suporte+Anual'   WHERE sku = 'SVC-SUP-ANUAL' AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/10B981/FFF?text=Treinamento'     WHERE sku = 'SVC-TRN-10'    AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/F59E0B/FFF?text=Workstation'     WHERE sku = 'HW-WS-P3660'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/F59E0B/FFF?text=ThinkPad+X1'     WHERE sku = 'HW-NB-X1C11'   AND user_id = v_uid;
    UPDATE products SET image_url = 'https://placehold.co/400x300/F59E0B/FFF?text=Monitor+4K'      WHERE sku = 'HW-MON-32K'    AND user_id = v_uid;

    -- 3. Lookup clientes e deals existentes
    SELECT id INTO v_cust_ana      FROM customers WHERE email = 'ana.silva@techcorp.com.br'       AND user_id = v_uid;
    SELECT id INTO v_cust_bruno    FROM customers WHERE email = 'bruno.almeida@startup.io'         AND user_id = v_uid;
    SELECT id INTO v_cust_carla    FROM customers WHERE email = 'carla.mendes@megavarejo.com.br'   AND user_id = v_uid;
    SELECT id INTO v_cust_diego    FROM customers WHERE email = 'diego.costa@industria.com'        AND user_id = v_uid;
    SELECT id INTO v_cust_elena    FROM customers WHERE email = 'elena.rodrigues@fintech.com.br'   AND user_id = v_uid;
    SELECT id INTO v_cust_felipe   FROM customers WHERE email = 'felipe.lima@agencia.net'          AND user_id = v_uid;
    SELECT id INTO v_cust_gabi     FROM customers WHERE email = 'gabriela.santos@escola.edu.br'    AND user_id = v_uid;
    SELECT id INTO v_cust_henrique FROM customers WHERE email = 'henrique.oliveira@hospital.org'   AND user_id = v_uid;
    SELECT id INTO v_cust_isabela  FROM customers WHERE email = 'isabela.ferreira@ecommerce.com'  AND user_id = v_uid;
    SELECT id INTO v_cust_joao     FROM customers WHERE email = 'joao.pereira@construtora.com.br'  AND user_id = v_uid;
    SELECT id INTO v_cust_karen    FROM customers WHERE email = 'karen.souza@logistica.net'        AND user_id = v_uid;
    SELECT id INTO v_cust_lucas    FROM customers WHERE email = 'lucas.nascimento@saas.io'         AND user_id = v_uid;
    SELECT id INTO v_cust_mariana  FROM customers WHERE email = 'mariana.carvalho@farmacia.com'    AND user_id = v_uid;
    SELECT id INTO v_cust_nicolas  FROM customers WHERE email = 'nicolas.martins@advocacia.adv'    AND user_id = v_uid;
    SELECT id INTO v_cust_olivia   FROM customers WHERE email = 'olivia.rocha@imobiliaria.com.br'  AND user_id = v_uid;
    SELECT id INTO v_cust_renata   FROM customers WHERE email = 'renata.barbosa@consultoria.com'   AND user_id = v_uid;
    SELECT id INTO v_cust_samuel   FROM customers WHERE email = 'samuel.torres@industria2.com'     AND user_id = v_uid;
    SELECT id INTO v_cust_tatiana  FROM customers WHERE email = 'tatiana.nunes@banco.fin.br'       AND user_id = v_uid;
    SELECT id INTO v_cust_vini     FROM customers WHERE email = 'vinicius.azevedo@telecom.com.br'  AND user_id = v_uid;

    SELECT id INTO v_d3  FROM deals WHERE title = 'Licenças corporativas MegaVarejo'     AND created_by = v_uid;
    SELECT id INTO v_d5  FROM deals WHERE title = 'Projeto TI completo FinTech Brasil'   AND created_by = v_uid;
    SELECT id INTO v_d9  FROM deals WHERE title = 'Infraestrutura eCommerce Plus'        AND created_by = v_uid;
    SELECT id INTO v_d14 FROM deals WHERE title = 'Imobiliária Horizonte - workstations' AND created_by = v_uid;

    SELECT id INTO v_prod_crm  FROM products WHERE sku = 'SW-CRM-ENT'    AND user_id = v_uid;
    SELECT id INTO v_prod_erp  FROM products WHERE sku = 'SW-ERP-FIN'    AND user_id = v_uid;
    SELECT id INTO v_prod_bi   FROM products WHERE sku = 'SW-BI-ANA'     AND user_id = v_uid;
    SELECT id INTO v_prod_impl FROM products WHERE sku = 'SVC-IMPL-60H'  AND user_id = v_uid;
    SELECT id INTO v_prod_sup  FROM products WHERE sku = 'SVC-SUP-ANUAL' AND user_id = v_uid;
    SELECT id INTO v_prod_srv  FROM products WHERE sku = 'HW-SRV-R540'   AND user_id = v_uid;
    SELECT id INTO v_prod_nb   FROM products WHERE sku = 'HW-NB-X1C11'   AND user_id = v_uid;
    SELECT id INTO v_prod_ws   FROM products WHERE sku = 'HW-WS-P3660'   AND user_id = v_uid;
    SELECT id INTO v_prod_mon  FROM products WHERE sku = 'HW-MON-32K'    AND user_id = v_uid;

    -- 4. Novos deals: LOST (funil realista)
    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, lost_reason, closed_at, created_at, updated_at)
    VALUES ('Construtora JPS - ERP completo', 35000.00, 0, 'LOST', v_cust_joao, v_sales, v_uid,
            'Orçamento acima do disponível para o exercício fiscal',
            NOW() - INTERVAL '60 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days')
    RETURNING id INTO v_nd1;

    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, lost_reason, closed_at, created_at, updated_at)
    VALUES ('Martins & Associados - gestão documental', 12000.00, 0, 'LOST', v_cust_nicolas, v_manager, v_uid,
            'Cliente optou por solução concorrente com menor custo inicial',
            NOW() - INTERVAL '30 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '30 days')
    RETURNING id INTO v_nd2;

    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, lost_reason, closed_at, created_at, updated_at)
    VALUES ('Escola Futuro - licenças educacionais', 8500.00, 0, 'LOST', v_cust_gabi, v_sales, v_uid,
            'Processo licitatório exigiu prazo formal — não cumprido',
            NOW() - INTERVAL '15 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '15 days')
    RETURNING id INTO v_nd3;

    -- WON adicionais
    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, closed_at, created_at, updated_at)
    VALUES ('Agência Digital X - pacote completo', 22000.00, 100, 'WON', v_cust_felipe, v_sales, v_uid,
            NOW() - INTERVAL '10 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '10 days')
    RETURNING id INTO v_nd4;

    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, closed_at, created_at, updated_at)
    VALUES ('Farmácia Bem Estar - sistema PDV + CRM', 18900.00, 100, 'WON', v_cust_mariana, v_manager, v_uid,
            NOW() - INTERVAL '5 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days')
    RETURNING id INTO v_nd5;

    -- NEGOTIATION adicional
    INSERT INTO deals (title, value, probability, stage, customer_id, assigned_to, created_by, created_at, updated_at)
    VALUES ('RB Consultoria - expansão licenças BI', 24000.00, 70, 'NEGOTIATION', v_cust_renata, v_manager, v_uid,
            NOW() - INTERVAL '8 days', NOW())
    RETURNING id INTO v_nd6;

    -- 5. deal_products
    IF v_nd4 IS NOT NULL AND v_prod_nb IS NOT NULL THEN
        INSERT INTO deal_products (deal_id, product_id) VALUES (v_nd4, v_prod_nb)  ON CONFLICT DO NOTHING;
        INSERT INTO deal_products (deal_id, product_id) VALUES (v_nd4, v_prod_mon) ON CONFLICT DO NOTHING;
    END IF;
    IF v_nd5 IS NOT NULL AND v_prod_crm IS NOT NULL THEN
        INSERT INTO deal_products (deal_id, product_id) VALUES (v_nd5, v_prod_crm)  ON CONFLICT DO NOTHING;
        INSERT INTO deal_products (deal_id, product_id) VALUES (v_nd5, v_prod_impl) ON CONFLICT DO NOTHING;
    END IF;
    IF v_nd6 IS NOT NULL AND v_prod_bi IS NOT NULL THEN
        INSERT INTO deal_products (deal_id, product_id) VALUES (v_nd6, v_prod_bi) ON CONFLICT DO NOTHING;
    END IF;

    -- 6. Atividades adicionais
    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, completed_at, created_at, updated_at)
    VALUES ('CALL', 'Negociação final MegaVarejo', 'Alinhamento de condições de pagamento e SLA contratual',
            v_cust_carla, v_d3, 'URGENT', 'DONE', v_manager, v_uid,
            NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, completed_at, created_at, updated_at)
    VALUES ('MEETING', 'Revisão proposta FinTech Brasil', 'Apresentação de ajustes técnicos após feedback do CTO',
            v_cust_elena, v_d5, 'HIGH', 'DONE', v_manager, v_uid,
            NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '7 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, completed_at, created_at, updated_at)
    VALUES ('EMAIL', 'Contrato eCommerce Plus assinado', 'Contrato enviado e assinado digitalmente — aguardando NF',
            v_cust_isabela, v_d9, 'HIGH', 'DONE', v_sales, v_uid,
            NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('CALL', 'Follow-up aprovação Imobiliária Horizonte', 'Confirmar aprovação orçamentária com diretoria financeira',
            v_cust_olivia, v_d14, 'HIGH', 'PENDING', v_sales, v_uid,
            NOW() + INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('MEETING', 'Demo BI para RB Consultoria', 'Demonstração Plataforma BI & Analytics para time de dados',
            v_cust_renata, v_nd6, 'MEDIUM', 'PENDING', v_manager, v_uid,
            NOW() + INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('TASK', 'Preparar proposta técnica Logística Rápida', 'Ajustar escopo de switches e APs conforme visita ao galpão',
            v_cust_karen, NULL, 'HIGH', 'IN_PROGRESS', v_sales, v_uid,
            NOW() + INTERVAL '3 days', NOW() - INTERVAL '1 day', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('EMAIL', 'Onboarding Agência Digital X', 'Enviar kit boas-vindas e agendar kickoff de implantação',
            v_cust_felipe, v_nd4, 'MEDIUM', 'PENDING', v_manager, v_uid,
            NOW() + INTERVAL '1 day', NOW(), NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('CALL', 'Qualificação Samuel Torres - Indústria 2.0', 'Verificar maturidade digital e necessidades de monitoramento',
            v_cust_samuel, NULL, 'MEDIUM', 'PENDING', v_sales, v_uid,
            NOW() + INTERVAL '4 days', NOW() - INTERVAL '3 days', NOW());

    INSERT INTO activities (type, title, description, customer_id, deal_id, priority, status, assigned_to, created_by, due_date, created_at, updated_at)
    VALUES ('MEETING', 'Apresentação infraestrutura TeleCom Brasil', 'Reunião técnica com arquiteto de redes para detalhar topologia',
            v_cust_vini, NULL, 'HIGH', 'IN_PROGRESS', v_manager, v_uid,
            NOW() + INTERVAL '5 days', NOW() - INTERVAL '2 days', NOW());

    -- 7. Vendas (tabela sales)
    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_ana, v_uid, 'COMPLETED', 39200.00, NOW() - INTERVAL '85 days',
            '4× ThinkPad X1 Carbon — renovação frota notebooks', NOW() - INTERVAL '85 days')
    RETURNING id INTO v_s1;

    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_henrique, v_uid, 'COMPLETED', 56700.00, NOW() - INTERVAL '145 days',
            '3× Servidor Dell PowerEdge R540 + implantação — Hospital São Lucas', NOW() - INTERVAL '145 days')
    RETURNING id INTO v_s2;

    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_tatiana, v_uid, 'COMPLETED', 21200.00, NOW() - INTERVAL '55 days',
            'CRM Enterprise + Firewall UTM + Treinamento equipe — Banco Prime', NOW() - INTERVAL '55 days')
    RETURNING id INTO v_s3;

    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_lucas, v_uid, 'COMPLETED', 35500.00, NOW() - INTERVAL '45 days',
            'CRM + ERP + BI Analytics + Implantação — SaaS Solutions datacenter', NOW() - INTERVAL '45 days')
    RETURNING id INTO v_s4;

    INSERT INTO sales (customer_id, created_by, status, total, sale_date, notes, created_at)
    VALUES (v_cust_mariana, v_uid, 'COMPLETED', 21000.00, NOW() - INTERVAL '5 days',
            'CRM Enterprise + Implantação 60h — Farmácia Bem Estar', NOW() - INTERVAL '5 days')
    RETURNING id INTO v_s5;

    -- sale_items
    IF v_s1 IS NOT NULL AND v_prod_nb IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s1, v_prod_nb, 4, 9800.00, 39200.00);
    END IF;
    IF v_s2 IS NOT NULL AND v_prod_srv IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s2, v_prod_srv, 3, 18900.00, 56700.00);
    END IF;
    IF v_s3 IS NOT NULL AND v_prod_crm IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s3, v_prod_crm,  1, 12000.00, 12000.00);
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s3, v_prod_impl, 1,  9000.00,  9000.00);
    END IF;
    IF v_s4 IS NOT NULL AND v_prod_crm IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s4, v_prod_crm,  1, 12000.00, 12000.00);
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s4, v_prod_erp,  1,  8500.00,  8500.00);
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s4, v_prod_bi,   1,  6000.00,  6000.00);
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s4, v_prod_impl, 1,  9000.00,  9000.00);
    END IF;
    IF v_s5 IS NOT NULL AND v_prod_crm IS NOT NULL THEN
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s5, v_prod_crm,  1, 12000.00, 12000.00);
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_s5, v_prod_impl, 1,  9000.00,  9000.00);
    END IF;

    -- 8. Notificações
    INSERT INTO notifications (type, title, message, read, user_id, created_at)
    VALUES ('DEAL_WON', 'Deal fechado!', 'Agência Digital X - pacote completo — R$ 22.000,00',    false, v_uid, NOW() - INTERVAL '10 days');
    INSERT INTO notifications (type, title, message, read, user_id, created_at)
    VALUES ('DEAL_WON', 'Deal fechado!', 'Farmácia Bem Estar - sistema PDV + CRM — R$ 18.900,00', false, v_uid, NOW() - INTERVAL '5 days');
    INSERT INTO notifications (type, title, message, read, user_id, created_at)
    VALUES ('FOLLOW_UP', 'Follow-up necessário', 'RB Consultoria - negociação BI em aberto há 8 dias', false, v_uid, NOW() - INTERVAL '1 day');

END $$;
