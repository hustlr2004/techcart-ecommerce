import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../api/axios';
import { formatINR } from '../utils/currency';

function statusClasses(status) {
  if (status === 'Delivered') return 'bg-emerald-100 text-emerald-700';
  if (status === 'Shipped') return 'bg-blue-100 text-blue-700';
  return 'bg-yellow-100 text-yellow-700';
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        const { data } = await api.get('/api/orders/me');
        if (active) {
          setOrders(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load orders');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500">Order Tracking</p>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {loading ? <p className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading orders...</p> : null}
        {error ? <p className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600 shadow-sm">{error}</p> : null}

        {!loading && !error && orders.length === 0 ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
            <h2 className="mb-2 text-2xl font-bold">No orders yet</h2>
            <p className="mb-5 text-slate-600">Once you place an order, it will appear here.</p>
            <Link
              to="/"
              className="inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Continue Shopping
            </Link>
          </section>
        ) : null}

        {!loading && !error && orders.length > 0 ? (
          <section className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md md:grid-cols-[1.2fr_1fr_160px_150px]"
              >
                <div>
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="font-mono text-sm text-slate-800">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="font-semibold text-slate-900">{formatINR(order.totalPrice)}</p>
                </div>
                <div className="md:justify-self-end">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClasses(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </Link>
            ))}
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
