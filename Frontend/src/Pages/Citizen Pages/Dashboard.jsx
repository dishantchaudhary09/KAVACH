import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import { fetchDashboardData } from "../../Redux/Citizen Slices/dashboardSlice";
import { fetchAlerts } from "../../Redux/Citizen Slices/alertSlice";
import { fetchMyReports } from "../../Redux/Citizen Slices/reportSlice";
import { fetchRiskZones } from "../../Redux/Citizen Slices/riskSlice";
import { fetchWeather } from "../../Redux/Citizen Slices/weatherSlice";

import {
  MapPin,
  Sun,
  CloudRain,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Map,
  ChevronRight,
  Bot,
  RefreshCw,
  Loader2,
  CheckCircle2,
  LocateFixed,
} from "lucide-react";

const CitizenDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =====================================================
     REDUX
  ===================================================== */

  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  const user = useSelector((state) => state.auth?.user);

  const dashboardState = useSelector((state) => state.dashboard || {});

  const alertsState = useSelector((state) => state.alerts || {});

  const reportsState = useSelector((state) => state.reports || {});

  const riskState = useSelector((state) => state.risk || {});

  const weatherState = useSelector((state) => state.weather || {});

  const {
    dashboard,
    loading: dashboardLoading,
    error: dashboardError,
  } = dashboardState;

  const {
    alerts = [],
    loading: alertsLoading,
    error: alertsError,
  } = alertsState;

  const { myReports = [], myReportsLoading, myReportsError } = reportsState;

  const { riskZones = [], loading: riskLoading, error: riskError } = riskState;

  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = weatherState;

  /* =====================================================
     LOCAL STATE
  ===================================================== */

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [userCoordinates, setUserCoordinates] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  /* =====================================================
     WEATHER NORMALIZATION
  ===================================================== */

  const weatherData = useMemo(() => {
    if (!weather) {
      return null;
    }

    return (
      weather?.weather || weather?.data?.weather || weather?.data || weather
    );
  }, [weather]);

  /* =====================================================
     DASHBOARD NORMALIZATION
  ===================================================== */

  const dashboardData = useMemo(() => {
    if (!dashboard) {
      return null;
    }

    return (
      dashboard?.dashboard ||
      dashboard?.data?.dashboard ||
      dashboard?.data ||
      dashboard
    );
  }, [dashboard]);

  /* =====================================================
     ALERTS NORMALIZATION
  ===================================================== */

  const alertsData = useMemo(() => {
    if (Array.isArray(alerts)) {
      return alerts;
    }

    if (Array.isArray(alerts?.alerts)) {
      return alerts.alerts;
    }

    if (Array.isArray(alerts?.data)) {
      return alerts.data;
    }

    return [];
  }, [alerts]);

  /* =====================================================
     REPORTS NORMALIZATION
  ===================================================== */

  const reportsData = useMemo(() => {
    if (Array.isArray(myReports)) {
      return myReports;
    }

    if (Array.isArray(myReports?.reports)) {
      return myReports.reports;
    }

    if (Array.isArray(myReports?.data)) {
      return myReports.data;
    }

    return [];
  }, [myReports]);

  /* =====================================================
     RISK ZONES NORMALIZATION
  ===================================================== */

  const riskZonesData = useMemo(() => {
    if (Array.isArray(riskZones)) {
      return riskZones;
    }

    if (Array.isArray(riskZones?.riskZones)) {
      return riskZones.riskZones;
    }

    if (Array.isArray(riskZones?.data)) {
      return riskZones.data;
    }

    return [];
  }, [riskZones]);

  /* =====================================================
     DARK MODE
  ===================================================== */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /* =====================================================
     LOAD DASHBOARD DATA
  ===================================================== */

  useEffect(() => {
    loadDashboard();
  }, [dispatch]);

  const loadDashboard = async () => {
    setRefreshing(true);

    try {
      await Promise.allSettled([
        dispatch(fetchDashboardData()),
        dispatch(fetchAlerts()),
        dispatch(fetchMyReports()),
        dispatch(fetchRiskZones()),
      ]);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /* =====================================================
     GET CURRENT CITIZEN LOCATION
  ===================================================== */

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const message = "Geolocation is not supported by this browser.";

        setLocationLoading(false);
        setLocationError(message);

        reject(new Error(message));
        return;
      }

      setLocationLoading(true);
      setLocationError("");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const coordinates = {
            latitude,
            longitude,
          };

          console.log("📍 Current citizen location:", coordinates);

          setUserCoordinates(coordinates);
          setLocationLoading(false);

          resolve(coordinates);
        },

        (error) => {
          console.error("Location error:", error);

          setLocationLoading(false);

          let message = "Unable to detect your location.";

          if (error.code === error.PERMISSION_DENIED) {
            message =
              "Location permission denied. Please allow location access in your browser.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = "Your location is currently unavailable.";
          } else if (error.code === error.TIMEOUT) {
            message = "Location request timed out. Please try again.";
          }

          setLocationError(message);

          reject(new Error(message));
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        },
      );
    });
  };

  /* =====================================================
     INITIAL LOCATION DETECTION
  ===================================================== */

  useEffect(() => {
    getCurrentLocation().catch((error) => {
      console.error("Initial location detection failed:", error);
    });
  }, []);

  /* =====================================================
     FETCH WEATHER USING LOCATION
  ===================================================== */

  useEffect(() => {
    if (!userCoordinates) {
      return;
    }

    console.log("🌦️ Fetching weather for:", userCoordinates);

    dispatch(
      fetchWeather({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      }),
    );
  }, [dispatch, userCoordinates]);

  /* =====================================================
     ACTIVE ALERTS
  ===================================================== */

  const activeAlerts = useMemo(() => {
    return alertsData.filter((alert) => {
      const status = String(alert?.status || "").toLowerCase();

      return (
        status !== "resolved" && status !== "closed" && status !== "inactive"
      );
    });
  }, [alertsData]);

  /* =====================================================
     CURRENT RISK
  ===================================================== */

  const currentRisk = useMemo(() => {
    if (dashboardData?.risk) {
      return dashboardData.risk;
    }

    if (dashboardData?.currentRisk) {
      return dashboardData.currentRisk;
    }

    if (dashboardData?.riskZone) {
      return dashboardData.riskZone;
    }

    if (riskZonesData.length > 0) {
      return riskZonesData[0];
    }

    return null;
  }, [dashboardData, riskZonesData]);

  const riskLevel = getRiskLevel(currentRisk);

  /* =====================================================
     WEATHER VALUES
  ===================================================== */

  const temperature = getTemperature(weatherData);
  const rainfall = getRainfall(weatherData);
  const humidity = getHumidity(weatherData);
  const windSpeed = getWindSpeed(weatherData);

  /* =====================================================
     AREA NAME
  ===================================================== */

  const areaName =
    weatherData?.locationName ||
    weatherData?.city ||
    weatherData?.location ||
    weatherData?.area ||
    dashboardData?.area ||
    dashboardData?.location ||
    dashboardData?.city ||
    user?.location ||
    "Current Location";

  /* =====================================================
     LAST UPDATED
  ===================================================== */

  const lastUpdated =
    weather?.lastUpdated ||
    weatherData?.updatedAt ||
    weatherData?.lastUpdated ||
    dashboardData?.updatedAt ||
    dashboardData?.lastUpdated;

  const recentAlerts = activeAlerts.slice(0, 3);

  /* =====================================================
     INITIAL LOADING
  ===================================================== */

  const initialLoading =
    dashboardLoading && alertsLoading && myReportsLoading && riskLoading;

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.allSettled([
        dispatch(fetchDashboardData()),
        dispatch(fetchAlerts()),
        dispatch(fetchMyReports()),
        dispatch(fetchRiskZones()),
      ]);

      const coordinates = await getCurrentLocation();

      if (coordinates) {
        await dispatch(
          fetchWeather({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }),
        );
      }
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#07140f] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* =================================================
          NAVBAR
      ================================================= */}

      <CitizenNavbar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="pt-[68px] md:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Citizen Dashboard
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Stay safe, stay informed.
              </h1>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex w-fit items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                darkMode
                  ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              {refreshing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}

              {refreshing ? "Updating..." : "Refresh"}
            </button>
          </div>

          {/* =================================================
              LOCATION ERROR
          ================================================= */}

          {locationError && (
            <div
              className={`mb-5 rounded-xl border p-4 ${
                darkMode
                  ? "border-orange-500/20 bg-orange-500/10"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-orange-500" />

                <div>
                  <p className="text-sm font-semibold text-orange-500">
                    Location Access Required
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {locationError}
                  </p>

                  <button
                    onClick={() => getCurrentLocation().catch(() => {})}
                    className="mt-2 text-xs font-semibold text-orange-500 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              GENERAL ERROR
          ================================================= */}

          {(dashboardError ||
            alertsError ||
            myReportsError ||
            riskError ||
            weatherError) && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl border p-4 ${
                darkMode
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-sm font-semibold text-red-500">
                  Some dashboard data could not be loaded.
                </p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Please check your backend connection and try refreshing the
                  dashboard.
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              WELCOME CARD
          ================================================= */}

          <section
            className={`mb-5 overflow-hidden rounded-2xl border shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex min-h-[150px] items-center justify-between px-5 py-6 sm:px-8">
              <div>
                <p
                  className={`mb-2 text-sm ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  Citizen Dashboard
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Hello,{" "}
                  {user?.name || user?.username || user?.fullName || "Citizen"}{" "}
                  👋
                </h2>

                <p
                  className={`mt-2 text-sm sm:text-base ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Monitor risks, weather conditions and alerts around you.
                </p>
              </div>

              <div className="hidden h-[110px] w-[230px] overflow-hidden rounded-xl sm:block">
                <img
                  src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80"
                  alt="Mountain landscape"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              CURRENT RISK + AREA INFORMATION
          ================================================= */}

          <div className="grid gap-5 lg:grid-cols-[1.8fr_1fr]">
            {/* CURRENT RISK */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Current Area Risk</h3>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Based on latest available risk information
                  </p>
                </div>

                <MapPin size={20} className="text-green-500" />
              </div>

              {riskLoading && !currentRisk ? (
                <LoadingBox darkMode={darkMode} />
              ) : (
                <RiskCard
                  riskLevel={riskLevel}
                  riskScore={
                    currentRisk?.riskScore ??
                    currentRisk?.score ??
                    currentRisk?.probability
                  }
                  reason={
                    currentRisk?.reason ||
                    currentRisk?.description ||
                    "Current conditions are being monitored."
                  }
                  darkMode={darkMode}
                />
              )}
            </section>

            {/* AREA INFORMATION */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="space-y-5">
                <InfoItem
                  icon={<MapPin />}
                  title="Your Area"
                  value={
                    locationLoading ? "Detecting your location..." : areaName
                  }
                  darkMode={darkMode}
                  iconColor="text-green-500"
                />

                <InfoItem
                  icon={<Sun />}
                  title="Temperature"
                  value={weatherLoading ? "Updating..." : temperature}
                  darkMode={darkMode}
                  iconColor="text-orange-500"
                />

                <InfoItem
                  icon={<CloudRain />}
                  title="Rainfall"
                  value={weatherLoading ? "Updating..." : rainfall}
                  darkMode={darkMode}
                  iconColor="text-blue-500"
                />

                <InfoItem
                  icon={<CloudRain />}
                  title="Humidity"
                  value={weatherLoading ? "Updating..." : humidity}
                  darkMode={darkMode}
                  iconColor="text-cyan-500"
                />

                <InfoItem
                  icon={<Sun />}
                  title="Wind Speed"
                  value={weatherLoading ? "Updating..." : windSpeed}
                  darkMode={darkMode}
                  iconColor="text-purple-500"
                />

                {userCoordinates && (
                  <InfoItem
                    icon={<LocateFixed />}
                    title="Coordinates"
                    value={`${userCoordinates.latitude.toFixed(
                      4,
                    )}, ${userCoordinates.longitude.toFixed(4)}`}
                    darkMode={darkMode}
                    iconColor="text-indigo-500"
                  />
                )}

                <InfoItem
                  icon={<Clock3 />}
                  title="Last Updated"
                  value={formatDate(lastUpdated)}
                  darkMode={darkMode}
                  iconColor="text-slate-400"
                />
              </div>
            </section>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <DashboardStat
              icon={<AlertTriangle />}
              iconBg={darkMode ? "bg-red-500/10" : "bg-red-100"}
              iconColor="text-red-500"
              value={alertsLoading ? "..." : activeAlerts.length}
              title="Active Alerts"
              action="View alerts"
              actionColor="text-red-500"
              darkMode={darkMode}
              onClick={() => navigate("/citizen/alerts")}
            />

            <DashboardStat
              icon={<FileText />}
              iconBg={darkMode ? "bg-orange-500/10" : "bg-orange-100"}
              iconColor="text-orange-500"
              value={myReportsLoading ? "..." : reportsData.length}
              title="My Reports"
              action="View reports"
              actionColor="text-orange-500"
              darkMode={darkMode}
              onClick={() => navigate("/citizen/reports")}
            />

            <DashboardStat
              icon={<Map />}
              iconBg={darkMode ? "bg-green-500/10" : "bg-green-100"}
              iconColor="text-green-500"
              value={
                riskLoading
                  ? "..."
                  : riskZonesData.length > 0
                    ? riskZonesData.length
                    : "Updated"
              }
              title="Risk Map"
              action="View map"
              actionColor="text-green-500"
              darkMode={darkMode}
              onClick={() => navigate("/citizen/risk-map")}
            />
          </div>

          {/* =================================================
              LOWER SECTION
          ================================================= */}

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            {/* RECENT ALERTS */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Recent Alerts</h3>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Latest warnings from the monitoring system
                  </p>
                </div>

                <button
                  onClick={() => navigate("/citizen/alerts")}
                  className="text-sm font-semibold text-green-500 hover:underline"
                >
                  View all
                </button>
              </div>

              {alertsLoading ? (
                <LoadingBox darkMode={darkMode} />
              ) : recentAlerts.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 />}
                  title="No active alerts"
                  description="There are currently no active warnings for you."
                  darkMode={darkMode}
                />
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <AlertItem
                      key={alert?._id || alert?.id || index}
                      title={alert?.title || alert?.name || "System Alert"}
                      description={
                        alert?.description ||
                        alert?.message ||
                        "Please check the alert details."
                      }
                      level={
                        alert?.level ||
                        alert?.riskLevel ||
                        alert?.severity ||
                        "Notice"
                      }
                      time={formatDate(alert?.createdAt || alert?.updatedAt)}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* QUICK ACTIONS */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-bold">Quick Actions</h3>

              <p
                className={`mb-4 mt-1 text-xs ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Quickly access important safety features.
              </p>

              <div className="space-y-3">
                <QuickAction
                  icon={<FileText />}
                  iconBg="bg-green-500/10"
                  iconColor="text-green-500"
                  title="Report an Incident"
                  description="Report landslide or hazards"
                  darkMode={darkMode}
                  onClick={() => navigate("/citizen/report")}
                />

                <QuickAction
                  icon={<Map />}
                  iconBg="bg-blue-500/10"
                  iconColor="text-blue-500"
                  title="View Risk Map"
                  description="Check risk zones in your area"
                  darkMode={darkMode}
                  onClick={() => navigate("/citizen/risk-map")}
                />

                <QuickAction
                  icon={<AlertTriangle />}
                  iconBg="bg-purple-500/10"
                  iconColor="text-purple-500"
                  title="View All Alerts"
                  description="See active safety warnings"
                  darkMode={darkMode}
                  onClick={() => navigate("/citizen/alerts")}
                />

                <QuickAction
                  icon={<Bot />}
                  iconBg="bg-cyan-500/10"
                  iconColor="text-cyan-500"
                  title="AI Safety Assistant"
                  description="Ask safety related questions"
                  darkMode={darkMode}
                  onClick={() => navigate("/citizen/assistant")}
                />
              </div>
            </section>
          </div>

          {/* =================================================
              SYSTEM STATUS
          ================================================= */}

          <section
            className={`mt-5 rounded-2xl border p-5 ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold">Monitoring System</h3>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Live services connected to your dashboard
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  label="Risk"
                  active={!riskError}
                  darkMode={darkMode}
                />

                <StatusBadge
                  label="Weather"
                  active={!weatherError && !locationError && !!weatherData}
                  darkMode={darkMode}
                />

                <StatusBadge
                  label="Alerts"
                  active={!alertsError}
                  darkMode={darkMode}
                />

                <StatusBadge
                  label="Reports"
                  active={!myReportsError}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        className={`mt-8 border-t py-5 text-center text-xs ${
          darkMode
            ? "border-white/10 bg-[#07140f] text-slate-500"
            : "border-slate-200 bg-white text-slate-500"
        }`}
      >
        © 2026 Landslide Risk Monitoring System. All rights reserved.
      </footer>
    </div>
  );
};

/* =========================================================
   RISK CARD
========================================================= */

const RiskCard = ({ riskLevel, riskScore, reason, darkMode }) => {
  const config = getRiskConfig(riskLevel);

  return (
    <div className={`rounded-xl border p-5 ${config.container}`}>
      <div className="flex min-h-[150px] items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconBg}`}
            >
              <span className="h-3 w-3 rounded-full bg-white" />
            </div>

            <h4 className={`text-2xl font-bold ${config.text}`}>{riskLevel}</h4>
          </div>

          <p
            className={`mt-4 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {reason}
          </p>

          {riskScore !== undefined && riskScore !== null && (
            <p
              className={`mt-2 text-xs ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Risk score: {formatScore(riskScore)}
            </p>
          )}
        </div>

        <div
          className={`hidden h-16 w-16 items-center justify-center rounded-2xl sm:flex ${config.iconBg}`}
        >
          <ShieldCheck className={`h-10 w-10 ${config.text}`} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({ icon, title, value, darkMode, iconColor }) => {
  return (
    <div className="flex gap-4">
      <div className={iconColor}>
        {React.cloneElement(icon, {
          size: 20,
        })}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>

        <p
          className={`break-words text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   DASHBOARD STAT
========================================================= */

const DashboardStat = ({
  icon,
  iconBg,
  iconColor,
  value,
  title,
  action,
  actionColor,
  darkMode,
  onClick,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-xl transition ${
        darkMode
          ? "border-white/10 bg-[#0c2119] hover:border-green-500/30"
          : "border-slate-200 bg-white hover:shadow-md"
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

      <button
        onClick={onClick}
        className={`mt-4 text-xs font-semibold hover:underline ${actionColor}`}
      >
        {action}
      </button>
    </div>
  );
};

/* =========================================================
   ALERT ITEM
========================================================= */

const AlertItem = ({ title, description, level, time, darkMode }) => {
  const levelConfig = getAlertLevelConfig(level);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition ${
        darkMode
          ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
          : "border-slate-200 bg-white hover:shadow-md"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${levelConfig.iconBg} ${levelConfig.iconColor}`}
      >
        <AlertTriangle size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-bold">{title}</h4>

          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${levelConfig.badge}`}
          >
            {level}
          </span>
        </div>

        <p
          className={`mt-1 text-xs ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>

      <span
        className={`hidden text-[10px] sm:block ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {time}
      </span>
    </div>
  );
};

/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  darkMode,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
        darkMode
          ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
          : "border-slate-200 bg-white hover:shadow-md"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {React.cloneElement(icon, {
          size: 21,
        })}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold">{title}</h4>

        <p
          className={`mt-1 text-xs ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>

      <ChevronRight
        className={`transition group-hover:translate-x-1 ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
        size={18}
      />
    </button>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ label, active, darkMode }) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
        active
          ? darkMode
            ? "bg-green-500/10 text-green-400"
            : "bg-green-50 text-green-600"
          : darkMode
            ? "bg-red-500/10 text-red-400"
            : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-green-500" : "bg-red-500"
        }`}
      />

      {label}
    </div>
  );
};

/* =========================================================
   LOADING BOX
========================================================= */

const LoadingBox = ({ darkMode }) => {
  return (
    <div
      className={`flex min-h-[150px] items-center justify-center rounded-xl border ${
        darkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={18} className="animate-spin" />
        Loading...
      </div>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ icon, title, description, darkMode }) => {
  return (
    <div
      className={`flex min-h-[150px] flex-col items-center justify-center rounded-xl border text-center ${
        darkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-3 text-green-500">
        {React.cloneElement(icon, {
          size: 28,
        })}
      </div>

      <p className="text-sm font-semibold">{title}</p>

      <p
        className={`mt-1 max-w-xs text-xs ${
          darkMode ? "text-slate-500" : "text-slate-500"
        }`}
      >
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   RISK HELPERS
========================================================= */

const getRiskLevel = (risk) => {
  if (!risk) {
    return "LOW RISK";
  }

  const value = String(
    risk?.riskLevel || risk?.level || risk?.risk || "",
  ).toLowerCase();

  if (
    value.includes("high") ||
    value.includes("danger") ||
    value.includes("critical")
  ) {
    return "HIGH RISK";
  }

  if (value.includes("medium") || value.includes("moderate")) {
    return "MEDIUM RISK";
  }

  return "LOW RISK";
};

const getRiskConfig = (level) => {
  if (level === "HIGH RISK") {
    return {
      container: "border-red-500/30 bg-red-500/10",
      text: "text-red-500",
      iconBg: "bg-red-500",
    };
  }

  if (level === "MEDIUM RISK") {
    return {
      container: "border-orange-500/30 bg-orange-500/10",
      text: "text-orange-500",
      iconBg: "bg-orange-500",
    };
  }

  return {
    container: "border-green-500/30 bg-green-500/10",
    text: "text-green-500",
    iconBg: "bg-green-600",
  };
};

/* =========================================================
   ALERT HELPERS
========================================================= */

const getAlertLevelConfig = (level) => {
  const value = String(level || "").toLowerCase();

  if (value.includes("high") || value.includes("critical")) {
    return {
      badge: "bg-red-500/10 text-red-500",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
    };
  }

  if (value.includes("medium") || value.includes("moderate")) {
    return {
      badge: "bg-orange-500/10 text-orange-500",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    };
  }

  return {
    badge: "bg-green-500/10 text-green-500",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  };
};

/* =========================================================
   WEATHER HELPERS
========================================================= */

const getTemperature = (data) => {
  if (!data) {
    return "Not available";
  }

  const value =
    data?.temperature ??
    data?.temp ??
    data?.current?.temperature ??
    data?.current?.temp ??
    data?.current_weather?.temperature;

  if (value === undefined || value === null) {
    return "Not available";
  }

  const numericValue = Number(value);

  return Number.isNaN(numericValue)
    ? `${value} °C`
    : `${numericValue.toFixed(1)} °C`;
};

const getRainfall = (data) => {
  if (!data) {
    return "Not available";
  }

  const rainfall =
    data?.rainfall ??
    data?.rain ??
    data?.precipitation ??
    data?.current?.rainfall ??
    data?.current?.rain ??
    data?.current?.precipitation ??
    data?.current_weather?.rainfall;

  if (rainfall !== undefined && rainfall !== null) {
    const numericValue = Number(rainfall);

    if (!Number.isNaN(numericValue)) {
      return `${numericValue} mm`;
    }

    return String(rainfall);
  }

  return "Not available";
};

const getHumidity = (data) => {
  if (!data) {
    return "Not available";
  }

  const value =
    data?.humidity ??
    data?.current?.humidity ??
    data?.relativeHumidity ??
    data?.current?.relativeHumidity ??
    data?.current_weather?.humidity;

  if (value === undefined || value === null) {
    return "Not available";
  }

  return `${value}%`;
};

const getWindSpeed = (data) => {
  if (!data) {
    return "Not available";
  }

  const value =
    data?.windSpeed ??
    data?.wind_speed ??
    data?.current?.windSpeed ??
    data?.current?.wind_speed ??
    data?.current_weather?.wind_speed;

  if (value === undefined || value === null) {
    return "Not available";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return `${numericValue.toFixed(1)} km/h`;
};

/* =========================================================
   DATE
========================================================= */

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* =========================================================
   SCORE
========================================================= */

const formatScore = (score) => {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return score;
  }

  if (numericScore <= 1) {
    return `${Math.round(numericScore * 100)}%`;
  }

  return `${Math.round(numericScore)}`;
};

export default CitizenDashboard;
