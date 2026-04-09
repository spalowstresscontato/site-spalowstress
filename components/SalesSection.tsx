import React from 'react';
import { ExternalLink, Heart, MessageCircle, Star } from 'lucide-react';

const GOOGLE_REVIEWS_LINK =
  'https://www.google.com/search?q=spa+low+stress&newwindow=1&sca_esv=51f1ea3ba9abaebf&sxsrf=ANbL-n7Z8ddrF3Ml9QsQpWClJoI6xxCz3Q%3A1775676430567&ei=DqzWaZKkIvTY1sQPkeWrkQk&biw=1440&bih=773&ved=0ahUKEwiS44SX_t6TAxV0rJUCHZHyKpIQ4dUDCBE&uact=5&oq=spa+low+stress&gs_lp=Egxnd3Mtd2l6LXNlcnAiDnNwYSBsb3cgc3RyZXNzMgsQLhiABBjHARivATIGEAAYBRgeMgYQABgIGB4yBhAAGAgYHjIFEAAY7wUyBRAAGO8FMgUQABjvBTIFEAAY7wUyGhAuGIAEGMcBGK8BGJcFGNwEGN4EGOAE2AEBSO0yUIQCWNYqcAJ4AZABAJgBqQOgAZEHqgEHMS4zLjQtMbgBA8gBAPgBAZgCBqAC2wbCAgcQIxiwAxgnwgIKEAAYRxjWBBiwA8ICCBAAGAgYHhgNwgIKECEYChigARjDBMICBhAAGAcYHsICCBAAGAgYBxgemAMA4gMFEgExIECIBgGQBgm6BgYIARABGBSSBwcyLjMuNC0xoAeEILIHBzAuMy40LTG4B8UGwgcFMi0yLjTIBzGACAE&sclient=gws-wiz-serp#';

const reviews = [
  {
    name: 'Sofia Pires',
    time: '2 meses atrás',
    text: 'Eu tenho um cão idoso e tem vários problemas de saúde e eu estava dando banho em casa, um amigo me indicou o SpaLowStress com a Pri e foi a mudança de nossas vidas. Eu conversei muito com ela e decidi agendar um horário, hoje ele toma só banho lá e eu fico tranquila. Sei que posso confiar.',
  },
  {
    name: 'Camila',
    time: '3 meses atrás',
    text: 'Escolhi o Spa justamente pela proposta de reduzir o estresse dos pets, e foi a melhor decisão. Minha Shih Tzu é tratada com muito carinho, paciência e respeito no tempo dela, não tem coleira, a caixinha que deixa o pet preso, tem ...',
  },
  {
    name: 'Sofia Pires Barroso',
    time: '2 meses atrás',
    text: 'Igual o SpaLowStress não existe, eu já fui em vários locais até famosinhos e não fazem o mesmo atendimento, que o SpaLowStress e as meninas são feras em ajudar, minha cachorrinha não entrava no banho e tosa, chorava o banho todo e hoje ela entra muito feliz e percebo a diferença.',
  },
  {
    name: 'Mariana Ramalho',
    time: '8 meses atrás',
    text: 'Sou super fã do trabalho da Pri, confio de olhos fechados na metodologia e no carinho e profissionalismo que as meninas tem com os cães. Minha Maya até dorme no banho de tão relaxada. Amamos e indicamos demais!',
  },
  {
    name: 'Fabiana Zacharias',
    time: '3 meses atrás',
    text: 'No Spa meu cachorro é tratado com muito carinho. As meninas estão sempre respeitando o tempo do cão sem usar força e processos que possam gerar desconforto nos cães.',
  },
  {
    name: 'Maria Elisa Nunes Fernandes',
    time: 'um ano atrás',
    text: 'Gostaria de compartilhar nossa experiência excepcional com o Spa Low Stress! Desde que comecei a levar meu cachorro para os serviços de banho e tosa, a transformação dele tem sido notável. O que mais me impressiona é a abordagem gentil e ...',
  },
];

const SalesSection: React.FC = () => {
  return (
    <section id="shop" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-4">
            <Heart className="text-purple-500 fill-purple-200 animate-pulse" size={32} />
          </div>

          <div className="inline-flex items-center gap-2 text-purple-600 font-bold tracking-widest text-xs uppercase mb-4">
            <Star size={16} className="fill-purple-600" />
            <span>Avaliações no Google</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            O que dizem sobre o <span className="text-purple-600">Spa Low Stress</span>
          </h2>

          <p className="text-gray-600 text-lg">
            Resultados reais de quem vive a experiência do banho de baixo estresse com a gente.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-100 rounded-[2rem] p-8 md:p-10 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-600 font-bold mb-3">
                Reputação da empresa
              </p>

              <div className="flex items-end gap-4 flex-wrap">
                <span className="text-6xl font-bold text-gray-900 leading-none">5,0</span>

                <div className="pb-1">
                  <div className="flex items-center gap-1 text-[#f4b400] mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={22} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 font-medium">20 avaliações no Google</p>
                </div>
              </div>
            </div>

            <a
              href={GOOGLE_REVIEWS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-4 rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-colors"
            >
              <ExternalLink size={18} />
              Ver todas no Google
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <article
              key={`${review.name}-${index}`}
              className="rounded-[2rem] border border-purple-100 bg-[#fcfbff] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.time}</p>
                </div>

                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">
                  {review.name.charAt(0)}
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#f4b400] mb-4">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={16} className="fill-current" />
                ))}
              </div>

              <p className="text-gray-700 leading-7 text-[15px]">{review.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <a
            href={GOOGLE_REVIEWS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[2rem] bg-purple-600 px-8 py-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl hover:bg-purple-700 transition-colors"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-200 font-bold mb-2">
                Quer ver mais opiniões?
              </p>
              <h3 className="text-2xl md:text-3xl font-bold">
                Confira todas as avaliações diretamente no Google
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 font-bold text-lg">
              <MessageCircle size={20} />
              Abrir avaliações
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SalesSection;
