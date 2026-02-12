import React, { useState, useRef, useEffect } from 'react';
import { GALLERY_IMAGES } from '../constants';
import { GalleryImage } from '../types';
import { ImagePlus, Instagram, CameraOff, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'spa_low_stress_uploaded_images';

const InfiniteGallery: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [showAdminControls, setShowAdminControls] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const instagramUrl = "https://www.instagram.com/spalowstress?igsh=MXZ6ZHpubnB6N2k2Mg==";

  // 1. Carregar imagens salvas ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUploadedImages(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar galeria local:", e);
      }
    }
  }, []);

  // 2. Salvar sempre que a lista de uploads mudar
  useEffect(() => {
    if (uploadedImages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedImages));
    }
  }, [uploadedImages]);

  // Atalho secreto: Ctrl + Shift + ArrowUp
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        setShowAdminControls(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Fix: Explicitly type 'file' as 'File' to avoid 'unknown' type error when passing it to FileReader methods
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: GalleryImage = {
            id: Date.now() + Math.random(),
            src: reader.result as string,
            type: 'upload',
          };
          setUploadedImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const clearGallery = () => {
    if (confirm("Tem certeza que deseja apagar todas as fotos enviadas? Isso não afetará as fotos fixas do sistema.")) {
      setUploadedImages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const allImages = [...GALLERY_IMAGES, ...uploadedImages];
  const displayImages = allImages.length > 0 
    ? [...allImages, ...allImages, ...allImages] 
    : [];

  return (
    <section id="gallery" className="py-20 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6 flex flex-col items-center mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Amigos Peludos Felizes 📸</h2>
          <p className="text-gray-500 italic tracking-wide">
            {allImages.length > 0 
              ? "Confira os momentos reais no nosso Instagram @spalowstress" 
              : "Momentos reais de cuidado e bem-estar no @spalowstress"}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 items-center min-h-[50px]">
          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all text-sm uppercase tracking-tighter"
          >
            <Instagram size={18} /> @spalowstress
          </a>
          
          {showAdminControls && (
            <div className="animate-fade-in flex flex-wrap justify-center gap-3 items-center">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-100 transition-all text-sm border border-green-200 shadow-sm"
              >
                <ImagePlus size={18} /> Adicionar Foto
              </button>
              
              {uploadedImages.length > 0 && (
                <button 
                  onClick={clearGallery}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold hover:bg-red-100 transition-all text-sm border border-red-200 shadow-sm"
                >
                  <Trash2 size={18} /> Limpar Galeria
                </button>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*" 
                multiple
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full min-h-[300px] flex items-center justify-center">
        {displayImages.length > 0 ? (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max animate-scroll hover:pause-scroll">
              {displayImages.map((image, index) => (
                <a
                  key={`${image.id}-${index}`}
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-72 h-72 mx-4 relative group overflow-hidden rounded-[3rem] shadow-xl cursor-pointer transform transition-all duration-500 hover:scale-105 border-4 border-white"
                >
                  <img
                    src={image.src}
                    alt="Momento Spa Low Stress"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/70 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4">
                      <span className="text-white font-bold tracking-widest block text-xl mb-3">
                        @spalowstress
                      </span>
                      <div className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white text-[10px] font-bold uppercase border border-white/30">
                        Ver no Instagram
                      </div>
                    </div>
                  </div>
                  {image.type === 'upload' && (
                    <div className="absolute top-6 left-6 bg-green-500 text-white text-[9px] px-3 py-1 rounded-full font-bold uppercase shadow-lg tracking-widest">
                      Upload Salvo
                    </div>
                  )}
                </a>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-6 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 max-w-2xl w-full mx-6 group transition-all duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6 text-gray-400">
              <CameraOff size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aguardando Fotos</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Esta galeria exibirá as fotos do Instagram. 
              {showAdminControls ? " Use o botão de Modo Admin acima para subir fotos que ficarão salvas neste navegador." : " Nenhuma foto cadastrada no momento."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InfiniteGallery;