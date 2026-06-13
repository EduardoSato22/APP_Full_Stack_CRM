package com.retailflow.config;

import com.retailflow.model.*;
import com.retailflow.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DemoDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final DealRepository dealRepository;
    private final ActivityRepository activityRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail("admin@retailflow.demo")) {
            log.info("[DemoDataLoader] Dados de demonstração já existem — pulando seed.");
            return;
        }
        log.info("[DemoDataLoader] Iniciando seed de demonstração...");
        loadDemoData();
        log.info("[DemoDataLoader] Seed concluído.");
    }

    private void loadDemoData() {
        User admin   = createUser("Admin RetailFlow",  "admin@retailflow.demo",   "Admin123",   Role.ADMIN);
        User manager = createUser("Carlos Gerente",    "manager@retailflow.demo", "Manager123", Role.MANAGER);
        User sales   = createUser("Julia Vendas",      "sales@retailflow.demo",   "Sales123",   Role.USER);

        ProductCategory soft = createCategory("Software & Licenças",  "#3B82F6", admin);
        ProductCategory infr = createCategory("Infraestrutura",       "#8B5CF6", admin);
        ProductCategory serv = createCategory("Serviços & Suporte",   "#10B981", admin);
        ProductCategory hard = createCategory("Hardware Corporativo",  "#F59E0B", admin);

        // Software — margens altas, estoque "infinito" para licenças
        createProduct("CRM RetailFlow Enterprise",
                "Licença anual — até 50 usuários, API REST, relatórios customizáveis, SLA 99,9% e suporte dedicado",
                new BigDecimal("12000.00"), new BigDecimal("4200.00"), "SW-CRM-ENT",  999, Product.Unit.UNIT,    Product.Status.ACTIVE,       soft, admin);
        createProduct("ERP Financeiro — Módulo Completo",
                "Contas a pagar/receber, DRE automático, conciliação bancária e integração contábil via SPED",
                new BigDecimal("8500.00"),  new BigDecimal("3000.00"), "SW-ERP-FIN",  999, Product.Unit.UNIT,    Product.Status.ACTIVE,       soft, admin);
        createProduct("Plataforma BI & Analytics",
                "Dashboards em tempo real, relatórios agendados, conectores SQL/REST/Sheets e drill-down interativo",
                new BigDecimal("6000.00"),  new BigDecimal("1800.00"), "SW-BI-ANA",   999, Product.Unit.UNIT,    Product.Status.ACTIVE,       soft, admin);
        createProduct("Antivírus Corporativo — 100 seats",
                "Proteção endpoint, EDR, firewall DNS, console centralizado — fora de linha, substituído por nova versão",
                new BigDecimal("3600.00"),  new BigDecimal("1400.00"), "SW-AV-100",     0, Product.Unit.UNIT,    Product.Status.INACTIVE,     soft, admin);

        // Infraestrutura — margens menores, estoque físico limitado
        createProduct("Servidor Dell PowerEdge R540",
                "Xeon Silver 4214R, 64 GB ECC RAM, 2× 1,2 TB SAS RAID 1, PSU redundante 750 W, iDRAC 9",
                new BigDecimal("18900.00"), new BigDecimal("13200.00"), "HW-SRV-R540",  5, Product.Unit.UNIT,    Product.Status.ACTIVE,       infr, admin);
        createProduct("Switch Gerenciável 48P PoE+",
                "48× Gigabit PoE+ (740 W total), 4× SFP+ 10G uplink, VLAN 802.1Q, QoS, gestão web e CLI",
                new BigDecimal("4200.00"),  new BigDecimal("2600.00"), "HW-SW-48P",    12, Product.Unit.UNIT,    Product.Status.ACTIVE,       infr, admin);
        createProduct("Firewall UTM Next-Gen 1 Gbps",
                "IPS/IDS com assinaturas diárias, VPN SSL e IPsec, filtragem de URL por categoria e sandbox cloud",
                new BigDecimal("6800.00"),  new BigDecimal("4100.00"), "HW-FW-UTM1G",   8, Product.Unit.UNIT,    Product.Status.ACTIVE,       infr, admin);
        createProduct("Storage NAS Empresarial 40 TB",
                "NAS 12 baias RAID 6, replicação offsite, deduplicação e snapshot agendado — geração anterior descontinuada",
                new BigDecimal("9200.00"),  new BigDecimal("6500.00"), "HW-NAS-40T",    0, Product.Unit.UNIT,    Product.Status.DISCONTINUED, infr, admin);

        // Serviços — unidade SERVICE, estoque zero é padrão
        createProduct("Implantação CRM — Pacote 60 h",
                "Levantamento de requisitos, configuração, migração de dados legados, testes e treinamento go-live",
                new BigDecimal("9000.00"),  new BigDecimal("2700.00"), "SVC-IMPL-60H",  0, Product.Unit.SERVICE, Product.Status.ACTIVE,       serv, admin);
        createProduct("Contrato de Suporte Anual",
                "SLA 4 h para críticos, atendimento 8×5, atualizações incluídas e gerente de conta dedicado",
                new BigDecimal("4800.00"),  new BigDecimal("1200.00"), "SVC-SUP-ANUAL", 0, Product.Unit.SERVICE, Product.Status.ACTIVE,       serv, admin);
        createProduct("Treinamento Usuário Final — turma 10",
                "Capacitação presencial ou remota (8 h), material didático em PDF e certificado de conclusão",
                new BigDecimal("2400.00"),  new BigDecimal("600.00"),  "SVC-TRN-10",    0, Product.Unit.SERVICE, Product.Status.ACTIVE,       serv, admin);

        // Hardware — margem intermediária, estoque físico
        createProduct("Workstation Dell Precision 3660",
                "Intel Core i9-13900K, 32 GB DDR5, NVIDIA RTX A2000 12 GB, 1 TB NVMe — CAD e renderização",
                new BigDecimal("11200.00"), new BigDecimal("7800.00"), "HW-WS-P3660",   7, Product.Unit.UNIT,    Product.Status.ACTIVE,       hard, admin);
        createProduct("Notebook Lenovo ThinkPad X1 Carbon Gen 11",
                "Intel Core i7-1365U, 16 GB LPDDR5, 512 GB NVMe, tela 14\" 2,8K OLED — ultra portátil corporativo",
                new BigDecimal("9800.00"),  new BigDecimal("6900.00"), "HW-NB-X1C11",  15, Product.Unit.UNIT,    Product.Status.ACTIVE,       hard, admin);
        createProduct("Monitor Profissional 32\" 4K IPS",
                "HDR 600, Delta E < 2, USB-C 90 W, KVM integrado, cobertura sRGB 99%, altura e rotação ajustáveis",
                new BigDecimal("3800.00"),  new BigDecimal("2400.00"), "HW-MON-32K",   20, Product.Unit.UNIT,    Product.Status.ACTIVE,       hard, admin);

        Customer ana     = createCustomer("Ana",      "Silva",       "ana.silva@techcorp.com.br",       "(11) 99801-2345", "TechCorp Ltda",        "Diretora de TI",       Customer.Status.ACTIVE,   Customer.Source.REFERRAL,     new BigDecimal("85000.00"),  admin, 90);
        Customer bruno   = createCustomer("Bruno",    "Almeida",     "bruno.almeida@startup.io",        "(21) 98712-3456", "Startup Inovação S/A", "CTO",                  Customer.Status.ACTIVE,   Customer.Source.ORGANIC,      new BigDecimal("42000.00"),  admin, 75);
        Customer carla   = createCustomer("Carla",    "Mendes",      "carla.mendes@megavarejo.com.br",  "(31) 97623-4567", "MegaVarejo",           "Gerente de Compras",   Customer.Status.PROSPECT, Customer.Source.ADS,          new BigDecimal("18500.00"),  admin, 60);
        Customer diego   = createCustomer("Diego",    "Costa",       "diego.costa@industria.com",       "(41) 96534-5678", "Indústria Central",    "Coordenador",          Customer.Status.ACTIVE,   Customer.Source.COLD_OUTREACH,new BigDecimal("65000.00"),  admin, 120);
        Customer elena   = createCustomer("Elena",    "Rodrigues",   "elena.rodrigues@fintech.com.br",  "(51) 95445-6789", "FinTech Brasil",       "Head of Engineering",  Customer.Status.ACTIVE,   Customer.Source.EVENT,        new BigDecimal("92000.00"),  admin, 45);
        Customer felipe  = createCustomer("Felipe",   "Lima",        "felipe.lima@agencia.net",         "(61) 94356-7890", "Agência Digital X",    "Sócio",                Customer.Status.LEAD,     Customer.Source.ORGANIC,      BigDecimal.ZERO,             admin, 10);
        Customer gabi    = createCustomer("Gabriela", "Santos",      "gabriela.santos@escola.edu.br",   "(71) 93267-8901", "Escola Futuro",        "Diretora",             Customer.Status.PROSPECT, Customer.Source.ADS,          new BigDecimal("5800.00"),   admin, 30);
        Customer henrique= createCustomer("Henrique", "Oliveira",    "henrique.oliveira@hospital.org",  "(81) 92178-9012", "Hospital São Lucas",   "Gerente de TI",        Customer.Status.ACTIVE,   Customer.Source.REFERRAL,     new BigDecimal("155000.00"), admin, 200);
        Customer isabela = createCustomer("Isabela",  "Ferreira",    "isabela.ferreira@ecommerce.com",  "(91) 91089-0123", "eCommerce Plus",       "Product Manager",      Customer.Status.ACTIVE,   Customer.Source.ORGANIC,      new BigDecimal("28000.00"),  admin, 55);
        Customer joao    = createCustomer("João",     "Pereira",     "joao.pereira@construtora.com.br", "(11) 90990-1234", "Construtora JPS",      "Diretor Financeiro",   Customer.Status.INACTIVE, Customer.Source.COLD_OUTREACH, BigDecimal.ZERO,            admin, 150);
        Customer karen   = createCustomer("Karen",    "Souza",       "karen.souza@logistica.net",       "(21) 89901-2345", "Logística Rápida",     "Supervisora",          Customer.Status.ACTIVE,   Customer.Source.REFERRAL,     new BigDecimal("38000.00"),  admin, 80);
        Customer lucas   = createCustomer("Lucas",    "Nascimento",  "lucas.nascimento@saas.io",        "(31) 88812-3456", "SaaS Solutions",       "CEO",                  Customer.Status.ACTIVE,   Customer.Source.EVENT,        new BigDecimal("120000.00"), admin, 100);
        Customer mariana = createCustomer("Mariana",  "Carvalho",    "mariana.carvalho@farmacia.com",   "(41) 87723-4567", "Farmácia Bem Estar",   "Proprietária",         Customer.Status.PROSPECT, Customer.Source.ADS,          new BigDecimal("9200.00"),   admin, 20);
        Customer nicolas = createCustomer("Nicolas",  "Martins",     "nicolas.martins@advocacia.adv",   "(51) 86634-5678", "Martins & Associados", "Sócio-Fundador",       Customer.Status.LEAD,     Customer.Source.ORGANIC,      BigDecimal.ZERO,             admin, 5);
        Customer olivia  = createCustomer("Olivia",   "Rocha",       "olivia.rocha@imobiliaria.com.br", "(61) 85545-6789", "Imobiliária Horizonte","Diretora Comercial",   Customer.Status.ACTIVE,   Customer.Source.REFERRAL,     new BigDecimal("47000.00"),  admin, 70);
        Customer renata  = createCustomer("Renata",   "Barbosa",     "renata.barbosa@consultoria.com",  "(71) 84456-7890", "RB Consultoria",       "Consultora Sênior",    Customer.Status.ACTIVE,   Customer.Source.EVENT,        new BigDecimal("73000.00"),  admin, 40);
        Customer samuel  = createCustomer("Samuel",   "Torres",      "samuel.torres@industria2.com",    "(81) 83367-8901", "Indústria 2.0",        "Engenheiro-Chefe",     Customer.Status.PROSPECT, Customer.Source.ADS,          new BigDecimal("12000.00"),  admin, 25);
        Customer tatiana = createCustomer("Tatiana",  "Nunes",       "tatiana.nunes@banco.fin.br",      "(11) 81189-0123", "Banco Prime",          "VP de Tecnologia",     Customer.Status.ACTIVE,   Customer.Source.REFERRAL,     new BigDecimal("210000.00"), admin, 300);
        Customer vini    = createCustomer("Vinicius", "Azevedo",     "vinicius.azevedo@telecom.com.br", "(21) 80090-1234", "TeleCom Brasil",       "Gerente de Projetos",  Customer.Status.ACTIVE,   Customer.Source.ORGANIC,      new BigDecimal("56000.00"),  admin, 60);

        Deal d1  = createDeal("Renovação frota notebooks TechCorp",       new BigDecimal("42000.00"), Deal.Stage.WON,          ana,     admin, manager, 90, 85);
        Deal d2  = createDeal("Setup workstations Startup Inovação",      new BigDecimal("18500.00"), Deal.Stage.WON,          bruno,   admin, sales,   75, 70);
        Deal d3  = createDeal("Licenças corporativas MegaVarejo",         new BigDecimal("8900.00"),  Deal.Stage.NEGOTIATION,  carla,   admin, manager, 45, null);
        Deal d4  = createDeal("Upgrade infraestrutura Indústria Central", new BigDecimal("32000.00"), Deal.Stage.WON,          diego,   admin, sales,   60, 55);
        Deal d5  = createDeal("Projeto TI completo FinTech Brasil",       new BigDecimal("65000.00"), Deal.Stage.PROPOSAL,     elena,   admin, manager, 40, null);
        Deal d6  = createDeal("Equipamentos agência Felipe Lima",         new BigDecimal("5200.00"),  Deal.Stage.QUALIFICATION,felipe,  admin, sales,   8,  null);
        Deal d7  = createDeal("Computadores sala de aula Escola Futuro",  new BigDecimal("12400.00"), Deal.Stage.PROSPECTING,  gabi,    admin, manager, 15, null);
        Deal d8  = createDeal("Servidores Hospital São Lucas",            new BigDecimal("98000.00"), Deal.Stage.WON,          henrique,admin, sales,   150,145);
        Deal d9  = createDeal("Infraestrutura eCommerce Plus",            new BigDecimal("22000.00"), Deal.Stage.NEGOTIATION,  isabela, admin, manager, 50, null);
        Deal d10 = createDeal("Logística Rápida - upgrade rede",          new BigDecimal("18500.00"), Deal.Stage.PROPOSAL,     karen,   admin, sales,   30, null);
        Deal d11 = createDeal("SaaS Solutions - datacenter",              new BigDecimal("75000.00"), Deal.Stage.WON,          lucas,   admin, manager, 50, 45);
        Deal d12 = createDeal("Farmácia - sistema e PDVs",                new BigDecimal("9200.00"),  Deal.Stage.QUALIFICATION,mariana, admin, sales,   15, null);
        Deal d13 = createDeal("Advocacia Martins - notebooks",            new BigDecimal("3800.00"),  Deal.Stage.PROSPECTING,  nicolas, admin, manager, 3,  null);
        Deal d14 = createDeal("Imobiliária Horizonte - workstations",     new BigDecimal("28000.00"), Deal.Stage.NEGOTIATION,  olivia,  admin, sales,   40, null);
        Deal d15 = createDeal("RB Consultoria - home office",             new BigDecimal("12000.00"), Deal.Stage.PROPOSAL,     renata,  admin, manager, 20, null);
        Deal d16 = createDeal("Banco Prime - segurança endpoint",         new BigDecimal("145000.00"),Deal.Stage.WON,          tatiana, admin, sales,   60, 55);
        Deal d17 = createDeal("TeleCom Brasil - switch e roteadores",     new BigDecimal("34000.00"), Deal.Stage.PROPOSAL,     vini,    admin, manager, 25, null);
        Deal d18 = createDeal("Indústria 2.0 - monitoramento",            new BigDecimal("8900.00"),  Deal.Stage.QUALIFICATION,samuel,  admin, sales,   10, null);

        createActivity(Activity.Type.CALL,    "Ligação de follow-up TechCorp",        ana,     d1,  Activity.Priority.HIGH,   Activity.Status.DONE,        admin, manager, 10, 5);
        createActivity(Activity.Type.EMAIL,   "Proposta comercial FinTech",           elena,   d5,  Activity.Priority.HIGH,   Activity.Status.PENDING,     admin, manager, 5,  -2);
        createActivity(Activity.Type.MEETING, "Reunião de negociação MegaVarejo",     carla,   d3,  Activity.Priority.URGENT, Activity.Status.PENDING,     admin, manager, 3,  -3);
        createActivity(Activity.Type.TASK,    "Enviar cotação Hospital São Lucas",    henrique,d8,  Activity.Priority.HIGH,   Activity.Status.DONE,        admin, sales,   90, 80);
        createActivity(Activity.Type.CALL,    "Demo produto Startup Inovação",        bruno,   d2,  Activity.Priority.MEDIUM, Activity.Status.DONE,        admin, sales,   65, 60);
        createActivity(Activity.Type.EMAIL,   "Envio de proposta Imobiliária",        olivia,  d14, Activity.Priority.HIGH,   Activity.Status.PENDING,     admin, sales,   2,  -1);
        createActivity(Activity.Type.MEETING, "Kickoff projeto Banco Prime",          tatiana, d16, Activity.Priority.URGENT, Activity.Status.DONE,        admin, manager, 20, 15);
        createActivity(Activity.Type.CALL,    "Qualificação Felipe Lima",             felipe,  d6,  Activity.Priority.MEDIUM, Activity.Status.PENDING,     admin, sales,   5,  -4);
        createActivity(Activity.Type.TASK,    "Preparar demo Escola Futuro",          gabi,    d7,  Activity.Priority.LOW,    Activity.Status.IN_PROGRESS, admin, manager, 7,  -7);
        createActivity(Activity.Type.EMAIL,   "Apresentação SaaS Solutions encerrada",lucas,   d11, Activity.Priority.HIGH,   Activity.Status.DONE,        admin, sales,   30, 25);

        createNotification(Notification.Type.DEAL_WON,     "Deal fechado!",        "Banco Prime - segurança endpoint - R$ 145.000,00", false, admin, 8);
        createNotification(Notification.Type.DEAL_WON,     "Deal fechado!",        "SaaS Solutions - datacenter - R$ 75.000,00",      false, admin, 18);
        createNotification(Notification.Type.ACTIVITY_DUE, "Atividade vencida",    "Proposta FinTech Brasil está pendente",           false, admin, 0);
        createNotification(Notification.Type.FOLLOW_UP,    "Follow-up necessário", "MegaVarejo - 45 dias sem contato",                true,  admin, 2);
    }

    private User createUser(String name, String email, String password, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setActive(true);
        return userRepository.save(user);
    }

    private ProductCategory createCategory(String name, String color, User owner) {
        ProductCategory cat = new ProductCategory();
        cat.setName(name);
        cat.setColor(color);
        cat.setUser(owner);
        return categoryRepository.save(cat);
    }

    private Product createProduct(String name, String desc, BigDecimal price, BigDecimal cost,
            String sku, int stock, Product.Unit unit, Product.Status status, ProductCategory cat, User owner) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setCostPrice(cost);
        p.setSku(sku);
        p.setStock(stock);
        p.setUnit(unit);
        p.setStatus(status);
        p.setCategory(cat);
        p.setUser(owner);
        return productRepository.save(p);
    }

    private Customer createCustomer(String first, String last, String email, String phone,
            String company, String position, Customer.Status status, Customer.Source source,
            BigDecimal revenue, User owner, int daysAgo) {
        Customer c = new Customer();
        c.setFirstName(first);
        c.setLastName(last);
        c.setEmail(email);
        c.setPhone(phone);
        c.setCompany(company);
        c.setPosition(position);
        c.setStatus(status);
        c.setSource(source);
        c.setTotalRevenue(revenue);
        c.setUser(owner);
        c.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        c.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(c);
    }

    private Deal createDeal(String title, BigDecimal value, Deal.Stage stage, Customer customer,
            User createdBy, User assignedTo, int createdDaysAgo, Integer closedDaysAgo) {
        Deal d = new Deal();
        d.setTitle(title);
        d.setValue(value);
        d.setStage(stage);
        d.setCustomer(customer);
        d.setCreatedBy(createdBy);
        d.setAssignedTo(assignedTo);
        d.setProbabilityByStage();
        d.setCreatedAt(LocalDateTime.now().minusDays(createdDaysAgo));
        d.setUpdatedAt(LocalDateTime.now());
        if (closedDaysAgo != null) {
            d.setClosedAt(LocalDateTime.now().minusDays(closedDaysAgo));
        }
        return dealRepository.save(d);
    }

    private void createActivity(Activity.Type type, String title, Customer customer, Deal deal,
            Activity.Priority priority, Activity.Status status, User createdBy, User assignedTo,
            int createdDaysAgo, int dueDaysFromNow) {
        Activity a = new Activity();
        a.setType(type);
        a.setTitle(title);
        a.setCustomer(customer);
        a.setDeal(deal);
        a.setPriority(priority);
        a.setStatus(status);
        a.setCreatedBy(createdBy);
        a.setAssignedTo(assignedTo);
        a.setCreatedAt(LocalDateTime.now().minusDays(createdDaysAgo));
        a.setUpdatedAt(LocalDateTime.now());
        a.setDueDate(LocalDateTime.now().plusDays(dueDaysFromNow));
        if (status == Activity.Status.DONE) {
            a.setCompletedAt(LocalDateTime.now().minusDays(1));
        }
        activityRepository.save(a);
    }

    private void createNotification(Notification.Type type, String title, String message,
            boolean read, User user, int daysAgo) {
        Notification n = new Notification();
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setRead(read);
        n.setUser(user);
        n.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        notificationRepository.save(n);
    }
}
