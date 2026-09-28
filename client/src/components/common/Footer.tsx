import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Send } from 'lucide-react';
import { useToast } from '../../utils/toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to ShopSphere insider perks!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800/80 text-gray-600 dark:text-gray-400 text-xs">
      {/* Value Proposition Highlights Banner */}
      <div className="border-b border-gray-100 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-xs">Free Nationwide Shipping</h4>
              <p className="text-[11px] text-gray-500">On all prepaid orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-xs">100% Genuine Products</h4>
              <p className="text-[11px] text-gray-500">Directly sourced from verified sellers</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-xs">Hassle-Free Returns</h4>
              <p className="text-[11px] text-gray-500">7-day replacement & easy refund policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-xs">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-gray-500">Always here via chat and helpline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">ShopSphere</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-sm">
              India's premier next-generation multi-vendor e-commerce marketplace engineered for authentic products, lightning-fast fulfillment, and seller prosperity.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2 max-w-sm">
              <span className="text-xs font-semibold text-gray-900 dark:text-white block">
                Subscribe for exclusive discounts & product drops:
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center space-x-1 shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Shop Categories
            </h4>
            <ul className="space-y-2">
              <li><Link to="/products?category=electronics" className="hover:text-indigo-600 transition-colors">Electronics & Gadgets</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-indigo-600 transition-colors">Fashion & Apparel</Link></li>
              <li><Link to="/products?category=home-living" className="hover:text-indigo-600 transition-colors">Home & Living</Link></li>
              <li><Link to="/products?category=beauty" className="hover:text-indigo-600 transition-colors">Beauty & Personal Care</Link></li>
              <li><Link to="/products?category=sports" className="hover:text-indigo-600 transition-colors">Sports & Fitness</Link></li>
              <li><Link to="/products?category=appliances" className="hover:text-indigo-600 transition-colors">Smart Appliances</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li><Link to="/orders" className="hover:text-indigo-600 transition-colors">Track My Order</Link></li>
              <li><Link to="/orders" className="hover:text-indigo-600 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-600 transition-colors">My Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-600 transition-colors">Account Settings</Link></li>
              <li><a href="#help" onClick={(e) => { e.preventDefault(); toast.info("ShopSphere Help Desk: support@shopsphere.demo"); }} className="hover:text-indigo-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Seller & Business */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Seller Central
            </h4>
            <ul className="space-y-2">
              <li><Link to="/seller/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sell on ShopSphere</Link></li>
              <li><Link to="/seller" className="hover:text-indigo-600 transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-600 transition-colors">Platform Admin</Link></li>
              <li><a href="#policy" onClick={(e) => { e.preventDefault(); toast.info("ShopSphere Zero Fee Onboarding for verified sellers."); }} className="hover:text-indigo-600 transition-colors">Seller Protection Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} ShopSphere Marketplace Inc. All rights reserved. B.Tech CSE Final Year Major Project.
          </div>

          {/* Payment Trust Indicators */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-400">100% Secure Checkout:</span>
            <span className="px-2 py-0.5 rounded border border-gray-200 dark:border-slate-800 font-bold bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300">UPI</span>
            <span className="px-2 py-0.5 rounded border border-gray-200 dark:border-slate-800 font-bold bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300">RuPay</span>
            <span className="px-2 py-0.5 rounded border border-gray-200 dark:border-slate-800 font-bold bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300">Visa</span>
            <span className="px-2 py-0.5 rounded border border-gray-200 dark:border-slate-800 font-bold bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300">Mastercard</span>
            <span className="px-2 py-0.5 rounded border border-gray-200 dark:border-slate-800 font-bold bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
