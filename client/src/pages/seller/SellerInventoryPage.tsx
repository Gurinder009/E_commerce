import React, { useEffect, useState } from 'react';
import { Layers, AlertTriangle, Check, Search, Save } from 'lucide-react';
import api from '../../services/api';
import { IProduct } from '../../types';
import { useToast } from '../../utils/toast';

export const SellerInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const toast = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'all' ? '/sellers/inventory' : `/sellers/inventory?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.data.success) {
        const list: IProduct[] = res.data.data || [];
        setProducts(list);
        const map: Record<string, number> = {};
        list.forEach((p) => {
          map[p._id] = p.stock;
        });
        setStockInputs(map);
      }
    } catch (e: any) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filterStatus]);

  const handleSaveStock = async (productId: string) => {
    try {
      setSavingId(productId);
      const newStock = stockInputs[productId];
      const res = await api.put(`/sellers/inventory/${productId}/stock`, {
        stock: newStock,
      });
      if (res.data.success) {
        toast.success('Stock count updated');
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Inventory & Warehouse</h1>
          <p className="text-xs text-gray-500 mt-1">Monitor real-time product stock, low-stock thresholds, and re-orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilterStatus('low_stock')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'low_stock'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-600'
            }`}
          >
            Low Stock (≤5)
          </button>
          <button
            onClick={() => setFilterStatus('out_of_stock')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'out_of_stock'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-600'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-slate-800/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Item</th>
                  <th className="py-3.5 px-4 font-bold">SKU</th>
                  <th className="py-3.5 px-4 font-bold">Current Stock</th>
                  <th className="py-3.5 px-4 font-bold">Quick Update</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {products.map((p) => {
                  const currentInput = stockInputs[p._id] ?? p.stock;
                  const isModified = currentInput !== p.stock;

                  return (
                    <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover bg-gray-50 shrink-0"
                          />
                          <span className="font-bold text-gray-900 dark:text-white truncate max-w-xs block">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">{p.sku}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-black text-xs px-2.5 py-1 rounded-md inline-block ${
                            p.stock === 0
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60'
                              : p.stock <= 5
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          min={0}
                          value={currentInput}
                          onChange={(e) =>
                            setStockInputs({ ...stockInputs, [p._id]: Number(e.target.value) })
                          }
                          className="w-24 px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleSaveStock(p._id)}
                          disabled={!isModified || savingId === p._id}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center space-x-1 ml-auto"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingId === p._id ? 'Saving...' : 'Update'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
