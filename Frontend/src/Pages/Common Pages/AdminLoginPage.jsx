
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mountain } from "lucide-react";

import ThemeToggle from "../../Component/Citizen Component/ThemeToggle.jsx";
import api from "../../Api/api.js";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ============================
      // LOGIN API
      // ============================

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      // ============================
      // RESPONSE VALIDATION
      // ============================

      if (!token || !user) {
        throw new Error("Invalid login response from server.");
      }

      // ============================
      // NORMALIZE ROLE
      // ============================

      const userRole = String(user.role || "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

      const allowedAdminRoles = [
        "admin",
        "administrator",
        "superadmin",
      ];

      // ============================
      // ADMIN ROLE CHECK
      // ============================

      if (!allowedAdminRoles.includes(userRole)) {
        setError("This account is not an admin account.");
        return;
      }

      // Keep normalized role in stored user
      const adminUser = {
        ...user,
        role: userRole,
      };

      // ============================
      // CLEAR OLD AUTH DATA
      // ============================

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // ============================
      // SAVE LOGIN SESSION
      // ============================

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify(adminUser)
        );
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(adminUser)
        );
      }

      // ============================
      // DEBUG
      // ============================

      console.log("Admin login successful");
      console.log("Admin user:", adminUser);
      console.log("Remember me:", rememberMe);

      // ============================
      // REDIRECT
      // ============================

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center p-1 sm:p-2">
      <ThemeToggle />

      <div
        className="
          relative
          min-h-[calc(100vh-8px)]
          sm:min-h-[calc(100vh-16px)]
          w-full
          max-w-[1400px]
          overflow-hidden
          rounded-md
          bg-cover
          bg-center
          flex
          flex-col
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Top Badge */}
        <div className="relative z-10 flex justify-center pt-1 sm:pt-2">
          <div
            className="
              rounded-b-md
              bg-slate-900/95
              px-5
              py-1.5
              sm:px-8
              sm:py-2
              shadow-lg
            "
          >
            <h1 className="text-[11px] sm:text-sm md:text-base font-bold text-white tracking-wide">
              ADMIN LOGIN PAGE
            </h1>
          </div>
        </div>

        {/* Header */}
        <header
          className="
            relative
            z-10
            flex
            items-center
            px-5
            py-7
            sm:px-8
            sm:py-10
            md:px-12
            md:py-12
            lg:px-16
          "
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <div
              className="
                flex
                items-center
                justify-center
                w-11
                h-11
                sm:w-14
                sm:h-14
                md:w-16
                md:h-16
                text-white
              "
            >
              <Mountain className="w-full h-full stroke-[1.5]" />
            </div>

            {/* Title */}
            <div className="text-white">
              <h2 className="text-sm sm:text-base md:text-lg font-bold leading-tight">
                Landslide Risk
              </h2>

              <h2 className="text-sm sm:text-base md:text-lg font-bold leading-tight">
                Monitoring System
              </h2>
            </div>
          </div>
        </header>

        {/* Login Area */}
        <main
          className="
            relative
            z-10
            flex-1
            flex
            items-center
            justify-center
            px-4
            pb-12
            sm:pb-16
          "
        >
          <div
            className="
              w-full
              max-w-[360px]
              sm:max-w-[380px]
              bg-white/95
              dark:bg-slate-900/95
              backdrop-blur-sm
              rounded-lg
              shadow-2xl
              p-5
              sm:p-6
              md:p-7
            "
          >
            {/* Heading */}
            <div className="text-center mb-5">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Admin Login
              </h3>

              <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Sign in to continue
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  mb-4
                  rounded-md
                  border
                  border-red-200
                  bg-red-50
                  px-3
                  py-2
                  text-xs
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="
                    block
                    mb-1.5
                    text-[10px]
                    sm:text-xs
                    font-semibold
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  autoComplete="email"
                  className="
                    w-full
                    h-9
                    sm:h-10
                    px-3
                    rounded-md
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-white
                    dark:bg-slate-800
                    text-xs
                    sm:text-sm
                    text-gray-800
                    dark:text-gray-100
                    placeholder:text-gray-400
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="
                    block
                    mb-1.5
                    text-[10px]
                    sm:text-xs
                    font-semibold
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="
                      w-full
                      h-9
                      sm:h-10
                      px-3
                      pr-10
                      rounded-md
                      border
                      border-gray-200
                      dark:border-gray-700
                      bg-white
                      dark:bg-slate-800
                      text-xs
                      sm:text-sm
                      text-gray-800
                      dark:text-gray-100
                      placeholder:text-gray-400
                      outline-none
                      transition
                      focus:border-green-500
                      focus:ring-2
                      focus:ring-green-100
                    "
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      hover:text-gray-800
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label
                  className="
                    flex
                    items-center
                    gap-1.5
                    cursor-pointer
                    text-[9px]
                    sm:text-[10px]
                    text-gray-600
                    dark:text-gray-400
                  "
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="
                      w-3
                      h-3
                      rounded
                      border-gray-300
                      text-green-600
                      focus:ring-green-500
                    "
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="
                    text-[9px]
                    sm:text-[10px]
                    font-medium
                    text-green-600
                    hover:text-green-800
                  "
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full
                  h-9
                  sm:h-10
                  rounded-md
                  text-white
                  text-xs
                  sm:text-sm
                  font-semibold
                  shadow-sm
                  transition-all
                  duration-200

                  ${
                    loading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 active:bg-green-800 hover:shadow-md"
                  }
                `}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="
            relative
            z-10
            h-9
            sm:h-10
            flex
            items-center
            justify-center
            bg-slate-950/85
            text-white
            text-[8px]
            sm:text-[10px]
          "
        >
          © 2026 Landslide Risk Monitoring System
        </footer>
      </div>
    </div>
  );
};

export default AdminLogin;

