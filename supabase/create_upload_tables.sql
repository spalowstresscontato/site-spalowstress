-- ====================================
-- TABELAS PARA O SISTEMA DE UPLOADS
-- ====================================

-- 1. TABELA: site_settings (Logo, Vídeo Hero, Poster)
-- Bucket: 'assets'
DROP TABLE IF EXISTS public.site_settings CASCADE;
CREATE TABLE public.site_settings (
  id BIGSERIAL PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE, -- 'logo', 'video', 'video_poster'
      setting_value TEXT NOT NULL, -- URL da imagem/vídeo
        file_path TEXT, -- Caminho no storage (NULL se for link manual)
          file_name TEXT, -- Nome do arquivo
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );

              CREATE INDEX idx_site_settings_key ON public.site_settings(setting_key);

              CREATE TRIGGER trigger_site_settings_updated_at
              BEFORE UPDATE ON public.site_settings
              FOR EACH ROW
              EXECUTE FUNCTION public.trigger_set_timestamp();

              -- 2. TABELA: products (Imagens de Produtos)
              -- Bucket: 'products'
              -- Adiciona coluna 'image' se não existir
              ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
              ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

              -- Garantir que não há duplicatas de nome
              ALTER TABLE public.products ADD CONSTRAINT products_name_unique UNIQUE (name);

              CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
              CREATE INDEX IF NOT EXISTS idx_products_updated_at ON public.products(updated_at DESC);

              -- Trigger para atualizar updated_at
              DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
              CREATE TRIGGER trigger_products_updated_at
              BEFORE UPDATE ON public.products
              FOR EACH ROW
              EXECUTE FUNCTION public.trigger_set_timestamp();

              -- 3. TABELA: perfis_pet (Avatares dos Perfis - Sensíveis, Sêniores, Aprendizes)
              -- Bucket: 'avatars'
              DROP TABLE IF EXISTS public.perfis_pet CASCADE;
              CREATE TABLE public.perfis_pet (
                id BIGSERIAL PRIMARY KEY,
                  title TEXT NOT NULL, -- "Os Sensíveis", "Os Sêniores", "Os Aprendizes"
                    subtitle TEXT NOT NULL, -- "Medo ou Ansiedade", etc
                      description TEXT, -- Descrição completa
                        avatar_url TEXT, -- URL do avatar/imagem
                          file_path TEXT, -- Caminho no storage
                            file_name TEXT, -- Nome do arquivo
                              display_order INT DEFAULT 1,
                                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                  );

                                  CREATE INDEX idx_perfis_pet_display_order ON public.perfis_pet(display_order);
                                  CREATE INDEX idx_perfis_pet_created_at ON public.perfis_pet(created_at DESC);

                                  CREATE TRIGGER trigger_perfis_pet_updated_at
                                  BEFORE UPDATE ON public.perfis_pet
                                  FOR EACH ROW
                                  EXECUTE FUNCTION public.trigger_set_timestamp();

                                  -- ====================================
                                  -- INSERIR DADOS INICIAIS
                                  -- ====================================

                                  -- Perfis padrão (sem avatares)
                                  INSERT INTO public.perfis_pet (title, subtitle, description, display_order) VALUES
                                    ('Os Sensíveis', 'Medo ou Ansiedade', 'Transformamos o medo em confiança.', 1),
                                      ('Os Sêniores', 'Idosos ou Limitados', 'Manejo adaptado para dores articulares.', 2),
                                        ('Os Aprendizes', 'Filhotes em Adaptação', 'Garantimos um primeiro banho feliz.', 3)
                                        ON CONFLICT DO NOTHING;

                                        -- ====================================
                                        -- CONFIGURAR BUCKETS NO STORAGE
                                        -- ====================================
                                        -- Execute estes comandos manualmente no Supabase Storage:
                                        -- 1. Criar bucket: assets (público)
                                        -- 2. Criar bucket: products (público)
                                        -- 3. Criar bucket: avatars (público)
                                        
                                        -- 4. TABELA: gallery_images (Imagens enviadas pelo Admin/Usuário)
                                        -- Bucket: 'gallery-images'
                                        -- Estrutura compatível com `services/imageService.uploadImageToSupabase`
                                        DROP TABLE IF EXISTS public.gallery_images CASCADE;
                                        CREATE TABLE public.gallery_images (
                                          id BIGSERIAL PRIMARY KEY,
                                          src TEXT NOT NULL UNIQUE,
                                          file_url TEXT NOT NULL UNIQUE,
                                          file_path TEXT NOT NULL UNIQUE,
                                          file_name TEXT NOT NULL,
                                          file_type TEXT,
                                          file_size BIGINT,
                                          type TEXT DEFAULT 'upload', -- 'upload' | 'url' | outros
                                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                        );

                                        -- Índices úteis
                                        CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images(created_at DESC);
                                        CREATE INDEX IF NOT EXISTS idx_gallery_images_src ON public.gallery_images(src);

                                        -- Desabilitar RLS (galeria pública)
                                        ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;

                                        -- Criar trigger para atualizar updated_at usando função já fornecida em `constraints.sql`
                                        DROP TRIGGER IF EXISTS trigger_gallery_images_updated_at ON public.gallery_images;
                                        CREATE TRIGGER trigger_gallery_images_updated_at
                                        BEFORE UPDATE ON public.gallery_images
                                        FOR EACH ROW
                                        EXECUTE FUNCTION public.trigger_set_timestamp();

                                        -- Observação: Caso a função `public.trigger_set_timestamp()` não exista, rode `supabase/constraints.sql` primeiro.
                                        