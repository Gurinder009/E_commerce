import React, { useEffect, useState } from 'react';
import { Store, CheckCircle, XCircle, AlertTriangle, ShieldAlert, RefreshCw, Mail, Phone, ExternalLink } from 'lucide-react';
import api from '../../services/api';

interface SellerItem {
  _id: string;
  storeName: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  businessEmail: string;
  description?: string;
  address?: string;
  totalProducts?: number;
  totalRevenue?: number;
  rating?: number;
  createdAt: string;
}

export const AdminSellersPage: React.FC = () => {
  const [sellers, setSellers] = useState<SellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSellers();
  }, [page, statusFilter]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/sellers', {
        params: {
          page,
          limit: 10,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        },
      });
      setSellers(res.data.data.sellers);
      setTotalPages(res.data.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (sellerId: string, newStatus: string) => {
    try {
      setActionLoading(sellerId);
      await api.put(`/admin/sellers/${sellerId}/status`, { status: newStatus });
      setMessage(`Seller status changed to ${newStatus} successfully.`);
      setTimeout(() => setMessage(null), 3000);
      fetchSellers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update seller status.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Review vendor applications, manage storefront verification and catalog permissions.</p>
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
        {['ALL', 'PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {st}
          </button>
        ))}
        <button
          onClick={fetchSellers}
          className="p-2 ml-auto border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sellers Grid/Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Store & Vendor</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p>Loading vendors...</p>
                  </td>
                </tr>
              ) : sellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No sellers found for this filter.
                  </td>
                </tr>
              ) : (
                sellers.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            {s.storeName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Owner: <span className="font-medium text-gray-700 dark:text-gray-300">{s.user?.name || 'Seller'}</span>
                          </div>
                          {s.description && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-sm">{s.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs space-y-0.5">
                        <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {s.businessEmail || s.user?.email}
                        </div>
                        {s.user?.phone && (
                          <div className="text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {s.user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                        s.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                        s.status === 'SUSPENDED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {s.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                        {s.status === 'PENDING' && <AlertTriangle className="w-3 h-3" />}
                        {s.status === 'SUSPENDED' && <ShieldAlert className="w-3 h-3" />}
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(s._id, 'APPROVED')}
                              disabled={actionLoading === s._id}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(s._id, 'REJECTED')}
                              disabled={actionLoading === s._id}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {s.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(s._id, 'SUSPENDED')}
                            disabled={actionLoading === s._id}
                            className="px-3 py-1.5 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold rounded-lg transition"
                          >
                            Suspend
                          </button>
                        )}
                        {(s.status === 'SUSPENDED' || s.status === 'REJECTED') && (
                          <button
                            onClick={() => handleUpdateStatus(s._id, 'APPROVED')}
                            disabled={actionLoading === s._id}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                          >
                            Re-activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
