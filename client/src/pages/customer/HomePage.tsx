import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import api from '../../services/api';
import { ICategory, IProduct } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<IProduct[]>([]);
  const [discountProducts, setDiscountProducts] = useState<IProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, featRes, trendRes, discRes, recRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/featured'),
          api.get('/products/trending'),
          api.get('/products/discounts'),
          api.get('/recommendations/for-you'),
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.data || []);
        if (featRes.data.success) setFeaturedProducts(featRes.data.data || []);
        if (trendRes.data.success) setTrendingProducts(trendRes.data.data || []);
        if (discRes.data.success) setDiscountProducts(discRes.data.data || []);
        if (recRes.data.success) setRecommendedProducts(recRes.data.data || []);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white py-16 sm:py-24">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Next-Generation Multi-Vendor Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Everything you love, <br />
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                  all in one place.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-indigo-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover 50,000+ handpicked products from India’s top certified merchants. Experience verified genuine quality, lightning-fast dispatch, and effortless returns.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-8 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/seller/register"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all backdrop-blur-md"
                >
                  Become a Seller
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-black text-white">50k+</p>
                  <p className="text-xs text-indigo-200/70">Curated Items</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">500+</p>
                  <p className="text-xs text-indigo-200/70">Verified Sellers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-300">4.9 ★</p>
                  <p className="text-xs text-indigo-200/70">Customer Trust</p>
                </div>
              </div>
            </div>

            {/* Right Hero Product Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
                    alt="Hero Headphones"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Deal of the Day
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                    AcousticPulse
                  </span>
                  <h3 className="font-bold text-base text-white">Apex Pro Wireless ANC Studio Headphones</h3>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xl font-extrabold text-white">₹14,999</span>
                      <span className="text-xs text-indigo-200/60 line-through ml-2">₹19,999</span>
                    </div>
                    <Link
                      to="/products/apex-pro-noise-cancelling-wireless-headphones"
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      View Deal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-xs text-gray-500 mt-1">Explore our wide selection of certified collections</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-gray-50 dark:bg-slate-800">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-semibold text-xs text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">
                {cat.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {cat.productCount || 7}+ items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Featured Products</h2>
              <p className="text-xs text-gray-500">Hand-curated editor's picks with exceptional customer ratings</p>
            </div>
          </div>
          <Link to="/products?featured=true" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Mid-Page Festival Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-brand-blue p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-sm">
              Limited Period Offer
            </span>
            <h3 className="text-3xl sm:text-4xl font-black">
              Upgrade Your Lifestyle with Extra 20% Instant Savings
            </h3>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Apply coupon voucher <code className="font-mono bg-white/20 px-2 py-0.5 rounded font-bold">FESTIVE20</code> at checkout to redeem flat discounts across electronics and fashion apparel.
            </p>
            <div className="pt-2">
              <Link
                to="/products?hasDiscount=true"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-indigo-900 font-extrabold text-xs shadow-lg hover:bg-gray-100 transition-colors"
              >
                <span>Shop Festival Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 h-64 rounded-2xl overflow-hidden shadow-2xl z-10 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"
              alt="Promo Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trending & Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Trending & Best Sellers</h2>
              <p className="text-xs text-gray-500">Most ordered products this week across all merchant stores</p>
            </div>
          </div>
          <Link to="/products?sort=popularity" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Recommended For You (AI-powered / Content-based) */}
      {recommendedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Recommended For You</h2>
                <p className="text-xs text-gray-500">Personalized product selections based on customer preferences</p>
              </div>
            </div>
            <Link to="/products" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose ShopSphere Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gray-100/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Why Customers Love Shopping on ShopSphere
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              We empower verified merchants while protecting buyers with transparent warranties and secure escrow payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">Strict Quality Inspection</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                All merchant partners are verified with valid GSTIN and undergo catalog auditing to guarantee zero counterfeit items.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">Buyer Escrow Protection</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Payment is securely safeguarded until successful delivery. Easily initiate 7-day hassle-free replacements or refunds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">Express Pan-India Logistics</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Automated multi-carrier dispatch with real-time tracking links, instant delivery updates, and download-ready invoices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
