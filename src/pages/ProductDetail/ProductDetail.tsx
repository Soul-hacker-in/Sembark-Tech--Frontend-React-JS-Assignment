import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, Star } from 'lucide-react';
import { getProductById } from '../../api/products';
import type { Product } from '../../types/product';
import { useCart } from '../../hooks/useCart';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const prodId = parseInt(id, 10);
        if (isNaN(prodId)) {
          throw new Error('Invalid product ID');
        }
        const fetchedProduct = await getProductById(prodId);
        setProduct(fetchedProduct);
        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setSelectedImage(fetchedProduct.images[0]);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err instanceof Error ? err.message : 'Could not fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';
  
  const mainImageToShow = imageError || !selectedImage
    ? defaultImage
    : selectedImage;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="h-6 w-32 bg-gray-250 dark:bg-slate-800 rounded animate-pulse-soft mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="w-full aspect-square bg-gray-200 dark:bg-slate-855 rounded-2xl animate-pulse-soft" />
            <div className="flex gap-3">
              <div className="h-16 w-16 bg-gray-200 dark:bg-slate-855 rounded-xl animate-pulse-soft" />
              <div className="h-16 w-16 bg-gray-200 dark:bg-slate-855 rounded-xl animate-pulse-soft" />
              <div className="h-16 w-16 bg-gray-200 dark:bg-slate-855 rounded-xl animate-pulse-soft" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="h-4 w-24 bg-gray-250 dark:bg-slate-800 rounded animate-pulse-soft" />
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-slate-855 rounded animate-pulse-soft" />
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-slate-855 rounded animate-pulse-soft" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-855 rounded animate-pulse-soft" />
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-855 rounded animate-pulse-soft" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-855 rounded animate-pulse-soft" />
            </div>
            <div className="h-14 w-full bg-gray-250 dark:bg-slate-800 rounded-xl animate-pulse-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl text-center space-y-4 animate-fade-in-up">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product details unavailable</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error || "The requested product could not be found or API timed out."}
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 shadow-md shadow-brand-500/25 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-450 dark:hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Products</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-4">
          <div className="w-full aspect-square bg-gray-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
            <img
              src={mainImageToShow}
              alt={product.title}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(img);
                    setImageError(false);
                  }}
                  className={`h-16 w-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-955 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-brand-500 scale-105 shadow-sm'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-900/30 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider">
              {product.category?.name || 'Department'}
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 dark:text-white">
              {product.title}
            </h1>

            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current opacity-30" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold ml-1">(4.0 / 5.0 - 24 Reviews)</span>
            </div>
          </div>

          <div className="border-y border-gray-100 dark:border-slate-800 py-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total Price</span>
              <p className="text-3xl font-extrabold text-gray-950 dark:text-white">
                ₹{product.price.toLocaleString()}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 font-bold rounded-lg uppercase">
              In Stock
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Product Description</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center border-t border-gray-100 dark:border-slate-800 pt-6">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-955 border border-gray-150 dark:border-slate-800 p-2.5 rounded-2xl w-full sm:w-auto shrink-0">
              <button
                onClick={() => handleQtyChange(quantity - 1)}
                className="p-1 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 shadow-none hover:shadow-sm transition-all focus:outline-none disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Decrease Quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-base font-extrabold text-gray-950 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => handleQtyChange(quantity + 1)}
                className="p-1 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 shadow-none hover:shadow-sm transition-all focus:outline-none"
                aria-label="Increase Quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 active:scale-98 ${
                isAdded
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Item Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart - ₹{(product.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
