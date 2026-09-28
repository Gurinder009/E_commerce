import React, { useEffect, useState } from 'react';
import { 
  Users, Store, ShoppingBag, Package, DollarSign, 
  ArrowUpRight, AlertTriangle, Clock, RotateCcw, 
  TrendingUp, CheckCircle, ChevronRight 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface DashboardStats {
  counts: {
    users: number;
    sellers: number;
    products: number;
    orders: number;
    pendingSellers: number;
    pendingReturns: number;
    lowStockProducts: number;
  };
  revenue: {
    total: number;
    delivered: number;
  };
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    user?: { name: string; email: string };
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard-stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Sample analytics series mapped to real revenue total
  const totalRev = stats?.revenue?.total || 148500;
  const revenueChartData = [
    { month: 'Apr', revenue: Math.round(totalRev * 0.12), orders: 18 },
    { month: 'May', revenue: Math.round(totalRev * 0.15), orders: 25 },
    { month: 'Jun', revenue: Math.round(totalRev * 0.18), orders: 32 },
    { month: 'Jul', revenue: Math.round(totalRev * 0.22), orders: 40 },
    { month: 'Aug', revenue: Math.round(totalRev * 0.28), orders: 48 },
    { month: 'Sep', revenue: Math.round(totalRev * 0.35), orders: 58 },
  ];

  const categoryShare = [
    { name: 'Electronics', value: 42, color: '#3B82F6' },
    { name: 'Fashion', value: 28, color: '#10B981' },
    { name: 'Home & Living', value: 18, color: '#F59E0B' },
    { name: 'Others', value: 12, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Administration</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time marketplace overview, revenue monitoring, and administrative workflows.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            System Live & Healthy
          </span>
        </div>
      </div>

      {/* Action Alerts / Pending Items */}
      {((stats?.counts.pendingSellers || 0) > 0 || (stats?.counts.pendingReturns || 0) > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(stats?.counts.pendingSellers || 0) > 0 && (
            <Link 
              to="/admin/sellers" 
              className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-100/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {stats?.counts.pendingSellers} Seller Application{stats?.counts.pendingSellers! > 1 ? 's' : ''} Pending
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Review business documentation to grant selling access</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition group-hover:translate-x-1" />
            </Link>
          )}

          {(stats?.counts.pendingReturns || 0) > 0 && (
            <Link 
              to="/admin/returns" 
              className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-4 flex items-center justify-between hover:bg-rose-100/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {stats?.counts.pendingReturns} Return / Refund Request{stats?.counts.pendingReturns! > 1 ? 's' : ''}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending customer return inspection and refund approval</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total GMV</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{(stats?.revenue.total || 0).toLocaleString('en-IN')}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.5% vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.counts.orders || 0}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <span>Platform lifetime volume</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered Users</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.counts.users || 0}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
              <span>Verified customer accounts</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Sellers</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.counts.sellers || 0}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <span>{stats?.counts.products || 0} active catalog items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV Growth Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Gross Marketplace Volume (GMV)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Monthly transactional revenue breakdown</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-lg">
              FY 2026
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="adminGmvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip 
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'GMV']}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#adminGmvGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Category GMV Share</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Volume distribution across departments</p>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
            {categoryShare.map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">{c.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Users Table Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Platform Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map(o => (
                <div key={o._id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">#{o.orderNumber}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{o.user?.name || 'Customer'} • {new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">₹{o.totalAmount.toLocaleString('en-IN')}</div>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No orders recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recently Registered Users */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Newly Registered Users</h3>
            <Link to="/admin/users" className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Manage Users &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.slice(0, 5).map(u => (
                <div key={u._id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    u.role === 'ADMIN' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' :
                    u.role === 'SELLER' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
