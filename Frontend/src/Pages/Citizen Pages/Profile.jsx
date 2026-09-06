import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Bell,
  LogOut,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";

const CitizenProfile = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "Dishant",
    email: "dishant@example.com",
    phone: "+91 98765 43210",
    location: "Aizawl, Mizoram",
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* ================= NAVBAR ================= */}

      <CitizenNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* ================= SIDEBAR ================= */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* ================= MAIN ================= */}

      <main className="pt-[68px] md:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ================= HEADER ================= */}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                <User className="h-5 w-5 text-green-500" />
              </div>

              <span className="text-sm font-semibold text-green-500">
                ACCOUNT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Manage your personal information and account settings.
            </p>
          </div>

          {/* ================= SUCCESS ================= */}

          {saved && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <CheckCircle className="h-5 w-5 text-green-500" />

              <div>
                <p className="text-sm font-bold text-green-500">
                  Profile updated successfully
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Your account information has been saved.
                </p>
              </div>
            </div>
          )}

          {/* ================= PROFILE HEADER ================= */}

          <section
            className={`rounded-2xl border shadow-xl overflow-hidden ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* Green Cover */}

            <div className="h-28 sm:h-36 bg-green-600 relative">
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_white,_transparent_50%)]" />
              </div>
            </div>

            {/* Profile */}

            <div className="px-5 sm:px-8 pb-6">
              <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex items-end gap-4">
                  {/* Avatar */}

                  <div className="relative">
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-2xl border-4 bg-green-600 text-3xl font-bold text-white shadow-lg ${
                        darkMode ? "border-[#0b1c15]" : "border-white"
                      }`}
                    >
                      D
                    </div>

                    <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#07140f] text-white shadow-md hover:bg-green-600 transition">
                      <Camera size={15} />
                    </button>
                  </div>

                  {/* Name */}

                  <div className="pb-1">
                    <h2 className="text-xl font-bold">{profile.name}</h2>

                    <p className="text-xs text-slate-500">Citizen Account</p>
                  </div>
                </div>

                {/* Edit */}

                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
                        : "border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        darkMode
                          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
                          : "border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition"
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ================= CONTENT ================= */}

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            {/* ================= PERSONAL INFORMATION ================= */}

            <section
              className={`rounded-2xl border p-5 sm:p-6 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5">
                <h2 className="text-lg font-bold">Personal Information</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your basic account information.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <ProfileField
                  icon={<User />}
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  editing={editing}
                  onChange={handleChange}
                  darkMode={darkMode}
                />

                <ProfileField
                  icon={<Mail />}
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  editing={editing}
                  onChange={handleChange}
                  darkMode={darkMode}
                />

                <ProfileField
                  icon={<Phone />}
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  editing={editing}
                  onChange={handleChange}
                  darkMode={darkMode}
                />

                <ProfileField
                  icon={<MapPin />}
                  label="Location"
                  name="location"
                  value={profile.location}
                  editing={editing}
                  onChange={handleChange}
                  darkMode={darkMode}
                />
              </div>
            </section>

            {/* ================= ACCOUNT STATUS ================= */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h2 className="text-lg font-bold">Account Overview</h2>

              <p className="mt-1 text-xs text-slate-500">
                Your activity on the monitoring system.
              </p>

              <div className="mt-5 space-y-3">
                <OverviewItem
                  icon={<FileText />}
                  title="Reports Submitted"
                  value="04"
                  darkMode={darkMode}
                />

                <OverviewItem
                  icon={<AlertTriangle />}
                  title="Active Alerts"
                  value="03"
                  darkMode={darkMode}
                />

                <OverviewItem
                  icon={<CheckCircle />}
                  title="Reports Resolved"
                  value="02"
                  darkMode={darkMode}
                />
              </div>

              {/* Verified */}

              <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-green-500" />

                  <div>
                    <p className="text-sm font-bold text-green-500">
                      Account Verified
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Your account information has been verified.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= SECURITY ================= */}

          <section
            className={`mt-5 rounded-2xl border p-5 sm:p-6 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold">Security & Preferences</h2>

              <p className="mt-1 text-xs text-slate-500">
                Manage your account security and notifications.
              </p>
            </div>

            <div className="space-y-3">
              {/* Password */}

              <SettingsItem
                icon={<Lock />}
                title="Password"
                description="Change your account password"
                action="Change"
                darkMode={darkMode}
              />

              {/* Notifications */}

              <SettingsItem
                icon={<Bell />}
                title="Notifications"
                description="Manage safety alerts and notifications"
                action="Manage"
                darkMode={darkMode}
              />

              {/* Security */}

              <SettingsItem
                icon={<ShieldCheck />}
                title="Account Security"
                description="Review your account security settings"
                action="Review"
                darkMode={darkMode}
              />
            </div>
          </section>

          {/* ================= LOGOUT ================= */}

          <section
            className={`mt-5 rounded-2xl border p-5 ${
              darkMode
                ? "border-red-500/20 bg-red-500/5"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                  <LogOut className="h-5 w-5 text-red-500" />
                </div>

                <div>
                  <h3 className="text-sm font-bold">
                    Logout from your account
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    You will need to login again to access your account.
                  </p>
                </div>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 transition">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

/* ================================================= */
/* PROFILE FIELD */
/* ================================================= */

const ProfileField = ({
  icon,
  label,
  name,
  value,
  editing,
  onChange,
  darkMode,
}) => {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500">{label}</label>

      <div className="relative mt-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
          {React.cloneElement(icon, {
            size: 17,
          })}
        </div>

        <input
          type="text"
          name={name}
          value={value}
          disabled={!editing}
          onChange={onChange}
          className={`w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none transition ${
            editing
              ? darkMode
                ? "border-white/10 bg-[#07140f] text-white focus:border-green-500"
                : "border-slate-200 bg-slate-50 focus:border-green-500"
              : darkMode
                ? "border-white/10 bg-white/[0.03] text-slate-300"
                : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        />
      </div>
    </div>
  );
};

/* ================================================= */
/* OVERVIEW ITEM */
/* ================================================= */

const OverviewItem = ({ icon, title, value, darkMode }) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition ${
        darkMode
          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
        {React.cloneElement(icon, {
          size: 19,
        })}
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold">{title}</p>
      </div>

      <p className="text-lg font-bold">{value}</p>
    </div>
  );
};

/* ================================================= */
/* SETTINGS ITEM */
/* ================================================= */

const SettingsItem = ({ icon, title, description, action, darkMode }) => {
  return (
    <button
      className={`group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
        darkMode
          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
          : "border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
        {React.cloneElement(icon, {
          size: 19,
        })}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold">{title}</h3>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <span className="text-xs font-semibold text-green-500 group-hover:underline">
        {action}
      </span>
    </button>
  );
};

export default CitizenProfile;
