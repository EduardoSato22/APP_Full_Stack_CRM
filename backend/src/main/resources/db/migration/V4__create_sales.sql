CREATE TABLE IF NOT EXISTS sales (
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT        NOT NULL REFERENCES customers(id),
    created_by  BIGINT        NOT NULL REFERENCES users(id),
    status      VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    total       DECIMAL(15,2) NOT NULL DEFAULT 0,
    sale_date   TIMESTAMP     NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale_items (
    id          BIGSERIAL PRIMARY KEY,
    sale_id     BIGINT        NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id  BIGINT        NOT NULL REFERENCES products(id),
    quantity    INTEGER       NOT NULL DEFAULT 1,
    unit_price  DECIMAL(15,2) NOT NULL,
    subtotal    DECIMAL(15,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_customer    ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_status      ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_date        ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale   ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id);
