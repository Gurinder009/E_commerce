import React, { useState, useEffect } from 'react';
import { User, Lock, MapPin, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { IAddress } from '../../types';
import { useToast } from '../../utils/toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'addresses'>('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await api.get('/addresses');
      if (res.data.success) {
        setAddresses(res.data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'addresses') {
      loadAddresses();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await api.put('/users/profile', { name, phone, avatar });
      if (res.data.success) {
        updateUser(res.data.data.user);
        toast.success('Profile details updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      setUpdatingPassword(true);
      const res = await api.put('/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await api.delete(`/addresses/${id}`);
      if (res.data.success) {
        toast.info('Address removed');
        loadAddresses();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await api.put(`/addresses/${id}/default`);
      if (res.data.success) {
        toast.success('Default delivery address set');
        loadAddresses();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage your personal credentials, password, and address book</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-100 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'addresses'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Address Book</span>
        </button>
      </div>

      {/* Profile Details Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-5 max-w-xl">
          <div className="flex items-center space-x-4">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500"
            />
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">{name}</h3>
              <p className="text-xs text-gray-400">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                {user?.role}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800/50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingProfile}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Security & Password Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePassword} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4 max-w-xl">
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-2">Change Password</h3>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              New Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      {/* Address Book Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-xs text-gray-900 dark:text-white">
                      {addr.fullName}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">Phone: {addr.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefaultAddress(addr._id!)}
                      className="text-indigo-600 hover:underline font-bold text-[11px]"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-bold text-[11px]">Primary Address</span>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr._id!)}
                    className="text-rose-600 hover:underline text-[11px] font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
