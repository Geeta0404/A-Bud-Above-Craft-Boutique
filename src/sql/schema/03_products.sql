CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  -- RESTRICT (not CASCADE): a category with active products must be reassigned
  -- or emptied first, so an admin can't accidentally wipe out a product catalog.
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id BIGINT REFERENCES brands(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  sku VARCHAR(64) UNIQUE,
  description TEXT,
  long_description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  -- Cannabis retail attributes shown on the storefront's product page.
  strain_type VARCHAR(20) CHECK (strain_type IS NULL OR strain_type IN ('Sativa', 'Indica', 'Hybrid', 'Blend')),
  thc_min NUMERIC(6, 2),
  thc_max NUMERIC(6, 2),
  thc_unit VARCHAR(5) CHECK (thc_unit IS NULL OR thc_unit IN ('%', 'mg')),
  cbd_min NUMERIC(6, 2),
  cbd_max NUMERIC(6, 2),
  cbd_unit VARCHAR(5) CHECK (cbd_unit IS NULL OR cbd_unit IN ('%', 'mg')),
  size VARCHAR(50),
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_seasonal BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- slug and sku already indexed via their UNIQUE constraints above.
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products (is_best_seller) WHERE is_best_seller = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products (is_new) WHERE is_new = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
