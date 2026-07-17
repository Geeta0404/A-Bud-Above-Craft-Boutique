CREATE TABLE IF NOT EXISTS order_coupons (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  -- SET NULL (not CASCADE/RESTRICT): the applied-discount record on the order
  -- must survive coupon deletion, so coupon_code/discount_amount are snapshots.
  coupon_id BIGINT REFERENCES coupons(id) ON DELETE SET NULL,
  coupon_code VARCHAR(50) NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL CHECK (discount_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, coupon_id)
);

-- order_id already indexed as the leading column of the UNIQUE constraint above.
CREATE INDEX IF NOT EXISTS idx_order_coupons_coupon_id ON order_coupons (coupon_id);

CREATE TRIGGER trg_order_coupons_updated_at
BEFORE UPDATE ON order_coupons
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
