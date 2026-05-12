export interface Product {
  id: string;
  name: string;
  category: string;
  gender: 'Homme' | 'Femme' | 'Enfant' | 'Unisexe';
  price: number;
  image: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  tag?: string;
  isFavorite?: boolean;
}

export type SortOption = 'newest' | 'price-low-high' | 'price-high-low' | 'popular';
