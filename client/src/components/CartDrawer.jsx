import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';

export default function CartDrawer() {
  const { cartItems, cartTotal, dispatch, isCartOpen, closeCart } = useCart();

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
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="app-surface fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-500">Cart</p>
                <h2 className="text-2xl font-bold text-slate-900">Your gadget lineup</h2>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={closeCart}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {cartItems.length === 0 ? (
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900">Your cart is empty</h3>
                  <p className="mt-2 text-slate-600">Add a few gadgets and they’ll appear here instantly.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <article key={item._id} className="rounded-[1.5rem] border border-slate-200 p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image || 'https://placehold.co/240x180?text=No+Image'}
                          alt={item.name}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 font-semibold text-slate-900">{item.name}</h3>
                          <p className="mt-2 font-bold text-slate-900">{formatINR(item.price)}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item, item.qty - 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg font-bold text-slate-700"
                            >
                              -
                            </button>
                            <span className="min-w-6 text-center font-semibold">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item, item.qty + 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg font-bold text-slate-700"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })}
                              className="ml-auto rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-5 py-5">
              <div className="space-y-3 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatINR(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-slate-900">{formatINR(gst)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.97 }} className="mt-5">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
                >
                  Proceed to Checkout
                </Link>
              </motion.div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
