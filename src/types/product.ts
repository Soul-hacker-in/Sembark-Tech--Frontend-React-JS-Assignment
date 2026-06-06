export interface Category {
  id: number;
  name: string;
  image: string;
  slug?: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  creationAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';
