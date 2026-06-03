// src/context/AppContext.jsx
// Updated to use real backend API instead of static foodData.js

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { foodAPI, authAPI, orderAPI } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [user, setUser]     = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken]   = useState(() => localStorage.getItem("token") || null);

  // ── Food state ──────────────────────────────────────────────────────────────
  const [foods, setFoods]           = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [foodsError, setFoodsError] = useState(null);
  const [totalFoods, setTotalFoods] = useState(0);

  // ── Cart state ──────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; }
    catch { return []; }
  });

  // ── Order modal ─────────────────────────────────────────────────────────────
  const [orderModal, setOrderModal] = useState(null);
  const [orders, setOrders]         = useState([]);

  // ── Persist cart to localStorage ────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Fetch foods from backend ─────────────────────────────────────────────────
  const fetchFoods = useCallback(async (params = {}) => {
    setFoodsLoading(true);
    setFoodsError(null);
    try {
      const data = await foodAPI.getAll(params);
      setFoods(data.foods);
      setTotalFoods(data.total);
    } catch (err) {
      setFoodsError(err.message);
    } finally {
      setFoodsLoading(false);
    }
  }, []);

  // Fetch all foods on mount
  useEffect(() => { fetchFoods(); }, [fetchFoods]);

  // ── Auth actions ─────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register({ name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ── Cart actions ─────────────────────────────────────────────────────────────
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id || i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          (i.id || i._id) === (item.id || item._id)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => (i.id || i._id) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id || i._id) === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  // ── Order modal ──────────────────────────────────────────────────────────────
  const openOrderModal  = (item, quantity = 1) => setOrderModal({ item, quantity });
  const closeOrderModal = () => setOrderModal(null);

  const confirmOrder = async (item, quantity, deliveryAddress = "123, MG Road, Chennai") => {
    const orderPayload = {
      items: [{ food: item._id, quantity }],
      deliveryAddress,
      paymentMethod: "COD",
    };
    const data = await orderAPI.create(orderPayload);
    setOrders((prev) => [data.order, ...prev]);
    setOrderModal(null);
    return data.order;
  };

  // ── Derived values ───────────────────────────────────────────────────────────
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        // auth
        user, token, login, register, logout,
        // foods
        foods, foodsLoading, foodsError, totalFoods, fetchFoods,
        // cart
        cartItems, cartCount, cartTotal,
        addToCart, removeFromCart, updateQuantity, clearCart,
        // orders
        orders, setOrders,
        orderModal, openOrderModal, closeOrderModal, confirmOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};
