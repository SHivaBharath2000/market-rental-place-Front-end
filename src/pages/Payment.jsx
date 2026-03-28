import { useEffect, useState, useContext, useCallback } from "react";
import { MyContext } from "../context/AppContext";
import { payment } from "../../API/auth";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../context/ToastContext";
import InlineSpinner from "../components/ui/InlineSpinner";

const Payment = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const { userName } = useContext(MyContext);
  const { showToast } = useToast();

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const localtoken = localStorage.getItem("token");
      if (!localtoken) {
        setRecords([]);
        return;
      }
      const userDetails = jwtDecode(localtoken);
      const response = await payment({ userName: userDetails.name });
      setRecords(response.userPayments ?? []);
    } catch (error) {
      console.error("Error fetching records:", error);
      showToast("Could not load payment records.", "error");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, userName]);

  // Calculate statistics
  const totalPayments = records.length;
  const totalAmount = records.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0);
  const paidCount = records.filter(r => r.paymentStatus === "Paid").length;

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
              Payment History
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight mb-3">
              Your{" "}
              <span className="bg-linear-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                Payment Records
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              View and track all your equipment rental payments in one place. Stay updated on your booking status and payment details.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && records.length > 0 && (
          <div className="mb-12 grid gap-4 sm:grid-cols-3 animate-fade-in-up">
            {/* Total Payments Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-brand-200">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl group-hover:blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Payments</p>
                  <i className="fa-solid fa-receipt text-blue-500 text-lg" aria-hidden />
                </div>
                <p className="font-heading text-3xl font-bold text-slate-900">{totalPayments}</p>
                <p className="text-xs text-slate-500 mt-2">transactions recorded</p>
              </div>
            </div>

            {/* Total Amount Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-emerald-200">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl group-hover:blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Spent</p>
                  <i className="fa-solid fa-wallet text-emerald-500 text-lg" aria-hidden />
                </div>
                <p className="font-heading text-3xl font-bold text-emerald-600">₹{totalAmount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-2">across all bookings</p>
              </div>
            </div>

            {/* Paid Payments Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-amber-200">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl group-hover:blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Completed</p>
                  <i className="fa-solid fa-circle-check text-amber-500 text-lg" aria-hidden />
                </div>
                <p className="font-heading text-3xl font-bold text-slate-900">{paidCount}/{totalPayments}</p>
                <p className="text-xs text-slate-500 mt-2">payments confirmed</p>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        {!loading && records.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-slate-900">Payment Details</h2>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm">
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
        )}

        {loading ? (
          <div
            className="flex min-h-[45vh] flex-col items-center justify-center gap-4 rounded-2xl border border-brand-100 bg-white/90 py-16 shadow-md ring-1 ring-brand-50/50"
            aria-busy="true"
          >
            <div className="animate-spin">
              <InlineSpinner className="h-12 w-12 text-brand-600" />
            </div>
            <p className="font-medium text-slate-600">Loading payment records…</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-slate-200 to-slate-100 text-3xl text-slate-500 shadow-inner">
              <i className="fa-solid fa-credit-card" aria-hidden />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl mb-2">No Payments Yet</h2>
            <p className="max-w-md text-slate-600 mb-6">
              Your completed payments will appear here. Start booking equipment to make your first payment!
            </p>
            <a
              href="/Bookings"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-brand-500 hover:to-brand-700"
            >
              <i className="fa-solid fa-booking" aria-hidden />
              Make a Booking
            </a>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 animate-fade-in-up">
            {records.map((record, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-brand-100/60 bg-white shadow-md transition hover:shadow-lg hover:border-brand-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/5 blur-3xl group-hover:blur-2xl" />
                
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 text-base">{record.equipmentName}</h3>
                      <p className="text-xs text-slate-500 mt-1">Booking ID: <span className="font-mono font-semibold">{record.bookingId}</span></p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ${
                      record.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                        : "bg-amber-100 text-amber-700 ring-amber-200"
                    }`}>
                      {record.paymentStatus === "Paid" ? (
                        <>
                          <i className="fa-solid fa-circle-check" aria-hidden />
                          Paid
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-clock" aria-hidden />
                          Pending
                        </>
                      )}
                    </span>
                  </div>

                  {/* Content Grid */}
                  <div className="grid gap-3 sm:grid-cols-2 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3 ring-1 ring-brand-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">User</p>
                      <p className="font-semibold text-slate-900">{record.userName}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 ring-1 ring-brand-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Equipment ID</p>
                      <p className="font-semibold text-slate-900">{record.equipmentId}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 ring-1 ring-brand-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Duration</p>
                      <p className="font-semibold text-slate-900">{record.noOfdays} {record.noOfdays == 1 ? "day" : "days"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 ring-1 ring-brand-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Amount</p>
                      <p className="font-bold text-brand-600 text-lg">₹{record.totalAmount}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-brand-100/50 pt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>User ID: <span className="font-mono font-semibold">{record.userId}</span></span>
                    {record.paymentStatus === "Paid" && (
                      <span className="text-emerald-600 font-semibold">
                        <i className="fa-solid fa-check-double mr-1" aria-hidden />
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-md ring-1 ring-brand-50/50 animate-fade-in-up">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-linear-to-r from-slate-50 to-brand-50/30">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">User</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">Booking ID</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">Equipment</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">Days</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">Amount</th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record, index) => (
                  <tr key={index} className="transition hover:bg-brand-50/40 hover:shadow-sm" style={{ animationDelay: `${index * 30}ms` }}>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">{record.userName}</p>
                        <p className="text-xs text-slate-500 font-mono">{record.userId}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-700">{record.bookingId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-800">{record.equipmentName}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-800">{record.noOfdays}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-brand-600">₹{record.totalAmount}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                        record.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                          : "bg-amber-100 text-amber-700 ring-amber-200"
                      }`}>
                        {record.paymentStatus === "Paid" ? (
                          <i className="fa-solid fa-circle-check" aria-hidden />
                        ) : (
                          <i className="fa-solid fa-clock" aria-hidden />
                        )}
                        {record.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
