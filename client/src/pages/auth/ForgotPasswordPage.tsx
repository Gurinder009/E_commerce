import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../utils/toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSubmitted(true);
        if (res.data.data?.devResetToken) {
          setDevToken(res.data.data.devResetToken);
        }
        toast.success('Password reset instructions generated.');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">ShopSphere</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-2">Reset Password</h2>
          <p className="text-xs text-gray-500">
            Enter your email and we'll send you recovery instructions.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4 text-center">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Check Your Inbox</h3>
            <p className="text-xs text-gray-500">
              If an account exists with <strong>{email}</strong>, a recovery link has been dispatched.
            </p>

            {devToken && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-left border border-amber-200 dark:border-amber-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 block">
                  🛠️ Development Testing Token:
                </span>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold underline break-all block"
                >
                  Click here to proceed with reset: {devToken.substring(0, 16)}...
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
