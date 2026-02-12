import React, { useState } from 'react';
import { FAQS } from '../constants';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-500">Tudo o que você precisa saber sobre nossos produtos e serviços.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'shadow-md bg-purple-50/50 border-purple-100' : 'bg-white'
              }`}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-purple-700' : 'text-gray-800'}`}>
                  {faq.question}
                </span>
                <span className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-purple-600' : 'text-gray-400'}`}>
                   {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
