import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../API/auth";
import { useToast } from "../../context/ToastContext";
import InlineSpinner from "../ui/InlineSpinner";
import { isApiSuccess } from "../../utils/apiResponse";

function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await forgotPassword({ email });
      if (isApiSuccess(data)) {
        showToast("Email sent successfully. Check your inbox.", "success");
      } else {
        showToast(data?.message || "Email could not be sent", "error");
      }
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/50 to-slate-100 px-4 py-10">
      <div className="animate-fade-in-up w-full max-w-md rounded-2xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5 ring-1 ring-brand-50/50">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} aria-busy={isLoading}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email-forgot">
              Email Address
            </label>
            <input
              type="email"
              id="email-forgot"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-800 py-3 px-4 font-semibold text-white shadow-md shadow-brand-700/20 transition duration-200 hover:from-brand-500 hover:to-brand-700 disabled:cursor-not-allowed disabled:opacity-90"
          >
            {isLoading ? (
              <>
                <InlineSpinner className="h-5 w-5 text-white" />
                <span>Sending…</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/Login" className="text-sm font-medium text-brand-700 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
