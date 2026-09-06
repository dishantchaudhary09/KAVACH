import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  X,
  Trash2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

import {
  fetchAdminReports,
  fetchAdminReportById,
  updateAdminReportStatus,
  deleteAdminReport,
  clearAdminReportError,
  clearSelectedReport,
} from "../../Redux/Admin Slices/reportSlice.js";

const AdminReports = () => {
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.theme.darkMode);

  const { reports, loading, error, updating, deleting } = useSelector(
    (state) => state.adminReports,
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  // =====================================================
  // FETCH REPORTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchAdminReports());

    return () => {
      dispatch(clearAdminReportError());
      dispatch(clearSelectedReport());
    };
  }, [dispatch]);

  // =====================================================
  // FORMAT REPORT
  // =====================================================

  const getCitizenName = (report) => {
    if (report.user?.name) {
      return report.user.name;
    }

    return "Unknown Citizen";
  };

  const getLocation = (report) => {
    if (!report.location) {
      return "Location unavailable";
    }

    const { latitude, longitude } = report.location;

    if (latitude === undefined || longitude === undefined) {
      return "Location unavailable";
    }

    return `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`;
  };

  const getDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // =====================================================
  // FILTER REPORTS
  // =====================================================

  const filteredReports = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return reports.filter((report) => {
      const status = formatStatus(report.status);

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      const matchesSearch =
        report.title?.toLowerCase().includes(searchText) ||
        report.description?.toLowerCase().includes(searchText) ||
        report.reportType?.toLowerCase().includes(searchText) ||
        getCitizenName(report).toLowerCase().includes(searchText) ||
        report._id?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [reports, statusFilter, search]);

  // =====================================================
  // STATS
  // =====================================================

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "pending",
  ).length;

  const verifiedReports = reports.filter(
    (report) => report.status === "verified",
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    if (status === "Pending") {
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }

    if (status === "Verified") {
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }

    if (status === "Rejected") {
      return "bg-red-500/10 text-red-500 border-red-500/20";
    }

    if (status === "Resolved") {
      return "bg-green-500/10 text-green-500 border-green-500/20";
    }

    return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  };

  // =====================================================
  // VIEW REPORT
  // =====================================================

  const handleViewReport = async (report) => {
    setSelectedReport(report);

    const result = await dispatch(fetchAdminReportById(report._id));

    if (fetchAdminReportById.fulfilled.match(result)) {
      setSelectedReport(result.payload);
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusUpdate = async (status) => {
    if (!selectedReport?._id) return;

    const result = await dispatch(
      updateAdminReportStatus({
        reportId: selectedReport._id,
        status,
      }),
    );

    if (updateAdminReportStatus.fulfilled.match(result)) {
      setSelectedReport((prev) => ({
        ...prev,
        ...result.payload,
      }));
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    if (!selectedReport?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this report?",
    );

    if (!confirmed) return;

    const result = await dispatch(deleteAdminReport(selectedReport._id));

    if (deleteAdminReport.fulfilled.match(result)) {
      setSelectedReport(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && reports.length === 0) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
        }`}
      >
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="pt-[68px] lg:ml-[250px]">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={30}
                className="mx-auto animate-spin text-blue-500"
              />

              <p className="mt-3 text-sm font-semibold">
                Loading citizen reports...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="pt-[68px] lg:ml-[250px]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {/* HEADER */}

          <div className="mb-5">
            <div className="flex items-center gap-2">
              <FileText size={23} className="text-blue-500" />

              <h1 className="text-xl font-bold sm:text-2xl">Citizen Reports</h1>
            </div>

            <p
              className={`mt-1 text-xs sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Review, verify and manage reports submitted by citizens.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
              {error}
            </div>
          )}

          {/* STATS */}

          <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ReportStat
              icon={<FileText />}
              value={totalReports}
              title="Total Reports"
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              darkMode={darkMode}
            />

            <ReportStat
              icon={<Clock />}
              value={pendingReports}
              title="Pending"
              iconColor="text-orange-500"
              iconBg="bg-orange-500/10"
              darkMode={darkMode}
            />

            <ReportStat
              icon={<CheckCircle />}
              value={verifiedReports}
              title="Verified"
              iconColor="text-green-500"
              iconBg="bg-green-500/10"
              darkMode={darkMode}
            />

            <ReportStat
              icon={<ShieldCheck />}
              value={resolvedReports}
              title="Resolved"
              iconColor="text-purple-500"
              iconBg="bg-purple-500/10"
              darkMode={darkMode}
            />
          </div>

          {/* REPORT PANEL */}

          <section
            className={`rounded-2xl border shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* TOP BAR */}

            <div
              className={`border-b p-4 ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* SEARCH */}

                <div className="relative w-full lg:max-w-[330px]">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search reports..."
                    className={`
                      h-10
                      w-full
                      rounded-xl
                      border
                      pl-9
                      pr-3
                      text-xs
                      outline-none
                      focus:border-blue-500
                      ${
                        darkMode
                          ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                          : "border-slate-200 bg-slate-50 text-slate-900"
                      }
                    `}
                  />
                </div>

                {/* FILTER */}

                <div className="flex gap-2 overflow-x-auto">
                  {["All", "Pending", "Verified", "Rejected", "Resolved"].map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`
                        whitespace-nowrap
                        rounded-lg
                        px-3
                        py-2
                        text-[10px]
                        font-semibold
                        transition
                        ${
                          statusFilter === filter
                            ? "bg-blue-600 text-white"
                            : darkMode
                              ? "bg-[#07140f] text-slate-400 hover:bg-[#143326] hover:text-white"
                              : "bg-slate-100 text-slate-500 hover:text-slate-900"
                        }
                      `}
                      >
                        {filter}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* REPORT LIST */}

            <div className="p-4">
              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText size={35} className="mx-auto text-slate-400" />

                    <p className="mt-3 text-sm font-semibold">
                      No reports found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {reports.length === 0
                        ? "No citizen reports have been submitted yet."
                        : "Try changing your search or filter."}
                    </p>
                  </div>
                ) : (
                  filteredReports.map((report) => {
                    const status = formatStatus(report.status);

                    return (
                      <div
                        key={report._id}
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
                          {/* REPORT INFO */}

                          <div className="flex min-w-0 flex-1 gap-3">
                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-orange-500/10
                                text-orange-500
                              "
                            >
                              <AlertTriangle size={21} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold">
                                  {report.title}
                                </h3>

                                {report.reportType && (
                                  <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[9px] font-bold text-blue-500">
                                    {report.reportType}
                                  </span>
                                )}
                              </div>

                              <p
                                className={`mt-1 text-xs ${
                                  darkMode ? "text-slate-400" : "text-slate-500"
                                }`}
                              >
                                {report.description}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-4">
                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <MapPin size={12} />
                                  {getLocation(report)}
                                </span>

                                <span className="text-[10px] text-slate-400">
                                  Citizen: {getCitizenName(report)}
                                </span>

                                <span className="text-[10px] text-slate-400">
                                  {getDate(report.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* STATUS + ACTION */}

                          <div className="flex items-center justify-between gap-4 xl:justify-end">
                            <div className="text-right">
                              <p className="text-[9px] text-slate-400">
                                Report ID
                              </p>

                              <p className="max-w-[100px] truncate text-xs font-bold">
                                {report._id}
                              </p>
                            </div>

                            <span
                              className={`
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-[9px]
                                font-bold
                                ${getStatusStyle(status)}
                              `}
                            >
                              {status}
                            </span>

                            <button
                              onClick={() => handleViewReport(report)}
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-500/10
                                text-blue-500
                                transition
                                hover:bg-blue-500/20
                              "
                              title="View Report"
                            >
                              <Eye size={17} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* =====================================================
          REPORT DETAILS MODAL
      ===================================================== */}

      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
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
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Report ID</p>

                <h2 className="max-w-[300px] truncate text-sm font-bold">
                  {selectedReport._id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
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

            {/* CONTENT */}

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[10px] text-slate-400">Title</p>

                <p className="mt-1 text-sm font-bold">{selectedReport.title}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Description</p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {selectedReport.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Detail
                  label="Citizen"
                  value={getCitizenName(selectedReport)}
                  darkMode={darkMode}
                />

                <Detail
                  label="Report Type"
                  value={selectedReport.reportType || "Not specified"}
                  darkMode={darkMode}
                />

                <Detail
                  label="Location"
                  value={getLocation(selectedReport)}
                  darkMode={darkMode}
                />

                <Detail
                  label="Status"
                  value={formatStatus(selectedReport.status)}
                  darkMode={darkMode}
                />

                <Detail
                  label="Submitted"
                  value={getDate(selectedReport.createdAt)}
                  darkMode={darkMode}
                />

                <Detail
                  label="Citizen Email"
                  value={selectedReport.user?.email || "Not available"}
                  darkMode={darkMode}
                />
              </div>

              {/* IMAGE */}

              {selectedReport.image && (
                <div>
                  <p className="text-[10px] text-slate-400">Evidence Image</p>

                  <img
                    src={`${(
                      import.meta.env.VITE_API_URL ||
                      "http://localhost:3000/api"
                    ).replace(/\/api$/, "")}${selectedReport.image}`}
                    alt="Citizen report evidence"
                    className="mt-2 max-h-60 w-full rounded-xl object-cover"
                  />
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col gap-2 pt-3">
                {/* VERIFY */}

                {selectedReport.status !== "verified" && (
                  <button
                    onClick={() => handleStatusUpdate("verified")}
                    disabled={updating || deleting}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-green-600
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      hover:bg-green-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <CheckCircle size={15} />

                    {updating ? "Updating..." : "Verify Report"}
                  </button>
                )}

                {/* REJECT */}

                {selectedReport.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={updating || deleting}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-red-500
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      hover:bg-red-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <X size={15} />

                    {updating ? "Updating..." : "Reject Report"}
                  </button>
                )}

                {/* DELETE */}

                <button
                  onClick={handleDelete}
                  disabled={deleting || updating}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-red-500/20
                    bg-red-500/10
                    py-2.5
                    text-xs
                    font-semibold
                    text-red-500
                    hover:bg-red-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Trash2 size={15} />

                  {deleting ? "Deleting..." : "Delete Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================================================
   STAT COMPONENT
===================================================== */

const ReportStat = ({ icon, value, title, iconColor, iconBg, darkMode }) => {
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
            className={`text-[10px] ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   DETAIL
===================================================== */

const Detail = ({ label, value, darkMode }) => {
  return (
    <div>
      <p className="text-[10px] text-slate-400">{label}</p>

      <p
        className={`mt-1 break-words text-xs font-semibold ${
          darkMode ? "text-slate-200" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default AdminReports;
