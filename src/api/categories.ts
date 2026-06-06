import type { Category } from '../types/product';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data: Category[] = await response.json();
  
  return data
    .filter(cat => cat.id && cat.name)
    .map(cat => {
      let image = cat.image || '';
      
      if (image.startsWith('[') && image.endsWith(']')) {
        try {
          const parsed = JSON.parse(image);
          if (Array.isArray(parsed) && parsed.length > 0) {
            image = parsed[0];
          }
        } catch {
          image = image.replace(/[\[\]"']/g, '');
        }
      }
      
      image = image.replace(/[\[\]"']/g, '').replace(/\\/g, '').trim();
      
      if (!image || !image.startsWith('http') || image.includes('pravatar.cc')) {
        image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop';
      }
      
      return {
        ...cat,
        image
      };
    });
};
