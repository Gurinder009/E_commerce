import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Shopping Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                {cart?.items?.length || 0}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Your cart is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Looks like you haven't added any products to your bag yet.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={`${item.product._id}-${item.variantSku || ''}`}
                  className="flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40"
                >
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 bg-white dark:bg-slate-800"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/products/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-semibold text-gray-900 dark:text-white truncate block hover:text-indigo-600"
                      >
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.product.brand}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(item.price)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 hover:text-indigo-600 text-gray-500 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 hover:text-indigo-600 text-gray-500 disabled:opacity-30"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-950/60 space-y-3">
              {/* Coupon Row */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. FESTIVE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (couponInput.trim()) applyCoupon(couponInput);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Apply
                </button>
              </div>

              {cart.couponCode && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-2 rounded-lg">
                  <span>Coupon {cart.couponCode} applied (-{formatCurrency(cart.couponDiscount)})</span>
                  <button onClick={removeCoupon} className="text-emerald-800 dark:text-emerald-200 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(cart.subtotal)}</span>
                </div>
                {cart.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(cart.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span>{formatCurrency(cart.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{cart.shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(cart.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-base text-indigo-600 dark:text-indigo-400">{formatCurrency(cart.grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
