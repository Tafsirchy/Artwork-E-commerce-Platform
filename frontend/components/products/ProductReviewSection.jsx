"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit2, Trash2, Send, X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";

// ─── Star Rating Input ────────────────────────────────────────────────────────
function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            fill={(hovered || value) >= star ? "#C8A96A" : "none"}
            color={(hovered || value) >= star ? "#C8A96A" : "#d1cfc9"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Static Star Display ──────────────────────────────────────────────────────
function StarDisplay({ rating, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={rating >= star ? "#C8A96A" : "none"}
          color={rating >= star ? "#C8A96A" : "#d1cfc9"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductReviewSection({ productId }) {
  const { user } = useAuthStore();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${productId}/reviews`);
      setReviews(data.reviews);
      setAvgRating(data.avgRating);
      setTotalReviews(data.totalReviews);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Check if current user already left a review
  const myReview = user ? reviews.find((r) => r.user === user._id) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in to leave a review");
    if (!comment.trim()) return toast.error("Please write your thoughts");

    try {
      setSubmitting(true);
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSave = async (reviewId) => {
    if (!editComment.trim()) return toast.error("Comment cannot be empty");
    try {
      setEditSubmitting(true);
      await api.put(`/products/${productId}/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      });
      toast.success("Review updated");
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update review");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Remove this review from the collection?")) return;
    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
      toast.success("Review removed");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  const ratingBars = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className="w-full border-t border-gallery-border mt-0 bg-gallery-bg">
      <div className="container mx-auto px-6 py-16 ">

        {/* ── Section Header ── */}
        <div className="mb-12">
          <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-2">Collector Perspectives</p>
          <h2 className="text-3xl font-light text-gallery-text tracking-tight uppercase">
            Acquisition <span className="font-serif text-gallery-gold">Reviews</span>
          </h2>
        </div>

        {/* ── Summary Row ── */}
        {totalReviews > 0 && (
          <div className="flex flex-col md:flex-row gap-10 mb-12 p-8 bg-white border border-gallery-border">
            {/* Big avg */}
            <div className="flex flex-col items-center justify-center min-w-[120px] border-r border-gallery-border pr-10">
              <p className="text-6xl font-light text-gallery-text">{avgRating}</p>
              <StarDisplay rating={avgRating} size={14} />
              <p className="text-[9px] tracking-[0.3em] uppercase text-gallery-muted mt-2 font-bold">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            {/* Bars */}
            <div className="flex-1 space-y-2">
              {ratingBars.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-[10px] w-4 text-gallery-muted font-bold">{star}</span>
                  <Star size={10} fill="#C8A96A" color="#C8A96A" />
                  <div className="flex-1 bg-gallery-soft h-1.5">
                    <motion.div
                      className="h-full bg-gallery-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * (5 - star) }}
                    />
                  </div>
                  <span className="text-[9px] text-gallery-muted w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Review Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gallery-border p-8">
              <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-gallery-text mb-6">
                {myReview ? "Your Review" : "Leave a Review"}
              </p>

              {!user ? (
                <div className="text-center py-8">
                  <p className="text-[11px] tracking-widest uppercase text-gallery-muted mb-4">Sign in to share your perspective</p>
                  <a href="/login" className="inline-block px-6 py-2 bg-gallery-primary text-white text-[9px] uppercase tracking-widest font-bold hover:bg-black transition-all">
                    Access Gallery
                  </a>
                </div>
              ) : myReview ? (
                <div className="space-y-4">
                  <p className="text-[11px] text-gallery-muted tracking-wider">You reviewed this piece on {new Date(myReview.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <StarDisplay rating={myReview.rating} size={16} />
                  <p className="text-sm font-light italic text-gallery-text leading-relaxed">"{myReview.comment}"</p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleEditOpen(myReview)}
                      className="flex items-center gap-2 px-4 py-2 border border-gallery-border text-[9px] uppercase tracking-widest font-bold hover:border-gallery-gold hover:text-gallery-gold transition-all"
                    >
                      <Edit2 size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(myReview._id)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-400 text-[9px] uppercase tracking-widest font-bold hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted mb-2">Your Rating</p>
                    <StarInput value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted mb-2">Your Thoughts</p>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your experience with this piece..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light resize-none placeholder:text-gallery-muted/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gallery-primary text-white text-[9px] uppercase tracking-widest font-bold hover:bg-black transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Reviews List ── */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gallery-border p-6 animate-pulse">
                  <div className="h-3 w-24 bg-gallery-soft mb-3" />
                  <div className="h-2 w-full bg-gallery-soft mb-2" />
                  <div className="h-2 w-3/4 bg-gallery-soft" />
                </div>
              ))
            ) : reviews.length === 0 ? (
              <div className="bg-white border border-dashed border-gallery-border p-12 text-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted">No reviews yet. Be the first collector to share your thoughts.</p>
              </div>
            ) : (
              <AnimatePresence>
                {reviews.map((review) => {
                  const isOwner = user && review.user === user._id;
                  const isEditing = editingId === review._id;

                  return (
                    <motion.div
                      key={review._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-gallery-border p-6 group relative"
                    >
                      {isEditing ? (
                        /* ── Edit Mode ── */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] tracking-widest uppercase font-bold text-gallery-text">Editing Review</p>
                            <button onClick={() => setEditingId(null)} className="text-gallery-muted hover:text-gallery-text">
                              <X size={14} />
                            </button>
                          </div>
                          <StarInput value={editRating} onChange={setEditRating} />
                          <textarea
                            rows={3}
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full px-4 py-3 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light resize-none"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditSave(review._id)}
                              disabled={editSubmitting}
                              className="flex items-center gap-2 px-6 py-2 bg-gallery-primary text-white text-[9px] uppercase tracking-widest font-bold hover:bg-black transition-all disabled:opacity-50"
                            >
                              {editSubmitting ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-6 py-2 border border-gallery-border text-[9px] uppercase tracking-widest font-bold hover:bg-gallery-soft transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Display Mode ── */
                        <>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-[10px] tracking-widest font-bold uppercase text-gallery-text">{review.name}</p>
                              <p className="text-[8px] text-gallery-muted tracking-widest">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <StarDisplay rating={review.rating} size={11} />
                          </div>

                          <p className="text-sm font-light text-gallery-text leading-relaxed italic">"{review.comment}"</p>

                          {/* Owner actions */}
                          {isOwner && (
                            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditOpen(review)}
                                className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-bold text-gallery-muted hover:text-gallery-gold transition-colors"
                              >
                                <Edit2 size={10} /> Edit
                              </button>
                              <span className="text-gallery-border">•</span>
                              <button
                                onClick={() => handleDelete(review._id)}
                                className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-bold text-gallery-muted hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={10} /> Remove
                              </button>
                            </div>
                          )}

                          {/* Admin delete */}
                          {user?.role === "admin" && !isOwner && (
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="absolute top-4 right-4 p-1.5 text-gallery-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              title="Admin: Remove review"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
