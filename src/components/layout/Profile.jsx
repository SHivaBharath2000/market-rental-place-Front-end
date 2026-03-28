/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MyContext } from "../../context/AppContext";

function ProfileButton({ userName, toggleDropdown }) {
  return (
    <button
      type="button"
      onClick={toggleDropdown}
      className="flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-base font-semibold text-slate-900 shadow-sm transition duration-200 hover:border-brand-400 hover:bg-brand-50 hover:shadow-md sm:px-5 sm:text-lg"
    >
      <span className="max-w-[140px] truncate sm:max-w-[200px]">{userName}</span>
      <i className="fa-regular fa-user text-slate-600" aria-hidden />
    </button>
  );
}

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const { setToken, userName, setUserName, setItems, setAdmin, setBooking } = useContext(MyContext);
  const localtoken = localStorage.getItem("token");

  useEffect(() => {
    if (localtoken) {
      const userDetails = jwtDecode(localtoken);
      if (userDetails) {
        setUserName(userDetails.name);
      }
    }
  }, [localtoken, setUserName]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserName("");
    setAdmin(false);
    setItems([]);
    setBooking([]);
    setIsOpen(false);
  };

  return (
    <div className="relative flex justify-center">
      <ProfileButton userName={userName} toggleDropdown={toggleDropdown} />
      {isOpen && (
        <div className="animate-fade-in-up absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-xl border border-brand-100 bg-white py-1 shadow-lg shadow-brand-900/10 ring-1 ring-brand-50 motion-reduce:animate-none">
          <Link
            to="/"
            onClick={handleLogout}
            className="block px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-brand-50"
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile;
