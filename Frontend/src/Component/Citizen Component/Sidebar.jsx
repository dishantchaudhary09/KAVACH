import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Map,
  Route,
  AlertTriangle,
  FileText,
  Bot,
  User,
  LogOut,
  X,
  PhoneCall,
} from "lucide-react";

const CitizenSidebar = ({
  isOpen,
  setIsOpen,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
}) => {
  const navigate = useNavigate();

  const open = isOpen ?? sidebarOpen ?? false;
  const setOpen = setIsOpen ?? setSidebarOpen ?? (() => {});

  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/citizen/dashboard",
    },
    {
      name: "Risk Map",
      icon: Map,
      path: "/citizen/risk-map",
    },
    {
      name: "Road Status",
      icon: Route,
      path: "/citizen/roads",
    },
    {
      name: "Report Incident",
      icon: FileText,
      path: "/citizen/report",
    },
    {
      name: "Alerts",
      icon: AlertTriangle,
      path: "/citizen/alerts",
    },
    {
      name: "My Reports",
      icon: FileText,
      path: "/citizen/reports",
    },
    {
      name: "AI Assistant",
      icon: Bot,
      path: "/citizen/assistant",
    },
    {
      name: "Profile",
      icon: User,
      path: "/citizen/profile",
    },
    {
      name: "Emergency",
      icon: PhoneCall,
      path: "/citizen/emergency",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/citizen/login", {
      replace: true,
    });
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-[68px]
          bottom-0
          z-50
          w-60
          border-r
          transition-transform
          duration-300
          ${
            darkMode
              ? "border-white/10 bg-[#0b1c15]"
              : "border-gray-200 bg-white"
          }
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* =================================================
            MOBILE HEADER
        ================================================= */}

        <div className="flex items-center justify-between px-4 py-3 lg:hidden">
          <div>
            <p
              className={`text-[10px] font-medium ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Citizen Portal
            </p>

            <p className="text-sm font-bold">Navigation</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="space-y-1 px-3 py-2 md:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? darkMode
                        ? "bg-green-900/40 text-green-400 shadow-sm"
                        : "bg-green-50 text-green-700 shadow-sm"
                      : darkMode
                        ? "text-gray-400 hover:bg-white/5 hover:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />

                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div
            className={`my-4 border-t ${
              darkMode ? "border-white/10" : "border-gray-200"
            }`}
          />

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={handleLogout}
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              transition-all
              duration-200

              ${
                darkMode
                  ? "text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }
            `}
          >
            <LogOut size={18} className="shrink-0" />

            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default CitizenSidebar;
