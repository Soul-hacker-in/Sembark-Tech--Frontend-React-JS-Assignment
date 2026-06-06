import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/product';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const displayImage = imageError || !item.product.images?.[0]
    ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
    : item.product.images[0];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in-up">
      <div className="flex items-center gap-4 flex-1">
        <Link to={`/product/${item.product.id}`} className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shrink-0">
          <img
            src={displayImage}
            alt={item.product.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center"
          />
        </Link>
        <div className="space-y-1 min-w-0">
          <span className="text-[10px] sm:text-xs font-bold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {item.product.category?.name || 'Category'}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-gray-950 dark:text-white truncate">
            <Link to={`/product/${item.product.id}`} className="hover:text-brand-500 dark:hover:text-brand-200 transition-colors">
              {item.product.title}
            </Link>
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
            ₹{item.product.price.toLocaleString()} each
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 dark:border-slate-800 pt-3 sm:pt-0">
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-850 shadow-none hover:shadow-sm transition-all focus:outline-none"
            aria-label="Decrease Quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-850 shadow-none hover:shadow-sm transition-all focus:outline-none"
            aria-label="Increase Quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-right shrink-0">
          <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Subtotal</span>
          <span className="text-sm sm:text-base font-extrabold text-gray-950 dark:text-white">
            ₹{(item.product.price * item.quantity).toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => removeFromCart(item.product.id)}
          className="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors focus:outline-none active:scale-95"
          aria-label="Remove item"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};
