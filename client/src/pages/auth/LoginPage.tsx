import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck, Store, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../utils/toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const toast = useToast();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'ADMIN' && redirect === '/') {
        navigate('/admin');
      } else if (user.role === 'SELLER' && redirect === '/') {
        navigate('/seller');
      } else {
        navigate(redirect);
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">ShopSphere</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-2">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to manage your orders, store, or platform</p>
        </div>

        {/* Demo Credentials Quick Switcher Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
            ⚡ Quick Demo Logins (Viva & Evaluation):
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleAutofill('customer@shopsphere.demo', 'Customer@12345')}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 text-left hover:border-indigo-500 transition-colors shadow-2xs"
            >
              <div className="flex items-center space-x-1 text-indigo-600 font-bold text-[11px]">
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </div>
              <p className="text-[9px] text-gray-400 truncate mt-0.5">customer@shopsphere.demo</p>
            </button>

            <button
              type="button"
              onClick={() => handleAutofill('seller@shopsphere.demo', 'Seller@12345')}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-colors shadow-2xs"
            >
              <div className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                <Store className="w-3.5 h-3.5" />
                <span>Seller</span>
              </div>
              <p className="text-[9px] text-gray-400 truncate mt-0.5">seller@shopsphere.demo</p>
            </button>

            <button
              type="button"
              onClick={() => handleAutofill('admin@shopsphere.demo', 'Admin@12345')}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 text-left hover:border-purple-500 transition-colors shadow-2xs"
            >
              <div className="flex items-center space-x-1 text-purple-600 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </div>
              <p className="text-[9px] text-gray-400 truncate mt-0.5">admin@shopsphere.demo</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
