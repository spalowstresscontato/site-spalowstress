
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Star, Target, ArrowRight, ImagePlus } from 'lucide-react';

const STORAGE_KEY = 'spa_low_stress_indications_v2';

const SpaIndications: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [profileImages, setProfileImages] = useState([
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=400"
  ]);

  const fileInputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProfileImages(JSON.parse(saved));

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') setShowAdmin(p => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...profileImages];
        newImages[index] = reader.result as string;
        setProfileImages(newImages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const profiles = [
    { title: "Os Sensíveis", subtitle: "Medo ou Ansiedade", desc: "Transformamos o medo em confiança." },
    { title: "Os Sêniores", subtitle: "Idosos ou Limitados", desc: "Manejo adaptado para dores articulares." },
    { title: "Os Aprendizes", subtitle: "Filhotes em Adaptação", desc: "Garantimos um primeiro banho feliz." }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-stretch">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 text-purple-600 font-bold tracking-widest text-xs uppercase">
              <Star size={16} className="fill-purple-600" /><span>O Diferencial</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Por que somos escolhidas por quem <span className="text-purple-600">ama de verdade?</span></h2>
            <div className="grid gap-4 py-6">
              {["Pioneiras em banho de baixo estresse", "Formação de novos profissionais", "Atendimento 100% individualizado", "Ambiente terapêutico e seguro"].map((text, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <CheckCircle2 className="text-purple-600 group-hover:text-white" size={20} />
                  </div>
                  <span className="text-lg font-semibold text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">
            {profiles.map((profile, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-[2.5rem] shadow-xl md:h-full min-h-[500px]`}>
                <img src={profileImages[i]} alt={profile.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <p className="text-purple-400 font-bold text-xs uppercase mb-2">{profile.subtitle}</p>
                  <h4 className="text-2xl font-bold mb-3">{profile.title}</h4>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">{profile.desc}</p>
                </div>
                {showAdmin && (
                  <button onClick={() => fileInputs[i].current?.click()} className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg text-purple-600 hover:scale-110 transition-all">
                    <ImagePlus size={20} />
                    <input type="file" ref={fileInputs[i]} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, i)} />
                  </button>
                )}
              </div>
            ))}
            <div className="bg-purple-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-center items-center text-center shadow-xl hover:bg-purple-700 transition-all cursor-pointer group">
              <Target size={40} className="mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold mb-2">Cada cão é único</h4>
              <div className="flex items-center gap-2 font-bold text-sm">Agende agora <ArrowRight size={16} /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpaIndications;
