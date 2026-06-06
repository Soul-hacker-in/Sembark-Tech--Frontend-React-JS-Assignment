import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { parseQueryParams, stringifyQueryParams } from '../../utils/queryParams';
import type { SortOption } from '../../types/product';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse initial query params to prevent double fetch on mount
  const initialParams = useMemo(() => {
    const { categories: urlCats, sort: urlSort, search: urlSearch } = parseQueryParams(location.search);
    return {
      categories: urlCats.map(c => c.toLowerCase()),
      sort: urlSort as SortOption,
      search: urlSearch,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialParams.categories);
  const [sortOption, setSortOption] = useState<SortOption>(initialParams.sort);
  const [searchQuery, setSearchQuery] = useState<string>(initialParams.search);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state with location search (important for back/forward navigation)
  useEffect(() => {
    const { categories: urlCats, sort: urlSort, search: urlSearch } = parseQueryParams(location.search);
    Promise.resolve().then(() => {
      setSelectedCategories(urlCats.map(c => c.toLowerCase()));
      setSortOption(urlSort as SortOption);
      setSearchQuery(urlSearch);
    });
  }, [location.search]);

  const {
    products,
    categories,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  } = useProducts(selectedCategories, searchQuery);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Trigger loading of more items when scroll reaches the bottom
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentLoader);

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMore, hasMore, loading, loadingMore]);

  const updateUrl = (cats: string[], sort: SortOption, search: string) => {
    const queryString = stringifyQueryParams({
      categories: cats,
      sort,
      search,
    });
    navigate(`/${queryString}`, { replace: false });
  };

  const handleCategoryToggle = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase();
    const updated = selectedCategories.includes(normalizedName)
      ? selectedCategories.filter((c) => c !== normalizedName)
      : [...selectedCategories, normalizedName];

    setSelectedCategories(updated);
    updateUrl(updated, sortOption, searchQuery);
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    updateUrl([], sortOption, searchQuery);
  };

  const handleSelectAllCategories = () => {
    const all = categories.map((c) => c.name.toLowerCase());
    setSelectedCategories(all);
    updateUrl(all, sortOption, searchQuery);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    updateUrl(selectedCategories, sort, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateUrl(selectedCategories, sortOption, query);
  };

  const handleResetAll = () => {
    setSelectedCategories([]);
    setSortOption('default');
    setSearchQuery('');
    navigate('/', { replace: false });
  };

  const filteredProducts = useMemo(() => {
    const result = [...products];

    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, sortOption]);

  return (
    <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="md:flex md:items-center md:justify-between border-b border-gray-100 dark:border-slate-800 ">

        <div className=" flex items-center gap-4">


          {(selectedCategories.length > 0 || searchQuery !== '' || sortOption !== 'default') && (
            <button
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white bg-white dark:bg-slate-900 shadow-sm transition-all focus:outline-none"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-semibold hover:bg-brand-600 shadow-md shadow-brand-500/25 transition-all focus:outline-none"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-center">
          <p className="font-bold text-lg">Failed to retrieve items</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              onClearCategories={handleClearCategories}
              onSelectAllCategories={handleSelectAllCategories}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>

          <main className="lg:col-span-9 space-y-6">
            <ProductGrid products={filteredProducts} isLoading={loading} />
            
            {/* Infinite Scroll Loader Target */}
            <div ref={loaderRef} className="py-6 flex justify-center">
              {loadingMore && (
                <div className="flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm">
                  <div className="h-5 w-5 border-2 border-brand-600 dark:border-brand-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading more products...</span>
                </div>
              )}
              {!hasMore && filteredProducts.length > 0 && (
                <p className="text-gray-400 dark:text-slate-500 text-xs font-medium">
                  You have viewed all products
                </p>
              )}
            </div>
          </main>
        </div>
      )}

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-slate-900 py-4 pb-12 shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 px-4">
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                onClearCategories={handleClearCategories}
                onSelectAllCategories={handleSelectAllCategories}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
