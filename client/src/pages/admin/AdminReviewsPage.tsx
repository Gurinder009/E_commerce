import React, { useEffect, useState } from 'react';
import { Star, ShieldAlert, Trash2, CheckCircle, RefreshCw, MessageSquare, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

interface ReviewItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    images?: string[];
  };
  rating: number;
  title: string;
  comment: string;
  reported: boolean;
  createdAt: string;
}

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reported-reviews');
      setReviews(res.data.data.reviews || []);
    } catch (err) {
      console.error('Error fetching reported reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this reported review? The product average rating will be recalculated automatically.')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setMessage('Review deleted successfully.');
      setTimeout(() => setMessage(null), 3000);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Moderation</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Review community feedback, moderate flagged content, and maintain authentic store ratings.</p>
        </div>
        <button
          onClick={fetchReviews}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Reviews list */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Reported / Flagged Customer Feedback Queue</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p>Scanning feedback...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-gray-800 dark:text-gray-200">All clear!</p>
              <p className="text-xs text-gray-400 mt-1">No flagged or abusive customer reviews pending moderation.</p>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= r.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{r.title || 'Review'}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      FLAGGED
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "{r.comment}"
                  </p>

                  <div className="text-xs text-gray-400 flex items-center gap-2 pt-1">
                    <span>By: <strong className="text-gray-700 dark:text-gray-200">{r.user?.name || 'Customer'}</strong></span>
                    <span>•</span>
                    <span>Product: <strong className="text-gray-700 dark:text-gray-200">{r.product?.name || 'Marketplace Item'}</strong></span>
                    <span>•</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Review</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
