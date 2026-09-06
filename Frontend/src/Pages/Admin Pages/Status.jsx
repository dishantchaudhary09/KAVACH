import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Activity,
  Server,
  Database,
  Brain,
  CloudRain,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock3,
  Cpu,
  HardDrive,
  Wifi,
} from "lucide-react";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

const SystemStatus = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {/* ================= HEADER ================= */}

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={24} className="text-blue-500" />

                <h1 className="text-xl font-bold sm:text-2xl">System Status</h1>
              </div>

              <p
                className={`mt-1 text-xs sm:text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Monitor the health and availability of all system services.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="
                flex
                w-fit
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
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh Status
            </button>
          </div>

          {/* ================= OVERALL STATUS ================= */}

          <section
            className={`mb-5 rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-green-500/20 bg-green-500/5"
                : "border-green-200 bg-green-50"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                  <CheckCircle2 size={30} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">All Systems Operational</h2>

                  <p className="mt-1 text-xs text-slate-400">
                    No critical system issues detected.
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] text-slate-400">Last checked</p>

                <p className="mt-1 flex items-center gap-1 text-xs font-semibold sm:justify-end">
                  <Clock3 size={13} />
                  Just now
                </p>
              </div>
            </div>
          </section>

          {/* ================= SERVICE STATUS ================= */}

          <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              icon={<Server />}
              title="Backend Server"
              description="Node.js / Express API"
              status="Operational"
              response="42 ms"
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              darkMode={darkMode}
            />

            <ServiceCard
              icon={<Database />}
              title="MongoDB Database"
              description="Primary application database"
              status="Operational"
              response="28 ms"
              iconColor="text-green-500"
              iconBg="bg-green-500/10"
              darkMode={darkMode}
            />

            <ServiceCard
              icon={<Brain />}
              title="AI / ML Service"
              description="Landslide prediction engine"
              status="Operational"
              response="126 ms"
              iconColor="text-purple-500"
              iconBg="bg-purple-500/10"
              darkMode={darkMode}
            />

            <ServiceCard
              icon={<CloudRain />}
              title="Weather API"
              description="Live weather & rainfall data"
              status="Operational"
              response="184 ms"
              iconColor="text-cyan-500"
              iconBg="bg-cyan-500/10"
              darkMode={darkMode}
            />

            <ServiceCard
              icon={<Globe />}
              title="Frontend"
              description="React web application"
              status="Operational"
              response="31 ms"
              iconColor="text-orange-500"
              iconBg="bg-orange-500/10"
              darkMode={darkMode}
            />

            <ServiceCard
              icon={<Wifi />}
              title="Notification Service"
              description="Emergency alerts & notifications"
              status="Operational"
              response="76 ms"
              iconColor="text-pink-500"
              iconBg="bg-pink-500/10"
              darkMode={darkMode}
            />
          </div>

          {/* ================= SERVER METRICS ================= */}

          <div className="mb-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            {/* SERVER PERFORMANCE */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5 flex items-center gap-2">
                <Cpu size={21} className="text-blue-500" />

                <div>
                  <h2 className="text-lg font-bold">Server Performance</h2>

                  <p className="text-[10px] text-slate-400">
                    Current resource utilization
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <ResourceBar
                  icon={<Cpu size={17} />}
                  title="CPU Usage"
                  value="34%"
                  percentage="34%"
                  color="bg-blue-500"
                />

                <ResourceBar
                  icon={<Activity size={17} />}
                  title="Memory Usage"
                  value="61%"
                  percentage="61%"
                  color="bg-purple-500"
                />

                <ResourceBar
                  icon={<HardDrive size={17} />}
                  title="Storage Usage"
                  value="48%"
                  percentage="48%"
                  color="bg-orange-500"
                />
              </div>

              {/* SERVER INFO */}

              <div
                className={`mt-6 grid grid-cols-2 gap-4 rounded-xl border p-4 sm:grid-cols-4 ${
                  darkMode
                    ? "border-white/10 bg-[#07140f]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <ServerInfo label="Uptime" value="14d 08h" />
                <ServerInfo label="Node Version" value="v20.x" />
                <ServerInfo label="Requests" value="18.4K" />
                <ServerInfo label="Errors" value="0.08%" />
              </div>
            </section>

            {/* SYSTEM EVENTS */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5 flex items-center gap-2">
                <AlertTriangle size={21} className="text-orange-500" />

                <div>
                  <h2 className="text-lg font-bold">System Events</h2>

                  <p className="text-[10px] text-slate-400">
                    Recent service activity
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <SystemEvent
                  title="ML service health check passed"
                  time="2 minutes ago"
                  type="success"
                  darkMode={darkMode}
                />

                <SystemEvent
                  title="Weather API response received"
                  time="8 minutes ago"
                  type="success"
                  darkMode={darkMode}
                />

                <SystemEvent
                  title="Database backup completed"
                  time="24 minutes ago"
                  type="success"
                  darkMode={darkMode}
                />

                <SystemEvent
                  title="High traffic detected"
                  time="1 hour ago"
                  type="warning"
                  darkMode={darkMode}
                />
              </div>
            </section>
          </div>

          {/* ================= AVAILABILITY ================= */}

          <section
            className={`rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Service Availability</h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Availability over the last 30 days
                </p>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-[10px] font-bold text-green-500">
                99.9% Uptime
              </span>
            </div>

            <div className="space-y-3">
              <AvailabilityRow
                name="Backend API"
                uptime="99.99%"
                darkMode={darkMode}
              />

              <AvailabilityRow
                name="MongoDB"
                uptime="99.98%"
                darkMode={darkMode}
              />

              <AvailabilityRow
                name="AI / ML Service"
                uptime="99.94%"
                darkMode={darkMode}
              />

              <AvailabilityRow
                name="Weather API"
                uptime="99.87%"
                darkMode={darkMode}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

/* ================================================= */
/* SERVICE CARD */
/* ================================================= */

const ServiceCard = ({
  icon,
  title,
  description,
  status,
  response,
  iconColor,
  iconBg,
  darkMode,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-xl transition hover:-translate-y-0.5 ${
        darkMode
          ? "border-white/10 bg-[#0f241b] hover:bg-[#143326]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[9px] font-bold text-green-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Online
        </span>
      </div>

      <h3 className="mt-4 text-sm font-bold">{title}</h3>

      <p className="mt-1 text-[10px] text-slate-400">{description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] text-slate-400">Status</p>

          <p className="mt-1 text-xs font-semibold text-green-500">{status}</p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-slate-400">Response</p>

          <p className="mt-1 text-xs font-semibold">{response}</p>
        </div>
      </div>
    </div>
  );
};

/* ================================================= */
/* RESOURCE BAR */
/* ================================================= */

const ResourceBar = ({ icon, title, value, percentage, color }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{icon}</span>

          <span className="text-xs font-semibold">{title}</span>
        </div>

        <span className="text-xs font-bold">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-[#07140f]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: percentage,
          }}
        />
      </div>
    </div>
  );
};

/* ================================================= */
/* SERVER INFO */
/* ================================================= */

const ServerInfo = ({ label, value }) => {
  return (
    <div>
      <p className="text-[9px] text-slate-400">{label}</p>

      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
};

/* ================================================= */
/* SYSTEM EVENT */
/* ================================================= */

const SystemEvent = ({ title, time, type, darkMode }) => {
  const isWarning = type === "warning";

  return (
    <div
      className={`flex gap-3 rounded-xl border p-3 ${
        darkMode
          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`mt-0.5 ${isWarning ? "text-orange-500" : "text-green-500"}`}
      >
        {isWarning ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold">{title}</p>

        <p className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
          <Clock3 size={10} />
          {time}
        </p>
      </div>
    </div>
  );
};

/* ================================================= */
/* AVAILABILITY */
/* ================================================= */

const AvailabilityRow = ({ name, uptime, darkMode }) => {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-3 ${
        darkMode
          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />

        <span className="text-xs font-semibold">{name}</span>
      </div>

      <div className="ml-auto hidden flex-1 md:block">
        <div className="flex gap-1">
          {Array.from({ length: 30 }).map((_, index) => (
            <span
              key={index}
              className="h-5 flex-1 rounded-sm bg-green-500/70"
            />
          ))}
        </div>
      </div>

      <span className="text-xs font-bold text-green-500">{uptime}</span>
    </div>
  );
};

export default SystemStatus;
