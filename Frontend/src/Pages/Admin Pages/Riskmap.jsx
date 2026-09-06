import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Expand,
  Filter,
  Loader2,
  MapPin,
  Minimize2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useDispatch, useSelector } from "react-redux";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

import {
  fetchAdminRiskZones,
  createAdminRiskPrediction,
  clearAdminRiskPrediction,
} from "../../Redux/Admin Slices/riskSlice.js";

import "./AdminRiskMap.css";

/* =========================================================
   LEAFLET DEFAULT ICON FIX
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================================================
   CONSTANTS
========================================================= */

const NER_CENTER = [25.8, 93.5];

const swapRiskLevel = (level) => {
  const normalizedLevel = String(level || "UNKNOWN").toUpperCase();

  if (normalizedLevel === "LOW") return "MEDIUM";
  if (normalizedLevel === "MEDIUM") return "LOW";

  return normalizedLevel;
};

/* =========================================================
   RISK COLORS
========================================================= */

const getRiskColor = (level) => {
  switch (String(level || "").toUpperCase()) {
    case "HIGH":
      return "#dc2626";

    case "MEDIUM":
      return "#f59e0b";

    case "LOW":
      return "#16a34a";

    default:
      return "#64748b";
  }
};

/* =========================================================
   RISK BACKGROUND
========================================================= */

const getRiskBg = (level) => {
  switch (String(level || "").toUpperCase()) {
    case "HIGH":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    case "MEDIUM":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

    case "LOW":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    default:
      return "bg-slate-100 text-slate-700 dark:bg-white/[0.05] dark:text-slate-300";
  }
};

/* =========================================================
   LOCATION NAME
========================================================= */

const getLocationName = (zone) => {
  return (
    zone?.locationName ||
    zone?.location?.name ||
    zone?.areaName ||
    zone?.area ||
    zone?.placeName ||
    zone?.place ||
    zone?.name ||
    "Monitored Location"
  );
};

/* =========================================================
   STATE NAME
========================================================= */

const getStateName = (zone) => {
  return (
    zone?.state ||
    zone?.location?.state ||
    zone?.region ||
    zone?.location?.region ||
    ""
  );
};

/* =========================================================
   RISK MARKER
========================================================= */

const createRiskIcon = (level) => {
  const color = getRiskColor(level);

  return L.divIcon({
    className: "custom-risk-marker",

    html: `
      <div
        style="
          width: 34px;
          height: 34px;
          border-radius: 50% 50% 50% 0;
          background: ${color};
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div
          style="
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
          "
        ></div>
      </div>
    `,

    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

/* =========================================================
   SELECTED LOCATION ICON
========================================================= */

const selectedLocationIcon = L.divIcon({
  className: "selected-location-marker",

  html: `
    <div
      style="
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #2563eb;
        border: 4px solid white;
        box-shadow:
          0 0 0 6px rgba(37,99,235,0.20),
          0 4px 15px rgba(0,0,0,0.30);
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        "
      ></div>
    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
};

/* =========================================================
   FLY TO SELECTED LOCATION
========================================================= */

const FlyToLocation = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.flyTo(
      [location.latitude, location.longitude],
      Math.max(map.getZoom(), 8),
      {
        duration: 0.8,
      },
    );
  }, [location, map]);

  return null;
};

/* =========================================================
   ADMIN RISK MAP
========================================================= */

const AdminRiskMap = () => {
  const dispatch = useDispatch();

  const {
    riskZones = [],
    loading = false,
    error = null,

    prediction = null,
    environmentalData = null,

    predictionLoading = false,
    predictionError = null,

    successMessage = null,
  } = useSelector((state) => state.adminRisk || {});

  /* =======================================================
     UI STATES
  ======================================================= */

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const [search, setSearch] = useState("");

  const [riskFilter, setRiskFilter] = useState("ALL");

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [showPredictionPanel, setShowPredictionPanel] = useState(false);

  /* =======================================================
     FETCH RISK ZONES
  ======================================================= */

  useEffect(() => {
    dispatch(fetchAdminRiskZones());
  }, [dispatch]);

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAdminRiskZones());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  /* =======================================================
     NORMALIZE RISK ZONES
  ======================================================= */

  const normalizedZones = useMemo(() => {
    return riskZones
      .map((zone) => {
        const latitude = Number(zone?.location?.latitude);

        const longitude = Number(zone?.location?.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return {
          ...zone,

          latitude,

          longitude,

          locationName: getLocationName(zone),

          state: getStateName(zone),

          riskLevel: swapRiskLevel(zone?.riskLevel),

          riskScore: Number(zone?.riskScore || 0),

          reason: zone?.reason || "No reason available",

          lastUpdated:
            zone?.lastUpdated || zone?.updatedAt || zone?.createdAt || null,
        };
      })
      .filter(Boolean);
  }, [riskZones]);

  /* =======================================================
     FILTERED ZONES
  ======================================================= */

  const filteredZones = useMemo(() => {
    return normalizedZones.filter((zone) => {
      const matchesRisk = riskFilter === "ALL" || zone.riskLevel === riskFilter;

      const searchableText = `
        ${zone.locationName || ""}
        ${zone.state || ""}
        ${zone.reason || ""}
        ${zone.riskLevel || ""}
        ${zone.latitude}
        ${zone.longitude}
      `.toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search.toLowerCase());

      return matchesRisk && matchesSearch;
    });
  }, [normalizedZones, riskFilter, search]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const high = normalizedZones.filter(
      (zone) => zone.riskLevel === "HIGH",
    ).length;

    const medium = normalizedZones.filter(
      (zone) => zone.riskLevel === "MEDIUM",
    ).length;

    const low = normalizedZones.filter(
      (zone) => zone.riskLevel === "LOW",
    ).length;

    return {
      total: normalizedZones.length,
      high,
      medium,
      low,
    };
  }, [normalizedZones]);

  /* =======================================================
     SELECT LOCATION
  ======================================================= */

  const handleLocationSelect = async (location) => {
    const matchingZone = normalizedZones.find(
      (zone) =>
        Math.abs(zone.latitude - location.latitude) < 0.01 &&
        Math.abs(zone.longitude - location.longitude) < 0.01,
    );

    setSelectedLocation({
      ...location,
      locationName: matchingZone?.locationName || "Finding location...",
      state: matchingZone?.state || "",
    });

    setShowPredictionPanel(true);

    dispatch(clearAdminRiskPrediction());

    if (matchingZone) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`,
        {
          headers: {
            Accept: "application/json",
            "Accept-Language": "en",
          },
        },
      );

      const data = await response.json();

      const address = data?.address || {};

      const locationName =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        data?.display_name?.split(",")[0] ||
        "Selected Location";

      setSelectedLocation((currentLocation) => {
        if (
          currentLocation?.latitude !== location.latitude ||
          currentLocation?.longitude !== location.longitude
        ) {
          return currentLocation;
        }

        return {
          ...currentLocation,
          locationName,
          state: address.state || "",
        };
      });
    } catch {
      setSelectedLocation((currentLocation) => ({
        ...currentLocation,
        locationName: "Selected Location",
      }));
    }
  };

  /* =======================================================
     PREDICT RISK
  ======================================================= */

  const handlePredictRisk = async () => {
    if (!selectedLocation) return;

    const riskData = {
      latitude: selectedLocation.latitude,

      longitude: selectedLocation.longitude,

      rainfall: 100,

      temperature: 25,

      humidity: 80,

      windSpeed: 10,
    };

    const result = await dispatch(createAdminRiskPrediction(riskData));

    if (createAdminRiskPrediction.fulfilled.match(result)) {
      dispatch(fetchAdminRiskZones());
    }
  };

  /* =======================================================
     EXPAND / COLLAPSE MAP
  ======================================================= */

  const handleExpandMap = () => {
    setIsMapExpanded((previous) => !previous);

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    dispatch(fetchAdminRiskZones());
  };

  /* =======================================================
     CLOSE PREDICTION
  ======================================================= */

  const handleClosePrediction = () => {
    setShowPredictionPanel(false);

    setSelectedLocation(null);

    dispatch(clearAdminRiskPrediction());
  };

  /* =======================================================
     MAP
  ======================================================= */

  const renderMap = () => {
    return (
      <MapContainer
        center={NER_CENTER}
        zoom={6}
        minZoom={5}
        maxZoom={17}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onSelect={handleLocationSelect} />

        <FlyToLocation location={selectedLocation} />

        {filteredZones.map((zone) => (
          <div key={zone._id || `${zone.latitude}-${zone.longitude}`}>
            <Marker
              position={[zone.latitude, zone.longitude]}
              icon={createRiskIcon(zone.riskLevel)}
            >
              <Popup>
                <div className="min-w-[230px]">
                  <h3 className="text-base font-bold text-slate-900">
                    {zone.locationName}
                  </h3>

                  {zone.state && (
                    <p className="mb-3 text-xs font-medium text-slate-500">
                      {zone.state}
                    </p>
                  )}

                  <div className="space-y-1.5 text-sm">
                    <p>
                      <strong>Risk:</strong> {zone.riskLevel}
                    </p>

                    <p>
                      <strong>Risk Score:</strong> {zone.riskScore}%
                    </p>

                    <p>
                      <strong>Latitude:</strong> {zone.latitude}
                    </p>

                    <p>
                      <strong>Longitude:</strong> {zone.longitude}
                    </p>

                    {zone.lastUpdated && (
                      <p>
                        <strong>Updated:</strong>{" "}
                        {new Date(zone.lastUpdated).toLocaleString()}
                      </p>
                    )}

                    <p className="pt-1">
                      <strong>Reason:</strong> {zone.reason}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[zone.latitude, zone.longitude]}
              radius={
                zone.riskLevel === "HIGH"
                  ? 5000
                  : zone.riskLevel === "MEDIUM"
                    ? 3500
                    : 2500
              }
              pathOptions={{
                color: getRiskColor(zone.riskLevel),
                fillColor: getRiskColor(zone.riskLevel),
                fillOpacity: 0.08,
                weight: 2,
              }}
            />
          </div>
        ))}

        {selectedLocation && (
          <>
            <Marker
              position={[selectedLocation.latitude, selectedLocation.longitude]}
              icon={selectedLocationIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-blue-600">
                    {selectedLocation.locationName || "Selected Location"}
                  </p>

                  {selectedLocation.state && <p>{selectedLocation.state}</p>}

                  <p>Latitude: {selectedLocation.latitude}</p>

                  <p>Longitude: {selectedLocation.longitude}</p>

                  <p className="mt-2 text-slate-600">
                    Use the AI Risk Prediction panel to analyze this location.
                  </p>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[selectedLocation.latitude, selectedLocation.longitude]}
              radius={4000}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#2563eb",
                fillOpacity: 0.08,
                weight: 2,
                dashArray: "8 8",
              }}
            />
          </>
        )}
      </MapContainer>
    );
  };

  /* =======================================================
     PREDICTION PANEL
  ======================================================= */

  const renderPredictionPanel = () => {
    if (!showPredictionPanel) return null;

    const predictionRiskLevel = swapRiskLevel(prediction?.riskLevel);

    return (
      <div
        className={`absolute right-4 top-4 z-[1000] w-[340px] max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border shadow-2xl ${"border-white/10 bg-[#0f241b] text-white"} ${
          isMapExpanded ? "max-h-[calc(100vh-2rem)]" : "max-h-[calc(100%-2rem)]"
        }`}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <BrainCircuit size={18} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                AI Risk Prediction
              </h3>

              <p className="text-xs text-slate-400">
                {selectedLocation?.locationName || "Selected location"}
              </p>
            </div>
          </div>

          <button
            onClick={handleClosePrediction}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-[#143326] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-4">
          {/* LOCATION */}

          {selectedLocation && (
            <div className="mb-4 rounded-xl border border-white/5 bg-[#07140f] p-3">
              <div className="mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />

                <span className="text-sm font-semibold text-slate-200">
                  {selectedLocation.locationName || "Selected Coordinates"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] text-slate-500">Latitude</p>

                  <p className="text-sm font-bold text-white">
                    {selectedLocation.latitude}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">Longitude</p>

                  <p className="text-sm font-bold text-white">
                    {selectedLocation.longitude}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PREDICT */}

          <button
            onClick={handlePredictRisk}
            disabled={!selectedLocation || predictionLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {predictionLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Predicting Risk...
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                Predict Risk
              </>
            )}
          </button>

          {/* ERROR */}

          {predictionError && (
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <div className="flex gap-2">
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-xs leading-5 text-red-400">
                  {predictionError}
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS */}

          {successMessage && !predictionError && (
            <div className="mt-3 rounded-xl border border-green-500/20 bg-green-500/10 p-3">
              <div className="flex gap-2">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-green-400"
                />

                <p className="text-xs leading-5 text-green-400">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* RESULT */}

          {prediction && (
            <div className="mt-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-slate-300" />

                <h4 className="text-sm font-bold text-white">
                  Prediction Result
                </h4>
              </div>

              <div
                className={`rounded-2xl border p-4 ${getRiskBg(
                  predictionRiskLevel,
                )}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Risk Level
                  </span>

                  <span className="text-lg font-black">
                    {predictionRiskLevel}
                  </span>
                </div>

                {/* SCORE */}

                <div className="mt-4">
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs font-medium">Risk Score</span>

                    <span className="text-sm font-bold">
                      {prediction.riskScore}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/70 dark:bg-black/20">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, Number(prediction.riskScore || 0)),
                        )}%`,

                        backgroundColor: getRiskColor(predictionRiskLevel),
                      }}
                    />
                  </div>
                </div>

                {/* REASON */}

                {prediction.reason && (
                  <div className="mt-4">
                    <p className="mb-1 text-xs font-bold">Reason</p>

                    <p className="text-xs leading-5">{prediction.reason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ENVIRONMENTAL DATA */}

          {environmentalData && (
            <div className="mt-4">
              <h4 className="mb-3 text-sm font-bold text-white">
                Environmental Data
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <EnvironmentalCard
                  label="Slope"
                  value={environmentalData?.terrain?.slopeAngle}
                />

                <EnvironmentalCard
                  label="Soil Saturation"
                  value={environmentalData?.soil?.soilSaturation}
                />

                <EnvironmentalCard
                  label="Vegetation"
                  value={environmentalData?.vegetation?.vegetationCover}
                />

                <EnvironmentalCard
                  label="Water Proximity"
                  value={environmentalData?.water?.proximityToWater}
                />

                <EnvironmentalCard
                  label="Earthquake"
                  value={environmentalData?.earthquake?.earthquakeActivity}
                />
              </div>
            </div>
          )}

          {/* INSTRUCTION */}

          {!prediction && !predictionError && (
            <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
              <p className="text-xs leading-5 text-blue-300">
                <strong>How to use:</strong> Click any location on the map, then
                press <strong>Predict Risk</strong> to run the AI landslide risk
                analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* =======================================================
     PAGE UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#0b1c15] text-white transition-colors duration-300">
      {/* ===================================================
          NAVBAR
      =================================================== */}

      <AdminNavbar
        onMenuClick={() => setIsSidebarOpen((previous) => !previous)}
      />

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="lg:ml-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* PAGE HEADER */}

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                  <Activity size={22} />
                </div>

                <h1 className="text-2xl font-black text-white">Risk Map</h1>
              </div>

              <p className="text-sm text-slate-400">
                Monitor landslide risk zones and predict risk for any selected
                location in the North Eastern Region.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0f241b] px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-sm transition hover:bg-[#143326] disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* STATS */}

          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Activity size={19} />}
              title="Total Zones"
              value={stats.total}
              iconClass="bg-blue-500/10 text-blue-400"
            />

            <StatCard
              icon={<AlertTriangle size={19} />}
              title="High Risk"
              value={stats.high}
              iconClass="bg-red-500/10 text-red-400"
            />

            <StatCard
              icon={<AlertTriangle size={19} />}
              title="Medium Risk"
              value={stats.medium}
              iconClass="bg-amber-500/10 text-amber-400"
            />

            <StatCard
              icon={<CheckCircle2 size={19} />}
              title="Low Risk"
              value={stats.low}
              iconClass="bg-green-500/10 text-green-400"
            />
          </div>

          {/* SEARCH / FILTER */}

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search location or risk zone..."
                className="w-full rounded-xl border border-white/10 bg-[#07140f] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={17} className="text-slate-500" />

              <select
                value={riskFilter}
                onChange={(event) => setRiskFilter(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#07140f] px-3 py-2.5 text-sm font-medium text-slate-200 outline-none"
              >
                <option value="ALL">All Risk Levels</option>

                <option value="HIGH">High Risk</option>

                <option value="MEDIUM">Medium Risk</option>

                <option value="LOW">Low Risk</option>
              </select>
            </div>
          </div>

          {/* NORMAL MAP CARD */}

          <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f241b] shadow-xl">
            {/* MAP HEADER */}

            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Regional Risk Map
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Click anywhere on the map to select a location for AI risk
                  prediction.
                </p>
              </div>

              <button
                onClick={handleExpandMap}
                className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-[#07140f] px-3 py-2 text-sm font-semibold text-slate-200 shadow-sm transition hover:bg-[#143326]"
              >
                <Expand size={17} />
                Expand Map
              </button>
            </div>

            {/* MAP VIEWPORT */}

            <div className="admin-risk-map relative z-0 h-[400px] w-full sm:h-[460px]">
              {renderMap()}

              {/* TOP LEFT INSTRUCTION */}

              <div className="absolute left-4 top-4 z-[800] max-w-[280px] rounded-xl border border-white/10 bg-[#0f241b]/95 px-3 py-2 shadow-lg backdrop-blur">
                <div className="flex items-start gap-2">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-blue-400" />

                  <div>
                    <p className="text-xs font-bold text-white">
                      Select a location
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                      Click on the map to select coordinates and predict risk.
                    </p>
                  </div>
                </div>
              </div>

              {/* LEGEND */}

              <div className="absolute bottom-4 left-4 z-[800] rounded-xl border border-white/10 bg-[#0f241b]/95 p-3 shadow-lg backdrop-blur">
                <p className="mb-2 text-[11px] font-bold text-slate-200">
                  Risk Level
                </p>

                <div className="flex flex-wrap gap-3">
                  <LegendItem color="#dc2626" label="High" />

                  <LegendItem color="#f59e0b" label="Medium" />

                  <LegendItem color="#16a34a" label="Low" />
                </div>
              </div>
            </div>
          </section>

          {/* MONITORED RISK ZONES */}

          <section className="mx-auto mt-6 w-full max-w-6xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Monitored Risk Zones
                </h2>

                <p className="text-xs text-slate-400">
                  Automatically monitored and manually predicted risk zones.
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-[#0f241b] px-3 py-1 text-xs font-semibold text-slate-300">
                {filteredZones.length} zones
              </span>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* EMPTY */}

            {filteredZones.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#0f241b] px-5 py-12 text-center">
                <MapPin size={30} className="mx-auto mb-3 text-slate-500" />

                <p className="font-semibold text-slate-200">
                  No risk zones found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try changing the search or risk filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredZones.map((zone) => (
                  <div
                    key={zone._id || `${zone.latitude}-${zone.longitude}`}
                    className="rounded-2xl border border-white/10 bg-[#0f241b] p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#143326] hover:shadow-md"
                  >
                    {/* TOP */}

                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getRiskBg(
                          zone.riskLevel,
                        )}`}
                      >
                        {zone.riskLevel}
                      </span>

                      <span className="text-sm font-black text-white">
                        {zone.riskScore}%
                      </span>
                    </div>

                    {/* LOCATION */}

                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 shrink-0 rounded-lg bg-blue-500/10 p-1.5 text-blue-400">
                          <MapPin size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-white">
                            {zone.locationName}
                          </p>

                          {zone.state && (
                            <p className="mt-0.5 text-xs font-medium text-slate-400">
                              {zone.state}
                            </p>
                          )}

                          <p className="mt-1 text-[11px] text-slate-500">
                            {Number(zone.latitude).toFixed(4)},{" "}
                            {Number(zone.longitude).toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RISK SCORE BAR */}

                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-500">
                          Risk Score
                        </span>

                        <span className="text-[10px] font-bold text-slate-300">
                          {zone.riskScore}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, zone.riskScore),
                            )}%`,

                            backgroundColor: getRiskColor(zone.riskLevel),
                          }}
                        />
                      </div>
                    </div>

                    {/* REASON */}

                    <p className="line-clamp-3 text-xs leading-5 text-slate-400">
                      {zone.reason}
                    </p>

                    {/* LAST UPDATED */}

                    {zone.lastUpdated && (
                      <p className="mt-2 text-[10px] text-slate-500">
                        Updated {new Date(zone.lastUpdated).toLocaleString()}
                      </p>
                    )}

                    {/* VIEW MAP */}

                    <button
                      onClick={() => {
                        setSelectedLocation({
                          latitude: zone.latitude,
                          longitude: zone.longitude,
                          locationName: zone.locationName,
                          state: zone.state,
                        });

                        setShowPredictionPanel(true);
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#07140f] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-[#143326]"
                    >
                      <MapPin size={14} />
                      View on Map
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* =====================================================
          FULL SCREEN MAP
      ===================================================== */}

      {isMapExpanded && (
        <div className="admin-risk-map-expanded fixed inset-0 z-[9999] bg-[#0b1c15]">
          <div className="relative h-screen w-screen">
            {/* MAP */}

            {renderMap()}

            {/* EXIT */}

            <button
              onClick={handleExpandMap}
              className="absolute right-4 top-4 z-[1000] flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f241b] px-4 py-2.5 text-sm font-bold text-white shadow-xl transition hover:bg-[#143326]"
            >
              <Minimize2 size={17} />
              Exit Map
            </button>

            {/* FULLSCREEN INSTRUCTION */}

            <div className="absolute left-4 top-4 z-[800] max-w-[300px] rounded-xl border border-white/10 bg-[#0f241b]/95 p-3 shadow-xl backdrop-blur">
              <div className="flex items-start gap-2">
                <BrainCircuit
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="text-sm font-bold text-white">
                    AI Risk Monitoring
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Click any location to select it and run an AI landslide risk
                    prediction.
                  </p>
                </div>
              </div>
            </div>

            {/* PREDICTION PANEL */}

            {renderPredictionPanel()}

            {/* LEGEND */}

            <div className="absolute bottom-5 left-5 z-[800] rounded-xl border border-white/10 bg-[#0f241b]/95 p-3 shadow-xl backdrop-blur">
              <p className="mb-2 text-xs font-bold text-slate-200">
                Risk Level
              </p>

              <div className="flex gap-4">
                <LegendItem color="#dc2626" label="High" />

                <LegendItem color="#f59e0b" label="Medium" />

                <LegendItem color="#16a34a" label="Low" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ icon, title, value, iconClass }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f241b] p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${iconClass}`}>{icon}</div>

        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>

          <p className="mt-0.5 text-xl font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   LEGEND
========================================================= */

const LegendItem = ({ color, label }) => {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="text-[11px] font-medium text-slate-300">{label}</span>
    </div>
  );
};

/* =========================================================
   ENVIRONMENTAL CARD
========================================================= */

const EnvironmentalCard = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-white/5 bg-[#07140f] p-3">
      <p className="text-[10px] font-medium text-slate-500">{label}</p>

      <p className="mt-1 truncate text-xs font-bold text-slate-200">
        {value !== undefined && value !== null && value !== "" ? value : "N/A"}
      </p>
    </div>
  );
};

export default AdminRiskMap;
