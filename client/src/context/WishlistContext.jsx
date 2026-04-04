import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    let active = true;

    async function loadWishlist() {
      if (!token) {
        setWishlistItems([]);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get('/api/wishlist');
        if (active) {
          setWishlistItems(data);
        }
      } catch {
        if (active) {
          setWishlistItems([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWishlist();
    return () => {
      active = false;
    };
  }, [token]);

  async function toggleWishlist(productId) {
    const { data } = await api.post('/api/wishlist/toggle', { productId });
    setWishlistItems(data.wishlist || []);
    return data.inWishlist;
  }

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item._id)),
    [wishlistItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistIds,
      loading,
      toggleWishlist,
    }),
    [wishlistItems, wishlistIds, loading]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
