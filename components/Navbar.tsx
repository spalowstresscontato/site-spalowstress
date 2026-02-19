
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ShieldCheck, ImagePlus, Loader2, AlertCircle } from 'lucide-react';
import { uploadAssetToSupabase, getAssetFromSupabase, validateAndSaveMediaUrl } from '../services/imageService';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminMode, setShowAdminMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const savedLogo = await getAssetFromSupabase('logo');
        if (savedLogo) {
          setLogoUrl(savedLogo);
        }
      } catch (err) {
        console.warn('Logo padrão será usado:', err);
      }
    };

    loadLogo();

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const logoUrl = await uploadAssetToSupabase(file, 'logo');
      setLogoUrl(logoUrl);
      window.dispatchEvent(new Event('storage')); // Para sincronização
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer upload do logo';
      setError(errorMsg);
      console.error('Erro:', err);
    } finally {
      setIsUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
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
      const savedUrl = await validateAndSaveMediaUrl(linkInput, 'logo');
      setLogoUrl(savedUrl);
      setLinkInput('');
      setShowLinkInput(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao salvar link';
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGlobalReset = async () => {
    if (confirm("Deseja reverter TODAS as alterações (Logo, Fotos, Vídeos, Galeria, Produtos) e voltar ao site original?")) {
      // Limpar localStorage
      const keys = [
        'spa_low_stress_custom_logo',
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
      
      // Limpar Supabase seria necessário executar funções específicas
      // Por enquanto, apenas limpamos localStorage
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
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-10 h-10 rounded-full object-cover shadow-lg border border-purple-100"
              />
            ) : (
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                S
              </div>
            )}
            
            {showAdminMode && (
              <div className="absolute -right-2 -bottom-2 flex gap-1">
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white text-purple-600 p-1 rounded-full shadow-xl border border-purple-100 hover:scale-110 transition-all z-20 disabled:opacity-50"
                  title="Fazer upload de arquivo"
                >
                  <ImagePlus size={12} />
                </button>
                
                <button 
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  disabled={isUploading}
                  className="bg-white text-blue-600 p-1 rounded-full shadow-xl border border-blue-100 hover:scale-110 transition-all z-20 disabled:opacity-50"
                  title="Colar link"
                >
                  🔗
                </button>
              </div>
            )}

            {showLinkInput && (
              <div className="absolute top-12 right-0 bg-white p-2 rounded-lg shadow-lg border-2 border-blue-100 z-30 w-48">
                <input 
                  type="url"
                  placeholder="https://..."
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <button 
                  onClick={handleLinkSave}
                  disabled={isUploading}
                  className="w-full mt-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            )}

            {error && (
              <div className="absolute top-12 right-0 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded text-xs whitespace-nowrap flex items-center gap-1 z-30">
                <AlertCircle size={12} /> {error}
              </div>
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
          <button className="bg-purple-600 text-white px-5 py-2 md:px-8 md:py-3 rounded-full hover:bg-purple-700 transition-all shadow-md font-bold text-sm md:text-base flex items-center gap-2">
            {isUploading && <Loader2 size={16} className="animate-spin" />}
            Agendar Banho
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
