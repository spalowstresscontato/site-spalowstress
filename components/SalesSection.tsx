import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../constants';
import { Star, Heart, ImagePlus, Loader2, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { uploadProductImageToSupabase } from '../services/imageService';
import { supabase } from '../services/supabaseClient';

const SalesSection: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [productImages, setProductImages] = useState<Record<number, string>>({});
  const [uploadingProducts, setUploadingProducts] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const WHATSAPP_URL = "https://wa.me/5511991431367?text=Oi%20Quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20servi%C3%A7os%20e%20cuidados%20do%20SPA%20LOW%20STRESS%20%F0%9F%90%BE";

  useEffect(() => {
    const loadImagesFromDatabase = async () => {
      try {
        const initialImages: Record<number, string> = {};
        PRODUCTS.forEach(p => initialImages[p.id] = p.image);

        const { data, error: dbError } = await supabase
          .from('product_images')
          .select('product_id, url')
          .eq('is_primary', true);

        if (dbError) throw dbError;

        if (data) {
          const updatedImages: Record<number, string> = {};
          data.forEach((item: any) => {
            updatedImages[item.product_id] = item.url;
          });
          setProductImages(prev => ({ ...prev, ...updatedImages }));
        }
      } catch (err) {
        console.warn('Erro ao carregar imagens:', err);
      }
    };

    loadImagesFromDatabase();

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') setShowAdmin(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProducts(prev => new Set(prev).add(productId));
    setError(null);

    try {
      const imageUrl = await uploadProductImageToSupabase(file, productId);
      setProductImages(prev => ({
        ...prev,
        [productId]: imageUrl
      }));
    } catch (err: any) {
      setError(err.message || 'Erro no upload');
    } finally {
      setUploadingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      if (fileInputs.current[productId]) fileInputs.current[productId]!.value = '';
    }
  };

  return (
    <section id="shop" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center mb-4">
            <Heart className="text-purple-500 fill-purple-200 animate-pulse" size={32} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossas Recomendações</h2>
          <p className="text-gray-600">Produtos selecionados para manter o bem-estar do seu pet em casa.</p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-gradient-to-r from-[#C9A227] via-[#FFD700] to-[#B8962E] p-[3px] rounded-2xl">
              <div className="bg-white rounded-2xl shadow-lg transition-all duration-300 group flex flex-col overflow-hidden h-[450px]">
                
                {/* MOLDURA DE IMAGEM */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={productImages[product.id] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {showAdmin && (
                    <button
                      onClick={() => fileInputs.current[product.id]?.click()}
                      disabled={uploadingProducts.has(product.id)}
                      className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-lg text-purple-600 z-20 hover:bg-white transition-colors"
                    >
                      {uploadingProducts.has(product.id) ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                      <input
                        type="file"
                        ref={el => fileInputs.current[product.id] = el}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, product.id)}
                      />
                    </button>
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="text-xs text-purple-500 font-semibold mb-2 uppercase tracking-wider">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* BOTÃO SAIBA MAIS (ESTILO WHATSAPP) */}
                  <div className="mt-4">
                    <a 
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 shadow-md hover:shadow-purple-200"
                    >
                      <span>Saiba Mais</span>
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalesSection;
