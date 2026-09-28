import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Package,
  ArrowRight,
  Truck,
  MapPin,
  Calendar,
} from 'lucide-react';
import api from '../../services/api';
import { IOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../utils/toast';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order?.orderNumber || 'ShopSphere'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download invoice PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Order Confirmed
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Thank you for your order!
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          We've received your order and our verified sellers are preparing your package for dispatch.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-gray-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-gray-400 block">Order Number</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Date</span>
            <span className="font-bold text-gray-900 dark:text-white">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Total Amount</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block">Payment Mode</span>
            <span className="font-bold text-gray-900 dark:text-white">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Estimated Delivery Block */}
        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200">
          <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold block">Estimated Delivery Date:</span>
            <span>
              {order.estimatedDeliveryDate
                ? formatDate(order.estimatedDeliveryDate)
                : 'Within 3 - 5 business days'}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Purchased Items
          </h4>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">{item.name}</span>
                    <span className="text-gray-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PDF...' : 'Download Invoice PDF'}</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              to="/orders"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-center"
            >
              View Order History
            </Link>
            <Link
              to="/products"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center shadow-md shadow-indigo-600/20"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
