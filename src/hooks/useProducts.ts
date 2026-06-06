import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

export const useProducts = (
  selectedCategories: string[] = [],
  searchQuery: string = ''
): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query to prevent excessive API requests
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch categories once on mount
  useEffect(() => {
    let active = true;
    const fetchCats = async () => {
      try {
        const fetchedCats = await getCategories();
        if (active) {
          setCategories(fetchedCats);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
    return () => {
      active = false;
    };
  }, []);

  // Find category IDs matching the selected category names
  const selectedIdsString = useMemo(() => {
    if (selectedCategories.length === 0 || categories.length === 0) {
      return '';
    }
    return selectedCategories
      .map(catName => categories.find(c => c.name.toLowerCase() === catName.toLowerCase())?.id)
      .filter((id): id is number => id !== undefined)
      .sort((a, b) => a - b)
      .join(',');
  }, [categories, selectedCategories]);

  // Keep track of the last fetched parameters to prevent duplicate calls
  const lastFetchParamsRef = useRef<{ ids: string; title: string | undefined } | null>(null);

  const fetchProductsData = useCallback(async (activeSignal = { active: true }) => {
    setLoading(true);
    setError(null);
    try {
      let fetchedProducts: Product[] = [];
      const title = debouncedSearch.trim() || undefined;

      // Save last fetched params
      lastFetchParamsRef.current = { ids: selectedIdsString, title };

      const selectedIds = selectedIdsString
        ? selectedIdsString.split(',').map(Number)
        : [];

      if (selectedIds.length === 0) {
        // No category filter, fetch all products (matching title if present)
        fetchedProducts = await getProducts({ title });
      } else if (selectedIds.length === 1) {
        // Single category, make one API request
        fetchedProducts = await getProducts({ categoryId: selectedIds[0], title });
      } else {
        // Multiple categories: make parallel requests and merge/deduplicate
        const results = await Promise.all(
          selectedIds.map(id => getProducts({ categoryId: id, title }))
        );
        const mergedMap = new Map<number, Product>();
        results.flat().forEach(p => {
          mergedMap.set(p.id, p);
        });
        fetchedProducts = Array.from(mergedMap.values());
      }

      if (activeSignal.active) {
        setProducts(fetchedProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (activeSignal.active) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching products');
      }
    } finally {
      if (activeSignal.active) {
        setLoading(false);
      }
    }
  }, [selectedIdsString, debouncedSearch]);

  useEffect(() => {
    const activeSignal = { active: true };
    
    // Wait until categories are loaded if selectedCategories is not empty
    if (selectedCategories.length > 0 && categories.length === 0) {
      return;
    }

    const title = debouncedSearch.trim() || undefined;

    // Skip if these parameters were already fetched
    if (
      lastFetchParamsRef.current &&
      lastFetchParamsRef.current.ids === selectedIdsString &&
      lastFetchParamsRef.current.title === title
    ) {
      return;
    }

    // Wrap in microtask to avoid synchronous setState in useEffect error
    Promise.resolve().then(() => {
      if (activeSignal.active) {
        fetchProductsData(activeSignal);
      }
    });

    return () => {
      activeSignal.active = false;
    };
  }, [categories.length, selectedCategories.length, selectedIdsString, debouncedSearch, fetchProductsData]);

  const refetch = useCallback(() => {
    lastFetchParamsRef.current = null; // force fetch
    const activeSignal = { active: true };
    fetchProductsData(activeSignal);
  }, [fetchProductsData]);

  return {
    products,
    categories,
    loading,
    error,
    refetch,
  };
};
