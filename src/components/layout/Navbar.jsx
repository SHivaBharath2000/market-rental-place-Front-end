/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Profile from "./Profile";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/AppContext";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const { admin, setAdmin } = useContext(MyContext);
  const localtoken = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (localtoken) {
        try {
          const userDetails = jwtDecode(localtoken);
          if (userDetails.isAdmin) setAdmin(true);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    initialize();
  }, [localtoken, setAdmin]);

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-100/80 bg-white/90 shadow-[0_8px_30px_-12px_rgba(15,118,110,0.15)] backdrop-blur-md transition-shadow duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between sm:h-24">
          <Link to="/" className="group flex shrink-0 items-center gap-3 sm:gap-4">
            <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-2.5 shadow-lg shadow-brand-600/25 transition-all duration-500 ease-out group-hover:rotate-[12deg] group-hover:scale-110 group-hover:shadow-brand-600/40">
              <img
                className="h-6 w-6 invert brightness-0 sm:h-7 sm:w-7"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfDOnr9Yr1pqp00u-JVKP22rLrNlSWZygQHA&s"
                alt="Logo"
              />
            </div>
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-slate-900 transition-all duration-300 group-hover:tracking-normal sm:text-2xl">
              Market<span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">Rental</span>
            </h2>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl border border-brand-100 bg-brand-50/60 p-1.5 shadow-inner md:flex">
            <NavLink to="/">Home</NavLink>
            {localtoken ? (
              <>
                <NavLink to="/Equipment">Equipments</NavLink>
                {admin ? (
                  <NavLink to="/allbookings">Bookings</NavLink>
                ) : (
                  <NavLink to="/Bookings">Bookings</NavLink>
                )}
                <NavLink to="/Payments">Payments</NavLink>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {!localtoken ? (
              <div className="hidden items-center gap-4 md:flex md:gap-6">
                <Link
                  to="/Login"
                  className="text-[15px] font-semibold text-slate-600 transition-colors duration-200 hover:text-brand-800 sm:text-[16px]"
                >
                  Log In
                </Link>
                <Link
                  to="/Signup"
                  className="animate-scale-in whitespace-nowrap rounded-[14px] bg-gradient-to-r from-brand-700 to-brand-800 px-5 py-2.5 text-[14px] font-bold text-white shadow-lg shadow-brand-700/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-brand-600 hover:to-brand-700 hover:shadow-xl active:scale-95 motion-reduce:transform-none sm:px-7 sm:py-3 sm:text-[15px]"
                >
                  Join Now
                </Link>
              </div>
            ) : null}

            {localtoken ? (
              <div className="flex items-center border-l border-brand-100 pl-4 sm:pl-6">
                <div className="cursor-pointer transition-transform duration-200 hover:scale-105">
                  <Profile />
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl border border-brand-100 bg-brand-50/80 p-3 text-brand-900 transition-colors hover:bg-brand-100 md:hidden"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="animate-fade-in-up border-t border-brand-50 bg-white/98 p-6 shadow-2xl shadow-brand-900/10 motion-reduce:animate-none md:hidden">
          <div className="grid gap-4">
            <MobileLink to="/" onClick={() => setIsOpen(false)}>
              Home
            </MobileLink>
            {localtoken ? (
              <>
                <MobileLink to="/Equipment" onClick={() => setIsOpen(false)}>
                  Equipments
                </MobileLink>
                <MobileLink
                  to={admin ? "/allbookings" : "/Bookings"}
                  onClick={() => setIsOpen(false)}
                >
                  Bookings
                </MobileLink>
                <MobileLink to="/Payments" onClick={() => setIsOpen(false)}>
                  Payments
                </MobileLink>
              </>
            ) : (
              <p className="text-sm text-slate-500">Log in to browse equipment and manage bookings.</p>
            )}
          </div>
          {!localtoken && (
            <div className="mt-6 flex flex-col gap-4 border-t border-brand-100 pt-6">
              <Link
                to="/Login"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl border-2 border-brand-100 py-4 text-center font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50"
              >
                Log In
              </Link>
              <Link
                to="/Signup"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 py-4 text-center font-bold text-white shadow-lg shadow-brand-700/30"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="rounded-[12px] px-4 py-2.5 text-[15px] font-semibold text-slate-600 transition-all duration-300 hover:bg-white hover:text-brand-800 hover:shadow-md sm:px-6 sm:text-[16px]"
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="font-heading text-2xl font-bold text-slate-900 transition-colors duration-200 hover:text-brand-700"
    >
      {children}
    </Link>
  );
}

export default Navbar;
