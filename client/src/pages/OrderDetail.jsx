import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../api/axios';
import { formatINR } from '../utils/currency';

const steps = ['Processing', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/orders/${id}`);
        if (active) {
          setOrder(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load order');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, [id]);

  const currentStepIndex = order ? steps.indexOf(order.orderStatus) : 0;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/my-orders" className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800">
          ← Back to My Orders
        </Link>

        {loading ? <p className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading order...</p> : null}
        {error ? <p className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600 shadow-sm">{error}</p> : null}

        {order ? (
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="font-mono text-sm">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Placed On</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => {
                  const active = index <= currentStepIndex;
                  return (
                    <div
                      key={step}
                      className={`rounded-2xl border p-4 ${
                        active
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em]">Step {index + 1}</p>
                      <p className="mt-2 text-lg font-bold">{step === 'Processing' ? 'Order Placed' : step}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-bold">Ordered Items</h2>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <article key={`${item.product || item.name}-${index}`} className="flex gap-4 rounded-2xl border border-slate-100 p-4">
                      <img
                        src={item.image || 'https://placehold.co/160x120?text=No+Image'}
                        alt={item.name}
                        className="h-24 w-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-slate-600">Quantity: {item.quantity}</p>
                        <p className="font-semibold text-slate-900">{formatINR(item.price)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
                  <div className="space-y-2 text-slate-600">
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p>{order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold">Payment Info</h2>
                  <div className="space-y-2 text-slate-600">
                    <p>Status: <span className="font-semibold text-slate-900">{order.paymentInfo.status}</span></p>
                    <p className="break-all">Razorpay Order ID: {order.paymentInfo.razorpayOrderId}</p>
                    <p className="break-all">Payment ID: {order.paymentInfo.razorpayPaymentId}</p>
                    <div className="border-t border-slate-200 pt-3">
                      <p>Items: {formatINR(order.itemsPrice)}</p>
                      <p>Tax: {formatINR(order.taxPrice)}</p>
                      <p className="font-bold text-slate-900">Total: {formatINR(order.totalPrice)}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
