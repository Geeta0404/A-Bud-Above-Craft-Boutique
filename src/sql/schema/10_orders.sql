CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(32) NOT NULL UNIQUE,
  -- SET NULL (not CASCADE): an order is a financial record that must survive
  -- account deletion, so the customer snapshot fields below carry the details.
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  shipping_address_id BIGINT REFERENCES addresses(id) ON DELETE SET NULL,
  billing_address_id BIGINT REFERENCES addresses(id) ON DELETE SET NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
  tax_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (tax_total >= 0),
  shipping_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_total >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- order_number already indexed via the UNIQUE constraint above.
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
