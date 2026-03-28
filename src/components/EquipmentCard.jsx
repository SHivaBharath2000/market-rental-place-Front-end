/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react";
import { MyContext } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function EquipmentCard({ src, rentRates, description, equipmentName, equipmentId, index = 0 }) {
  const { setBooking, setAdmin } = useContext(MyContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleClick = (event) => {
    const name = event.currentTarget.getAttribute("data-name");
    const id = event.currentTarget.getAttribute("data-id");
    const amount = event.currentTarget.getAttribute("data-amount");

    try {
      const users = jwtDecode(localStorage.getItem("token"));
      const userName = users.name;
      const userid = users.id;
      const billId = Date.now().toString();
      if (users) {
        setBooking({ name, id, userName, userid, billId, amount });
        navigate("/Bookings");
      } else {
        showToast("Please Login First", "error");
      }
    } catch {
      showToast("Please Login First", "error");
    }
    console.log(name);
    console.log(id);
  };

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userDetails = jwtDecode(token);
          if (userDetails.isAdmin) {
            setAdmin(true);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    initialize();
  }, [setAdmin]);

  const delayStyle = { animationDelay: `${Math.min(index, 8) * 70}ms` };

  return (
    <div
      className="animate-fade-in-up w-full max-w-2xl xl:max-w-none motion-reduce:animate-none"
      style={delayStyle}
    >
      <article className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80 transition duration-500 hover:-translate-y-1 hover:border-brand-200/80 hover:shadow-[0_20px_40px_-12px_rgba(15,118,110,0.15)] motion-reduce:transform-none">
        {/* top accent line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-teal-600 opacity-90 transition duration-300 group-hover:opacity-100" />

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden md:aspect-auto md:h-[280px] md:w-[42%] lg:h-[300px]">
            <img
              src={src}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              alt={equipmentName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60 transition duration-300 group-hover:opacity-40 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-slate-900/20" />
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 shadow-sm backdrop-blur-sm ring-1 ring-emerald-200/80 sm:text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex flex-1 flex-col justify-between gap-5 p-6 sm:p-7 lg:p-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-heading text-xl font-bold leading-snug text-slate-900 sm:text-2xl lg:pr-4">
                  {equipmentName}
                </h3>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-500 ring-1 ring-slate-200/80">
                  #{equipmentId}
                </span>
              </div>
              <p className="line-clamp-4 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-7">{description}</p>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Rental rate</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold tabular-nums text-brand-700 sm:text-3xl">₹{rentRates}</span>
                  <span className="text-sm font-medium text-slate-500">/ day</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClick}
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-700/20 transition duration-200 hover:from-brand-500 hover:to-brand-700 hover:shadow-xl hover:shadow-brand-600/30 active:scale-[0.98] sm:w-auto sm:min-w-[160px] motion-reduce:transform-none"
                data-name={equipmentName}
                data-id={equipmentId}
                data-amount={rentRates}
              >
                Book now
                <i className="fa-solid fa-arrow-right transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default EquipmentCard;
