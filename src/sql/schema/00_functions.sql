-- Shared trigger function: keeps updated_at current on every row UPDATE.
-- Referenced by a BEFORE UPDATE trigger on every table below.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
