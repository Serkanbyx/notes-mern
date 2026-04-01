import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/Spinner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      emailRef.current?.focus();
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      emailRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <MailIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="text-sm text-gray-500">
            If an account with that email exists, we've sent a password reset
            link. Please check your inbox and spam folder.
          </p>
          <Link
            to="/login"
            className="inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot password?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <ErrorIcon />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                error
                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              }`}
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Spinner size="sm" /> : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-gray-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-8 w-8 text-green-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

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

export default ForgotPasswordPage;
