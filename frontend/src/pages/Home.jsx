// src/pages/Home.jsx
// Infinite scroll: loads 20 items at a time, appends on scroll.

import { useState, useEffect, useRef, useCallback } from "react";
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
  const { foods, foodsLoading, foodsError, totalFoods, fetchFoods, hasMore, currentPage } = useApp();

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy,   setSortBy]   = useState("default");
  const [page,     setPage]     = useState(1);

  const loaderRef = useRef(null);

  // Build query params helper
  const buildParams = useCallback((pageNum) => {
    const params = { page: pageNum, limit: 20 };
    if (category !== "All") params.category = category;
    if (search.trim())      params.search   = search.trim();
    if (sortBy !== "default") params.sort   = sortBy;
    return params;
  }, [category, search, sortBy]);

  // When search/category/sort changes → reset to page 1
  useEffect(() => {
    setPage(1);
    const timer = setTimeout(() => {
      fetchFoods(buildParams(1), false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, category, sortBy, fetchFoods, buildParams]);

  // When page changes (and page > 1) → append more items
  useEffect(() => {
    if (page > 1) {
      fetchFoods(buildParams(page), true);
    }
  }, [page]); // intentionally only depend on page

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !foodsLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentLoader);
    return () => observer.unobserve(currentLoader);
  }, [hasMore, foodsLoading]);

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
              {foodsLoading && foods.length === 0 ? "Loading..." : `${totalFoods} items found`}
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

        {/* Initial loading skeleton (only when no foods loaded yet) */}
        {foodsLoading && foods.length === 0 && (
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
              onClick={() => fetchFoods(buildParams(1), false)}
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
        {foods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {foods.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Infinite scroll loader sentinel */}
        <div ref={loaderRef} className="flex justify-center py-8">
          {foodsLoading && foods.length > 0 && (
            <div className="flex items-center gap-3 text-gray-500">
              <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium">Loading more dishes...</span>
            </div>
          )}
          {!hasMore && foods.length > 0 && !foodsLoading && (
            <p className="text-sm text-gray-400 font-medium">
              🍽 You've seen all {totalFoods} dishes!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;