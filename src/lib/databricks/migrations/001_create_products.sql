-- Run this once against your Databricks SQL Warehouse (e.g. via the Databricks SQL editor)
-- to create the products table used by the admin panel.

CREATE CATALOG IF NOT EXISTS main;
CREATE SCHEMA IF NOT EXISTS main.ecommerce;

CREATE TABLE IF NOT EXISTS main.ecommerce.products (
  id STRING NOT NULL,
  slug STRING NOT NULL,
  name STRING NOT NULL,
  category STRING NOT NULL,
  price DOUBLE NOT NULL,
  compare_at_price DOUBLE,
  description STRING,
  long_description STRING,
  images ARRAY<STRING>,
  artisan STRING,
  rating DOUBLE,
  review_count INT,
  tags ARRAY<STRING>,
  materials ARRAY<STRING>,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INT NOT NULL DEFAULT 0,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_seasonal BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
)
USING DELTA;
