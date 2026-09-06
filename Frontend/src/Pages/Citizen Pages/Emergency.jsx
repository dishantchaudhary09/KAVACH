import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";
import {
  Phone,
  MapPin,
  ShieldAlert,
  Ambulance,
  Flame,
  ShieldCheck,
  HeartPulse,
  Mountain,
  Baby,
  UserRound,
  Car,
  Search,
  AlertTriangle,
  Info,
} from "lucide-react";

const Emergency = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // User selected state
  const [selectedState, setSelectedState] = useState("Mizoram");

  // Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // =====================================================
  // NATIONAL EMERGENCY NUMBERS
  // =====================================================

  const nationalNumbers = [
    {
      title: "National Emergency",
      number: "112",
      description: "Police, Fire & Rescue and Medical emergency",
      icon: <ShieldAlert />,
      style: "red",
    },
    {
      title: "Police",
      number: "100",
      description: "Police emergency assistance",
      icon: <ShieldCheck />,
      style: "blue",
    },
    {
      title: "Ambulance",
      number: "108",
      description: "Emergency medical ambulance",
      icon: <Ambulance />,
      style: "red",
    },
    {
      title: "Fire & Rescue",
      number: "101",
      description: "Fire and rescue emergency",
      icon: <Flame />,
      style: "orange",
    },
    {
      title: "Women Helpline",
      number: "181",
      description: "Women support and assistance",
      icon: <UserRound />,
      style: "purple",
    },
    {
      title: "Child Helpline",
      number: "1098",
      description: "Emergency support for children",
      icon: <Baby />,
      style: "cyan",
    },
    {
      title: "Health Helpline",
      number: "104",
      description: "Health-related assistance",
      icon: <HeartPulse />,
      style: "green",
    },
    {
      title: "Road Accident",
      number: "1073",
      description: "Road accident emergency assistance",
      icon: <Car />,
      style: "yellow",
    },
  ];

  // =====================================================
  // STATE DATA
  // =====================================================

  const stateData = {
    "Uttar Pradesh": {
      disaster: "1070",
      police: "112",
      description: "State disaster and emergency assistance for Uttar Pradesh.",
    },

    Mizoram: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Mizoram.",
    },

    Sikkim: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Sikkim.",
    },

    "Arunachal Pradesh": {
      disaster: "1070",
      police: "112",
      description:
        "Disaster management and emergency assistance for Arunachal Pradesh.",
    },

    Assam: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Assam.",
    },

    Meghalaya: {
      disaster: "1070",
      police: "112",
      description:
        "Disaster management and emergency assistance for Meghalaya.",
    },

    Manipur: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Manipur.",
    },

    Nagaland: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Nagaland.",
    },

    Tripura: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Tripura.",
    },

    "West Bengal": {
      disaster: "1070",
      police: "112",
      description:
        "Disaster management and emergency assistance for West Bengal.",
    },

    Bihar: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Bihar.",
    },

    Jharkhand: {
      disaster: "1070",
      police: "112",
      description:
        "Disaster management and emergency assistance for Jharkhand.",
    },

    Odisha: {
      disaster: "1070",
      police: "112",
      description: "Disaster management and emergency assistance for Odisha.",
    },
  };

  const currentState = stateData[selectedState] || stateData["Mizoram"];

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNumbers = useMemo(() => {
    return nationalNumbers.filter((item) =>
      `${item.title} ${item.number} ${item.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <CitizenNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="pt-[68px] md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Phone className="h-5 w-5 text-red-500" />
              </div>

              <span className="text-sm font-semibold text-red-500">
                EMERGENCY SERVICES
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Emergency Assistance
            </h1>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Find important emergency contacts for your state and access help
              quickly.
            </p>
          </div>

          {/* ================================================= */}
          {/* EMERGENCY WARNING */}
          {/* ================================================= */}

          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-5">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 shrink-0 text-red-500" />

              <div>
                <h2 className="text-sm font-bold text-red-500">
                  In case of immediate danger
                </h2>

                <p
                  className={`mt-1 text-xs sm:text-sm ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Move to a safe location and call the appropriate emergency
                  service. For immediate multi-service emergency assistance,
                  call <strong>112</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* STATE SELECTOR */}
          {/* ================================================= */}

          <section
            className={`rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              {/* State */}

              <div className="flex-1">
                <label className="mb-2 block text-xs font-bold text-slate-500">
                  YOUR STATE
                </label>

                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                    size={18}
                  />

                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={`w-full appearance-none rounded-xl border py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-green-500 ${
                      darkMode
                        ? "border-white/10 bg-[#07140f] text-white"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {Object.keys(stateData).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current state */}

              <div
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 lg:min-w-[320px] ${
                  darkMode
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <MapPin className="text-green-500" size={20} />

                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">
                    Selected Location
                  </p>

                  <p className="text-sm font-bold">{selectedState}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* STATE SPECIFIC */}
          {/* ================================================= */}

          <section
            className={`mt-5 rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <Mountain className="text-green-500" size={21} />

                <h2 className="text-lg font-bold">
                  {selectedState} Emergency Contacts
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {currentState.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EmergencyCard
                title="Disaster Management"
                number={currentState.disaster}
                description={`State disaster assistance for ${selectedState}`}
                icon={<Mountain />}
                darkMode={darkMode}
                primary
              />

              <EmergencyCard
                title="Emergency / Police"
                number={currentState.police}
                description="Immediate emergency and police assistance"
                icon={<ShieldAlert />}
                darkMode={darkMode}
                primary
              />
            </div>
          </section>

          {/* ================================================= */}
          {/* NATIONAL NUMBERS */}
          {/* ================================================= */}

          <section className="mt-5">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  Important Emergency Numbers
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  National helplines available across India.
                </p>
              </div>

              {/* Search */}

              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Search emergency service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs outline-none focus:border-green-500 ${
                    darkMode
                      ? "border-white/10 bg-[#07140f] text-white placeholder:text-slate-600"
                      : "border-slate-200 bg-white"
                  }`}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredNumbers.map((item) => (
                <EmergencyCard
                  key={item.title}
                  title={item.title}
                  number={item.number}
                  description={item.description}
                  icon={item.icon}
                  darkMode={darkMode}
                  style={item.style}
                />
              ))}
            </div>
          </section>

          {/* ================================================= */}
          {/* LANDSLIDE SAFETY */}
          {/* ================================================= */}

          <section
            className={`mt-5 rounded-2xl border p-5 shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0f241b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                <Mountain className="text-green-500" size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold">
                  Landslide Emergency Safety
                </h2>

                <ul className="mt-3 space-y-2 text-xs text-slate-500">
                  <li>• Move away from steep slopes and unstable ground.</li>

                  <li>• Follow official evacuation instructions.</li>

                  <li>• Do not cross blocked or damaged roads.</li>

                  <li>
                    • Stay away from rivers and drainage channels during heavy
                    rainfall.
                  </li>

                  <li>
                    • Call <strong>112</strong> for immediate emergency
                    assistance.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* DISCLAIMER */}
          {/* ================================================= */}

          <div className="mt-5 flex items-start gap-2 px-1">
            <Info size={15} className="mt-0.5 shrink-0 text-slate-500" />

            <p className="text-[10px] leading-relaxed text-slate-500">
              Emergency contact information should be verified with official
              government sources before deployment. Availability and numbers may
              vary by state or service.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ================================================= */
/* EMERGENCY CARD */
/* ================================================= */

const EmergencyCard = ({
  title,
  number,
  description,
  icon,
  darkMode,
  primary = false,
}) => {
  return (
    <div
      className={`group rounded-2xl border p-4 shadow-lg transition hover:-translate-y-0.5 ${
        darkMode
          ? "border-white/10 bg-[#0f241b] hover:border-green-500/30 hover:bg-[#143326]"
          : "border-slate-200 bg-white hover:border-green-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
          {React.cloneElement(icon, {
            size: 21,
          })}
        </div>

        {primary && (
          <span className="rounded-full bg-green-500/10 px-2 py-1 text-[9px] font-bold text-green-500">
            STATE SERVICE
          </span>
        )}
      </div>

      <h3 className="mt-4 text-sm font-bold">{title}</h3>

      <p className="mt-1 min-h-[32px] text-xs text-slate-500">{description}</p>

      {/* CALL BUTTON */}

      <a
        href={`tel:${number}`}
        className="mt-4 flex items-center justify-between rounded-xl bg-green-600 px-4 py-3 text-white transition hover:bg-green-700"
      >
        <div>
          <p className="text-[9px] font-medium uppercase opacity-80">
            Call Now
          </p>

          <p className="text-lg font-bold tracking-wide">{number}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
          <Phone size={18} />
        </div>
      </a>
    </div>
  );
};

export default Emergency;
