import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  

  

  return (
    <header className="sticky top-0 z-50 glass shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex justify-center items-center">
            <Link to="/" className="flex items-center gap-2 group">
              
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-500 to-indigo-600 dark:from-brand-200 dark:to-brand-500 bg-clip-text text-transparent">
                Sembark-Tech
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 sm:gap-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-brand-500 dark:text-brand-200 bg-brand-50/50 dark:bg-brand-900/40'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-slate-800/40'
                }`}
              >
                Products
              </Link>
            </nav>

            <span className="h-6 w-[1px] bg-gray-200 dark:bg-slate-700 hidden sm:block" />

            

            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-slate-800/40 transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-scale-up">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
