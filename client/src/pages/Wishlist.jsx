import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { wishlistItems, loading } = useWishlist();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500">Saved For Later</p>
          <h1 className="text-3xl font-bold">Your wishlist</h1>
        </div>

        {loading ? <p className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading wishlist...</p> : null}

        {!loading && wishlistItems.length === 0 ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-bold">No saved products yet</h2>
            <p className="mb-6 text-slate-600">Tap the heart on any product card to save it here.</p>
            <Link
              to="/"
              className="inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Explore Tech
            </Link>
          </section>
        ) : null}

        {!loading && wishlistItems.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {wishlistItems.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
