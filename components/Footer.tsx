
import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Facebook, Twitter, Mail, ImagePlus } from 'lucide-react';

const LOGO_STORAGE_KEY = 'spa_low_stress_custom_logo';

const Footer: React.FC = () => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const loadLogo = () => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    setCustomLogo(savedLogo);
  };

  useEffect(() => {
    loadLogo();
    
    // Sincronizar se o logo mudar na Navbar
    const handleStorage = () => loadLogo();
    window.addEventListener('storage', handleStorage);

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('keydown', handleKey);
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
        // Notificar outras partes (como a Navbar)
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6 relative group">
              <div className="relative">
                {customLogo ? (
                  <img 
                    src={customLogo} 
                    alt="Logo" 
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                    S
                  </div>
                )}
                
                {showAdmin && (
                  <button 
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute -right-2 -bottom-2 bg-white text-gray-900 p-1 rounded-full shadow-xl hover:scale-110 transition-all z-20"
                  >
                    <ImagePlus size={10} />
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
              <span className="text-xl font-bold">Spa Low Stress</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Pioneiras no banho de baixo estresse. Trazendo respeito, calma e bem-estar para o dia a dia do seu pet.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Serviços</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#grooming" className="hover:text-purple-400 transition-colors">Banho Low Stress</a></li>
              <li><a href="#spa-section" className="hover:text-purple-400 transition-colors">Experiência Spa</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Cromoterapia</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Consultoria Técnica</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Sobre</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Nossa História</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Formação Profissional</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Fique Conectado</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 bg-gray-800 px-4 py-3 rounded-xl border border-white/5">
                <Mail size={16} />
                <span className="text-sm">contato@spalowstress.com.br</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Spa Low Stress. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
