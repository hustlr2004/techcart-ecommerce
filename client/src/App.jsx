import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import MotionPage from './components/MotionPage';
import CartDrawer from './components/CartDrawer';

function AnimatedRoutes() {
  const location = useLocation();
  const withMotion = (element) => <MotionPage>{element}</MotionPage>;

  return (
    <>
      <CartDrawer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={withMotion(<Home />)} />
          <Route path="/product/:id" element={withMotion(<ProductDetail />)} />
          <Route path="/cart" element={withMotion(<Cart />)} />
          <Route path="/wishlist" element={withMotion(<Wishlist />)} />
          <Route path="/checkout" element={withMotion(<Checkout />)} />
          <Route path="/order-success" element={withMotion(<OrderSuccess />)} />
          <Route path="/my-orders" element={withMotion(<MyOrders />)} />
          <Route path="/order/:id" element={withMotion(<OrderDetail />)} />
          <Route
            path="/admin"
            element={withMotion(
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/products"
            element={withMotion(
              <AdminRoute>
                <ManageProducts />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/orders"
            element={withMotion(
              <AdminRoute>
                <ManageOrders />
              </AdminRoute>
            )}
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
