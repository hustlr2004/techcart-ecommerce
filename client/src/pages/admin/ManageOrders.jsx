import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../api/axios';

const statuses = ['Processing', 'Shipped', 'Delivered'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  async function loadOrders() {
    try {
      const { data } = await api.get('/api/admin/orders');
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId, status) {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <section className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-500">Phase 7 Admin</p>
              <h1 className="text-3xl font-bold">Manage Orders</h1>
            </div>

            {error ? <p className="rounded-2xl bg-red-50 p-6 text-red-600 shadow-sm">{error}</p> : null}

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Order ID</th>
                      <th className="px-4 py-3 font-semibold">Customer Name</th>
                      <th className="px-4 py-3 font-semibold">Total</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-mono text-xs">{order._id}</td>
                        <td className="px-4 py-3">{order.user?.name || 'Unknown User'}</td>
                        <td className="px-4 py-3">${Number(order.totalPrice).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.orderStatus}
                            onChange={(event) => updateStatus(order._id, event.target.value)}
                            className="rounded-xl border border-slate-200 px-3 py-2"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
