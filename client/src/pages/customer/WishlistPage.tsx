import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { RatingStars } from '../../components/common/RatingStars';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product: any) => {
    await addToCart(product._id, 1);
    await toggleWishlist(product);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500">
          Save your favorite products to keep track of their prices and stock availability.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <span>Discover Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Wishlist</h1>
        <p className="text-xs text-gray-500 mt-1">
          {wishlist.length} saved item{wishlist.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-card transition-all flex flex-col overflow-hidden"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-slate-800">
              <Link to={`/products/${product.slug}`}>
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:scale-110 transition-transform shadow-xs"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  {product.brand}
                </span>
                <Link
                  to={`/products/${product.slug}`}
                  className="font-bold text-xs text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-1 mt-0.5"
                >
                  {product.name}
                </Link>
                <div className="mt-1">
                  <RatingStars rating={product.rating} numReviews={product.numReviews} size="sm" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">
                    {formatCurrency(product.discountPrice || product.price)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  disabled={product.stock === 0}
                  className="mt-3 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors disabled:opacity-30"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
