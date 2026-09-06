import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Search,
  Eye,
  X,
  MapPin,
  Send,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

import {
  fetchAdminAlerts,
  fetchAdminAlertById,
  createAdminAlert,
  updateAdminAlert,
  deleteAdminAlert,
  clearAdminAlertError,
  clearSelectedAlert,
} from "../../Redux/Admin Slices/alertSlice.js";

const AdminAlerts = () => {
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.theme?.darkMode ?? true);

  const {
    alerts = [],
    selectedAlert = null,
    loading = false,
    detailsLoading = false,
    creating = false,
    updating = false,
    deleting = false,
    error = null,
    detailsError = null,
    createError = null,
    updateError = null,
    deleteError = null,
  } = useSelector((state) => state.adminAlerts || {});

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    alertType: "general",
    severity: "medium",
    location: "",
    expiresAt: "",
  });

  // =====================================================
  // FETCH ALERTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchAdminAlerts());

    return () => {
      dispatch(clearSelectedAlert());
    };
  }, [dispatch]);

  // =====================================================
  // NORMALIZE
  // =====================================================

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredAlerts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return alerts.filter((alert) => {
      const severity = normalize(alert.severity);
      const status = normalize(alert.status);

      let matchesFilter = true;

      if (filter !== "All") {
        const selectedFilter = normalize(filter);

        matchesFilter =
          severity === selectedFilter || status === selectedFilter;
      }

      const matchesSearch =
        !searchText ||
        normalize(alert.title).includes(searchText) ||
        normalize(alert.message).includes(searchText) ||
        normalize(alert.location).includes(searchText) ||
        normalize(alert.alertType).includes(searchText) ||
        normalize(alert._id).includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [alerts, filter, search]);

  // =====================================================
  // STATS
  // =====================================================

  const stats = useMemo(() => {
    return {
      total: alerts.length,

      active: alerts.filter((alert) => normalize(alert.status) === "active")
        .length,

      medium: alerts.filter((alert) => normalize(alert.severity) === "medium")
        .length,

      expired: alerts.filter((alert) => normalize(alert.status) === "expired")
        .length,
    };
  }, [alerts]);

  // =====================================================
  // VIEW ALERT
  // =====================================================

  const handleViewAlert = async (alert) => {
    if (!alert?._id) return;

    dispatch(clearAdminAlertError());

    setSelectedAlertId(alert._id);

    await dispatch(fetchAdminAlertById(alert._id));
  };

  // =====================================================
  // CLOSE VIEW
  // =====================================================

  const closeViewModal = () => {
    setSelectedAlertId(null);
    dispatch(clearSelectedAlert());
    dispatch(clearAdminAlertError());
  };

  // =====================================================
  // CLOSE CREATE
  // =====================================================

  const closeCreateModal = () => {
    if (creating) return;

    setShowCreateAlert(false);

    setForm({
      title: "",
      message: "",
      alertType: "general",
      severity: "medium",
      location: "",
      expiresAt: "",
    });

    dispatch(clearAdminAlertError());
  };

  // =====================================================
  // FORM
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE ALERT
  // =====================================================

  const handleCreateAlert = async (e) => {
    e.preventDefault();

    const title = form.title.trim();
    const message = form.message.trim();
    const location = form.location.trim();

    if (!title || !message) return;

    const alertData = {
      title,
      message,
      alertType: form.alertType,
      severity: form.severity,
      location,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };

    const result = await dispatch(createAdminAlert(alertData));

    if (createAdminAlert.fulfilled.match(result)) {
      setForm({
        title: "",
        message: "",
        alertType: "general",
        severity: "medium",
        location: "",
        expiresAt: "",
      });

      setShowCreateAlert(false);

      dispatch(fetchAdminAlerts());
    }
  };

  // =====================================================
  // MARK EXPIRED
  // =====================================================

  const handleMarkExpired = async () => {
    if (!selectedAlert?._id || updating) return;

    const result = await dispatch(
      updateAdminAlert({
        alertId: selectedAlert._id,
        alertData: {
          status: "expired",
        },
      }),
    );

    if (updateAdminAlert.fulfilled.match(result)) {
      dispatch(fetchAdminAlerts());
      closeViewModal();
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDeleteAlert = async () => {
    if (!selectedAlert?._id || deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this alert?",
    );

    if (!confirmed) return;

    const result = await dispatch(deleteAdminAlert(selectedAlert._id));

    if (deleteAdminAlert.fulfilled.match(result)) {
      dispatch(fetchAdminAlerts());
      closeViewModal();
    }
  };

  // =====================================================
  // SEND AGAIN
  // =====================================================

  const handleSendAgain = async () => {
    if (!selectedAlert || creating) return;

    const alertData = {
      title: selectedAlert.title || "",
      message: selectedAlert.message || "",
      alertType: selectedAlert.alertType || "general",
      severity: selectedAlert.severity || "medium",
      location: selectedAlert.location || "",
      latitude: selectedAlert.latitude ?? null,
      longitude: selectedAlert.longitude ?? null,
      expiresAt: null,
    };

    const result = await dispatch(createAdminAlert(alertData));

    if (createAdminAlert.fulfilled.match(result)) {
      dispatch(fetchAdminAlerts());
      closeViewModal();
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    dispatch(clearAdminAlertError());

    await dispatch(fetchAdminAlerts());
  };

  // =====================================================
  // SEVERITY
  // =====================================================

  const getSeverityStyle = (severity) => {
    switch (normalize(severity)) {
      case "critical":
      case "high":
        return darkMode
          ? "bg-red-500/10 text-red-400 border-red-500/20"
          : "bg-red-50 text-red-600 border-red-200";

      case "medium":
        return darkMode
          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
          : "bg-amber-50 text-amber-600 border-amber-200";

      case "low":
        return darkMode
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-green-50 text-green-600 border-green-200";

      default:
        return darkMode
          ? "bg-white/5 text-slate-400 border-white/10"
          : "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusStyle = (status) => {
    switch (normalize(status)) {
      case "active":
        return darkMode
          ? "bg-red-500/10 text-red-400 border-red-500/20"
          : "bg-red-50 text-red-600 border-red-200";

      case "expired":
        return darkMode
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-green-50 text-green-600 border-green-200";

      default:
        return darkMode
          ? "bg-white/5 text-slate-400 border-white/10"
          : "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // ERROR
  // =====================================================

  const currentError =
    error || detailsError || createError || updateError || deleteError || null;

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div
      className={`
        min-h-screen
        transition-colors
        duration-300
        ${darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"}
      `}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="pt-[68px] lg:ml-[250px]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {/* HEADER */}

          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Bell
                  size={23}
                  className={darkMode ? "text-green-400" : "text-green-600"}
                />

                <h1 className="text-xl font-bold sm:text-2xl">Alerts</h1>
              </div>

              <p
                className={`
                  mt-1 text-xs sm:text-sm
                  ${darkMode ? "text-slate-400" : "text-slate-500"}
                `}
              >
                Monitor and manage emergency alerts for citizens.
              </p>
            </div>

            <div className="flex gap-2">
              {/* REFRESH */}

              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`
                  flex items-center gap-2
                  rounded-xl
                  border
                  px-4 py-2.5
                  text-xs
                  font-semibold
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  ${
                    darkMode
                      ? "border-white/10 bg-[#07140f] text-slate-200 hover:bg-[#143326]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              {/* CREATE */}

              <button
                onClick={() => {
                  dispatch(clearAdminAlertError());

                  setShowCreateAlert(true);
                }}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-green-700
                "
              >
                <Plus size={16} />
                Create Alert
              </button>
            </div>
          </div>

          {/* ERROR */}

          {currentError && (
            <div
              className={`
                mb-5
                flex
                items-start
                justify-between
                gap-3
                rounded-xl
                border
                px-4
                py-3
                text-xs
                ${
                  darkMode
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-red-200 bg-red-50 text-red-600"
                }
              `}
            >
              <span className="break-words">{currentError}</span>

              <button
                onClick={() => dispatch(clearAdminAlertError())}
                className="shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* =====================================================
              STATS
          ===================================================== */}

          <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AlertStat
              icon={<Bell size={21} />}
              value={stats.total}
              title="Total Alerts"
              iconColor={darkMode ? "text-green-400" : "text-green-600"}
              iconBg={darkMode ? "bg-green-500/10" : "bg-green-50"}
              darkMode={darkMode}
            />

            <AlertStat
              icon={<AlertTriangle size={21} />}
              value={stats.active}
              title="Active Alerts"
              iconColor={darkMode ? "text-red-400" : "text-red-600"}
              iconBg="bg-red-500/10"
              darkMode={darkMode}
            />

            <AlertStat
              icon={<AlertTriangle size={21} />}
              value={stats.medium}
              title="Medium Alerts"
              iconColor={darkMode ? "text-amber-400" : "text-amber-600"}
              iconBg="bg-amber-500/10"
              darkMode={darkMode}
            />

            <AlertStat
              icon={<CheckCircle size={21} />}
              value={stats.expired}
              title="Expired"
              iconColor={darkMode ? "text-green-400" : "text-green-600"}
              iconBg={darkMode ? "bg-green-500/10" : "bg-green-50"}
              darkMode={darkMode}
            />
          </div>

          {/* =====================================================
              ALERT PANEL
          ===================================================== */}

          <section
            className={`
              overflow-hidden
              rounded-2xl
              border
              shadow-xl
              ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            {/* SEARCH + FILTER */}

            <div
              className={`
                border-b
                p-4
                ${darkMode ? "border-white/10" : "border-slate-200"}
              `}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* SEARCH */}

                <div className="relative w-full lg:max-w-[340px]">
                  <Search
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search alerts..."
                    className={`
                      h-10
                      w-full
                      rounded-xl
                      border
                      pl-9
                      pr-3
                      text-xs
                      outline-none
                      transition
                      focus:border-green-500
                      ${
                        darkMode
                          ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                          : "border-slate-200 bg-slate-50 text-slate-900"
                      }
                    `}
                  />
                </div>

                {/* FILTER */}

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {["All", "High", "Medium", "Low", "Active", "Expired"].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`
                        whitespace-nowrap
                        rounded-lg
                        px-3
                        py-2
                        text-[10px]
                        font-semibold
                        transition
                        ${
                          filter === item
                            ? darkMode
                              ? "bg-green-600 text-white"
                              : "bg-green-600 text-white"
                            : darkMode
                              ? "bg-[#07140f] text-slate-400 hover:bg-[#143326] hover:text-white"
                              : "bg-slate-100 text-slate-500 hover:text-slate-900"
                        }
                      `}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* ALERT LIST */}

            <div className="p-4">
              {loading ? (
                <div className="py-14 text-center">
                  <RefreshCw
                    size={32}
                    className={`
                      mx-auto animate-spin
                      ${darkMode ? "text-green-400" : "text-green-600"}
                    `}
                  />

                  <p className="mt-3 text-sm font-semibold">
                    Loading alerts...
                  </p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell size={35} className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm font-semibold">No alerts found</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try changing the search or filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => {
                    const severity = normalize(alert.severity);

                    return (
                      <div
                        key={alert._id}
                        className={`
                          rounded-xl
                          border
                          p-4
                          transition
                          hover:shadow-md
                          ${
                            darkMode
                              ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
                              : "border-slate-200 bg-slate-50 hover:bg-white"
                          }
                        `}
                      >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                          {/* LEFT */}

                          <div className="flex min-w-0 flex-1 gap-3">
                            {/* ICON */}

                            <div
                              className={`
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                ${
                                  severity === "high" || severity === "critical"
                                    ? "bg-red-500/10 text-red-400"
                                    : severity === "medium"
                                      ? "bg-amber-500/10 text-amber-400"
                                      : "bg-green-500/10 text-green-400"
                                }
                              `}
                            >
                              <AlertTriangle size={21} />
                            </div>

                            {/* CONTENT */}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="break-words text-sm font-bold">
                                  {alert.title || "Untitled Alert"}
                                </h3>

                                <span
                                  className={`
                                    rounded-full
                                    border
                                    px-2
                                    py-1
                                    text-[9px]
                                    font-bold
                                    ${getSeverityStyle(alert.severity)}
                                  `}
                                >
                                  {String(
                                    alert.severity || "low",
                                  ).toUpperCase()}
                                </span>

                                <span
                                  className={`
                                    rounded-full
                                    border
                                    px-2
                                    py-1
                                    text-[9px]
                                    font-bold
                                    ${getStatusStyle(alert.status)}
                                  `}
                                >
                                  {String(
                                    alert.status || "active",
                                  ).toUpperCase()}
                                </span>
                              </div>

                              <p
                                className={`
                                  mt-1
                                  line-clamp-2
                                  text-xs
                                  ${
                                    darkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  }
                                `}
                              >
                                {alert.message || "No message available."}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-4">
                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <MapPin size={12} />

                                  {alert.location || "Location not specified"}
                                </span>

                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <Clock size={12} />

                                  {formatDate(alert.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT */}

                          <div className="flex items-center justify-between gap-4 xl:justify-end">
                            <div className="text-right">
                              <p className="text-[9px] text-slate-400">
                                Alert ID
                              </p>

                              <p className="max-w-[150px] truncate text-xs font-bold">
                                {alert._id || "—"}
                              </p>
                            </div>

                            <button
                              onClick={() => handleViewAlert(alert)}
                              title="View Alert"
                              className={`
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                transition
                                ${
                                  darkMode
                                    ? "bg-[#143326] text-green-400 hover:bg-green-500/20"
                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                }
                              `}
                            >
                              <Eye size={17} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* =====================================================
          VIEW ALERT MODAL
      ===================================================== */}

      {selectedAlertId && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className={`
              my-auto
              w-full
              max-w-lg
              rounded-2xl
              border
              p-5
              shadow-2xl
              ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            {detailsLoading ? (
              <div className="py-12 text-center">
                <RefreshCw
                  size={30}
                  className={`
                    mx-auto animate-spin
                    ${darkMode ? "text-green-400" : "text-green-600"}
                  `}
                />

                <p className="mt-3 text-sm font-semibold">Loading alert...</p>
              </div>
            ) : selectedAlert ? (
              <>
                {/* HEADER */}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400">Alert ID</p>

                    <h2 className="mt-1 break-all text-sm font-bold">
                      {selectedAlert._id}
                    </h2>
                  </div>

                  <button
                    onClick={closeViewModal}
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition
                      ${
                        darkMode
                          ? "bg-[#07140f] hover:bg-[#143326]"
                          : "bg-slate-100 hover:bg-slate-200"
                      }
                    `}
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* DETAILS */}

                <div className="mt-5 space-y-4">
                  <AlertDetail
                    label="Alert Title"
                    value={selectedAlert.title}
                    darkMode={darkMode}
                  />

                  {/* MESSAGE */}

                  <div>
                    <p className="text-[10px] text-slate-400">Message</p>

                    <div
                      className={`
                        mt-1
                        rounded-lg
                        border
                        p-3
                        ${
                          darkMode
                            ? "border-white/5 bg-[#07140f]"
                            : "border-slate-200 bg-slate-50"
                        }
                      `}
                    >
                      <p
                        className={`
                          whitespace-pre-wrap
                          text-xs
                          ${darkMode ? "text-slate-300" : "text-slate-600"}
                        `}
                      >
                        {selectedAlert.message || "No message available."}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS GRID */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AlertDetail
                      label="Location"
                      value={selectedAlert.location || "Not specified"}
                      darkMode={darkMode}
                    />

                    <AlertDetail
                      label="Severity"
                      value={selectedAlert.severity || "Not specified"}
                      darkMode={darkMode}
                    />

                    <AlertDetail
                      label="Alert Type"
                      value={selectedAlert.alertType || "general"}
                      darkMode={darkMode}
                    />

                    <AlertDetail
                      label="Status"
                      value={selectedAlert.status || "active"}
                      darkMode={darkMode}
                    />

                    <AlertDetail
                      label="Created"
                      value={formatDate(selectedAlert.createdAt)}
                      darkMode={darkMode}
                    />

                    <AlertDetail
                      label="Expires"
                      value={
                        selectedAlert.expiresAt
                          ? formatDate(selectedAlert.expiresAt)
                          : "No expiry"
                      }
                      darkMode={darkMode}
                    />
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:flex-wrap">
                    {normalize(selectedAlert.status) === "active" && (
                      <button
                        onClick={handleMarkExpired}
                        disabled={updating}
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-green-600
                          px-4
                          py-2.5
                          text-xs
                          font-semibold
                          text-white
                          transition
                          hover:bg-green-700
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <CheckCircle size={15} />

                        {updating ? "Updating..." : "Mark Expired"}
                      </button>
                    )}

                    <button
                      onClick={handleSendAgain}
                      disabled={creating}
                      className={`
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        ${
                          darkMode
                            ? "bg-[#143326] text-green-400 hover:bg-green-500/20"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }
                      `}
                    >
                      <Send size={15} />

                      {creating ? "Sending..." : "Send Again"}
                    </button>

                    <button
                      onClick={handleDeleteAlert}
                      disabled={deleting}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-red-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <Trash2 size={15} />

                      {deleting ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-center">
                <Bell size={35} className="mx-auto text-slate-400" />

                <p className="mt-3 text-sm font-semibold">
                  Alert details not available.
                </p>

                <button
                  onClick={closeViewModal}
                  className="
                    mt-4
                    rounded-lg
                    bg-green-600
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-700
                  "
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE ALERT MODAL
      ===================================================== */}

      {showCreateAlert && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >
          <form
            onSubmit={handleCreateAlert}
            className={`
              my-auto
              w-full
              max-w-lg
              rounded-2xl
              border
              p-5
              shadow-2xl
              ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Create New Alert</h2>

                <p className="mt-1 text-xs text-slate-400">
                  Send an emergency alert to citizens.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  transition
                  disabled:opacity-50
                  ${
                    darkMode
                      ? "bg-[#07140f] hover:bg-[#143326]"
                      : "bg-slate-100 hover:bg-slate-200"
                  }
                `}
              >
                <X size={17} />
              </button>
            </div>

            {/* FORM */}

            <div className="mt-5 space-y-4">
              {/* TITLE */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Alert Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  type="text"
                  maxLength={150}
                  required
                  placeholder="Enter alert title"
                  className={`
                    h-10
                    w-full
                    rounded-lg
                    border
                    px-3
                    text-xs
                    outline-none
                    transition
                    focus:border-green-500
                    ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }
                  `}
                />

                <p className="mt-1 text-right text-[9px] text-slate-500">
                  {form.title.length}/150
                </p>
              </div>

              {/* MESSAGE */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Alert Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  maxLength={1000}
                  required
                  placeholder="Enter alert message..."
                  className={`
                    w-full
                    resize-none
                    rounded-lg
                    border
                    p-3
                    text-xs
                    outline-none
                    transition
                    focus:border-green-500
                    ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }
                  `}
                />

                <p className="mt-1 text-right text-[9px] text-slate-500">
                  {form.message.length}/1000
                </p>
              </div>

              {/* TYPE + SEVERITY */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    Alert Type
                  </label>

                  <select
                    name="alertType"
                    value={form.alertType}
                    onChange={handleChange}
                    className={`
                      h-10
                      w-full
                      rounded-lg
                      border
                      px-3
                      text-xs
                      outline-none
                      ${
                        darkMode
                          ? "border-white/10 bg-[#07140f] text-white"
                          : "border-slate-200 bg-slate-50 text-slate-900"
                      }
                    `}
                  >
                    <option value="general">General</option>

                    <option value="landslide">Landslide</option>

                    <option value="flood">Flood</option>

                    <option value="road">Road</option>

                    <option value="weather">Weather</option>

                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    Severity
                  </label>

                  <select
                    name="severity"
                    value={form.severity}
                    onChange={handleChange}
                    className={`
                      h-10
                      w-full
                      rounded-lg
                      border
                      px-3
                      text-xs
                      outline-none
                      ${
                        darkMode
                          ? "border-white/10 bg-[#07140f] text-white"
                          : "border-slate-200 bg-slate-50 text-slate-900"
                      }
                    `}
                  >
                    <option value="critical">Critical</option>

                    <option value="high">High</option>

                    <option value="medium">Medium</option>

                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* LOCATION */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter affected location"
                  className={`
                    h-10
                    w-full
                    rounded-lg
                    border
                    px-3
                    text-xs
                    outline-none
                    transition
                    focus:border-green-500
                    ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }
                  `}
                />
              </div>

              {/* EXPIRY */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Expiry Date & Time
                </label>

                <input
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleChange}
                  type="datetime-local"
                  className={`
                    h-10
                    w-full
                    rounded-lg
                    border
                    px-3
                    text-xs
                    outline-none
                    ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }
                  `}
                />

                <p className="mt-1 text-[9px] text-slate-400">
                  Leave empty if the alert has no expiry time.
                </p>
              </div>

              {/* SEND */}

              <button
                type="submit"
                disabled={
                  creating || !form.title.trim() || !form.message.trim()
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-green-600
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {creating ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}

                {creating ? "Creating Alert..." : "Send Alert"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// =====================================================
// STAT COMPONENT
// =====================================================

const AlertStat = ({ icon, value, title, iconColor, iconBg, darkMode }) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-4
        shadow-xl
        ${
          darkMode
            ? "border-white/10 bg-[#0f241b]"
            : "border-slate-200 bg-white"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            ${iconBg}
            ${iconColor}
          `}
        >
          {icon}
        </div>

        <div>
          <p className="text-xl font-bold">{value}</p>

          <p
            className={`
              text-[10px]
              ${darkMode ? "text-slate-500" : "text-slate-400"}
            `}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// DETAIL COMPONENT
// =====================================================

const AlertDetail = ({ label, value, darkMode }) => {
  return (
    <div
      className={`
        rounded-lg
        border
        p-3
        ${
          darkMode
            ? "border-white/5 bg-[#07140f]"
            : "border-slate-200 bg-slate-50"
        }
      `}
    >
      <p className="text-[10px] text-slate-400">{label}</p>

      <p className="mt-1 break-words text-xs font-semibold">{value || "—"}</p>
    </div>
  );
};

export default AdminAlerts;
