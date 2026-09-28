import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Edit3, ExternalLink, Package } from 'lucide-react';
import api from '../../services/api';
import { IProduct } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../utils/toast';

export const SellerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sellers/inventory');
      if (res.data.success) {
        setProducts(res.data.data || []);
      }
    } catch (e: any) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        toast.info('Product deleted');
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Store Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">Manage listings, prices, and stock inventory</p>
        </div>
        <Link
          to="/seller/products/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by title, brand, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-800/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Product</th>
                <th className="py-3.5 px-4 font-bold">SKU</th>
                <th className="py-3.5 px-4 font-bold">Price</th>
                <th className="py-3.5 px-4 font-bold">Stock</th>
                <th className="py-3.5 px-4 font-bold">Sold</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-gray-50 shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <span className="font-bold text-gray-900 dark:text-white block truncate">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-gray-400">{p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-500">{p.sku}</td>
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    {formatCurrency(p.discountPrice || p.price)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-extrabold text-xs px-2 py-0.5 rounded-md ${
                        p.stock === 0
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60'
                          : p.stock <= 5
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                      }`}
                    >
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">
                    {p.salesCount || 0}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-slate-800"
                        title="View on Storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
