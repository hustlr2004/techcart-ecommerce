import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { getStoredUser, isAdminUser } from '../../utils/auth';

export default function Header() {
  const { itemCount, toggleCart } = useCart();
  const { wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const user = getStoredUser();
  const showAdmin = isAdminUser(user);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur app-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-black tracking-tight text-white">
          Tech<span className="text-blue-500">Cart</span>
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 font-medium text-slate-200">
            Tech & Gadgets
          </span>
          {showAdmin ? (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/admin"
                className="rounded-full bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-400"
              >
                Admin Panel
              </Link>
            </motion.div>
          ) : null}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={toggleTheme}
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>
          <Link
            to="/my-orders"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            My Orders
          </Link>
          <Link
            to="/wishlist"
            className="relative rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            Wishlist
            {wishlistItems.length > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-bold text-white">
                {wishlistItems.length}
              </span>
            ) : null}
          </Link>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={toggleCart}
            className="relative inline-flex items-center rounded-full bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-400"
          >
            <span className="mr-2">Cart</span>
            <span aria-hidden="true">🛒</span>
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
