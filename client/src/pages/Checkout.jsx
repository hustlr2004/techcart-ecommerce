import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { formatINR } from '../utils/currency';
import { getStoredUser } from '../utils/auth';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, dispatch } = useCart();
  const user = getStoredUser();
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [form, setForm] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const discountPrice = useMemo(() => Number(appliedCoupon?.discountAmount || 0), [appliedCoupon]);
  const discountedSubtotal = useMemo(
    () => Number(Math.max(cartTotal - discountPrice, 0).toFixed(2)),
    [cartTotal, discountPrice]
  );
  const taxPrice = useMemo(() => Number((discountedSubtotal * 0.18).toFixed(2)), [discountedSubtotal]);
  const totalPrice = useMemo(() => Number((discountedSubtotal + taxPrice).toFixed(2)), [discountedSubtotal, taxPrice]);

  useEffect(() => {
    let active = true;

    loadRazorpayScript().then((loaded) => {
      if (active) {
        setScriptReady(loaded);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleApplyCoupon() {
    setCouponMessage('');
    setError('');

    if (!couponCode.trim()) {
      setCouponMessage('Enter a coupon code to apply.');
      return;
    }

    try {
      const { data } = await api.post('/api/coupons/apply', {
        code: couponCode,
        subtotal: cartTotal,
      });
      setAppliedCoupon(data);
      setCouponCode(data.code);
      setCouponMessage(`Coupon applied: ${data.discountPercentage}% off`);
    } catch (couponError) {
      setAppliedCoupon(null);
      setCouponMessage(couponError.response?.data?.message || 'Failed to apply coupon');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!cartItems.length) {
      setError('Your cart is empty.');
      return;
    }

    if (!scriptReady || !window.Razorpay) {
      setError('Razorpay SDK failed to load. Please refresh and try again.');
      return;
    }

    try {
      setLoading(true);
      const { data: order } = await api.post('/api/payment/create-order', {
        orderItems: cartItems,
        couponCode: appliedCoupon?.code || '',
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'TechCart',
        description: 'TechCart gadget order',
        order_id: order.id,
        handler: async function handler(response) {
          try {
            const { data: savedOrder } = await api.post('/api/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderItems: cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.qty,
              })),
              shippingAddress: form,
              couponCode: appliedCoupon?.code || '',
            });

            dispatch({ type: 'CLEAR_CART' });
            navigate('/order-success', {
              state: { orderId: savedOrder._id },
            });
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: user?.email || '',
          contact: form.phone,
        },
        notes: {
          address: form.address,
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function onPaymentFailed() {
        setError('Payment failed. Please try again.');
        setLoading(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start payment');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500">Secure Checkout</p>
          <h1 className="text-3xl font-bold">Confirm delivery details</h1>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
            <h2 className="mb-5 text-2xl font-bold">Shipping Address</h2>
            <div className="grid gap-4">
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error ? <p className="mt-4 rounded-xl bg-red-50 p-4 text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading || !cartItems.length}
              className="mt-6 rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </form>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-2xl font-bold">Summary</h2>
            <div className="mb-5 rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Coupon Code</p>
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>
              {couponMessage ? (
                <p className={`mt-3 text-sm ${appliedCoupon ? 'text-emerald-600' : 'text-red-600'}`}>{couponMessage}</p>
              ) : null}
            </div>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">
                    {item.name} x {item.qty}
                  </span>
                  <span className="font-semibold text-slate-900">{formatINR(Number(item.price) * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatINR(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span className="text-emerald-600">- {formatINR(discountPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST (18%)</span>
                <span>{formatINR(taxPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatINR(totalPrice)}</span>
              </div>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
