
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ShieldCheck, ImagePlus } from 'lucide-react';

const LOGO_STORAGE_KEY = 'spa_low_stress_custom_logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminMode, setShowAdminMode] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (savedLogo) setCustomLogo(savedLogo);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        setShowAdminMode(prev => !prev);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomLogo(base64);
        localStorage.setItem(LOGO_STORAGE_KEY, base64);
        // Recarregar para sincronizar com o footer se necessário, 
        // ou deixar o estado global lidar (neste caso, o storage event resolve se abrir em abas, 
        // mas para a mesma página, o ideal é o usuário ver a mudança).
        window.dispatchEvent(new Event('storage')); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGlobalReset = () => {
    if (confirm("Deseja reverter TODAS as alterações (Logo, Fotos, Vídeos, Galeria, Produtos) e voltar ao site original?")) {
      const keys = [
        LOGO_STORAGE_KEY,
        'spa_low_stress_custom_hero',
        'spa_low_stress_uploaded_images',
        'spa_low_stress_comp_before',
        'spa_low_stress_comp_after',
        'spa_low_stress_exp_video',
        'spa_low_stress_exp_poster',
        'spa_low_stress_indications_v2',
        'spa_low_stress_custom_products'
      ];
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group relative">
          {/* Logo Container */}
          <div className="relative">
            {customLogo ? (
              <img 
                src={customLogo} 
                alt="Logo" 
                className="w-10 h-10 rounded-full object-cover shadow-lg border border-purple-100"
              />
            ) : (
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                S
              </div>
            )}
            
            {showAdminMode && (
              <button 
                onClick={() => logoInputRef.current?.click()}
                className="absolute -right-2 -bottom-2 bg-white text-purple-600 p-1 rounded-full shadow-xl border border-purple-100 hover:scale-110 transition-all z-20"
                title="Trocar Logo"
              >
                <ImagePlus size={12} />
              </button>
            )}
            <input 
              type="file" 
              ref={logoInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload} 
            />
          </div>

          <div className="flex flex-col">
            <span className={`text-xl md:text-2xl font-bold tracking-tight leading-none ${isScrolled ? 'text-gray-800' : 'text-purple-900'}`}>
              Spa Low Stress
            </span>
            {showAdminMode && (
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                <ShieldCheck size={10} /> Modo Admin Ativo
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showAdminMode && (
            <button 
              onClick={handleGlobalReset}
              className="hidden md:flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider transition-colors border border-red-100 px-4 py-2 rounded-full bg-red-50/50"
            >
              <RotateCcw size={14} /> Resetar Site
            </button>
          )}
          <button className="bg-purple-600 text-white px-5 py-2 md:px-8 md:py-3 rounded-full hover:bg-purple-700 transition-all shadow-md font-bold text-sm md:text-base">
            Agendar Banho
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
