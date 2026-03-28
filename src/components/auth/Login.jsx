import { useState, useContext } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { userSignIn } from "../../../API/auth";
import { MyContext } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import InlineSpinner from "../ui/InlineSpinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useContext(MyContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/Equipment";

  if (localStorage.getItem("token")) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const data = await userSignIn({ email, password });
      if (data.code === 1) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        showToast("Logged in successfully", "success");
        navigate(from, { replace: true });
      } else {
        showToast("Please check your credentials", "error");
      }
    } catch (err) {
      showToast("Please check your credentials", "error");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/50 to-slate-100 px-4 py-10">
      <div className="animate-scale-in w-full max-w-md space-y-8 rounded-2xl border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5 ring-1 ring-brand-50/50 sm:p-10">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Login</h1>
          <p className="mt-3 text-slate-500">Sign in to manage your account</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} aria-busy={isLoading}>
          <div className="space-y-4">
            <input
              type="email"
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="checkbox-login"
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="checkbox-login" className="ml-2 cursor-pointer text-sm text-slate-700">
                I agree to{" "}
                <Link to="/TermsAndConditions" className="font-medium text-brand-700 hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-800 py-3 px-4 font-semibold text-white shadow-md shadow-brand-700/20 transition duration-200 hover:from-brand-500 hover:to-brand-700 disabled:cursor-not-allowed disabled:opacity-90"
          >
            {isLoading ? (
              <>
                <InlineSpinner className="h-5 w-5 text-white" />
                <span>Signing in…</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="space-y-3 pt-4 text-center">
          <p className="text-sm text-slate-600">
            Not a member?{" "}
            <Link to="/Signup" className="font-medium text-brand-700 hover:underline">
              Register here
            </Link>
          </p>
          <Link to="/forgotpassword" className="block text-xs text-slate-400 transition-colors hover:text-brand-700">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
