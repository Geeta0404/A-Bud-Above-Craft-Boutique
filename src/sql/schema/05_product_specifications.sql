CREATE TABLE IF NOT EXISTS product_specifications (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key VARCHAR(100) NOT NULL,
  spec_value VARCHAR(255) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, spec_key)
);

-- product_id already indexed as the leading column of the UNIQUE constraint above.

CREATE TRIGGER trg_product_specifications_updated_at
BEFORE UPDATE ON product_specifications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
