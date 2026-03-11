import React from 'react';
import { Calendar, ArrowRight, Leaf } from 'lucide-react';

const SpaCTA: React.FC = () => {
  const WHATSAPP_LINK = "https://wa.me/5511991431367?text=Oi%20Quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20servi%C3%A7os%20e%20cuidados%20do%20SPA%20LOW%20STRESS%20%F0%9F%90%BE";

  return (
    <section className="pb-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[4rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Leaf size={40} className="text-green-300" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              🌱 Spa Low Stress: cuidado que educa, acolhe e transforma
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed">
              Acreditamos que o futuro do banho pet é mais humano, mais técnico e mais respeitoso. 
              Por isso, além de cuidar dos cães, também educamos e formamos profissionais para espalhar essa nova forma de cuidar.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 py-8">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-2xl font-bold">Seu cão sente</p>
                <p className="text-purple-200">a diferença</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-2xl font-bold">O corpo</p>
                <p className="text-purple-200">relaxa</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-2xl font-bold">A mente</p>
                <p className="text-purple-200">agradece</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">📍 Agende a experiência do seu cão</h3>
              <p className="text-purple-100">
                Entre em contato e descubra como o banho de baixo estresse pode transformar a relação do seu cão com a higiene.
              </p>
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-white text-purple-700 px-12 py-5 rounded-full font-bold text-xl hover:bg-purple-50 transition-all items-center gap-3 mx-auto shadow-xl hover:scale-105 group"
              >
                <Calendar />
                Agendar Agora
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </a>
              <p className="text-sm text-purple-200 font-medium">
                👉 Ofereça um cuidado à altura de quem você ama.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpaCTA;