-- Script SQL para verificar se o banco Supabase está pronto para uploads

-- 1. Verificar tabelas existentes
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. Verificar estrutura da tabela gallery_images
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'gallery_images' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela site_settings (para assets)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings' AND table_schema = 'public') THEN
    RAISE NOTICE 'Tabela site_settings NÃO existe - criando...';
    CREATE TABLE site_settings (
      id BIGSERIAL PRIMARY KEY,
      setting_key TEXT NOT NULL UNIQUE,
      setting_value TEXT,
      file_path TEXT,
      file_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
    RAISE NOTICE 'Tabela site_settings criada com sucesso!';
  ELSE
    RAISE NOTICE 'Tabela site_settings já existe';
  END IF;
END
$$;

-- Verificar colunas da site_settings
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'site_settings' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela products (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products' AND table_schema = 'public') THEN
    RAISE NOTICE 'Tabela products existe';
  ELSE
    RAISE NOTICE 'Tabela products NÃO existe';
  END IF;
END
$$;

-- 5. Testar select nas tabelas principais
SELECT COUNT(*) as total_gallery_images FROM gallery_images;

SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('logo', 'video', 'video_poster');

-- 6. Teste de inserção em site_settings
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('test_key', 'test_value')
ON CONFLICT (setting_key) DO NOTHING;

-- Verificar se foi inserido
SELECT setting_key, setting_value FROM site_settings WHERE setting_key = 'test_key';

-- Remover teste
DELETE FROM site_settings WHERE setting_key = 'test_key';

-- 7. Teste de inserção temporária em gallery_images (será removido)
INSERT INTO gallery_images (src, file_url, file_path, file_name, file_type, file_size, type) 
VALUES ('https://test.com/test.jpg', 'https://test.com/test.jpg', 'test/path', 'test.jpg', 'image/jpeg', 1024, 'upload')
RETURNING id;

-- Remover teste gallery_images
DELETE FROM gallery_images WHERE file_path = 'test/path';

-- 8. Verificar constraints e índices
SELECT conname, contype, conrelid::regclass
FROM pg_constraint 
WHERE conrelid = 'gallery_images'::regclass;

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'gallery_images';

-- 9. Verificar se RLS está desabilitado para gallery_images
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'gallery_images';

-- 10. Status final
SELECT 'Banco pronto para uploads!' as status;
