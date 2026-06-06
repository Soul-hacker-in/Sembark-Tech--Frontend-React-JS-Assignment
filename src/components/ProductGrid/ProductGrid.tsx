import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import type { Product } from '../../types/product';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  const skeletons = Array.from({ length: 8 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 sm:p-5"
          >
            <div className="w-full aspect-square bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse-soft" />

            <div className="mt-4 flex-1">
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-800 rounded animate-pulse-soft" />
              <div className="mt-3 h-5 w-3/4 bg-gray-200 dark:bg-slate-800 rounded animate-pulse-soft" />
              <div className="mt-2 h-4 w-full bg-gray-200 dark:bg-slate-800 rounded animate-pulse-soft" />
              <div className="mt-1.5 h-4 w-5/6 bg-gray-200 dark:bg-slate-800 rounded animate-pulse-soft" />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-4">
              <div className="flex flex-col gap-1">
                <div className="h-3 w-8 bg-gray-200 dark:bg-slate-800 rounded animate-pulse-soft" />
                <div className="h-5 w-16 bg-gray-200 dark:bg-slate-800 rounded animate-pulse-soft" />
              </div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse-soft" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm animate-fade-in-up">
        <div className="p-4 bg-brand-50 dark:bg-brand-900/20 text-brand-500 dark:text-brand-300 rounded-full mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          We couldn't find any products matching your current category filters or search term. Try resetting your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
