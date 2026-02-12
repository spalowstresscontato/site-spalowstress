
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  avatar: string;
}

export interface GalleryImage {
  id: string | number;
  src: string;
  type: 'url' | 'upload';
}
