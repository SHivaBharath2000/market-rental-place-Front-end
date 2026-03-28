import { useState, useEffect } from "react";
import { resetPassword } from "../../../API/auth";
import { useToast } from "../../context/ToastContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import InlineSpinner from "../ui/InlineSpinner";
import { isApiSuccess } from "../../utils/apiResponse";

function Resetpassword() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ token: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setForm((prevForm) => ({ ...prevForm, token }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.token) {
      showToast("Invalid request: missing token.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const data = await resetPassword(form);

      if (isApiSuccess(data)) {
        showToast("Password reset successfully.", "success");
        navigate("/Login");
      } else {
        showToast(data?.message || "Reset unsuccessful.", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("An error occurred during password reset.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/50 to-slate-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="animate-scale-in w-full max-w-md rounded-2xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5 ring-1 ring-brand-50/50"
      >
        <h2 className="font-heading mb-6 text-center text-2xl font-bold text-slate-900">Reset Your Password</h2>
        <div className="mb-4">
          <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-800 py-3 font-semibold text-white shadow-md shadow-brand-700/20 transition hover:from-brand-500 hover:to-brand-700 disabled:cursor-not-allowed disabled:opacity-90"
        >
          {isLoading ? (
            <>
              <InlineSpinner className="h-5 w-5 text-white" />
              <span>Updating…</span>
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}

export default Resetpassword;
