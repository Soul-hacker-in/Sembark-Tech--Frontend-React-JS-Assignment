import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingCart, ShieldCheck, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { CartItem } from '../../components/CartItem/CartItem';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, totalItems, totalValue } = useCart();
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsCheckoutSuccess(true);
      clearCart();
    }, 1500);
  };

  const handleSuccessClose = () => {
    setIsCheckoutSuccess(false);
    navigate('/');
  };

  if (cart.length === 0 && !isCheckoutSuccess) {
    return (
      <div className="max-w-md mx-auto my-16 px-6 py-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-3xl text-center space-y-5 animate-fade-in-up">
        <div className="mx-auto bg-brand-50 dark:bg-brand-900/20 text-brand-500 dark:text-brand-300 p-4 rounded-full w-16 h-16 flex items-center justify-center">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Looks like you haven't added anything to your cart yet. Let's go discover some great products!
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 shadow-md shadow-brand-500/25 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review your selected items before proceeding to checkout.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-650 hover:text-brand-700 dark:text-brand-300 transition-colors focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-100 hover:border-rose-200 dark:border-rose-950/20 text-rose-500 hover:text-rose-600 dark:hover:bg-rose-950/10 rounded-xl text-xs font-semibold transition-colors focus:outline-none"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Items Total ({totalItems})</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-emerald-500 font-semibold uppercase tracking-wider text-xs">Free</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Tax</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹0.00</span>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between">
              <span className="text-base font-bold text-gray-900 dark:text-white">Order Total</span>
              <span className="text-xl font-extrabold text-gray-950 dark:text-white">
                ₹{totalValue.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-400 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-300 active:scale-98 disabled:scale-100"
          >
            {isCheckingOut ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <CreditCard className="h-4.5 w-4.5" />
                <span>Checkout Now</span>
              </>
            )}
          </button>

          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Secure, encrypted Checkout checkout.</span>
            </div>
          </div>
        </div>
      </div>

      {isCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
          
          <div className="relative max-w-md w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6 animate-scale-up z-10">
            <div className="mx-auto bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 p-4 rounded-full w-20 h-20 flex items-center justify-center relative">
              <CheckCircle2 className="h-12 w-12" />
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-400 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Order Confirmed!</h2>
              <p className="text-sm text-gray-650 dark:text-gray-400">
                Thank you for shopping with <span className="font-bold text-brand-500">Sembark-Tech</span>. Your purchase was successful and your cart has been cleared.
              </p>
            </div>
            
            <button
              onClick={handleSuccessClose}
              className="w-full py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all focus:outline-none"
            >
              Back to Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
