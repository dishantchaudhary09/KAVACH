
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Route,
  MapPin,
  Clock,
  Eye,
  X,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Construction,
  Navigation,
  ShieldAlert,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import { fetchAdminRoads } from "../../Redux/Admin Slices/roadSlice.js";

// ============================================================
// FIX LEAFLET DEFAULT MARKER ICON
// ============================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ============================================================
// MAP CENTER COMPONENT
// ============================================================

const MapCenter = ({ roads }) => {
  const map = useMap();

  useEffect(() => {
    if (!roads.length) return;

    const validRoads = roads.filter(
      (road) =>
        road.latitude !== null &&
        road.longitude !== null &&
        Number.isFinite(Number(road.latitude)) &&
        Number.isFinite(Number(road.longitude))
    );

    if (!validRoads.length) return;

    const bounds = L.latLngBounds(
      validRoads.map((road) => [
        Number(road.latitude),
        Number(road.longitude),
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 12,
    });
  }, [roads, map]);

  return null;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const CitizenRoads = () => {
  const dispatch = useDispatch();

  // ==========================================================
  // DARK MODE
  // ==========================================================

  const darkMode = useSelector(
    (state) => state.theme?.darkMode || false
  );

  // ==========================================================
  // ROAD REDUX STATE
  // ==========================================================

  const roadState = useSelector(
    (state) => state.adminRoad || {}
  );

  const roads = Array.isArray(roadState.roads)
    ? roadState.roads
    : [];

  const loading = roadState.loading || false;
  const error = roadState.error || null;

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedRoad, setSelectedRoad] = useState(null);

  // ==========================================================
  // FETCH ROAD DATA
  // ==========================================================

  useEffect(() => {
    dispatch(fetchAdminRoads());
  }, [dispatch]);

  // ==========================================================
  // NORMALIZE BACKEND DATA
  // ==========================================================

  const normalizedRoads = useMemo(() => {
    if (!Array.isArray(roads)) return [];

    return roads.map((road) => {
      const latitude =
        road?.location?.latitude ??
        road?.latitude ??
        null;

      const longitude =
        road?.location?.longitude ??
        road?.longitude ??
        null;

      return {
        id: road?._id || road?.id || Math.random(),

        name:
          road?.roadName ||
          "Unnamed Road",

        latitude:
          latitude !== null
            ? Number(latitude)
            : null,

        longitude:
          longitude !== null
            ? Number(longitude)
            : null,

        status: String(
          road?.status || "open"
        )
          .toLowerCase()
          .trim(),

        reason:
          road?.reason ||
          "No additional information available.",

        reportedBy:
          road?.reportedBy?.name ||
          "Monitoring Team",

        createdAt:
          road?.createdAt ||
          road?.updatedAt ||
          null,

        updatedAt:
          road?.updatedAt ||
          road?.createdAt ||
          null,
      };
    });
  }, [roads]);

  // ==========================================================
  // VALID MAP ROADS
  // ==========================================================

  const mappedRoads = useMemo(() => {
    return normalizedRoads.filter(
      (road) =>
        Number.isFinite(road.latitude) &&
        Number.isFinite(road.longitude)
    );
  }, [normalizedRoads]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const stats = useMemo(() => {
    return {
      total: normalizedRoads.length,

      open: normalizedRoads.filter(
        (road) => road.status === "open"
      ).length,

      blocked: normalizedRoads.filter(
        (road) => road.status === "blocked"
      ).length,

      damaged: normalizedRoads.filter(
        (road) => road.status === "damaged"
      ).length,

      maintenance: normalizedRoads.filter(
        (road) =>
          road.status === "under_maintenance"
      ).length,
    };
  }, [normalizedRoads]);

  // ==========================================================
  // FILTER ROADS
  // ==========================================================

  const filteredRoads = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return normalizedRoads.filter((road) => {
      const matchesSearch =
        !query ||
        road.name
          .toLowerCase()
          .includes(query) ||
        road.reason
          .toLowerCase()
          .includes(query) ||
        road.status
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        road.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    normalizedRoads,
    search,
    filter,
  ]);

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsed = new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "Not available";
    }

    return parsed.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================================
  // STATUS CONFIG
  // ==========================================================

  const getStatusConfig = (
    status
  ) => {
    switch (status) {
      case "open":
        return {
          label: "Open",
          icon: CheckCircle,

          badge:
            "bg-green-500/10 text-green-500 border-green-500/20",

          iconBg:
            "bg-green-500/10 text-green-500",

          markerColor:
            "#22c55e",
        };

      case "blocked":
        return {
          label: "Blocked",
          icon: ShieldAlert,

          badge:
            "bg-red-500/10 text-red-500 border-red-500/20",

          iconBg:
            "bg-red-500/10 text-red-500",

          markerColor:
            "#ef4444",
        };

      case "damaged":
        return {
          label: "Damaged",
          icon: AlertTriangle,

          badge:
            "bg-orange-500/10 text-orange-500 border-orange-500/20",

          iconBg:
            "bg-orange-500/10 text-orange-500",

          markerColor:
            "#f97316",
        };

      case "under_maintenance":
        return {
          label: "Under Maintenance",
          icon: Construction,

          badge:
            "bg-blue-500/10 text-blue-500 border-blue-500/20",

          iconBg:
            "bg-blue-500/10 text-blue-500",

          markerColor:
            "#3b82f6",
        };

      default:
        return {
          label: "Unknown",
          icon: Route,

          badge:
            "bg-slate-500/10 text-slate-500 border-slate-500/20",

          iconBg:
            "bg-slate-500/10 text-slate-500",

          markerColor:
            "#64748b",
        };
    }
  };

  // ==========================================================
  // CUSTOM COLORED MARKER
  // ==========================================================

  const getMarkerIcon = (
    status
  ) => {
    const config =
      getStatusConfig(status);

    return L.divIcon({
      className:
        "custom-road-marker",

      html: `
        <div style="
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: ${config.markerColor};
          border: 3px solid white;
          box-shadow: 0 3px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 15px;
          font-weight: bold;
        ">
          ${status === "open" ? "✓" : "!"}
        </div>
      `,

      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });
  };

  // ==========================================================
  // GOOGLE MAP
  // ==========================================================

  const openMap = (road) => {
    if (
      !Number.isFinite(
        road.latitude
      ) ||
      !Number.isFinite(
        road.longitude
      )
    ) {
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${road.latitude},${road.longitude}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = () => {
    dispatch(fetchAdminRoads());
  };

  // ==========================================================
  // MAP CENTER
  // ==========================================================

  const defaultCenter = [
    25.5,
    93.5,
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#07140f] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <CitizenNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="pt-[68px] lg:pl-64">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Route
                  size={25}
                  className="text-blue-500"
                />

                <h1 className="text-xl font-bold sm:text-2xl">
                  Road Status
                </h1>
              </div>

              <p
                className={`mt-1 text-xs sm:text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Check road conditions,
                closures and reported
                hazards in your area.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition ${
                darkMode
                  ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-500">
              {typeof error === "string"
                ? error
                : "Unable to load road status."}
            </div>
          )}

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

            <RoadStat
              icon={
                <CheckCircle size={20} />
              }
              value={stats.open}
              label="Open Roads"
              color="text-green-500"
              bg="bg-green-500/10"
              darkMode={darkMode}
            />

            <RoadStat
              icon={
                <ShieldAlert size={20} />
              }
              value={stats.blocked}
              label="Blocked"
              color="text-red-500"
              bg="bg-red-500/10"
              darkMode={darkMode}
            />

            <RoadStat
              icon={
                <AlertTriangle size={20} />
              }
              value={stats.damaged}
              label="Damaged"
              color="text-orange-500"
              bg="bg-orange-500/10"
              darkMode={darkMode}
            />

            <RoadStat
              icon={
                <Construction size={20} />
              }
              value={stats.maintenance}
              label="Maintenance"
              color="text-blue-500"
              bg="bg-blue-500/10"
              darkMode={darkMode}
            />

          </div>

          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <section
            className={`mb-6 rounded-2xl border p-4 ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search road or issue..."
                  className={`h-10 w-full rounded-xl border pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 ${
                    darkMode
                      ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              {/* FILTERS */}

              <div className="flex gap-2 overflow-x-auto">

                {[
                  ["all", "All"],
                  ["open", "Open"],
                  ["blocked", "Blocked"],
                  ["damaged", "Damaged"],
                  [
                    "under_maintenance",
                    "Maintenance",
                  ],
                ].map(
                  ([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() =>
                        setFilter(value)
                      }
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-semibold transition ${
                        filter === value
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "bg-white/[0.05] text-slate-400 hover:text-white"
                            : "bg-slate-100 text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}

              </div>
            </div>
          </section>

          {/* =================================================
              ACTUAL MAP
          ================================================= */}

          <section
            className={`mb-6 overflow-hidden rounded-2xl border ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >

            {/* MAP HEADER */}

            <div className="flex items-center justify-between border-b p-4">

              <div>
                <h2 className="text-sm font-bold">
                  Road Conditions Map
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Live road reports based
                  on available coordinates.
                </p>
              </div>

              <MapPin
                size={18}
                className="text-blue-500"
              />

            </div>

            {/* MAP */}

            <div className="relative h-[320px] sm:h-[420px]">

              {mappedRoads.length > 0 ? (
                <MapContainer
                  center={defaultCenter}
                  zoom={6}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >

                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapCenter
                    roads={mappedRoads}
                  />

                  {mappedRoads.map(
                    (road) => {
                      const config =
                        getStatusConfig(
                          road.status
                        );

                      return (
                        <Marker
                          key={road.id}
                          position={[
                            road.latitude,
                            road.longitude,
                          ]}
                          icon={getMarkerIcon(
                            road.status
                          )}
                        >
                          <Popup>

                            <div className="min-w-[190px]">

                              <h3 className="font-bold text-slate-900">
                                {road.name}
                              </h3>

                              <div className="mt-2">
                                <span
                                  className={`rounded-full border px-2 py-1 text-[10px] font-bold ${config.badge}`}
                                >
                                  {config.label}
                                </span>
                              </div>

                              <p className="mt-2 text-xs text-slate-600">
                                {road.reason}
                              </p>

                              <p className="mt-2 text-[10px] text-slate-500">
                                {road.latitude.toFixed(
                                  4
                                )}
                                ,{" "}
                                {road.longitude.toFixed(
                                  4
                                )}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedRoad(
                                    road
                                  )
                                }
                                className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-bold text-white"
                              >
                                <Eye
                                  size={12}
                                />
                                View Details
                              </button>

                            </div>

                          </Popup>
                        </Marker>
                      );
                    }
                  )}

                </MapContainer>
              ) : (
                <div
                  className={`flex h-full items-center justify-center ${
                    darkMode
                      ? "bg-[#091a14]"
                      : "bg-slate-100"
                  }`}
                >

                  <div className="px-5 text-center">

                    <MapPin
                      size={40}
                      className="mx-auto text-slate-400"
                    />

                    <p className="mt-3 text-sm font-semibold">
                      No mapped road data
                    </p>

                    <p className="mx-auto mt-1 max-w-sm text-[10px] leading-relaxed text-slate-400">
                      Road locations will
                      appear on the map when
                      latitude and longitude
                      coordinates are available
                      from the backend.
                    </p>

                  </div>

                </div>
              )}

              {/* MAP LEGEND */}

              <div
                className={`absolute bottom-3 left-3 z-[500] rounded-xl border p-3 shadow-lg backdrop-blur ${
                  darkMode
                    ? "border-white/10 bg-[#0c2119]/95"
                    : "border-slate-200 bg-white/95"
                }`}
              >

                <p className="mb-2 text-[9px] font-bold">
                  Road Status
                </p>

                <div className="flex flex-wrap gap-3">

                  <Legend
                    color="bg-green-500"
                    label="Open"
                  />

                  <Legend
                    color="bg-red-500"
                    label="Blocked"
                  />

                  <Legend
                    color="bg-orange-500"
                    label="Damaged"
                  />

                  <Legend
                    color="bg-blue-500"
                    label="Maintenance"
                  />

                </div>

              </div>

            </div>
          </section>

          {/* =================================================
              REPORTED ROADS
          ================================================= */}

          <section
            className={`rounded-2xl border ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >

            <div className="flex items-center justify-between border-b p-4">

              <div>
                <h2 className="text-sm font-bold">
                  Reported Roads
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Latest road condition updates
                </p>
              </div>

              <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[9px] font-bold text-blue-500">
                {filteredRoads.length} roads
              </span>

            </div>

            <div className="p-4">

              {loading ? (
                <div className="py-14 text-center">

                  <RefreshCw
                    size={28}
                    className="mx-auto animate-spin text-blue-500"
                  />

                  <p className="mt-3 text-xs font-semibold">
                    Loading road conditions...
                  </p>

                </div>
              ) : filteredRoads.length ===
                0 ? (
                <div className="py-14 text-center">

                  <Route
                    size={35}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 text-sm font-semibold">
                    No road reports found
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Try another search or
                    status filter.
                  </p>

                </div>
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">

                  {filteredRoads.map(
                    (road) => {
                      const config =
                        getStatusConfig(
                          road.status
                        );

                      const Icon =
                        config.icon;

                      return (
                        <div
                          key={road.id}
                          className={`rounded-xl border p-4 transition hover:-translate-y-[1px] hover:shadow-md ${
                            darkMode
                              ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                              : "border-slate-200 bg-slate-50 hover:bg-white"
                          }`}
                        >

                          <div className="flex gap-3">

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
                            >
                              <Icon
                                size={20}
                              />
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="text-sm font-bold">
                                  {road.name}
                                </h3>

                                <span
                                  className={`rounded-full border px-2 py-1 text-[9px] font-bold ${config.badge}`}
                                >
                                  {config.label}
                                </span>

                              </div>

                              <div className="mt-2 flex items-start gap-1.5">

                                <MapPin
                                  size={13}
                                  className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <p className="text-[10px] text-slate-400">

                                  {Number.isFinite(
                                    road.latitude
                                  ) &&
                                  Number.isFinite(
                                    road.longitude
                                  )
                                    ? `${road.latitude.toFixed(
                                        4
                                      )}, ${road.longitude.toFixed(
                                        4
                                      )}`
                                    : "Location unavailable"}

                                </p>

                              </div>

                              <p className="mt-2 line-clamp-2 text-[10px] text-slate-400">
                                {road.reason}
                              </p>

                              <div className="mt-3 flex items-center justify-between">

                                <span className="flex items-center gap-1 text-[9px] text-slate-400">

                                  <Clock
                                    size={11}
                                  />

                                  {formatDate(
                                    road.updatedAt
                                  )}

                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedRoad(
                                      road
                                    )
                                  }
                                  className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-2 text-[9px] font-bold text-blue-500 transition hover:bg-blue-500/20"
                                >

                                  <Eye
                                    size={13}
                                  />

                                  Details

                                </button>

                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          </section>

          {/* =================================================
              SAFETY INFORMATION
          ================================================= */}

          <div
            className={`mt-5 flex gap-3 rounded-xl border p-4 ${
              darkMode
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-white"
            }`}
          >

            <ShieldAlert
              size={19}
              className="mt-0.5 shrink-0 text-orange-500"
            />

            <div>

              <p className="text-xs font-semibold">
                Travel Safety
              </p>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                Avoid blocked roads and
                follow official safety
                instructions during
                landslides, floods and
                severe weather conditions.
              </p>

            </div>

          </div>

        </div>
      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedRoad && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[10px] text-slate-400">
                  Road Information
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {selectedRoad.name}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRoad(null)
                }
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <X size={17} />
              </button>

            </div>

            {/* STATUS */}

            <div className="mt-5">

              {(() => {
                const config =
                  getStatusConfig(
                    selectedRoad.status
                  );

                const Icon =
                  config.icon;

                return (
                  <div
                    className={`flex items-center gap-3 rounded-xl border p-3 ${config.badge}`}
                  >

                    <Icon size={21} />

                    <div>

                      <p className="text-xs font-bold">
                        Road{" "}
                        {config.label}
                      </p>

                      <p className="mt-0.5 text-[9px] opacity-80">
                        Current reported
                        status
                      </p>

                    </div>

                  </div>
                );
              })()}

            </div>

            {/* DETAILS */}

            <div className="mt-5 space-y-4">

              <DetailRow
                icon={
                  <MapPin size={14} />
                }
                label="Coordinates"
                value={
                  Number.isFinite(
                    selectedRoad.latitude
                  ) &&
                  Number.isFinite(
                    selectedRoad.longitude
                  )
                    ? `${selectedRoad.latitude}, ${selectedRoad.longitude}`
                    : "Not available"
                }
              />

              <DetailRow
                icon={
                  <AlertTriangle
                    size={14}
                  />
                }
                label="Reason / Report"
                value={
                  selectedRoad.reason
                }
              />

              <DetailRow
                icon={
                  <Clock size={14} />
                }
                label="Last Updated"
                value={formatDate(
                  selectedRoad.updatedAt
                )}
              />

              <DetailRow
                icon={
                  <ShieldAlert
                    size={14}
                  />
                }
                label="Reported By"
                value={
                  selectedRoad.reportedBy
                }
              />

            </div>

            {/* BUTTONS */}

            <div className="mt-5 grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() =>
                  openMap(
                    selectedRoad
                  )
                }
                disabled={
                  !Number.isFinite(
                    selectedRoad.latitude
                  ) ||
                  !Number.isFinite(
                    selectedRoad.longitude
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <Navigation
                  size={14}
                />

                View on Map

              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedRoad(
                    null
                  )
                }
                className={`rounded-xl py-2.5 text-xs font-semibold ${
                  darkMode
                    ? "bg-white/5 text-slate-300 hover:bg-white/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================

const RoadStat = ({
  icon,
  value,
  label,
  color,
  bg,
  darkMode,
}) => {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        darkMode
          ? "border-white/10 bg-[#0c2119]"
          : "border-slate-200 bg-white"
      }`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-lg font-bold">
            {value}
          </p>

          <p className="text-[9px] text-slate-400">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
};

// ============================================================
// DETAIL ROW
// ============================================================

const DetailRow = ({
  icon,
  label,
  value,
}) => {
  return (
    <div>

      <div className="flex items-center gap-1.5 text-slate-400">

        {icon}

        <p className="text-[9px] font-semibold">
          {label}
        </p>

      </div>

      <p className="mt-1 text-xs font-semibold leading-relaxed">
        {value || "Not available"}
      </p>

    </div>
  );
};

// ============================================================
// LEGEND
// ============================================================

const Legend = ({
  color,
  label,
}) => {
  return (
    <div className="flex items-center gap-1.5">

      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      <span className="text-[8px] text-slate-400">
        {label}
      </span>

    </div>
  );
};

export default CitizenRoads;

