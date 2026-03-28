import { Link } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import { MyContext } from "../context/AppContext";
import EquipmentCard from "../components/EquipmentCard";
import InlineSpinner from "../components/ui/InlineSpinner";

function EquipmentPage() {
  const { admin, items, equipmentLoading = false } = useContext(MyContext);
  const list = Array.isArray(items) ? items : [];
  const count = list.length;

  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    list.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [list]);

  // Filtered and sorted list
  const filteredList = useMemo(() => {
    let result = list.filter((item) => {
      const matchesSearch = item.equipmentName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPrice =
        item.rentRates >= priceRange[0] && item.rentRates <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.rentRates - b.rentRates);
        break;
      case "price-high":
        result.sort((a, b) => b.rentRates - a.rentRates);
        break;
      case "name":
        result.sort((a, b) =>
          a.equipmentName.localeCompare(b.equipmentName)
        );
        break;
      case "newest":
      default:
        // Keep original order (newest)
        break;
    }

    return result;
  }, [list, searchQuery, sortBy, priceRange]);

  const filteredCount = filteredList.length;
  const avgPrice =
    filteredCount > 0
      ? Math.round(
          filteredList.reduce((sum, item) => sum + item.rentRates, 0) /
            filteredCount
        )
      : 0;
  const maxPrice =
    filteredCount > 0
      ? Math.max(...filteredList.map((item) => item.rentRates))
      : 0;

  const hasActiveFilters =
    searchQuery || sortBy !== "newest" || priceRange[0] !== 0 || priceRange[1] !== 100000;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(15,118,110,0.06),transparent)]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-20">
        {/* Hero strip */}
        <header className="relative mb-10 overflow-hidden rounded-3xl border border-brand-100/80 bg-gradient-to-br from-white via-brand-50/40 to-white p-6 shadow-lg shadow-brand-900/[0.04] ring-1 ring-brand-100/60 sm:mb-12 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-teal-300/10 blur-2xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-800 shadow-sm backdrop-blur-sm">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
                Live catalog
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                Equipment{" "}
                <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                  rental catalog
                </span>
              </h1>
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                Browse verified machinery and tools. Transparent pricing, flexible booking — pick what your project needs.
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:flex-col xl:flex-row">
              {count > 0 ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-md shadow-brand-600/25">
                    {count}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Listed</p>
                    <p className="font-heading text-lg font-bold text-slate-900">
                      {count} {count === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              ) : null}
              {admin ? (
                <Link
                  to="/addequipment"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-700 hover:shadow-xl active:scale-[0.98] motion-reduce:transform-none"
                >
                  <i className="fa-solid fa-plus" aria-hidden />
                  Add equipment
                </Link>
              ) : null}
            </div>
          </div>
        </header>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4 animate-fade-in-up">
          {/* Search Bar */}
          <div className="relative flex items-center rounded-2xl border border-brand-200/80 bg-white/95 shadow-sm backdrop-blur-sm transition focus-within:border-brand-400 focus-within:shadow-md">
            <i className="fa-solid fa-magnifying-glass absolute left-4 text-slate-400" aria-hidden />
            <input
              type="text"
              placeholder="Search equipment by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-3.5 pl-11 pr-4 outline-none text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mr-4 text-slate-400 hover:text-slate-600 transition"
              >
                <i className="fa-solid fa-xmark" aria-hidden />
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
              >
                <option value="newest">Newest first</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg px-3 py-2 transition ${
                    viewMode === "grid"
                      ? "bg-brand-100 text-brand-700 font-medium"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Grid view"
                >
                  <i className="fa-solid fa-grip" aria-hidden />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg px-3 py-2 transition ${
                    viewMode === "list"
                      ? "bg-brand-100 text-brand-700 font-medium"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="List view"
                >
                  <i className="fa-solid fa-list" aria-hidden />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50"
              >
                <i className="fa-solid fa-sliders" aria-hidden />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                    {[searchQuery, sortBy !== "newest", priceRange[0] !== 0 || priceRange[1] !== 100000].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Result Counter */}
            {count > 0 && (
              <div className="text-sm font-medium text-slate-600">
                Showing <span className="font-bold text-slate-900">{filteredCount}</span> of{" "}
                <span className="font-bold text-slate-900">{count}</span> items
              </div>
            )}
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="animate-fade-in-up rounded-2xl border border-brand-200/80 bg-gradient-to-br from-white to-brand-50/30 p-6 shadow-md backdrop-blur-sm">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Price Range Filter */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                      placeholder="Min"
                    />
                    <span className="text-sm font-medium text-slate-500">to</span>
                    <input
                      type="number"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Statistics */}
                {filteredCount > 0 && (
                  <div className="grid gap-3 sm:col-span-2 lg:col-span-1">
                    <div className="rounded-xl bg-white/60 p-4 ring-1 ring-slate-200/80">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Average Price
                      </p>
                      <p className="mt-1 font-heading text-2xl font-bold text-brand-600">
                        ₹{avgPrice}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/60 p-4 ring-1 ring-slate-200/80">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Highest Price
                      </p>
                      <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
                        ₹{maxPrice}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSortBy("newest");
                    setPriceRange([0, 100000]);
                  }}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  <i className="fa-solid fa-rotate-right" aria-hidden />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
        {/* Results Section */}
        {equipmentLoading ? (
          <div
            className="flex min-h-[45vh] flex-col items-center justify-center gap-4 rounded-3xl border border-brand-100/80 bg-white/80 px-6 py-16 shadow-inner backdrop-blur-sm"
            aria-busy="true"
            aria-live="polite"
          >
            <InlineSpinner className="h-12 w-12 text-brand-600" />
            <p className="text-center font-medium text-slate-600">Loading equipment catalog…</p>
          </div>
        ) : count === 0 ? (
          <div className="animate-fade-in-up flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-200/80 bg-white/60 px-6 py-20 text-center shadow-inner">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-3xl text-brand-600 shadow-inner">
              <i className="fa-solid fa-box-open" aria-hidden />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">No equipment yet</h2>
            <p className="mt-2 max-w-md text-slate-600">
              {admin
                ? "Add your first listing to get started — your catalog will appear here."
                : "Check back soon — new equipment is added regularly."}
            </p>
            {admin ? (
              <Link
                to="/addequipment"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-brand-500 hover:to-brand-700"
              >
                <i className="fa-solid fa-plus" />
                Add equipment
              </Link>
            ) : null}
          </div>
        ) : filteredCount === 0 ? (
          <div className="animate-fade-in-up flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-20 text-center shadow-inner">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 text-3xl text-slate-500 shadow-inner">
              <i className="fa-solid fa-search" aria-hidden />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">No equipment matches</h2>
            <p className="mt-2 max-w-md text-slate-600">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortBy("newest");
                setPriceRange([0, 100000]);
                setShowFilters(false);
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-brand-500 hover:to-brand-700"
            >
              <i className="fa-solid fa-rotate-right" />
              Clear filters
            </button>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-4 animate-fade-in-up">
            {filteredList.map((e, index) => (
              <div key={e.id} className="flex justify-center">
                <EquipmentCard {...e} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid list-none gap-6 sm:gap-8 lg:grid-cols-1 xl:grid-cols-2 xl:gap-x-8 xl:gap-y-10 animate-fade-in-up">
            {filteredList.map((e, index) => (
              <li key={e.id} className="flex justify-center xl:justify-stretch">
                <EquipmentCard {...e} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EquipmentPage;
