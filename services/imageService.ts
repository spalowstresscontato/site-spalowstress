import { supabase } from './supabaseClient';
import { GalleryImage } from '../types';

const BUCKET_NAME = 'gallery-images';

/**
 * Faz upload de uma imagem e registra na tabela do banco de dados
 */
export const uploadImageToSupabase = async (file: File): Promise<GalleryImage> => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `uploads/${fileName}`;

    // 1. Upload para o Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

    // 2. Pegar URL Pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // 3. REGISTRO NA TABELA (Ajustado para suas colunas reais)
    const { data: insertedData, error: insertError } = await supabase
      .from('gallery_images')
      .insert([
        { 
          src: imageUrl, 
          file_url: imageUrl, 
          file_name: fileName,
          file_path: filePath, // Importante para o delete
          file_type: file.type,
          file_size: file.size,
          type: 'upload' 
        }
      ])
      .select()
      .single();

    if (insertError) throw new Error(`Erro na Tabela: ${insertError.message}`);

    return {
      id: insertedData.id,
      src: insertedData.src,
      type: 'upload',
    };
  } catch (error) {
    console.error('Falha total no upload:', error);
    throw error;
  }
};

/**
 * Recupera as imagens diretamente da TABELA (Muito mais rápido e organizado)
 */
export const getUploadedImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar da tabela:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao recuperar imagens:', error);
    return [];
  }
};

/**
 * Deleta a imagem do Storage E a linha da Tabela ao mesmo tempo
 */
export const deleteImageFromSupabase = async (fileUrl: string, id?: string | number): Promise<boolean> => {
  try {
    // 1. Extrair o caminho para o Storage
    const urlParts = fileUrl.split(`/${BUCKET_NAME}/`);
    const filePath = urlParts.length >= 2 ? urlParts[1] : null;

    // 2. Deletar da Tabela (Se tivermos o ID é mais seguro)
    if (id) {
      await supabase.from('gallery_images').delete().eq('id', id);
    } else {
      await supabase.from('gallery_images').delete().eq('src', fileUrl);
    }

    // 3. Deletar do Storage
    if (filePath) {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);
      
      if (deleteError) console.warn('Arquivo físico não removido:', deleteError.message);
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return false;
  }
};

// ====================================
// FUNÇÕES ESPECÍFICAS POR BUCKET
// ====================================

/**
 * Upload para bucket 'assets' (Logo e Vídeo Hero)
 * Tabela: site_settings
 */
export const uploadAssetToSupabase = async (file: File, assetType: 'logo' | 'video' | 'video_poster'): Promise<string> => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${assetType}/${fileName}`;

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

    // 2. Pegar URL Pública
    const { data: urlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    const assetUrl = urlData.publicUrl;

    // 3. Registrar na tabela site_settings
    const { error: insertError } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: assetType,
        setting_value: assetUrl,
        file_path: filePath,
        file_name: fileName,
      }, { onConflict: 'setting_key' });

    if (insertError) {
      console.warn('Aviso: Não foi possível registrar em site_settings:', insertError.message);
    }

    return assetUrl;
  } catch (error) {
    console.error(`Erro ao fazer upload do asset ${assetType}:`, error);
    throw error;
  }
};

/**
 * Recupera asset da tabela site_settings
 */
export const getAssetFromSupabase = async (assetType: 'logo' | 'video' | 'video_poster'): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', assetType)
      .single();

    if (error) return null;
    return data?.setting_value || null;
  } catch (error) {
    console.error(`Erro ao recuperar asset ${assetType}:`, error);
    return null;
  }
};

/**
 * Upload para bucket 'products'
 * Tabela: products
 */
export const uploadProductImageToSupabase = async (file: File, productId: number): Promise<string> => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `product-${productId}/${fileName}`;

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

    // 2. Pegar URL Pública
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // 3. Atualizar na tabela products
    const { error: updateError } = await supabase
      .from('products')
      .update({
        image: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (updateError) {
      console.warn('Aviso: Não foi possível atualizar a imagem em products:', updateError.message);
    }

    return imageUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem do produto:', error);
    throw error;
  }
};

/**
 * Upload para bucket 'avatars'
 * Tabela: perfis_pet
 */
export const uploadAvatarToSupabase = async (file: File, perfilId: number): Promise<string> => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `perfil-${perfilId}/${fileName}`;

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

    // 2. Pegar URL Pública
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // 3. Atualizar na tabela perfis_pet
    const { error: updateError } = await supabase
      .from('perfis_pet')
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', perfilId);

    if (updateError) {
      console.warn('Aviso: Não foi possível atualizar o avatar em perfis_pet:', updateError.message);
    }

    return avatarUrl;
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    throw error;
  }
};

/**
 * Valida e salva URL de link manual (para Hero video)
 */
export const validateAndSaveMediaUrl = async (url: string, mediaType: 'video' | 'video_poster'): Promise<string> => {
  try {
    // Validação básica
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL deve começar com http:// ou https://');
    }

    // Salvar na tabela site_settings
    const { error: updateError } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: mediaType,
        setting_value: url,
        file_path: null,
        file_name: null,
      }, { onConflict: 'setting_key' });

    if (updateError) {
      throw new Error(`Erro ao salvar: ${updateError.message}`);
    }

    return url;
  } catch (error) {
    console.error('Erro ao validar e salvar URL:', error);
    throw error;
  }
};

/**
 * Upload para imagens de comparação (antes/depois)
 * Bucket: 'assets'
 * Tabela: site_settings
 */
export const uploadComparisonImageToSupabase = async (file: File, comparisonType: 'comparison_before' | 'comparison_after'): Promise<string> => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `comparison/${fileName}`;

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

    // 2. Pegar URL Pública
    const { data: urlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // 3. Registrar na tabela site_settings
    const { error: insertError } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: comparisonType,
        setting_value: imageUrl,
        file_path: filePath,
        file_name: fileName,
      }, { onConflict: 'setting_key' });

    if (insertError) {
      console.warn('Aviso: Não foi possível registrar em site_settings:', insertError.message);
    }

    return imageUrl;
  } catch (error) {
    console.error(`Erro ao fazer upload da imagem de comparação ${comparisonType}:`, error);
    throw error;
  }
};

/**
 * Recupera imagem de comparação da tabela site_settings
 */
export const getComparisonImageFromSupabase = async (comparisonType: 'comparison_before' | 'comparison_after'): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', comparisonType)
      .single();

    if (error) return null;
    return data?.setting_value || null;
  } catch (error) {
    console.error(`Erro ao recuperar imagem de comparação ${comparisonType}:`, error);
    return null;
  }
};
