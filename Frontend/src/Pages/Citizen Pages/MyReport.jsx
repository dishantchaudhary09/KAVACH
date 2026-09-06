import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import {
  fetchMyReports,
  deleteReport,
  clearMyReportsError,
} from "../../Redux/Citizen Slices/reportSlice.js";

import {
  FileText,
  MapPin,
  Clock3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  Eye,
  RefreshCw,
  Plus,
} from "lucide-react";

const MyReports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================================================
  // REDUX
  // =========================================================

  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  const {
    myReports = [],
    myReportsLoading,
    myReportsError,
    deleteLoading,
  } = useSelector((state) => state.reports || {});

  const reports = Array.isArray(myReports) ? myReports : [];

  // =========================================================
  // LOCAL STATE
  // =========================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =========================================================
  // DARK MODE
  // =========================================================

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [darkMode]);

  // =========================================================
  // FETCH REPORTS
  // =========================================================

  useEffect(() => {
    dispatch(fetchMyReports());
  }, [dispatch]);

  // =========================================================
  // DELETE REPORT
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    try {
      await dispatch(deleteReport(id)).unwrap();
    } catch (error) {
      console.error("Delete report error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // RETRY
  // =========================================================

  const handleRetry = () => {
    dispatch(clearMyReportsError());
    dispatch(fetchMyReports());
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatusConfig = (status) => {
    const currentStatus = String(status || "").toLowerCase();

    if (
      currentStatus === "verified" ||
      currentStatus === "approved" ||
      currentStatus === "resolved"
    ) {
      return {
        label: status || "Verified",
        className: darkMode
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-green-50 text-green-600 border-green-200",
        icon: <CheckCircle2 size={14} />,
      };
    }

    if (currentStatus === "rejected" || currentStatus === "declined") {
      return {
        label: status || "Rejected",
        className: darkMode
          ? "bg-red-500/10 text-red-400 border-red-500/20"
          : "bg-red-50 text-red-600 border-red-200",
        icon: <XCircle size={14} />,
      };
    }

    if (
      currentStatus === "pending" ||
      currentStatus === "under review" ||
      currentStatus === "review"
    ) {
      return {
        label: status || "Pending",
        className: darkMode
          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
          : "bg-orange-50 text-orange-600 border-orange-200",
        icon: <Clock3 size={14} />,
      };
    }

    return {
      label: status || "Submitted",
      className: darkMode
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
        : "bg-blue-50 text-blue-600 border-blue-200",
      icon: <AlertCircle size={14} />,
    };
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
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

      <main className="pt-[68px] md:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <section
            className={`mb-6 rounded-2xl border p-5 shadow-xl transition-colors duration-300 sm:p-6 ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    darkMode
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  <FileText size={23} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">My Reports</h1>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Track the incidents and hazards you have reported.
                  </p>
                </div>
              </div>

              {/* NEW REPORT */}

              <button
                onClick={() => navigate("/citizen/report")}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                  shadow-sm
                "
              >
                <Plus size={18} />
                New Report
              </button>
            </div>
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          {!myReportsLoading && !myReportsError && (
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <SummaryCard
                title="Total Reports"
                value={reports.length}
                icon={<FileText />}
                iconClass={
                  darkMode
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }
                darkMode={darkMode}
              />

              <SummaryCard
                title="Pending"
                value={
                  reports.filter((report) => {
                    const status = String(report.status || "").toLowerCase();

                    return (
                      status === "pending" ||
                      status === "under review" ||
                      status === "review"
                    );
                  }).length
                }
                icon={<Clock3 />}
                iconClass={
                  darkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-100 text-orange-600"
                }
                darkMode={darkMode}
              />

              <SummaryCard
                title="Verified"
                value={
                  reports.filter((report) => {
                    const status = String(report.status || "").toLowerCase();

                    return (
                      status === "verified" ||
                      status === "approved" ||
                      status === "resolved"
                    );
                  }).length
                }
                icon={<CheckCircle2 />}
                iconClass={
                  darkMode
                    ? "bg-green-500/10 text-green-400"
                    : "bg-green-100 text-green-600"
                }
                darkMode={darkMode}
              />
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {myReportsLoading && <LoadingState darkMode={darkMode} />}

          {/* =================================================
              ERROR
          ================================================= */}

          {!myReportsLoading && myReportsError && (
            <ErrorState
              error={myReportsError}
              onRetry={handleRetry}
              darkMode={darkMode}
            />
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!myReportsLoading && !myReportsError && reports.length === 0 && (
            <EmptyState
              onCreate={() => navigate("/citizen/report")}
              darkMode={darkMode}
            />
          )}

          {/* =================================================
              REPORT LIST
          ================================================= */}

          {!myReportsLoading && !myReportsError && reports.length > 0 && (
            <div className="space-y-4">
              {reports.map((report) => {
                const statusConfig = getStatusConfig(report.status);

                return (
                  <ReportCard
                    key={report._id}
                    report={report}
                    statusConfig={statusConfig}
                    darkMode={darkMode}
                    onView={() => navigate(`/citizen/reports/${report._id}`)}
                    onDelete={() => handleDelete(report._id)}
                    deleting={deleteLoading && deletingId === report._id}
                    formatDate={formatDate}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className={`mt-8 border-t py-5 text-center text-xs ${
          darkMode
            ? "border-white/10 bg-[#0b1c15] text-gray-500"
            : "border-slate-200 bg-white text-slate-500"
        }`}
      >
        © 2026 Landslide Risk Monitoring System. All rights reserved.
      </footer>
    </div>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({ title, value, icon, iconClass, darkMode }) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-xl transition-all duration-300 ${
        darkMode
          ? "border-white/10 bg-[#0f241b] hover:border-green-500/30 hover:bg-[#143326]"
          : "border-slate-200 bg-white hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {React.cloneElement(icon, {
            size: 21,
          })}
        </div>

        <div>
          <p className="text-xl font-bold">{value}</p>

          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-slate-500"
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
   REPORT CARD
========================================================= */

const ReportCard = ({
  report,
  statusConfig,
  darkMode,
  onView,
  onDelete,
  deleting,
  formatDate,
}) => {
  const location =
    report.location?.address ||
    report.location?.name ||
    report.location?.area ||
    "Location not provided";

  const title = report.title || report.type || "Incident Report";

  const description = report.description || "No description provided.";

  return (
    <article
      className={`overflow-hidden rounded-2xl border shadow-xl transition-all duration-300 ${
        darkMode
          ? "border-white/10 bg-[#0f241b] hover:border-green-500/30 hover:bg-[#143326]"
          : "border-slate-200 bg-white hover:shadow-lg"
      }`}
    >
      <div className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* ICON */}

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              darkMode
                ? "bg-orange-500/10 text-orange-400"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            <FileText size={23} />
          </div>

          {/* CONTENT */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-bold sm:text-lg">{title}</h2>

                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs ${
                    darkMode ? "text-gray-400" : "text-slate-500"
                  }`}
                >
                  <Clock3 size={13} />

                  <span>
                    {formatDate(
                      report.createdAt || report.date || report.updatedAt,
                    )}
                  </span>
                </div>
              </div>

              {/* STATUS */}

              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusConfig.className}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>

            {/* DESCRIPTION */}

            <p
              className={`mt-3 text-sm leading-6 ${
                darkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              {description}
            </p>

            {/* LOCATION */}

            <div
              className={`mt-3 flex items-start gap-2 text-xs ${
                darkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              <MapPin size={15} className="mt-0.5 shrink-0" />

              <span>{location}</span>
            </div>

            {/* ACTIONS */}

            <div
              className={`mt-4 flex flex-wrap gap-2 border-t pt-4 ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              {/* VIEW */}

              <button
                onClick={onView}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  darkMode
                    ? "bg-white/[0.05] text-gray-200 hover:bg-white/[0.10]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Eye size={15} />
                View Details
              </button>

              {/* DELETE */}

              <button
                onClick={onDelete}
                disabled={deleting}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  darkMode
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                {deleting ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   LOADING
========================================================= */

const LoadingState = ({ darkMode }) => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`animate-pulse rounded-2xl border p-5 ${
            darkMode
              ? "border-white/10 bg-[#0f241b]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`h-12 w-12 rounded-xl ${
                darkMode ? "bg-white/[0.06]" : "bg-slate-200"
              }`}
            />

            <div className="flex-1 space-y-3">
              <div
                className={`h-4 w-1/3 rounded ${
                  darkMode ? "bg-white/[0.06]" : "bg-slate-200"
                }`}
              />

              <div
                className={`h-3 w-2/3 rounded ${
                  darkMode ? "bg-white/[0.06]" : "bg-slate-200"
                }`}
              />

              <div
                className={`h-3 w-1/2 rounded ${
                  darkMode ? "bg-white/[0.06]" : "bg-slate-200"
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   ERROR
========================================================= */

const ErrorState = ({ error, onRetry, darkMode }) => {
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        darkMode ? "border-red-500/20 bg-[#0f241b]" : "border-red-200 bg-white"
      }`}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertCircle size={25} />
      </div>

      <h3 className="text-lg font-bold">Unable to load reports</h3>

      <p
        className={`mx-auto mt-2 max-w-md text-sm ${
          darkMode ? "text-gray-400" : "text-slate-500"
        }`}
      >
        {error}
      </p>

      <button
        onClick={onRetry}
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-green-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-green-700
        "
      >
        <RefreshCw size={17} />
        Try Again
      </button>
    </div>
  );
};

/* =========================================================
   EMPTY
========================================================= */

const EmptyState = ({ onCreate, darkMode }) => {
  return (
    <div
      className={`rounded-2xl border p-10 text-center ${
        darkMode ? "border-white/10 bg-[#0f241b]" : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
          darkMode
            ? "bg-white/[0.05] text-gray-400"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <FileText size={30} />
      </div>

      <h3 className="text-lg font-bold">No reports yet</h3>

      <p
        className={`mx-auto mt-2 max-w-md text-sm ${
          darkMode ? "text-gray-400" : "text-slate-500"
        }`}
      >
        You haven't submitted any incident reports. If you notice a landslide or
        other hazard, report it to help keep your community safe.
      </p>

      <button
        onClick={onCreate}
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-green-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-green-700
        "
      >
        <Plus size={17} />
        Report an Incident
      </button>
    </div>
  );
};

export default MyReports;
