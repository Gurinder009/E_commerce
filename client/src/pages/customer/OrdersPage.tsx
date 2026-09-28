import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Download,
  RotateCcw,
  XCircle,
  ExternalLink,
  Truck,
  CheckCircle,
  Clock,
} from 'lucide-react';
import api from '../../services/api';
import { IOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../utils/toast';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (e: any) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancellingId(orderId);
      const res = await api.put(`/orders/${orderId}/cancel`, {
        reason: 'Cancelled by customer from order history',
      });
      if (res.data.success) {
        toast.success('Order cancelled successfully.');
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadInvoice = async (orderId: string, orderNumber: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded!');
    } catch (e) {
      toast.error('Failed to download invoice.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';
      case 'RETURN_REQUESTED':
      case 'RETURNED':
      case 'REFUNDED':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-slate-800 dark:text-gray-300 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Order History</h1>
          <p className="text-xs text-gray-500 mt-1">Track fulfillment status, invoices, and returns</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          {orders.length} Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-3">
          <Package className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-base text-gray-900 dark:text-white">No orders placed yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            When you purchase products from ShopSphere, they will show up here along with live tracking.
          </p>
          <Link
            to="/products"
            className="mt-3 inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4"
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800 text-xs">
                <div className="flex items-center space-x-3">
                  <div>
                    <span className="text-gray-400 block text-[10px]">ORDER ID</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{order.orderNumber}</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-gray-400 block text-[10px]">DATE PLACED</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">TOTAL</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-50 dark:bg-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-gray-400 text-[11px]">
                          Qty: {item.quantity} • {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <div className="text-gray-400 flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>
                    {order.courierPartner || 'Delhivery Express'}{' '}
                    {order.trackingNumber && `(${order.trackingNumber})`}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Cancel Button if eligible */}
                  {['PLACED', 'CONFIRMED'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="text-rose-600 hover:underline flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}</span>
                    </button>
                  )}

                  {/* Invoice Download */}
                  <button
                    onClick={() => handleDownloadInvoice(order._id, order.orderNumber)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 flex items-center space-x-1 hover:underline"
                    title="Download Tax Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>

                  {/* View Details Link */}
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center space-x-1"
                  >
                    <span>Timeline & Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
