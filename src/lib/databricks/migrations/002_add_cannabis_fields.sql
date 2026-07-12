-- Run this once against your Databricks SQL Warehouse (e.g. via the Databricks SQL editor)
-- to add cannabis product fields to the existing products table. Additive only — the old
-- `artisan`/`materials` columns from 001 are left in place, unused, rather than dropped.

ALTER TABLE main.ecommerce.products ADD COLUMNS (
  brand STRING,
  strain_type STRING,
  thc_min DOUBLE,
  thc_max DOUBLE,
  thc_unit STRING,
  cbd_min DOUBLE,
  cbd_max DOUBLE,
  cbd_unit STRING,
  size STRING
);
