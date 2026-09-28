import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api';
import { IProduct, ICategory, PaginationMeta } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters read from URL searchParams
  const keyword = searchParams.get('keyword') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const hasDiscount = searchParams.get('hasDiscount') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Load filter metadata once
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [catRes, filterRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/filters'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (filterRes.data.success) {
          setAvailableBrands(filterRes.data.data.brands || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadMetadata();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(searchParams);
        if (!queryParams.has('limit')) queryParams.set('limit', '12');

        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data || []);
          if (res.data.pagination) {
            setPagination(res.data.pagination);
          }
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'false') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    // Reset to page 1 on filter modification
    if (key !== 'page') nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    rating,
    inStock,
    hasDiscount,
    keyword,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {keyword ? `Search Results for "${keyword}"` : 'All Products Catalog'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {products.length} of {pagination.total} genuine items
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Filter Products</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Category
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('category', null)}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => updateParam('category', c.slug)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.slug
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] text-gray-400">({c.productCount || 7})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Brand
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => updateParam('brand', null)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    !selectedBrand
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => updateParam('brand', b)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedBrand === b
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Price Range (INR)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Customer Rating */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Minimum Rating
            </h4>
            <div className="space-y-1">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => updateParam('rating', rating === stars.toString() ? null : stars.toString())}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    rating === stars.toString()
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center text-amber-400">
                    {[...Array(stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span>{stars}★ & above</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Discounted Deals</span>
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => updateParam('hasDiscount', e.target.checked ? 'true' : null)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
              <Search className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">No products found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                We couldn't find any items matching your selected criteria. Try adjusting your search keywords or clearing some filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => updateParam('page', (page - 1).toString())}
                disabled={!pagination.hasPrevPage}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateParam('page', pNum.toString())}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        page === pNum
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => updateParam('page', (page + 1).toString())}
                disabled={!pagination.hasNextPage}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
