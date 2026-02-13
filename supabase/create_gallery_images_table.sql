-- Criação definitiva da tabela para armazenar metadados de imagens da galeria
-- SEM Row Level Security (galeria pública)

-- PASSO 1: Remover tabela se existir
DROP TABLE IF EXISTS public.gallery_images CASCADE;

-- PASSO 2: Criar a tabela
CREATE TABLE public.gallery_images (
  id BIGSERIAL PRIMARY KEY,
  file_path TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PASSO 3: Criar índices para melhor performance
CREATE INDEX idx_gallery_images_created_at ON public.gallery_images(created_at DESC);
CREATE INDEX idx_gallery_images_file_url ON public.gallery_images(file_url);

-- PASSO 4: Garantir que RLS está DESABILITADO
ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;

-- PASSO 5: Criar função para atualizar updated_at (se não existir)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASSO 6: Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER trigger_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- PRONTO! Tabela criada sem RLS e pronta para uso


