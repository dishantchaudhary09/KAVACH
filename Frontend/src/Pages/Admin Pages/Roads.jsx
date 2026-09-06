import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Search,
  Route,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  X,
  Plus,
  RefreshCw,
  Construction,
  Pencil,
  Trash2,
  Navigation,
  ShieldAlert,
} from "lucide-react";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

import {
  fetchAdminRoads,
  createAdminRoad,
  updateAdminRoad,
  deleteAdminRoad,
  clearAdminRoadError,
  clearAdminRoadSuccess,
} from "../../Redux/Admin Slices/roadSlice.js";

const AdminRoads = () => {
  const dispatch = useDispatch();

  // =========================================================
  // DARK MODE
  // =========================================================

  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  // =========================================================
  // REDUX STATE
  // =========================================================

  const roadState = useSelector(
    (state) =>
      state.adminRoad || {
        roads: [],
        loading: false,
        creating: false,
        updating: false,
        deleting: false,
        error: null,
        createError: null,
        updateError: null,
        deleteError: null,
        successMessage: null,
      },
  );

  const {
    roads = [],
    loading = false,
    creating = false,
    updating = false,
    deleting = false,
    error = null,
    createError = null,
    updateError = null,
    deleteError = null,
    successMessage = null,
  } = roadState;

  // =========================================================
  // LOCAL STATE
  // =========================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [selectedRoad, setSelectedRoad] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    roadName: "",
    location: "",
    status: "open",
    reason: "",
    latitude: "",
    longitude: "",
  });

  // =========================================================
  // FETCH DATA
  // =========================================================

  useEffect(() => {
    dispatch(fetchAdminRoads());
  }, [dispatch]);

  // =========================================================
  // CLEAR SUCCESS MESSAGE
  // =========================================================

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearAdminRoadSuccess());
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  // =========================================================
  // NORMALIZE ROAD
  // =========================================================

  const normalizedRoads = useMemo(() => {
    if (!Array.isArray(roads)) {
      return [];
    }

    return roads.map((road) => {
      const latitude = road?.location?.latitude ?? road?.latitude ?? null;

      const longitude = road?.location?.longitude ?? road?.longitude ?? null;

      /*
       * IMPORTANT:
       * location from backend is an OBJECT.
       *
       * We convert it into a STRING before
       * rendering it in JSX.
       */

      let locationText = "Unknown Location";

      if (road?.location && typeof road.location === "object") {
        if (road.location.name) {
          locationText = String(road.location.name);
        } else if (latitude !== null && longitude !== null) {
          locationText = `${latitude}, ${longitude}`;
        }
      } else if (
        road?.location !== null &&
        road?.location !== undefined &&
        road?.location !== ""
      ) {
        locationText = String(road.location);
      } else if (road?.locationName) {
        locationText = String(road.locationName);
      }

      // Normalize status
      const status = String(road?.status || "open")
        .toLowerCase()
        .trim();

      // Normalize reason
      const reason =
        road?.reason ||
        road?.report ||
        road?.description ||
        road?.remarks ||
        "No report available.";

      // Normalize reportedBy
      let reportedBy = "Monitoring Team";

      if (road?.reportedBy && typeof road.reportedBy === "object") {
        reportedBy =
          road.reportedBy.name || road.reportedBy.email || "Monitoring Team";
      } else if (road?.reportedBy) {
        reportedBy = String(road.reportedBy);
      }

      return {
        ...road,

        id: road?._id || road?.id || road?.roadId || "N/A",

        name: road?.roadName || road?.name || "Unnamed Road",

        location: locationText,

        latitude: latitude !== null ? Number(latitude) : null,

        longitude: longitude !== null ? Number(longitude) : null,

        status,

        reason: String(reason),

        reportedBy,

        lastUpdated: road?.updatedAt || road?.createdAt || null,
      };
    });
  }, [roads]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    return {
      total: normalizedRoads.length,

      open: normalizedRoads.filter((road) => road.status === "open").length,

      blocked: normalizedRoads.filter((road) => road.status === "blocked")
        .length,

      damaged: normalizedRoads.filter((road) => road.status === "damaged")
        .length,

      maintenance: normalizedRoads.filter(
        (road) => road.status === "under_maintenance",
      ).length,
    };
  }, [normalizedRoads]);

  // =========================================================
  // FILTERED ROADS
  // =========================================================

  const filteredRoads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedRoads.filter((road) => {
      const matchesFilter = filter === "all" || road.status === filter;

      const matchesSearch =
        !query ||
        road.name.toLowerCase().includes(query) ||
        road.location.toLowerCase().includes(query) ||
        road.reason.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [normalizedRoads, search, filter]);

  // =========================================================
  // STATUS CONFIG
  // =========================================================

  const getStatusConfig = (status) => {
    switch (status) {
      case "open":
        return {
          label: "Open",
          icon: CheckCircle,
          badge: "bg-green-500/10 text-green-500 border-green-500/20",
          iconBg: "bg-green-500/10 text-green-500",
        };

      case "blocked":
        return {
          label: "Blocked",
          icon: ShieldAlert,
          badge: "bg-red-500/10 text-red-500 border-red-500/20",
          iconBg: "bg-red-500/10 text-red-500",
        };

      case "damaged":
        return {
          label: "Damaged",
          icon: AlertTriangle,
          badge: "bg-orange-500/10 text-orange-500 border-orange-500/20",
          iconBg: "bg-orange-500/10 text-orange-500",
        };

      case "under_maintenance":
        return {
          label: "Under Maintenance",
          icon: Construction,
          badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          iconBg: "bg-blue-500/10 text-blue-500",
        };

      default:
        return {
          label: "Unknown",
          icon: Route,
          badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
          iconBg: "bg-slate-500/10 text-slate-500",
        };
    }
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Not available";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      roadName: "",
      location: "",
      status: "open",
      reason: "",
      latitude: "",
      longitude: "",
    });
  };

  // =========================================================
  // ADD MODAL
  // =========================================================

  const openAddModal = () => {
    dispatch(clearAdminRoadError());

    resetForm();

    setSelectedRoad(null);
    setShowAddModal(true);
  };

  // =========================================================
  // EDIT MODAL
  // =========================================================

  const openEditModal = (road) => {
    dispatch(clearAdminRoadError());

    setFormData({
      roadName: road?.name || "",

      location: road?.location || "",

      status: road?.status || "open",

      reason: road?.reason || "",

      latitude: road?.latitude ?? "",

      longitude: road?.longitude ?? "",
    });

    setSelectedRoad(road);

    setShowEditModal(true);
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE ROAD
  // =========================================================

  const handleCreateRoad = async (e) => {
    e.preventDefault();

    dispatch(clearAdminRoadError());

    const roadName = formData.roadName.trim();

    const reason = formData.reason.trim();

    const latitude = Number(formData.latitude);

    const longitude = Number(formData.longitude);

    // Validation

    if (!roadName) {
      alert("Road name is required.");
      return;
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      alert("Valid latitude and longitude are required.");
      return;
    }

    if (latitude < -90 || latitude > 90) {
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (longitude < -180 || longitude > 180) {
      alert("Longitude must be between -180 and 180.");
      return;
    }

    if (!reason) {
      alert("Reason / report is required.");
      return;
    }

    /*
     * IMPORTANT:
     * This payload exactly matches
     * your current backend.
     */

    const payload = {
      roadName,
      latitude,
      longitude,
      status: formData.status,
      reason,
    };

    console.log("Creating road:", payload);

    const result = await dispatch(createAdminRoad(payload));

    if (createAdminRoad.fulfilled.match(result)) {
      setShowAddModal(false);

      resetForm();

      await dispatch(fetchAdminRoads());
    }
  };

  // =========================================================
  // UPDATE ROAD
  // =========================================================

  const handleUpdateRoad = async (e) => {
    e.preventDefault();

    if (!selectedRoad?.id) {
      return;
    }

    dispatch(clearAdminRoadError());

    const reason = formData.reason.trim();

    if (!reason) {
      alert("Reason / report is required.");
      return;
    }

    /*
     * Your current backend update
     * controller supports:
     *
     * status
     * reason
     *
     * It does NOT update:
     * roadName
     * latitude
     * longitude
     */

    const payload = {
      status: formData.status,
      reason,
    };

    console.log("Updating road:", selectedRoad.id, payload);

    const result = await dispatch(
      updateAdminRoad({
        roadId: selectedRoad.id,

        roadData: payload,
      }),
    );

    if (updateAdminRoad.fulfilled.match(result)) {
      setShowEditModal(false);

      setSelectedRoad(null);

      resetForm();

      await dispatch(fetchAdminRoads());
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteRoad = async (road) => {
    if (!road?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${road.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deleteAdminRoad(road.id));

    if (deleteAdminRoad.fulfilled.match(result)) {
      setSelectedRoad(null);

      await dispatch(fetchAdminRoads());
    }
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    dispatch(clearAdminRoadError());

    dispatch(fetchAdminRoads());
  };

  // =========================================================
  // GOOGLE MAP
  // =========================================================

  const openMap = (road) => {
    const lat = Number(road?.latitude);

    const lng = Number(road?.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      alert("Location coordinates are not available.");
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  // =========================================================
  // ERROR
  // =========================================================

  const pageError = error || createError || updateError || deleteError;

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#07140f] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <AdminNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="pt-[68px] lg:pl-64">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {/* HEADER */}

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Route size={24} className="text-blue-500" />

                <h1 className="text-xl font-bold sm:text-2xl">
                  Road Monitoring
                </h1>
              </div>

              <p
                className={`mt-1 text-xs sm:text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Monitor and manage road conditions across the region.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Road
              </button>
            </div>
          </div>

          {/* SUCCESS */}

          {successMessage && (
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-xs font-semibold text-green-500">
              {String(successMessage)}
            </div>
          )}

          {/* ERROR */}

          {pageError && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-500">
              <span>
                {typeof pageError === "string"
                  ? pageError
                  : pageError?.message || "Something went wrong."}
              </span>

              <button
                type="button"
                onClick={() => dispatch(clearAdminRoadError())}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Route size={20} />}
              title="Total Roads"
              value={stats.total}
              iconClass="text-blue-500"
              bgClass="bg-blue-500/10"
              darkMode={darkMode}
            />

            <StatCard
              icon={<CheckCircle size={20} />}
              title="Open"
              value={stats.open}
              iconClass="text-green-500"
              bgClass="bg-green-500/10"
              darkMode={darkMode}
            />

            <StatCard
              icon={<AlertTriangle size={20} />}
              title="Blocked / Damaged"
              value={stats.blocked + stats.damaged}
              iconClass="text-orange-500"
              bgClass="bg-orange-500/10"
              darkMode={darkMode}
            />

            <StatCard
              icon={<Construction size={20} />}
              title="Maintenance"
              value={stats.maintenance}
              iconClass="text-blue-500"
              bgClass="bg-blue-500/10"
              darkMode={darkMode}
            />
          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <section
            className={`mb-6 rounded-2xl border p-4 ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search road name, location or report..."
                  className={`h-10 w-full rounded-xl border pl-9 pr-3 text-xs outline-none focus:border-blue-500 ${
                    darkMode
                      ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {[
                  {
                    value: "all",
                    label: "All",
                  },
                  {
                    value: "open",
                    label: "Open",
                  },
                  {
                    value: "blocked",
                    label: "Blocked",
                  },
                  {
                    value: "damaged",
                    label: "Damaged",
                  },
                  {
                    value: "under_maintenance",
                    label: "Maintenance",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-semibold ${
                      filter === item.value
                        ? "bg-blue-600 text-white"
                        : darkMode
                          ? "bg-white/[0.05] text-slate-400 hover:text-white"
                          : "bg-slate-100 text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================
              ROAD LIST
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
                <h2 className="text-sm font-bold">Road Records</h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Current road status information.
                </p>
              </div>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[9px] font-bold text-blue-500">
                {filteredRoads.length} records
              </span>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="py-16 text-center">
                  <RefreshCw
                    size={30}
                    className="mx-auto animate-spin text-blue-500"
                  />

                  <p className="mt-3 text-sm font-semibold">Loading roads...</p>
                </div>
              ) : filteredRoads.length === 0 ? (
                <div className="py-16 text-center">
                  <Route size={36} className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm font-semibold">No roads found</p>

                  <p className="mt-1 text-xs text-slate-400">
                    {roads.length === 0
                      ? "No road records are available."
                      : "Try another search or filter."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {filteredRoads.map((road) => {
                    const config = getStatusConfig(road.status);

                    const StatusIcon = config.icon;

                    return (
                      <div
                        key={road.id}
                        className={`rounded-xl border p-4 transition hover:shadow-md ${
                          darkMode
                            ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                            : "border-slate-200 bg-slate-50 hover:bg-white"
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* STATUS ICON */}

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
                          >
                            <StatusIcon size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold">{road.name}</h3>

                              <span
                                className={`rounded-full border px-2 py-1 text-[9px] font-bold ${config.badge}`}
                              >
                                {config.label}
                              </span>
                            </div>

                            {/* LOCATION */}

                            <div className="mt-2 flex items-start gap-1.5">
                              <MapPin
                                size={13}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />

                              <p className="text-[10px] text-slate-400">
                                {String(road.location)}
                              </p>
                            </div>

                            {/* REASON */}

                            <p className="mt-2 line-clamp-2 text-[10px] text-slate-400">
                              {String(road.reason)}
                            </p>

                            {/* FOOTER */}

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <span className="flex items-center gap-1 text-[9px] text-slate-400">
                                <Clock size={11} />

                                {formatDate(road.lastUpdated)}
                              </span>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => openMap(road)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                  title="View on map"
                                >
                                  <Navigation size={14} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedRoad(road)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                  title="View details"
                                >
                                  <Eye size={15} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* INFO */}

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
              <p className="text-xs font-semibold">Road Safety</p>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                Monitor blocked and damaged roads carefully during heavy
                rainfall, landslides and other hazardous conditions.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedRoad && !showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-5 shadow-2xl ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Road Details</p>

                <h2 className="mt-1 text-lg font-bold">{selectedRoad.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRoad(null)}
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
                const config = getStatusConfig(selectedRoad.status);

                const Icon = config.icon;

                return (
                  <div
                    className={`flex items-center gap-3 rounded-xl border p-3 ${config.badge}`}
                  >
                    <Icon size={21} />

                    <div>
                      <p className="text-xs font-bold">{config.label}</p>

                      <p className="mt-0.5 text-[9px] opacity-80">
                        Current road status
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* DETAILS */}

            <div className="mt-5 space-y-4">
              <Detail label="Road Name" value={selectedRoad.name} />

              <Detail label="Location" value={selectedRoad.location} />

              <Detail label="Latitude" value={selectedRoad.latitude} />

              <Detail label="Longitude" value={selectedRoad.longitude} />

              <Detail
                label="Status"
                value={getStatusConfig(selectedRoad.status).label}
              />

              <Detail label="Reason / Report" value={selectedRoad.reason} />

              <Detail label="Reported By" value={selectedRoad.reportedBy} />

              <Detail
                label="Last Updated"
                value={formatDate(selectedRoad.lastUpdated)}
              />
            </div>

            {/* ACTIONS */}

            <div className="mt-6 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => openMap(selectedRoad)}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-xs font-semibold text-white hover:bg-green-700"
              >
                <Navigation size={14} />
                Map
              </button>

              <button
                type="button"
                onClick={() => openEditModal(selectedRoad)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Pencil size={14} />
                Edit
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteRoad(selectedRoad)}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD MODAL
      ===================================================== */}

      {showAddModal && (
        <RoadFormModal
          darkMode={darkMode}
          title="Add Road"
          formData={formData}
          handleChange={handleChange}
          onClose={() => {
            setShowAddModal(false);

            resetForm();

            dispatch(clearAdminRoadError());
          }}
          onSubmit={handleCreateRoad}
          loading={creating}
        />
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showEditModal && (
        <RoadFormModal
          darkMode={darkMode}
          title="Edit Road"
          formData={formData}
          handleChange={handleChange}
          onClose={() => {
            setShowEditModal(false);

            setSelectedRoad(null);

            resetForm();

            dispatch(clearAdminRoadError());
          }}
          onSubmit={handleUpdateRoad}
          loading={updating}
          isEdit
        />
      )}
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({ icon, title, value, iconClass, bgClass, darkMode }) => {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        darkMode ? "border-white/10 bg-[#0c2119]" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgClass} ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xl font-bold">{value}</p>

          <p className="text-[10px] text-slate-400">{title}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DETAIL
// ============================================================

const Detail = ({ label, value }) => {
  /*
   * Extra safety:
   * Even if an object accidentally reaches
   * this component, React will not crash.
   */

  let displayValue = value;

  if (value !== null && typeof value === "object") {
    if (value.latitude !== undefined && value.longitude !== undefined) {
      displayValue = `${value.latitude}, ${value.longitude}`;
    } else {
      displayValue = JSON.stringify(value);
    }
  }

  return (
    <div>
      <p className="text-[10px] font-medium text-slate-400">{label}</p>

      <p className="mt-1 break-words text-xs font-semibold">
        {displayValue !== null &&
        displayValue !== undefined &&
        displayValue !== ""
          ? String(displayValue)
          : "Not available"}
      </p>
    </div>
  );
};

// ============================================================
// ROAD FORM MODAL
// ============================================================

const RoadFormModal = ({
  darkMode,
  title,
  formData,
  handleChange,
  onClose,
  onSubmit,
  loading,
  isEdit = false,
}) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-5 shadow-2xl ${
          darkMode
            ? "border-white/10 bg-[#0c2119]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400">Road Management</p>

            <h2 className="mt-1 text-lg font-bold">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              darkMode
                ? "bg-white/5 hover:bg-white/10"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            <X size={17} />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          {/* ROAD NAME */}

          <Input
            label="Road Name"
            name="roadName"
            value={formData.roadName}
            onChange={handleChange}
            placeholder="e.g. NH-306"
            darkMode={darkMode}
            required
          />

          {/* LOCATION */}

          <Input
            label="Location Name"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Aizawl, Mizoram"
            darkMode={darkMode}
          />

          {/* STATUS */}

          <Select
            label="Road Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            darkMode={darkMode}
          />

          {/* REASON */}

          <div>
            <label className="mb-1 block text-[10px] font-semibold text-slate-400">
              Reason / Report
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Enter road condition or reason..."
              className={`w-full resize-none rounded-xl border px-3 py-2.5 text-xs outline-none focus:border-blue-500 ${
                darkMode
                  ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                  : "border-slate-200 bg-slate-50 text-slate-900"
              }`}
            />
          </div>

          {/* COORDINATES */}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />

              <p className="text-[10px] font-semibold">Coordinates</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="25.5000"
                type="number"
                step="any"
                darkMode={darkMode}
                required
              />

              <Input
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="93.5000"
                type="number"
                step="any"
                darkMode={darkMode}
                required
              />
            </div>
          </div>

          {/* BACKEND INFO */}

          <div
            className={`rounded-xl border p-3 ${
              darkMode
                ? "border-blue-500/20 bg-blue-500/5"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <p className="text-[10px] font-semibold text-blue-500">
              Required fields
            </p>

            <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
              Road name, latitude, longitude, status and reason are required.
            </p>
          </div>

          {/* BUTTONS */}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 rounded-xl py-2.5 text-xs font-semibold ${
                darkMode
                  ? "bg-white/5 text-slate-300 hover:bg-white/10"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                  ? "Update Road"
                  : "Add Road"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// INPUT
// ============================================================

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  darkMode,
  type = "text",
  required = false,
  step,
}) => {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold text-slate-400">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        className={`h-10 w-full rounded-xl border px-3 text-xs outline-none focus:border-blue-500 ${
          darkMode
            ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
            : "border-slate-200 bg-slate-50 text-slate-900"
        }`}
      />
    </div>
  );
};

// ============================================================
// SELECT
// ============================================================

const Select = ({ label, name, value, onChange, darkMode }) => {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold text-slate-400">
        {label}

        <span className="ml-1 text-red-500">*</span>
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`h-10 w-full rounded-xl border px-3 text-xs outline-none focus:border-blue-500 ${
          darkMode
            ? "border-white/10 bg-[#07140f] text-white"
            : "border-slate-200 bg-slate-50 text-slate-900"
        }`}
      >
        <option value="open">Open</option>

        <option value="blocked">Blocked</option>

        <option value="damaged">Damaged</option>

        <option value="under_maintenance">Under Maintenance</option>
      </select>
    </div>
  );
};

export default AdminRoads;
