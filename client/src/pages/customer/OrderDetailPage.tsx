import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  CreditCard,
  X,
} from 'lucide-react';
import api from '../../services/api';
import { IOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../utils/toast';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Return request modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const toast = useToast();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      setDownloading(true);
      const res = await api.get(`/orders/${order._id}/invoice`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded!');
    } catch (e) {
      toast.error('Failed to download invoice.');
    } finally {
      setDownloading(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !returnReason.trim()) return;

    try {
      setSubmittingReturn(true);
      const res = await api.post(`/orders/${order._id}/return`, {
        reason: returnReason.trim(),
      });
      if (res.data.success) {
        toast.success('Return request submitted for admin and seller verification.');
        setIsReturnModalOpen(false);
        fetchOrder();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link to="/orders" className="text-indigo-600 text-xs font-bold mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <Link
            to="/orders"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-gray-400">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {order.orderStatus === 'DELIVERED' && !order.returnRequestedAt && (
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Return / Refund</span>
            </button>
          )}

          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Downloading...' : 'Tax Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Visual Order Timeline Tracker */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Fulfillment Timeline</h3>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
            {steps.map((st, idx) => {
              const isPassed = currentStepIndex >= idx && order.orderStatus !== 'CANCELLED';
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={st.key} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}
                  >
                    {isPassed ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      isPassed ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {order.trackingNumber && (
          <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>
                Courier: <strong>{order.courierPartner || 'Delhivery'}</strong> | Tracking:{' '}
                <strong>{order.trackingNumber}</strong>
              </span>
            </div>
            <span className="font-bold text-emerald-600">Active Transit</span>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Shipping Destination</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              {order.shippingAddress.fullName}
            </h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-xs text-gray-400 mt-2">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Payment Summary</span>
          </div>
          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Mode</span>
              <span className="font-bold text-gray-900 dark:text-white">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status</span>
              <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({order.couponCode || 'Coupon'})</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST Tax (18%)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-slate-800 text-sm">
              <span>Total Paid</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Items in this Package</h3>
        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                  alt={item.name}
                  className="w-14 h-14 rounded-2xl object-cover bg-gray-50 shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 dark:text-white block truncate">
                    {item.name}
                  </span>
                  <span className="text-gray-400">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="font-bold text-gray-900 dark:text-white shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Return Request Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Request Return / Refund
              </h3>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
              <p className="text-gray-500">
                Please describe the issue with your item (e.g. damaged in transit, defective, or incorrect size).
              </p>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Reason for Return *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details about why you are returning this product..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold disabled:opacity-50"
                >
                  {submittingReturn ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
