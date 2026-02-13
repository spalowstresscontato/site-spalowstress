-- Migration de restrições, índices e triggers (seguro)
-- Este script tenta aplicar restrições quando os dados atuais permitem.
-- Rode no SQL Editor do Supabase.

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Garante extensão de UUID (se necessário)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Constraints e índices seguros

-- products.price >= 0
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_price_nonnegative'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT chk_products_price_nonnegative CHECK (price >= 0);
  END IF;
END$$;

-- bookings.status enumerado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_bookings_status'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT chk_bookings_status CHECK (status IN ('pending','confirmed','cancelled','completed'));
  END IF;
END$$;

-- orders.status enumerado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_status'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT chk_orders_status CHECK (status IN ('pending','paid','shipped','cancelled'));
  END IF;
END$$;

-- Notas sobre users.email: só aplica NOT NULL/UNIQUE se não houver nulos/duplicados
DO $$
DECLARE
  nulls int;
  dups int;
BEGIN
  SELECT count(*) INTO nulls FROM users WHERE email IS NULL OR trim(email) = '';
  SELECT count(*) INTO dups FROM (
    SELECT email FROM users WHERE email IS NOT NULL AND trim(email) <> '' GROUP BY email HAVING count(*) > 1
  ) t;

  IF nulls = 0 AND dups = 0 THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique') THEN
      ALTER TABLE users ALTER COLUMN email SET NOT NULL;
      ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
    END IF;
  ELSE
    RAISE NOTICE 'users.email tem % registros nulos/vazios e % duplicados — pulando NOT NULL/UNIQUE', nulls, dups;
  END IF;
END$$;

-- Adiciona NOT NULL para campos essenciais, com checagem prévia
DO $$
DECLARE cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM products WHERE name IS NULL OR trim(name) = '';
  IF cnt = 0 THEN
    ALTER TABLE products ALTER COLUMN name SET NOT NULL;
  ELSE
    RAISE NOTICE 'Existem % produtos sem name — pulando SET NOT NULL em products.name', cnt;
  END IF;
END$$;

DO $$
DECLARE cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM faqs WHERE question IS NULL OR trim(question) = '' OR answer IS NULL OR trim(answer) = '';
  IF cnt = 0 THEN
    ALTER TABLE faqs ALTER COLUMN question SET NOT NULL;
    ALTER TABLE faqs ALTER COLUMN answer SET NOT NULL;
  ELSE
    RAISE NOTICE 'Existem % entradas em faqs com question/answer nulos — pulando NOT NULL', cnt;
  END IF;
END$$;

-- Índices úteis (cria apenas se não existirem)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_contacts_email') THEN
    CREATE INDEX idx_contacts_email ON contacts(email);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_bookings_scheduled_at') THEN
    CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
  END IF;
END$$;

-- Triggers para updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_users') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_products') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_bookings') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_bookings BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_orders') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();';
  END IF;
END$$;

-- Exemplo de constraint para order_items.quantity >= 1
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_order_items_quantity_positive') THEN
    ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity_positive CHECK (quantity >= 1);
  END IF;
END$$;

-- Fim do migration
