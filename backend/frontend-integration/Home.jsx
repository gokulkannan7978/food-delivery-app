// src/pages/Home.jsx
// Fetches food from backend API with real search, filter, and sort params.

import { useState, useEffect, useCallback } from "react";
import FoodCard from "../components/FoodCard";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";
import { useApp } from "../context/AppContext";

const sortOptions = [
  { label: "Default",          value: "default" },
  { label: "Price: Low → High", value: "low"    },
  { label: "Price: High → Low", value: "high"   },
  { label: "Top Rated",         value: "rating" },
];

const Home = () => {
  const { foods, foodsLoading, foodsError, totalFoods, fetchFoods } = useApp();

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy,   setSortBy]   = useState("default");

  // Debounced fetch — wait 400ms after user stops typing before calling API
  useEffect(() => {
    const params = {};
    if (category !== "All") params.category = category;
    if (search.trim())      params.search   = search.trim();
    if (sortBy !== "default") params.sort   = sortBy;

    const timer = setTimeout(() => fetchFoods(params), 400);
    return () => clearTimeout(timer);
  }, [search, category, sortBy, fetchFoods]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-xl">
            <p className="text-orange-100 text-sm font-semibold uppercase tracking-widest mb-2">
              🚀 Fast Delivery • Fresh Food
            </p>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
              Hungry? We've got<br />
              <span className="text-yellow-300">you covered.</span>
            </h1>
            <p className="text-orange-100 text-sm sm:text-base mb-6">
              Order from the best restaurants and get food delivered in 30 minutes.
            </p>
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CategoryFilter selected={category} onSelect={setCategory} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-shrink-0 text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Food Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {category === "All" ? "All Dishes" : category}
            </h2>
            <p className="text-sm text-gray-500">
              {foodsLoading ? "Loading..." : `${totalFoods} items found`}
            </p>
          </div>
          {(search || category !== "All" || sortBy !== "default") && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1"
            >
              Clear filters ✕
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {foodsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-9 bg-gray-200 rounded-xl w-20" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {foodsError && !foodsLoading && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Failed to load food</h3>
            <p className="text-gray-500 mb-5 text-sm">{foodsError}</p>
            <button
              onClick={() => fetchFoods()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!foodsLoading && !foodsError && foods.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No dishes found</h3>
            <p className="text-gray-500 mb-5">Try a different search or category</p>
            <button
              onClick={handleClearFilters}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Show All Dishes
            </button>
          </div>
        )}

        {/* Food grid */}
        {!foodsLoading && !foodsError && foods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {foods.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
