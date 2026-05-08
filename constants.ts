
import { Product, FaqItem, Testimonial, GalleryImage } from './types';

export const HERO_IMAGE = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000";

/**
 * Galeria de Imagens - Iniciando vazia conforme solicitado.
 * Você pode adicionar objetos aqui manualmente seguindo o formato:
 * { id: 1, src: "LINK_OU_BASE64", type: 'url' | 'upload' }
 */
export const GALLERY_IMAGES: GalleryImage[] = [];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cama Sonho nas Nuvens",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=500",
    category: "Conforto",
    badge: "Favorito"
  },
  {
    id: 2,
    name: "Petiscos Orgânicos Yummy",
    price: 24.50,
    image: "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?auto=format&fit=crop&q=80&w=500",
    category: "Lanches",
    badge: "Delícia"
  },
  {
    id: 3,
    name: "Lagosta de Brinquedo",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=500",
    category: "Brinquedos"
  },
  {
    id: 4,
    name: "Conjunto de Passeio Luxo",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=500",
    category: "Estilo"
  }
];

export const FAQS: FaqItem[] = [
  {
    question: "Qual é o diferencial?",
    answer: "No SpaLowStress o banho não é feito no automático. Cada pet é observado, respeitado e cuidado de forma individual, com manejo low stress e uma experiência muito mais segura e tranquila.🐾"
  },
  {
    question: "Porquê devo escolher o SpaLowStress?",
    answer: "Escolher o SpaLowStress é escolher um banho sem trauma, sem pressa e com propósito. Porque estética importa, mas o bem-estar emocional do pet vem primeiro.✨"
  },
  {
    question: "Como funciona o agendamento?",
    answer: "Como nosso atendimento é 100% individualizado, trabalhamos apenas com hora marcada para garantir que seu pet tenha exclusividade total no Spa."
  },
  {
    question: "Posso acompanhar o processo?",
    answer: "Acreditamos na transparência total. Explicamos cada etapa do nosso método Low Stress para que você entenda como construímos a confiança com seu pet."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Jéssica & Luna",
    role: "Tutora de Golden",
    comment: "A Luna odiava banho, mas agora ela abana o rabo quando chegamos no Spa Low Stress. A equipe é mágica e o cuidado é visível!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: 2,
    name: "Tom & Buster",
    role: "Pai de Bulldog",
    comment: "O Buster ficava muito estressado em pet shops comuns. No Spa Low Stress, ele sai relaxado e cheiroso. É outro nível de serviço.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
  }
];
