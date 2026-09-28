import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IProduct } from '../../types';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isFavorited = isInWishlist(product._id);
  const discountPercent = calculateDiscountPercentage(product.price, product.discountPrice);
  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-slate-800/50">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            {discountPercent}% OFF
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400'
              : 'bg-white/80 dark:bg-slate-900/80 text-gray-500 hover:text-rose-500'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              {product.brand}
            </span>
            <RatingStars rating={product.rating} numReviews={product.numReviews} size="sm" />
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="font-semibold text-sm text-gray-900 dark:text-slate-100 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-extrabold text-gray-900 dark:text-white">
                {formatCurrency(displayPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">
                Only {product.stock} left in stock!
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product._id, 1)}
            disabled={product.stock === 0}
            className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
