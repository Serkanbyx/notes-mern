import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_ERRORS = { name: "", email: "", password: "", general: "" };

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const fieldRefs = { name: nameRef, email: emailRef, password: passwordRef };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, form[name]);
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2)
          error = "Name must be at least 2 characters";
        else if (value.trim().length > 50)
          error = "Name cannot exceed 50 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!EMAIL_REGEX.test(value))
          error = "Please enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6)
          error = "Password must be at least 6 characters";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const validate = () => {
    const newErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      password: validateField("password", form.password),
      general: "",
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });

    const firstErrorField = ["name", "email", "password"].find(
      (f) => newErrors[f],
    );
    if (firstErrorField) {
      fieldRefs[firstErrorField].current?.focus();
      return false;
    }
    return true;
  };

  const parseServerErrors = (err) => {
    const data = err.response?.data;
    if (!data) return { general: "Connection error. Please try again." };

    const fieldErrors = { ...EMPTY_ERRORS };

    if (data.errors?.length) {
      for (const e of data.errors) {
        const field = e.path || e.param;
        if (field && field in fieldErrors) {
          if (!fieldErrors[field]) fieldErrors[field] = e.msg;
        } else if (!fieldErrors.general) {
          fieldErrors.general = e.msg;
        }
      }
    }

    if (data.message && !Object.values(fieldErrors).some(Boolean)) {
      if (data.message.toLowerCase().includes("email")) {
        fieldErrors.email = data.message;
      } else {
        fieldErrors.general = data.message;
      }
    }

    if (!Object.values(fieldErrors).some(Boolean)) {
      fieldErrors.general = "Registration failed. Please try again.";
    }

    return fieldErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(EMPTY_ERRORS);

    if (!validate()) return;

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      const serverErrors = parseServerErrors(err);
      setErrors(serverErrors);

      if (serverErrors.general) {
        toast.error(serverErrors.general);
      }

      const firstErrorField = ["name", "email", "password"].find(
        (f) => serverErrors[f],
      );
      if (firstErrorField) {
        fieldRefs[firstErrorField].current?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = (field) => {
    const hasError = errors[field] && touched[field];
    return [
      "w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
      hasError
        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900",
    ].join(" ");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start organizing your notes today
          </p>
        </div>

        {errors.general && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
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
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClassName("name")}
              placeholder="John Doe"
            />
            {errors.name && touched.name && (
              <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

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
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClassName("email")}
              placeholder="you@example.com"
            />
            {errors.email && touched.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={inputClassName("password")}
              placeholder="Min. 6 characters"
            />
            {errors.password && touched.password && (
              <p id="password-error" role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Spinner size="sm" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
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

export default RegisterPage;
