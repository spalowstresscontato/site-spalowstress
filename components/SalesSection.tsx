
import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../constants';
import { Star, ShoppingCart, Heart, ImagePlus, Loader2, AlertCircle } from 'lucide-react';
import { uploadProductImageToSupabase } from '../services/imageService';

const SalesSection: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [productImages, setProductImages] = useState<Record<number, string>>({});
  const [uploadingProducts, setUploadingProducts] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    // Inicializar com imagens padrão dos produtos
    const initialImages: Record<number, string> = {};
    PRODUCTS.forEach(product => {
      initialImages[product.id] = product.image;
    });
    setProductImages(initialImages);

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') setShowAdmin(p => !p);
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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(errorMsg);
      console.error('Erro:', err);
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-purple-50/50 rounded-[100%] blur-3xl -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center mb-4">
             <Heart className="text-purple-500 fill-purple-200 animate-pulse" size={32} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Escolhas Incríveis</h2>
          <p className="text-gray-600">
            Petiscos, brinquedos e cantinhos aconchegantes. Escolhemos a dedo os itens mais divertidos e duráveis.
          </p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 group flex flex-col overflow-hidden border border-gray-100"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={productImages[product.id] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {showAdmin && (
                  <button 
                    onClick={() => fileInputs.current[product.id]?.click()}
                    disabled={uploadingProducts.has(product.id)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg text-purple-600 hover:scale-110 transition-all z-20 border border-purple-100 disabled:opacity-50"
                  >
                    {uploadingProducts.has(product.id) ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ImagePlus size={18} />
                    )}
                    <input 
                      type="file" 
                      ref={el => fileInputs.current[product.id] = el} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleUpload(e, product.id)} 
                    />
                  </button>
                )}

                {product.badge && (
                  <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow">
                    {product.badge}
                  </div>
                )}
                <button className="absolute bottom-4 right-4 bg-white text-purple-600 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-purple-600 hover:text-white">
                  <ShoppingCart size={20} />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs text-purple-500 font-semibold mb-2 uppercase tracking-wide">
                  {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-yellow-400 text-yellow-400" />)}
                    <span className="text-xs text-gray-400 ml-1">(40+ Avaliações)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <button className="px-10 py-4 bg-transparent border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest text-sm">
                Explorar Todas as Maravilhas
            </button>
        </div>
      </div>
    </section>
  );
};

export default SalesSection;
