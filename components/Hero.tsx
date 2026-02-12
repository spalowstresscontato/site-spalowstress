
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Heart, ImagePlus } from 'lucide-react';
import { HERO_IMAGE } from '../constants';

const HERO_STORAGE_KEY = 'spa_low_stress_custom_hero';

const Hero: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(HERO_STORAGE_KEY);
    if (saved) setCustomImage(saved);

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomImage(base64);
        localStorage.setItem(HERO_STORAGE_KEY, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentHeroImage = customImage || HERO_IMAGE;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 left-[-100px] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

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
            <div className="absolute -top-12 left-0 right-0 flex justify-center z-30 animate-fade-in">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-full font-bold shadow-2xl hover:bg-purple-50 transition-all text-xs border-2 border-purple-100"
              >
                <ImagePlus size={16} /> Trocar Foto Principal
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleUpload} 
              />
            </div>
          )}

          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 border-4 border-white">
            <img
              src={currentHeroImage}
              alt="Pet Relaxado"
              className="w-full h-auto object-cover"
            />
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
