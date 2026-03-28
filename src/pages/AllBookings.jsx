import { useEffect, useState, useCallback, useMemo } from "react";
import { getbookings } from "../../API/auth";
import { useToast } from "../context/ToastContext";
import InlineSpinner from "../components/ui/InlineSpinner";

function AllBookings() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [sortBy, setSortBy] = useState("newest");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getbookings();
      if (data.bookings) {
        setBookings(data.bookings);
      } else {
        showToast("Something went wrong", "error");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = bookings.filter((booking) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        booking.equipmentName?.toLowerCase().includes(searchLower) ||
        booking.userName?.toLowerCase().includes(searchLower) ||
        booking.bookingId?.toLowerCase().includes(searchLower) ||
        booking.equipmentId?.toLowerCase().includes(searchLower)
      );
    });

    // Sorting
    switch (sortBy) {
      case "equipment":
        result.sort((a, b) => (a.equipmentName || "").localeCompare(b.equipmentName || ""));
        break;
      case "user":
        result.sort((a, b) => (a.userName || "").localeCompare(b.userName || ""));
        break;
      case "amount-high":
        result.sort((a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount));
        break;
      case "amount-low":
        result.sort((a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount));
        break;
      case "newest":
      default:
        // Keep original order
        break;
    }

    return result;
  }, [bookings, searchQuery, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);
    const avgDays = bookings.length > 0
      ? Math.round(bookings.reduce((sum, b) => sum + (parseInt(b.noOfdays) || 0), 0) / bookings.length)
      : 0;
    const avgAmount = bookings.length > 0
      ? Math.round(bookings.reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0) / bookings.length)
      : 0;

    return { total, totalRevenue, avgDays, avgAmount };
  }, [bookings]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-50">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.1),transparent)]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl animate-fade-in-up px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl border border-brand-100/80 bg-linear-to-br from-white via-brand-50/40 to-white p-6 shadow-lg shadow-brand-900/4 ring-1 ring-brand-100/60 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-teal-300/10 blur-2xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-800 shadow-sm backdrop-blur-sm mb-4">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
              All Bookings
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight mb-3">
              Manage{" "}
              <span className="bg-linear-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                Equipment Bookings
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              View and manage all equipment rental bookings. Track bookings by equipment, user, or date range.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && bookings.length > 0 && (
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
            {/* Total Bookings Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-blue-200">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl group-hover:blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Bookings</p>
                  <i className="fa-solid fa-bookmark text-blue-500 text-lg" aria-hidden />
                </div>
                <p className="font-heading text-3xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500 mt-2">bookings recorded</p>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-emerald-200">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl group-hover:blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Revenue</p>
                  <i className="fa-solid fa-chart-line text-emerald-500 text-lg" aria-hidden />
                </div>
                <p className="font-heading text-3xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-2">total revenue</p>
              </div>
            </div>

            {/* Avg Days Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-purple-200">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-400/10 blur-2xl group-hover:blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Avg Duration</p>
                  <i className="fa-solid fa-calendar text-purple-500 text-lg" aria-hidden />
                </div>
                <p className="font-heading text-3xl font-bold text-slate-900">{stats.avgDays}</p>
                <p className="text-xs text-slate-500 mt-2">days per booking</p>
              </div>
            </div>

            {/* Avg Amount Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-amber-200">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl group-hover:blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Avg Amount</p>
                  <i className="fa-solid fa-wallet text-amber-500 text-lg" aria-hidden />
                </div>
                <p className="font-heading text-3xl font-bold text-slate-900">₹{stats.avgAmount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-2">per booking</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Controls */}
        {!loading && bookings.length > 0 && (
          <div className="mb-8 space-y-4 animate-fade-in-up">
            {/* Search Bar */}
            <div className="relative flex items-center rounded-2xl border border-brand-200/80 bg-white/95 shadow-sm backdrop-blur-sm transition focus-within:border-brand-400 focus-within:shadow-md">
              <i className="fa-solid fa-magnifying-glass absolute left-4 text-slate-400" aria-hidden />
              <input
                type="text"
                placeholder="Search by equipment, user, booking ID..."
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
                  <option value="newest">Newest First</option>
                  <option value="equipment">Equipment Name</option>
                  <option value="user">User Name</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`rounded-lg px-3 py-2 transition ${
                      viewMode === "cards"
                        ? "bg-brand-100 text-brand-700 font-medium"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Card view"
                  >
                    <i className="fa-solid fa-grip" aria-hidden />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`rounded-lg px-3 py-2 transition ${
                      viewMode === "table"
                        ? "bg-brand-100 text-brand-700 font-medium"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Table view"
                  >
                    <i className="fa-solid fa-table" aria-hidden />
                  </button>
                </div>
              </div>

              {/* Result Counter */}
              <div className="text-sm font-medium text-slate-600">
                Showing <span className="font-bold text-slate-900">{filteredBookings.length}</span> of{" "}
                <span className="font-bold text-slate-900">{bookings.length}</span> bookings
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div
            className="flex min-h-[45vh] flex-col items-center justify-center gap-4 rounded-2xl border border-brand-100 bg-white/90 py-16 shadow-md ring-1 ring-brand-50/50"
            aria-busy="true"
          >
            <div className="animate-spin">
              <InlineSpinner className="h-12 w-12 text-brand-600" />
            </div>
            <p className="font-medium text-slate-600">Loading bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-slate-200 to-slate-100 text-3xl text-slate-500 shadow-inner">
              <i className="fa-solid fa-calendar-xmark" aria-hidden />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl mb-2">No Bookings Yet</h2>
            <p className="max-w-md text-slate-600">No equipment bookings have been made yet. Check back later!</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-slate-200 to-slate-100 text-3xl text-slate-500 shadow-inner">
              <i className="fa-solid fa-search" aria-hidden />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl mb-2">No Results Found</h2>
            <p className="max-w-md text-slate-600 mb-6">Try adjusting your search criteria to find bookings.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-brand-500 hover:to-brand-700"
            >
              <i className="fa-solid fa-rotate-right" aria-hidden />
              Clear Search
            </button>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            {filteredBookings.map((booking, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-brand-100/60 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-brand-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/5 blur-3xl group-hover:blur-2xl" />
                
                <div className="relative space-y-4">
                  {/* Header */}
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base">{booking.equipmentName}</h3>
                    <p className="text-xs text-slate-500 mt-1">Equipment ID: <span className="font-mono font-semibold">{booking.equipmentId}</span></p>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">User:</span>
                      <span className="font-semibold text-slate-900">{booking.userName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Booking ID:</span>
                      <span className="font-mono text-xs font-semibold text-slate-800">{booking.bookingId}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-semibold text-slate-900">{booking.noOfdays} days</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">From:</span>
                      <span className="font-semibold text-slate-900">{booking.fromDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">To:</span>
                      <span className="font-semibold text-slate-900">{booking.toDate}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-brand-100">
                      <span className="font-semibold text-slate-600">Amount:</span>
                      <span className="font-heading text-lg font-bold text-brand-600">₹{booking.totalAmount}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-brand-100">
                    <p className="text-xs text-slate-600">
                      User ID: <span className="font-mono font-semibold">{booking.userId}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-md ring-1 ring-brand-50/50 animate-fade-in-up">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
              <thead className="bg-linear-to-r from-slate-50 to-brand-50/30">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">Equipment</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">User</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">Booking ID</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">From</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">To</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 text-center">Days</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking, index) => (
                  <tr key={index} className="transition hover:bg-brand-50/40" style={{ animationDelay: `${index * 30}ms` }}>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">{booking.equipmentName}</p>
                        <p className="text-xs text-slate-500 font-mono">{booking.equipmentId}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">{booking.userName}</p>
                        <p className="text-xs text-slate-500 font-mono">{booking.userId}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-700">{booking.bookingId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">{booking.fromDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">{booking.toDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2.5 py-1 text-xs font-semibold">
                        <i className="fa-solid fa-calendar-days" aria-hidden />
                        {booking.noOfdays}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-brand-600">₹{booking.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllBookings;
