import { useState } from "react";
import { useSelector } from "react-redux";

import {
  Brain,
  Activity,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Database,
  Cpu,
  Clock3,
  RefreshCw,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";

import AdminNavbar from "../../Component/Admin Component/Navbar.jsx";
import AdminSidebar from "../../Component/Admin Component/Sidebar.jsx";

const AIMLMonitoring = () => {
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
                <Brain size={25} className="text-purple-500" />

                <h1 className="text-xl font-bold sm:text-2xl">
                  AI / ML Monitoring
                </h1>
              </div>

              <p
                className={`mt-1 text-xs sm:text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Monitor AI predictions, model performance and risk detection.
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
                bg-purple-600
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-purple-700
              "
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh Model
            </button>
          </div>

          {/* ================= MODEL STATUS ================= */}

          <section
            className={`mb-5 rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                  <Brain size={28} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">
                      Landslide Prediction Model
                    </h2>

                    <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold text-green-500">
                      <CheckCircle2 size={11} />
                      ONLINE
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Model Version: v2.4.1
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <ModelInfo
                  label="Model Type"
                  value="Random Forest"
                  darkMode={darkMode}
                />

                <ModelInfo
                  label="Last Trained"
                  value="08 May 2026"
                  darkMode={darkMode}
                />

                <ModelInfo
                  label="Status"
                  value="Healthy"
                  valueColor="text-green-500"
                  darkMode={darkMode}
                />
              </div>
            </div>
          </section>

          {/* ================= STATS ================= */}

          <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MLStat
              icon={<Activity />}
              value="94.7%"
              title="Model Accuracy"
              iconBg="bg-green-500/10"
              iconColor="text-green-500"
              trend="+2.1%"
              darkMode={darkMode}
            />

            <MLStat
              icon={<Brain />}
              value="12,486"
              title="Predictions Today"
              iconBg="bg-purple-500/10"
              iconColor="text-purple-500"
              trend="+8.4%"
              darkMode={darkMode}
            />

            <MLStat
              icon={<AlertTriangle />}
              value="127"
              title="High Risk Predictions"
              iconBg="bg-red-500/10"
              iconColor="text-red-500"
              trend="+12"
              darkMode={darkMode}
            />

            <MLStat
              icon={<Database />}
              value="98.2%"
              title="Data Quality"
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
              trend="+0.8%"
              darkMode={darkMode}
            />
          </div>

          {/* ================= PERFORMANCE ================= */}

          <div className="mb-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            {/* MODEL PERFORMANCE */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Model Performance</h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Current AI model evaluation metrics
                  </p>
                </div>

                <BarChart3 size={22} className="text-purple-500" />
              </div>

              <div className="space-y-5">
                <ProgressMetric
                  title="Accuracy"
                  value="94.7%"
                  progress="94.7%"
                  color="bg-green-500"
                  darkMode={darkMode}
                />

                <ProgressMetric
                  title="Precision"
                  value="92.8%"
                  progress="92.8%"
                  color="bg-blue-500"
                  darkMode={darkMode}
                />

                <ProgressMetric
                  title="Recall"
                  value="91.4%"
                  progress="91.4%"
                  color="bg-purple-500"
                  darkMode={darkMode}
                />

                <ProgressMetric
                  title="F1 Score"
                  value="92.1%"
                  progress="92.1%"
                  color="bg-orange-500"
                  darkMode={darkMode}
                />
              </div>
            </section>

            {/* SYSTEM HEALTH */}

            <section
              className={`rounded-2xl border p-5 shadow-xl ${
                darkMode
                  ? "border-white/10 bg-[#0f241b]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5 flex items-center gap-2">
                <Cpu size={21} className="text-blue-500" />

                <h2 className="text-lg font-bold">System Health</h2>
              </div>

              <div className="space-y-4">
                <HealthItem
                  title="ML API"
                  value="Operational"
                  icon={<CheckCircle2 />}
                  color="text-green-500"
                  darkMode={darkMode}
                />

                <HealthItem
                  title="Prediction Engine"
                  value="Operational"
                  icon={<CheckCircle2 />}
                  color="text-green-500"
                  darkMode={darkMode}
                />

                <HealthItem
                  title="Weather Data"
                  value="Connected"
                  icon={<CheckCircle2 />}
                  color="text-green-500"
                  darkMode={darkMode}
                />

                <HealthItem
                  title="Database"
                  value="Operational"
                  icon={<CheckCircle2 />}
                  color="text-green-500"
                  darkMode={darkMode}
                />

                <HealthItem
                  title="Model Training"
                  value="Not Running"
                  icon={<XCircle />}
                  color="text-slate-400"
                  darkMode={darkMode}
                />
              </div>
            </section>
          </div>

          {/* ================= PREDICTIONS ================= */}

          <section
            className={`mb-5 rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Recent AI Predictions</h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest predictions generated by the model
                </p>
              </div>

              <Activity size={21} className="text-purple-500" />
            </div>

            <div className="space-y-3">
              <Prediction
                location="Aizawl, Mizoram"
                risk="High"
                score="91%"
                rainfall="78 mm"
                time="10:32 AM"
                darkMode={darkMode}
              />

              <Prediction
                location="Kohima, Nagaland"
                risk="Medium"
                score="67%"
                rainfall="52 mm"
                time="10:25 AM"
                darkMode={darkMode}
              />

              <Prediction
                location="Gangtok, Sikkim"
                risk="Low"
                score="24%"
                rainfall="18 mm"
                time="10:17 AM"
                darkMode={darkMode}
              />

              <Prediction
                location="Shillong, Meghalaya"
                risk="High"
                score="87%"
                rainfall="72 mm"
                time="10:05 AM"
                darkMode={darkMode}
              />
            </div>
          </section>

          {/* ================= AI ALERT ================= */}

          <section
            className={`rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-orange-500/20 bg-orange-500/5"
                : "border-orange-200 bg-orange-50"
            }`}
          >
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h3 className="text-sm font-bold">AI Monitoring Alert</h3>

                <p className="mt-1 text-xs text-slate-400">
                  Increased high-risk predictions detected in Aizawl and
                  Shillong during the last 60 minutes. Consider reviewing the
                  affected risk zones.
                </p>

                <div className="mt-3 flex items-center gap-2 text-[10px] text-orange-500">
                  <Clock3 size={12} />
                  Detected 8 minutes ago
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

/* ================= STAT ================= */

const MLStat = ({ icon, value, title, iconBg, iconColor, trend, darkMode }) => {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-xl ${
        darkMode ? "border-white/10 bg-[#0f241b]" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xl font-bold">{value}</p>

          <p className="text-[10px] text-slate-400">{title}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[10px] text-green-500">
        <TrendingUp size={12} />
        {trend} from previous period
      </div>
    </div>
  );
};

/* ================= MODEL INFO ================= */

const ModelInfo = ({ label, value, valueColor = "", darkMode }) => {
  return (
    <div>
      <p className="text-[9px] text-slate-400">{label}</p>

      <p
        className={`mt-1 text-xs font-bold ${
          valueColor || (darkMode ? "text-white" : "text-slate-900")
        }`}
      >
        {value}
      </p>
    </div>
  );
};

/* ================= PROGRESS ================= */

const ProgressMetric = ({ title, value, progress, color, darkMode }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold">{title}</span>

        <span className="text-xs font-bold">{value}</span>
      </div>

      <div
        className={`h-2 overflow-hidden rounded-full ${
          darkMode ? "bg-[#07140f]" : "bg-slate-200"
        }`}
      >
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: progress }}
        />
      </div>
    </div>
  );
};

/* ================= HEALTH ================= */

const HealthItem = ({ title, value, icon, color, darkMode }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-3 ${
        darkMode
          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={color}>{icon}</div>

        <span className="text-xs font-semibold">{title}</span>
      </div>

      <span className={`text-[10px] font-bold ${color}`}>{value}</span>
    </div>
  );
};

/* ================= PREDICTION ================= */

const Prediction = ({ location, risk, score, rainfall, time, darkMode }) => {
  const riskStyle = {
    High: "bg-red-500/10 text-red-500",
    Medium: "bg-orange-500/10 text-orange-500",
    Low: "bg-green-500/10 text-green-500",
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between ${
        darkMode
          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
          <Brain size={19} />
        </div>

        <div>
          <h3 className="text-xs font-bold">{location}</h3>

          <p className="mt-1 text-[10px] text-slate-400">
            Rainfall: {rainfall}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div>
          <p className="text-[9px] text-slate-400">Prediction</p>

          <span
            className={`mt-1 inline-block rounded-full px-2 py-1 text-[9px] font-bold ${riskStyle[risk]}`}
          >
            {risk} Risk
          </span>
        </div>

        <div>
          <p className="text-[9px] text-slate-400">Confidence</p>

          <p className="mt-1 text-xs font-bold">{score}</p>
        </div>

        <div>
          <p className="text-[9px] text-slate-400">Time</p>

          <p className="mt-1 flex items-center gap-1 text-xs font-semibold">
            <Clock3 size={12} />
            {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIMLMonitoring;
