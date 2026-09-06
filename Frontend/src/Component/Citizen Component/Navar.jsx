import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  Map,
  PhoneCall,
  Bell,
  X,
  AlertTriangle,
  MapPin,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toggleDarkMode } from "../../Redux/Citizen Slices/themeSlice.js";
import { fetchAlerts } from "../../Redux/Citizen Slices/alertSlice.js";

const CitizenNavbar = ({ sidebarOpen, setSidebarOpen, darkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =========================================================
     REDUX
  ========================================================= */

  const authUser = useSelector((state) => state.auth?.user);

  const alerts = useSelector((state) => state.alerts?.alerts || []);

  /* =========================================================
     LOCAL USER FALLBACK
  ========================================================= */

  let storedUser = null;

  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
  } catch {
    storedUser = null;
  }

  const user = authUser || storedUser;

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.firstName ||
    "Citizen";

  const userInitial = userName.charAt(0).toUpperCase();

  /* =========================================================
     NEW ALERT STATE
  ========================================================= */

  const [newAlert, setNewAlert] = useState(null);

  const previousAlertIds = useRef(null);

  /* =========================================================
     INITIAL ALERT FETCH
  ========================================================= */

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  /* =========================================================
     CHECK FOR NEW ALERTS
  ========================================================= */

  useEffect(() => {
    /*
     * First response ko existing alerts maana jayega.
     * Isse page load hote hi old alerts ke popup nahi aayenge.
     */

    if (previousAlertIds.current === null) {
      previousAlertIds.current = new Set(
        alerts.map((alert) => alert._id || alert.id),
      );

      return;
    }

    const previousIds = previousAlertIds.current;

    const newlyAddedAlerts = alerts.filter((alert) => {
      const id = alert._id || alert.id;

      return id && !previousIds.has(id);
    });

    if (newlyAddedAlerts.length > 0) {
      /*
       * Latest new alert ko popup karo.
       */

      const latestAlert = newlyAddedAlerts[newlyAddedAlerts.length - 1];

      setNewAlert(latestAlert);
    }

    /*
     * Current IDs save karo.
     */

    previousAlertIds.current = new Set(
      alerts.map((alert) => alert._id || alert.id).filter(Boolean),
    );
  }, [alerts]);

  /* =========================================================
     AUTO CLOSE POPUP
  ========================================================= */

  useEffect(() => {
    if (!newAlert) return;

    const timer = setTimeout(() => {
      setNewAlert(null);
    }, 7000);

    return () => clearTimeout(timer);
  }, [newAlert]);

  /* =========================================================
     POLLING
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAlerts());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/citizen/login", { replace: true });
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          h-[68px]
          border-b
          transition-colors
          duration-300

          ${
            darkMode
              ? "bg-[#0b1c15] border-white/10 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }
        `}
      >
        <div className="h-full flex items-center justify-between px-4 md:px-6">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="flex items-center gap-3">
            {/* MENU */}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`
                p-2
                rounded-lg
                transition
                ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}
              `}
              title="Menu"
            >
              <Menu size={21} />
            </button>

            {/* LOGO */}

            <div className="flex items-center gap-2">
              <div className="text-green-600">
                <Map size={30} strokeWidth={2.5} />
              </div>

              <div className="leading-tight">
                <h1 className="font-bold text-sm md:text-base">
                  Landslide Risk
                </h1>

                <p
                  className={`
                    text-[10px]
                    ${darkMode ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  Monitoring System
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="flex items-center gap-2 md:gap-3">
            {/* EMERGENCY */}

            <button
              onClick={() => navigate("/citizen/emergency")}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-red-500
                px-3
                py-2
                text-xs
                md:text-sm
                font-bold
                text-white
                transition
                hover:bg-red-600
                shadow-sm
              "
              title="Emergency Numbers"
            >
              <PhoneCall size={17} />

              <span className="hidden sm:block">Emergency</span>
            </button>

            {/* =================================================
                ALERT BELL
            ================================================= */}

            <button
              onClick={() => navigate("/citizen/alerts")}
              className={`
                relative
                w-10
                h-10
                rounded-lg
                flex
                items-center
                justify-center
                transition

                ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
              title="Alerts"
            >
              <Bell
                size={19}
                className={darkMode ? "text-gray-200" : "text-gray-700"}
              />

              {/* BADGE */}

              {alerts.length > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    min-w-[18px]
                    h-[18px]
                    px-1
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                    dark:border-[#0b1c15]
                  "
                >
                  {alerts.length > 99 ? "99+" : alerts.length}
                </span>
              )}
            </button>

            {/* =================================================
                DARK MODE
            ================================================= */}

            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`
                relative
                w-10
                h-10
                rounded-lg
                flex
                items-center
                justify-center
                transition

                ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
              title="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </button>

            {/* =================================================
                USER NAME
            ================================================= */}

            <span
              className="
                hidden
                sm:block
                max-w-[120px]
                truncate
                text-sm
                font-medium
              "
              title={userName}
            >
              {userName}
            </span>

            {/* AVATAR */}

            <button
              onClick={() => navigate("/citizen/profile")}
              className="
                w-9
                h-9
                rounded-full
                bg-green-600
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-sm
                transition
                hover:bg-green-700
                shrink-0
              "
              title="Profile"
            >
              {userInitial}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          NEW ALERT TOAST
      ===================================================== */}

      {newAlert && (
        <NewAlertToast
          alert={newAlert}
          darkMode={darkMode}
          onClose={() => setNewAlert(null)}
          onView={() => {
            setNewAlert(null);
            navigate("/citizen/alerts");
          }}
        />
      )}
    </>
  );
};

/* =========================================================
   NEW ALERT TOAST
========================================================= */

const NewAlertToast = ({ alert, darkMode, onClose, onView }) => {
  const title = alert.title || alert.heading || "New Safety Alert";

  const description =
    alert.description ||
    alert.message ||
    alert.reason ||
    "A new safety alert has been issued.";

  const level =
    alert.level || alert.riskLevel || alert.severity || alert.priority || "Low";

  const location =
    typeof alert.location === "object"
      ? alert.location?.name || alert.location?.address || "Your area"
      : alert.location || "Your area";

  const styles = getNotificationStyle(level);

  return (
    <div
      className="
        fixed
        right-4
        top-[82px]
        z-[100]
        w-[calc(100%-2rem)]
        max-w-[390px]
        animate-[slideIn_0.35s_ease-out]
      "
    >
      <div
        className={`
          relative
          overflow-hidden
          rounded-2xl
          border
          shadow-2xl
          backdrop-blur-xl

          ${
            darkMode
              ? "border-slate-700 bg-slate-900/95"
              : "border-slate-200 bg-white/95"
          }
        `}
      >
        {/* TOP ACCENT */}

        <div className={`absolute left-0 right-0 top-0 h-1 ${styles.accent}`} />

        <div className="p-4">
          {/* HEADER */}

          <div className="flex items-start gap-3">
            <div
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${styles.iconBg}
                ${styles.iconColor}
              `}
            >
              <AlertTriangle size={22} />
            </div>

            <div className="min-w-0 flex-1 pr-5">
              <div className="flex items-center gap-2">
                <p
                  className={`
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    ${styles.text}
                  `}
                >
                  New Alert
                </p>

                <span
                  className={`
                    rounded-full
                    px-2
                    py-0.5
                    text-[9px]
                    font-bold
                    uppercase
                    ${styles.badge}
                  `}
                >
                  {level}
                </span>
              </div>

              <h3 className="mt-1 truncate text-sm font-bold">{title}</h3>
            </div>

            {/* CLOSE */}

            <button
              onClick={onClose}
              className={`
                absolute
                right-3
                top-3
                rounded-lg
                p-1.5
                transition

                ${
                  darkMode
                    ? "text-slate-500 hover:bg-slate-800 hover:text-white"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                }
              `}
            >
              <X size={16} />
            </button>
          </div>

          {/* DESCRIPTION */}

          <p
            className={`
              mt-3
              line-clamp-2
              text-xs
              leading-5

              ${darkMode ? "text-slate-400" : "text-slate-600"}
            `}
          >
            {description}
          </p>

          {/* LOCATION */}

          <div
            className={`
              mt-3
              flex
              items-center
              gap-1.5
              text-xs

              ${darkMode ? "text-slate-500" : "text-slate-400"}
            `}
          >
            <MapPin size={13} />

            <span className="truncate">{location}</span>
          </div>

          {/* ACTIONS */}

          <div className="mt-4 flex items-center justify-between gap-3">
            <span
              className={`
                text-[10px]
                ${darkMode ? "text-slate-600" : "text-slate-400"}
              `}
            >
              New safety notification
            </span>

            <button
              onClick={onView}
              className="
                rounded-lg
                bg-green-600
                px-3
                py-2
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-green-700
              "
            >
              View Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   NOTIFICATION STYLES
========================================================= */

const getNotificationStyle = (level) => {
  const value = String(level).toLowerCase();

  if (value === "high" || value === "critical") {
    return {
      accent: "bg-red-500",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      text: "text-red-500",
      badge: "bg-red-500/10 text-red-500",
    };
  }

  if (value === "medium") {
    return {
      accent: "bg-orange-500",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      text: "text-orange-500",
      badge: "bg-orange-500/10 text-orange-500",
    };
  }

  return {
    accent: "bg-green-500",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    text: "text-green-500",
    badge: "bg-green-500/10 text-green-500",
  };
};

export default CitizenNavbar;
