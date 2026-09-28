import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore our certified catalogs, discover trending deals, and add your favorite items to bag.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-1">Review your selected items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:underline flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => (
            <div
              key={`${item.product._id}-${item.variantSku || ''}`}
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-gray-50 dark:bg-slate-800"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                    {item.product.brand}
                  </span>
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="font-bold text-sm text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <span className="text-xs text-gray-400 font-semibold mt-1 block">
                    Unit: {formatCurrency(item.price)}
                  </span>
                </div>
              </div>

              {/* Quantity controls and Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-slate-800">
                <div className="flex items-center space-x-2 border border-gray-200 dark:border-slate-700 rounded-xl px-2 py-1 bg-white dark:bg-slate-950">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="text-gray-500 hover:text-indigo-600 disabled:opacity-30 p-1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="text-gray-500 hover:text-indigo-600 disabled:opacity-30 p-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-gray-900 dark:text-white block">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-[11px] text-gray-400 hover:text-rose-600 mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center space-y-1">
              <Truck className="w-5 h-5 mx-auto text-indigo-500" />
              <span className="font-bold text-xs text-gray-900 dark:text-white block">Free Shipping</span>
              <p className="text-[10px] text-gray-400">On all orders above ₹999</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center space-y-1">
              <RotateCcw className="w-5 h-5 mx-auto text-emerald-500" />
              <span className="font-bold text-xs text-gray-900 dark:text-white block">7-Day Return</span>
              <p className="text-[10px] text-gray-400">Doorstep replacement</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center space-y-1">
              <ShieldCheck className="w-5 h-5 mx-auto text-purple-500" />
              <span className="font-bold text-xs text-gray-900 dark:text-white block">Buyer Shield</span>
              <p className="text-[10px] text-gray-400">Escrow backed payments</p>
            </div>
          </div>
        </div>

        {/* Right: Order Financial Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Order Summary</h3>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Discount Voucher</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (FESTIVE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (couponInput.trim()) applyCoupon(couponInput);
                  }}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {cart.couponCode && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-2.5 rounded-xl">
                <span>Voucher <strong>{cart.couponCode}</strong> applied (-{formatCurrency(cart.couponDiscount)})</span>
                <button onClick={removeCoupon} className="font-bold text-emerald-800 hover:underline">
                  Remove
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(cart.subtotal)}</span>
              </div>

              {cart.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Savings</span>
                  <span>-{formatCurrency(cart.couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span>{formatCurrency(cart.tax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{cart.shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(cart.shippingFee)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-xl text-indigo-600 dark:text-indigo-400 font-black">
                  {formatCurrency(cart.grandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
