import { useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirm: "", general: "" });
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const validate = () => {
    const newErrors = { password: "", confirm: "", general: "" };

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirm = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);

    if (newErrors.password) {
      passwordRef.current?.focus();
      return false;
    }
    if (newErrors.confirm) {
      confirmRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ password: "", confirm: "", general: "" });

    if (!validate()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to reset password. The link may have expired.";
      setErrors((prev) => ({ ...prev, general: message }));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = (hasError) =>
    [
      "w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
      hasError
        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900",
    ].join(" ");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below
          </p>
        </div>

        {errors.general && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <ErrorIcon />
            <span>{errors.general}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
        >
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={inputClassName(errors.password)}
              placeholder="Min. 6 characters"
            />
            {errors.password && (
              <p role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              ref={confirmRef}
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirm)
                  setErrors((prev) => ({ ...prev, confirm: "" }));
              }}
              className={inputClassName(errors.confirm)}
              placeholder="Re-enter your password"
            />
            {errors.confirm && (
              <p role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.confirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Spinner size="sm" /> : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          <Link
            to="/login"
            className="font-medium text-gray-900 hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

const ErrorIcon = () => (
  <svg
    className="mt-0.5 h-4 w-4 shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

export default ResetPasswordPage;
