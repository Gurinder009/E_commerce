import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Store,
  MessageSquare,
  X,
} from 'lucide-react';
import api from '../../services/api';
import { IProduct, IReview } from '../../types';
import { formatCurrency, calculateDiscountPercentage, formatDate } from '../../utils/formatters';
import { RatingStars } from '../../components/common/RatingStars';
import { ProductCard } from '../../components/product/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../utils/toast';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/slug/${slug}`);
        if (res.data.success) {
          const prod = res.data.data.product;
          setProduct(prod);
          setRelatedProducts(res.data.data.relatedProducts || []);
          setActiveImageIndex(0);
          setSelectedQuantity(1);

          // Fetch reviews
          const reviewsRes = await api.get(`/reviews/product/${prod._id}`);
          if (reviewsRes.data.success) {
            setReviews(reviewsRes.data.data || []);
          }
        }
      } catch (err: any) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-xs text-gray-500 mt-4">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <Link to="/products" className="mt-4 inline-block text-indigo-600 font-semibold text-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const discountPercent = calculateDiscountPercentage(product.price, product.discountPrice);
  const displayPrice = product.discountPrice || product.price;
  const sellerObj: any = product.seller;
  const categoryObj: any = product.category;

  const handleBuyNow = async () => {
    await addToCart(product._id, selectedQuantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in to submit a product review.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.data.success) {
        toast.success('Your verified review was submitted successfully!');
        setIsReviewModalOpen(false);
        setReviewTitle('');
        setReviewComment('');
        // Reload reviews
        const reviewsRes = await api.get(`/reviews/product/${product._id}`);
        if (reviewsRes.data.success) setReviews(reviewsRes.data.data || []);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${categoryObj?.slug}`} className="hover:text-indigo-600 truncate max-w-xs">
          {categoryObj?.name || 'Category'}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery & Zoom Display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-card">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md text-gray-400 hover:text-rose-500 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white dark:bg-slate-900 ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {product.brand}
              </span>
              <span className="text-[11px] font-mono text-gray-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 pt-1">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size="md" />
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Authentic Listing</span>
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {formatCurrency(displayPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Inclusive of all taxes. Free express shipping on this product!
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Currently Out of Stock'}
            </span>
          </div>

          {/* Quantity and Actions */}
          {product.stock > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center space-x-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 px-3 py-1.5">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    disabled={selectedQuantity <= 1}
                    className="text-gray-500 hover:text-indigo-600 font-bold px-1 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold min-w-[20px] text-center">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))}
                    disabled={selectedQuantity >= product.stock}
                    className="text-gray-500 hover:text-indigo-600 font-bold px-1 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => addToCart(product._id, selectedQuantity)}
                  className="py-3.5 px-6 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold text-sm flex items-center justify-center space-x-2 border border-indigo-200 dark:border-indigo-900 transition-all shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Seller Store Information Card */}
          {sellerObj && (
            <div className="p-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    Sold by: {sellerObj.storeName || 'Verified Merchant'}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                    <span>★ {sellerObj.rating || 4.8} Merchant Rating</span>
                    <span>•</span>
                    <span>{sellerObj.businessAddress?.city || 'India'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guarantee Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>7 Days Return</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
              <span>100% Genuine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800">
          Product Overview & Specifications
        </h2>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>{product.description}</p>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-800/60">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customer Ratings & Reviews</h2>
            <div className="flex items-center space-x-2 mt-1">
              <RatingStars rating={product.rating} numReviews={reviews.length} size="md" />
            </div>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">
              No customer reviews yet. Be the first verified buyer to share your feedback!
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={rev.user?.name || 'Customer'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {rev.user?.name || 'Verified Buyer'}
                      </span>
                      {rev.isVerifiedPurchase && (
                        <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">{formatDate(rev.createdAt)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">{rev.title}</h4>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>

                {/* Seller Response if any */}
                {rev.sellerResponse && (
                  <div className="mt-3 pl-3 border-l-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5 rounded-r-xl">
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 block">
                      Merchant Response:
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                      {rev.sellerResponse.comment}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Similar & Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Write a Product Review</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center space-x-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent build quality, totally worth it!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Review Experience
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What did you like or dislike about this product? How was packaging and delivery?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
