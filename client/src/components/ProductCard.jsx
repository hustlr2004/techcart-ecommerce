import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import { useWishlist } from '../context/WishlistContext';
import { getStoredUser } from '../utils/auth';

function renderStars(rating) {
  const rounded = Math.round(rating || 0);
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rounded ? 'text-yellow-400' : 'text-slate-300'}>
      ★
    </span>
  ));
}

export default function ProductCard({ product, index = 0 }) {
  const { dispatch, openCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const image = product.images?.[0] || 'https://placehold.co/600x400?text=No+Image';
  const comparePrice = Number(product.comparePrice || 0);
  const discountPercentage =
    comparePrice > Number(product.price)
      ? Math.round(((comparePrice - Number(product.price)) / comparePrice) * 100)
      : 0;
  const inWishlist = wishlistIds.has(product._id);

  function handleAddToCart() {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image,
        qty: 1,
      },
    });
    openCart();
  }

  async function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!getStoredUser() || !localStorage.getItem('token')) {
      window.alert('Please log in to save items to your wishlist.');
      return;
    }

    try {
      await toggleWishlist(product._id);
    } catch (error) {
      window.alert(error.response?.data?.message || 'Failed to update wishlist');
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1, ease: 'easeOut' }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-slate-100">
        {discountPercentage > 0 ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            {discountPercentage}% OFF
          </span>
        ) : null}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border text-lg shadow-lg transition ${
            inWishlist
              ? 'border-red-200 bg-white text-red-500'
              : 'border-white/60 bg-slate-950/70 text-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          ♥
        </button>
        <img
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
          src={image}
          alt={product.name}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {product.category}
            </span>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <Link to={`/product/${product._id}`} className="block text-lg font-semibold text-slate-900 transition group-hover:text-blue-600">
            {product.name}
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex">{renderStars(product.ratings)}</div>
            <span className="text-slate-500">({product.numReviews} reviews)</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-2xl font-bold text-slate-900">{formatINR(product.price)}</p>
            {comparePrice > Number(product.price) ? (
              <p className="text-sm text-slate-400 line-through">{formatINR(comparePrice)}</p>
            ) : null}
          </div>
          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
