import { useState } from "react";
import { Link } from "react-router-dom";
import { userSignup } from "../../../API/auth";
import { useToast } from "../../context/ToastContext";
import InlineSpinner from "../ui/InlineSpinner";

function Signup() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreed) {
      showToast("You must agree to the terms and conditions", "error");
      return;
    }
    setIsLoading(true);
    try {
      const data = await userSignup({ name, email, password, phoneNo });
      if (data.code === 1) {
        showToast("Account created successfully. Check your email.", "success");
      } else {
        showToast("Could not create account. Please try again.", "error");
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const input =
    "w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/50 to-slate-100 px-4 py-12">
      <div className="animate-scale-in w-full max-w-md rounded-2xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5 ring-1 ring-brand-50/50">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-slate-900">Sign Up</h1>
          <p className="mt-2 text-sm text-slate-500">Create your account to get started</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} aria-busy={isLoading}>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className={`${input} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="user@gmail.com"
              className={`${input} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              className={`${input} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70`}
              value={phoneNo}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className={`${input} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="checkbox-signup"
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:cursor-not-allowed"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={isLoading}
              />
            </div>
            <label htmlFor="checkbox-signup" className="ml-2 cursor-pointer text-sm text-slate-600">
              I agree to the{" "}
              <Link to="/TermsAndConditions" className="text-brand-700 hover:underline">
                Terms & Conditions
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-3 font-bold text-white shadow-md shadow-brand-700/20 transition duration-200 hover:from-brand-500 hover:to-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-90"
          >
            {isLoading ? (
              <>
                <InlineSpinner className="h-5 w-5 text-white" />
                <span>Creating account…</span>
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Already a Member?{" "}
            <Link to="/Login" className="font-semibold text-brand-700 hover:underline">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
