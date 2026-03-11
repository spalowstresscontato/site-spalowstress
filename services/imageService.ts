import { supabase } from './supabaseClient';
import { GalleryImage } from '../types';

const BUCKET_NAME = 'gallery-images';

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9.]/g, '_');

/* =========================================
   UPLOAD PRODUTO (STORAGE + TABELA)
   ========================================= */
export const uploadProductImageToSupabase = async (file: File, productId: number): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${sanitizeFileName(file.name)}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    const { error: dbError } = await supabase
      .from('product_images')
      .upsert({ product_id: productId, url: imageUrl, is_primary: true }, { onConflict: 'product_id' });

    if (dbError) throw dbError;
    return imageUrl;
  } catch (error) {
    console.error('Erro no upload de produto:', error);
    throw error;
  }
};

/* =========================================
   ASSETS (LOGO / VIDEO / HERO)
   ========================================= */
export const uploadAssetToSupabase = async (file: File, assetType: string): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const filePath = `${assetType}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
    const url = data.publicUrl;

    await supabase.from('site_settings').upsert(
      { setting_key: assetType, setting_value: url },
      { onConflict: 'setting_key' }
    );

    return url;
  } catch (error) {
    console.error('Erro no upload de asset:', error);
    throw error;
  }
};

/* =========================================
   COMPARAÇÃO (BEFORE/AFTER)
   ========================================= */
export const uploadComparisonImageToSupabase = async (file: File, side: 'before' | 'after'): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${side}-${sanitizeFileName(file.name)}`;
    const filePath = `comparisons/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
    const url = data.publicUrl;

    await supabase.from('site_settings').upsert(
      { setting_key: `comparison_${side}`, setting_value: url },
      { onConflict: 'setting_key' }
    );

    return url;
  } catch (error) {
    console.error('Erro no upload de comparação:', error);
    throw error;
  }
};

export const getComparisonImageFromSupabase = async (side: 'before' | 'after'): Promise<string | null> => {
  try {
    const { data, error } = await supabase.from('site_settings').select('setting_value').eq('setting_key', `comparison_${side}`).maybeSingle();
    return data?.setting_value || null;
  } catch { return null; }
};

/* =========================================
   AVATAR / PERFIL
   ========================================= */
export const uploadAvatarToSupabase = async (file: File, perfilId: number): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const url = data.publicUrl;

    await supabase.from('perfis_pet').update({ avatar_url: url }).eq('id', perfilId);
    return url;
  } catch (error) {
    console.error('Erro no upload de avatar:', error);
    throw error;
  }
};

/* =========================================
   GALERIA E UTILITÁRIOS
   ========================================= */
export const uploadImageToSupabase = async (file: File): Promise<GalleryImage> => {
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const filePath = `uploads/${fileName}`;
  await supabase.storage.from(BUCKET_NAME).upload(filePath, file);
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  
  const { data: inserted, error } = await supabase.from('gallery_images').insert({
    src: data.publicUrl, file_url: data.publicUrl, file_name: fileName, file_path: filePath, type: 'upload'
  }).select().single();
  
  if (error) throw error;
  return { id: inserted.id, src: inserted.src, type: 'upload' };
};

export const getUploadedImages = async (): Promise<GalleryImage[]> => {
  const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const getAssetFromSupabase = async (assetType: string) => {
  const { data } = await supabase.from('site_settings').select('setting_value').eq('setting_key', assetType).maybeSingle();
  return data?.setting_value || null;
};

export const validateAndSaveMediaUrl = async (url: string, assetType: string) => {
  const { error } = await supabase.from('site_settings').upsert({ setting_key: assetType, setting_value: url }, { onConflict: 'setting_key' });
  return error ? null : url;
};

export const deleteImageFromSupabase = async (fileUrl: string, id?: string | number) => {
  const urlParts = fileUrl.split(`/${BUCKET_NAME}/`);
  const filePath = urlParts.length >= 2 ? urlParts[1] : null;
  if (id) await supabase.from('gallery_images').delete().eq('id', id);
  if (filePath) await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  return true;
};