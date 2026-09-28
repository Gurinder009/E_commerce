import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  PlusCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const SellerDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/sellers/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Store Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: IndianRupee,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      title: 'Pending Fulfillment',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      title: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60',
    },
    {
      title: 'Active Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Add Product Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Store Analytics & Overview</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time performance analytics for your seller account</p>
        </div>
        <Link
          to="/seller/products/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">{card.title}</span>
                <span className="font-extrabold text-lg text-gray-900 dark:text-white">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Revenue & Orders Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Revenue Trends</h3>
              <p className="text-[11px] text-gray-400">Monthly revenue trajectory (in INR)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlySales || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Monthly Orders Volume</h3>
          <p className="text-[11px] text-gray-400">Total customer orders fulfilled per month</p>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlySales || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Products List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Top Performing Products</h3>
        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {stats?.topProducts?.map((p: any) => (
            <div key={p._id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                  alt={p.name}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 dark:text-white block truncate">{p.name}</span>
                  <span className="text-gray-400">{formatCurrency(p.price)}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-600 block">{p.salesCount} sold</span>
                <span className="text-gray-400 text-[10px]">{p.stock} units remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
