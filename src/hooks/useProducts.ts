import { useState, useEffect, useCallback } from 'react';
import type { Product, Category } from '../types/product';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';

interface UseProductsResult {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
};
