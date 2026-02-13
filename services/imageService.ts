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
