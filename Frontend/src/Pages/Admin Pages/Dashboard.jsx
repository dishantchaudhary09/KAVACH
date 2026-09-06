
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Activity,
  ShieldCheck,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  RefreshCw,
  Clock,
  FileWarning,
  MapPinned,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  Eye,
  ChevronRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

import { fetchDashboardData } from "../../Redux/Citizen Slices/dashboardSlice.js";
import { fetchAlerts } from "../../Redux/Citizen Slices/alertSlice.js";
import { fetchReports } from "../../Redux/Citizen Slices/reportSlice.js";
import { fetchRiskZones } from "../../Redux/Citizen Slices/riskSlice.js";
import { fetchWeather } from "../../Redux/Citizen Slices/weatherSlice.js";

const NER_WEATHER_LOCATION = {
  latitude: 25.5,
  longitude: 93.5,
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const darkMode = useSelector(
    (state) => state.theme?.darkMode || false
  );

  const dashboardState = useSelector(
    (state) => state.dashboard || {}
  );

  const alertState = useSelector(
    (state) => state.alert || {}
  );

  const reportState = useSelector(
    (state) => state.report || {}
  );

  const riskState = useSelector(
    (state) => state.risk || {}
  );

  const weatherState = useSelector(
    (state) => state.weather || {}
  );

  const {
    data: dashboardData = null,
    loading: dashboardLoading = false,
    error: dashboardError = null,
  } = dashboardState;

  const {
    alerts = [],
    loading: alertsLoading = false,
    error: alertsError = null,
  } = alertState;

  const {
    reports = [],
    loading: reportsLoading = false,
    error: reportsError = null,
  } = reportState;

  const {
    riskZones = [],
    loading: riskLoading = false,
    error: riskError = null,
  } = riskState;

  const {
    weather = null,
    loading: weatherLoading = false,
    error: weatherError = null,
    lastUpdated: weatherLastUpdated = null,
  } = weatherState;

  const loadDashboardData = useCallback(async () => {
    setRefreshing(true);

    try {
      await Promise.allSettled([
        dispatch(fetchDashboardData()),
        dispatch(fetchAlerts()),
        dispatch(fetchReports()),
        dispatch(fetchRiskZones()),

        // Fixed weather request
        dispatch(
          fetchWeather({
            latitude: NER_WEATHER_LOCATION.latitude,
            longitude: NER_WEATHER_LOCATION.longitude,
          })
        ),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // --------------------------------------------------
  // Risk statistics
  // --------------------------------------------------

  const riskStats = useMemo(() => {
    const zones = Array.isArray(riskZones)
      ? riskZones
      : [];

    const high = zones.filter(
      (zone) =>
        String(zone?.riskLevel || "")
          .toLowerCase()
          .trim() === "high"
    ).length;

    const medium = zones.filter(
      (zone) =>
        String(zone?.riskLevel || "")
          .toLowerCase()
          .trim() === "medium"
    ).length;

    const low = zones.filter(
      (zone) =>
        String(zone?.riskLevel || "")
          .toLowerCase()
          .trim() === "low"
    ).length;

    return {
      high,
      medium,
      low,
      total: high + medium + low,
    };
  }, [riskZones]);

  // --------------------------------------------------
  // Active alerts
  // --------------------------------------------------

  const activeAlerts = useMemo(() => {
    if (!Array.isArray(alerts)) return [];

    return alerts.filter((alert) => {
      const status = String(
        alert?.status || ""
      )
        .toLowerCase()
        .trim();

      return (
        status === "" ||
        status === "active" ||
        status === "pending"
      );
    });
  }, [alerts]);

  // --------------------------------------------------
  // Pending reports
  // --------------------------------------------------

  const pendingReports = useMemo(() => {
    if (!Array.isArray(reports)) return [];

    return reports.filter((report) => {
      const status = String(
        report?.status || ""
      )
        .toLowerCase()
        .trim();

      return (
        status === "pending" ||
        status === "reported" ||
        status === "under review" ||
        status === "under_review"
      );
    });
  }, [reports]);

  // --------------------------------------------------
  // Weather
  // --------------------------------------------------

  const weatherData = weather || {};

  const temperature =
    weatherData?.temperature ??
    weatherData?.temp ??
    "--";

  const rainfall =
    weatherData?.rainfall ??
    weatherData?.rain ??
    weatherData?.precipitation ??
    "--";

  const humidity =
    weatherData?.humidity ??
    "--";

  const windSpeed =
    weatherData?.windSpeed ??
    weatherData?.wind_speed ??
    "--";

  const weatherCondition =
    weatherData?.condition ||
    weatherData?.description ||
    "Unavailable";

  const weatherLocation =
    weatherData?.location ||
    "NER Region";

  const weatherSource =
    weatherData?.source || "unknown";

  // --------------------------------------------------
  // System status
  // --------------------------------------------------

  const systemStatus = {
    dashboard: !dashboardError,
    weather: !weatherError,
    alerts: !alertsError,
    reports: !reportsError,
    risk: !riskError,
  };

  const systemServices = [
    {
      name: "Weather Service",
      status: systemStatus.weather,
      icon: <CloudRain size={18} />,
      error: weatherError,
    },
    {
      name: "Risk Monitoring",
      status: systemStatus.risk,
      icon: <Activity size={18} />,
      error: riskError,
    },
    {
      name: "Alert Service",
      status: systemStatus.alerts,
      icon: <AlertTriangle size={18} />,
      error: alertsError,
    },
    {
      name: "Report Service",
      status: systemStatus.reports,
      icon: <FileWarning size={18} />,
      error: reportsError,
    },
  ];

  // --------------------------------------------------
  // Last updated
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  const pageLoading =
    dashboardLoading ||
    alertsLoading ||
    reportsLoading ||
    riskLoading;

  // --------------------------------------------------
  // Risk percentage
  // --------------------------------------------------

  const getRiskPercentage = (value) => {
    if (!riskStats.total) return 0;

    return Math.min(
      100,
      Math.max(
        0,
        (value / riskStats.total) * 100
      )
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#07140f] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Navbar */}

      <AdminNavbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Sidebar */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}

      <main className="pt-[68px] lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className={`text-2xl font-bold sm:text-3xl ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                Admin Dashboard
              </h1>

              <p
                className={`mt-1 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Monitor landslide risks, alerts, weather
                and citizen reports across the NER region.
              </p>
            </div>

            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                darkMode
                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              } ${
                refreshing
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {/* Summary Cards */}

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Monitored Zones"
              value={
                dashboardData?.monitoredZones ??
                dashboardData?.totalZones ??
                riskStats.total
              }
              icon={<MapPinned />}
              color="blue"
              darkMode={darkMode}
            />

            <StatCard
              title="High Risk Zones"
              value={riskStats.high}
              icon={<AlertTriangle />}
              color="red"
              darkMode={darkMode}
            />

            <StatCard
              title="Pending Reports"
              value={pendingReports.length}
              icon={<FileWarning />}
              color="orange"
              darkMode={darkMode}
            />

            <StatCard
              title="Active Alerts"
              value={activeAlerts.length}
              icon={<CloudRain />}
              color="purple"
              darkMode={darkMode}
            />
          </div>

          {/* Regional Risk Overview */}

          <section
            className={`mb-6 rounded-2xl border p-5 shadow-sm ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Regional Risk Overview
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Current distribution of monitored
                  risk zones.
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/risk-map")}
                className={`hidden items-center gap-1 text-sm font-semibold sm:flex ${
                  darkMode
                    ? "text-emerald-400"
                    : "text-emerald-600"
                }`}
              >
                View Map
                <ChevronRight size={16} />
              </button>
            </div>

            {/* High → Low → Medium as requested */}

            <div className="grid gap-4 sm:grid-cols-3">
              <RiskBox
                title="High Risk"
                value={riskStats.high}
                icon={<AlertTriangle />}
                color="red"
                darkMode={darkMode}
              />

              <RiskBox
                title="Low Risk"
                value={riskStats.low}
                icon={<ShieldCheck />}
                color="orange"
                darkMode={darkMode}
              />

              <RiskBox
                title="Medium Risk"
                value={riskStats.medium}
                icon={<Activity />}
                color="green"
                darkMode={darkMode}
              />
            </div>

            {/* Risk Distribution Bar */}

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs">
                <span
                  className={
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }
                >
                  Risk Distribution
                </span>

                <span
                  className={
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }
                >
                  {riskStats.total} zones
                </span>
              </div>

              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                {/* High */}

                <div
                  className="bg-red-500 transition-all duration-500"
                  style={{
                    width: `${getRiskPercentage(
                      riskStats.high
                    )}%`,
                  }}
                />

                {/* Low — swapped */}

                <div
                  className="bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${getRiskPercentage(
                      riskStats.low
                    )}%`,
                  }}
                />

                {/* Medium — swapped */}

                <div
                  className="bg-green-500 transition-all duration-500"
                  style={{
                    width: `${getRiskPercentage(
                      riskStats.medium
                    )}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Weather Conditions */}

          <section
            className={`mb-6 rounded-2xl border p-5 shadow-sm ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Weather Conditions
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Current environmental conditions
                </p>
              </div>

              <div
                className={`flex items-center gap-2 text-xs ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    weatherError
                      ? "bg-red-500"
                      : weatherLoading
                        ? "animate-pulse bg-yellow-500"
                        : "bg-emerald-500"
                  }`}
                />

                {weatherLoading
                  ? "Updating..."
                  : weatherError
                    ? "Unavailable"
                    : weatherSource === "fallback"
                      ? "Fallback Data"
                      : "Live Data"}
              </div>
            </div>

            {weatherError && (
              <div
                className={`mb-4 rounded-xl border p-3 text-sm ${
                  darkMode
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                Weather data could not be fetched.
                Showing fallback data if available.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <WeatherItem
                icon={<Thermometer />}
                title="Temperature"
                value={
                  temperature === "--"
                    ? "--"
                    : `${temperature}°C`
                }
                darkMode={darkMode}
              />

              <WeatherItem
                icon={<CloudRain />}
                title="Rainfall"
                value={
                  rainfall === "--"
                    ? "--"
                    : `${rainfall} mm`
                }
                darkMode={darkMode}
              />

              <WeatherItem
                icon={<Droplets />}
                title="Humidity"
                value={
                  humidity === "--"
                    ? "--"
                    : `${humidity}%`
                }
                darkMode={darkMode}
              />

              <WeatherItem
                icon={<Wind />}
                title="Wind Speed"
                value={
                  windSpeed === "--"
                    ? "--"
                    : `${windSpeed} km/h`
                }
                darkMode={darkMode}
              />
            </div>

            <div
              className={`mt-4 flex flex-col gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between ${
                darkMode
                  ? "border-white/10 text-slate-400"
                  : "border-slate-100 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPinned size={14} />
                <span>{weatherLocation}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>
                  Last Updated:{" "}
                  {formatDate(
                    weatherLastUpdated
                  )}
                </span>
              </div>
            </div>

            {weatherCondition !== "Unavailable" && (
              <div
                className={`mt-2 text-xs ${
                  darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Condition: {weatherCondition}
              </div>
            )}
          </section>

          {/* Alerts + Reports */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Recent Alerts */}

            <section
              className={`rounded-2xl border p-5 shadow-sm ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Recent Alerts
                  </h2>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Latest warnings issued by the
                    system.
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/admin/alerts")
                  }
                  className={`text-sm font-semibold ${
                    darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                  }`}
                >
                  View All
                </button>
              </div>

              {alertsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`h-20 animate-pulse rounded-xl ${
                        darkMode
                          ? "bg-white/5"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              ) : activeAlerts.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 />}
                  title="No active alerts"
                  message="There are currently no active alerts."
                  darkMode={darkMode}
                />
              ) : (
                <div className="space-y-3">
                  {activeAlerts
                    .slice(0, 5)
                    .map((alert, index) => (
                      <AlertItem
                        key={
                          alert?._id ||
                          alert?.id ||
                          index
                        }
                        alert={alert}
                        darkMode={darkMode}
                      />
                    ))}
                </div>
              )}
            </section>

            {/* Pending Reports */}

            <section
              className={`rounded-2xl border p-5 shadow-sm ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Reports Pending Review
                  </h2>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Citizen reports awaiting admin
                    action.
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/admin/reports")
                  }
                  className={`text-sm font-semibold ${
                    darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                  }`}
                >
                  View All
                </button>
              </div>

              {reportsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`h-20 animate-pulse rounded-xl ${
                        darkMode
                          ? "bg-white/5"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              ) : pendingReports.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 />}
                  title="No pending reports"
                  message="All citizen reports have been reviewed."
                  darkMode={darkMode}
                />
              ) : (
                <div className="space-y-3">
                  {pendingReports
                    .slice(0, 5)
                    .map((report, index) => (
                      <ReportItem
                        key={
                          report?._id ||
                          report?.id ||
                          index
                        }
                        report={report}
                        darkMode={darkMode}
                      />
                    ))}
                </div>
              )}
            </section>
          </div>

          {/* System Monitoring */}

          <section
            className={`mt-6 rounded-2xl border p-5 shadow-sm ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold">
                System Monitoring
              </h2>

              <p
                className={`mt-1 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Current health of major system
                services.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {systemServices.map((service) => (
                <div
                  key={service.name}
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        service.status
                          ? darkMode
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600"
                          : darkMode
                            ? "bg-red-500/10 text-red-400"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {service.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {service.name}
                      </p>

                      <p
                        className={`text-xs ${
                          darkMode
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {service.status
                          ? "Operational"
                          : "Unavailable"}
                      </p>
                    </div>
                  </div>

                  {service.status ? (
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-500"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      className="shrink-0 text-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Page Loading Indicator */}

          {pageLoading && !refreshing && (
            <div
              className={`mt-6 flex items-center justify-center gap-2 text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              <RefreshCw
                size={15}
                className="animate-spin"
              />
              Updating dashboard data...
            </div>
          )}

          {/* Footer */}

          <div
            className={`py-8 text-center text-xs ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Landslide Risk Monitoring & Early Warning
            System — NER
          </div>
        </div>
      </main>
    </div>
  );
};

// =====================================================
// Stat Card
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
  color,
  darkMode,
}) => {
  const colors = {
    blue: darkMode
      ? "bg-blue-500/10 text-blue-400"
      : "bg-blue-50 text-blue-600",

    red: darkMode
      ? "bg-red-500/10 text-red-400"
      : "bg-red-50 text-red-600",

    orange: darkMode
      ? "bg-orange-500/10 text-orange-400"
      : "bg-orange-50 text-orange-600",

    purple: darkMode
      ? "bg-purple-500/10 text-purple-400"
      : "bg-purple-50 text-purple-600",
  };

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition ${
        darkMode
          ? "border-white/10 bg-[#0c2119]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value ?? 0}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            colors[color]
          }`}
        >
          {React.cloneElement(icon, {
            size: 22,
          })}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Risk Box
// =====================================================

const RiskBox = ({
  title,
  value,
  icon,
  color,
  darkMode,
}) => {
  const colors = {
    red: darkMode
      ? "bg-red-500/10 text-red-400"
      : "bg-red-50 text-red-600",

    orange: darkMode
      ? "bg-orange-500/10 text-orange-400"
      : "bg-orange-50 text-orange-600",

    green: darkMode
      ? "bg-green-500/10 text-green-400"
      : "bg-green-50 text-green-600",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors[color]}`}
        >
          {React.cloneElement(icon, {
            size: 20,
          })}
        </div>

        <div>
          <p
            className={`text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <p className="text-2xl font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Weather Item
// =====================================================

const WeatherItem = ({
  icon,
  title,
  value,
  darkMode,
}) => {
  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
          darkMode
            ? "bg-sky-500/10 text-sky-400"
            : "bg-sky-50 text-sky-600"
        }`}
      >
        {React.cloneElement(icon, {
          size: 20,
        })}
      </div>

      <p
        className={`text-xs ${
          darkMode
            ? "text-slate-400"
            : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <p className="mt-1 text-xl font-bold">
        {value}
      </p>
    </div>
  );
};

// =====================================================
// Alert Item
// =====================================================

const AlertItem = ({
  alert,
  darkMode,
}) => {
  const severity = String(
    alert?.severity ||
      alert?.level ||
      alert?.riskLevel ||
      "medium"
  )
    .toLowerCase()
    .trim();

  const title =
    alert?.title ||
    alert?.heading ||
    "Alert";

  const message =
    alert?.message ||
    alert?.description ||
    alert?.reason ||
    "No message available.";

  const location =
    typeof alert?.location === "string"
      ? alert.location
      : alert?.location?.name ||
        alert?.location?.address ||
        "NER Region";

  const severityStyles = {
    critical:
      "border-red-500/30 bg-red-500/10 text-red-500",

    high:
      "border-red-500/30 bg-red-500/10 text-red-500",

    medium:
      "border-orange-500/30 bg-orange-500/10 text-orange-500",

    low:
      "border-green-500/30 bg-green-500/10 text-green-500",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
            severityStyles[severity] ||
            severityStyles.medium
          }`}
        >
          <AlertTriangle size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-semibold">
              {title}
            </h3>

            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                severityStyles[severity] ||
                severityStyles.medium
              }`}
            >
              {severity}
            </span>
          </div>

          <p
            className={`mt-1 line-clamp-2 text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {message}
          </p>

          <div
            className={`mt-2 flex items-center gap-1 text-xs ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            <MapPinned size={13} />
            {location}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Report Item
// =====================================================

const ReportItem = ({
  report,
  darkMode,
}) => {
  const title =
    report?.title ||
    report?.heading ||
    "Citizen Report";

  const description =
    report?.description ||
    report?.message ||
    "No description available.";

  const location =
    typeof report?.location === "string"
      ? report.location
      : report?.location?.name ||
        "Location unavailable";

  const status = String(
    report?.status || "pending"
  )
    .replace(/_/g, " ")
    .trim();

  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            darkMode
              ? "bg-orange-500/10 text-orange-400"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          <FileWarning size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-semibold">
              {title}
            </h3>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                darkMode
                  ? "bg-orange-500/10 text-orange-400"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {status}
            </span>
          </div>

          <p
            className={`mt-1 line-clamp-2 text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {description}
          </p>

          <div
            className={`mt-2 flex items-center gap-1 text-xs ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            <MapPinned size={13} />
            {location}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Empty State
// =====================================================

const EmptyState = ({
  icon,
  title,
  message,
  darkMode,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-5 py-10 text-center ${
        darkMode
          ? "border-white/10 bg-white/[0.02]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
          darkMode
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {React.cloneElement(icon, {
          size: 22,
        })}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p
        className={`mt-1 text-sm ${
          darkMode
            ? "text-slate-500"
            : "text-slate-400"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default AdminDashboard;

