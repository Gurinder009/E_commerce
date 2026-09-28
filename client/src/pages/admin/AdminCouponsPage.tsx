import React, { useEffect, useState } from 'react';
import { Tag, Plus, Trash2, Calendar, CheckCircle, Percent, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';

interface CouponItem {
  _id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountAmount: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountAmount, setDiscountAmount] = useState(15);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(999);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(500);
  const [endDate, setEndDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState(500);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data.data.coupons);
    } catch (err) {
      console.error('Error fetching admin coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/coupons', {
        code: code.toUpperCase(),
        discountType,
        discountAmount: Number(discountAmount),
        minPurchaseAmount: Number(minPurchaseAmount),
        maxDiscountAmount: discountType === 'PERCENTAGE' ? Number(maxDiscountAmount) : undefined,
        startDate: new Date().toISOString(),
        endDate: new Date(endDate).toISOString(),
        usageLimit: Number(usageLimit),
        isActive: true,
      });
      setMessage(`Coupon "${code.toUpperCase()}" generated successfully!`);
      setShowModal(false);
      setCode('');
      setTimeout(() => setMessage(null), 3000);
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (couponId: string, couponCode: string) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;
    try {
      await api.delete(`/coupons/${couponId}`);
      setMessage(`Coupon "${couponCode}" removed.`);
      setTimeout(() => setMessage(null), 3000);
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotional Coupons</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Issue and govern platform-wide discounts, referral codes, and festive campaigns.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          ))
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            No active discount campaigns configured.
          </div>
        ) : (
          coupons.map((c) => (
            <div
              key={c._id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-sm font-mono font-bold rounded-lg tracking-wider">
                      {c.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountAmount}% OFF` : `₹${c.discountAmount} FLAT OFF`}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Min order ₹{c.minPurchaseAmount.toLocaleString('en-IN')}
                    {c.maxDiscountAmount ? ` • Max discount ₹${c.maxDiscountAmount}` : ''}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(c._id, c.code)}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Valid till {new Date(c.endDate).toLocaleDateString()}</span>
                </div>
                <span>Used: {c.usedCount} / {c.usageLimit}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Create Platform Coupon
            </h2>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minPurchaseAmount}
                    onChange={(e) => setMinPurchaseAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Issue Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
