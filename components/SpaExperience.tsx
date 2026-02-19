
import React, { useState, useRef, useEffect } from 'react';
import { Video, Image as ImageIcon } from 'lucide-react';

const STORAGE_VIDEO = 'spa_low_stress_exp_video';
const STORAGE_POSTER = 'spa_low_stress_exp_poster';

const SpaExperience: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [videoSrc, setVideoSrc] = useState("https://cdn.pixabay.com/video/2021/08/13/84931-588469375_large.mp4");
  const [posterSrc, setPosterSrc] = useState("https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1200");
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedVideo = localStorage.getItem(STORAGE_VIDEO);
    const savedPoster = localStorage.getItem(STORAGE_POSTER);
    if (savedVideo) setVideoSrc(savedVideo);
    if (savedPoster) setPosterSrc(savedPoster);

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') setShowAdmin(p => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'video' | 'poster') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'video') {
          setVideoSrc(base64);
          localStorage.setItem(STORAGE_VIDEO, base64);
        } else {
          setPosterSrc(base64);
          localStorage.setItem(STORAGE_POSTER, base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest">Experiência Sensorial</div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">💙 Uma experiência exclusiva que transforma o seu cão</h2>
              <p className="text-xl text-gray-600 leading-relaxed">Trazer seu cão ao Spa Low Stress é oferecer muito mais do que higiene — é investir na saúde física e mental dele.</p>
            </div>
            <div className="space-y-6">
              {[
                { title: "Pratinhos de lamber", color: "bg-purple-500", desc: "Que promovem calma e foco profundo." },
                { title: "Mordedores e bolinhas", color: "bg-pink-500", desc: "Essenciais para a liberação de tensão." },
                { title: "Música clássica", color: "bg-blue-500", desc: "Tocada para induzir um estado de paz absoluta." },
                { title: "Cromoterapia", color: "bg-orange-400", desc: "Uso estratégico de luzes relaxantes." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-2 h-8 ${item.color} rounded-full transition-all group-hover:h-10`}></div>
                    <h4 className="text-2xl font-bold text-gray-800">{item.title}</h4>
                  </div>
                  <p className="text-gray-600 pl-6">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-xl relative">
            {showAdmin && (
              <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2 z-30 animate-fade-in">
                <button onClick={() => videoInputRef.current?.click()} className="bg-white text-blue-600 px-4 py-2 rounded-full text-xs font-bold shadow-xl border flex items-center gap-2 hover:bg-blue-50">
                  <Video size={14} /> Trocar Vídeo
                </button>
                <button onClick={() => posterInputRef.current?.click()} className="bg-white text-pink-600 px-4 py-2 rounded-full text-xs font-bold shadow-xl border flex items-center gap-2 hover:bg-pink-50">
                  <ImageIcon size={14} /> Trocar Capa
                </button>
                <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => handleUpload(e, 'video')} />
                <input type="file" ref={posterInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'poster')} />
              </div>
            )}
            <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl w-[640px] h-[360px] mx-auto bg-gray-200 border-8 border-white">
              <video key={videoSrc} autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src={videoSrc} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12 text-white">
                <div><p className="font-bold text-2xl mb-2">Paz & Cuidado</p><p className="text-sm text-gray-200">Ambiente 100% focado nele.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpaExperience;
