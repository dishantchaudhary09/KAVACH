import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  Users,
  Trash2,
  Mail,
  Lock,
  User,
  Crown,
  Search,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Management = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [search, setSearch] = useState("");

  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const darkMode = useSelector((state) => state.theme.darkMode);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // =========================================================
  // GET AUTH TOKEN
  // =========================================================

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // =========================================================
  // FETCH ADMINISTRATORS
  // =========================================================

  const fetchAdministrators = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await axios.get(`${API_URL}/admin/administrators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Backend currently returns array directly
      setAdmins(Array.isArray(data) ? data : data.admins || []);
    } catch (err) {
      console.error(
        "❌ Fetch Administrators Error:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch administrators",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD ADMINISTRATORS
  // =========================================================

  useEffect(() => {
    fetchAdministrators();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // ADD ADMINISTRATOR
  // =========================================================

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      if (!form.name.trim() || !form.email.trim() || !form.password) {
        setError("All fields are required.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/administrators`,
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("✅ Administrator Created:", response.data);

      setSuccess(
        response.data?.message || "Administrator created successfully",
      );

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
      });

      setShowAddAdmin(false);

      // Refresh real data from MongoDB
      await fetchAdministrators();

      // Automatically remove success message
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "❌ Add Administrator Error:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create administrator",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE ADMINISTRATOR
  // =========================================================

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${name || "this administrator"}?`,
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await axios.delete(
        `${API_URL}/admin/administrators/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("✅ Administrator Deleted:", response.data);

      setSuccess(
        response.data?.message || "Administrator removed successfully",
      );

      // Refresh real MongoDB data
      await fetchAdministrators();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "❌ Delete Administrator Error:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to remove administrator",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredAdmins = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return admins;

    return admins.filter((admin) => {
      const name = admin?.name?.toLowerCase() || "";
      const email = admin?.email?.toLowerCase() || "";
      const role = admin?.role?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        role.includes(searchValue)
      );
    });
  }, [admins, search]);

  // =========================================================
  // REAL STATS
  // =========================================================

  const totalAdministrators = admins.length;

  const activeAdministrators = admins.filter(
    (admin) =>
      admin?.status === "Active" ||
      admin?.isActive === true ||
      admin?.isActive === undefined,
  ).length;

  const superAdminCount = admins.filter(
    (admin) => String(admin?.role || "").toLowerCase() === "superadmin",
  ).length;

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (submitting) return;

    setShowAddAdmin(false);

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setError("");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#07140f] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="pt-[68px] lg:ml-[250px]">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-500">
                  ADMIN MANAGEMENT
                </p>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Administrator Management
                </h1>

                <p
                  className={`mt-1 max-w-2xl text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Manage administrators who have access to the Landslide Risk
                  Monitoring System.
                </p>
              </div>

              {/* ADD ADMIN */}

              <button
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setShowAddAdmin(true);
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:bg-green-700
                "
              >
                <UserPlus size={18} />
                Add Administrator
              </button>
            </div>
          </div>

          {/* ================================================= */}
          {/* SUCCESS MESSAGE */}
          {/* ================================================= */}

          {success && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-500">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* ================================================= */}
          {/* ERROR MESSAGE */}
          {/* ================================================= */}

          {error && !showAddAdmin && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              <AlertCircle size={18} />
              <span>{error}</span>

              <button onClick={() => setError("")} className="ml-auto">
                <X size={16} />
              </button>
            </div>
          )}

          {/* ================================================= */}
          {/* SECURITY INFO */}
          {/* ================================================= */}

          <section
            className={`mb-5 rounded-2xl border p-5 shadow-xl transition-colors ${
              darkMode
                ? "border-green-500/20 bg-[#0b1c15]"
                : "border-green-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-500/10
                  text-green-500
                "
              >
                <ShieldCheck size={24} />
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-bold">
                  Administrator Access Control
                </h2>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Only authorized administrators can access the admin control
                  center.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                <CheckCircle2 size={15} className="text-green-500" />

                <span className="text-xs font-semibold text-green-500">
                  Access Protected
                </span>
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <ManagementStat
              icon={<Users />}
              title="Total Administrators"
              value={loading ? "—" : totalAdministrators}
              darkMode={darkMode}
            />

            <ManagementStat
              icon={<ShieldCheck />}
              title="Active Administrators"
              value={loading ? "—" : activeAdministrators}
              darkMode={darkMode}
            />

            <ManagementStat
              icon={<Crown />}
              title="Super Admin"
              value={loading ? "—" : superAdminCount}
              darkMode={darkMode}
            />
          </div>

          {/* ================================================= */}
          {/* ADMIN LIST */}
          {/* ================================================= */}

          <section
            className={`rounded-2xl border shadow-xl transition-colors ${
              darkMode
                ? "border-white/10 bg-[#0b1c15]"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* LIST HEADER */}

            <div
              className={`flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <div>
                <h2 className="font-bold">Authorized Administrators</h2>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Users with administrative access
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative w-full md:w-[280px]">
                <Search
                  size={17}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                />

                <input
                  type="text"
                  placeholder="Search administrator..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`h-10 w-full rounded-xl border pl-10 pr-3 text-xs outline-none transition ${
                    darkMode
                      ? "border-white/10 bg-black/10 text-white placeholder:text-slate-600 focus:border-green-500"
                      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-green-500"
                  }`}
                />
              </div>
            </div>

            {/* ================================================= */}
            {/* ADMIN LIST */}
            {/* ================================================= */}

            <div className="space-y-3 p-5">
              {/* LOADING */}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-green-500" />

                  <p
                    className={`mt-3 text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Loading administrators...
                  </p>
                </div>
              ) : (
                <>
                  {filteredAdmins.map((admin) => {
                    const adminId = admin?._id || admin?.id;

                    const isSuperAdmin =
                      String(admin?.role || "").toLowerCase() === "superadmin";

                    const adminStatus =
                      admin?.status ||
                      (admin?.isActive === false ? "Inactive" : "Active");

                    const isDeleting = deletingId === adminId;

                    return (
                      <div
                        key={adminId}
                        className={`flex flex-col gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center ${
                          darkMode
                            ? "border-white/10 bg-black/10 hover:border-green-500/20"
                            : "border-slate-200 bg-slate-50 hover:border-green-300 hover:bg-white"
                        }`}
                      >
                        {/* AVATAR */}

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                          {(admin?.name || "A").charAt(0).toUpperCase()}
                        </div>

                        {/* INFORMATION */}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold">
                              {admin?.name || "Unknown Administrator"}
                            </h3>

                            {isSuperAdmin ? (
                              <span className="rounded-full bg-purple-500/10 px-2 py-1 text-[9px] font-bold text-purple-500">
                                SUPER ADMIN
                              </span>
                            ) : (
                              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[9px] font-bold text-blue-500">
                                ADMINISTRATOR
                              </span>
                            )}
                          </div>

                          <div
                            className={`mt-1 flex items-center gap-1.5 text-xs ${
                              darkMode ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            <Mail size={13} />
                            {admin?.email || "No email"}
                          </div>
                        </div>

                        {/* STATUS */}

                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              adminStatus === "Active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          <span
                            className={`text-[10px] font-semibold ${
                              adminStatus === "Active"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {adminStatus}
                          </span>
                        </div>

                        {/* DELETE */}

                        {isSuperAdmin ? (
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-purple-500"
                            title="Super Admin cannot be removed"
                          >
                            <Crown size={17} />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(adminId, admin?.name)}
                            disabled={isDeleting}
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              text-red-500
                              transition
                              hover:bg-red-500/10
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                            title="Remove administrator"
                          >
                            {isDeleting ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* NO RESULTS */}

                  {filteredAdmins.length === 0 && (
                    <div className="py-10 text-center">
                      <Users
                        size={35}
                        className="mx-auto mb-3 text-slate-400"
                      />

                      <p
                        className={`text-sm font-semibold ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {search
                          ? "No administrators found"
                          : "No administrators available"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <footer
            className={`mt-6 border-t py-5 text-center ${
              darkMode ? "border-white/10" : "border-slate-200"
            }`}
          >
            <p
              className={`text-[10px] ${
                darkMode ? "text-slate-600" : "text-slate-400"
              }`}
            >
              © 2026 Landslide Risk Monitoring System • Administrator Management
            </p>
          </footer>
        </div>
      </main>

      {/* ================================================= */}
      {/* ADD ADMIN MODAL */}
      {/* ================================================= */}

      {showAddAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-[430px] rounded-2xl border p-6 shadow-2xl transition-colors ${
              darkMode
                ? "border-white/10 bg-[#0b1c15] text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            {/* MODAL HEADER */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Add Administrator</h2>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Create a new administrator account
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className={`rounded-lg p-2 transition ${
                  darkMode
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                } disabled:opacity-50`}
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleAddAdmin} className="space-y-4">
              {/* NAME */}

              <div>
                <label
                  className={`mb-1.5 block text-xs font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Administrator Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`h-10 w-full rounded-lg border pl-9 pr-3 text-xs outline-none focus:border-green-500 ${
                      darkMode
                        ? "border-white/10 bg-black/10 text-white placeholder:text-slate-600"
                        : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    }`}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label
                  className={`mb-1.5 block text-xs font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Gmail Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@gmail.com"
                    className={`h-10 w-full rounded-lg border pl-9 pr-3 text-xs outline-none focus:border-green-500 ${
                      darkMode
                        ? "border-white/10 bg-black/10 text-white placeholder:text-slate-600"
                        : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    }`}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  className={`mb-1.5 block text-xs font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className={`h-10 w-full rounded-lg border pl-9 pr-3 text-xs outline-none focus:border-green-500 ${
                      darkMode
                        ? "border-white/10 bg-black/10 text-white placeholder:text-slate-600"
                        : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    }`}
                    required
                    minLength={6}
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* ROLE INFO */}

              <div
                className={`rounded-lg border p-3 ${
                  darkMode
                    ? "border-blue-500/20 bg-blue-500/5"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <p className="text-[10px] font-semibold text-blue-500">Role</p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  This account will automatically be created as{" "}
                  <span className="font-bold text-blue-500">administrator</span>
                  .
                </p>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className={`h-10 flex-1 rounded-lg border text-xs font-semibold transition ${
                    darkMode
                      ? "border-white/10 text-slate-400 hover:bg-white/5"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    flex
                    h-10
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-green-600
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Administrator"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================= */
/* MANAGEMENT STAT */
/* ================================================= */

const ManagementStat = ({ icon, title, value, darkMode }) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-xl transition-colors ${
        darkMode ? "border-white/10 bg-[#0b1c15]" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
          {React.cloneElement(icon, {
            size: 21,
          })}
        </div>

        <div>
          <p
            className={`text-xs ${
              darkMode ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <p className="mt-1 text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Management;
