-- Structure prepared for Stripe; provider defaults to 'stripe' but allows
-- 'manual'/'cod' so the schema isn't blocked on the Stripe integration itself.
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(30) NOT NULL DEFAULT 'stripe' CHECK (provider IN ('stripe', 'manual', 'cod')),
  provider_payment_id VARCHAR(255),
  provider_customer_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'authorized', 'succeeded', 'failed', 'refunded', 'partially_refunded')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
  method VARCHAR(30),
  failure_reason TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_payment_id
  ON payments (provider_payment_id) WHERE provider_payment_id IS NOT NULL;

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
