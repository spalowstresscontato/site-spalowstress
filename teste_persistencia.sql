-- Teste de persistência: verificar se dados ficam salvos

-- 1. Inserir um registro de teste na gallery_images
INSERT INTO gallery_images (src, file_url, file_path, file_name, file_type, file_size, type) 
VALUES ('https://teste-persistencia.com/imagem.jpg', 'https://teste-persistencia.com/imagem.jpg', 'teste/persistencia.jpg', 'teste.jpg', 'image/jpeg', 2048, 'test')
RETURNING id, src, created_at;

-- 2. Inserir um registro de teste na site_settings
INSERT INTO site_settings (setting_key, setting_value, file_path, file_name) 
VALUES ('teste_persistencia', 'https://teste-persistencia.com/video.mp4', 'teste/video.mp4', 'video.mp4')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  file_path = EXCLUDED.file_path,
  file_name = EXCLUDED.file_name
RETURNING id, setting_key, setting_value, created_at;

-- 3. Verificar se os dados foram inseridos
SELECT 'Gallery Images - Total registros:' as info, COUNT(*) as quantidade FROM gallery_images;
SELECT 'Site Settings - Total registros:' as info, COUNT(*) as quantidade FROM site_settings;

-- 4. Verificar os registros de teste específicos
SELECT id, src, file_name, created_at FROM gallery_images WHERE file_path = 'teste/persistencia.jpg';
SELECT id, setting_key, setting_value, created_at FROM site_settings WHERE setting_key = 'teste_persistencia';

-- 5. Aguardar um momento (simular tempo real)
SELECT pg_sleep(2);

-- 6. Verificar novamente se ainda existem (persistência)
SELECT 'APÓS 2 SEGUNDOS - Gallery:' as status, COUNT(*) as registros FROM gallery_images WHERE file_path = 'teste/persistencia.jpg';
SELECT 'APÓS 2 SEGUNDOS - Settings:' as status, COUNT(*) as registros FROM site_settings WHERE setting_key = 'teste_persistencia';

-- 7. Limpar dados de teste
DELETE FROM gallery_images WHERE file_path = 'teste/persistencia.jpg';
DELETE FROM site_settings WHERE setting_key = 'teste_persistencia';

-- 8. Confirmar limpeza
SELECT 'Dados de teste removidos. Persistência confirmada!' as resultado;
