// src/components/OrderModal.jsx
// Submits orders to the real backend API.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const OrderModal = () => {
  const { orderModal, closeOrderModal, confirmOrder, user } = useApp();
  const navigate = useNavigate();

  const [qty,       setQty]       = useState(1);
  const [address,   setAddress]   = useState("123, MG Road, Chennai, Tamil Nadu 600001");
  const [confirmed, setConfirmed] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    if (orderModal) {
      setQty(orderModal.quantity);
      setConfirmed(false);
      setError("");
    }
  }, [orderModal]);

  if (!orderModal) return null;

  const { item } = orderModal;
  const deliveryFee = 49;
  const subtotal    = item.price * qty;
  const taxes       = Math.round(subtotal * 0.05);
  const total       = subtotal + deliveryFee + taxes;

  const handleConfirm = async () => {
    // Must be logged in to place an order
    if (!user) {
      closeOrderModal();
      navigate("/login");
      return;
    }
    if (!address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await confirmOrder(item, qty, address);
      setConfirmed(true);
      setTimeout(() => closeOrderModal(), 2000);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) closeOrderModal(); }}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Success state ──────────────────────────────────────────────── */}
        {confirmed ? (
          <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-1">Order Placed!</h3>
            <p className="text-gray-500 text-sm">
              Your <span className="font-semibold text-gray-700">{item.name}</span> is being prepared 🍽
            </p>
            <p className="text-xs text-gray-400 mt-2">Estimated delivery: {item.time}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Confirm Order</h2>
              <button
                onClick={closeOrderModal}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Item preview */}
            <div className="flex items-center gap-4 px-5 py-4 bg-orange-50 border-b border-orange-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-orange-100"
                onError={(e) => { e.target.src = "https://placehold.co/64x64/fff3e0/ff6b35?text=🍽"; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                <p className="text-orange-500 font-black text-base mt-1">
                  ₹{item.price} <span className="text-xs font-normal text-gray-400">per item</span>
                </p>
              </div>
            </div>

            {/* Quantity picker */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-orange-500 font-bold text-lg shadow-sm hover:bg-orange-50 transition-colors"
                  >−</button>
                  <span className="w-6 text-center font-black text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-orange-500 font-bold text-lg shadow-sm hover:bg-orange-50 transition-colors"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Deliver to</p>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                placeholder="Enter your full delivery address..."
              />
            </div>

            {/* Bill summary */}
            <div className="px-5 py-4 border-b border-gray-100 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bill Summary</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Item total (×{qty})</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fee</span>
                <span className="font-semibold text-gray-800">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span>
                <span className="font-semibold text-gray-800">₹{taxes}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-black text-gray-900">To Pay</span>
                <span className="font-black text-green-600 text-base">₹{total}</span>
              </div>
            </div>

            {/* Login notice */}
            {!user && (
              <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-semibold">
                ⚠️ You'll be redirected to login before placing the order.
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-5 mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600 font-semibold">
                ⚠️ {error}
              </div>
            )}

            {/* Actions */}
            <div className="px-5 py-4 flex gap-3">
              <button
                onClick={closeOrderModal}
                disabled={loading}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold text-sm rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-[2] py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold text-sm rounded-2xl transition-colors shadow-md shadow-green-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Placing...
                  </>
                ) : (
                  <>🛍 Confirm Order · ₹{total}</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
