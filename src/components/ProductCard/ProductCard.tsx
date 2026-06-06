import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Product } from '../../types/product';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const displayImage = imageError || !product.images?.[0]
    ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
    : product.images[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 animate-fade-in-up">
      <Link to={`/product/${product.id}`} className="relative block aspect-square w-full overflow-hidden bg-gray-50 dark:bg-slate-950">
        <img
          src={displayImage}
          alt={product.title}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1">
          <span className="inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-900/30 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            {product.category?.name || 'Uncategorized'}
          </span>

          <h3 className="mt-3 text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-brand-500 dark:hover:text-brand-200 transition-colors">
            <Link to={`/product/${product.id}`}>
              {product.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold tracking-wider">Price</span>
            <span className="text-base sm:text-lg font-extrabold text-gray-950 dark:text-white">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all duration-300 active:scale-95 ${
              isAdded
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25'
            }`}
            aria-label="Add to Cart"
          >
            {isAdded ? (
              <span>Added!</span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
