import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Product, Category } from '../types/product';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';

const LIMIT = 20;

interface UseProductsResult {
  products: Product[];
  categories: Category[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export const useProducts = (
  selectedCategories: string[] = [],
  searchQuery: string = ''
): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

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

  // Adjust state synchronously during render if filters change
  const [prevFilters, setPrevFilters] = useState({ ids: '', search: '' });
  if (prevFilters.ids !== selectedIdsString || prevFilters.search !== debouncedSearch) {
    setPrevFilters({ ids: selectedIdsString, search: debouncedSearch });
    setOffset(0);
    setHasMore(true);
  }

  // Keep track of the last fetched parameters to prevent duplicate calls
  const lastFetchParamsRef = useRef<{ ids: string; title: string | undefined; offset: number } | null>(null);

  const fetchProductsData = useCallback(async (activeSignal = { active: true }) => {
    const isInitial = offset === 0;
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      let fetchedProducts: Product[] = [];
      const title = debouncedSearch.trim() || undefined;

      // Save last fetched params
      lastFetchParamsRef.current = { ids: selectedIdsString, title, offset };

      const selectedIds = selectedIdsString
        ? selectedIdsString.split(',').map(Number)
        : [];

      let hasMoreData = true;

      if (selectedIds.length === 0) {
        // No category filter, fetch all products
        fetchedProducts = await getProducts({ title, limit: LIMIT, offset });
        hasMoreData = fetchedProducts.length === LIMIT;
      } else if (selectedIds.length === 1) {
        // Single category, make one API request
        fetchedProducts = await getProducts({ categoryId: selectedIds[0], title, limit: LIMIT, offset });
        hasMoreData = fetchedProducts.length === LIMIT;
      } else {
        // Multiple categories: make parallel requests and merge/deduplicate
        const results = await Promise.all(
          selectedIds.map(id => getProducts({ categoryId: id, title, limit: LIMIT, offset }))
        );
        const mergedMap = new Map<number, Product>();
        results.flat().forEach(p => {
          mergedMap.set(p.id, p);
        });
        fetchedProducts = Array.from(mergedMap.values());
        // If any of the categories returned a full page, there might be more data
        hasMoreData = results.some(res => res.length === LIMIT);
      }

      if (activeSignal.active) {
        if (isInitial) {
          setProducts(fetchedProducts);
        } else {
          // Append and deduplicate by id
          setProducts(prev => {
            const mergedMap = new Map<number, Product>();
            prev.forEach(p => mergedMap.set(p.id, p));
            fetchedProducts.forEach(p => mergedMap.set(p.id, p));
            return Array.from(mergedMap.values());
          });
        }
        setHasMore(hasMoreData);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (activeSignal.active) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching products');
      }
    } finally {
      if (activeSignal.active) {
        if (isInitial) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    }
  }, [selectedIdsString, debouncedSearch, offset]);

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
      lastFetchParamsRef.current.title === title &&
      lastFetchParamsRef.current.offset === offset
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
  }, [categories.length, selectedCategories.length, selectedIdsString, debouncedSearch, offset, fetchProductsData]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      setOffset(prev => prev + LIMIT);
    }
  }, [loading, loadingMore, hasMore]);

  const refetch = useCallback(() => {
    lastFetchParamsRef.current = null; // force fetch
    setOffset(0);
    setHasMore(true);
  }, []);

  return {
    products,
    categories,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};
