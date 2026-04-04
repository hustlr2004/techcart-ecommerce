import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'Unavailable';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <section className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-3 text-3xl font-bold">Payment successful</h1>
          <p className="mb-2 text-slate-600">Your order has been placed successfully.</p>
          <p className="mb-8 rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-700">
            Order ID: {orderId}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/my-orders"
              className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
