import React, { useEffect, useState } from 'react';
import { RotateCcw, CheckCircle, XCircle, DollarSign, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

interface ReturnItem {
  _id: string;
  order: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  refundAmount?: number;
  adminNote?: string;
  createdAt: string;
}

export const AdminReturnsPage: React.FC = () => {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/returns', {
        params: {
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        },
      });
      setReturns(res.data.data.returns);
    } catch (err) {
      console.error('Error fetching returns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (returnId: string, status: string) => {
    try {
      setActionLoading(returnId);
      await api.put(`/admin/returns/${returnId}/status`, {
        status,
        adminNote: `Status updated to ${status} by admin portal`,
      });
      setMessage(`Return request status updated to ${status}.`);
      setTimeout(() => setMessage(null), 3000);
      fetchReturns();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update return status.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Returns & Refunds Moderation</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Review buyer RMA requests, inspect return reasons, and issue payment refunds.</p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700">
        {['ALL', 'PENDING', 'APPROVED', 'REFUNDED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {st}
          </button>
        ))}
        <button
          onClick={fetchReturns}
          className="p-1.5 ml-auto border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
                <th className="py-3.5 px-4">Refund Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p>Loading return requests...</p>
                  </td>
                </tr>
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No return or refund requests found.
                  </td>
                </tr>
              ) : (
                returns.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 dark:text-white">#{r.order?.orderNumber || 'ORD-REF'}</div>
                      <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{r.user?.name || 'Customer'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{r.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-gray-800 dark:text-gray-200 max-w-xs">{r.reason}</div>
                      {r.adminNote && (
                        <div className="text-[11px] text-gray-400 mt-0.5">Admin: {r.adminNote}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white text-xs">
                      ₹{(r.refundAmount || r.order?.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.status === 'REFUNDED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                        r.status === 'APPROVED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300' :
                        r.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                      }`}>
                        {r.status === 'REFUNDED' && <CheckCircle className="w-3 h-3" />}
                        {r.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(r._id, 'APPROVED')}
                              disabled={actionLoading === r._id}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(r._id, 'REJECTED')}
                              disabled={actionLoading === r._id}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {r.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(r._id, 'REFUNDED')}
                            disabled={actionLoading === r._id}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            Issue Refund
                          </button>
                        )}
                        {(r.status === 'REFUNDED' || r.status === 'REJECTED') && (
                          <span className="text-xs text-gray-400 font-mono">Closed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
