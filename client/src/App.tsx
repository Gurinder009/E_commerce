import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ToastProvider } from './utils/toast';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { SellerLayout } from './layouts/SellerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer & Public Pages
import { HomePage } from './pages/customer/HomePage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Seller Pages
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage';
import { SellerProductsPage } from './pages/seller/SellerProductsPage';
import { SellerAddProductPage } from './pages/seller/SellerAddProductPage';
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage';
import { SellerInventoryPage } from './pages/seller/SellerInventoryPage';
import { SellerCouponsPage } from './pages/seller/SellerCouponsPage';
import { SellerSettingsPage } from './pages/seller/SellerSettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSellersPage } from './pages/admin/AdminSellersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminReturnsPage } from './pages/admin/AdminReturnsPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SocketProvider>
                <BrowserRouter>
                <Routes>
                  {/* Public & Customer Routes wrapped in MainLayout */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    
                    {/* Protected Customer Routes */}
                    <Route 
                      path="/wishlist" 
                      element={
                        <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                          <WishlistPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/checkout" 
                      element={
                        <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/order-confirmation/:id" 
                      element={
                        <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                          <OrderConfirmationPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders" 
                      element={
                        <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                          <OrdersPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders/:id" 
                      element={
                        <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                          <OrderDetailPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                  {/* Seller Dashboard Routes (Protected: SELLER, ADMIN) */}
                  <Route
                    path="/seller"
                    element={
                      <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                        <SellerLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/seller/dashboard" replace />} />
                    <Route path="dashboard" element={<SellerDashboardPage />} />
                    <Route path="products" element={<SellerProductsPage />} />
                    <Route path="products/add" element={<SellerAddProductPage />} />
                    <Route path="orders" element={<SellerOrdersPage />} />
                    <Route path="inventory" element={<SellerInventoryPage />} />
                    <Route path="coupons" element={<SellerCouponsPage />} />
                    <Route path="settings" element={<SellerSettingsPage />} />
                  </Route>

                  {/* Admin Dashboard Routes (Protected: ADMIN only) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="sellers" element={<AdminSellersPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="returns" element={<AdminReturnsPage />} />
                    <Route path="coupons" element={<AdminCouponsPage />} />
                    <Route path="reviews" element={<AdminReviewsPage />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </SocketProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
);
}
