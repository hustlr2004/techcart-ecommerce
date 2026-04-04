import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const featuredCategories = ['All', 'Phones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Accessories'];
const PAGE_SIZE = 8;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setPage(1);
        const params = {};
        if (searchTerm.trim()) params.keyword = searchTerm.trim();
        if (category.trim()) params.category = category.trim();
        params.page = 1;
        params.limit = PAGE_SIZE;

        const { data } = await api.get('/api/products', { params });
        if (active) {
          setProducts(data.products || []);
          setHasMore(Boolean(data.hasMore));
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load products');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [searchTerm, category]);

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore]);

  useEffect(() => {
    if (page === 1) {
      return undefined;
    }

    let active = true;

    async function loadMore() {
      try {
        setLoadingMore(true);
        const params = {
          page,
          limit: PAGE_SIZE,
        };

        if (searchTerm.trim()) params.keyword = searchTerm.trim();
        if (category.trim()) params.category = category.trim();

        const { data } = await api.get('/api/products', { params });

        if (active) {
          setProducts((prev) => [...prev, ...(data.products || [])]);
          setHasMore(Boolean(data.hasMore));
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load more products');
        }
      } finally {
        if (active) {
          setLoadingMore(false);
        }
      }
    }

    loadMore();

    return () => {
      active = false;
    };
  }, [page, searchTerm, category]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchTerm(keyword);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.22),_transparent_30%),linear-gradient(135deg,_#0f172a_0%,_#111827_45%,_#1e293b_100%)] px-6 py-12 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-300">TechCart</p>
              <h2 className="mb-4 text-4xl font-black leading-tight md:text-5xl">Next-Gen Tech, Delivered Fast</h2>
              <p className="max-w-2xl text-base text-slate-300 md:text-lg">Shop the latest gadgets at unbeatable prices</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="#catalog"
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
                  >
                    Shop Now
                  </Link>
                </motion.div>
                <span className="rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm text-slate-200">
                  Same-week dispatch on trending gadgets
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-200">Hot Right Now</p>
                <h3 className="mt-2 text-xl font-bold">Apple, Samsung, Sony</h3>
                <p className="mt-2 text-sm text-slate-300">Curated premium devices with fast checkout and trusted pricing.</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-200">Deal Drop</p>
                <h3 className="mt-2 text-xl font-bold">Exclusive gadget discounts</h3>
                <p className="mt-2 text-sm text-slate-300">Special markdowns on premium tech above ₹10,000.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" id="catalog">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {featuredCategories.map((item) => {
              const nextCategory = item === 'All' ? '' : item;
              const active = category === nextCategory;
              return (
                <motion.button
                  key={item}
                  type="button"
                  onClick={() => setCategory(nextCategory)}
                  whileTap={{ scale: 0.97 }}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-300 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {item}
                </motion.button>
              );
            })}
          </div>

          <form className="grid gap-4 md:grid-cols-[1fr_140px]" onSubmit={handleSearch}>
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search for iPhones, MacBooks, headphones..."
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-blue-500"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Search
            </motion.button>
          </form>
        </section>

        {loading ? <p className="rounded-2xl bg-white p-6 shadow-sm">Loading products...</p> : null}
        {error ? <p className="rounded-2xl bg-red-50 p-6 text-red-600 shadow-sm">{error}</p> : null}

        {!loading && !error ? (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </section>
        ) : null}

        {!loading && !error && products.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 shadow-sm">No products found for the selected filters.</p>
        ) : null}

        {!error && products.length > 0 ? (
          <div className="py-8 text-center">
            <div ref={loadMoreRef} />
            {loadingMore ? (
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-600 shadow-sm">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                Loading more products...
              </div>
            ) : null}
            {!hasMore && !loading ? (
              <p className="text-sm font-medium text-slate-500">No more products</p>
            ) : null}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
