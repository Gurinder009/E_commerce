import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Image as ImageIcon, Check } from 'lucide-react';
import api from '../../services/api';
import { ICategory } from '../../types';
import { useToast } from '../../utils/toast';

export const SellerAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [sku, setSku] = useState(`SKU-${Date.now().toString().slice(-6)}`);
  const [description, setDescription] = useState('');
  const [imagesInput, setImagesInput] = useState(
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
  );
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setCategory(res.data.data[0]._id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error('Please select a product category');
      return;
    }

    try {
      setLoading(true);
      const imagesArray = imagesInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.post('/products', {
        name,
        category,
        brand,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        stock: Number(stock),
        sku,
        description,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      if (res.data.success) {
        toast.success('Product successfully published to marketplace catalog!');
        navigate('/seller/products');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-slate-800">
        <button
          onClick={() => navigate('/seller/products')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Add New Product</h1>
          <p className="text-xs text-gray-500">Publish a new item to the ShopSphere marketplace catalog</p>
        </div>
      </div>

      <form onSubmit={handleCreateProduct} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-5">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Product Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apex Ultra Wireless Noise-Cancelling Headphones"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sony, Apple, Nike"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Original Price (₹) *
            </label>
            <input
              type="number"
              required
              min={1}
              placeholder="19999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Discounted Price (₹ Optional)
            </label>
            <input
              type="number"
              min={1}
              placeholder="14999"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Initial Stock Units *
            </label>
            <input
              type="number"
              required
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            SKU Code (Inventory Identifier) *
          </label>
          <input
            type="text"
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Product Images (one URL per line) *
          </label>
          <textarea
            required
            rows={3}
            placeholder="https://images.unsplash.com/photo-..."
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Full Product Description *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Describe product materials, specifications, warranty, and features in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Keywords / Search Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="audio, wireless, bluetooth, anc, studio"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
