// src/context/AppContext.jsx
// Updated to use real backend API instead of static foodData.js

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { foodAPI, authAPI, orderAPI, setAuthToken } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);

  // ── Food state ──────────────────────────────────────────────────────────────
  const [foods, setFoods]               = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [foodsError, setFoodsError]     = useState(null);
  const [totalFoods, setTotalFoods]     = useState(0);
  const [hasMore, setHasMore]           = useState(true);
  const [currentPage, setCurrentPage]   = useState(1);

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

  // ── Fetch foods: append=true means infinite scroll load-more ─────────────────
  const fetchFoods = useCallback(async (params = {}, append = false) => {
    setFoodsLoading(true);
    setFoodsError(null);
    try {
      const data = await foodAPI.getAll({ limit: 20, ...params });
      if (append) {
        setFoods((prev) => [...prev, ...data.foods]);
      } else {
        setFoods(data.foods);
        setCurrentPage(data.page ?? 1);
      }
      setTotalFoods(data.total);
      setHasMore(data.page < data.pages);
    } catch (err) {
      setFoodsError(err.message);
    } finally {
      setFoodsLoading(false);
    }
  }, []);

  // Fetch page 1 on mount
  useEffect(() => { fetchFoods({ page: 1 }); }, [fetchFoods]);

  // ── Auth actions ─────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register({ name, email, password });
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setAuthToken(null);
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
        foods, foodsLoading, foodsError, totalFoods, fetchFoods, hasMore, currentPage,
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
