import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../api/axios';
import { formatINR } from '../../utils/currency';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  images: '',
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercentage: '' });
  const [error, setError] = useState('');

  async function loadProducts() {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    }
  }

  async function loadCoupons() {
    try {
      const { data } = await api.get('/api/admin/coupons');
      setCoupons(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load coupons');
    }
  }

  useEffect(() => {
    loadProducts();
    loadCoupons();
  }, []);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function startCreate() {
    setEditingId('new');
    setForm(emptyForm);
  }

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: (product.images || []).join(', '),
    });
  }

  function handleCouponChange(event) {
    setCouponForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingId === 'new') {
        await api.post('/api/products', payload);
      } else {
        await api.put(`/api/products/${editingId}`, payload);
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/api/products/${id}`);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  }

  async function handleCouponSubmit(event) {
    event.preventDefault();

    try {
      await api.post('/api/admin/coupons', {
        code: couponForm.code,
        discountPercentage: Number(couponForm.discountPercentage),
      });
      setCouponForm({ code: '', discountPercentage: '' });
      await loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save coupon');
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-500">Admin Products</p>
                <h1 className="text-3xl font-bold">Manage Products</h1>
              </div>
              <button
                type="button"
                onClick={startCreate}
                className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
              >
                Add New Product
              </button>
            </div>

            {error ? <p className="rounded-2xl bg-red-50 p-6 text-red-600 shadow-sm">{error}</p> : null}

            {editingId ? (
              <form className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2" onSubmit={handleSubmit}>
                <input className="rounded-2xl border border-slate-200 px-4 py-3" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
                <input className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" name="images" placeholder="Image URLs, comma separated" value={form.images} onChange={handleChange} />
                <textarea className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <div className="flex gap-3 md:col-span-2">
                  <button className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white" type="submit">Save Product</button>
                  <button className="rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700" type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            ) : null}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Image</th>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t border-slate-100">
                        <td className="px-4 py-3">
                          <img src={product.images?.[0] || 'https://placehold.co/80x60?text=No+Image'} alt={product.name} className="h-14 w-20 rounded-lg object-cover" />
                        </td>
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">{formatINR(product.price)}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => startEdit(product)} className="rounded-xl bg-blue-50 px-3 py-2 font-semibold text-blue-700">Edit</button>
                            <button type="button" onClick={() => handleDelete(product._id)} className="rounded-xl bg-red-50 px-3 py-2 font-semibold text-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleCouponSubmit}>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-500">Coupon Codes</p>
                <h2 className="mt-2 text-2xl font-bold">Create Coupon</h2>
                <div className="mt-5 space-y-4">
                  <input
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    name="code"
                    placeholder="Code"
                    value={couponForm.code}
                    onChange={handleCouponChange}
                    required
                  />
                  <input
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    name="discountPercentage"
                    placeholder="Discount %"
                    value={couponForm.discountPercentage}
                    onChange={handleCouponChange}
                    required
                  />
                  <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white" type="submit">
                    Save Coupon
                  </button>
                </div>
              </form>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Active Coupons</h2>
                <div className="mt-5 space-y-3">
                  {coupons.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">No coupons created yet.</p>
                  ) : (
                    coupons.map((coupon) => (
                      <div key={coupon._id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{coupon.code}</p>
                          <p className="text-sm text-slate-500">
                            {coupon.discountPercentage}% off
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${coupon.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
