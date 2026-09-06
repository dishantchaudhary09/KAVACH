
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import {
  Map as MapIcon,
  Search,
  RefreshCw,
  LocateFixed,
  AlertTriangle,
  ShieldCheck,
  Activity,
  CloudRain,
  X,
  Navigation,
  MapPin,
  Info,
  Loader2,
} from "lucide-react";

// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_API_URL ||
  "http://localhost:3000/api";

// ======================================================
// NER DEFAULT CENTER
// ======================================================

const NER_CENTER = [25.5, 93.5];

// ======================================================
// LEAFLET DEFAULT ICON FIX
// ======================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ======================================================
// CUSTOM USER LOCATION ICON
// ======================================================

const userLocationIcon = L.divIcon({
  className: "custom-user-location",

  html: `
    <div style="
      width:18px;
      height:18px;
      background:#3b82f6;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 8px rgba(59,130,246,0.20);
    "></div>
  `,

  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// ======================================================
// CUSTOM RISK MARKER
// ======================================================

const createRiskIcon = (riskLevel) => {
  const level = riskLevel.toLowerCase();

  const colors = {
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
  };

  const color = colors[level] || colors.low;

  return L.divIcon({
    className: "risk-marker-icon",

    html: `
      <div style="
        position:relative;
        width:24px;
        height:24px;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <div style="
          width:20px;
          height:20px;
          background:${color};
          border:3px solid white;
          border-radius:50%;
          box-shadow:
            0 2px 6px rgba(0,0,0,0.35),
            0 0 0 5px ${color}33;
        "></div>
      </div>
    `,

    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
};

// ======================================================
// RISK CONFIG
// ======================================================

const riskConfig = {
  high: {
    label: "High Risk",
    color: "#f97316",
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/30",
    radius: 900,
  },

  medium: {
    label: "Medium Risk",
    color: "#eab308",
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    border: "border-yellow-500/30",
    radius: 700,
  },

  low: {
    label: "Low Risk",
    color: "#22c55e",
    bg: "bg-green-500/10",
    text: "text-green-500",
    border: "border-green-500/30",
    radius: 500,
  },
};

// ======================================================
// MAP CONTROLLER
// ======================================================

const MapController = ({ selectedZone, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedZone) {
      const latitude =
        selectedZone.location?.latitude ??
        selectedZone.latitude;

      const longitude =
        selectedZone.location?.longitude ??
        selectedZone.longitude;

      if (
        latitude !== undefined &&
        longitude !== undefined &&
        !Number.isNaN(Number(latitude)) &&
        !Number.isNaN(Number(longitude))
      ) {
        map.flyTo(
          [Number(latitude), Number(longitude)],
          12,
          {
            duration: 1.2,
          },
        );
      }
    }
  }, [selectedZone, map]);

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 13, {
        duration: 1.2,
      });
    }
  }, [userLocation, map]);

  return null;
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const RiskMap = () => {
  const darkMode = useSelector(
    (state) => state.theme?.darkMode || false,
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [riskZones, setRiskZones] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [selectedZone, setSelectedZone] =
    useState(null);

  const [userLocation, setUserLocation] =
    useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  // ====================================================
  // DARK MODE
  // ====================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode,
    );
  }, [darkMode]);

  // ====================================================
  // FETCH RISK ZONES
  // ====================================================

  const fetchRiskZones = async (
    showLoader = true,
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login to access the risk map.",
        );
      }

      const response = await fetch(
        `${API_URL}/risk`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch risk zones.",
        );
      }

      const zones =
        data.riskZones ||
        data.data ||
        data.zones ||
        [];

      setRiskZones(
        Array.isArray(zones) ? zones : [],
      );
    } catch (err) {
      console.error(
        "RISK MAP ERROR:",
        err,
      );

      setError(
        err.message ||
          "Unable to load risk zones.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ====================================================
  // INITIAL FETCH
  // ====================================================

  useEffect(() => {
    fetchRiskZones(true);
  }, []);

  // ====================================================
  // CURRENT LOCATION
  // ====================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser.",
      );

      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setUserLocation([
          latitude,
          longitude,
        ]);

        setLocationLoading(false);
      },

      (err) => {
        console.error(
          "LOCATION ERROR:",
          err,
        );

        setLocationLoading(false);

        setError(
          "Unable to access your current location. Please allow location permission.",
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // ====================================================
  // NORMALIZE RISK LEVEL
  // ====================================================

  const getRiskLevel = (zone) => {
    const level = (
      zone.riskLevel ||
      zone.level ||
      "low"
    ).toLowerCase();

    if (level === "high") return "high";

    if (level === "medium") return "medium";

    return "low";
  };

  // ====================================================
  // FILTER
  // ====================================================

  const filteredZones = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return riskZones.filter((zone) => {
      const riskLevel =
        getRiskLevel(zone);

      const matchesRisk =
        activeFilter === "all" ||
        riskLevel === activeFilter;

      const searchableText = `
        ${zone.name || ""}
        ${zone.locationName || ""}
        ${zone.reason || ""}
        ${zone.description || ""}
        ${zone.state || ""}
      `.toLowerCase();

      const matchesSearch =
        searchableText.includes(
          searchText,
        );

      return (
        matchesRisk &&
        matchesSearch
      );
    });
  }, [
    riskZones,
    activeFilter,
    search,
  ]);

  // ====================================================
  // RISK COUNTS
  // ====================================================

  const riskCounts = useMemo(() => {
    return {
      high: riskZones.filter(
        (zone) =>
          getRiskLevel(zone) === "high",
      ).length,

      medium: riskZones.filter(
        (zone) =>
          getRiskLevel(zone) === "medium",
      ).length,

      low: riskZones.filter(
        (zone) =>
          getRiskLevel(zone) === "low",
      ).length,
    };
  }, [riskZones]);

  // ====================================================
  // ZONE LOCATION
  // ====================================================

  const getZonePosition = (zone) => {
    const latitude =
      zone.location?.latitude ??
      zone.latitude;

    const longitude =
      zone.location?.longitude ??
      zone.longitude;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return null;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return null;
    }

    return [lat, lng];
  };

  // ====================================================
  // RISK SCORE
  // ====================================================

  const getRiskScore = (zone) => {
    if (
      zone.riskScore !== undefined
    ) {
      return Number(
        zone.riskScore,
      );
    }

    const level =
      getRiskLevel(zone);

    if (level === "high") return 80;

    if (level === "medium") return 55;

    return 25;
  };

  // ====================================================
  // LOCATION NAME
  // ====================================================

  const getLocationName = (zone) => {
    return (
      zone.locationName ||
      zone.name ||
      zone.state ||
      "Risk Zone"
    );
  };

  // ====================================================
  // RISK REASON
  // ====================================================

  const getReason = (zone) => {
    return (
      zone.reason ||
      zone.description ||
      "Risk detected based on environmental and terrain conditions."
    );
  };

  // ====================================================
  // CLEAR SEARCH
  // ====================================================

  const clearSearch = () => {
    setSearch("");
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#07140f] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* NAVBAR */}

      <CitizenNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* SIDEBAR */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* MAIN */}

      <main className="pt-[68px] md:ml-64">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

          {/* HEADER */}

          <div className="mb-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      darkMode
                        ? "bg-green-500/10"
                        : "bg-green-50"
                    }`}
                  >
                    <MapIcon className="h-5 w-5 text-green-500" />
                  </div>

                  <span className="text-sm font-semibold text-green-500">
                    LIVE RISK MONITORING
                  </span>
                </div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Landslide Risk Map
                </h1>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Monitor potential landslide and
                  hazard zones across the North
                  Eastern Region.
                </p>
              </div>

              {/* REFRESH */}

              <button
                onClick={() =>
                  fetchRiskZones(false)
                }
                disabled={refreshing}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] hover:bg-white/10"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">

              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />

              <div className="flex-1">
                <p className="text-sm font-bold text-red-500">
                  Unable to load risk data
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError("")}
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* ==================================================
              RISK SUMMARY
              ORDER: HIGH → LOW → MEDIUM → TOTAL
          ================================================== */}

          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

            <RiskSummaryCard
              title="High Risk"
              value={riskCounts.high}
              icon={
                <AlertTriangle size={18} />
              }
              color="orange"
              darkMode={darkMode}
            />

            <RiskSummaryCard
              title="Low Risk"
              value={riskCounts.low}
              icon={
                <ShieldCheck size={18} />
              }
              color="green"
              darkMode={darkMode}
            />

            <RiskSummaryCard
              title="Medium Risk"
              value={riskCounts.medium}
              icon={
                <Activity size={18} />
              }
              color="yellow"
              darkMode={darkMode}
            />

            <RiskSummaryCard
              title="Total Zones"
              value={riskZones.length}
              icon={
                <MapPin size={18} />
              }
              color="blue"
              darkMode={darkMode}
            />
          </div>

          {/* CONTROLS */}

          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Search risk zones, locations or states..."
                className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition ${
                  darkMode
                    ? "border-white/10 bg-[#0c2119] text-white placeholder:text-slate-600 focus:border-green-500"
                    : "border-slate-200 bg-white text-slate-900 focus:border-green-500"
                }`}
              />

              {search && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    darkMode
                      ? "text-slate-500 hover:text-white"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* FILTER */}

            <div
              className={`flex gap-2 overflow-x-auto rounded-xl border p-1 ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              {[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "high",
                  label: "High",
                },
                {
                  value: "low",
                  label: "Low",
                },
                {
                  value: "medium",
                  label: "Medium",
                },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() =>
                    setActiveFilter(
                      filter.value,
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                    activeFilter ===
                    filter.value
                      ? "bg-green-600 text-white"
                      : darkMode
                        ? "text-slate-400 hover:bg-white/10 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAP + DETAILS */}

          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">

            {/* MAP */}

            <section
              className={`relative overflow-hidden rounded-2xl border shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="h-[480px] sm:h-[540px] lg:h-[560px]">

                {loading ? (
                  <div className="flex h-full flex-col items-center justify-center">

                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />

                    <p className="mt-3 text-sm font-semibold">
                      Loading risk map...
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Fetching latest risk zones
                    </p>
                  </div>
                ) : (
                  <MapContainer
                    center={NER_CENTER}
                    zoom={6}
                    scrollWheelZoom={true}
                    className="z-0 h-full w-full"
                  >

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      maxZoom={19}
                    />

                    <MapController
                      selectedZone={
                        selectedZone
                      }
                      userLocation={
                        userLocation
                      }
                    />

                    {/* RISK ZONES */}

                    {filteredZones.map(
                      (zone) => {
                        const position =
                          getZonePosition(
                            zone,
                          );

                        if (!position) {
                          return null;
                        }

                        const level =
                          getRiskLevel(
                            zone,
                          );

                        const config =
                          riskConfig[
                            level
                          ] ||
                          riskConfig.low;

                        const score =
                          getRiskScore(
                            zone,
                          );

                        const isSelected =
                          selectedZone?._id ===
                          zone._id;

                        return (
                          <React.Fragment
                            key={
                              zone._id ||
                              `${position[0]}-${position[1]}`
                            }
                          >
                            <Circle
                              center={
                                position
                              }
                              radius={
                                config.radius
                              }
                              pathOptions={{
                                color:
                                  config.color,

                                fillColor:
                                  config.color,

                                fillOpacity:
                                  isSelected
                                    ? 0.28
                                    : 0.13,

                                weight:
                                  isSelected
                                    ? 3
                                    : 1.5,
                              }}
                              eventHandlers={{
                                click: () =>
                                  setSelectedZone(
                                    zone,
                                  ),
                              }}
                            />

                            <Marker
                              position={
                                position
                              }
                              icon={createRiskIcon(
                                level,
                              )}
                              eventHandlers={{
                                click: () =>
                                  setSelectedZone(
                                    zone,
                                  ),
                              }}
                            >
                              <Popup>
                                <div className="min-w-[210px]">

                                  <div className="flex items-center justify-between gap-3">

                                    <h3 className="font-bold text-slate-900">
                                      {getLocationName(
                                        zone,
                                      )}
                                    </h3>

                                    <span
                                      className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                                      style={{
                                        background:
                                          config.color,
                                      }}
                                    >
                                      {
                                        config.label
                                      }
                                    </span>
                                  </div>

                                  <div className="mt-3">

                                    <p className="text-xs text-slate-500">
                                      Risk Score
                                    </p>

                                    <p
                                      className="text-2xl font-bold"
                                      style={{
                                        color:
                                          config.color,
                                      }}
                                    >
                                      {score}

                                      <span className="text-xs text-slate-400">
                                        /100
                                      </span>
                                    </p>
                                  </div>

                                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    {getReason(
                                      zone,
                                    )}
                                  </p>
                                </div>
                              </Popup>
                            </Marker>
                          </React.Fragment>
                        );
                      },
                    )}

                    {/* USER LOCATION */}

                    {userLocation && (
                      <Marker
                        position={
                          userLocation
                        }
                        icon={
                          userLocationIcon
                        }
                      >
                        <Popup>
                          <div className="text-sm font-semibold">
                            Your Current
                            Location
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                )}
              </div>

              {/* MAP CONTROL */}

              <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">

                <button
                  onClick={
                    getCurrentLocation
                  }
                  disabled={
                    locationLoading
                  }
                  title="Use my location"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg backdrop-blur transition disabled:opacity-60 ${
                    darkMode
                      ? "border-white/10 bg-[#07140f]/90 text-white hover:bg-[#0c2119]"
                      : "border-slate-200 bg-white/95 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {locationLoading ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <LocateFixed
                      size={17}
                    />
                  )}
                </button>
              </div>

              {/* LEGEND */}

              <div
                className={`absolute bottom-4 left-4 z-[1000] rounded-xl border p-3 shadow-xl backdrop-blur ${
                  darkMode
                    ? "border-white/10 bg-[#07140f]/90"
                    : "border-slate-200 bg-white/95"
                }`}
              >
                <p
                  className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${
                    darkMode
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                >
                  Risk Level
                </p>

                <div className="space-y-2">

                  <LegendItem
                    color="#f97316"
                    label="High Risk"
                  />

                  <LegendItem
                    color="#22c55e"
                    label="Low Risk"
                  />

                  <LegendItem
                    color="#eab308"
                    label="Medium Risk"
                  />

                </div>
              </div>

              {/* RESULT COUNT */}

              {!loading && (
                <div
                  className={`absolute left-4 top-4 z-[1000] rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur ${
                    darkMode
                      ? "border-white/10 bg-[#07140f]/90 text-white"
                      : "border-slate-200 bg-white/95 text-slate-800"
                  }`}
                >
                  {filteredZones.length} risk zone
                  {filteredZones.length !==
                  1
                    ? "s"
                    : ""}
                </div>
              )}
            </section>

            {/* DETAILS */}

            <section
              className={`overflow-hidden rounded-2xl border shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0c2119]"
                  : "border-slate-200 bg-white"
              }`}
            >
              {selectedZone ? (
                <RiskDetails
                  zone={selectedZone}
                  darkMode={darkMode}
                  onClose={() =>
                    setSelectedZone(
                      null,
                    )
                  }
                />
              ) : (
                <div className="flex h-full min-h-[400px] flex-col">

                  <div
                    className={`border-b p-5 ${
                      darkMode
                        ? "border-white/10"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                        <Info
                          size={19}
                          className="text-green-500"
                        />
                      </div>

                      <div>
                        <h2 className="font-bold">
                          Risk Zone Details
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Select a zone on the map
                          to view details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-500/10">
                      <MapPin
                        size={28}
                        className="text-slate-400"
                      />
                    </div>

                    <h3 className="mt-4 font-bold">
                      Select a Risk Zone
                    </h3>

                    <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-slate-500">
                      Click on any marker or
                      highlighted zone to view
                      its risk score, reason and
                      latest update.
                    </p>
                  </div>

                  <div
                    className={`border-t p-5 ${
                      darkMode
                        ? "border-white/10"
                        : "border-slate-200"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Map Information
                    </p>

                    <div className="mt-3 space-y-3">

                      <InfoRow
                        icon={
                          <Activity size={15} />
                        }
                        label="Risk zones"
                        value={
                          riskZones.length
                        }
                        darkMode={
                          darkMode
                        }
                      />

                      <InfoRow
                        icon={
                          <AlertTriangle
                            size={15}
                          />
                        }
                        label="High risk"
                        value={
                          riskCounts.high
                        }
                        darkMode={
                          darkMode
                        }
                      />

                      <InfoRow
                        icon={
                          <CloudRain
                            size={15}
                          />
                        }
                        label="Monitoring"
                        value="Active"
                        darkMode={
                          darkMode
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* SAFETY NOTICE */}

          <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">

            <div className="flex items-start gap-3">

              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

              <div>
                <p className="text-sm font-bold text-orange-500">
                  Safety Notice
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Risk levels are generated from
                  available environmental, terrain
                  and historical data. Always follow
                  official warnings and avoid entering
                  areas marked as high risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ======================================================
// RISK SUMMARY CARD
// ======================================================

const RiskSummaryCard = ({
  title,
  value,
  icon,
  color,
  darkMode,
}) => {
  const colorMap = {
    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-500",
    },

    yellow: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-500",
    },

    green: {
      bg: "bg-green-500/10",
      text: "text-green-500",
    },

    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
  };

  const current =
    colorMap[color] ||
    colorMap.green;

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        darkMode
          ? "border-white/10 bg-[#0c2119]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${current.bg} ${current.text}`}
        >
          {icon}
        </div>

        <span className="text-xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-500">
        {title}
      </p>
    </div>
  );
};

// ======================================================
// LEGEND
// ======================================================

const LegendItem = ({
  color,
  label,
}) => {
  return (
    <div className="flex items-center gap-2">

      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="text-[10px] font-semibold text-slate-500">
        {label}
      </span>
    </div>
  );
};

// ======================================================
// INFO ROW
// ======================================================

const InfoRow = ({
  icon,
  label,
  value,
  darkMode,
}) => {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span className="text-slate-500">
          {icon}
        </span>

        <span className="text-xs text-slate-500">
          {label}
        </span>
      </div>

      <span
        className={`text-xs font-bold ${
          darkMode
            ? "text-slate-200"
            : "text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

// ======================================================
// RISK DETAILS
// ======================================================

const RiskDetails = ({
  zone,
  darkMode,
  onClose,
}) => {
  const level = (
    zone.riskLevel ||
    zone.level ||
    "low"
  ).toLowerCase();

  const normalizedLevel =
    level === "high"
      ? "high"
      : level === "medium"
        ? "medium"
        : "low";

  const config =
    riskConfig[
      normalizedLevel
    ] || riskConfig.low;

  const score =
    zone.riskScore !== undefined
      ? Number(zone.riskScore)
      : normalizedLevel === "high"
        ? 80
        : normalizedLevel === "medium"
          ? 55
          : 25;

  const locationName =
    zone.locationName ||
    zone.name ||
    zone.state ||
    "Risk Zone";

  const reason =
    zone.reason ||
    zone.description ||
    "Risk detected based on environmental and terrain conditions.";

  const latitude =
    zone.location?.latitude ??
    zone.latitude;

  const longitude =
    zone.location?.longitude ??
    zone.longitude;

  const updated =
    zone.updatedAt ||
    zone.createdAt;

  const dateText = updated
    ? new Date(
        updated,
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      )
    : "Recently";

  return (
    <div>

      {/* HEADER */}

      <div className="relative overflow-hidden p-5">

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundColor:
              config.color,
          }}
        />

        <div className="relative flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${config.color}20`,
                color: config.color,
              }}
            >
              <AlertTriangle size={21} />
            </div>

            <div>

              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color:
                    config.color,
                }}
              >
                {config.label}
              </span>

              <h2 className="mt-1 text-lg font-bold">
                {locationName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`rounded-lg p-2 transition ${
              darkMode
                ? "text-slate-400 hover:bg-white/10 hover:text-white"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* BODY */}

      <div className="space-y-5 p-5">

        {/* SCORE */}

        <div>

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs text-slate-500">
                Risk Score
              </p>

              <div className="mt-1 flex items-baseline gap-1">

                <span
                  className="text-4xl font-bold"
                  style={{
                    color:
                      config.color,
                  }}
                >
                  {score}
                </span>

                <span className="text-sm text-slate-500">
                  /100
                </span>
              </div>
            </div>

            <div
              className={`rounded-lg px-3 py-2 text-xs font-bold ${config.bg} ${config.text}`}
            >
              {score >= 70
                ? "High"
                : score >= 40
                  ? "Medium"
                  : "Low"}
            </div>
          </div>

          <div
            className={`mt-3 h-2 overflow-hidden rounded-full ${
              darkMode
                ? "bg-white/10"
                : "bg-slate-200"
            }`}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  Math.max(
                    score,
                    0,
                  ),
                  100,
                )}%`,
                backgroundColor:
                  config.color,
              }}
            />
          </div>
        </div>

        {/* REASON */}

        <div
          className={`rounded-xl border p-4 ${
            darkMode
              ? "border-white/10 bg-[#07140f]"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2">

            <Activity
              size={16}
              className="text-green-500"
            />

            <p className="text-xs font-bold">
              Risk Assessment
            </p>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {reason}
          </p>
        </div>

        {/* LOCATION */}

        <div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Coordinates
          </p>

          <div className="mt-2 grid grid-cols-2 gap-2">

            <CoordinateBox
              label="Latitude"
              value={latitude}
              darkMode={darkMode}
            />

            <CoordinateBox
              label="Longitude"
              value={longitude}
              darkMode={darkMode}
            />

          </div>
        </div>

        {/* WEATHER */}

        {(zone.rainfall !==
          undefined ||
          zone.weather) && (
          <div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Environmental Data
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">

              {zone.rainfall !==
                undefined && (
                <div
                  className={`rounded-lg border p-3 ${
                    darkMode
                      ? "border-white/10 bg-[#07140f]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">

                    <CloudRain
                      size={15}
                      className="text-blue-500"
                    />

                    <span className="text-[10px] text-slate-500">
                      Rainfall
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold">
                    {zone.rainfall}
                  </p>
                </div>
              )}

              {zone.weather && (
                <div
                  className={`rounded-lg border p-3 ${
                    darkMode
                      ? "border-white/10 bg-[#07140f]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">

                    <CloudRain
                      size={15}
                      className="text-blue-500"
                    />

                    <span className="text-[10px] text-slate-500">
                      Weather
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold">
                    {zone.weather}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* UPDATED */}

        <div className="flex items-center gap-2 text-[10px] text-slate-500">

          <ClockIcon />

          Updated:

          <span className="font-semibold">
            {dateText}
          </span>
        </div>

        {/* MAP ACTION */}

        <button
          type="button"
          onClick={() => {
            if (
              latitude !==
                undefined &&
              latitude !== null &&
              longitude !==
                undefined &&
              longitude !== null
            ) {
              window.open(
                `https://www.google.com/maps?q=${latitude},${longitude}`,
                "_blank",
              );
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-green-700"
        >
          <Navigation size={15} />

          Open in Maps
        </button>
      </div>
    </div>
  );
};

// ======================================================
// COORDINATE BOX
// ======================================================

const CoordinateBox = ({
  label,
  value,
  darkMode,
}) => {
  return (
    <div
      className={`rounded-lg border p-3 ${
        darkMode
          ? "border-white/10 bg-[#07140f]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-[10px] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold">
        {value ?? "--"}
      </p>
    </div>
  );
};

// ======================================================
// CLOCK ICON
// ======================================================

const ClockIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
};

export default RiskMap;
