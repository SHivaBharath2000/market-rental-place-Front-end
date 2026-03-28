import { useState, useContext, useEffect } from "react";
import { MyContext } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { bookings as createBooking, stripePayment, savePayment } from "../../API/auth";
import jsPDF from "jspdf";

function About() {
  const { booking } = useContext(MyContext);
  const { showToast } = useToast();
  const [bookingList, setBookingList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [noOfdays, setNoOfdays] = useState(0);
  const [amount, setAmount] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(amount);
  }, [amount]);

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
    if (toDate) {
      const days = calculateDaysBetweenDates(event.target.value, toDate);
      setNoOfdays(days);
      setAmount(days * Number(booking.amount));
    }
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
    if (fromDate) {
      const days = calculateDaysBetweenDates(fromDate, event.target.value);
      setNoOfdays(days);
      setAmount(days * Number(booking.amount));
    }
  };

  const calculateDaysBetweenDates = (fromDateStr, toDateStr) => {
    const startDate = new Date(fromDateStr);
    const endDate = new Date(toDateStr);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return Math.round(dayDifference);
  };

  const handleToken = async (token) => {
    try {
      setIsProcessing(true);
      setPaymentStatus("processing");
      
      const payment = await stripePayment(token, amount, booking.name);
      if (payment) {
        const status = await handlePayment();
        if (status) {
          setPaymentStatus("success");
          showToast("Payment successful! Booking confirmed.", "success");
          
          // Update booking status in the list
          if (confirmedBooking) {
            const updatedBooking = { ...confirmedBooking, paymentStatus: "Paid" };
            setBookingList(prevList =>
              prevList.map(b =>
                b.bookingId === confirmedBooking.bookingId ? updatedBooking : b
              )
            );
            setConfirmedBooking(updatedBooking);
          }
          
          // Create backend booking
          await createBackendBooking();
        } else {
          setPaymentStatus("failed");
          showToast("Payment recorded but booking creation failed", "error");
        }
      } else {
        setPaymentStatus("failed");
        showToast("Payment failed. Please try again.", "error");
      }
    } catch (error) {
      setPaymentStatus("failed");
      showToast("Error processing payment: " + error.message, "error");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (!confirmedBooking) {
        showToast("No booking details to verify", "error");
        return false;
      }
      
      const userData = {
        paymentId: Date.now().toString(),
        equipmentId: booking.id,
        equipmentName: booking.name,
        bookingId: booking.billId,
        userName: booking.userName,
        userId: booking.userid,
        noOfdays: noOfdays,
        totalAmount: amount,
        paymentStatus: "Paid",
      };
      const save = await savePayment(userData);
      return save ? true : false;
    } catch (error) {
      console.log(error);
      showToast("Something went wrong with payment", "error");
      return false;
    }
  };

  const createBackendBooking = async () => {
    try {
      if (!confirmedBooking) return;
      
      const newBooking = {
        bookingId: booking.billId,
        userId: booking.userid,
        userName: booking.userName,
        equipmentId: booking.id,
        equipmentName: booking.name,
        fromDate: confirmedBooking.fromDate,
        toDate: confirmedBooking.toDate,
        noOfdays: confirmedBooking.noOfdays,
        totalAmount: confirmedBooking.totalAmount,
      };
      
      const data = await createBooking(newBooking);
      if (data.Code === 1) {
        showToast("Booking created successfully!", "success");
        // User can manually navigate to Payments page
        return true;
      } else {
        showToast("Failed to create booking", "error");
        return false;
      }
    } catch (error) {
      showToast("Error creating booking: " + error.message, "error");
      return false;
    }
  };

  const downloadPDF = (bookingData) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 15;

      // Header - Logo/Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(20, 184, 166);
      doc.text("Market Rental Place", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      // Header - Subtitle
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Equipment Rental Booking Invoice", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 3;
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 8;

      // Horizontal line
      doc.setDrawColor(20, 184, 166);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;

      // Section 1: Booking Information
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(20, 184, 166);
      doc.text("BOOKING INFORMATION", 15, yPosition);
      yPosition += 8;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const bookingInfo = [
        [`Booking ID:`, bookingData.bookingId || "—"],
        [`Equipment:`, bookingData.equipmentName || "—"],
        [`Equipment ID:`, bookingData.equipmentId || "—"],
        [`User Name:`, bookingData.userName || "—"],
        [`User ID:`, bookingData.userId || "—"],
      ];

      bookingInfo.forEach(([label, value]) => {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.text(label, 20, yPosition);
        doc.setFont("Helvetica", "normal");
        doc.text(value, 80, yPosition);
        yPosition += 6;
      });

      yPosition += 4;

      // Section 2: Rental Period
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(20, 184, 166);
      doc.text("RENTAL PERIOD", 15, yPosition);
      yPosition += 8;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const rentalInfo = [
        [`From Date:`, bookingData.fromDate || "—"],
        [`To Date:`, bookingData.toDate || "—"],
        [`Duration:`, `${bookingData.noOfdays} ${bookingData.noOfdays === "1" ? "day" : "days"}`],
      ];

      rentalInfo.forEach(([label, value]) => {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.text(label, 20, yPosition);
        doc.setFont("Helvetica", "normal");
        doc.text(value, 80, yPosition);
        yPosition += 6;
      });

      yPosition += 4;

      // Section 3: Payment Summary
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(20, 184, 166);
      doc.text("PAYMENT SUMMARY", 15, yPosition);
      yPosition += 8;

      // Create a table-like structure for pricing
      const amount = parseInt(bookingData.totalAmount) || 0;
      const dailyRate = booking.amount || "0";

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      doc.text("Daily Rate:", 20, yPosition);
      doc.text(`₹${dailyRate}`, 100, yPosition);
      yPosition += 6;

      doc.text("Number of Days:", 20, yPosition);
      doc.text(bookingData.noOfdays.toString(), 100, yPosition);
      yPosition += 6;

      // Total line (bold and highlighted)
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20, 184, 166);
      yPosition += 2;
      doc.text("TOTAL AMOUNT:", 20, yPosition);
      doc.text(`₹${amount}`, 100, yPosition);
      yPosition += 8;

      // Section 4: Status
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(20, 184, 166);
      doc.text("PAYMENT STATUS", 15, yPosition);
      yPosition += 6;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Status: ${bookingData.paymentStatus}`, 20, yPosition);

      yPosition += 12;

      // Bottom line
      doc.setDrawColor(20, 184, 166);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 6;

      // Footer
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("This is an automated receipt for your equipment rental booking.", pageWidth / 2, pageHeight - 15, { align: "center" });
      doc.text("Contact us at info@marketplace.com for any queries.", pageWidth / 2, pageHeight - 10, { align: "center" });

      // Download the PDF
      const fileName = `Booking_${bookingData.bookingId}_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      showToast("Booking PDF downloaded successfully!", "success");
    } catch (error) {
      showToast("Error downloading PDF: " + error.message, "error");
      console.error("PDF Download Error:", error);
    }
  };

  const handleConfirmDetails = (event) => {
    event.preventDefault();
    
    if (noOfdays <= 0) {
      showToast("Please select valid dates", "error");
      return;
    }
    
    if (!fromDate || !toDate) {
      showToast("Please fill in all date fields", "error");
      return;
    }
    
    const newBooking = {
      bookingId: booking.billId,
      userId: booking.userid,
      userName: booking.userName,
      equipmentId: booking.id,
      equipmentName: booking.name,
      fromDate: new Date(fromDate).toLocaleDateString(),
      toDate: new Date(toDate).toLocaleDateString(),
      noOfdays: noOfdays.toString(),
      totalAmount: amount.toString(),
      paymentStatus: "Pending",
    };
    
    setConfirmedBooking(newBooking);
    setBookingList([newBooking]);
    showToast("Booking details confirmed! Proceed to payment.", "success");
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 sm:text-base";

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-50">
      {/* ambient background */}
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
              Secure Booking
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight mb-3">
              Complete Your{" "}
              <span className="bg-linear-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                Equipment Rental
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Review your booking details, select your rental dates, and proceed to payment. All transactions are secured with Stripe encryption.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Booking Form */}
          <div>
            <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-md ring-1 ring-brand-50/50 sm:p-8">
              <h2 className="font-heading mb-6 text-xl font-bold text-slate-900 sm:text-2xl flex items-center gap-2">
                <i className="fa-solid fa-clipboard-list text-brand-600" aria-hidden />
                Booking Details
              </h2>
              <form className="space-y-4" onSubmit={handleConfirmDetails}>
                {/* Equipment Summary Section */}
                <div className="rounded-xl border border-brand-200/50 bg-linear-to-br from-brand-50 to-teal-50/30 p-4 ring-1 ring-brand-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-3">
                    <i className="fa-solid fa-tag mr-1.5" aria-hidden />
                    Equipment Summary
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Equipment</label>
                      <div className="font-semibold text-slate-900">{booking.name || "—"}</div>
                      <p className="text-xs text-slate-500 mt-1">ID: {booking.id || "—"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Daily Rate</label>
                      <div className="font-semibold text-brand-600">₹{booking.amount || "0"}/day</div>
                    </div>
                  </div>
                </div>

                {/* Booking ID and User Info Section */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <i className="fa-solid fa-id-badge mr-1.5 text-brand-600" aria-hidden />
                      Booking ID:
                    </label>
                    <input
                      type="text"
                      name="bookingId"
                      value={booking.billId || ""}
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <i className="fa-solid fa-user-circle mr-1.5 text-brand-600" aria-hidden />
                      User ID:
                    </label>
                    <input
                      type="text"
                      name="userId"
                      value={booking.userid || ""}
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <i className="fa-solid fa-person mr-1.5 text-brand-600" aria-hidden />
                    User Name:
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={booking.userName || ""}
                    readOnly
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  />
                </div>

                {/* Date Selection Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-4">
                    <i className="fa-solid fa-calendar mr-1.5 text-brand-600" aria-hidden />
                    Rental Period
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">From Date:</label>
                      <input
                        type="date"
                        name="fromDate"
                        onChange={handleFromDateChange}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">To Date:</label>
                      <input
                        type="date"
                        name="toDate"
                        onChange={handleToDateChange}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Summary Section */}
                {noOfdays > 0 && (
                  <div className="rounded-xl bg-linear-to-br from-emerald-50 to-teal-50/30 border border-emerald-200/50 p-4 ring-1 ring-emerald-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-3">
                      <i className="fa-solid fa-receipt mr-1.5" aria-hidden />
                      Price Summary
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Duration</span>
                        <span className="font-semibold text-slate-900">
                          {noOfdays} {noOfdays === 1 ? "day" : "days"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Daily Rate</span>
                        <span className="font-semibold text-slate-900">₹{booking.amount || "0"}</span>
                      </div>
                      <div className="border-t border-emerald-200 pt-2.5 flex justify-between items-center">
                        <span className="text-sm font-semibold text-emerald-700">Total Amount</span>
                        <span className="text-xl font-bold text-emerald-600">₹{amount || "0"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden Fields for Reference */}
                <div className="hidden">
                  <label className="block text-sm font-medium text-slate-700">No of Days/Rent:</label>
                  <input type="number" name="noOfDaysRent" value={noOfdays || ""} readOnly className={inputClass} />
                  <label className="block text-sm font-medium text-slate-700 mt-2">Total Amount:</label>
                  <input type="number" name="totalAmount" value={amount || ""} readOnly className={inputClass} />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  {!confirmedBooking ? (
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-brand-800 py-3.5 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition hover:from-brand-500 hover:to-brand-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={noOfdays === 0}
                    >
                      <i className="fa-solid fa-check-circle" aria-hidden />
                      {noOfdays === 0 ? "Select Dates to Confirm" : "Confirm Booking Details"}
                    </button>
                  ) : (
                    <>
                      <div className="rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 ring-1 ring-emerald-100">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100">
                            <i className="fa-solid fa-check text-emerald-600 text-sm" aria-hidden />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-emerald-900 mb-1">Details Confirmed</p>
                            <p className="text-xs text-emerald-700">
                              {noOfdays} {noOfdays === 1 ? "day" : "days"} • ₹{amount}/total
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setConfirmedBooking(null);
                          setBookingList([]);
                          setPaymentStatus(null);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        <i className="fa-solid fa-edit" aria-hidden />
                        Edit Details
                      </button>

                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-500 mb-3 text-center">
                          <i className="fa-solid fa-lock mr-1.5" aria-hidden />
                          {isProcessing ? "Processing payment..." : "Proceed to secure payment"}
                        </p>
                        {paymentStatus === "success" && (
                          <div className="mb-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                            <p className="text-sm font-semibold text-emerald-700">
                              <i className="fa-solid fa-circle-check mr-1.5" aria-hidden />
                              Payment Completed Successfully!
                            </p>
                          </div>
                        )}
                        {paymentStatus === "failed" && (
                          <div className="mb-3 rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                            <p className="text-sm font-semibold text-red-700">
                              <i className="fa-solid fa-circle-xmark mr-1.5" aria-hidden />
                              Payment Failed. Please Try Again.
                            </p>
                          </div>
                        )}
                        {paymentStatus !== "success" && !isProcessing && (
                          <div style={{ display: amount > 0 ? "block" : "none" }}>
                            <StripeCheckout
                              style={{ height: "100%" }}
                              name={booking.name}
                              amount={amount * 100}
                              currency="INR"
                              token={handleToken}
                              disabled={isProcessing}
                              stripeKey="pk_test_51Q2DelFadwIWXwELGQD2oIPh7x8mJsBUqEZqNDT5xEhLxQ5EabHqIAMz8oDMeXelQGDYaVKnyKfNSGUYe96eszGu009vSKmbMj"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>

        {/* Right Column - Booking History */}
          <div>
            <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-md ring-1 ring-brand-50/50 sm:p-8">
              <h2 className="font-heading mb-6 text-xl font-bold text-slate-900 sm:text-2xl flex items-center gap-2">
              <i className="fa-solid fa-history text-brand-600" aria-hidden />
              Booking History
            </h2>
            {bookingList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-slate-200 to-slate-100 text-2xl text-slate-500 shadow-inner">
                  <i className="fa-solid fa-inbox" aria-hidden />
                </div>
                <h3 className="font-heading text-sm font-semibold text-slate-900 mb-1">No bookings confirmed yet</h3>
                <p className="text-xs text-slate-600">Start by selecting your rental dates and confirming the booking details.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookingList.map((b, index) => (
                  <div
                    key={index}
                    className="rounded-lg border-2 border-brand-300/60 bg-linear-to-br from-brand-50 to-teal-50/30 p-5 hover:border-brand-400 hover:shadow-md transition"
                  >
                    {/* Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-heading font-bold text-slate-900 text-sm">{b.equipmentName}</h4>
                        <p className="text-xs text-slate-500 mt-1">Booking ID: <span className="font-mono font-semibold">{b.bookingId}</span></p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        b.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                      }`}>
                        {b.paymentStatus === "Paid" ? (
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
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                      <div className="bg-white/60 rounded-lg p-3 ring-1 ring-brand-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">From</p>
                        <p className="font-semibold text-slate-900">{b.fromDate}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 ring-1 ring-brand-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">To</p>
                        <p className="font-semibold text-slate-900">{b.toDate}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 ring-1 ring-brand-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Duration</p>
                        <p className="font-semibold text-slate-900">{b.noOfdays} {b.noOfdays === "1" ? "day" : "days"}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 ring-1 ring-brand-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Total</p>
                        <p className="font-bold text-brand-600 text-lg">₹{b.totalAmount}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-brand-200/50 pt-3 flex items-center justify-between text-xs text-slate-600">
                      <span>User: <span className="font-semibold text-slate-900">{b.userName}</span></span>
                      <div className="flex items-center gap-2">
                        {paymentStatus === "success" && b.paymentStatus === "Paid" && (
                          <span className="text-emerald-600 font-semibold">
                            <i className="fa-solid fa-check-circle mr-1" aria-hidden />
                            Active
                          </span>
                        )}
                        <button
                          onClick={() => downloadPDF(b)}
                          className="inline-flex items-center gap-1.5 ml-4 px-3 py-1.5 rounded-lg bg-linear-to-r from-brand-500 to-brand-600 text-white text-xs font-semibold hover:from-brand-600 hover:to-brand-700 transition shadow-md hover:shadow-lg"
                          title="Download booking details as PDF"
                        >
                          <i className="fa-solid fa-download" aria-hidden />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default About;
