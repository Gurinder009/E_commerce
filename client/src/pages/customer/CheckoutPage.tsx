import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Plus,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Banknote,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { IAddress, PaymentMethod } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../utils/toast';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // New Address Modal / Form state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newFullName, setNewFullName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '9876543210');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Karnataka');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newType, setNewType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/addresses');
        if (res.data.success) {
          const list: IAddress[] = res.data.data || [];
          setAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          if (defaultAddr?._id) {
            setSelectedAddressId(defaultAddr._id);
          } else {
            setShowNewAddressForm(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', {
        fullName: newFullName,
        phone: newPhone,
        street: newStreet,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        type: newType,
        isDefault: addresses.length === 0,
      });

      if (res.data.success) {
        const created: IAddress = res.data.data;
        setAddresses((prev) => [created, ...prev]);
        setSelectedAddressId(created._id!);
        setShowNewAddressForm(false);
        toast.success('Address saved successfully!');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select or provide a delivery address.');
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Your shopping cart is empty.');
      navigate('/products');
      return;
    }

    try {
      setPlacingOrder(true);

      // 1. Create order on backend
      const res = await api.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod,
      });

      if (res.data.success) {
        const order = res.data.data;

        // If online payment, simulate / verify gateway transaction
        if (paymentMethod === 'ONLINE') {
          // Trigger mock intent and verify
          await api.post('/payments/verify', {
            orderId: order._id,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpayOrderId: `order_mock_${Date.now()}`,
          });
        }

        await refreshCart();
        toast.success('Order placed successfully!');
        navigate(`/order-success/${order._id}`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-xs text-gray-500 mt-4">Preparing checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Secure Checkout</h1>
          <p className="text-xs text-gray-500 mt-0.5">Enter delivery destination and select payment method</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encryption</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Address Selection & Payment Methods */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Shipping Address</h3>
              </div>
              <button
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showNewAddressForm ? 'Select Saved Address' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Address Selection Cards */}
            {!showNewAddressForm && addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id!)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                          : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-xs text-gray-900 dark:text-white">{addr.fullName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 font-medium">Phone: {addr.phone}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <form onSubmit={handleAddNewAddress} className="pt-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Street Address / Flat / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 102 Crystal Towers, Residency Road"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bangalore"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="560001"
                      value={newPostalCode}
                      onChange={(e) => setNewPostalCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    Save & Use This Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  paymentMethod === 'COD'
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
                }`}
              >
                {paymentMethod === 'COD' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">Cash on Delivery</h4>
                    <p className="text-[11px] text-gray-500">Pay cash upon delivery at your doorstep</p>
                  </div>
                </div>
              </div>

              {/* Online Payment */}
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  paymentMethod === 'ONLINE'
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
                }`}
              >
                {paymentMethod === 'ONLINE' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                      Online Payment (UPI / Cards / NetBanking)
                    </h4>
                    <p className="text-[11px] text-gray-500">Instant verification via secure Razorpay checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Preview & Place Order CTA */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Order Items</h3>

            {/* Mini items list */}
            <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-56 overflow-y-auto pr-1 space-y-2">
              {cart?.items.map((item) => (
                <div key={item.product._id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{item.product.name}</p>
                      <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(cart?.subtotal || 0)}</span>
              </div>
              {cart && cart.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon ({cart.couponCode})</span>
                  <span>-{formatCurrency(cart.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>{formatCurrency(cart?.tax || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{cart?.shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(cart?.shippingFee || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-slate-800">
                <span>Total Payable</span>
                <span className="text-xl text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(cart?.grandTotal || 0)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>{placingOrder ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
