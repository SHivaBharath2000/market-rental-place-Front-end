import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyContext } from "./context/AppContext";
import { useToast } from "./context/ToastContext";
import { getEquipments } from "../API/auth";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Payment from "./pages/Payment";
import EquipmentPage from "./pages/EquipmentPage";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import TermsAndConditions from "./pages/TermsAndConditions";
import Addequipment from "./pages/Addequipment";
import AllBookings from "./pages/AllBookings";
import ForgotPassword from "./components/auth/ForgotPassword";
import Resetpassword from "./components/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [items, setItems] = useState([]);
  const [booking, setBooking] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setEquipmentLoading(true);
    try {
      const data = await getEquipments();
      if (data?.code === 1 || data?.Code === 1) {
        setItems(data.data ?? []);
      } else {
        showToast("Records not added", "error");
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
      showToast("An error occurred while fetching the equipment.", "error");
    } finally {
      setEquipmentLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setItems([]);
    }
  }, [token, fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/80 via-slate-50 to-slate-100">
      <BrowserRouter>
        <MyContext.Provider
          value={{
            token,
            setToken,
            items,
            setItems,
            booking,
            setBooking,
            admin,
            setAdmin,
            userName,
            setUserName,
            equipmentLoading,
          }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/Bookings"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Payments"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Equipment"
              element={
                <ProtectedRoute>
                  <EquipmentPage />
                </ProtectedRoute>
              }
            />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
            <Route
              path="/addequipment"
              element={
                <ProtectedRoute>
                  <Addequipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/allbookings"
              element={
                <ProtectedRoute>
                  <AllBookings />
                </ProtectedRoute>
              }
            />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<Resetpassword />} />
          </Routes>
        </MyContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
