import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import { getStoredUser } from '../utils/auth';

function renderStars(rating) {
  const rounded = Math.round(rating || 0);
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rounded ? 'text-yellow-400' : 'text-slate-300'}>
      ★
    </span>
  ));
}

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        if (active) {
          setProduct(data);
          setSelectedImage(data.images?.[0] || '');
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load product');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const images = product?.images?.length ? product.images : ['https://placehold.co/800x600?text=No+Image'];
  const image = selectedImage || images[0];

  function handleAddToCart() {
    if (!product) return;
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image,
        qty: 1,
      },
    });
  }

  function handleReviewChange(event) {
    setReviewForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();
    setReviewError('');

    if (!localStorage.getItem('token')) {
      setReviewError('Please log in to post a review.');
      return;
    }

    try {
      setReviewLoading(true);
      const { data } = await api.post(`/api/products/${id}/reviews`, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setProduct(data);
      setReviewForm({ rating: '5', comment: '' });
    } catch (submitError) {
      setReviewError(submitError.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  }

  const user = getStoredUser();
  const currentUserId = user?._id || user?.id;
  const alreadyReviewed = Boolean(
    currentUserId && product?.reviews?.some((review) => String(review.user) === String(currentUserId))
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800">
          ← Back to products
        </Link>

        {loading ? <p className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading product...</p> : null}
        {error ? <p className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600 shadow-sm">{error}</p> : null}

        {product ? (
          <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100">
                <img
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  src={image}
                  alt={product.name}
                />
              </div>

              {images.length > 1 ? (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((thumbnail, index) => (
                    <button
                      key={`${thumbnail}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(thumbnail)}
                      className={`overflow-hidden rounded-2xl border transition ${
                        image === thumbnail
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={thumbnail}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-5">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex">{renderStars(product.ratings)}</div>
                  <span className="text-slate-500">({product.numReviews} reviews)</span>
                </div>
              </div>

              <p className="text-base leading-7 text-slate-600">{product.description}</p>

              <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Price</p>
                  <p className="text-3xl font-black text-slate-900">{formatINR(product.price)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Stock</p>
                  <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 rounded-[1.75rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_100%)] p-5 text-white sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-200">TechCart Promise</p>
                  <p className="mt-2 text-lg font-semibold">Fast dispatch on premium gadgets</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Why shoppers love it</p>
                  <p className="mt-2 text-sm text-slate-300">Trusted brands, secure checkout, and real pricing in INR without surprise add-ons.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="mt-auto rounded-2xl bg-blue-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Add to Cart
              </button>
            </div>
          </section>
        ) : null}

        {product ? (
          <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-500">Ratings</p>
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                </div>
                <div className="text-right">
                  <div className="flex justify-end">{renderStars(product.ratings)}</div>
                  <p className="text-sm text-slate-500">
                    {product.numReviews} review{product.numReviews === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(product.reviews || []).length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">No reviews yet. Be the first to share feedback.</p>
                ) : (
                  product.reviews.map((review) => (
                    <article key={review._id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{review.name}</p>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-3 text-slate-600">{review.comment}</p>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-500">Write A Review</p>
              <h2 className="mt-2 text-2xl font-bold">Share your experience</h2>
              {alreadyReviewed ? (
                <p className="mt-4 rounded-2xl bg-blue-50 p-4 text-blue-700">You have already reviewed this product.</p>
              ) : (
                <form className="mt-5 space-y-4" onSubmit={handleReviewSubmit}>
                  <select
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleReviewChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} Star{value === 1 ? '' : 's'}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="comment"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    placeholder="Tell other shoppers what you liked about this product..."
                    className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                  {reviewError ? <p className="rounded-2xl bg-red-50 p-4 text-red-600">{reviewError}</p> : null}
                  {!user ? <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">Log in first to submit a review.</p> : null}
                  <button
                    type="submit"
                    disabled={reviewLoading || !user}
                    className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {reviewLoading ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
