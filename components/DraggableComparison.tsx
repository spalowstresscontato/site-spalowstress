
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZapOff, Heart, ImagePlus, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { uploadComparisonImageToSupabase, getComparisonImageFromSupabase } from '../services/imageService';

const DraggableComparison: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [imgBefore, setImgBefore] = useState("https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800");
  const [imgAfter, setImgAfter] = useState("https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800");
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileBeforeRef = useRef<HTMLInputElement>(null);
  const fileAfterRef = useRef<HTMLInputElement>(null);

  // Carregar imagens salvas do Supabase
  useEffect(() => {
    const loadComparisonImages = async () => {
      try {
        const savedBefore = await getComparisonImageFromSupabase('comparison_before');
        const savedAfter = await getComparisonImageFromSupabase('comparison_after');

        if (savedBefore) setImgBefore(savedBefore);
        if (savedAfter) setImgAfter(savedAfter);
      } catch (err) {
        console.warn('Erro ao carregar imagens de comparação do Supabase:', err);
      }
    };

    loadComparisonImages();

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') setShowAdmin(p => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === 'before') {
      setIsUploadingBefore(true);
    } else {
      setIsUploadingAfter(true);
    }
    setUploadError(null);

    try {
      const imageUrl = await uploadComparisonImageToSupabase(file, target === 'before' ? 'comparison_before' : 'comparison_after');

      if (target === 'before') {
        setImgBefore(imageUrl);
      } else {
        setImgAfter(imageUrl);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setUploadError(errorMsg);
      console.error('Erro no upload:', err);
    } finally {
      if (target === 'before') {
        setIsUploadingBefore(false);
        if (fileBeforeRef.current) fileBeforeRef.current.value = '';
      } else {
        setIsUploadingAfter(false);
        if (fileAfterRef.current) fileAfterRef.current.value = '';
      }
    }
  };

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderPosition((x / rect.width) * 100);
    }
  }, [isDragging]);

  return (
    <section id="grooming" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-bold border border-green-100 uppercase tracking-widest">
                <ZapOff size={16} />
                <span>Pioneiras no banho de baixo estresse</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                🐾 Spa Low Stress
              </h2>
              <p className="text-xl font-bold text-purple-600 italic leading-relaxed">
                "Aqui, o banho não é um procedimento. É um processo de confiança."
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                O Spa Low Stress é um espaço especializado em banho de baixo estresse, criado para promover bem-estar físico e emocional.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-purple-700">
                <Heart size={24} className="fill-purple-200" />
                <h4 className="text-xl font-bold">🌿 O que é o Banho de Baixo Estresse?</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                É uma abordagem que respeita o tempo, o corpo e a mente do cão. No Spa Low Stress, cada atendimento é individual e sem pressa.
              </p>
            </div>
          </div>

          <div className="relative sticky top-24">
            {showAdmin && (
              <div className="absolute -top-20 left-0 right-0 flex flex-col gap-2 z-30 animate-fade-in">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => fileBeforeRef.current?.click()}
                    disabled={isUploadingBefore}
                    className="bg-white text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isUploadingBefore ? <Loader2 className="animate-spin" size={12} /> : <ImagePlus size={14} />}
                    Foto Estressado
                  </button>
                  <button
                    onClick={() => fileAfterRef.current?.click()}
                    disabled={isUploadingAfter}
                    className="bg-white text-purple-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-purple-100 flex items-center gap-1 hover:bg-purple-50 disabled:opacity-50"
                  >
                    {isUploadingAfter ? <Loader2 className="animate-spin" size={12} /> : <ImagePlus size={14} />}
                    Foto Relaxado
                  </button>
                </div>

                {uploadError && (
                  <div className="flex items-center justify-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 text-xs mx-auto max-w-xs">
                    <AlertCircle size={14} />
                    {uploadError}
                  </div>
                )}

                <input type="file" ref={fileBeforeRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'before')} />
                <input type="file" ref={fileAfterRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'after')} />
              </div>
            )}
            <div className="relative select-none group" ref={containerRef}
                 onMouseMove={(e) => isDragging && handleMove(e.clientX)}
                 onMouseDown={() => setIsDragging(true)}
                 onMouseUp={() => setIsDragging(false)}
                 onMouseLeave={() => setIsDragging(false)}
                 onTouchMove={(e) => isDragging && handleMove(e.touches[0].clientX)}
                 onTouchStart={() => setIsDragging(true)}
                 onTouchEnd={() => setIsDragging(false)}
            >
              <div className="relative w-[90%] max-w-xl aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl cursor-ew-resize border-8 border-white mx-auto">
                <img src={imgAfter} alt="Depois" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-10">RELAXADO ✨</div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${sliderPosition}%` }}>
                  <img src={imgBefore} alt="Antes" className="absolute inset-0 w-full max-w-none h-full object-cover grayscale" style={{ width: containerRef.current?.offsetWidth || '100%' }} />
                  <div className="absolute top-6 left-6 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-10">ESTRESSADO ⚡</div>
                </div>
                
                {/* Linha e Ícone do Slider Corrigido (Setas em vez de Barras de Vídeo) */}
                <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-2xl" style={{ left: `${sliderPosition}%` }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-purple-100">
                    <div className="flex items-center text-purple-600">
                      <ChevronLeft size={16} />
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DraggableComparison;
