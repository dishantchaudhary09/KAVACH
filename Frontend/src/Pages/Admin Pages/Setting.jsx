import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Lock,
  Mail,
  Save,
  KeyRound,
  Database,
  AlertTriangle,
  Trash2,
} from "lucide-react";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

const Settings = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [mlAlerts, setMlAlerts] = useState(true);

  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@example.com");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* ================= NAVBAR ================= */}

      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ================= MAIN ================= */}

      <main className="pt-[68px] lg:ml-[250px]">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
          {/* ================= HEADER ================= */}

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <SettingsIcon size={24} className="text-blue-500" />

              <h1 className="text-xl font-bold sm:text-2xl">Settings</h1>
            </div>

            <p
              className={`mt-1 text-xs sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Manage your account and system preferences.
            </p>
          </div>

          {/* ================= CONTENT ================= */}

          <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
            {/* ================= SETTINGS MENU ================= */}

            <section
              className={`h-fit rounded-2xl border p-3 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <SettingsMenu
                icon={<User size={18} />}
                title="Profile"
                active
                darkMode={darkMode}
              />

              <SettingsMenu
                icon={<Bell size={18} />}
                title="Notifications"
                darkMode={darkMode}
              />

              <SettingsMenu
                icon={<Shield size={18} />}
                title="Security"
                darkMode={darkMode}
              />

              <SettingsMenu
                icon={<Database size={18} />}
                title="System Preferences"
                darkMode={darkMode}
              />
            </section>

            {/* ================= RIGHT CONTENT ================= */}

            <div className="space-y-5">
              {/* ================= PROFILE ================= */}

              <section
                className={`rounded-2xl border p-5 shadow-xl ${
                  darkMode
                    ? "border-white/10 bg-[#0f241b]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <User size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">Profile Settings</h2>

                    <p className="text-[10px] text-slate-400">
                      Update your administrator information.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    darkMode={darkMode}
                  />

                  <InputField
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    darkMode={darkMode}
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  <Save size={15} />
                  Save Changes
                </button>
              </section>

              {/* ================= NOTIFICATIONS ================= */}

              <section
                className={`rounded-2xl border p-5 shadow-xl ${
                  darkMode
                    ? "border-white/10 bg-[#0f241b]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Bell size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">Notifications</h2>

                    <p className="text-[10px] text-slate-400">
                      Control system notifications and alerts.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <ToggleRow
                    title="Email Notifications"
                    description="Receive important alerts through email."
                    checked={emailAlerts}
                    setChecked={setEmailAlerts}
                    darkMode={darkMode}
                  />

                  <ToggleRow
                    title="System Alerts"
                    description="Receive critical system notifications."
                    checked={systemAlerts}
                    setChecked={setSystemAlerts}
                    darkMode={darkMode}
                  />

                  <ToggleRow
                    title="AI / ML Alerts"
                    description="Receive notifications about high-risk predictions."
                    checked={mlAlerts}
                    setChecked={setMlAlerts}
                    darkMode={darkMode}
                  />
                </div>
              </section>

              {/* ================= SECURITY ================= */}

              <section
                className={`rounded-2xl border p-5 shadow-xl ${
                  darkMode
                    ? "border-white/10 bg-[#0f241b]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                    <Shield size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">Security</h2>

                    <p className="text-[10px] text-slate-400">
                      Manage administrator account security.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <Lock size={19} className="text-purple-500" />

                    <div>
                      <p className="text-xs font-bold">Change Password</p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        Update your account password.
                      </p>
                    </div>
                  </button>

                  <button
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <KeyRound size={19} className="text-blue-500" />

                    <div>
                      <p className="text-xs font-bold">Login Sessions</p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        Manage active sessions.
                      </p>
                    </div>
                  </button>
                </div>
              </section>

              {/* ================= SYSTEM ================= */}

              <section
                className={`rounded-2xl border p-5 shadow-xl ${
                  darkMode
                    ? "border-white/10 bg-[#0f241b]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                    <Database size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">System Preferences</h2>

                    <p className="text-[10px] text-slate-400">
                      Application configuration and system options.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <PreferenceRow
                    title="Automatic Risk Updates"
                    description="Automatically update risk zone information."
                    darkMode={darkMode}
                  />

                  <PreferenceRow
                    title="Automatic ML Predictions"
                    description="Allow the ML service to process new risk data."
                    darkMode={darkMode}
                  />
                </div>
              </section>

              {/* ================= DANGER ZONE ================= */}

              <section
                className={`rounded-2xl border p-5 shadow-xl ${
                  darkMode
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={21} className="mt-0.5 text-red-500" />

                  <div className="flex-1">
                    <h2 className="text-base font-bold text-red-500">
                      Danger Zone
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-400">
                      These actions can affect the system and should be
                      performed carefully.
                    </p>

                    <button
                      className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-red-500
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        text-red-500
                        transition
                        hover:bg-red-500
                        hover:text-white
                      "
                    >
                      <Trash2 size={14} />
                      Reset System Settings
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ================================================= */
/* SETTINGS MENU */
/* ================================================= */

const SettingsMenu = ({ icon, title, active, darkMode }) => {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
        active
          ? "bg-blue-600 text-white"
          : darkMode
            ? "text-slate-300 hover:bg-[#143326]"
            : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icon}

      <span className="text-xs font-semibold">{title}</span>
    </button>
  );
};

/* ================================================= */
/* INPUT */
/* ================================================= */

const InputField = ({ label, value, onChange, darkMode }) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold">{label}</label>

      <div className="relative">
        <Mail
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={value}
          onChange={onChange}
          className={`h-10 w-full rounded-lg border pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 ${
            darkMode
              ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
              : "border-slate-200 bg-white text-slate-900"
          }`}
        />
      </div>
    </div>
  );
};

/* ================================================= */
/* TOGGLE */
/* ================================================= */

const ToggleRow = ({ title, description, checked, setChecked, darkMode }) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${
        darkMode
          ? "border-white/10 bg-[#07140f]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div>
        <p className="text-xs font-semibold">{title}</p>

        <p className="mt-1 text-[9px] text-slate-400">{description}</p>
      </div>

      <button
        onClick={() => setChecked(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : darkMode ? "bg-[#143326]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

/* ================================================= */
/* PREFERENCE */
/* ================================================= */

const PreferenceRow = ({ title, description, darkMode }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${
        darkMode
          ? "border-white/10 bg-[#07140f]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div>
        <p className="text-xs font-semibold">{title}</p>

        <p className="mt-1 text-[9px] text-slate-400">{description}</p>
      </div>

      <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold text-green-500">
        Enabled
      </span>
    </div>
  );
};

export default Settings;
