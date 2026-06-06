import type { Product } from '../types/product';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

export const sanitizeImageUrls = (images: string[]): string[] => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'];
  }

  return images.map(img => {
    let clean = img;
    
    if (clean.startsWith('[') && clean.endsWith(']')) {
      try {
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0) {
          clean = parsed[0];
        }
      } catch {
        clean = clean.replace(/[\[\]"']/g, '');
      }
    }

    clean = clean.replace(/[\[\]"']/g, '').replace(/\\/g, '').trim();

    if (!clean || !clean.startsWith('http')) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';
    }

    return clean;
  });
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data: Product[] = await response.json();
  
  return data.map(product => ({
    ...product,
    images: sanitizeImageUrls(product.images)
  }));
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product with id ${id}`);
  }
  const product: Product = await response.json();
  
  return {
    ...product,
    images: sanitizeImageUrls(product.images)
  };
};
