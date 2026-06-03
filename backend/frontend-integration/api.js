// src/services/api.js
// Central place for ALL backend API calls.
// Change BASE_URL here if your backend moves to a different host.

const BASE_URL = "http://localhost:5000/api";

// ─── Helper ───────────────────────────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login:    (body) => request("/auth/login",    { method: "POST", body: JSON.stringify(body) }),
  profile:  ()     => request("/auth/profile"),
  updateProfile: (body) => request("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Foods ────────────────────────────────────────────────────────────────────
export const foodAPI = {
  // params: { category, search, sort, page, limit }
  getAll:      (params = {}) => request("/foods?" + new URLSearchParams(params)),
  getById:     (id)          => request(`/foods/${id}`),
  getCategories: ()          => request("/foods/categories"),
  add:         (body)        => request("/foods",     { method: "POST",   body: JSON.stringify(body) }),
  update:      (id, body)    => request(`/foods/${id}`, { method: "PUT",  body: JSON.stringify(body) }),
  delete:      (id)          => request(`/foods/${id}`, { method: "DELETE" }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  create:       (body)   => request("/orders",            { method: "POST", body: JSON.stringify(body) }),
  getMyOrders:  ()       => request("/orders/my"),
  getById:      (id)     => request(`/orders/${id}`),
  cancel:       (id)     => request(`/orders/${id}/cancel`, { method: "PUT" }),
  // Admin
  getAll:       (params = {}) => request("/orders?" + new URLSearchParams(params)),
  updateStatus: (id, status)  => request(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};
