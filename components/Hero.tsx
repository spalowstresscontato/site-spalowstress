
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Heart, ImagePlus, Loader2, AlertCircle } from 'lucide-react';
import { HERO_IMAGE } from '../constants';
import { uploadAssetToSupabase, getAssetFromSupabase, validateAndSaveMediaUrl } from '../services/imageService';

const Hero: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [heroImage, setHeroImage] = useState<string>(HERO_IMAGE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Carregar imagem e vídeo salvos no Supabase
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const savedImage = await getAssetFromSupabase('video_poster');
        if (savedImage) {
          setHeroImage(savedImage);
        }
        const savedVideo = await getAssetFromSupabase('video');
        if (savedVideo) {
          setVideoUrl(savedVideo);
        }
      } catch (err) {
        console.warn('Erro ao carregar assets do Supabase, usando padrão:', err);
      }
    };
    
    loadAssets();

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadAssetToSupabase(file, 'video_poster');
      setHeroImage(imageUrl);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(errorMsg);
      console.error('Erro no upload:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadedVideoUrl = await uploadAssetToSupabase(file, 'video');
      setVideoUrl(uploadedVideoUrl);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer upload do vídeo';
      setError(errorMsg);
      console.error('Erro no upload do vídeo:', err);
    } finally {
      setIsUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleLinkSave = async () => {
    if (!linkInput.trim()) {
      setError('Digite uma URL válida');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const savedUrl = await validateAndSaveMediaUrl(linkInput, 'video_poster');
      setHeroImage(savedUrl);
      setLinkInput('');
      setShowLinkInput(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao salvar link';
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-purple-600 font-bold text-sm mb-2 border border-purple-100 animate-bounce-slow">
            <Sparkles size={16} />
            <span>Pioneiras no Banho de Baixo Estresse</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            O Cuidado do <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Futuro Chegou! 🐾
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Muito mais que um banho, um processo de confiança. Oferecemos uma experiênia exclusiva, consciente e respeitosa no <strong>Spa Low Stress</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-8 py-4 bg-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Agendar Experiência <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-bold hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm flex items-center gap-2">
              <Heart size={18} className="text-pink-500" /> Conheça o Método
            </button>
          </div>
        </div>

        <div className="relative group">
          {/* Botão de Admin para troca de imagem */}
          {showAdmin && (
            <div className="absolute -top-16 left-0 right-0 flex flex-col gap-2 z-30 animate-fade-in">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-full font-bold shadow-2xl hover:bg-purple-50 transition-all text-xs border-2 border-purple-100 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />}
                Trocar Foto Principal
              </button>
              
              <button 
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 bg-white text-green-600 px-5 py-2.5 rounded-full font-bold shadow-2xl hover:bg-green-50 transition-all text-xs border-2 border-green-100 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="animate-spin" size={16} /> : '🎥'}
                Trocar Vídeo
              </button>
              
              <button 
                onClick={() => setShowLinkInput(!showLinkInput)}
                disabled={isUploading}
                className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-full font-bold shadow-2xl hover:bg-blue-50 transition-all text-xs border-2 border-blue-100 disabled:opacity-50"
              >
                🔗 Colar Link
              </button>

              {showLinkInput && (
                <div className="flex gap-2 bg-white p-3 rounded-lg shadow-lg border-2 border-blue-100">
                  <input 
                    type="url"
                    placeholder="https://..."
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button 
                    onClick={handleLinkSave}
                    disabled={isUploading}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    Salvar
                  </button>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 text-xs">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload} 
              />
              <input 
                type="file" 
                ref={videoInputRef} 
                className="hidden" 
                accept="video/*"
                onChange={handleVideoUpload} 
              />
            </div>
          )}

          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 border-4 border-white w-96 h-96 mx-auto">
            {videoUrl ? (
              <video
                src={videoUrl}
                poster={heroImage}
                controls
                className="w-full h-full object-cover"
                preload="metadata"
              />
            ) : (
              <img
                src={heroImage}
                alt="Pet Relaxado"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl z-20 animate-bounce-slow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600 font-bold">
                🌿
              </div>
              <div>
                <p className="text-sm text-gray-500">Bem-estar emocional</p>
                <p className="font-bold text-gray-900">Spa Low Stress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
