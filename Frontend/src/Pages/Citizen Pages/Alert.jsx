import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import { fetchAlerts } from "../../Redux/Citizen Slices/alertSlice.js";

const Alerts = () => {
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  const {
    alerts = [],
    loading,
    error,
  } = useSelector((state) => state.alerts || {});

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);

  /* ==========================================
     DARK MODE
  ========================================== */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /* ==========================================
     FETCH ALERTS
  ========================================== */

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  /* ==========================================
     FILTER ALERTS
  ========================================== */

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const title = alert.title || alert.heading || "";

      const description =
        alert.description || alert.message || alert.reason || "";

      const location = alert.location?.name || alert.location || "";

      const text = `${title} ${description} ${location}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const level =
        alert.level ||
        alert.riskLevel ||
        alert.severity ||
        alert.priority ||
        "";

      const matchesFilter =
        filter === "All" ||
        level.toString().toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [alerts, search, filter]);

  /* ==========================================
     COUNTS
  ========================================== */

  const highCount = alerts.filter((alert) => {
    const level =
      alert.level || alert.riskLevel || alert.severity || alert.priority || "";

    return level.toLowerCase() === "high";
  }).length;

  const mediumCount = alerts.filter((alert) => {
    const level =
      alert.level || alert.riskLevel || alert.severity || alert.priority || "";

    return level.toLowerCase() === "medium";
  }).length;

  const lowCount = alerts.filter((alert) => {
    const level =
      alert.level || alert.riskLevel || alert.severity || alert.priority || "";

    return level.toLowerCase() === "low";
  }).length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* ==========================================
          NAVBAR
      ========================================== */}

      <CitizenNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="pt-[68px] md:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* ======================================
              HEADER
          ====================================== */}

          <section
            className={`mb-5 rounded-2xl border p-5 shadow-xl sm:p-6 ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      darkMode ? "bg-red-500/10" : "bg-red-100"
                    }`}
                  >
                    <Bell className="text-red-500" size={23} />
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Alerts</h1>

                    <p
                      className={`mt-1 text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Stay updated about risks and safety conditions in your
                      area.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => dispatch(fetchAlerts())}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </section>

          {/* ======================================
              SUMMARY
          ====================================== */}

          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<ShieldAlert />}
              title="High Risk"
              value={highCount}
              iconBg={darkMode ? "bg-red-500/10" : "bg-red-100"}
              iconColor="text-red-500"
              darkMode={darkMode}
            />

            <SummaryCard
              icon={<AlertTriangle />}
              title="Medium Risk"
              value={mediumCount}
              iconBg={darkMode ? "bg-orange-500/10" : "bg-orange-100"}
              iconColor="text-orange-500"
              darkMode={darkMode}
            />

            <SummaryCard
              icon={<Bell />}
              title="Low Risk"
              value={lowCount}
              iconBg={darkMode ? "bg-green-500/10" : "bg-green-100"}
              iconColor="text-green-500"
              darkMode={darkMode}
            />
          </div>

          {/* ======================================
              SEARCH + FILTER
          ====================================== */}

          <section
            className={`mb-5 rounded-2xl border p-4 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-3 md:flex-row">
              {/* SEARCH */}

              <div className="relative flex-1">
                <Search
                  size={18}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search alerts..."
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition ${
                    darkMode
                      ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600 focus:border-green-500"
                      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-green-500"
                  }`}
                />
              </div>

              {/* FILTER */}

              <div className="flex gap-2 overflow-x-auto">
                {["All", "High", "Medium", "Low"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                      filter === item
                        ? "bg-green-600 text-white"
                        : darkMode
                          ? "bg-[#07140f] text-slate-400 hover:bg-[#143326]"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ======================================
              ERROR
          ====================================== */}

          {error && (
            <div
              className={`mb-5 flex items-center justify-between rounded-xl border p-4 ${
                darkMode
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-500" />

                <div>
                  <p className="text-sm font-semibold text-red-500">
                    Unable to load alerts
                  </p>

                  <p
                    className={`text-xs ${
                      darkMode ? "text-red-300" : "text-red-600"
                    }`}
                  >
                    {error}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(fetchAlerts())}
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* ======================================
              LOADING
          ====================================== */}

          {loading && (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`animate-pulse rounded-2xl border p-5 ${
                    darkMode
                      ? "border-white/10 bg-[#0f241b]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div
                    className={`h-5 w-1/3 rounded ${
                      darkMode ? "bg-white/[0.06]" : "bg-slate-200"
                    }`}
                  />

                  <div
                    className={`mt-3 h-3 w-3/4 rounded ${
                      darkMode ? "bg-white/[0.06]" : "bg-slate-200"
                    }`}
                  />

                  <div
                    className={`mt-2 h-3 w-1/2 rounded ${
                      darkMode ? "bg-white/[0.06]" : "bg-slate-200"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ======================================
              ALERT LIST
          ====================================== */}

          {!loading && filteredAlerts.length > 0 && (
            <div className="grid gap-4">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert._id || alert.id}
                  alert={alert}
                  darkMode={darkMode}
                  onClick={() => setSelectedAlert(alert)}
                />
              ))}
            </div>
          )}

          {/* ======================================
              EMPTY STATE
          ====================================== */}

          {!loading && filteredAlerts.length === 0 && !error && (
            <div
              className={`rounded-2xl border p-10 text-center shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                  darkMode ? "bg-white/[0.05]" : "bg-slate-100"
                }`}
              >
                <Bell
                  size={25}
                  className={darkMode ? "text-slate-500" : "text-slate-400"}
                />
              </div>

              <h3 className="mt-4 text-lg font-bold">No alerts found</h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {search
                  ? "Try changing your search or filter."
                  : "There are currently no alerts for your area."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer
        className={`mt-8 border-t py-5 text-center text-xs ${
          darkMode
            ? "border-white/10 bg-[#0b1c15] text-slate-500"
            : "border-slate-200 bg-white text-slate-500"
        }`}
      >
        © 2026 Landslide Risk Monitoring System. All rights reserved.
      </footer>

      {/* ==========================================
          ALERT MODAL
      ========================================== */}

      {selectedAlert && (
        <AlertModal
          alert={selectedAlert}
          darkMode={darkMode}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({ icon, title, value, iconBg, iconColor, darkMode }) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-xl transition-colors duration-300 ${
        darkMode
          ? "border-white/10 bg-[#0f241b] hover:border-green-500/20"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {React.cloneElement(icon, {
            size: 23,
          })}
        </div>

        <div>
          <p className="text-xl font-bold">{value}</p>

          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ALERT CARD
========================================================= */

const AlertCard = ({ alert, darkMode, onClick }) => {
  const title = alert.title || alert.heading || "Safety Alert";

  const description =
    alert.description ||
    alert.message ||
    alert.reason ||
    "Please stay alert and follow local safety instructions.";

  const level =
    alert.level || alert.riskLevel || alert.severity || alert.priority || "Low";

  const location =
    typeof alert.location === "object"
      ? alert.location?.name || alert.location?.address || "Your area"
      : alert.location || "Your area";

  const date = alert.createdAt || alert.date || alert.timestamp;

  const styles = getAlertStyle(level);

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-5 text-left shadow-xl transition duration-200 hover:-translate-y-[1px] ${
        darkMode
          ? "border-white/10 bg-[#0f241b] hover:border-green-500/30 hover:bg-[#143326]"
          : "border-slate-200 bg-white hover:shadow-2xl"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* ICON */}

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor}`}
        >
          <AlertTriangle size={23} />
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold sm:text-lg">{title}</h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles.badge}`}
            >
              {level}
            </span>
          </div>

          <p
            className={`mt-2 text-sm leading-6 ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <div
              className={`flex items-center gap-1.5 text-xs ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <MapPin size={14} />
              <span>{location}</span>
            </div>

            {date && (
              <div
                className={`flex items-center gap-1.5 text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <Clock3 size={14} />
                <span>{formatDate(date)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

/* =========================================================
   ALERT MODAL
========================================================= */

const AlertModal = ({ alert, darkMode, onClose }) => {
  const title = alert.title || alert.heading || "Safety Alert";

  const description =
    alert.description ||
    alert.message ||
    alert.reason ||
    "Please stay alert and follow local safety instructions.";

  const level =
    alert.level || alert.riskLevel || alert.severity || alert.priority || "Low";

  const location =
    typeof alert.location === "object"
      ? alert.location?.name || alert.location?.address || "Your area"
      : alert.location || "Your area";

  const date = alert.createdAt || alert.date || alert.timestamp;

  const styles = getAlertStyle(level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
          darkMode
            ? "border-white/10 bg-[#0f241b]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* CLOSE */}

        <button
          onClick={onClose}
          className={`absolute right-4 top-4 rounded-lg p-2 transition ${
            darkMode
              ? "text-slate-400 hover:bg-[#143326] hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <X size={19} />
        </button>

        {/* HEADER */}

        <div className="flex items-center gap-3 pr-8">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor}`}
          >
            <AlertTriangle size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold">{title}</h2>

            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles.badge}`}
            >
              {level}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div
          className={`mt-6 rounded-xl p-4 ${
            darkMode ? "bg-[#07140f] border border-white/5" : "bg-slate-50"
          }`}
        >
          <p
            className={`text-sm leading-6 ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        </div>

        {/* DETAILS */}

        <div className="mt-5 space-y-4">
          <DetailRow
            icon={<MapPin size={18} />}
            label="Location"
            value={location}
            darkMode={darkMode}
          />

          {date && (
            <DetailRow
              icon={<Calendar size={18} />}
              label="Reported"
              value={formatDate(date)}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* CLOSE BUTTON */}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   DETAIL ROW
========================================================= */

const DetailRow = ({ icon, label, value, darkMode }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          darkMode
            ? "bg-white/[0.05] text-slate-400"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <div>
        <p
          className={`text-xs ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {label}
        </p>

        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};

/* =========================================================
   ALERT STYLE
========================================================= */

const getAlertStyle = (level) => {
  const value = String(level).toLowerCase();

  if (value === "high" || value === "critical") {
    return {
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      badge: "bg-red-500/10 text-red-500",
    };
  }

  if (value === "medium") {
    return {
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      badge: "bg-orange-500/10 text-orange-500",
    };
  }

  return {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    badge: "bg-green-500/10 text-green-500",
  };
};

/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
};

export default Alerts;
