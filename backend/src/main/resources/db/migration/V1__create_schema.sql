-- ============================================================
-- V1 - Schema inicial do RetailFlow CRM
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id               BIGSERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    email            VARCHAR(255) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    role             VARCHAR(50)  NOT NULL DEFAULT 'USER',
    avatar           VARCHAR(512),
    phone            VARCHAR(50),
    active           BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at    TIMESTAMP,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    token       VARCHAR(512) NOT NULL UNIQUE,
    user_id     BIGINT       NOT NULL REFERENCES users(id),
    expiry_date TIMESTAMP    NOT NULL,
    revoked     BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS customers (
    id                  BIGSERIAL PRIMARY KEY,
    first_name          VARCHAR(255) NOT NULL,
    last_name           VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    age                 INTEGER,
    phone               VARCHAR(50),
    company             VARCHAR(255),
    position            VARCHAR(255),
    photo_url           VARCHAR(512),
    addr_street         VARCHAR(255),
    addr_city           VARCHAR(100),
    addr_state          VARCHAR(100),
    addr_zip            VARCHAR(20),
    addr_country        VARCHAR(100),
    status              VARCHAR(50)  NOT NULL DEFAULT 'LEAD',
    source              VARCHAR(50)  NOT NULL DEFAULT 'ORGANIC',
    notes               TEXT,
    total_revenue       NUMERIC(15,2) DEFAULT 0,
    last_contact_date   TIMESTAMP,
    next_follow_up_date TIMESTAMP,
    user_id             BIGINT       NOT NULL REFERENCES users(id),
    assigned_to         BIGINT       REFERENCES users(id),
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP,
    UNIQUE (email, user_id)
);

CREATE TABLE IF NOT EXISTS customer_tags (
    customer_id BIGINT       NOT NULL REFERENCES customers(id),
    tag         VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_categories (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    color      VARCHAR(50),
    user_id    BIGINT NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS products (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(255)  NOT NULL,
    description  TEXT          NOT NULL,
    price        NUMERIC(15,2) NOT NULL,
    cost_price   NUMERIC(15,2),
    sku          VARCHAR(100) UNIQUE,
    stock        INTEGER DEFAULT 0,
    unit         VARCHAR(50)  NOT NULL DEFAULT 'UNIT',
    status       VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
    image_url    VARCHAR(512),
    category_id  BIGINT REFERENCES product_categories(id),
    user_id      BIGINT NOT NULL REFERENCES users(id),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deals (
    id                  BIGSERIAL PRIMARY KEY,
    title               VARCHAR(255)  NOT NULL,
    value               NUMERIC(15,2) DEFAULT 0,
    probability         INTEGER,
    stage               VARCHAR(50)   NOT NULL DEFAULT 'PROSPECTING',
    customer_id         BIGINT        NOT NULL REFERENCES customers(id),
    expected_close_date TIMESTAMP,
    closed_at           TIMESTAMP,
    lost_reason         VARCHAR(500),
    notes               TEXT,
    assigned_to         BIGINT REFERENCES users(id),
    created_by          BIGINT NOT NULL REFERENCES users(id),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deal_products (
    deal_id    BIGINT NOT NULL REFERENCES deals(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    PRIMARY KEY (deal_id, product_id)
);

CREATE TABLE IF NOT EXISTS activities (
    id           BIGSERIAL PRIMARY KEY,
    type         VARCHAR(50)  NOT NULL,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    customer_id  BIGINT REFERENCES customers(id),
    deal_id      BIGINT REFERENCES deals(id),
    due_date     TIMESTAMP,
    completed_at TIMESTAMP,
    assigned_to  BIGINT REFERENCES users(id),
    created_by   BIGINT NOT NULL REFERENCES users(id),
    priority     VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status       VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id          BIGSERIAL PRIMARY KEY,
    type        VARCHAR(50)  NOT NULL,
    title       VARCHAR(255) NOT NULL,
    message     TEXT,
    read        BOOLEAN NOT NULL DEFAULT FALSE,
    user_id     BIGINT  NOT NULL REFERENCES users(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50)  NOT NULL,
    entity_id   BIGINT,
    action      VARCHAR(50)  NOT NULL,
    old_value   TEXT,
    new_value   TEXT,
    performed_by BIGINT REFERENCES users(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices principais
CREATE INDEX IF NOT EXISTS idx_customers_user_id     ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_status      ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at  ON customers(deleted_at);
CREATE INDEX IF NOT EXISTS idx_deals_customer_id     ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage           ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_deleted_at      ON deals(deleted_at);
CREATE INDEX IF NOT EXISTS idx_activities_customer   ON activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal       ON activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_status     ON activities(status);
CREATE INDEX IF NOT EXISTS idx_products_user_id      ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status       ON products(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read    ON notifications(read);
