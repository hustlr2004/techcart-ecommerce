import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';

export default function Cart() {
  const { cartItems, cartTotal, dispatch } = useCart();

  const gst = cartTotal * 0.18;
  const grandTotal = cartTotal + gst;

  function updateQuantity(item, nextQty) {
    if (nextQty < 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: item._id });
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { _id: item._id, qty: nextQty },
    });
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-500">TechCart Bag</p>
            <h1 className="text-3xl font-bold">Your gadget lineup</h1>
          </div>
          {cartItems.length ? (
            <button
              type="button"
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-100"
            >
              Clear Cart
            </button>
          ) : null}
        </div>

        {cartItems.length === 0 ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-bold">Your cart is empty</h2>
            <p className="mb-6 text-slate-600">Looks like you have not added any gadgets yet.</p>
            <Link
              to="/"
              className="inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Shop Now
            </Link>
          </section>
        ) : (
          <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item._id}
                  className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image || 'https://placehold.co/240x180?text=No+Image'}
                    alt={item.name}
                    className="h-32 w-full rounded-[1.25rem] object-cover sm:w-40"
                  />

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="mt-2 text-lg font-bold text-slate-900">{formatINR(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item, item.qty - 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-lg font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item, item.qty + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })}
                    className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="mb-5 text-2xl font-bold">Order Summary</h2>

              <div className="space-y-4 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatINR(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-slate-900">{formatINR(gst)}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatINR(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
