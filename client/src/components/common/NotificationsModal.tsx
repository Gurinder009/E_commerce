import React, { useEffect, useState } from 'react';
import { X, Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { INotification } from '../../types';
import { formatDate } from '../../utils/formatters';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadAny?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onReadAny,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onReadAny?.();
    } catch (e) {
      console.error(e);
    }
  };

  const markOneRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      onReadAny?.();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-xs text-gray-500">Live order & account updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 space-y-3 flex-1">
          {loading ? (
            <div className="text-center py-8 text-sm text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`pt-3 first:pt-0 flex items-start justify-between gap-3 ${
                  !n.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20 p-2 rounded-xl' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={onClose}
                      className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="View details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      onClick={() => markOneRead(n._id)}
                      className="p-1 text-gray-400 hover:text-emerald-600"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
