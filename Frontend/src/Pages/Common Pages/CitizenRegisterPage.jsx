import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mountain,
  UserRound,
  Mail,
  Lock,
  ArrowLeft,
} from "lucide-react";
import api from "../../Api/api.js";
import ThemeToggle from "../../Component/Citizen Component/ThemeToggle.jsx";

const CitizenRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "citizen",
      });

      console.log("Registration successful:", response.data);

      setSuccess("Account created successfully. Redirecting to login...");

      // Redirect after successful registration
      setTimeout(() => {
        navigate("/citizen/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 dark:bg-slate-100 flex items-center justify-center p-1 sm:p-2">
      <ThemeToggle />
      {/* Main Container */}
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
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40" />

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
              CITIZEN REGISTRATION PAGE
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
            py-5
            sm:px-8
            sm:py-6
            md:px-12
            lg:px-16
          "
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <div
              className="
                w-11
                h-11
                sm:w-14
                sm:h-14
                rounded-xl
                bg-white/10
                border
                border-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
              "
            >
              <Mountain
                className="w-7 h-7 sm:w-9 sm:h-9 text-white"
                strokeWidth={1.5}
              />
            </div>

            {/* Branding */}
            <div className="text-white">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                Landslide Risk
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-gray-200">
                Monitoring System
              </p>
            </div>
          </div>
        </header>

        {/* Register Section */}
        <main
          className="
            relative
            z-10
            flex-1
            flex
            items-center
            justify-center
            px-4
            pb-8
          "
        >
          <div
            className="
              w-full
              max-w-[370px]
              sm:max-w-[390px]
              bg-white/95 dark:bg-slate-900/95
              backdrop-blur-md
              rounded-xl
              shadow-2xl
              p-5
              sm:p-6
              md:p-7
            "
          >
            {/* Citizen Icon */}
            <div className="flex justify-center mb-3">
              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-green-100
                  flex
                  items-center
                  justify-center
                "
              >
                <UserRound className="w-6 h-6 text-green-600" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-5">
              <h3
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  text-gray-900 dark:text-white
                "
              >
                Create Citizen Account
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  sm:text-xs
                  text-gray-500 dark:text-gray-400
                "
              >
                Register to access the monitoring system
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-100 px-3 py-2">
                <p className="text-red-500 text-[10px] sm:text-xs">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-4 rounded-md bg-green-50 border border-green-100 px-3 py-2">
                <p className="text-green-600 text-[10px] sm:text-xs">
                  {success}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="
                    block
                    mb-1.5
                    text-[10px]
                    sm:text-xs
                    font-semibold
                    text-gray-700 dark:text-gray-300
                  "
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={15}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="
                      w-full
                      h-9
                      sm:h-10
                      pl-9
                      pr-3
                      rounded-md
                      border
                      border-gray-200 dark:border-gray-700
                      bg-white dark:bg-slate-800
                      text-xs
                      sm:text-sm
                      outline-none
                      transition
                      focus:border-green-500
                      focus:ring-2
                      focus:ring-green-100
                    "
                    required
                  />
                </div>
              </div>

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
                    text-gray-700 dark:text-gray-300
                  "
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="
                      w-full
                      h-9
                      sm:h-10
                      pl-9
                      pr-3
                      rounded-md
                      border
                      border-gray-200 dark:border-gray-700
                      bg-white dark:bg-slate-800
                      text-xs
                      sm:text-sm
                      outline-none
                      transition
                      focus:border-green-500
                      focus:ring-2
                      focus:ring-green-100
                    "
                    required
                  />
                </div>
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
                    text-gray-700 dark:text-gray-300
                  "
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={15}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="
                      w-full
                      h-9
                      sm:h-10
                      pl-9
                      pr-10
                      rounded-md
                      border
                      border-gray-200 dark:border-gray-700
                      bg-white dark:bg-slate-800
                      text-xs
                      sm:text-sm
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      hover:text-gray-800
                    "
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="
                    block
                    mb-1.5
                    text-[10px]
                    sm:text-xs
                    font-semibold
                    text-gray-700 dark:text-gray-300
                  "
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={15}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="
                      w-full
                      h-9
                      sm:h-10
                      pl-9
                      pr-10
                      rounded-md
                      border
                      border-gray-200 dark:border-gray-700
                      bg-white dark:bg-slate-800
                      text-xs
                      sm:text-sm
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      hover:text-gray-800
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-9
                  sm:h-10
                  rounded-md
                  bg-green-600
                  hover:bg-green-700
                  active:bg-green-800
                  disabled:bg-green-400
                  text-white
                  text-xs
                  sm:text-sm
                  font-semibold
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                "
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login */}
            <div
              className="
                text-center
                mt-5
                pt-4
                border-t
                border-gray-100
              "
            >
              <p
                className="
                  text-[10px]
                  sm:text-xs
                  text-gray-500
                "
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/citizen/login")}
                  className="
                    font-semibold
                    text-green-600
                    hover:text-green-800
                  "
                >
                  Login
                </button>
              </p>
            </div>

            {/* Back to Role Selection */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                mx-auto
                mt-4
                flex
                items-center
                gap-1.5
                text-[9px]
                sm:text-[10px]
                text-gray-500
                hover:text-gray-800
                transition
              "
            >
              <ArrowLeft size={13} />
              Change Role
            </button>
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
            text-[8px]
            sm:text-[10px]
            text-gray-300
          "
        >
          © 2026 Landslide Risk Monitoring System
        </footer>
      </div>
    </div>
  );
};

export default CitizenRegister;
