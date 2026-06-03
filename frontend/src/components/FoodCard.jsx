import { useState } from "react";
import { useApp } from "../context/AppContext";

const categoryColor = {
  Veg: "text-green-600 bg-green-50 border-green-200",
  "Non-Veg": "text-red-600 bg-red-50 border-red-200",
  Desserts: "text-pink-600 bg-pink-50 border-pink-200",
  Drinks: "text-blue-600 bg-blue-50 border-blue-200",
};

const categoryDot = {
  Veg: "bg-green-500",
  "Non-Veg": "bg-red-500",
  Desserts: "bg-pink-500",
  Drinks: "bg-blue-500",
};

const FoodCard = ({ item }) => {
  const { addToCart, cartItems, updateQuantity, openOrderModal } = useApp();
  const [imgError, setImgError] = useState(false);

  const cartItem = cartItems.find((i) => (i.id || i._id) === (item.id || item._id));
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={imgError ? "https://placehold.co/400x300/fff3e0/ff6b35?text=Food" : (item.image || item.image_url)}
          alt={item.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
          <span className="text-yellow-400">★</span>
          <span>{item.rating}</span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-gray-600 shadow-sm">
          🕐 {item.time || "30 min"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryColor[item.category]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${categoryDot[item.category]}`} />
            {item.category}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{item.name}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{item.description}</p>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-black text-gray-900">
            ₹<span>{item.price}</span>
          </span>

          {quantity === 0 ? (
            <button
              onClick={() => addToCart(item)}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200"
            >
              <span className="text-base">+</span> Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-1 py-1">
              <button
                onClick={() => updateQuantity(item.id || item._id, -1)}
                className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-lg text-base font-bold hover:bg-orange-600 transition-colors"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-bold text-orange-600">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id || item._id, 1)}
                className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-lg text-base font-bold hover:bg-orange-600 transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Place Order button */}
        <button
          onClick={() => openOrderModal(item, quantity > 0 ? quantity : 1)}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-green-200"
        >
          <span>🛍</span> Place Order
        </button>
      </div>
    </div>
  );
};

export default FoodCard;