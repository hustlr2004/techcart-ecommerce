import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const { data } = await api.get('/api/admin/stats');
        if (active) {
          setStats(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load admin stats');
        }
      }
    }

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  const cards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders },
        { label: 'Total Revenue', value: `$${Number(stats.totalRevenue).toFixed(2)}` },
        { label: 'Total Products', value: stats.totalProducts },
        { label: 'Total Users', value: stats.totalUsers },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <section className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-500">Phase 7 Admin</p>
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            {error ? <p className="rounded-2xl bg-red-50 p-6 text-red-600 shadow-sm">{error}</p> : null}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <article key={card.label} className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <h2 className="mt-3 text-3xl font-bold">{card.value}</h2>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
