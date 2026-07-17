CREATE TABLE IF NOT EXISTS cart (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- user_id already indexed as the leading column of the UNIQUE constraint above.
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart (product_id);

CREATE TRIGGER trg_cart_updated_at
BEFORE UPDATE ON cart
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
