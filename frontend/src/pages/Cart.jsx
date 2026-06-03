import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Cart = () => {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useApp();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center">
          Looks like you haven't added anything yet. Go explore!
        </p>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md shadow-orange-200"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const deliveryFee = 49;
  const taxes = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + taxes;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Your Cart</h1>
            <p className="text-sm text-gray-500">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-all"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id || item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = "https://placehold.co/80x80/fff3e0/ff6b35?text=🍽"; }}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                  <p className="text-orange-500 font-black text-base">₹{item.price * item.quantity}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400">₹{item.price} × {item.quantity}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Quantity control */}
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-1 py-1">
                    <button
                      onClick={() => updateQuantity(item.id || item._id, -1)}
                      className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-bold text-orange-600">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id || item._id, 1)}
                      className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id || item._id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h2 className="font-black text-gray-900 text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery fee</span>
                  <span className="font-semibold text-gray-800">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-gray-800">₹{taxes}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-orange-500 text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-3 py-2 rounded-xl transition-colors">
                  Apply
                </button>
              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-md shadow-orange-200 text-sm">
                Proceed to Checkout →
              </button>

              <Link
                to="/"
                className="block text-center text-sm text-gray-500 hover:text-orange-500 font-semibold mt-3 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
