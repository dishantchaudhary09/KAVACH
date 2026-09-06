import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  LayoutDashboard,
  Map,
  FileText,
  AlertTriangle,
  Route,
  Users,
  Activity,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Bot,
  UserPlus,
} from "lucide-react";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const darkMode = useSelector((state) => state.theme.darkMode);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Risk Map",
      path: "/admin/risk-map",
      icon: Map,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: FileText,
    },
    {
      name: "Alerts",
      path: "/admin/alerts",
      icon: AlertTriangle,
    },
    {
      name: "Road Status",
      path: "/admin/roads",
      icon: Route,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "AI / ML Monitoring",
      path: "/admin/ml",
      icon: Bot,
    },
    {
      name: "System Status",
      path: "/admin/system",
      icon: Activity,
    },
  ];

  const managementItems = [
    {
      name: "Admin Management",
      path: "/admin/management",
      icon: UserPlus,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);

    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[250px]
          flex-col
          border-r
          transition-transform
          duration-300
          lg:translate-x-0

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

          ${
            darkMode
              ? "border-white/10 bg-[#081710] text-white"
              : "border-gray-200 bg-white text-gray-900"
          }
        `}
      >
        {/* ================= SIDEBAR HEADER ================= */}

        <div
          className={`
            flex
            h-[68px]
            items-center
            justify-between
            border-b
            px-5

            ${darkMode ? "border-white/10" : "border-gray-200"}
          `}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
              <ShieldCheck size={20} className="text-white" />
            </div>

            <div>
              <p className="text-sm font-bold">Admin Panel</p>

              <p
                className={`
                  text-[9px]
                  ${darkMode ? "text-slate-500" : "text-gray-400"}
                `}
              >
                Control Center
              </p>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* ================= MENU ================= */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {/* MAIN */}

          <p
            className={`
              mb-2
              px-3
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              ${darkMode ? "text-slate-600" : "text-gray-400"}
            `}
          >
            Main Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    transition

                    ${
                      active
                        ? darkMode
                          ? "bg-green-500/10 text-green-400"
                          : "bg-green-50 text-green-700"
                        : darkMode
                          ? "text-slate-400 hover:bg-white/5 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {/* Active line */}

                  {active && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-green-500" />
                  )}

                  <Icon size={18} className={active ? "text-green-500" : ""} />

                  <span className="text-xs font-medium">{item.name}</span>

                  {/* Alerts Count */}

                  {item.name === "Alerts" && (
                    <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                      3
                    </span>
                  )}

                  {/* Reports Count */}

                  {item.name === "Reports" && (
                    <span className="ml-auto rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[8px] font-bold text-orange-400">
                      8
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ================= MANAGEMENT ================= */}

          <p
            className={`
              mb-2
              mt-7
              px-3
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              ${darkMode ? "text-slate-600" : "text-gray-400"}
            `}
          >
            Management
          </p>

          <nav className="space-y-1">
            {managementItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    transition

                    ${
                      active
                        ? darkMode
                          ? "bg-green-500/10 text-green-400"
                          : "bg-green-50 text-green-700"
                        : darkMode
                          ? "text-slate-400 hover:bg-white/5 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {/* Active line */}

                  {active && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-green-500" />
                  )}

                  <Icon size={18} className={active ? "text-green-500" : ""} />

                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================= BOTTOM ================= */}

        <div
          className={`
            border-t
            p-3
            ${darkMode ? "border-white/10" : "border-gray-200"}
          `}
        >
          {/* Admin Info */}

          <div
            className={`
              mb-2
              flex
              items-center
              gap-3
              rounded-xl
              p-3
              ${darkMode ? "bg-white/5" : "bg-gray-50"}
            `}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Administrator</p>

              <p
                className={`
                  truncate
                  text-[9px]
                  ${darkMode ? "text-slate-500" : "text-gray-400"}
                `}
              >
                System Manager
              </p>
            </div>
          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-red-400
              transition
              hover:bg-red-500/10
            "
          >
            <LogOut size={18} />

            <span className="text-xs font-semibold">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
