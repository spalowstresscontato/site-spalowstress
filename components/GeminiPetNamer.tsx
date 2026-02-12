import React, { useState } from 'react';
import { generatePetNameIdeas } from '../services/geminiService';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

const GeminiPetNamer: React.FC = () => {
  const [petType, setPetType] = useState('Cachorro');
  const [personality, setPersonality] = useState('Brincalhão');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    const names = await generatePetNameIdeas(petType, personality);
    setResult(names);
    setLoading(false);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-purple-500/30 px-4 py-2 rounded-full text-purple-200 text-sm font-semibold border border-purple-400/30">
                    <Bot size={18} />
                    <span>Mago dos Nomes com IA</span>
                </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Novo Pet? Sem Nome? 😱
              </h2>
              <p className="text-purple-200 text-lg">
                Não entre em pânico! Nossa IA mágica Gemini está aqui para pensar no nome perfeito para seu novo melhor amigo baseado na vibe única dele.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">É um(a)...</label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option className="text-gray-900" value="Cachorro">Cachorro 🐶</option>
                    <option className="text-gray-900" value="Gato">Gato 🐱</option>
                    <option className="text-gray-900" value="Pássaro">Pássaro 🦜</option>
                    <option className="text-gray-900" value="Coelho">Coelho 🐰</option>
                    <option className="text-gray-900" value="Hamster">Hamster 🐹</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">E é totalmente...</label>
                  <select
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option className="text-gray-900" value="Brincalhão">Brincalhão e Selvagem ⚡</option>
                    <option className="text-gray-900" value="Preguiçoso">Totalmente Preguiçoso 🛋️</option>
                    <option className="text-gray-900" value="Real">Chique e Real 👑</option>
                    <option className="text-gray-900" value="Bobo">Bobo e Desajeitado 🤪</option>
                    <option className="text-gray-900" value="Valente">Valente e Corajoso 🦁</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> Cozinhando nomes...
                    </>
                  ) : (
                    <>
                        <Sparkles size={20} /> Encontrar Meu Nome!
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-gray-900 rounded-2xl p-6 min-h-[300px] border border-gray-700 shadow-inner flex flex-col">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-500 font-mono">gemini-ai-terminal</span>
                </div>
                <div className="font-mono text-sm text-green-400 whitespace-pre-line leading-relaxed flex-1">
                  {result ? result : (
                    <span className="text-gray-600">
                      // Aguardando detalhes do pet...<br/>
                      // Bip bop... Estou pronto para ajudar! 🤖<br/>
                      // Selecione as opções à esquerda.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeminiPetNamer;
